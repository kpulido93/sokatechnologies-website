# Formularios de produccion para SokaTechnologies

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Objetivo

Definir una estrategia realista para publicar el formulario de diagnostico sin exponer secretos en el cliente, sin pedir datos sensibles y sin acoplar la web a una integracion improvisada.

## Estado actual

El formulario del sitio quedo preparado en modo seguro:

- valida campos requeridos en cliente
- exige consentimiento explicito
- muestra mensaje de exito y error
- incluye honeypot basico anti-spam
- enlaza a politica de privacidad
- no envia ni almacena datos mientras `PUBLIC_FORM_PROVIDER=demo`

Cambios relacionados:

- `src/components/ContactForm.astro`
- `src/styles/global.css`
- `.env.example`
- `src/env.d.ts`

## Recomendacion principal

### Opcion recomendada

`Cloudflare Worker + Turnstile + Resend`

Motivo:

- encaja con la estrategia de despliegue ya recomendada para sitio estatico
- mantiene los secretos del lado servidor
- permite validacion anti-spam real antes del envio
- deja una ruta limpia para guardar leads en CRM o reenviar a API propia despues

Flujo recomendado:

1. El navegador envia el formulario a un endpoint propio, por ejemplo `/api/contact`.
2. El Worker valida honeypot, metodo, campos y consentimiento.
3. El Worker valida el token de Turnstile del lado servidor.
4. Si pasa, el Worker envia el correo via Resend o reenvia a la API interna que se defina.
5. El Worker responde JSON con estado de exito o error.

## Opcion mas rapida sin backend propio

`Formspree`

Conviene si:

- se quiere salir rapido con una landing estatica
- no se necesita logica compleja
- basta con recibir leads por email o panel

Condiciones:

- restringir el formulario por dominio
- activar proteccion anti-spam y captcha donde aplique
- no usarlo como solucion final si luego se requerira CRM, scoring o integraciones internas

## Comparativa corta

| Opcion | Ventajas | Riesgos / limites | Recomendacion |
|---|---|---|---|
| Cloudflare Worker + Turnstile + Resend | control total, secretos en servidor, escalable, compatible con Pages | requiere algo mas de implementacion | recomendada |
| Formspree | salida rapida, simple para static sites, panel y notificaciones | menos control, dependencia externa, costes al crecer | recomendada como puente |
| Netlify Forms | buena DX si el deploy vive en Netlify | acoplada a Netlify, no encaja si el hosting principal sera Cloudflare | usar solo si el hosting cambia a Netlify |
| API propia | maximo control e integracion | mayor coste de implementacion y operacion | buena evolucion futura |
| Resend directo desde cliente | no aplica de forma segura | expondrias secretos | no usar |
| EmailJS | evita backend propio | mas superficie de abuso y menor control operacional | no recomendada como opcion principal |
| Google Forms | rapida y conocida | UX pobre, branding ajeno, poca coherencia comercial | solo fallback interno, no experiencia principal |

## Variables seguras

`.env.example` quedo actualizado con placeholders.

### Publicas

Estas pueden llegar al cliente:

- `PUBLIC_FORM_PROVIDER`
- `PUBLIC_CONTACT_FORM_ENDPOINT`
- `PUBLIC_CONTACT_FALLBACK_EMAIL`
- `PUBLIC_TURNSTILE_SITE_KEY`

### Privadas

Estas no deben quedar en el cliente ni en el repo:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEADS_TO_EMAIL`

## Requisitos funcionales del formulario

- No pedir contrasenas, tokens, llaves privadas ni accesos.
- No pedir datos regulatorios o datos de clientes.
- Exigir consentimiento explicito.
- Incluir enlace a politica de privacidad.
- Definir mensaje de exito y de error.
- Incluir proteccion basica anti-spam.
- Mantener un canal alternativo por correo corporativo.

## Alcance del endurecimiento aplicado

El codigo actual ya soporta:

- `mode=demo` por defecto
- submit real solo si existe `PUBLIC_CONTACT_FORM_ENDPOINT`
- validacion nativa del navegador
- honeypot `website`
- estados accesibles via `role="status"` y `role="alert"`
- CTA alternativo por correo

No se implemento todavia:

- Turnstile embebido
- endpoint real
- persistencia
- integracion con CRM
- limitacion de tasa del lado servidor

## Recomendacion de implementacion por fases

### Fase 1

Publicar con `Formspree` o mantener `demo` mientras se valida contenido y UX.

### Fase 2

Mover a `Cloudflare Worker + Turnstile + Resend`.

### Fase 3

Si el proceso comercial lo requiere, integrar el Worker con API propia, CRM o automatizacion de seguimiento.

## Riesgos pendientes

- El formulario aun no valida reputacion ni rate limit del lado servidor.
- Turnstile solo esta documentado; no se inserto widget ni verificacion real.
- Si se elige Netlify Forms, harian falta atributos especificos de Netlify en el markup final.
- Si se elige Formspree, hay que revisar limites, dominios autorizados y politica de retencion antes de publicar.

## Go / no-go para conectar envio real

Se puede conectar envio real cuando:

- exista proveedor definido para staging
- las variables privadas esten cargadas fuera del repo
- la politica de privacidad este revisada
- el destino de leads este confirmado
- se haya probado spam basico y errores de red

No conectar todavia si:

- el endpoint apunta a `localhost`
- las variables estan vacias
- no existe validacion server-side
- no hay revision legal o comercial del texto de consentimiento

## Fuentes oficiales revisadas

- Formspree: https://formspree.io/
- Restriccion por dominio en Formspree: https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain
- Anti-spam en Formspree: https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam/
- Netlify Forms: https://docs.netlify.com/manage/forms/setup/
- Spam filters de Netlify: https://docs.netlify.com/manage/forms/spam-filters/
- Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/
- Validacion server-side obligatoria de Turnstile: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Cloudflare Email Routing / Email Service: https://developers.cloudflare.com/email-service/
- Resend: https://resend.com/docs/introduction
- EmailJS: https://www.emailjs.com/
- Google Forms: https://support.google.com/docs/answer/2839588
