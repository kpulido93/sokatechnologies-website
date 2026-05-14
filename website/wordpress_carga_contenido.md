# Guía para cargar contenido manualmente en WordPress

## Objetivo

Esta guía explica cómo cargar manualmente en WordPress el contenido generado en Markdown dentro de `website/pages/`.

El objetivo es mantener un proceso ordenado, revisable y seguro. Codex no debe tocar producción, cPanel ni el panel de WordPress. La carga debe hacerla una persona autorizada desde el administrador de WordPress.

## Alcance

Esta guía cubre:

- Páginas que deben crearse en WordPress.
- Orden recomendado del menú principal.
- Contenido que debe copiarse desde cada archivo Markdown.
- Metadatos sugeridos para SEO.
- CTAs y enlaces internos.
- Recomendaciones para copiar Markdown al editor de WordPress.
- Checklists antes y después de publicar.
- Reglas de rollback manual.
- Contenido que no debe cargarse.

No incluye credenciales, comandos productivos, configuración real de hosting ni despliegue automático.

## Lista de páginas a crear en WordPress

Crear primero las páginas principales y luego las páginas hijas de servicios. Mantener como borrador hasta completar revisión de contenido, enlaces, formularios, responsive y legales.

| Orden | Archivo Markdown | Página WordPress | Slug sugerido | Tipo |
|---:|---|---|---|---|
| 1 | `website/pages/01_inicio.md` | Inicio | `inicio` | Página principal |
| 2 | `website/pages/02_servicios.md` | Servicios | `servicios` | Página principal |
| 3 | `website/pages/03_software_a_medida.md` | Software a medida | `servicios/software-a-medida` | Página hija de Servicios |
| 4 | `website/pages/04_automatizaciones.md` | Automatizaciones | `servicios/automatizaciones` | Página hija de Servicios |
| 5 | `website/pages/05_dashboards_analitica.md` | Dashboards y analítica | `servicios/dashboards-analitica` | Página hija de Servicios |
| 6 | `website/pages/06_infraestructura_soporte.md` | Infraestructura y soporte | `servicios/infraestructura-soporte` | Página hija de Servicios |
| 7 | `website/pages/07_sitios_web_corporativos.md` | Sitios web corporativos | `servicios/sitios-web-corporativos` | Página hija de Servicios |
| 8 | `website/pages/08_portik.md` | Portik | `portik` | Producto |
| 9 | `website/pages/09_autoinventario.md` | AutoInventario | `autoinventario` | Solución técnica |
| 10 | `website/pages/10_sobre_nosotros.md` | Sobre nosotros | `sobre-nosotros` | Página corporativa |
| 11 | `website/pages/11_casos_de_uso.md` | Casos de uso | `casos-de-uso` | Página comercial |
| 12 | `website/pages/12_contacto.md` | Contacto | `contacto` | Página de conversión |
| 13 | `website/pages/13_politica_privacidad.md` | Política de privacidad | `politica-privacidad` | Legal, requiere revisión |
| 14 | `website/pages/14_terminos_uso.md` | Términos de uso | `terminos-uso` | Legal, requiere revisión |

## Orden recomendado del menú principal

Menú principal recomendado:

1. Inicio
2. Servicios
3. Portik
4. Casos de uso
5. Sobre nosotros
6. Contacto

Submenú recomendado bajo Servicios:

1. Software a medida
2. Automatizaciones
3. Dashboards y analítica
4. Infraestructura y soporte
5. Sitios web corporativos

Enlaces recomendados para el footer:

- Política de privacidad
- Términos de uso
- Contacto

AutoInventario puede enlazarse desde Inicio, Servicios, Casos de uso y Contacto. No es necesario ubicarlo en el menú principal si se quiere mantener la navegación más simple.

## Qué contenido copiar en cada página

En cada archivo Markdown, la sección `Metadatos para WordPress` sirve para configurar la página y no debe copiarse como contenido visible.

Para el cuerpo de cada página:

- Usar el campo `Título de página` como título de la página en WordPress.
- Copiar el contenido desde el primer H1 hasta el final del archivo.
- Si el tema muestra automáticamente el título de página como H1, evitar duplicar el H1 dentro del contenido.
- Conservar los encabezados H2 y H3 como bloques de encabezado.
- Convertir listas Markdown en listas del editor de WordPress.
- Convertir el texto del CTA final en botón o bloque destacado si el tema lo permite.
- Revisar manualmente que el espaciado, jerarquía de títulos y botones se vean correctos en móvil.

