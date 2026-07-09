# Auditoria de seguridad, privacidad y abuso para `/auditoria`

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Resumen ejecutivo

El flujo actual de `/auditoria` ya incorpora varias protecciones utiles para una fase MVP:

- validacion server-side de input
- bloqueo de protocolos no permitidos
- bloqueo de `localhost`, loopback, IPs privadas y metadata cloud
- consentimiento obligatorio
- timeout en PageSpeed
- sin persistencia real de datos
- sin secretos en el repositorio

Sin embargo, **todavia no esta listo para produccion** por tres motivos principales:

1. no hay rate limiting real aplicado en el endpoint
2. no hay captcha o challenge activo
3. `/api/audit` sigue bajo estrategia `static`, por lo que el `POST` real no queda operativo en despliegue estatico

## Alcance revisado

- `src/pages/auditoria.astro`
- `src/components/AuditForm.astro`
- `src/pages/api/audit.ts`
- `src/lib/audit/`
- `.env.example`

## Ajustes criticos aplicados en esta revision

### 1. Bloqueo de URLs con credenciales embebidas

Archivo:

- `src/lib/audit/urlSafety.ts`

Motivo:

- una URL tipo `https://usuario:clave@dominio.com` no debe aceptarse
- puede filtrar secretos del usuario o contaminar logs y proveedores externos

Estado:

- aplicado

### 2. Longitud maxima de `websiteUrl` validada tambien en servidor

Archivo:

- `src/lib/audit/validateAuditInput.ts`

Motivo:

- el formulario ya tenia `maxlength="200"`, pero faltaba la validacion backend
- evita payloads innecesarios o abuso por inputs desproporcionados

Estado:

- aplicado

## Hallazgos por categoria

### 1. SSRF y seguridad de URLs

Estado actual:

- solo se permiten `http` y `https`
- se bloquea:
  - `localhost`
  - `127.0.0.1`
  - `0.0.0.0`
  - IPs privadas y reservadas
  - IPs de metadata cloud
  - dominios `.internal`, `.local`, `.localhost`
  - URLs con credenciales embebidas

Archivos:

- `src/lib/audit/urlSafety.ts`
- `src/lib/audit/validateAuditInput.ts`

Evaluacion:

- bien para esta etapa

Observacion importante:

- el endpoint no hace crawling directo del sitio objetivo
- la unica integracion externa actual es Google PageSpeed, que consulta la URL desde infraestructura de Google, no desde la nuestra

Riesgo pendiente:

- si en el futuro se agrega fetch directo, screenshots, scraping o crawling propio, hara falta una politica mas estricta de resolucion DNS, puertos, redirects y allowlist/denylist operativa

### 2. Redirects

Estado actual:

- la URL inicial se valida antes de pasar a PageSpeed
- no hay revalidacion explicita del `finalDisplayedUrl` que devuelve PageSpeed

Evaluacion:

- aceptable por ahora porque el sistema no usa ese `finalUrl` para nuevos fetches ni decisiones sensibles

Pendiente:

- si una futura version usa el destino final para otras acciones, conviene revalidarlo con las mismas reglas de seguridad

### 3. Timeout y abuso de integraciones externas

Estado actual:

- `runPageSpeedAudit()` usa `AbortController`
- timeout por defecto: `15_000 ms`
- maneja:
  - timeout
  - `429`
  - error de Google API
  - respuesta incompleta
  - error de red

Archivo:

- `src/lib/audit/pagespeed.ts`

Evaluacion:

- correcto para un MVP

Riesgo pendiente:

- sin rate limiting real, un actor puede intentar abusar del endpoint para forzar llamadas repetidas a PageSpeed cuando exista runtime server-side

### 4. Rate limiting

Estado actual:

- documentado en `.env.example`
- modelado en `src/lib/audit/leadStorage.ts`
- **no implementado todavia en `/api/audit`**

Variables documentadas:

- `AUDIT_RATE_LIMIT_MAX`
- `AUDIT_RATE_LIMIT_WINDOW_SECONDS`

