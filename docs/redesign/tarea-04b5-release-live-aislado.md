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
| Wrangler | No instalado localmente; no fue posible verificar distribuciones desde esta máquina |
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

## Imagen Docker live: no creada deliberadamente

La tarea solicitó validar el release estático manual existente y no repetir un `docker build`. Por
tanto, no se creó la imagen ni el contenedor Docker previstos en la documentación inicial. Estos
valores quedan como referencia para una futura activación aislada, no como artefactos existentes:

```text
Imagen prevista: soka-web-04b5:2449a17-live
Release previsto: /srv/fast-storage/soka-web/releases/04b5-2449a17-live
Puerto previsto: 127.0.0.1:8094
Contenedor previsto: soka-web-04b5-preview-8094
```

No se debe reutilizar `/srv/fast-storage/soka-web/site` para el candidato porque es el bind mount
del staging principal.

### Construcción futura, no ejecutada

La futura construcción Docker, si se autoriza, deberá recibir la Site Key únicamente como variable
pública local, sin registrar el comando en logs ni incluir otros secretos:

```bash
export PUBLIC_TURNSTILE_SITE_KEY='[SITE_KEY_PUBLICA_AUTORIZADA]'

docker build --progress=plain \
  --build-arg PUBLIC_FORM_PROVIDER=worker \
  --build-arg PUBLIC_CONTACT_FORM_ENDPOINT=https://soka-leads-worker.sokatech.workers.dev/api/leads \
  --build-arg PUBLIC_TURNSTILE_SITE_KEY="$PUBLIC_TURNSTILE_SITE_KEY" \
  --tag soka-web-04b5:2449a17-live .
```

Antes de arrancar el preview se debe comprobar que `127.0.0.1:8094` está libre. El candidato se
debe ejecutar sin bind mount al directorio demo y sin política de reinicio:

```bash
docker run --detach \
  --name soka-web-04b5-preview-8094 \
  --publish 127.0.0.1:8094:80 \
  --restart no \
  soka-web-04b5:2449a17-live
```

La comprobación del HTML debe confirmar en Contacto y Diagnóstico:

- `data-form-mode="live"`.
- `data-submit-endpoint="https://soka-leads-worker.sokatech.workers.dev/api/leads"`.
- `data-action="lead"` en el widget Turnstile.
- Fallback `mailto:info@sokatechnologies.com`.
- Enlace a `/politica-privacidad/`.
- Ausencia de `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, tokens y credenciales.

El valor público de Turnstile puede aparecer en el HTML; ninguna clave privada puede aparecer en
la imagen, el HTML, los logs o el repositorio.

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
3. Verificar con acceso de solo lectura la distribución actual de `soka-leads-worker`; Wrangler no
   está instalado en este equipo y esa verificación quedó pendiente.
4. Construir, si se aprueba, una imagen Docker live con los tres argumentos públicos y etiquetarla
   con el SHA; esta tarea no la construyó.
5. Inspeccionar el HTML y ejecutar el candidato solo en `127.0.0.1:8094`.
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
- **Pendiente:** instalar o habilitar Wrangler de forma autorizada para verificar la distribución
  actual del Worker antes de cualquier activación; no se modificó la distribución.
- **Pendiente:** decidir si la futura publicación aislada requiere una imagen Docker, sin reutilizar
  el bind mount de staging.
- **Sin secretos:** no se leyó, copió ni incluyó ninguna clave privada; el repositorio no recibió
  archivos `.env`.

La recomendación para revisión/fusión del alcance técnico es **GO**, sujeta a la revisión del PR.
La recomendación para cualquier activación pública permanece **NO-GO** hasta recibir aprobación legal
y expresa del fundador, además de pruebas reales controladas desde el hostname autorizado.
