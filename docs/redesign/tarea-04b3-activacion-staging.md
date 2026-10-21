# Tarea 04-B3 — Activación controlada de formularios en staging

Fecha: 2026-10-20
Rama: `codex/tarea-04b3-activacion-staging`
Estado: candidato preparado; activación pública bloqueada hasta aprobación

## Alcance y decisión de activación

Astro continúa con `output: "static"` y Nginx solo sirve los archivos generados. El envío real,
si se aprueba, ocurre desde el navegador hacia el Worker independiente:

```text
POST https://soka-leads-worker.sokatech.workers.dev/api/leads
```

Esta tarea prepara el build y el formulario, pero no cambia la distribución del Worker, no publica
la imagen en `8091`, no ejecuta envíos reales y no modifica DNS, Cloudflare Tunnel, WordPress o
producción.

La activación queda en **NO-GO** mientras la política de privacidad siga siendo un borrador y no
exista aprobación expresa del fundador sobre consentimiento, proveedores, retención y primer envío.

## Cambios implementados

### Configuración pública de build

`Dockerfile` declara únicamente estos argumentos públicos, con valores seguros por defecto:

| Argumento | Valor por defecto | Uso |
|---|---|---|
| `PUBLIC_FORM_PROVIDER` | `demo` | Selecciona el modo del formulario |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | vacío | URL HTTPS del Worker |
| `PUBLIC_TURNSTILE_SITE_KEY` | vacío | Site Key pública de Turnstile |

Los valores se incorporan durante `npm run build`; cambiar variables en un contenedor Nginx ya
construido no cambia el HTML estático. No se aceptan argumentos privados y no se copian secretos
al runtime:

- `RESEND_API_KEY`
- `TURNSTILE_SECRET_KEY`
- credenciales de Cloudflare
- secretos de otros clientes

El modo efectivo permanece en `demo` si falta el proveedor Worker, el endpoint HTTPS o la Site Key.

### Formulario sin JavaScript

En modo Worker, el endpoint se guarda en `data-submit-endpoint` y se usa solo para el `fetch` con
`Idempotency-Key`, JSON y token Turnstile. La acción HTML sigue siendo `mailto:` para que un
navegador sin JavaScript no intente enviar un `POST` incompleto al Worker. El enlace visible
`Escribir por correo` mantiene la misma alternativa.

El formulario conserva:

- campos y validaciones del contrato aprobado;
- token Turnstile `lead` únicamente en modo Worker;
- la misma clave de idempotencia si se reintentan datos idénticos;
- una clave nueva si cambian los datos;
- campos ante errores y reinicio del widget;
- confirmación solo tras una respuesta `200` con `ok: true`;
- modo demo sin solicitudes `POST`.

## Privacidad: propuesta pendiente de revisión legal

La página `/politica-privacidad/` sigue marcada como borrador. El siguiente texto es una base de
trabajo y no debe presentarse como política definitiva.

### Responsable

**Pendiente de completar por la empresa:** razón social o nombre legal del responsable, domicilio,
jurisdicción aplicable y canal formal adicional, si corresponde. El canal operativo disponible para
esta propuesta es `info@sokatechnologies.com`.

### Finalidad y alcance

Los datos enviados en Contacto o Diagnóstico se utilizarían para entender la solicitud, responder
al remitente, coordinar una conversación y, cuando corresponda, preparar un diagnóstico o propuesta.
No se solicitan contraseñas, tokens, llaves privadas, accesos ni datos sensibles de terceros.

### Datos recopilados

- Obligatorios: nombre, empresa, correo electrónico, descripción del problema y consentimiento.
- Opcionales: teléfono, país, servicio de interés y tipo de problema.
- Datos técnicos: Cloudflare puede tratar datos técnicos necesarios para seguridad, Turnstile y
  limitación de abuso. El alcance exacto, incluida la IP procesada por el Worker para rate limit,
  debe confirmarse en la revisión legal y en la documentación de los proveedores.

### Proveedores y transferencias

- **Cloudflare Turnstile:** comprobación antiabuso del formulario; el widget se restringirá al
  hostname `prueba.sokatechnologies.com` y usará la acción `lead`.
- **Cloudflare Workers:** recepción y validación server-side del endpoint `/api/leads`.
- **Resend:** entrega del mensaje al destinatario comercial `info@sokatechnologies.com`, usando un
  remitente de dominio verificado y el correo validado del prospecto únicamente como Reply-To.

La ubicación de procesamiento, las transferencias internacionales, las garantías aplicables y las
condiciones contractuales de cada proveedor están **pendientes de confirmar**; no se inventan en
este repositorio.

### Retención, eliminación y derechos

El periodo de conservación de solicitudes, el procedimiento de eliminación y los responsables de
atenderlo están **pendientes de decisión legal y operativa**. La política final debe indicar cómo
ejercer los derechos que correspondan —por ejemplo, acceso, rectificación, supresión, oposición o
limitación— mediante `info@sokatechnologies.com`, junto con la jurisdicción y los plazos aplicables.

La base jurídica del tratamiento y el texto definitivo del consentimiento también requieren
revisión legal; el checkbox actual no sustituye esa aprobación.

### Bloqueos antes de activar

1. Confirmar responsable, domicilio, jurisdicción y base jurídica.
2. Aprobar el texto de consentimiento y la política final.
3. Confirmar proveedores, transferencias, retención, eliminación y acceso al buzón.
4. Confirmar el widget Turnstile, su hostname/action y los secretos del Worker fuera de Git.
5. Confirmar dominio remitente verificado en Resend y registros DNS sin sustituir SPF, MX o DMARC.
6. Aprobar el primer envío controlado desde staging.

## Pruebas de build

### Demo local, sin valores públicos

