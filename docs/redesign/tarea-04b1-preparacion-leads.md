# Tarea 04-B1 — Preparación segura de recepción real de leads

Fecha: 2026-10-20
Rama: `codex/tarea-04b1-preparacion-leads`
Estado: preparado para revisión; no desplegado ni activado

## Alcance

La aplicación Astro conserva `output: "static"` y Nginx continúa sirviendo archivos estáticos.
El Worker de `worker/` es un servicio independiente para el endpoint de leads; no se integra en
el contenedor Astro ni procesa `POST` desde Nginx.

Esta tarea deja código y configuración de referencia listos para una activación posterior. No se
han usado credenciales reales, no se ha publicado el Worker y el formulario del sitio sigue en
modo demo por defecto.

## Contrato endurecido

Endpoint exacto:

```text
POST /api/leads
```

El Worker rechaza otras rutas, métodos distintos de `POST`/`OPTIONS` y orígenes que no coincidan
exactamente con `ALLOWED_ORIGINS`. No se acepta `*` ni orígenes con rutas, credenciales o puertos
implícitos.

La solicitud debe cumplir:

- `Content-Type`: `application/json` o `application/x-www-form-urlencoded`.
- Cuerpo máximo: 32 KiB; se comprueba `Content-Length` cuando existe y también el cuerpo real.
- `CF-Connecting-IP`: obligatorio para construir el bucket estable `lead:<ip>`; no se usa
  `X-Forwarded-For` ni el correo como sustituto de identidad.
- `Idempotency-Key`: obligatorio en el envío real, con 1–256 caracteres seguros. Se reenvía a
  Resend para que los reintentos con la misma clave no creen correos duplicados.
- Campos, longitudes, correo, consentimiento, honeypot, servicio y tipo de problema validados en
  el Worker.
- Turnstile válido antes de llamar a Resend.

El destinatario se fija en `info@sokatechnologies.com`. El `Reply-To` solo usa el correo ya
validado del prospecto. El HTML del mensaje escapa los datos recibidos y el Worker no registra el
contenido del lead.

## Turnstile

Todo envío real falla cerrado con `503 turnstile_not_configured` si falta cualquiera de:

- `TURNSTILE_SECRET_KEY` como secreto del Worker.
- `TURNSTILE_EXPECTED_HOSTNAME`.
- `TURNSTILE_EXPECTED_ACTION`.

La configuración de referencia usa:

```text
hostname: prueba.sokatechnologies.com
action: lead
```

La respuesta de Siteverify debe indicar `success: true` y coincidir exactamente con el hostname y
la acción esperados. El widget Astro usa `data-action="lead"` y solo se renderiza cuando el modo
Worker tiene endpoint HTTPS y sitekey público configurados. La sitekey puede exponerse al cliente;
el secreto nunca debe hacerlo.

Antes de activarlo, el fundador debe crear o confirmar un widget Turnstile restringido a
`prueba.sokatechnologies.com`, obtener su sitekey y cargar el secreto fuera de Git. Para producción
se debe usar un widget y hostname separados.

## Rate limiting y duplicados

`RATE_LIMITER` es un binding obligatorio. Si falta, devuelve `503 rate_limit_not_configured`; si
falla, también se rechaza la solicitud. La clave usa únicamente la IP entregada por Cloudflare,
por lo que cambiar el correo no reinicia el contador.

La configuración de referencia es de 5 solicitudes por 60 segundos. Cloudflare documenta que el
Rate Limiting API es eventual y local a la ubicación del Worker; no debe tratarse como contabilidad
exacta ni como almacenamiento de leads.

El navegador genera una clave de idempotencia por intento y la conserva si debe reintentarse con los mismos datos. Tras
un éxito o una edición de los datos comerciales, genera una nueva clave. El Worker la pasa a Resend
mediante `Idempotency-Key`; el proveedor debe conservar esa garantía para reintentos del mismo mensaje.

**Turnstile es de un solo uso:** el navegador reinicia el widget después de cada fallo de envío,
incluyendo errores de Resend o una respuesta de red incierta, para adquirir un token nuevo antes
del siguiente intento. El reinicio del challenge no rota la clave de idempotencia si el contenido
del lead no cambió; así se pueden reintentar entregas sin duplicar correos. Si el usuario cambia
los campos, la clave debe renovarse para evitar un `409` de Resend por petición distinta.

## Configuración aislada de Cloudflare

`worker/wrangler.toml` contiene únicamente variables no secretas y el binding de referencia:

- `ALLOWED_ORIGINS=https://prueba.sokatechnologies.com`
- `TURNSTILE_EXPECTED_HOSTNAME=prueba.sokatechnologies.com`
- `TURNSTILE_EXPECTED_ACTION=lead`
- `RATE_LIMITER`, con 5 solicitudes por 60 segundos

El `namespace_id` está marcado como placeholder y debe sustituirse por el identificador real de la
cuenta antes de cualquier despliegue. No se añadieron `routes`, `custom_domains`, DNS ni cambios
de Cloudflare Tunnel o Access.

La activación aislada prevista es:

