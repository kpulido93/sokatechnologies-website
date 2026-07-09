# Especificacion funcional del modulo `/auditoria`

Fecha: 2026-07-09  
Rama objetivo: `feature/web-demo-2026-gsap`

## 1. Objetivo del modulo

Crear una pagina y flujo de captacion tipo auditoria gratuita para identificar leads B2B con necesidad real de:

- sitios web corporativos mas claros y confiables
- mejor conversion comercial
- automatizaciones alrededor del proceso digital
- dashboards o reportes sobre leads, ventas u operacion
- software a medida para procesos que hoy se resuelven manualmente
- continuidad tecnica, soporte o infraestructura

El modulo no debe presentarse como una auditoria masiva generica ni como una promesa de resultados inmediatos. Debe posicionarse como una revision inicial consultiva de SokaTechnologies sobre un sitio publico y sus senales visibles de claridad, conversion y salud tecnica basica.

## 2. Publico objetivo

### Perfil principal

- empresas B2B en Panama, Republica Dominicana y Latinoamerica
- empresas de servicios, operaciones administrativas, manufactura ligera, logistica, salud privada, educacion privada, tecnologia y firmas profesionales
- negocios con sitio corporativo desactualizado, poco claro o con baja capacidad para generar conversaciones comerciales
- empresas con procesos manuales alrededor de formularios, seguimiento, reporting o soporte

### Perfil secundario

- empresas con producto propio o MVP que necesitan una revision externa de presentacion y conversion
- organizaciones con presencia digital minima que necesitan una ruta clara antes de redisenar o reconstruir

### Casos menos aptos para MVP

- sitios personales, blogs o portafolios individuales
- proyectos sin URL publica
- solicitudes de pentesting, forensica o auditoria legal
- empresas que buscan una garantia de rankings o ventas

## 3. Propuesta de valor

Propuesta central:

> "Recibe una revision inicial de tu sitio web y de sus senales mas visibles de claridad comercial, conversion y salud tecnica, con hallazgos priorizados y una recomendacion realista de siguientes pasos."

Valor esperado para el usuario:

- entender si su sitio explica bien la oferta
- detectar fricciones visibles en navegacion, formularios y CTA
- identificar senales tecnicas basicas que afectan confianza o descubrimiento
- recibir una ruta comercial razonable, no una lista generica de errores

Valor esperado para Soka:

- captar leads con mejor contexto
- filtrar solicitudes fuera de alcance
- abrir conversaciones hacia servicios y productos relacionados
- conectar necesidades visibles del sitio con problemas operativos mas profundos

## 4. Campos del formulario

### Campos visibles

| Campo | Tipo | Requerido | Validacion minima | Uso |
|---|---|---|---|---|
| URL del sitio web | `url` | si | `https://` o `http://`, dominio publico valido | objetivo de la auditoria |
| Nombre | `text` | si | 2-80 caracteres | contacto principal |
| Empresa | `text` | si | 2-120 caracteres | contexto comercial |
| Email | `email` | si | formato valido, max 120 | respuesta de auditoria |
| WhatsApp | `tel` | no | max 30, solo si quiere seguimiento | canal opcional |
| Pais | `text/select` | si | valor valido | prioridad comercial y horario |
| Tipo de empresa | `select` | si | categoria predefinida | segmentacion inicial |
| Principal problema | `textarea/select + textarea` | si | 30-800 caracteres | entender dolor principal |
| Consentimiento de contacto | `checkbox` | si | obligatorio | base de contacto y privacidad |

### Campos tecnicos recomendados no visibles

- `website` u otro honeypot
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `landing_variant`
- `submitted_at`
- `request_id`

### Opciones sugeridas para "Tipo de empresa"

- servicios B2B
- industria o manufactura
- salud o educacion privada
- tecnologia o SaaS
- inmobiliaria o administracion
- retail o comercio
- otra

### Opciones sugeridas para "Principal problema"

- el sitio no explica bien lo que hacemos
- recibimos pocos contactos calificados
- el sitio se ve desactualizado o poco confiable
- el formulario o seguimiento comercial es manual
- el sitio carga mal o se siente lento
- no tenemos claridad sobre SEO o visibilidad
- queremos redisenar, pero no sabemos por donde empezar

