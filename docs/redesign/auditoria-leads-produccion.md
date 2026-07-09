# Estrategia de leads para `/auditoria`

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Objetivo

Definir una estrategia segura para capturar leads de la auditoria web de SokaTechnologies sin exponer secretos, sin guardar datos personales en archivos del repositorio y sin depender todavia de integraciones aprobadas en produccion.

## Contexto actual

- La landing `/auditoria` ya permite capturar contexto comercial y generar un reporte inicial.
- El endpoint `/api/audit` hoy compila, pero en la estrategia actual de Astro con `output: "static"` no procesa `POST` reales en despliegue estatico.
- Antes de guardar leads en produccion hace falta:
  - runtime server-side aprobado para la ruta
  - proteccion anti-spam
  - manejo de secretos fuera del repo
  - politica clara de privacidad y retencion

## Criterios de seguridad obligatorios

- No guardar API keys en el repositorio.
- No exponer tokens en variables `PUBLIC_*`.
- No almacenar datos personales en archivos JSON, Markdown o logs del repo.
- No escribir leads en `public/`, `docs/`, `content/` ni archivos versionados.
- Validar URL, email y consentimiento antes de persistir.
- Aplicar rate limiting y captcha o challenge equivalente antes de aceptar volumen real.
- Mantener la captura en server-side, worker o plataforma con secretos gestionados fuera del cliente.

## Opciones evaluadas

### 1. Supabase

Pros:
- buena base para tabla `audit_leads`
- API y SQL claros
- permite RLS, auditoria y evoluciones posteriores
- encaja mejor si luego se quiere panel interno o seguimiento comercial

Contras:
- requiere `service role key` o backend intermedio
- añade complejidad de esquema, migraciones y politica de acceso
- no conviene conectarlo directamente desde cliente

Complejidad:
- media

Encaje:
- alto para fase 2

### 2. Airtable

Pros:
- rapido de operar para equipo comercial
- buena vista tabular para leads iniciales
- baja curva para revisar estados manualmente

Contras:
- dependencia de tercero tipo SaaS
- token sensible server-side
- peor ruta si luego se requiere reglas mas serias, trazabilidad o costos previsibles

Complejidad:
- baja a media

Encaje:
- bueno para MVP liviano, no ideal como destino final

### 3. Google Sheets via Apps Script

Pros:
- costo bajo
- facil de revisar para operaciones muy pequenas
- implementacion inicial rapida

Contras:
- control de seguridad mas fragil si se improvisa
- logging, errores y retries menos claros
- dificil de escalar sin deuda operativa

Complejidad:
- baja

Encaje:
- aceptable solo como puente temporal y muy controlado

### 4. Resend + email solamente

Pros:
- MVP mas simple
- no obliga a resolver persistencia completa desde el dia 1
- deja rastro en inbox comercial y evita schema prematuro
- ya existe espacio natural en la configuracion del proyecto para `RESEND_*`

Contras:
- no hay base estructurada por defecto
- depende de disciplina operativa del inbox
- puede quedarse corto si sube el volumen

Complejidad:
- baja

Encaje:
- mejor opcion para fase MVP

### 5. Cloudflare D1

Pros:
- buena opcion si el deploy final vive en Cloudflare Workers
- almacenamiento SQL simple cerca del runtime
- util si se prioriza edge y bajo costo

Contras:
- no tiene sentido si el hosting final no esta en Cloudflare
- requiere alinear toda la ruta de despliegue
- aumenta la dependencia de plataforma

Complejidad:
- media

Encaje:
- bueno solo si la estrategia de deploy termina en Cloudflare

### 6. Base propia posterior

Pros:
- control total
- mejor ruta para CRM interno, trazabilidad y procesos propios
- evita dependencia fuerte de SaaS externo

Contras:
- mas tiempo de implementacion
- requiere definir autenticacion, esquema, observabilidad y soporte
- exceso de esfuerzo para una primera salida

Complejidad:
- alta

Encaje:
- adecuado para fase 3, no para MVP

## Recomendacion

### MVP recomendado

