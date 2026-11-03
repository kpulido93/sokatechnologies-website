# Auditoría extendida y misión/visión — 3 de noviembre de 2026

## Dictamen

La propuesta Astro tiene una base funcional consistente: las 23 rutas públicas respondieron HTTP 200, conservaron canonical de staging y `noindex`, y los tres formularios completaron su recorrido de simulación. WhatsApp, teléfono y correo están disponibles. No equivale a aprobación de una migración ni a conformidad WCAG completa.

Se preparó una sección de misión y visión en `/nosotros/`, con metadatos actualizados. Es un cambio del candidato de código: **todavía no está publicado** en staging ni en el dominio principal. El dominio principal continúa entregando el sitio anterior. Esta es una auditoría ampliada del staging existente y del candidato local; la auditoría posterior al corte queda pendiente.

La sesión dispone del repositorio y del navegador, pero no de una conexión de ejecución a LPT-KEVIN ni de sus rutas `/srv/fast-storage`. No se activó 8094, no se cambió el túnel y no se modificaron DNS, correo, WordPress o servicios.

## Alcance y método

- Base de código: `46672d231fc18816525f7fe911caecccd8a3b9d4`, rama `feature/web-demo-2026-gsap`, que incluye WhatsApp.
- Sitio auditado: `https://prueba.sokatechnologies.com/`.
- Lectura HTTP del HTML de las 23 rutas, enlaces internos, fragmentos, IDs, referencias ARIA, formularios, canonical, robots meta, sitemap y recursos. No se ejecutó un escáner de vulnerabilidades.
- Chrome conectado: 23 rutas en viewports configurados de 1440×900, 768×1024 y 375×812: **69 observaciones** de DOM y geometría. Se revisaron visualmente vistas representativas de Inicio, Contacto, Proyectos, Nosotros y Auditoría; no se presenta cada página completa como inspección visual manual.
- Pruebas adicionales de Inicio, Contacto y Soluciones en 320 y 430 px: seis observaciones. El navegador usa una barra de desplazamiento que resta 15 px al ancho útil; no es hardware móvil.
- Menú móvil, Escape y devolución de foco; apertura de las 21 FAQ mediante Enter; validación vacía y completado demo de Contacto, Diagnóstico y Auditoría con datos sintéticos.
- No se abrieron enlaces WhatsApp, `mailto:` o `tel:` ni se enviaron mensajes reales. La instrumentación de red del smoke anterior **no se repitió**: esta sesión no acredita de nuevo contadores cero de fetch/XHR/beacon. Sí verificó configuración demo, ausencia de endpoint comercial en Contacto/Diagnóstico, estructura del código y estados de éxito local.
- Muestreo del dominio principal y rutas heredadas para confirmar que el corte no ha ocurrido. No es una nueva auditoría funcional completa de WordPress.

## Resultado por área

| Área | Resultado | Alcance y reserva |
|---|---|---|
| Disponibilidad | 23/23 HTTP 200 | Una consulta por ruta; no mide disponibilidad histórica. |
| SEO de staging | 23/23 canonical y noindex correctos | `/casos/` tiene canonical a `/proyectos/`, de forma intencional. |
| Sitemap | 22 URLs canónicas | La compatibilidad `/casos/` queda excluida. |
| Encabezados | Un H1 por página | No sustituye revisión editorial ni semántica completa. |
| Integridad DOM | Sin IDs duplicados ni referencias ARIA rotas detectadas | `aria-labelledby`, `aria-describedby` y `aria-controls`. |
| Enlaces internos | Sin fragmentos rotos detectados | El catálogo tiene un problema de descubrimiento, aunque sus enlaces funcionen. |
| Responsive | Sin overflow global en las 69 observaciones base | Fallo reproducido en los tres casos adicionales a 320 px; 430 px pasa. |
| FAQ | 21/21 abiertas por teclado | Siete servicios, tres FAQ por servicio. |
| Menú móvil | Abre, cierra con Escape y devuelve foco | Recorrido dirigido; no lector de pantalla. |
| Contacto | Cinco errores y éxito demo tras completar | Errores asociados; foco inicial observado en Nombre. |
| Diagnóstico | Cinco errores y éxito demo tras completar | La devolución de foco al primer error no quedó confirmada; ver A06. |
| Auditoría | Ocho errores y éxito de simulación | Un escenario público de datos/trabajo manual; no se repitieron los cuatro escenarios históricos. |
| Imágenes | Hero, proyectos y retrato cargan en Chrome | Las imágenes diferidas fuera de pantalla no se clasificaron como rotas. |
| Recursos por HTTP automatizado | 42 recursos consultados, 10 respuestas correctas y 32 incompletas | Hubo 403 y timeouts. Un 403 se confirmó como Cloudflare 1010; varias de esas variantes cargaron en Chrome. No son 32 assets rotos confirmados. |
| Rendimiento | Sin nueva medición Core Web Vitals | No hay resultados nuevos de Lighthouse, CrUX, LCP, INP o CLS. |
| Seguridad | Revisión pasiva de superficie y configuración | No es pentest, auditoría del servidor ni certificación de seguridad. |

