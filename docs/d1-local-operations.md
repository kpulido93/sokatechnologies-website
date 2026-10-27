# Operación local de Cloudflare D1 para evidencia de consentimiento

**Estado:** validado exclusivamente en local; **NO-GO** para tratamiento real.

**Alcance:** preparar y verificar el almacenamiento de `consent_evidence` con Wrangler/D1 local, sin crear una base D1 remota, desplegar el Worker ni enviar correos reales.

Documentación relacionada: [`docs/consent-evidence.md`](./consent-evidence.md), [`05_Gestion_Datos_Personales.md`](https://github.com/kpulido93/sokatechnologies-docs/blob/main/docs/procesos/05_Gestion_Datos_Personales.md) y [`06_Cierre_Privacidad_Leads_Colombia.md`](https://github.com/kpulido93/sokatechnologies-docs/blob/main/docs/procesos/06_Cierre_Privacidad_Leads_Colombia.md).

## 1. Arquitectura y aislamiento

```text
worker/wrangler.local.toml
        └── CONSENT_DB → D1 local de Wrangler/Miniflare
                              └── SQLite persistente en SSD

scripts/d1-local-integration.mjs
        ├── ejecuta la lógica del Worker con un adaptador D1 local compatible
        ├── simula Turnstile y Resend en memoria
        └── consulta por request_id y reabre la base para comprobar persistencia
```

Archivos versionados de esta preparación:

- `worker/wrangler.local.toml`: configuración local aislada. Solo declara el binding `CONSENT_DB`, `database_name` local y `migrations_dir`; no contiene `database_id`.
- `worker/0001_consent_evidence.sql`: migración existente, aplicada con `--local`.
- `scripts/d1-local-integration.mjs`: prueba de integración de la lógica del Worker contra el archivo SQLite persistente que Wrangler crea para D1 local. Usa datos sintéticos y proveedores simulados.
- `scripts/request-id-validation.test.sh`: prueba de la validación completa de UUID v4, incluidos intentos de inyección SQL.
- `docs/d1-local-operations.md`: este procedimiento.

El worktree y la persistencia de esta tarea se ubicaron en:

```text
/srv/fast-storage/labs/sokatechnologies-website/d1-local/
├── repo/          # clon de trabajo en SSD
├── state/         # persistencia local Wrangler/D1; no es parte de Git
├── npm-cache/     # caché temporal de dependencias en SSD
└── state-backups/ # respaldos locales de prueba; no es parte de Git
```

La ruta inicialmente propuesta `/srv/fast-storage/soka-web/d1-local/` fue rechazada por el preflight de almacenamiento porque no pertenece a una raíz de laboratorio permitida. No se creó ni se usó.

La base local se encuentra bajo `state/v3/d1/miniflare-D1DatabaseObject/`. Sus archivos SQLite, WAL, metadatos y respaldos pueden contener evidencias locales; no deben copiarse al repositorio, a `public/`, a logs ni a un artefacto de despliegue.

## 2. Preflight y dependencias

Ejecutar el preflight antes de crear una ruta nueva. En un laboratorio ya creado:

```bash
LAB_ROOT=/srv/fast-storage/labs/sokatechnologies-website/d1-local
REPO_ROOT=$LAB_ROOT/repo
STATE_ROOT=$LAB_ROOT/state
NPM_CACHE=$LAB_ROOT/npm-cache

/usr/local/sbin/soka-lab-ssd-preflight "$LAB_ROOT" \
  --git-path "$REPO_ROOT" \
  --persist-path "$STATE_ROOT" \
  --persist-path "$NPM_CACHE"
```

El resultado esperado incluye `SOKA_LAB_STORAGE=PASS`, el UUID SSD autorizado y `target` bajo `/srv/fast-storage`. Si falla, no crear rutas ni continuar.

Instalar dependencias del proyecto únicamente en el worktree SSD:

```bash
cd "$REPO_ROOT"
npm ci --ignore-scripts --cache "$NPM_CACHE"
NPM_CONFIG_CACHE="$NPM_CACHE" npx --yes wrangler@4.153.0 --version
```

Durante esta tarea se observaron activos, sin modificarlos, los contenedores locales de los puertos 8091, 8092 y 8093. No se ejecutó `docker build`, Compose, despliegue ni cambio de configuración Docker.

## 3. Configuración local de Wrangler

`worker/wrangler.local.toml` es deliberadamente independiente de `worker/wrangler.toml`:

```toml
name = "soka-leads-worker-local"
main = "src/index.mjs"
compatibility_date = "2026-10-20"
send_metrics = false

[[d1_databases]]
binding = "CONSENT_DB"
database_name = "soka-consent-evidence-local"
migrations_dir = "."
```

Reglas de aislamiento:

- Toda operación D1 de esta guía lleva `--local` y `--persist-to "$STATE_ROOT"`.
- No se usa `--remote`, `wrangler d1 create`, un `database_id` real ni un binding remoto.
- No se añade el binding a `worker/wrangler.toml`.
- `send_metrics = false` evita telemetría de Wrangler desde esta configuración local.
- La configuración no contiene claves Turnstile, Resend ni HMAC.

## 4. Migración y comprobaciones D1

Aplicar la migración existente:

```bash
NPM_CONFIG_CACHE="$NPM_CACHE" npx --yes wrangler@4.153.0 d1 execute CONSENT_DB \
  --config worker/wrangler.local.toml \
  --local \
  --persist-to "$STATE_ROOT" \
  --file worker/0001_consent_evidence.sql \
  --yes
```

La salida debe indicar `Resource location: local` y no mostrar una operación remota. Comprobar tabla y restricciones:

```bash
NPM_CONFIG_CACHE="$NPM_CACHE" npx --yes wrangler@4.153.0 d1 execute CONSENT_DB \
  --config worker/wrangler.local.toml \
  --local \
  --persist-to "$STATE_ROOT" \
  --command "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name = 'consent_evidence'" \
  --json

NPM_CONFIG_CACHE="$NPM_CACHE" npx --yes wrangler@4.153.0 d1 execute CONSENT_DB \
  --config worker/wrangler.local.toml \
  --local \
  --persist-to "$STATE_ROOT" \
  --command "PRAGMA index_list('consent_evidence')" \
  --json
```

La migración define:

- `event_id` como clave primaria.
- `request_id` único.
- `idempotency_key_hash` único.
- Restricciones `CHECK` para formularios, finalidades, consentimiento y estados.
- Índice de consulta por `request_id`.

La prueba `scripts/d1-local-integration.mjs` inserta una evidencia sintética mediante la lógica del Worker, simula aceptación HTTP 200 de Resend, consulta el evento por el hash de idempotencia, confirma que la notificación contiene el `request_id`, reintenta la misma solicitud sin una segunda llamada a Resend y reabre la base para comprobar persistencia. Cada ejecución genera claves de idempotencia sintéticas únicas; no borra la tabla global.

Ejecutarla así:

```bash
D1_LOCAL_HMAC_KEY="$(node -e 'console.log(require("node:crypto").randomBytes(32).toString("hex"))')" \
  D1_LOCAL_PERSIST_PATH="$STATE_ROOT" node scripts/d1-local-integration.mjs
```

Ejecutar el mismo comando una segunda vez sin borrar `STATE_ROOT`. La salida debe mostrar un aumento de dos filas por ejecución: una evidencia aceptada y otra usada para probar la reconciliación. Las filas de la ejecución anterior deben permanecer y sus claves de idempotencia no deben reutilizarse.

La prueba también ejercita sobre el SQLite persistente las transiciones `evidence_recorded → resend_dispatching → resend_uncertain`, bloquea una reclamación automática, reconcilia a `resend_error` y comprueba que solo después de la reconciliación vuelve a ser reclamable. Todos los valores son sintéticos.

## 5. Fidelidad y límites del entorno local

Hay dos niveles distintos de validación:

- `wrangler d1 execute --local --persist-to "$STATE_ROOT"` crea y conserva el archivo SQLite local de D1 y aplica la migración real.
- `scripts/d1-local-integration.mjs` abre ese archivo con `node:sqlite` y le proporciona al Worker un adaptador con la interfaz D1 mínima (`prepare`, `bind`, `first`, `run`). Esto prueba la persistencia SQLite creada por Wrangler, las consultas, restricciones y transiciones del almacenamiento, además de la lógica del Worker con Turnstile/Resend simulados.

Esta integración no ejecuta el Worker dentro del runtime de `wrangler dev` ni prueba el binding nativo `env.CONSENT_DB` en una solicitud HTTP del runtime. El directorio `state/v3/d1/miniflare-D1DatabaseObject/` y el archivo SQLite interno son detalles de implementación de Wrangler `4.153.0`; pueden cambiar al actualizar Wrangler. Si cambia la estructura, la prueba debe fallar de forma visible y el adaptador debe revisarse antes de continuar.

Una prueba futura del binding nativo podría levantar `wrangler dev --local` con interceptores locales para Turnstile y Resend, pero no se incorpora aquí: requeriría mantener un proceso HTTP adicional y un punto de inyección de proveedores aprobado, sin aportar cobertura necesaria para la preparación local actual.

## 6. Consulta interna por `request_id`

La consulta es administrativa, local y de acceso restringido. No existe un endpoint HTTP público para leer, exportar o borrar evidencias.

1. Obtener el `request_id` desde la notificación interna o el registro privado del fundador.
2. Validar que sea un UUID generado por el servidor antes de incorporarlo a una consulta; no pegar mensajes completos ni datos del titular en la shell.
3. Consultar únicamente las columnas mínimas:

```bash
REQUEST_ID='[request-id-uuid]'

if [[ ! "$REQUEST_ID" =~ ^[[:xdigit:]]{8}-[[:xdigit:]]{4}-4[[:xdigit:]]{3}-[89aAbB][[:xdigit:]]{3}-[[:xdigit:]]{12}$ ]]; then
  echo "request_id inválido" >&2
  exit 1
fi

NPM_CONFIG_CACHE="$NPM_CACHE" npx --yes wrangler@4.153.0 d1 execute CONSENT_DB \
  --config worker/wrangler.local.toml \
  --local \
  --persist-to "$STATE_ROOT" \
  --command "SELECT request_id, form_type, notice_version, authorization_version, purpose, accepted, technical_status, created_at, updated_at FROM consent_evidence WHERE request_id = '$REQUEST_ID'" \
  --json
```

El ejemplo usa un marcador y no una evidencia real. En una operación futura, el fundador debe ejecutar la consulta desde una cuenta de sistema protegida, restringir permisos del directorio local y evitar guardar la salida en Git, HTML o logs compartidos.

Probar la validación antes de usar una consulta:

```bash
bash scripts/request-id-validation.test.sh
```

La prueba acepta únicamente un UUID v4 completo y rechaza vacío, formato incorrecto, espacios, otras versiones, variantes no permitidas y el intento sintético `aa' OR 1=1 --`. La validación ocurre antes de interpolar el identificador en el comando SQL; una futura herramienta administrativa deberá preferir parámetros enlazados.

## 7. Estados inciertos y recuperación operativa

No reenviar automáticamente cuando el registro esté en:

- `resend_dispatching`: otro proceso pudo tener el derecho de despacho o el resultado pudo no persistirse.
- `resend_uncertain`: una falla de red o respuesta ambigua pudo dejar el correo procesándose en Resend.

Procedimiento interno:

1. Consultar el registro por `request_id` y conservar `technical_status`.
2. Revisar evidencia interna verificable del proveedor sin afirmar entrega al buzón.
3. Mantener el estado incierto mientras no exista una reconciliación confiable.
4. Reconciliar internamente a `resend_accepted` si existe confirmación suficiente, o a `resend_error` si el rechazo es definitivo.
5. Solo después de `resend_error` y una solicitud explícita se puede evaluar un nuevo despacho.
6. Registrar responsable, fecha, evidencia y decisión; no copiar el contenido del lead.

La migración y el adaptador impiden que un `resend_uncertain` sea reclamado automáticamente. La reconciliación real debe contar con autenticación, autorización del fundador y revisión jurídica de retención/supresión antes de existir en una herramienta administrativa.

## 8. HMAC y continuidad de evidencias

La prueba local recibe una clave aleatoria sintética mediante `D1_LOCAL_HMAC_KEY` y solo la mantiene en memoria del proceso. No se guarda en Git, HTML, archivos de estado, logs ni resultados de prueba. La suite existente comprueba que la ausencia de `CONSENT_EVIDENCE_HMAC_KEY` bloquea `required` antes de persistir o enviar.

Comportamiento esperado:

- La misma solicitud normalizada y la misma clave producen la misma huella HMAC.
- Un cambio de contenido produce una huella diferente y conflicto de idempotencia.
- El HMAC no permite reconstruir el contenido de la solicitud y D1 no almacena los campos del lead en claro.
- La clave no debe transmitirse en el formulario ni en una notificación.

### Gestión futura del secreto

Con aprobación explícita, el responsable de la cuenta deberá crear el secreto en el entorno Cloudflare correcto mediante el mecanismo oficial de secretos, sin escribir el valor en un archivo ni mostrarlo en la terminal. La operación remota futura será equivalente a:

```bash
# SOLO FUTURO, NO EJECUTAR EN ESTA TAREA.
# Requiere aprobación de seguridad, jurídica y de despliegue.
npx wrangler secret put CONSENT_EVIDENCE_HMAC_KEY --config worker/wrangler.toml --env <entorno-aprobado>
```

La rotación no debe reemplazar la clave histórica sin un plan. El esquema actual no guarda `hmac_key_version`; antes de rotar se debe elegir una de estas decisiones aprobadas:

- añadir una versión de clave al modelo y usarla para verificar evidencias históricas; o
- conservar la clave anterior en un almacén de secretos restringido durante el periodo aprobado y usar la nueva solo para eventos posteriores.

Nunca recalcular huellas históricas con otra clave ni borrar evidencias para ocultar una incompatibilidad. Una ausencia de clave en `required` debe seguir siendo un **NO-GO**.

## 9. Respaldo y restauración local

Los respaldos son datos potencialmente sensibles aunque esta validación use únicamente registros sintéticos. Guardarlos solo en SSD con permisos restringidos, fuera del repositorio y sin subirlos a Git.

Con Wrangler detenido, crear un respaldo del estado local completo:

```bash
BACKUP_FILE="$LAB_ROOT/state-backups/d1-local-state.tar"
mkdir -p "$LAB_ROOT/state-backups"
tar -C "$STATE_ROOT" -cf "$BACKUP_FILE" v3
```

Para validar una restauración sin tocar el estado original, usar un directorio nuevo que también haya pasado por `soka-lab-ssd-preflight`:

```bash
RESTORE_ROOT="$LAB_ROOT/state-restore-test"
mkdir -p "$RESTORE_ROOT"
tar -C "$RESTORE_ROOT" -xf "$BACKUP_FILE"

NPM_CONFIG_CACHE="$NPM_CACHE" npx --yes wrangler@4.153.0 d1 execute CONSENT_DB \
  --config worker/wrangler.local.toml \
  --local \
  --persist-to "$RESTORE_ROOT" \
  --command "SELECT COUNT(*) AS row_count, MAX(technical_status) AS last_status FROM consent_evidence" \
  --json
```

La prueba realizada restauró un estado con seis registros sintéticos y obtuvo `row_count: 6`, seis claves de idempotencia distintas y `last_status: resend_error`. Una restauración de datos reales requiere autorización, control de acceso, validación de integridad y revisión jurídica; no se debe usar este procedimiento para sobrescribir producción.

## 10. Retención, supresión y revocación

Esta tarea no fija periodos ni ejecuta borrado automático. Para una futura solicitud:

1. Registrar la solicitud en el sistema privado definido en [`05_Gestion_Datos_Personales.md`](https://github.com/kpulido93/sokatechnologies-docs/blob/main/docs/procesos/05_Gestion_Datos_Personales.md).
2. Localizar la evidencia por `request_id`, sin buscar ni exportar la base completa.
3. Verificar identidad de forma razonable y determinar si la solicitud es acceso, corrección, supresión, restricción o revocación.
4. Revisar la retención aprobada y excepciones legales, contractuales, contables o probatorias.
5. Ejecutar la decisión solo mediante un procedimiento administrativo autenticado y registrar el mínimo de evidencia de la acción.
6. Propagar la instrucción a los proveedores cuando corresponda.

No se implementa una ruta pública de eliminación ni se borra el estado local automáticamente. La limpieza de los datos sintéticos de laboratorio sí puede hacerse antes de repetir la prueba, porque el directorio no contiene datos de titulares.

## 11. Validaciones realizadas

Desde el worktree SSD y sin llamadas reales a Turnstile o Resend:

| Validación | Resultado |
|---|---|
| Preflight SSD y rutas persistentes | PASS; UUID autorizado, rutas bajo `/srv/fast-storage`, Git y estado local en SSD. |
| Wrangler `4.153.0 --version` | PASS mediante `npx`; caché en SSD. |
| Migración `0001_consent_evidence.sql` | PASS con `d1 execute --local`; dos comandos ejecutados. |
| Tabla e índices D1 local | PASS; tabla creada, `request_id` e idempotencia únicas y índice de consulta presente. |
| Integración SQLite persistente de Wrangler | PASS; evidencia sintética, consulta, aceptación simulada, deduplicación, transición incierta/reconciliación y reapertura. Se ejecutó dos veces sin borrado global y se conservaron las filas previas. |
| Binding D1 nativo del runtime Worker | No ejecutado; la limitación y el plan opcional están documentados arriba. |
| Validación de `request_id` | PASS; UUID v4 completo aceptado e intentos de inyección SQL y formatos inválidos rechazados. |
| Respaldo/restauración local | PASS; estado sintético restaurado y consultable. |
| `npm test` | PASS: 60/60 pruebas existentes. |
| `npm run check` | PASS: 0 errores, warnings ni hints en 107 archivos. |
| `npm run build` | PASS: 22 páginas generadas. |
| `git diff --check` | PASS. |

No se ejecutó ningún comando con `--remote`, no se creó D1 remoto y no se modificaron contenedores, secretos, DNS, Worker desplegado, staging, WordPress o producción.

## 12. Checklist GO/NO-GO

### GO local de laboratorio

```text
[x] Worktree y persistencia en SSD validado por soka-lab-ssd-preflight.
[x] Configuración Wrangler separada y sin database_id remoto.
[x] Migración aplicada con --local y persistencia explícita.
[x] Tabla, restricciones UNIQUE e índice request_id comprobados.
[x] Evidencia sintética insertada, consultada y conservada tras reabrir SQLite.
[x] Turnstile y Resend simulados; no hubo llamadas reales.
[x] Estados resend_dispatching/resend_uncertain no se reenvían automáticamente.
[x] Respaldo y restauración probados solo con estado sintético.
[x] Estado del worktree y contenedores existentes preservados.
```

### NO-GO para habilitación real

```text
[ ] Política y textos de autorización aprobados jurídicamente.
[ ] Periodos de retención, revocación y supresión aprobados.
[ ] Binding D1 remoto creado mediante autorización independiente.
[ ] Migración remota revisada y aplicada en el entorno correcto.
[ ] HMAC creado como secreto estable del entorno, con plan de rotación.
[ ] Contratos, regiones y transferencias/transmisiones de proveedores revisados.
[ ] Acceso administrativo autenticado y registro de solicitudes operativo.
[ ] Worker desplegado y configuración de producción revisados sin activar por defecto.
[ ] Rollback probado y autorización explícita de despliegue.
```

## 13. Plan para una futura creación autorizada de D1 remoto

Esta secuencia es solo de planificación y no fue ejecutada:

1. Obtener aprobación jurídica, operativa, técnica y de despliegue; conservar `off` mientras tanto.
2. Crear el D1 remoto en la cuenta y entorno correctos mediante `wrangler d1 create`, registrando el identificador en el sistema privado aprobado, no en este PR.
3. Revisar el binding, migración, permisos y plan de rollback.
4. Aplicar la migración remota con una ventana y autorización separadas; verificar el esquema antes de recibir datos.
5. Crear el secreto HMAC en el entorno aprobado y probar ausencia/mismatch de configuración con fail-closed.
6. Configurar un binding del Worker únicamente en el entorno autorizado; no cambiar distribución de tráfico durante esta tarea.
7. Ejecutar pruebas controladas sin datos reales, validar proveedores y retención, y obtener aprobación final.
8. Habilitar formularios reales solo después del GO completo; mantener un rollback al modo demo.

Mientras cualquier paso esté pendiente, Contacto y Diagnóstico permanecen en modo demo y la activación pública permanece en **NO-GO**.
