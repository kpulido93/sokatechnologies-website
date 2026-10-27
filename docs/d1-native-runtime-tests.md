# Pruebas del binding D1 nativo en runtime local

**Estado:** validado localmente; **NO-GO** para tratamiento real.

Esta tarea ejecuta el Worker dentro de `workerd` mediante la integración oficial de Vitest de Cloudflare. La evidencia se guarda y consulta mediante el binding nativo `env.CONSENT_DB`; no se abre ningún archivo SQLite ni se usa el adaptador de `scripts/d1-local-integration.mjs`.

No se creó D1 remoto, no se usó `--remote`, no se desplegó el Worker, no se llamaron Turnstile ni Resend reales y no se habilitaron formularios públicos.

## Arquitectura

```text
vitest.native.config.mjs
  └── @cloudflare/vitest-plugin
        └── workerd/Miniflare local
              ├── worker/wrangler.native-test.toml
              │     └── CONSENT_DB → D1 nativo local
              ├── applyD1Migrations(env.CONSENT_DB, ...)
              └── worker/test/native-runtime.spec.mjs
                    └── @msw/cloudflare
                          ├── Turnstile sintético
                          ├── Resend sintético
                          └── rechazo explícito de salidas no simuladas
```

La prueba importa el Worker real (`worker/src/index.mjs`) y llama a su `fetch` dentro del runtime Cloudflare con `env` de `cloudflare:workers`. Las consultas de verificación usan directamente `env.CONSENT_DB.prepare(...).bind(...).first()`. No se construye un objeto que imite D1.

Componentes versionados:

- `worker/wrangler.native-test.toml`: configuración exclusiva de pruebas; contiene `CONSENT_EVIDENCE_MODE = "required"`, variables y credenciales sintéticas, el binding D1 local y un rate limiter local. No reemplaza `worker/wrangler.toml`.
- `vitest.native.config.mjs`: conecta el plugin oficial, el archivo Wrangler de pruebas y las migraciones.
- `worker/test/native-runtime.spec.mjs`: nueve casos en `workerd`, con proveedores externos totalmente interceptados.
- `package.json` y `package-lock.json`: Vitest, plugin Cloudflare y MSW como dependencias de desarrollo.
- `docs/d1-native-runtime-tests.md`: este procedimiento.

## Versiones y fuentes

Versiones fijadas en el lockfile durante esta validación:

| Componente | Versión |
|---|---:|
| Node.js | `22.22.3` |
| Vitest | `4.1.12` |
| `@cloudflare/vitest-plugin` | `1.4.8` |
| Wrangler transitivo del plugin | `4.153.0` |
| Miniflare transitivo | `5.20261023.0-beta` |
| `msw` | `3.0.3` |
| `@msw/cloudflare` | `0.2.0` |

La configuración sigue la integración recomendada por Cloudflare:

- [Workers Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration/)
- [Write your first test](https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/)
- [Test APIs y migraciones D1](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/)
- [Mock outbound requests con `@msw/cloudflare`](https://developers.cloudflare.com/workers/testing/vitest-integration/mock-outbound-requests/)
- [D1 Workers Binding API](https://developers.cloudflare.com/d1/worker-api/)

## Aislamiento y modo seguro

`worker/wrangler.toml` conserva `CONSENT_EVIDENCE_MODE = "off"`. Solo `worker/wrangler.native-test.toml`, cargado por `vitest.native.config.mjs`, usa `required`.

Los valores de Turnstile, Resend y HMAC del archivo de pruebas son sintéticos y no son credenciales de ninguna cuenta. El test no lee `.env`, secretos del sistema ni configuración de Cloudflare.

`setupNetwork()` se habilita para todo el archivo. Antes de cada caso se instala un handler comodín que lanza un error ante cualquier URL no declarada. Cada caso registra explícitamente únicamente:

- `https://challenges.cloudflare.com/turnstile/v0/siteverify`, con una respuesta Turnstile sintética válida.
- `https://api.resend.com/emails`, con la respuesta Resend sintética requerida por el caso.

Los cuerpos ficticios contienen dominios `.invalid`, IP reservada de documentación y textos sintéticos. La evidencia se inspecciona directamente en D1 para confirmar que no contiene nombre, correo, teléfono, mensaje, IP, user-agent ni token de Turnstile.

El runtime temporal se ejecuta con `TMPDIR` bajo el laboratorio SSD:

```text
/srv/fast-storage/labs/sokatechnologies-website/d1-native/tmp/
```

La persistencia D1 de esta suite es efímera y aislada por Vitest; no reutiliza ni modifica `/srv/fast-storage/labs/sokatechnologies-website/d1-local/state`. No hay una base SQLite de pruebas ni un archivo de estado versionado.

## Instalación y comandos reproducibles

Preflight validado:

```bash
LAB_ROOT=/srv/fast-storage/labs/sokatechnologies-website/d1-native
REPO_ROOT=$LAB_ROOT/repo
STATE_ROOT=$LAB_ROOT/state
NPM_CACHE=$LAB_ROOT/npm-cache
TMP_ROOT=$LAB_ROOT/tmp

/usr/local/sbin/soka-lab-ssd-preflight "$LAB_ROOT" \
  --git-path "$REPO_ROOT" \
  --persist-path "$STATE_ROOT" \
  --persist-path "$NPM_CACHE" \
  --persist-path "$TMP_ROOT"
```

En el laboratorio SSD:

```bash
cd "$REPO_ROOT"
npm ci --ignore-scripts --legacy-peer-deps --cache "$NPM_CACHE"
TMPDIR="$TMP_ROOT" npm run test:native-runtime
```

`--legacy-peer-deps` queda documentado porque el npm 10.9.8 disponible falló al resolver los peer opcionales de Vitest con `Cannot read properties of null (reading 'edgesOut')`; no cambia la resolución fijada en `package-lock.json`.

No ejecutar `wrangler d1 execute` para esta suite. `applyD1Migrations()` aplica `worker/0001_consent_evidence.sql` directamente al binding nativo local dentro de `workerd` antes de cada caso.

## Casos cubiertos

| Caso | Verificación |
|---|---|
| Solicitud correcta | Contacto, origen, campos, consentimiento, Turnstile, D1 nativo, despacho sintético y `resend_accepted`. |
| Consulta interna | Lectura directa por `request_id`; la notificación contiene la referencia. |
| Evidencia mínima | La fila D1 no contiene campos personales, IP, user-agent ni token Turnstile. |
| Consentimiento ausente | Rechazo antes de crear evidencia o llamar a Resend. |
| Versión inválida | Rechazo del catálogo antes de persistir. |
| Reutilización con contenido cambiado | `409 idempotency_conflict` y un solo despacho. |
| Concurrencia | Dos solicitudes nativas con la misma clave producen una fila y un solo despacho. |
| D1 no disponible | Tabla eliminada solo dentro del almacenamiento aislado; el Worker responde `consent_storage_error` y no despacha. |
| HMAC ausente | `consent_fingerprint_key_missing` y ningún despacho. |
| Resend HTTP 500 | `resend_uncertain`; el reintento queda bloqueado. |
| Resend HTTP 409 concurrente | Se clasifica como incierto y no permite reenvío automático. |

Los casos parametrizados producen nueve pruebas. `reset()` y `applyD1Migrations()` se ejecutan antes de cada caso; la eliminación de tabla se limita a la instancia D1 efímera del test.

## Resultados validados

```text
Vitest native runtime: 9 passed, 0 failed
Worker ejecutado dentro de workerd: PASS
Binding env.CONSENT_DB nativo: PASS
Migración aplicada mediante applyD1Migrations: PASS
Turnstile/Resend reales: NO ejecutados
Salidas externas no simuladas: fallan explícitamente
CONSENT_EVIDENCE_MODE compartido: off
```

## Limitaciones y riesgos

- El runtime local usa `workerd` mediante Miniflare y valida la API nativa y el comportamiento local de D1; no prueba la infraestructura distribuida, límites, latencia o consistencia operacional de D1 remoto.
- El rate limiter local es una emulación del binding configurado para el laboratorio; no demuestra límites distribuidos de producción.
- El test de concurrencia verifica la reclamación y la unicidad en un proceso de pruebas local. No reemplaza una prueba de carga ni una revisión de configuración de producción.
- `@cloudflare/vitest-plugin` y Miniflare mantienen estado temporal efímero. Si se requiere conservar evidencia de laboratorio, debe hacerse mediante un procedimiento separado y nunca dentro de Git.
- La suite no valida una entrega de correo: solo distingue las respuestas HTTP simuladas de Resend según la lógica existente.
- El catálogo sigue identificando el aviso de privacidad como borrador. Esto mantiene el GO técnico local separado del GO jurídico y operativo.
- `npm audit --omit=optional` reporta una vulnerabilidad moderada transitoria en `fast-uri` (`3.0.0–3.1.8`), con corrección disponible. No se ejecutó `npm audit fix` porque podría introducir cambios de dependencias ajenos a esta tarea; debe resolverse antes de usar esta suite en CI o producción.

## Checklist GO/NO-GO

### GO de la prueba local

```text
[x] Laboratorio nuevo en SSD validado por soka-lab-ssd-preflight.
[x] Rama basada en feature/web-demo-2026-gsap, HEAD inicial 7932c45.
[x] Worker real ejecutado dentro de workerd.
[x] Binding nativo env.CONSENT_DB verificado.
[x] Migración real aplicada con applyD1Migrations.
[x] Proveedores Turnstile y Resend simulados, con rechazo de salidas no declaradas.
[x] D1 local aislado del estado de Tarea 04-B7A.
[x] Modo required limitado al archivo wrangler.native-test.toml.
```

### NO-GO para habilitación pública

```text
[ ] CONSENT_EVIDENCE_MODE=required en configuración compartida.
[ ] D1 remoto creado y autorizado.
[ ] HMAC de producción creado y gestionado como secreto estable.
[ ] Política y catálogo aprobados jurídicamente.
[ ] Retención, revocación y supresión aprobadas.
[ ] Proveedores, regiones y transferencias/transmisiones revisados.
[ ] Despliegue y autorización de formularios públicos aprobados.
```

La activación pública permanece en **NO-GO**.