Evaluacion:

- pendiente critico antes de produccion

Recomendacion:

- aplicar rate limiting por IP y por ventana de tiempo en el runtime server-side real
- si el despliegue termina en edge o worker, resolverlo en esa capa

### 5. Captcha / challenge anti-spam

Estado actual:

- `PUBLIC_TURNSTILE_SITE_KEY` existe en configuracion
- no hay verificacion server-side activa
- no hay challenge aplicado al flujo real

Evaluacion:

- pendiente critico antes de produccion

Recomendacion:

- usar Turnstile u otro challenge equivalente
- validar el token exclusivamente del lado servidor

### 6. Consentimiento y privacidad visible

Estado actual:

- consentimiento obligatorio en el formulario
- el texto advierte no compartir contraseñas, tokens ni accesos
- hay enlace visible a politica de privacidad
- la pagina `/auditoria` explica que la revision es sobre señales visibles y sin accesos privados

Archivos:

- `src/components/AuditForm.astro`
- `src/pages/auditoria.astro`

Evaluacion:

- bien resuelto para el alcance actual

### 7. Almacenamiento de datos personales

Estado actual:

- no hay persistencia real de leads
- `src/lib/audit/leadStorage.ts` es solo una interfaz `stub`
- no se escriben datos personales en archivos del repo

Evaluacion:

- correcto

Pendiente:

- cuando se conecte Resend, Supabase, Airtable o similar, definir retencion, acceso y minimizacion de datos

### 8. Logs y exposicion accidental de PII

Estado actual:

- no hay `console.log` ni logging de request body en `/api/audit`
- no hay dumps del formulario a archivos versionados

Evaluacion:

- correcto

Pendiente:

- mantener esta politica cuando se integre provider real de leads

### 9. Secretos y variables de entorno

Estado actual:

- `.env.example` usa placeholders sin secretos reales
- las variables sensibles no usan prefijo `PUBLIC_*`
- no se detectaron API keys reales en los archivos revisados

Evaluacion:

- correcto

### 10. Runtime y superficie real de ataque

Estado actual:

- `astro.config.mjs` sigue con `output: "static"`
- el endpoint compila, pero en despliegue estatico no procesa `POST` reales

Impacto:

- hoy el riesgo de abuso real en produccion es menor porque el runtime POST no esta activo en ese modo
- esto **no** debe confundirse con “listo para produccion”

Pendiente:

- al aprobar runtime server-side para `/api/audit`, repetir esta auditoria con el adapter real y la infraestructura real

## Riesgos pendientes antes de produccion

### Criticos

- rate limiting no implementado
- captcha/challenge no implementado
- endpoint real no desplegable aun bajo `static`

### Medios

- no se revalida `finalDisplayedUrl` de PageSpeed para usos futuros
- no existe politica de retencion formal documentada para leads
- falta decidir donde viviran logs y metricas cuando el endpoint sea real

### Bajos

- el reporte cliente hace fallback local en previews estaticos; esto es correcto para demo, pero debe quedar claramente separado del flujo real de produccion

## Recomendaciones antes de staging

1. Aprobar runtime server-side para `/api/audit`.
2. Implementar rate limiting real por IP.
3. Implementar challenge/captcha con verificacion server-side.
4. Mantener `urlSafety` como punto unico de validacion y reutilizarlo si se agregan nuevas integraciones.
5. Si se usa `finalUrl` o redirects para otras acciones, revalidar el destino final.
6. Conectar proveedor de leads solo del lado servidor y sin logs de PII.
7. Documentar retencion y acceso a datos de leads.

## Estado final

### Lo que ya protege bien

- protocolos permitidos
- bloqueo de hosts/ips internas
- bloqueo de metadata cloud
- bloqueo de credenciales embebidas en URL
- consentimiento obligatorio
- sin almacenamiento real
- sin logging visible de PII
- timeout y manejo de errores externos

### Lo que sigue bloqueando produccion

- falta de rate limiting real
- falta de challenge/captcha real
- falta de runtime server-side aprobado para `POST`
