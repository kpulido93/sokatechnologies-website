# Tarea 04-B5 — Release live aislado de formularios

**Estado:** release estático live validado en SSD; no se creó una imagen Docker ni se publicó en
staging.

**Código revisado:** `a168afee65e1e950cfc5819ce6287fbb0c70d315`

**Rama:** `codex/tarea-04b5-release-live-aislado`

## Resultado ejecutivo

El release se construyó manualmente desde el commit `a168afee65e1e950cfc5819ce6287fbb0c70d315`
en el SSD, utilizando la Site Key pública autorizada únicamente durante la compilación local. El
resultado estático quedó en:

```text
/srv/fast-storage/soka-web/worktrees/04b5-live/dist
```

No se ejecutó `docker build`, no se creó una imagen Docker y no se modificó ningún contenedor
existente. El preview aislado se sirvió con Python en `127.0.0.1:8094`, sin túnel ni exposición
externa.

La configuración pública utilizada fue:

```text
PUBLIC_FORM_PROVIDER=worker
PUBLIC_CONTACT_FORM_ENDPOINT=https://soka-leads-worker.sokatech.workers.dev/api/leads
PUBLIC_TURNSTILE_SITE_KEY=<SITE_KEY_PUBLICA_AUTORIZADA>
```

Contacto y Diagnóstico quedaron en modo live, con el endpoint del Worker, acción Turnstile `lead`,
fallback `mailto:info@sokatechnologies.com` y enlace a `/politica-privacidad/`. La clave privada
de Turnstile, Resend y cualquier credencial de Cloudflare no se leyó ni se incorporó al release.

La validación técnica aislada queda **GO para revisión del PR**. La activación pública de leads
permanece **NO-GO**.

## Preflight de infraestructura

Consultas realizadas en modo lectura:

| Elemento | Estado observado |
|---|---|
| Docker Engine | 29.9.1 |
| Docker Root Dir | `/var/lib/docker` |
| Storage driver | `overlayfs` |
| BuildKit | Builder `default`, operativo, BuildKit `v0.34.0` |
| Puerto 8091 | Ocupado por el contenedor esperado; no se detuvo |
| Puerto 8094 | Preview estático aislado en `127.0.0.1:8094`; no Docker, no túnel |
| Wrangler | Sin instalación fija; el operador verificó mediante CLI temporal la distribución original 100 % / candidata 0 %. Repetir la comprobación de solo lectura antes de activar |
| Site Key pública | Consumida por la build local; su valor no se registró ni se versionó |

Contenedores existentes verificados sin detenerlos ni modificarlos:

| Contenedor | Imagen | Publicación | Montaje | Reinicio | Estado |
|---|---|---|---|---|---|
| `soka-web-demo-2026-8091` | `sha256:defaa5c5cfe0e7d0be0ea43471340b98322a7629ee548e30eb1787f59bffab52` | `0.0.0.0:8091->80/tcp` | `/srv/fast-storage/soka-web/site` → `/usr/share/nginx/html` | `unless-stopped` | running |
| `soka-web-ssd-preview-8092` | misma imagen | `127.0.0.1:8092->80/tcp` | `/srv/fast-storage/soka-web/site` → `/usr/share/nginx/html` | `no` | running |
| `soka-web-04b3-preview-8093` | `soka-web-04b3:03608c2-demo` | `127.0.0.1:8093->80/tcp` | `/srv/fast-storage/soka-web/releases/03608c2-demo` → `/usr/share/nginx/html` | `no` | running |

Las URLs de los tres contenedores existentes y las rutas del preview `8094` respondieron HTTP 200.
No se modificó `/srv/fast-storage/soka-web/site`, ningún release existente, el túnel, DNS, Worker,
Resend, Turnstile ni producción.

## Validación de código y build del release

Comandos ejecutados sobre el commit del release:

| Comando | Resultado |
|---|---|
| `npm ci` | PASS; 285 paquetes instalados, 0 vulnerabilidades reportadas |
| `npm audit` | PASS; 0 vulnerabilidades |
| `npm audit --omit=dev` | PASS; 0 vulnerabilidades |
| `npm test` | PASS; 26/26 pruebas del Worker |
| `npm run check` | PASS; 0 errores, warnings o hints |
| `npm run build` | PASS; 22 páginas estáticas |
| `git diff --check` | PASS |

