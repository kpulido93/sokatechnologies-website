# Tarea 04-B5 — Release live aislado de formularios

**Estado:** bloqueado de forma segura; no se creó ni publicó un release live.

**Código revisado:** `2449a1706d40159b99b4ecd327ab28e1ff044eed`

**Rama:** `codex/tarea-04b5-release-live-aislado`

## Resultado ejecutivo

El repositorio y el Dockerfile están preparados para recibir tres valores públicos de build:

```text
PUBLIC_FORM_PROVIDER=worker
PUBLIC_CONTACT_FORM_ENDPOINT=https://soka-leads-worker.sokatech.workers.dev/api/leads
PUBLIC_TURNSTILE_SITE_KEY=<SITE_KEY_PUBLICA_AUTORIZADA>
```

La Site Key pública autorizada para `prueba.sokatechnologies.com` no estaba disponible en el
entorno local. No se inventó una clave, no se usó una clave de pruebas y no se declaró completada
la integración live. Por tanto, no se construyó la imagen live, no se creó el release live en SSD,
no se ocupó el puerto 8094 y no se ejecutó ningún envío al Worker o a Resend.

El build demo existente sí se validó con las dependencias actuales, pruebas del Worker y un preview
local aislado. La activación pública queda **NO-GO**.

## Preflight de infraestructura

Consultas realizadas en modo lectura:

| Elemento | Estado observado |
|---|---|
| Docker Engine | 29.9.1 |
| Docker Root Dir | `/var/lib/docker` |
| Storage driver | `overlayfs` |
| BuildKit | Builder `default`, operativo, BuildKit `v0.34.0` |
| Puerto 8091 | Ocupado por el contenedor esperado; no se detuvo |
| Puerto 8094 | Libre; no se utilizó |
| Wrangler | No instalado localmente; no fue posible verificar distribuciones desde esta máquina |
| Site Key pública | No presente en el entorno de shell ni en archivos `.env` reales encontrados |

Contenedores existentes verificados sin detenerlos ni modificarlos:

| Contenedor | Imagen | Publicación | Montaje | Reinicio | Estado |
|---|---|---|---|---|---|
| `soka-web-demo-2026-8091` | `sha256:defaa5c5cfe0e7d0be0ea43471340b98322a7629ee548e30eb1787f59bffab52` | `0.0.0.0:8091->80/tcp` | `/srv/fast-storage/soka-web/site` → `/usr/share/nginx/html` | `unless-stopped` | running |
| `soka-web-ssd-preview-8092` | misma imagen | `127.0.0.1:8092->80/tcp` | `/srv/fast-storage/soka-web/site` → `/usr/share/nginx/html` | `no` | running |
| `soka-web-04b3-preview-8093` | `soka-web-04b3:03608c2-demo` | `127.0.0.1:8093->80/tcp` | `/srv/fast-storage/soka-web/releases/03608c2-demo` → `/usr/share/nginx/html` | `no` | running |

Las tres URLs locales respondieron HTTP 200. No se modificó `/srv/fast-storage/soka-web/site`, ningún
release existente, el túnel, DNS, Worker, Resend, Turnstile ni producción.

## Validación de código y build demo

Comandos ejecutados sobre el commit base:

| Comando | Resultado |
|---|---|
| `npm ci` | PASS; 285 paquetes instalados, 0 vulnerabilidades reportadas |
| `npm audit` | PASS; 0 vulnerabilidades |
| `npm audit --omit=dev` | PASS; 0 vulnerabilidades |
| `npm test` | PASS; 26/26 pruebas del Worker |
| `npm run check` | PASS; 0 errores, warnings o hints |
| `npm run build` | PASS; 22 páginas estáticas |
| `git diff --check` | PASS |

El build disponible sin la Site Key conserva el modo demo en Contacto y Diagnóstico, la acción
`mailto:info@sokatechnologies.com` y los enlaces a `/politica-privacidad/`. No se utilizó para
declarar un release live.

## Evidencia Chromium del build demo

Se ejecutó un preview estático local aislado en `127.0.0.1:18018`, sin túnel ni exposición
externa. Se aplicó `prefers-reduced-motion: reduce` y se revisaron Contacto y Diagnóstico en
320, 390, 768 y 1440 px.

