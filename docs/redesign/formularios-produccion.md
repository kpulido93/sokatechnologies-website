# Formularios de produccion para SokaTechnologies

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Objetivo

Definir una estrategia realista para publicar el formulario de diagnostico sin exponer secretos en el cliente, sin pedir datos sensibles y sin acoplar la web a una integracion improvisada.

## Estado actual

El formulario del sitio queda preparado en modo seguro y demo por defecto:

- valida campos requeridos en cliente
- exige consentimiento explicito
- muestra mensaje de exito y error
- incluye honeypot basico anti-spam
- enlaza a politica de privacidad
- no envia ni almacena datos mientras `PUBLIC_FORM_PROVIDER=demo`
- solo considera modo real cuando `PUBLIC_FORM_PROVIDER=worker` y el endpoint es HTTPS o un origen local de desarrollo
- conserva el fallback por correo y una alternativa usable sin JavaScript

Cambios relacionados:

- `src/components/ContactForm.astro`
- `src/styles/global.css`
- `.env.example`
- `src/env.d.ts`
- `worker/src/index.mjs`
- `worker/src/validation.mjs`
- `worker/test/validation.test.mjs`

## Implementacion de Tarea 04-A

El Worker independiente preparado en `worker/` recibe Contacto y Diagnóstico en un único endpoint. No forma parte del runtime estático de Astro y no está desplegado.

Astro conserva `output: "static"` y el contenedor Nginx continúa sirviendo archivos estáticos; no procesa `POST`. El envío real se habilitará únicamente cuando el navegador apunte a un Worker desplegado y configurado.

### Contrato del endpoint

`POST /api/leads` acepta `application/json` y `application/x-www-form-urlencoded`. El origen debe aparecer en `Origin` y coincidir exactamente con `ALLOWED_ORIGINS`.

Campos:

- obligatorios: `formType` (`contact` o `diagnostico`), `name`, `company`, `email`, `summary`, `consent`
- opcionales: `phone`, `country`, `service`, `problemType`
- anti-spam: `website` debe estar vacío
- Turnstile: `turnstileToken` o `cf-turnstile-response` cuando `TURNSTILE_SECRET_KEY` esté configurada

El catálogo válido de `service` contiene únicamente las siete categorías comerciales: software a medida, automatizaciones e integraciones, Power BI y Business Intelligence, consultoría TI y DevOps, infraestructura cloud/on-prem, sitios web corporativos y soporte/mantenimiento/mejora continua.

Respuestas relevantes: `200` solo después de una respuesta exitosa de Resend, `400` para datos inválidos, `403` para origen o Turnstile rechazado, `429` para rate limit, `502` si Resend rechaza el envío y `503` si falta configuración segura del Worker.

El Worker no registra el contenido del lead. Escapa los datos antes de construir el HTML, usa el correo validado únicamente como `Reply-To` y fuerza `info@sokatechnologies.com` como destinatario aprobado.

### Variables del Worker

Privadas o gestionadas fuera de Git:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEADS_TO_EMAIL=info@sokatechnologies.com`
- `TURNSTILE_SECRET_KEY` (activa la verificación server-side)

Configuración no secreta:

- `ALLOWED_ORIGINS`: lista separada por comas de orígenes exactos, sin permitir `*`
- binding `RATE_LIMITER`: obligatorio; la configuración de referencia usa 5 solicitudes por 60 segundos

El archivo `worker/wrangler.toml` contiene una configuración de referencia. Hay que reemplazar el `namespace_id`, confirmar los dominios y cargar los secretos con el mecanismo de Cloudflare antes de cualquier despliegue.

## Recomendacion principal

### Opcion recomendada

`Cloudflare Worker + Turnstile + Resend`

Motivo:

- encaja con la estrategia de despliegue ya recomendada para sitio estatico
- mantiene los secretos del lado servidor
- permite validacion anti-spam real antes del envio
- deja una ruta limpia para guardar leads en CRM o reenviar a API propia despues

Flujo recomendado:

1. El navegador envia el formulario a un endpoint propio, por ejemplo `/api/leads`.
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
- submit real solo con proveedor `worker` y endpoint permitido
- validacion nativa del navegador
- honeypot `website`
- estados accesibles via `role="status"` y `role="alert"`
- bloqueo de envíos duplicados mientras una solicitud está en proceso
- preservación de campos cuando falla el endpoint
- CTA alternativo por correo

No se activó todavía:

- endpoint público del Worker
- credenciales reales de Resend o Turnstile
- persistencia
- integracion con CRM
- configuración real del binding de rate limiting

## Recomendacion de implementacion por fases

### Fase 1

Mantener `demo` mientras se valida contenido, UX, consentimiento y política de privacidad.

### Fase 2

Mover a `Cloudflare Worker + Turnstile + Resend`.

Para probar localmente la lógica sin credenciales se ejecuta `npm test`; las pruebas usan respuestas simuladas y un rate limiter falso inyectado solo en el test. No existe un interruptor de simulación en el Worker que pueda activarse accidentalmente en producción.

Instalación y comprobaciones:

```bash
npm ci
npm test
npm run check
npm run build
```

El Worker puede inspeccionarse con Wrangler en un entorno separado, pero no debe publicarse desde esta tarea. Antes del primer deploy hay que definir el dominio del endpoint, los `ALLOWED_ORIGINS`, el binding real `RATE_LIMITER`, el widget Turnstile y el dominio remitente verificado en Resend.

Rollback futuro: retirar la URL del Worker de la configuración pública, volver a `PUBLIC_FORM_PROVIDER=demo` y dejar `PUBLIC_CONTACT_FORM_ENDPOINT` vacío; el sitio estático seguirá usando el fallback por correo.

### Fase 3

Si el proceso comercial lo requiere, integrar el Worker con API propia, CRM o automatizacion de seguimiento.

## Riesgos pendientes

- El Worker preparado todavía no está desplegado ni conectado al formulario de staging.
- La limitación de tasa depende de configurar el binding real; no se utiliza un contador en memoria.
- El widget Turnstile solo se renderiza cuando el modo Worker y el sitekey público están configurados; la verificación real depende del secreto del Worker.
- Si se elige Netlify Forms, harian falta atributos especificos de Netlify en el markup final.
- Si se elige Formspree, hay que revisar limites, dominios autorizados y politica de retencion antes de publicar.

## Go / no-go para conectar envio real

Se puede conectar envio real cuando:

- exista proveedor definido para staging
- las variables privadas esten cargadas fuera del repo
- el dominio remitente esté verificado en Resend
- el binding de rate limiting exista y sus límites hayan sido comprobados
- Turnstile esté configurado para los hostnames autorizados
- la politica de privacidad este revisada
- el destino de leads este confirmado
- se haya probado spam basico y errores de red

No conectar todavia si:

- el endpoint apunta a `localhost`
- las variables estan vacias
- no existe validacion server-side
- no hay revision legal o comercial del texto de consentimiento

La verificación server-side de Turnstile es obligatoria: el sitekey público nunca sustituye la comprobación del token en el Worker.

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
