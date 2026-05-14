# Content Structure

## Objetivo

Definir la estructura inicial de contenido para la web publica de SokaTechnologies.

## Paginas base

| Pagina | Slug sugerido | Objetivo |
|---|---|---|
| Inicio | `/` | Presentar propuesta de valor y dirigir a contacto. |
| Servicios | `/servicios/` | Agrupar servicios principales. |
| Software a medida | `/software-a-medida/` | Explicar desarrollo de sistemas internos y aplicaciones. |
| Automatizaciones | `/automatizaciones/` | Mostrar automatizacion de procesos operativos. |
| Sitios web corporativos | `/sitios-web-corporativos/` | Presentar desarrollo web para empresas. |
| Dashboards y analitica | `/dashboards-analitica/` | Presentar reportes, BI y visualizacion. |
| Infraestructura y soporte | `/infraestructura-soporte/` | Presentar soporte tecnico, cloud/on-prem y continuidad. |
| Casos de exito | `/casos-de-exito/` | Mostrar ejemplos anonimizados. |
| Blog | `/blog/` | Publicar articulos tecnicos o comerciales revisados. |
| Sobre nosotros | `/sobre-nosotros/` | Comunicar enfoque, experiencia y confianza. |
| Contacto | `/contacto/` | Capturar oportunidades comerciales. |
| Politica de privacidad | `/politica-privacidad/` | Informacion legal pendiente de revision. |
| Terminos de uso | `/terminos-uso/` | Informacion legal pendiente de revision. |

## Menu final recomendado

- Inicio.
- Servicios.
- Soluciones.
- Casos de exito.
- Sobre nosotros.
- Blog.
- Contacto.

No incluir `Sample Page` en el menu publico. No borrar paginas automaticamente sin confirmacion; si `Sample Page` existe, retirarla del menu o dejarla en borrador manualmente despues de revisar que no contiene contenido util.

## Footer final recomendado

### Columna 1

**SokaTechnologies**

Software, automatizaciones, sitios web e infraestructura para empresas.

### Columna 2: Servicios

- Software a medida.
- Automatizaciones.
- Sitios web corporativos.
- Dashboards y reportes.
- Infraestructura y soporte.

### Columna 3: Empresa

- Sobre nosotros.
- Casos de exito.
- Blog.
- Contacto.

### Columna 4: Contacto

- Email: `info@sokatechnologies.com`.
- WhatsApp: `573107482865`.
- Atencion: Colombia y Latinoamerica.
- CTA rapido: `Solicitar diagnostico por WhatsApp`.

Usar `docs/contact-channels.md` como fuente central antes de cambiar canales publicos. No incluir credenciales, tokens, llaves privadas, backups, dumps SQL ni datos sensibles en formularios, correos o WhatsApp.

## Aplicacion manual en WordPress

Si se configura desde WordPress Admin:

1. Ir a `Apariencia > Editor`.
2. Abrir la plantilla o parte de plantilla `Header`.
3. Reemplazar el bloque automatico `Page List` por enlaces manuales en este orden: Inicio, Servicios, Soluciones, Casos de exito, Sobre nosotros, Blog, Contacto.
4. Confirmar que `Sample Page` no aparece en la navegacion.
5. Abrir la parte de plantilla `Footer`.
6. Reemplazar enlaces genericos como Blog, Eventos, Tienda, FAQs, Patrones, Autores, Temas y Diseñado con WordPress por las cuatro columnas definidas arriba.
7. Guardar cambios solo en el entorno local o staging aprobado.
8. Validar escritorio y movil.

Si se configura desde el tema:

- El child theme local define `parts/header.html` y `parts/footer.html`.
- La copia versionable vive en `wp-theme/sokatechnologies-child-theme/parts/`.
- No se modifica base de datos para esta limpieza.
- No se borra ninguna pagina.

## Mensaje principal

SokaTechnologies ayuda a empresas pequenas y medianas a digitalizar, automatizar y controlar sus procesos operativos mediante software, sitios web, dashboards, integraciones, infraestructura y soporte tecnico.

## CTA sugeridos

- Solicitar diagnostico.
- Agendar llamada.
- Cuentanos tu proceso.

## Reglas de contenido

- Comunicar resultados de negocio antes que tecnologia.
- Usar lenguaje claro para clientes no tecnicos.
- Evitar promesas exageradas.
- No mencionar clientes reales sin autorizacion.
- Usar casos de exito anonimizados.
- No incluir datos sensibles.
- Priorizar ahorro de tiempo, trazabilidad, seguridad y control operativo.

## Placeholders pendientes

- `[copy-home-pendiente]`
- `[casos-anonimizados-pendientes]`
- `[formulario-contacto-pendiente]`
- `[tono-visual-pendiente]`
- `[legal-pendiente-revision]`

## Validacion

- [ ] La home tiene CTA claro.
- [ ] Servicios explica oferta sin lenguaje excesivamente tecnico.
- [ ] Contacto no solicita datos innecesarios.
- [ ] Politicas legales estan revisadas antes de publicar.
- [ ] No hay datos reales de clientes sin autorizacion.