El release live validado contiene `data-form-mode="live"` en Contacto y Diagnóstico, el endpoint
correcto, el widget con `data-action="lead"`, el fallback `mailto:info@sokatechnologies.com` y
los enlaces a `/politica-privacidad/`.

## Release estático live validado en SSD

| Elemento | Resultado |
|---|---|
| Worktree | `/srv/fast-storage/soka-web/worktrees/04b5-live` |
| Commit | `a168afee65e1e950cfc5819ce6287fbb0c70d315` |
| Salida | `/srv/fast-storage/soka-web/worktrees/04b5-live/dist` |
| Servidor | `python3 -m http.server`, bind `127.0.0.1` |
| Puerto | `8094` |
| Imagen Docker | No creada; no se ejecutó Docker build |
| Rutas HTTP comprobadas | `/`, `/contacto/`, `/diagnostico/`, `/politica-privacidad/`, `/servicios/` |
| Resultado | HTTP 200 en todas las rutas |

El directorio `dist/` no se copió al repositorio y la Site Key pública no se guardó en el código,
la documentación ni los artefactos versionados.

## Evidencia Chromium del release live

Se ejecutó Chromium sobre `http://127.0.0.1:8094`, sin túnel ni exposición externa. El arnés
interceptó el script de Turnstile y todas las solicitudes al Worker; cualquier otro destino externo
fue bloqueado. Se aplicó `prefers-reduced-motion: reduce` y se revisaron Contacto y Diagnóstico en
320, 390, 768 y 1440 px.

| Comprobación | Resultado |
|---|---|
| 8 combinaciones de página y viewport | PASS; 8/8 |
| `document.scrollWidth <= document.clientWidth` | PASS; 8/8 |
| Modo live, endpoint y acción `lead` | PASS en ambos formularios |
| Consentimiento obligatorio | PASS en Contacto y Diagnóstico |
| Token Turnstile ausente | PASS; no se envía la solicitud |
| Respuestas mock 200, 400, 403, 429, 502 y 503 | PASS en ambos formularios |
| Conservación de campos ante error | PASS |
| Limpieza de campos tras 200 | PASS |
| Renovación de token tras error | PASS |
| Misma `Idempotency-Key` con datos idénticos | PASS |
| Nueva `Idempotency-Key` al cambiar datos | PASS |
| Prevención de doble envío | PASS; una solicitud mock |
| POST real a Worker o Resend | 0; todos los POST fueron interceptados |
| Fallback `mailto:info@sokatechnologies.com` | PASS |
| Enlace `/politica-privacidad/` | PASS |
| Errores de aplicación | Ninguno; las cargas externas fueron bloqueadas intencionadamente |

La matriz funcional acumuló 22 casos PASS: consentimiento y token ausente en ambos formularios,
12 combinaciones de respuesta HTTP, dos reintentos con datos idénticos, dos con datos modificados y
dos pruebas de doble envío. El arnés registró cero POST que escaparan hacia el Worker y cero llamadas
a Resend.

Capturas y resultado estructurado, fuera del repositorio:

```text
/tmp/soka-04b5-live-qa/results.json
/tmp/soka-04b5-live-qa/contacto-320px.png
/tmp/soka-04b5-live-qa/contacto-390px.png
/tmp/soka-04b5-live-qa/contacto-768px.png
/tmp/soka-04b5-live-qa/contacto-1440px.png
/tmp/soka-04b5-live-qa/diagnostico-320px.png
/tmp/soka-04b5-live-qa/diagnostico-390px.png
/tmp/soka-04b5-live-qa/diagnostico-768px.png
/tmp/soka-04b5-live-qa/diagnostico-1440px.png
```

Los errores `ERR_BLOCKED_BY_CLIENT` registrados para las tipografías externas son consecuencia de
la política de bloqueo del arnés, no errores de la aplicación. No hubo tráfico externo POST real.