```bash
npm ci
npm test
npm run check
npm run build
docker build -t soka-web-demo-2026:04b3-demo .
docker run --rm --name soka-web-demo-04b3-demo -p 127.0.0.1:8092:80 soka-web-demo-2026:04b3-demo
```

Comprobaciones esperadas:

```bash
curl -fsS http://127.0.0.1:8092/contacto/ | rg 'data-form-mode="demo"'
curl -fsS http://127.0.0.1:8092/diagnostico/ | rg 'data-form-mode="demo"'
```

### Candidato Worker, solo después de disponer de la Site Key pública autorizada

La variable `PUBLIC_TURNSTILE_SITE_KEY` debe existir únicamente en el entorno local autorizado;
no se escribe en Git ni en este documento:

```bash
export PUBLIC_TURNSTILE_SITE_KEY='[SITE_KEY_PUBLICA_PROPORCIONADA_LOCALMENTE]'
docker build \
  --build-arg PUBLIC_FORM_PROVIDER=worker \
  --build-arg PUBLIC_CONTACT_FORM_ENDPOINT=https://soka-leads-worker.sokatech.workers.dev/api/leads \
  --build-arg PUBLIC_TURNSTILE_SITE_KEY="$PUBLIC_TURNSTILE_SITE_KEY" \
  -t soka-web-demo-2026:04b3-candidato .
docker run --rm --name soka-web-demo-04b3-candidato -p 127.0.0.1:8092:80 soka-web-demo-2026:04b3-candidato
```

Validar el HTML sin imprimir la Site Key completa ni secretos:

```bash
curl -fsS http://127.0.0.1:8092/contacto/ | rg 'data-form-mode="live"|soka-leads-worker\.sokatech\.workers\.dev/api/leads|cf-turnstile'
curl -fsS http://127.0.0.1:8092/diagnostico/ | rg 'data-form-mode="live"|soka-leads-worker\.sokatech\.workers\.dev/api/leads|cf-turnstile'
```

La validez de Turnstile no se prueba desde `localhost`: el token debe obtenerse después, desde
`https://prueba.sokatechnologies.com`, cuyo hostname está autorizado en el widget.

## Resultado de esta preparación

- `npm ci`: correcto; sin vulnerabilidades durante la instalación.
- `npm audit`: 0 vulnerabilidades.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- `npm test`: 26/26 pruebas del Worker correctas.
- `npm run check`: 0 errores, advertencias o hints.
- `npm run build`: 22 páginas estáticas generadas.
- `git diff --check`: correcto.
- El build demo confirmó `data-form-mode="demo"`, `mailto:info@sokatechnologies.com` y ninguna
  URL del Worker en el HTML final.
- No se generó un build live con una Site Key real: el worktree no contiene una configuración local
  autorizada con `PUBLIC_TURNSTILE_SITE_KEY`, y no se inventó ni se copió una.

El build Docker se intentó con BuildKit y con el builder legado, ambos con límite de tiempo. El
primero quedó bloqueado durante la copia de configuración y el segundo en la resolución de la etapa
base; no se creó una imagen candidata. Un `docker create` temporal también quedó bloqueado por el
daemon y fue cancelado. El contenedor existente `soka-web-demo-2026-8091` permaneció activo y no se
detuvo, reinició ni modificó. Por ello, la validación con Nginx en `8092` y la publicación del
candidato quedan pendientes de recuperar el funcionamiento del daemon Docker.

## Runbook de activación posterior

Solo después de aprobación legal y del fundador:

1. Confirmar que el Worker activo conserva `ALLOWED_ORIGINS=https://prueba.sokatechnologies.com`,
   hostname/action de Turnstile, binding `RATE_LIMITER` y los cuatro secretos configurados fuera de
   Git.
2. Construir la imagen candidata con los tres `--build-arg` públicos anteriores.
3. Ejecutarla en `127.0.0.1:8092` y revisar Contacto, Diagnóstico, consola, teclado y móvil.
4. Conservar el contenedor actual de `8091` como rollback.
5. Sustituir exclusivamente el contenedor de `8091` por la imagen candidata.
6. Desde el dominio autorizado, realizar una solicitud de prueba en Contacto y otra en Diagnóstico.
7. Confirmar dos correos en `info@sokatechnologies.com`, Reply-To, contenido mínimo y ausencia de
   secretos en el mensaje o logs.
8. Si alguna comprobación falla, restaurar el contenedor anterior y reconstruir modo demo.

No se debe usar un override de versión del Worker desde el navegador para el flujo normal; el
frontend debe llamar a la URL HTTPS estable cuando la activación haya sido aprobada.

## Rollback exacto

```bash
docker stop soka-web-demo-2026-8091
docker rename soka-web-demo-2026-8091 soka-web-demo-2026-8091-failed-04b3
docker run -d --name soka-web-demo-2026-8091 \
  --restart unless-stopped \
  -p 127.0.0.1:8091:80 \
  soka-web-demo-2026-03b-previous
```

Los nombres `soka-web-demo-2026-03b-previous` y la política exacta de reinicio deben sustituirse
por los valores observados en el host antes de ejecutar; este bloque es una plantilla operativa,
no se ejecuta en esta tarea. Para volver a demo se reconstruye con los valores por defecto, sin
endpoint ni Site Key.

## Estado de secretos y recomendación

No se han leído, copiado, impreso ni versionado secretos. El worktree local del Worker queda fuera
de esta rama. `worker/wrangler.toml` y la distribución del Worker no se modifican.

**Recomendación: NO-GO para activación pública.** El código candidato puede revisarse en un puerto
temporal, pero la activación debe esperar la aprobación legal, la Site Key pública autorizada y el
runbook de rollback verificado contra los nombres reales del host.