| Página | Contenido visible recomendado | CTA principal |
|---|---|---|
| Inicio | Hero, público objetivo, problemas, servicios, forma de trabajo, resultados, productos y CTA final. | Agendar una conversación de diagnóstico |
| Servicios | Hero, introducción, líneas de servicio, modelo de trabajo, servicios recurrentes y CTA final. | Solicitar diagnóstico |
| Software a medida | Hero, señales de necesidad, entregables, resultados, proceso, ejemplos genéricos, exclusiones y CTA final. | Solicitar diagnóstico |
| Automatizaciones | Hero, señales de necesidad, entregables, resultados, proceso, ejemplos, uso consentido de comunicaciones, exclusiones y CTA final. | Solicitar diagnóstico |
| Dashboards y analítica | Hero, señales de necesidad, entregables, resultados, proceso, ejemplos, exclusiones y CTA final. | Solicitar diagnóstico |
| Infraestructura y soporte | Hero, señales de necesidad, entregables, resultados, proceso, ejemplos, exclusiones y CTA final. | Solicitar diagnóstico |
| Sitios web corporativos | Hero, señales de necesidad, entregables, resultados, proceso, ejemplos, exclusiones y CTA final. | Solicitar diagnóstico |
| Portik | Hero, problema, qué es, público objetivo, módulos MVP, beneficios, piloto, exclusiones del MVP y CTA final. | Solicitar demo |
| AutoInventario | Hero, problema, qué es, público objetivo, datos técnicos, estado actual, beneficios esperados, qué no es y CTA final. | Solicitar revisión técnica |
| Sobre nosotros | Qué es SokaTechnologies, problemas que resuelve, forma de trabajo, principios, enfoque B2B y CTA final. | Solicitar diagnóstico |
| Casos de uso | Casos genéricos por problema, solución posible, resultado esperado, servicios relacionados, confidencialidad y CTA final. | Solicitar diagnóstico |
| Contacto | Invitación a diagnóstico, información a enviar, tipos de solicitudes, siguiente paso, canales y enlaces internos. | Solicitar diagnóstico |
| Política de privacidad | Borrador legal informativo, datos que pueden recopilarse, uso, cookies, protección, contacto y revisión legal. | Contactar a SokaTechnologies |
| Términos de uso | Borrador legal informativo, uso permitido, propiedad intelectual, limitaciones, solicitudes, confidencialidad y revisión legal. | Contactar a SokaTechnologies |

## Metadatos a usar

Usar estos metadatos en los campos disponibles de WordPress, del tema o de la herramienta SEO aprobada. Si todavía no hay herramienta SEO aprobada, dejar estos valores documentados para configurarlos después.

| Página | Slug | Título SEO | Meta description |
|---|---|---|---|
| Inicio | `inicio` | SokaTechnologies \| Software, automatización y soporte para empresas | SokaTechnologies ayuda a pymes a digitalizar procesos, automatizar tareas, crear dashboards, mejorar infraestructura y mantener sistemas con soporte técnico. |
| Servicios | `servicios` | Servicios de software, automatización e infraestructura \| SokaTechnologies | Servicios B2B de software a medida, automatización, dashboards, sitios web corporativos, infraestructura y soporte para mejorar procesos operativos. |
| Software a medida | `servicios/software-a-medida` | Software a medida para empresas \| SokaTechnologies | Software a medida para empresas que necesitan sistemas internos, portales, flujos de aprobación, captura de datos y control operativo. |
| Automatizaciones | `servicios/automatizaciones` | Automatizaciones de procesos para empresas \| SokaTechnologies | Automatizaciones para reducir tareas manuales, errores y retrasos mediante integraciones, reportes, validaciones, documentos y notificaciones. |
| Dashboards y analítica | `servicios/dashboards-analitica` | Dashboards y analítica para empresas \| SokaTechnologies | Dashboards, reportes gerenciales e indicadores para consolidar datos, reducir reportes manuales y mejorar la visibilidad del negocio. |
| Infraestructura y soporte | `servicios/infraestructura-soporte` | Infraestructura y soporte técnico para empresas \| SokaTechnologies | Infraestructura cloud/on-prem, hosting, backups, monitoreo, seguridad básica, revisión de logs, soporte técnico y mantenimiento mensual para empresas. |
| Sitios web corporativos | `servicios/sitios-web-corporativos` | Sitios web corporativos para empresas \| SokaTechnologies | Sitios web corporativos para empresas de servicios que necesitan presencia digital profesional, formularios, SEO básico, analítica y mantenimiento. |
| Portik | `portik` | Portik \| Control de portería para conjuntos residenciales | Portik es una plataforma web para operación de portería, visitantes, vehículos, predios, reservas, novedades y trazabilidad residencial. |
| AutoInventario | `autoinventario` | AutoInventario \| Inventario de activos Windows para TI | AutoInventario es una solución técnica en validación para inventario de activos Windows, soporte IT, auditoría, infraestructura e ITSM. |
| Sobre nosotros | `sobre-nosotros` | Sobre SokaTechnologies \| Soluciones tecnológicas B2B | Conoce SokaTechnologies: empresa B2B que ayuda a pymes a digitalizar, automatizar y controlar procesos con tecnología práctica. |
| Casos de uso | `casos-de-uso` | Casos de uso de tecnología B2B \| SokaTechnologies | Casos de uso genéricos para digitalización de procesos, reportes, dashboards, sitios web, infraestructura, Portik y AutoInventario. |
| Contacto | `contacto` | Contacto \| SokaTechnologies | Contacta a SokaTechnologies para solicitar diagnóstico sobre software, automatizaciones, dashboards, sitios web, infraestructura o soporte. |
| Política de privacidad | `politica-privacidad` | Política de privacidad \| SokaTechnologies | Borrador informativo de política de privacidad para el sitio web de SokaTechnologies, sujeto a revisión legal antes de publicación. |
| Términos de uso | `terminos-uso` | Términos de uso \| SokaTechnologies | Borrador informativo de términos de uso para el sitio web de SokaTechnologies, sujeto a revisión legal antes de publicación. |