## Artefactos: build estático sí, snapshot versionado todavía no

El único artefacto validado en 04-B5 es el directorio `dist/` dentro del worktree del
SSD, compilado desde `a168afee65e1e950cfc5819ce6287fbb0c70d315`.
**No** existe una imagen Docker live ni un snapshot de release en
`/srv/fast-storage/soka-web/releases/` creado por esta tarea.

Para evitar saturar el HDD, no se debe ejecutar `docker build` mientras el Docker Root Dir
siga siendo `/var/lib/docker`, salvo que se valide y apruebe primero una estrategia de
almacenamiento de imágenes/caché con capacidad suficiente.

### Materialización futura del release en SSD — NO EJECUTADA

Si se aprueba conservar un artefacto independiente del worktree, utilizar una **copia
versionada** del HTML estático ya comprobado. Esta acción no activa formularios públicos
ni modifica los contenedores existentes, pero requiere autorización operativa y una
inspección previa de la fuente y el espacio libre:

```bash
set -euo pipefail
worktree=/srv/fast-storage/soka-web/worktrees/04b5-live
source_dir="$worktree/dist"
releases_dir=/srv/fast-storage/soka-web/releases
release="$releases_dir/04b5-a168afe-live"

test "$(git -C "$worktree" rev-parse HEAD)" = a168afee65e1e950cfc5819ce6287fbb0c70d315
test -s "$source_dir/contacto/index.html"
test -s "$source_dir/diagnostico/index.html"
test -s "$source_dir/politica-privacidad/index.html"
test ! -e "$release"

mkdir -p "$releases_dir"
temp="$(mktemp -d "$releases_dir/.04b5-a168afe-live.XXXXXX")"
cp -a "$source_dir/." "$temp/"
# El directorio temporal de mktemp nace con permisos 700; Nginx debe poder leerlo.
chmod -R a+rX "$temp"
test -s "$temp/contacto/index.html"
test -s "$temp/diagnostico/index.html"
test -s "$temp/politica-privacidad/index.html"
mv -T "$temp" "$release"
printf 'Release creado: %s\n' "$release"
```

Esta copia es **un paso futuro pendiente**, no evidencia de que el directorio ya exista.
Verificar después los formularios `live`, el endpoint y el widget dentro de la copia,
sin mostrar la Site Key en logs. Conservar el snapshot sin modificar sus archivos para
identificar con claridad el candidato y permitir regresar al release anterior.

Para un preview adicional sin Docker, servir esta copia en un **puerto libre**, solo sobre
`127.0.0.1`, interceptando solicitudes externas durante QA; no reutilizar el 8094 si el
preview Python de 04-B5 continúa funcionando.

### Publicación futura — aprobación separada

La publicación eventual del snapshot mediante Nginx deberá montar **ese directorio
versionado** como `/usr/share/nginx/html` en modo solo lectura. Aplicar entonces
el preflight y el mecanismo de rollback del runbook 04-B3, conservando el contenedor
original de 8091. **No** montar `/srv/fast-storage/soka-web/site` como fuente
del candidato live ni asumir que una imagen Docker contiene el release en SSD.

Crear o reconstruir una imagen Docker es una ruta alternativa, **no necesaria** para
promocionar este HTML estático; requeriría planificar su uso de disco en `/var/lib/docker`
y un procedimiento independiente. No hay imagen live creada en este PR.

La revisión del HTML debe confirmar:

- `data-form-mode="live"`.
- `data-submit-endpoint="https://soka-leads-worker.sokatech.workers.dev/api/leads"`.
- `data-action="lead"` en el widget Turnstile.
- Fallback `mailto:info@sokatechnologies.com`.
- Enlace a `/politica-privacidad/`.
- Ausencia de `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, tokens o credenciales privadas.

La Site Key pública sí estará en el HTML; **ningún secreto** debe estar presente en el
artefacto, los logs o el repositorio.

## Pruebas funcionales ejecutadas

No se enviaron solicitudes al Worker ni a Resend. Una prueba desde `localhost` no es una prueba de
aceptación real de Turnstile porque el Worker está restringido a `https://prueba.sokatechnologies.com`;
la validación realizada fue exclusivamente del frontend mediante mocks.