## Hallazgos priorizados y aceptación

P1 identifica una condición previa al corte o al tratamiento real; P2, un problema relevante a resolver; P3, una mejora. Se distingue hallazgo confirmado de comprobación pendiente.

| ID | Prioridad / estado | Evidencia e impacto | Corrección propuesta y aceptación |
|---|---|---|---|
| MIG-01 | P1 · pendiente operativo | El último estado aportado no contiene un respaldo privado externo de WordPress con restauración probada. Esta sesión no puede verificar el equipo destino. | Conservar archivos y base de datos cifrados fuera de LPT, probar restauración aislada y documentar responsable/ubicación sin secretos. Revalidar el runbook antes del corte. |
| LEGAL-01 | P1 · pendiente ya conocido | Privacidad dice «Información de privacidad en preparación»; Términos describe el modo demo. No hay aprobación jurídica comunicada. | Resolver el texto y sus requisitos con el responsable antes de publicación definitiva o tratamiento real. No inventar identidad jurídica ni activar formularios para eludir este pendiente. |
| A01 | P2 · confirmado | `body { min-width: 320px }` ocupa 320 px cuando el viewport de 320 deja 305 px útiles. Inicio, Contacto y Soluciones recortan contenido; `overflow-x: clip` oculta parte del problema. | Revisar el mínimo del body y tamaños de hijos en `src/styles/global.css`. Aceptar si `scrollWidth <= clientWidth` y no hay texto recortado a 320 px con barra clásica, además de 375/430/768/1440 y zoom real. No ocultar únicamente el overflow. |
| A02 | P2 · confirmado | El robots público contiene dos grupos `User-agent: *`: uno administrado con `Allow: /` y otro con `Disallow: /`. No reproduce la intención del archivo local. | Definir la política pública de staging y eliminar la contradicción en la capa que la añade, limitada al hostname de prueba. Validar el archivo completo por HTTPS y mantener noindex en las 23 páginas. No modificar la zona compartida sin revisar sus otros sitios. |
| A03 | P2 · confirmado | Desde Inicio no se alcanza `/productos/` ni sus tres productos. Se enlazan entre sí, pero no existe entrada desde el recorrido principal. `/auditoria/` y `/demos/ecommerce/` no tienen enlaces entrantes en el inventario. | Añadir entrada contextual al catálogo y/o pie de página. Decidir si cada demo debe ser descubrible o quedar fuera del catálogo/sitemap. Aceptar recorridos desde Inicio en dos o tres pasos. `/casos/` es compatibilidad y no requiere promoción. |
| A04 | P2 · mejora comercial | Varios «Solicitar diagnóstico» terminan en una página con formulario demo. Hay contacto directo disponible, pero el usuario puede completar una simulación esperando una solicitud. | Orientar CTA comerciales a `/contacto/#contacto-directo`; reservar etiquetas «Simular» para demos. Aceptar un recorrido inequívoco a WhatsApp, correo o llamada, sin afirmar que se envió una solicitud. |
| A05 | P2 · confirmado editorial | `/auditoria/` explica correctamente que no escanea, pero conserva «auditoría gratuita», «señales visibles» y textos de revisión que pueden sugerir evaluación real. El resultado también muestra términos como `handoff`, `automatizacion` y `reporting`. | Unificar el lenguaje como «simulación orientativa», sustituir etiquetas técnicas internas por español comprensible y mantener cada recomendación como hipótesis. Verificar formulario vacío, resultado y todos los escenarios. |
| A06 | P2 · necesita reproducción dirigida | En Diagnóstico, la validación mostró los cinco errores, pero `document.activeElement` volvió al body en las observaciones de Chrome; Contacto y Auditoría sí mostraron el primer campo. | Reproducir sin automatización y con teclado/lector. Revisar `reportValidity()` y animación/scroll del panel. Si persiste, fijar foco visible en el primer error sin taparlo con la cabecera. No se declara fallo universal ni PASS de foco en esta página. |
| A07 | P3 · confirmado visual | El consentimiento ocupa mucho alto en móvil; el enlace de privacidad y el punto final quedan en líneas separadas. | Revisar `.checkbox-line` y `.checkbox-copy`, mantener el enlace dentro de una frase continua y un objetivo táctil cómodo. Probar etiqueta completa, estado de error y teclado. |
| A08 | P3 · confirmado | Una URL inexistente devuelve 404 genérico de Nginx, sin marca ni enlaces de recuperación. | Añadir página 404 coherente y servirla con estado 404 real; ofrecer Inicio, Servicios y Contacto. Evitar soft-404 con respuesta 200. |
| A09 | P3 · observado | La consola registró avisos `GSAP target not found`, también desde el bundle de BaseLayout. No se observó un fallo de navegación asociado. | Guardar inicializaciones de animación cuando no existen objetivos; revisar cada familia de página. Aceptar consola limpia de esos avisos, conservando reduced motion. |
| A10 | P3 · mejora | El sitio carga tipografías externas y el borde añade un script de decodificación de correo. Formularios demo no significa ausencia total de conexiones a terceros. | Inventariar dependencias públicas, valorar fuentes locales y reflejar los servicios efectivos en la revisión de privacidad. Medir antes/después en un perfil de rendimiento consistente. |
| A11 | P2 · verificación de endurecimiento | No se observaron CSP, HSTS, X-Content-Type-Options o Referrer-Policy en las respuestas HTML muestreadas. La medición atraviesa un intermediario. | Comprobar origen y borde antes de afirmar ausencia definitiva. Evaluar CSP primero en report-only; no usar HSTS includeSubDomains sin revisar correo y demás subdominios. No se identificó una explotación concreta. |
| A12 | P3 · mejora de confianza | Los proyectos distinguen mockups conceptuales y no inventan cifras; su prueba comercial sigue siendo mayormente descriptiva. | Incorporar entregables, capturas anonimizadas autorizadas o testimonios verificables. Mantener separación entre proyectos de Soka y experiencia previa del fundador. No fabricar clientes ni métricas. |
| A13 | P3 · mejora editorial | Algunas páginas de producto explican estados internos («build, seguridad», «sin promesas infladas») en lugar del beneficio y condición de acceso. | Reescribir cada producto con problema, público, alcance disponible, límites y siguiente paso. E-commerce debe seguir presentado como concepto si no existe demo interactiva real. |
| A14 | P2 · migración pendiente | La web antigua mantiene rutas españolas diferentes y `/en/`. La decisión actual es lanzar primero en español. | Aprobar equivalencias y retirada de contenido; no redirigir indiscriminadamente todo a Inicio. Verificar estado, destino final y conservación de query strings en las reglas de Nginx del candidato final. |
| A15 | P2 · evidencia pendiente | No hay en esta ejecución Firefox, Safari, hardware móvil, lector de pantalla, zoom real, auditoría completa de contraste ni Core Web Vitals de campo. | Ejecutar una matriz representativa antes de declarar QA completa; separar resultados de laboratorio y usuarios reales. El contraste sobre transparencias/gradientes requiere medición renderizada. |

