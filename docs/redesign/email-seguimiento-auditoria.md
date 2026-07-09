# Email de seguimiento para solicitudes de auditoria

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Objetivo

Definir el email de seguimiento que recibira un prospecto despues de solicitar la auditoria de SokaTechnologies. El tono debe ser consultivo, profesional y B2B, con foco en abrir conversacion y no en cerrar una venta de forma agresiva.

## Variables

Usar placeholders seguros y reemplazables:

- `{{nombre}}`
- `{{empresa}}`
- `{{sitio}}`
- `{{hallazgos}}`
- `{{recomendacion_principal}}`

Opcionales si mas adelante hacen falta:

- `{{pais}}`
- `{{fecha_solicitud}}`
- `{{cta_diagnostico_url}}`
- `{{cta_contacto_url}}`

## Asunto

Opcion recomendada:

`{{nombre}}, ya tenemos una lectura inicial de {{sitio}}`

Opciones alternas:

- `Auditoria inicial de {{sitio}}: siguiente paso recomendado`
- `{{empresa}}: hallazgos iniciales y recomendacion sugerida`

## Preheader

`Compartimos una lectura inicial de tu sitio y una ruta sugerida para revisar contexto, objetivos y operacion con mas criterio.`

## Version corta

### Plantilla

Hola `{{nombre}}`,

Gracias por solicitar la auditoria inicial de `{{sitio}}`.

Revisamos señales visibles del sitio y del contexto compartido. A este nivel, los hallazgos iniciales apuntan a:

`{{hallazgos}}`

La recomendacion principal que hoy parece mas razonable es:

`{{recomendacion_principal}}`

Si tiene sentido para tu equipo, el siguiente paso es una conversacion breve de diagnostico para validar contexto, objetivos y operacion antes de proponer cualquier alcance.

CTA principal: `Solicitar diagnostico`  
CTA secundaria: `Responder este correo`

SokaTechnologies  
`hola@sokatechnologies.com`

## Version extendida

### Plantilla

Hola `{{nombre}}`,

Gracias por compartir el contexto de `{{empresa}}` y la URL `{{sitio}}`.

Ya tenemos una lectura inicial basada en dos frentes:

- señales visibles del sitio publicamente accesible
- informacion que compartiste sobre el problema principal

A este nivel, los hallazgos iniciales que conviene mirar primero son:

`{{hallazgos}}`

Con esa informacion, la ruta que hoy parece mas razonable es:

`{{recomendacion_principal}}`

Es importante aclarar que este correo no sustituye una auditoria tecnica completa ni un diagnostico de proceso. Sirve para ayudarte a decidir si conviene profundizar en web corporativa, automatizacion, reporting, infraestructura o una conversacion de alcance mas precisa.

Si quieres avanzar, podemos tener una conversacion breve para revisar:

- contexto comercial y operativo
- objetivo real del sitio o del proceso
- restricciones tecnicas actuales
- prioridad de negocio y siguiente paso mas proporcional

CTA principal: `Solicitar diagnostico`  
CTA secundaria: `Responder este correo`

Si prefieres, puedes responder directamente a este mensaje con cualquier dato adicional que ayude a entender mejor el caso.

SokaTechnologies  
`hola@sokatechnologies.com`

## CTA a diagnostico

Texto recomendado:

`Solicitar diagnostico`

Microcopy sugerido:

`Revisar contexto, objetivos y operacion antes de definir alcance.`

## CTA a responder el correo

Texto recomendado:

`Responder este correo`

Microcopy sugerido:

`Si prefieres, cuentanos por reply que parte del problema te urge mas resolver.`

## Reglas de tono

- Hablar de `lectura inicial`, `hallazgos visibles` y `ruta sugerida`.
- Evitar frases absolutas como `tu web esta mal` o `necesitas esto ya`.
- No prometer resultados garantizados.
- No asumir que el problema ya esta diagnosticado por completo.
- Invitar a conversar, no a comprar.

## Reglas de personalizacion

- Si no hay `{{nombre}}`, usar `Hola,`.
- Si `{{empresa}}` no esta disponible, no forzar la mencion.
- Si `{{hallazgos}}` viene muy tecnico, resumirlo primero a lenguaje de negocio.
- Si `{{recomendacion_principal}}` incluye producto controlado como AutoWhatsapp o AutoInventario, mantener tono prudente y aclarar que requiere revision de caso de uso o evaluacion tecnica.

## Ejemplo de `{{hallazgos}}`

Formato sugerido:

`- La propuesta de valor no se entiende con suficiente rapidez.\n- El recorrido hacia contacto puede tener friccion visible.\n- Hay señales tecnicas que conviene ordenar antes de ampliar trafico o cambios mayores.`

## Ejemplo de `{{recomendacion_principal}}`

Formato sugerido:

`Abrir un diagnostico corto para validar si conviene priorizar claridad comercial y estructura del sitio, o si el problema principal esta mas relacionado con automatizacion, reporting o continuidad tecnica.`

## Notas legales y de privacidad

Pie recomendado:

`Este mensaje se envia como seguimiento a una solicitud iniciada por ti a traves del modulo de auditoria de SokaTechnologies. No compartas por correo contraseñas, tokens, accesos ni informacion sensible. Si no deseas continuar la conversacion, puedes indicarlo respondiendo este mismo mensaje.`

Version mas breve:

`Recibes este correo porque solicitaste una auditoria inicial en SokaTechnologies. No envies contraseñas, tokens ni accesos por email.`

## Recomendacion operativa

Para MVP:

- enviar la version corta dentro de pocos minutos despues de la solicitud
- usar la version extendida solo si hay seguimiento manual o comercial posterior
- incluir siempre enlace a diagnostico y posibilidad de responder al correo

## Que no debe incluir este email

- promesas de ventas
- cifras inventadas
- clientes reales
- resultados garantizados
- lenguaje de urgencia agresiva
- diagnósticos legales, financieros o de seguridad no sustentados