Las 26 pruebas existentes del Worker cubren validación de campos, consentimiento, honeypot, origen,
Turnstile, rate limit, reintentos, idempotencia, errores del proveedor y respuestas controladas.

Las pruebas Chromium live se ejecutaron sobre el HTML live con la Site Key autorizada durante la
construcción local. No se usó una clave ficticia ni se permitió tráfico real.

## Runbook de activación futura — no ejecutado

1. Obtener la Site Key pública aprobada mediante un canal local seguro.
2. Confirmar que el responsable legal, privacidad colombiana, retención, consentimiento y
   procedimiento de consultas/reclamos están aprobados.
3. Verificar nuevamente con acceso de solo lectura la distribución de `soka-leads-worker`;
   puede utilizarse `npx --yes wrangler@4.151.3 deployments status --name soka-leads-worker`
   desde una sesión autorizada. La última distribución comunicada fue original 100 %,
   candidata con secretos 0 %. No modificarla en esta tarea.
4. Si se autoriza generar un artefacto de publicación, materializar el snapshot HTML **en SSD**
   siguiendo el procedimiento de copia y verificación anterior; no usar `docker build`
   mientras su almacenamiento en HDD no se haya resuelto.
5. Comprobar el HTML versionado y ejecutarlo solo en un puerto local libre, con el origen
   de Turnstile/Worker simulado para pruebas; no exponerlo mediante Tunnel.
6. Ejecutar Chromium con mocks para respuestas 200, 400, 403, 429, 502 y 503, sin permitir tráfico
   hacia el Worker.
7. Validar Contacto y Diagnóstico a 320, 390, 768 y 1440 px, teclado, reduced motion, consola,
   overflow y conservación de campos.
8. Mantener intactos 8091, 8092, `soka-web-04b3-preview-8093` y el rollback existente.
9. Solo una autorización posterior podría permitir activar el tráfico real; esta tarea no la
   concede.

## Rollback futuro

Esta tarea no cambió 8091, por lo que no requiere rollback. Si una futura publicación autorizada
reemplaza el servicio de pruebas, debe conservar el contenedor `soka-web-demo-2026-8091` bajo un
alias reversible antes de crear otro contenedor. Debe restaurarse el mismo bind, puerto y política
`unless-stopped` ante cualquier fallo local o público.

El respaldo adicional `soka-web-demo-2026-8091-pre-ssd-20261020T233258` permanece intacto como
opción de emergencia y no debe utilizarse como sustituto normal sin inspección manual.

El rollback del Worker, si alguna tarea futura lo activa, deberá restaurar explícitamente la versión
previamente verificada desde la cuenta Cloudflare. No se ejecutaron cambios de distribución en esta
tarea.

## Riesgos y decisión

- **GO técnico condicionado a revisión del PR:** el release estático live y su frontend fueron
  validados en SSD; no existe imagen Docker como resultado de esta tarea.
- **NO-GO para activación pública:** no se aprobaron privacidad, consentimiento ni operación real.
- **Pendiente:** verificar de nuevo la distribución del Worker con Wrangler en modo lectura
  antes de activar; `npx --yes wrangler@4.151.3` permite ejecutarlo sin instalación global.
- **Pendiente:** materializar y verificar un snapshot versionado del HTML estático en SSD,
  **solo cuando se autorice** una futura preparación de publicación; no existe hoy.
- **HDD:** Docker conserva `/var/lib/docker`; no volver a ejecutar `docker build` sin
  resolver capacidad/caché y aprobar el procedimiento.
- **Sin secretos:** no se leyó, copió ni incluyó ninguna clave privada; el repositorio no recibió
  archivos `.env`.

La recomendación para revisión/fusión del alcance técnico es **GO**, sujeta a la revisión del PR.
La recomendación para cualquier activación pública permanece **NO-GO** hasta recibir aprobación legal
y expresa del fundador, además de pruebas reales controladas desde el hostname autorizado.