### Interpretación de robots y recursos

Google combina grupos aplicables al mismo agente y, ante reglas de igual especificidad en conflicto, elige la menos restrictiva. Por ello, el `Allow: /` público impide dar por comprobado un bloqueo total de rastreo. **Esto no demuestra indexación:** las 23 páginas siguen teniendo `noindex`. Además, bloquear rastreo no permite al buscador leer un noindex nuevo; debe decidirse una política coherente según el estado de indexación. Referencia: [especificación de robots de Google](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec).

Un recurso consultado por el cliente HTTP devolvió `403` con `error code: 1010`. Cloudflare documenta ese código como rechazo por firma del cliente. Las variantes AVIF de proyectos y retrato afectadas por la consulta automatizada sí cargaron en Chrome. No se propone desactivar controles de seguridad para hacer pasar la prueba. Referencia: [Cloudflare 1010](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/).

## Misión y visión implementadas

Ubicación: después de la introducción en `/nosotros/`, antes de «Nuestra forma de trabajar». Se reutilizan las tarjetas responsive existentes, con H2 de sección, dos H3, anclas `#mision` y `#vision`, y relaciones ARIA. El contenido se genera en HTML y no depende de una animación para aparecer.

**Misión.** Ayudar a las empresas a trabajar con más claridad y control mediante software a medida, automatización, integración de datos e infraestructura. Comprendemos cada operación para construir soluciones útiles y mantenibles, con alcance claro, documentación y acompañamiento.