| Comprobación | Resultado |
|---|---|
| 8 combinaciones de página y viewport | PASS |
| `document.scrollWidth <= document.clientWidth` | PASS en 8/8 |
| Consola, excepciones y recursos HTTP | 0 errores observados |
| Campos obligatorios y consentimiento | PASS |
| Mensaje demo explícito tras validación local | PASS |
| POST al Worker o a Resend | 0 |
| Fallback `mailto:info@sokatechnologies.com` | PASS |
| Enlace `/politica-privacidad/` | PASS |
| Turnstile live | No probado: falta la Site Key autorizada |

Capturas y resultado estructurado, fuera del repositorio:

```text
/tmp/soka-04b5-qa/results.json
/tmp/soka-04b5-qa/contacto-320px.png
/tmp/soka-04b5-qa/contacto-390px.png
/tmp/soka-04b5-qa/contacto-768px.png
/tmp/soka-04b5-qa/contacto-1440px.png
/tmp/soka-04b5-qa/diagnostico-320px.png
/tmp/soka-04b5-qa/diagnostico-390px.png
/tmp/soka-04b5-qa/diagnostico-768px.png
/tmp/soka-04b5-qa/diagnostico-1440px.png
```

Estas pruebas validan únicamente el modo demo. No prueban la aceptación de tokens Turnstile, el
endpoint Worker, Resend ni los reintentos live.

## Preview live aislado: no creado

Estos valores son los previstos para una ejecución posterior, una vez entregada la Site Key pública
por un canal local seguro:

```text
Imagen prevista: soka-web-04b5:2449a17-live
Release previsto: /srv/fast-storage/soka-web/releases/04b5-2449a17-live
Puerto previsto: 127.0.0.1:8094
Contenedor previsto: soka-web-04b5-preview-8094
```

El directorio, la imagen y el contenedor anteriores **no existen como resultado de esta tarea**.
No se debe reutilizar `/srv/fast-storage/soka-web/site` para el candidato porque es el bind mount
del staging principal.

### Construcción futura, no ejecutada

La Site Key debe estar disponible únicamente como variable pública local, sin registrar el comando
en logs ni incluir otros secretos:

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

## Pruebas funcionales permitidas

No se enviaron solicitudes al Worker ni a Resend. Una prueba desde `localhost` no sería una prueba
válida de Turnstile porque el Worker está restringido a `https://prueba.sokatechnologies.com`.

Las 26 pruebas existentes del Worker cubren validación de campos, consentimiento, honeypot, origen,
Turnstile, rate limit, reintentos, idempotencia, errores del proveedor y respuestas controladas.

Las pruebas Chromium live con mocks quedan pendientes de la Site Key y del HTML live. No se deben
simular cambiando el modo demo ni usando una clave ficticia para declarar esa fase aprobada.

## Runbook de activación futura — no ejecutado

1. Obtener la Site Key pública aprobada mediante un canal local seguro.
2. Confirmar que el responsable legal, privacidad colombiana, retención, consentimiento y
   procedimiento de consultas/reclamos están aprobados.
3. Verificar con acceso de solo lectura la distribución actual de `soka-leads-worker`; Wrangler no
   está instalado en este equipo y esa verificación quedó pendiente.
4. Construir la imagen live con los tres argumentos públicos y etiquetarla con el SHA.
5. Inspeccionar el HTML y ejecutar el contenedor solo en `127.0.0.1:8094`.
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

- **NO-GO para release live:** falta la Site Key pública autorizada.
- **NO-GO para activación pública:** no se aprobaron privacidad, consentimiento ni operación real.
- **Pendiente:** instalar o habilitar Wrangler de forma autorizada para verificar la distribución
  actual del Worker antes de cualquier activación.
- **Pendiente:** repetir la matriz Chromium con HTML live y mocks una vez disponible la Site Key.
- **Sin secretos:** no se leyó, copió ni incluyó ninguna clave privada; el repositorio no recibió
  archivos `.env`.

La recomendación para fusionar este PR es **NO-GO técnico hasta proporcionar la Site Key pública y
completar las pruebas live aisladas**. La recomendación para cualquier activación pública permanece
**NO-GO** incluso después de esas pruebas hasta recibir aprobación legal y expresa del fundador.