## 5. Flujo del usuario

### Flujo externo

1. El usuario entra a `/auditoria`.
2. Ve una propuesta clara de valor, alcance y limites.
3. Revisa ejemplos de lo que se analiza y lo que no.
4. Completa el formulario con URL publica y contexto comercial.
5. El sistema valida campos, consentimiento y controles anti-spam.
6. El usuario ve una pantalla de confirmacion con siguiente paso esperado.
7. Soka recibe el lead en cola de revision.
8. Se hace triage rapido: apto, fuera de alcance o requiere aclaracion.
9. Si es apto, se genera la auditoria inicial.
10. Se entrega por correo o se invita a una llamada de diagnostico, segun complejidad y calidad del lead.

### Flujo interno

1. Se valida que la URL sea publica y segura para revisar.
2. Se identifica el tipo de negocio y el principal dolor.
3. Se ejecuta una revision inicial basada en checklist.
4. Se produce un resumen corto con hallazgos priorizados.
5. Se adjunta una recomendacion comercial posible, sin forzar venta.
6. Se clasifica el lead por servicio relacionado.

## 6. Que se audita

La auditoria MVP debe centrarse en senales visibles y publicas. No requiere acceso privado.

### Alcance funcional

- claridad de propuesta de valor en el hero y primer scroll
- jerarquia de contenido y entendimiento rapido de la oferta
- navegacion principal y estructura de paginas clave
- calidad y visibilidad de CTA
- friccion visible en formularios o puntos de contacto
- consistencia mobile basica observable
- confianza visible: HTTPS, contacto, legal, casos, mensajes de soporte
- senales SEO basicas visibles: `title`, `description`, `h1`, indexabilidad publica, sitemap o robots si aplican
- senales tecnicas visibles: carga aparente, media pesada, errores publicos, enlaces obvios rotos
- alineacion entre el problema declarado por el lead y lo que el sitio comunica

### Entregable esperado de la auditoria

La respuesta MVP debe incluir:

- 3 a 5 hallazgos priorizados
- 2 a 3 acciones recomendadas de corto plazo
- una recomendacion de ruta posible con Soka
- aclaracion de limites del analisis

## 7. Que NO se audita

Queda fuera del alcance del modulo:

- pentesting o seguridad ofensiva
- acceso a paneles privados, CRM, analitica, hosting o repositorios
- auditoria de codigo fuente no publico
- revision profunda de backend o base de datos
- cumplimiento legal, fiscal o regulatorio
- posicionamiento SEO garantizado
- accesibilidad avanzada certificable
- migraciones, reescrituras o implementacion tecnica dentro de la auditoria gratuita
- pruebas sobre intranet, localhost, IPs privadas o ambientes cerrados
- auditoria de productos sensibles que requieran credenciales o datos reales

## 8. Reglas de privacidad

- Solo se debe pedir informacion minima necesaria para responder la auditoria.
- No se deben pedir contrasenas, tokens, llaves privadas, capturas internas ni accesos.
- La URL debe ser publica y pertenecer al solicitante o a una empresa autorizada para solicitar revision.
- El WhatsApp debe ser opcional.
- El consentimiento debe explicar que Soka puede contactar al lead sobre esta solicitud.
- La politica de privacidad debe estar enlazada desde el formulario.
- Si el lead no avanza, la informacion debe conservarse solo el tiempo operativo razonable definido por el proceso comercial.
- Debe existir posibilidad de eliminacion o supresion a solicitud del contacto.

## 9. Reglas de seguridad

- Validar todos los campos en cliente y servidor.
- Normalizar y sanitizar la URL antes de cualquier analisis.
- Bloquear URLs con `localhost`, IPs privadas, dominios internos o rutas sospechosas.
- Si el sistema hace fetch server-side, debe limitarse a dominios publicos y a un numero acotado de requests para evitar SSRF.
- No ejecutar scripts del sitio auditado ni descargar archivos no necesarios.
- No permitir archivos adjuntos en el MVP.
- No guardar secretos en el cliente ni en el repositorio.
- Minimizar datos personales en logs.
- Separar claramente la cola de leads de cualquier motor automatico de crawling.