**Visión.** Ser un aliado tecnológico de largo plazo para empresas en Colombia y Latinoamérica, reconocido por comprender su negocio, conectar sus procesos y acompañar su evolución. Aspiramos a que la tecnología facilite el trabajo de las personas y las decisiones de cada organización.

El texto expresa propósito y aspiración; no añade certificaciones, promesas de resultados, tamaño de equipo o condición jurídica.

## Plan de ejecución para Codex en LPT-KEVIN

1. Revisar e integrar el PR de misión/visión en la rama Astro mediante el proceso habitual. No reutilizar el antiguo candidato `78d3492`: el candidato nuevo debe incluir WhatsApp y esta sección.
2. En un checkout aislado de ese SHA exacto, ejecutar `npm ci`, `npm test`, `npm run check`, build de staging, `test:seo`, `test:contact` y smoke con el Chromium independiente de Snap. Verificar visualmente misión/visión en escritorio y móvil: esta sesión no pudo abrir su preview local desde el navegador conectado.
3. Corregir A01 y A06 en un PR acotado, con aceptación a 320 px con barra clásica y foco real. Después abordar A03–A05 y A07 como navegación/contenido; no mezclar políticas Cloudflare con cambios de componentes.
4. Publicar primero en staging con respaldo y manifiestos, preservando directorio raíz, propietario y modo 755 del bind existente. No sustituir el directorio montado ni reiniciar el contenedor por una actualización estática. Usar el runbook ya validado en el equipo, comprobando que todavía corresponde al destino real.
5. Repetir la auditoría pública sobre el SHA publicado: 23 rutas, responsive, misión/visión visible, WhatsApp, formularios demo, SEO y robots completo. Un PASS de archivo local no basta para robots transformado por el borde.
6. Preparar un candidato distinto para producción: origen principal e indexación explícita; mantener formularios demo y endpoints vacíos hasta que se autorice otro alcance. Verificar redirecciones heredadas, www, 404/410 y recuperación.
7. Cerrar respaldo privado externo/restauración y revisión legal; revalidar correo separado, servicio propuesto y túnel desde LPT. Solo entonces ejecutar el corte público con rollback comprobado y volver a auditar el dominio principal.

### Configuraciones de build