## CTAs recomendados

Mantener los CTAs consistentes para no dispersar la conversión.

| Página | CTA recomendado |
|---|---|
| Inicio | Agendar diagnóstico |
| Servicios | Solicitar diagnóstico |
| Software a medida | Solicitar diagnóstico |
| Automatizaciones | Solicitar diagnóstico |
| Dashboards y analítica | Solicitar diagnóstico |
| Infraestructura y soporte | Solicitar diagnóstico |
| Sitios web corporativos | Solicitar diagnóstico |
| Portik | Solicitar demo de Portik |
| AutoInventario | Solicitar revisión técnica |
| Sobre nosotros | Solicitar diagnóstico |
| Casos de uso | Solicitar diagnóstico |
| Contacto | Solicitar diagnóstico |
| Política de privacidad | Contactar a SokaTechnologies |
| Términos de uso | Contactar a SokaTechnologies |

Todos los CTAs comerciales deben apuntar preferiblemente a `/contacto/`, salvo que se cree un formulario específico aprobado para demos o diagnósticos.

## Enlaces internos que deben agregarse

Agregar enlaces internos en el cuerpo o al final de cada página, según el diseño final.

| Página origen | Enlaces internos sugeridos |
|---|---|
| Inicio | Servicios, Portik, AutoInventario, Contacto |
| Servicios | Software a medida, Automatizaciones, Dashboards y analítica, Infraestructura y soporte, Sitios web corporativos, Contacto |
| Software a medida | Servicios, Automatizaciones, Dashboards y analítica, Contacto |
| Automatizaciones | Servicios, Software a medida, Dashboards y analítica, Contacto |
| Dashboards y analítica | Servicios, Software a medida, Automatizaciones, Contacto |
| Infraestructura y soporte | Servicios, Software a medida, Sitios web corporativos, Contacto |
| Sitios web corporativos | Servicios, Contacto, Casos de uso, Sobre nosotros |
| Portik | Inicio, Servicios, Casos de uso, Contacto |
| AutoInventario | Servicios, Infraestructura y soporte, Dashboards y analítica, Contacto |
| Sobre nosotros | Servicios, Software a medida, Automatizaciones, Dashboards y analítica, Infraestructura y soporte, Contacto |
| Casos de uso | Servicios, Software a medida, Automatizaciones, Dashboards y analítica, Portik, AutoInventario, Contacto |
| Contacto | Inicio, Servicios, Casos de uso, Portik, AutoInventario, Sobre nosotros |
| Política de privacidad | Contacto, Servicios, Términos de uso |
| Términos de uso | Contacto, Servicios, Política de privacidad |

## Recomendaciones para copiar Markdown al editor de WordPress

1. Crear todas las páginas como borrador antes de publicarlas.
2. Configurar primero el título de página y slug.
3. Copiar el contenido desde el H1 o desde el primer bloque visible, excluyendo la sección de metadatos.
4. Revisar si el tema ya imprime el título de página. Si lo imprime, no duplicar el H1 en el contenido.
5. Convertir CTAs importantes en botones si el editor y el tema lo permiten.
6. Revisar que los enlaces internos apunten a slugs reales.
7. Usar vistas previas antes de publicar.
8. Validar las páginas en desktop y móvil.
9. Revisar ortografía, mayúsculas, tildes y consistencia de nombres: SokaTechnologies, Portik y AutoInventario.
10. Mantener Portik como MVP/piloto controlado.
11. Mantener AutoInventario como solución técnica en validación y diagnóstico, no como producto final masivo.
12. Mantener automatizaciones de WhatsApp solo como comunicaciones operativas consentidas cuando aplique.

## Revisión legal antes de publicar

No publicar `Política de privacidad` ni `Términos de uso` como documentos finales sin revisión legal.

