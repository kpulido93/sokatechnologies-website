# Plan de implementación de la web corporativa Astro

## Alcance de esta tarea

La rama de trabajo parte de `feature/web-demo-2026-gsap`. La Tarea 02-A implementó la nueva Home corporativa en Astro y la ruta `/nosotros/`. La Tarea 02-B1 consolidó los servicios B2B y la Tarea 02-B2 implementa `/proyectos/`, la navegación corporativa definitiva y una selección pública limitada a dos proyectos directos. No conecta formularios, no cambia el backend, no modifica WordPress/cPanel y no ejecuta despliegues desde este documento.

El correo público y destinatario comercial aprobado es `info@sokatechnologies.com`. La variable pública `PUBLIC_CONTACT_FALLBACK_EMAIL` y el destinatario server-side `LEADS_TO_EMAIL` se mantienen separados del remitente técnico `RESEND_FROM_EMAIL`. No se incluyen valores de secretos ni se configura `Reply-To` en esta tarea.

## Estado técnico verificado

- Astro 7, TypeScript y GSAP; `astro.config.mjs` usa `output: "static"` y sitemap.
- `src/lib/site.ts` centraliza metadatos, navegación, footer y opciones del formulario.
- `src/pages/index.astro` compone servicios y proyectos resumidos desde `src/data/`.
- `src/data/services.ts` alimenta `/servicios/` y sus landings; `src/data/caseStudies.ts` contiene únicamente los dos proyectos directos publicados en `/proyectos/`.
- `src/pages/contacto.astro` y `src/pages/diagnostico.astro` reutilizan `ContactForm.astro`.
- Los formularios de contacto siguen en modo demo si no existe un endpoint público configurado; el texto actual evita afirmar que se enviaron o almacenaron datos.
- `/api/audit` contiene validación y generación de reporte, pero el build estático no ofrece procesamiento server-side persistente ni envío de correo. Su POST requerirá renderizado on-demand y un adapter aprobado antes de tratarlo como backend.
- `Dockerfile` construye `dist/` y lo sirve con Nginx. `.cpanel.yml` está restringido al tema WordPress y no es un mecanismo de despliegue para Astro.

## Incorporación del contenido maestro

El [documento maestro de contenido](https://github.com/kpulido93/sokatechnologies-docs/blob/main/docs/marketing/Contenido_Web_Corporativa_SokaTechnologies.md) propone esta arquitectura editorial:

| Contenido aprobado | Destino Astro previsto | Trabajo pendiente |
|---|---|---|
| Inicio, propuesta de valor, método y CTA | `src/pages/index.astro` y `src/lib/site.ts` | Implementado en la Tarea 02-A. Mantener los claims cualitativos y revisar enlaces durante 02-B. |
| Servicios y landings | `src/data/services.ts`, `src/pages/servicios/` | Implementado en la Tarea 02-B1 con siete áreas B2B y slugs compatibles. |
| Proyectos empresariales | `src/data/caseStudies.ts`, `/proyectos/` | Implementado en Tarea 02-B2 con dos proyectos directos, sin nombres, ubicaciones, cifras ni detalles sensibles. |
| Nosotros | `src/pages/nosotros.astro` | Implementado en la Tarea 02-A con la información aprobada del fundador y la distinción frente a su experiencia internacional. |
| Contacto y diagnóstico | `src/pages/contacto.astro`, `src/pages/diagnostico.astro`, `ContactForm.astro` | Definir recepción, anti-spam, privacidad y confirmación antes de activar envío real. |

La navegación corporativa definitiva es `Inicio`, `Servicios`, `Proyectos`, `Nosotros` y `Contacto`, con `Solicitar diagnóstico` como CTA destacado. Las rutas `/productos/` y sus páginas individuales se conservan, pero no se promocionan desde la navegación principal ni el footer corporativo. `/casos/` permanece temporalmente como página compatible, con canonical hacia `/proyectos/`; la redirección HTTP 301 deberá aprobarse y configurarse en la infraestructura de publicación.

## Secuencia propuesta de pull requests

1. **PR 01 — correo y documentación mínima.** Actualizar referencias públicas y destinatario de ejemplo a `info@sokatechnologies.com`; mantener separados remitente técnico, Reply-To futuro y secretos. Sin cambiar el comportamiento demo.
2. **Tarea 02-A — Home y Nosotros (implementada).** Integrar la propuesta corporativa en Inicio, crear `/nosotros/`, añadir temporalmente Nosotros a la navegación, mantener las rutas existentes y evitar destacar casos cuya anonimización o autorización aún no esté validada.
3. **Tarea 02-B1 — servicios corporativos (implementada).** Mapear las siete áreas B2B y sus landings sin añadir dependencias.
4. **Tarea 02-B2 — proyectos y navegación definitiva (en revisión).** Publicar dos proyectos directos, separar la experiencia internacional del fundador, conservar `/casos/` como compatibilidad y retirar productos no validados de la navegación corporativa.
5. **PR siguiente — sistema visual B2B.** Consolidar tokens, tipografía, contraste, layout responsive, navegación, hero y tarjetas usando Astro/CSS/GSAP ya instalados. Incluir foco visible, HTML semántico, estados sin JavaScript y `prefers-reduced-motion`. No añadir React, Tailwind ni otra librería de animación.
6. **PR siguiente — formularios y runtime.** Mantener demo hasta aprobar proveedor y flujo. Después definir endpoint, validación server-side, Turnstile, rate limit, persistencia mínima, destinatario `LEADS_TO_EMAIL`, remitente `RESEND_FROM_EMAIL` y `Reply-To` derivado del correo del prospecto. Resolver el modo on-demand de `/api/audit` antes de prometer reportes o notificaciones.
7. **PR siguiente — SEO y publicación controlada.** Revisar títulos, descripciones, canonical, sitemap, datos estructurados, privacidad, accesibilidad, rendimiento, protección/noindex de prueba, redirects y rollback. Comparar el destino final con WordPress antes de cambiar DNS o hosting.

## Evaluación de referencias de diseño

- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) puede usarse como referencia de criterio para jerarquía, sistema visual, UX, responsive y revisión de accesibilidad. El repositorio declara licencia MIT; no se incorpora como dependencia de runtime ni se instala en esta PR. Una futura instalación del skill requeriría una decisión separada y revisión de dependencias.
- [21st.dev — Hero components](https://21st.dev/community/components/s/hero) sirve como biblioteca de referencias para composición de hero, contraste, ritmo visual y CTA. La página está orientada a componentes comunitarios React/Tailwind; por eso se tomarán patrones visuales, no código ni dependencias. La implementación prevista es nativa en `.astro`, CSS y GSAP, con alternativa funcional sin animación.

La identidad propuesta debe ser sobria y B2B: una promesa clara, prueba mediante casos anonimizados, navegación corta, CTAs medibles y movimiento discreto. Toda animación debe degradar correctamente en móvil, bajo rendimiento y `prefers-reduced-motion`.

## Validación y riesgos

Para esta PR: `npm ci`, `npm run check`, `npm run build`, `git diff --check` y búsqueda de referencias antiguas al correo. `PUBLIC_CONTACT_FALLBACK_EMAIL` puede sobreescribir el fallback del código en un despliegue; la configuración real de la plataforma debe auditarse antes de publicar. El endpoint, la entrega de correo, el almacenamiento de leads, permisos de casos y rutas de migración siguen sin estar verificados.