1. Recibir la solicitud en runtime server-side aprobado.
2. Validar input, consentimiento, honeypot, rate limiting y captcha/challenge.
3. Enviar resumen del lead por email con Resend a inbox comercial.
4. No persistir en base todavia, o hacerlo solo si el equipo ya necesita seguimiento estructurado.

Motivo:

- es la ruta con menor friccion operacional
- evita bloquear el lanzamiento por una base de datos prematura
- mantiene secretos solo del lado servidor
- permite validar volumen y calidad real de leads antes de elegir almacenamiento permanente

### Fase 2 recomendada

Persistir leads en Supabase o Airtable.

Preferencia:

- `Supabase` si se quiere control, consultas y evolucion futura
- `Airtable` si el volumen es bajo y la prioridad inmediata es operacion comercial manual

### Fase 3 recomendada

Mover a base propia o stack mas formal solo cuando exista evidencia de volumen, proceso comercial y necesidades de trazabilidad mas complejas.

## Arquitectura sugerida

### Flujo MVP

1. Usuario envia formulario en `/auditoria`.
2. Endpoint server-side valida:
   - consentimiento
   - honeypot
   - formato de email
   - URL publica
   - rate limit
   - challenge anti-spam
3. Se genera reporte inicial.
4. Se dispara email server-side con:
   - datos del lead
   - resumen del reporte
   - enlace a diagnostico/contacto
5. Se responde al cliente sin exponer proveedor ni secretos.

### Flujo fase 2

1. Todo lo anterior.
2. Ademas se guarda una fila estructurada en:
   - Supabase o
   - Airtable
3. Se agrega estado comercial:
   - `new`
   - `reviewed`
   - `contacted`
   - `qualified`
   - `discarded`

## Rate limiting y anti-spam

Minimo para produccion:

- honeypot oculto
- captcha o challenge
- rate limiting por IP y ventana corta
- limite por email o dominio si hay abuso
- rechazo explicito de URLs privadas o entornos internos

Sugerencia inicial:

- `AUDIT_RATE_LIMIT_MAX=5`
- `AUDIT_RATE_LIMIT_WINDOW_SECONDS=60`

Esto no reemplaza controles reales de infraestructura; solo documenta valores iniciales razonables.

## Datos que si conviene guardar

- URL publica auditada
- nombre
- empresa
- email
- WhatsApp opcional
- pais
- tipo de empresa
- principal problema
- timestamp
- resumen del reporte
- recomendaciones sugeridas
- estado comercial

## Datos que no conviene guardar

- contrasenas
- tokens
- capturas internas
- paneles privados
- secretos tecnicos
- resultados de auditorias privadas no consentidas

## Variables de entorno propuestas

Mantenerlas solo del lado servidor o plataforma:

- `AUDIT_LEAD_PROVIDER`
- `AUDIT_RATE_LIMIT_MAX`
- `AUDIT_RATE_LIMIT_WINDOW_SECONDS`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LEADS_TO_EMAIL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_AUDIT_LEADS_TABLE`
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`
- `GOOGLE_APPS_SCRIPT_AUDIT_WEBHOOK_URL`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CUSTOM_AUDIT_API_URL`

## Implementacion segura en este repo

Se creo una interfaz en:

- `src/lib/audit/leadStorage.ts`

Lo que hace:

- define proveedores admitidos
- define forma del lead
- define configuracion esperada
- deja un adapter `stub`

Lo que no hace:

- no envia datos reales
- no guarda leads
- no llama APIs
- no usa secretos

## Riesgos pendientes

- mientras `/api/audit` siga bajo `output: "static"`, no existe captura real de leads en despliegue estatico
- si se usa solo email como MVP, puede faltar trazabilidad estructurada
- Airtable o Sheets pueden volverse deuda si el volumen sube rapido
- sin rate limiting y captcha reales, el formulario es vulnerable a abuso

## Decision recomendada

Ruta sugerida:

1. aprobar runtime server-side para `/api/audit`
2. implementar Resend server-side como MVP
3. activar honeypot + rate limiting + challenge
4. medir volumen y calidad de leads
5. pasar a Supabase como almacenamiento estructurado cuando el volumen lo justifique

## Que no se hizo aqui

- no se conecto ningun proveedor real
- no se insertaron secretos
- no se persistieron datos personales
- no se modifico WordPress