Antes de publicar estas páginas:

- Completar correo oficial, formulario y datos de entidad responsable.
- Validar si el sitio usa cookies o analítica.
- Confirmar obligaciones legales según país o mercados objetivo.
- Ajustar limitaciones, responsabilidades y jurisdicción si corresponde.
- Confirmar que el texto no promete cumplimiento legal específico sin validación.

## Checklist antes de publicar

- [ ] Todas las páginas fueron creadas como borrador.
- [ ] La página Inicio está asignada como página principal si corresponde.
- [ ] Los slugs coinciden con la tabla de esta guía.
- [ ] Los títulos SEO están configurados donde aplique.
- [ ] Las meta descriptions están configuradas donde aplique.
- [ ] El menú principal tiene el orden recomendado.
- [ ] Las páginas hijas de Servicios están bajo la página Servicios si se usará esa estructura.
- [ ] Los CTAs apuntan a la página o formulario correcto.
- [ ] Los enlaces internos funcionan.
- [ ] El formulario de contacto existe y fue revisado.
- [ ] No se solicitan datos innecesarios en formularios.
- [ ] La ortografía fue revisada.
- [ ] No hay nombres reales de clientes.
- [ ] No hay testimonios inventados.
- [ ] No hay cifras o resultados garantizados.
- [ ] Portik respeta el alcance MVP.
- [ ] AutoInventario no se presenta como producto final listo para producción.
- [ ] Las comunicaciones por WhatsApp se presentan solo como operativas y consentidas.
- [ ] Política de privacidad y términos fueron revisados legalmente antes de publicar.
- [ ] No hay credenciales, tokens, secretos ni datos sensibles.
- [ ] El sitio fue revisado en móvil, tablet y desktop.
- [ ] SSL está activo.
- [ ] WordPress, tema padre, child theme y plugins aprobados están actualizados.
- [ ] Hay backup reciente disponible antes de publicar cambios en producción.

## Checklist posterior a publicación

- [ ] Abrir Inicio, Servicios, Contacto, Portik y páginas legales desde navegación pública.
- [ ] Probar formulario de contacto.
- [ ] Confirmar recepción de correo o notificación del formulario.
- [ ] Revisar que los CTAs funcionen.
- [ ] Revisar enlaces internos principales.
- [ ] Revisar que no haya páginas con error 404.
- [ ] Revisar responsive en móvil.
- [ ] Revisar velocidad básica de carga.
- [ ] Configurar analítica solo si fue aprobada.
- [ ] Confirmar que el sitio no muestra páginas borrador.
- [ ] Revisar que no haya metadatos visibles dentro del contenido público.
- [ ] Confirmar backups activos.
- [ ] Revisar seguridad básica: SSL, usuarios, plugins necesarios, tema actualizado y errores visibles desactivados.
- [ ] Registrar fecha de publicación, páginas publicadas y pendientes.

## Reglas de rollback manual

Si una página publicada queda mal o genera confusión:

1. Cambiar la página a borrador si el problema es crítico.
2. Usar la vista de revisiones de WordPress para restaurar la versión anterior si está disponible.
3. Volver a cargar el contenido aprobado desde el archivo Markdown correspondiente.
4. Si el problema está en navegación, retirar temporalmente el enlace del menú.
5. Si el problema está en una página legal, despublicarla hasta completar revisión.
6. Si el problema está en formulario de contacto, pausar el CTA hacia el formulario y usar un canal alterno aprobado.
7. Registrar qué se cambió, cuándo se cambió y qué queda pendiente.

No usar despliegue automático ni `.cpanel.yml` para corregir contenido. La corrección de estas páginas debe hacerse manualmente desde WordPress hasta que exista un proceso aprobado.

## Qué no debe cargarse a WordPress

No cargar como contenido público:

- La sección `Metadatos para WordPress` de cada archivo.
- Archivos internos de `docs/`.
- `AGENTS.md`.
- `README.md` si contiene instrucciones internas.
- Prompts de Codex.
- Archivos de configuración.
- `.cpanel.yml`.
- `wp-config.php`.
- Archivos `.env`.
- Backups.
- Dumps SQL.
- Logs.
- Credenciales.
- Tokens.
- Llaves privadas.
- Datos reales de clientes.
- Capturas con información sensible.
- Documentos legales marcados como borrador sin revisión.
- Contenido de WordPress core.
- Plugins o temas de terceros completos desde este repositorio.

## Pendientes recomendados

- Definir tema padre aprobado.
- Definir plugin de formularios si aplica.
- Definir herramienta SEO si aplica.
- Definir política de cookies según herramientas reales.
- Completar canales oficiales de contacto.
- Revisar legalmente privacidad y términos antes de publicación.
- Preparar una revisión final de contenido dentro de WordPress antes de publicar.