1. Crear o confirmar el Worker en un entorno/cuenta aprobados.
2. Sustituir el `namespace_id` por el valor real.
3. Configurar secretos mediante Wrangler o el gestor de secretos de Cloudflare, nunca en Git.
4. Ejecutar pruebas remotas controladas contra un endpoint separado.
5. Configurar la URL HTTPS del Worker en `PUBLIC_CONTACT_FORM_ENDPOINT` y `PUBLIC_FORM_PROVIDER=worker`
   solo después de aprobar el widget, Resend, privacidad y rollback.
6. Mantener el fallback por correo y el modo demo como reversión inmediata.

No se ejecutó `wrangler deploy` en esta tarea.

## Resend y correo remitente

Variables privadas:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEADS_TO_EMAIL=info@sokatechnologies.com`
- `TURNSTILE_SECRET_KEY`

`RESEND_FROM_EMAIL` debe pertenecer a un dominio verificado en Resend. `leads@sokatechnologies.com`
es una propuesta técnica, no una configuración confirmada. Antes de usarla hay que:

1. Confirmar que el equipo tiene control de `sokatechnologies.com` en Resend.
2. Crear/verificar el dominio o subdominio remitente en Resend.
3. Revisar los registros SPF, DKIM y DMARC existentes y los registros exactos que Resend solicite.
4. Añadir solo registros compatibles, sin sustituir MX, SPF o DMARC existentes sin aprobación.
5. Confirmar la verificación y hacer una prueba controlada fuera de producción.

No se modificó DNS ni se ejecutó un envío real.

### Línea base DNS observada en lectura

La consulta pública del 20 de octubre de 2026 mostró:

- nameservers de Cloudflare;
- un registro SPF existente en el dominio raíz con `~all`, autorización por `A`, `MX` y la IP
  actualmente publicada;
- DMARC existente con política `p=none` y reportes agregados;
- no se observaron registros `resend._domainkey` ni los registros habituales bajo `send.` en las
  consultas realizadas.

Esto no confirma qué proveedor recibe actualmente el correo ni sustituye la pantalla de dominio de
Resend. Si Resend solicita SPF, debe integrarse en el registro SPF existente, no publicarse como un
segundo SPF; los registros DKIM y cualquier MX/CNAME adicional deben revisarse contra los registros
actuales antes de aplicar cambios.

## Privacidad y revisión legal

`/politica-privacidad/` y `/terminos/` continúan marcados como borradores. Antes de recibir datos
reales hay que revisar, como mínimo:

- responsable del tratamiento y canal de contacto;
- finalidad y base legal de la respuesta comercial;
- campos recopilados y prohibición de enviar secretos o datos sensibles;
- proveedores involucrados: Cloudflare Turnstile y Resend;
- transferencias internacionales, retención, eliminación y control de acceso;
- uso de cookies, scripts y telemetría asociada al widget;
- derechos de las personas y procedimiento de atención;
- texto del consentimiento y coherencia con el correo `info@sokatechnologies.com`.

No debe presentarse la política actual como definitiva ni activar el modo real hasta completar esa
revisión.

## Respuestas previstas

| Situación | Respuesta |
|---|---:|
| Solicitud aceptada después de Resend | `200` |
| Datos inválidos, consentimiento o clave de idempotencia ausente | `400` |
| Content-Type no admitido | `415` |
| Cuerpo superior a 32 KiB | `413` |
| Origen o Turnstile rechazado | `403` |
| Ruta inexistente | `404` |
| Método no permitido | `405` |
| Rate limit excedido | `429` |
| Rate limiter, IP o Turnstile sin configuración segura | `503` |
| Rechazo o error de red de Resend | `502` |

Los errores son códigos generales; no devuelven secretos, respuestas completas de proveedores ni
datos personales.

## Rollback de activación futura

1. Cambiar la configuración pública a `PUBLIC_FORM_PROVIDER=demo`.
2. Vaciar `PUBLIC_CONTACT_FORM_ENDPOINT`.
3. Reconstruir y publicar solo el sitio estático aprobado.
4. Deshabilitar o retirar la ruta del Worker si fue creada.
5. Mantener los secretos fuera de Git y revocarlos/rotarlos si se sospecha exposición.

La reversión no requiere modificar WordPress, DNS, Cloudflare Tunnel ni el contenido editorial.

## Acciones que requieren aprobación del fundador

- cuenta y namespace de Cloudflare para `RATE_LIMITER`;
- widget Turnstile de staging y su hostname autorizado;
- URL aislada del Worker;
- proveedor y dominio remitente verificado en Resend;
- destinatario operativo y proceso de atención de `info@sokatechnologies.com`;
- cambios DNS SPF/DKIM/DMARC, si fueran necesarios;
- texto legal final y activación del primer envío real.

## Fuentes oficiales consultadas

- [Cloudflare Turnstile: validación server-side](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Turnstile: gestión de hostnames](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/)
- [Cloudflare Workers: Rate Limiting binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [Resend: claves de idempotencia](https://resend.com/changelog/idempotency-keys)