## 10. Reglas anti-spam

- Honeypot obligatorio.
- Validacion de email y dominio.
- Rate limiting por IP, email y dominio enviado.
- CAPTCHA o Turnstile recomendado antes de produccion publica.
- Bloqueo de envios repetidos del mismo dominio en una ventana corta.
- Lista de exclusiones para dominios temporales o claramente desechables si el volumen lo exige.
- Revision manual de casos dudosos antes de responder.
- No enviar respuestas automaticas completas si el lead queda marcado como spam o abuso.

## 11. Recomendaciones comerciales posibles

La auditoria no debe terminar en una propuesta unica forzada. Debe mapear hallazgos a rutas posibles.

| Hallazgo dominante | Recomendacion posible | Servicio o producto relacionado |
|---|---|---|
| mensaje confuso, sitio desactualizado, CTA debil | redisenar arquitectura y presencia digital | sitios web corporativos |
| seguimiento manual de formularios o leads | automatizar confirmaciones, handoff o seguimiento | automatizaciones e integraciones |
| poca visibilidad de datos de marketing o ventas | ordenar indicadores y seguimiento | dashboards y reportes |
| operacion depende de hojas de calculo y correo | levantar proceso y proponer sistema interno | software a medida |
| errores tecnicos, continuidad fragil, problemas de soporte | revisar base tecnica y continuidad | infraestructura y soporte |
| backlog despues del lanzamiento | plan de soporte y mejoras por fases | mantenimiento y mejora continua |
| conjunto residencial o porteria con friccion operativa | evaluar piloto acotado | Portik |
| inventario tecnico Windows disperso | evaluar revision tecnica controlada | AutoInventario |
| mensajes operativos puntuales con consentimiento | revisar caso de uso antes de adoptar herramienta | AutoWhatsapp |

## 12. Servicios Soka relacionados

El modulo debe conectar de forma natural con:

- software a medida
- automatizaciones e integraciones
- dashboards y reportes
- sitios web corporativos
- infraestructura y soporte
- mantenimiento y mejora continua
- Portik, cuando el contexto residencial o de porteria sea claro
- AutoInventario y AutoWhatsapp solo como rutas controladas y no masivas

## 13. Metricas de exito

### Metricas de captacion

- visitas a `/auditoria`
- tasa de inicio del formulario
- tasa de envio completado
- tasa de URL validas
- tasa de spam o abuso

### Metricas de calidad comercial

- porcentaje de leads aptos para auditoria
- tiempo medio de triage
- tiempo medio de entrega de auditoria
- porcentaje de auditorias que terminan en reunion
- porcentaje de reuniones que terminan en propuesta
- distribucion de oportunidades por servicio relacionado

### Metricas de experiencia

- abandono por campo
- porcentaje de errores de validacion
- uso de WhatsApp opcional
- conversion por pais, industria y principal problema

## 14. Roadmap MVP, fase 2 y fase 3

### MVP

- landing `/auditoria` con propuesta de valor y limites claros
- formulario con campos basicos
- consentimiento de contacto
- honeypot y validacion minima
- modo de captura seguro
- triage manual
- respuesta manual con plantilla de auditoria corta

### Fase 2

- score inicial por tipo de empresa, problema y calidad del sitio
- integracion con CRM o bandeja de leads
- checklist semiautomatizado de senales tecnicas publicas
- plantilla de respuesta mas estructurada
- panel interno para estado: nuevo, en revision, entregado, descartado

### Fase 3

- auditoria asistida con mas senales visibles automatizadas
- recomendaciones dinamicas segun industria y dolor
- integracion con secuencia comercial o agenda
- comparativos por categoria o madurez digital
- dashboard interno de conversion del lead magnet

## Criterio de posicionamiento

El modulo debe sentirse como una herramienta consultiva B2B propia de SokaTechnologies.  
No debe parecer una app automatica de volumen ni una promesa de "te arreglamos el SEO gratis".  
La experiencia debe abrir una conversacion de negocio seria, con limites claros, foco comercial y respeto por privacidad y seguridad.

