# Plan de implementación de la web corporativa Astro

## Alcance de esta tarea

La rama de trabajo parte de `feature/web-demo-2026-gsap`. Esta primera entrega solo normaliza el correo comercial público y deja documentada la ruta de implementación. No conecta formularios, no cambia el backend, no modifica WordPress/cPanel y no ejecuta despliegues.

El correo público y destinatario comercial aprobado es `info@sokatechnologies.com`. La variable pública `PUBLIC_CONTACT_FALLBACK_EMAIL` y el destinatario server-side `LEADS_TO_EMAIL` se mantienen separados del remitente técnico `RESEND_FROM_EMAIL`. No se incluyen valores de secretos ni se configura `Reply-To` en esta tarea.

## Estado técnico verificado

- Astro 7, TypeScript y GSAP; `astro.config.mjs` usa `output: "static"` y sitemap.
- `src/lib/site.ts` centraliza metadatos, navegación, footer y opciones del formulario.
- `src/pages/index.astro` compone servicios, productos, casos y demos desde `src/data/`.
- `src/data/services.ts` alimenta `/servicios/` y sus landings; `src/data/caseStudies.ts` alimenta `/casos/` y las referencias cruzadas de servicios.
- `src/pages/contacto.astro` y `src/pages/diagnostico.astro` reutilizan `ContactForm.astro`.
- Los formularios de contacto siguen en modo demo si no existe un endpoint público configurado; el texto actual evita afirmar que se enviaron o almacenaron datos.
- `/api/audit` contiene validación y generación de reporte, pero el build estático no ofrece procesamiento server-side persistente ni envío de correo. Su POST requerirá renderizado on-demand y un adapter aprobado antes de tratarlo como backend.
- `Dockerfile` construye `dist/` y lo sirve con Nginx. `.cpanel.yml` está restringido al tema WordPress y no es un mecanismo de despliegue para Astro.

## Incorporación del contenido maestro

El [documento maestro de contenido](https://github.com/kpulido93/sokatechnologies-docs/blob/main/docs/marketing/Contenido_Web_Corporativa_SokaTechnologies.md) propone esta arquitectura editorial:

| Contenido aprobado | Destino Astro previsto | Trabajo pendiente |
|---|---|---|
| Inicio, propuesta de valor, método y CTA | `src/pages/index.astro` y `src/lib/site.ts` | Sustituir gradualmente el copy de demo sin inventar métricas ni claims. |
| Servicios y landings | `src/data/services.ts`, `src/pages/servicios/` | Mapear nombres, slugs y entregables aprobados. |
| Proyectos anonimizados | `src/data/caseStudies.ts`, futura `/proyectos/` | Alinear casos, permisos y riesgo de reidentificación. |
| Nosotros | futura `/nosotros/` | Incorporar solo la información aprobada del fundador y diferenciar experiencia personal de trayectoria empresarial. |
| Contacto y diagnóstico | `src/pages/contacto.astro`, `src/pages/diagnostico.astro`, `ContactForm.astro` | Definir recepción, anti-spam, privacidad y confirmación antes de activar envío real. |

La navegación actual expone `Productos` y `Casos`; el contenido maestro propone `Proyectos` y `Nosotros`. La decisión de rutas, redirecciones y tratamiento de productos debe resolverse en la PR de contenido, no en esta normalización. Portik permanece fuera de la publicación corporativa hasta su validación comercial.

## Secuencia propuesta de pull requests

1. **PR 01 — correo y documentación mínima (esta tarea).** Actualizar referencias públicas y destinatario de ejemplo a `info@sokatechnologies.com`; mantener separados remitente técnico, Reply-To futuro y secretos. Sin cambiar el comportamiento demo.
2. **PR 02 — contenido y arquitectura.** Integrar el contenido maestro en inicio, servicios, proyectos, nosotros y contacto; definir slugs, navegación, casos anonimizados y páginas nuevas. Validar permisos y claims antes de publicar.
3. **PR 03 — sistema visual B2B.** Consolidar tokens, tipografía, contraste, layout responsive, navegación, hero y tarjetas usando Astro/CSS/GSAP ya instalados. Incluir foco visible, HTML semántico, estados sin JavaScript y `prefers-reduced-motion`. No añadir React, Tailwind ni otra librería de animación.
4. **PR 04 — formularios y runtime.** Mantener demo hasta aprobar proveedor y flujo. Después definir endpoint, validación server-side, Turnstile, rate limit, persistencia mínima, destinatario `LEADS_TO_EMAIL`, remitente `RESEND_FROM_EMAIL` y `Reply-To` derivado del correo del prospecto. Resolver el modo on-demand de `/api/audit` antes de prometer reportes o notificaciones.
5. **PR 05 — SEO y publicación controlada.** Revisar títulos, descripciones, canonical, sitemap, datos estructurados, privacidad, accesibilidad, rendimiento, protección/noindex de prueba, redirects y rollback. Comparar el destino final con WordPress antes de cambiar DNS o hosting.

## Evaluación de referencias de diseño

- [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) puede usarse como referencia de criterio para jerarquía, sistema visual, UX, responsive y revisión de accesibilidad. El repositorio declara licencia MIT; no se incorpora como dependencia de runtime ni se instala en esta PR. Una futura instalación del skill requeriría una decisión separada y revisión de dependencias.
- [21st.dev — Hero components](https://21st.dev/community/components/s/hero) sirve como biblioteca de referencias para composición de hero, contraste, ritmo visual y CTA. La página está orientada a componentes comunitarios React/Tailwind; por eso se tomarán patrones visuales, no código ni dependencias. La implementación prevista es nativa en `.astro`, CSS y GSAP, con alternativa funcional sin animación.

La identidad propuesta debe ser sobria y B2B: una promesa clara, prueba mediante casos anonimizados, navegación corta, CTAs medibles y movimiento discreto. Toda animación debe degradar correctamente en móvil, bajo rendimiento y `prefers-reduced-motion`.

## Validación y riesgos

Para esta PR: `npm ci`, `npm run check`, `npm run build`, `git diff --check` y búsqueda de referencias antiguas al correo. `PUBLIC_CONTACT_FALLBACK_EMAIL` puede sobreescribir el fallback del código en un despliegue; la configuración real de la plataforma debe auditarse antes de publicar. El endpoint, la entrega de correo, el almacenamiento de leads, permisos de casos y rutas de migración siguen sin estar verificados.