| Variable | Staging | Candidato de producción |
|---|---|---|
| PUBLIC_SITE_URL | https://prueba.sokatechnologies.com | https://sokatechnologies.com |
| PUBLIC_SITE_INDEXING | false | true |
| PUBLIC_FORM_PROVIDER | demo | demo |
| PUBLIC_CONTACT_FORM_ENDPOINT | vacío | vacío |
| PUBLIC_TURNSTILE_SITE_KEY | vacío | vacío |

Conservar el proveedor actual del correo y sus registros independientes; no incluir cambios de MX/SPF/DKIM/DMARC en este despliegue web. La recepción/envío de correo fue confirmada por el usuario en el trabajo previo y no se volvió a probar aquí.

## Validación del candidato de código

- `npm test`: 60/60. Son pruebas del proyecto/Worker; no 60 pruebas visuales de misión y visión.
- `npm run check`: 97 archivos analizados en este checkout, cero diagnósticos.
- Build staging y producción: 23 páginas cada uno.
- Checker SEO: PASS para los dos entornos, 23 rutas y 22 URLs de sitemap.
- Checker de contacto: PASS; modo demo conservado.
- HTML de misión/visión: contenido SSR, anclas y títulos presentes una sola vez en ambos builds.
- `git diff --check`: PASS.
- Candidato de producción: 71 archivos, manifiesto SHA-256 generado. No es un despliegue.
- Smoke visual del candidato nuevo: **pendiente**. El navegador conectado y el preview de este runtime no comparten localhost. Los 69 recorridos públicos corresponden a la versión publicada anterior a misión/visión.

## Inventario de rutas revisadas

Todas devolvieron HTTP 200, un H1, canonical esperado y noindex; todas se observaron en los tres viewports base. Las reservas específicas están arriba.

| Ruta | Función / observación |
|---|---|
| `/` | Inicio y recorrido comercial; recorte adicional a 320 px. |
| `/servicios/` | Índice de servicios; permite descubrir Soluciones. |
| `/soluciones/` | Seis necesidades; recorte adicional a 320 px. |
| `/servicios/software-a-medida/` | Servicio; tres FAQ por teclado. |
| `/servicios/automatizaciones/` | Servicio; tres FAQ por teclado. |
| `/servicios/dashboards/` | Servicio; tres FAQ por teclado. |
| `/servicios/consultoria-ti-devops/` | Servicio; tres FAQ por teclado. |
| `/servicios/sitios-web-corporativos/` | Servicio; tres FAQ por teclado. |
| `/servicios/infraestructura-soporte/` | Servicio; tres FAQ por teclado. |
| `/servicios/mantenimiento-mejora-continua/` | Servicio; tres FAQ por teclado. |
| `/productos/` | Catálogo sin recorrido desde Inicio. |
| `/productos/portik/` | Producto; alcance en validación. |
| `/productos/autoinventario/` | Producto; alcance en revisión. |
| `/productos/autowhatsapp/` | Producto; alcance controlado. |
| `/contacto/` | WhatsApp, correo, teléfono y simulación; recorte adicional a 320 px. |
| `/diagnostico/` | Contacto y simulación; foco pendiente de reproducción. |
| `/auditoria/` | Simulación local; sin enlace entrante en inventario. |
| `/casos/` | Compatibilidad con canonical a Proyectos; fuera del sitemap. |
| `/demos/ecommerce/` | Concepto de e-commerce; sin enlace entrante. |
| `/nosotros/` | Perfil y enfoque; misión/visión añadidas solo al candidato. |
| `/politica-privacidad/` | Información en preparación; LEGAL-01 abierto. |
| `/proyectos/` | Dos proyectos y visualizaciones conceptuales. |
| `/terminos/` | Condiciones del modo demo. |

## Límites del cierre

No hubo merge, publicación, activación del backend ni cambios de infraestructura durante esta preparación. No se afirma que todos los aspectos posibles estén comprobados: accesibilidad asistida, navegadores adicionales, operación del equipo, copias de seguridad, correo real y métricas de campo requieren sus respectivas evidencias. Los hallazgos nuevos quedan documentados; este PR implementa únicamente misión/visión y actualiza sus metadatos.
