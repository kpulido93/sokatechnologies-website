# Validación fase 2 — UX, navegación y responsive

Fecha: 2026-10-28 (America/Bogota)

Base verificada: `a30c62bef58d485d99c5038b5afcaa14f3f84299` (`feature/web-demo-2026-gsap`).
Rama: `codex/ux-navegacion-responsive`.

## Cambios verificados

- La portada conserva el H1 aprobado, logo, imágenes y CTA principal/secundario; se redujeron escala, separación y repetición de mensajes.
- Contacto, Diagnóstico y Simulación conservan etiquetas, errores y foco visible. En demo los botones no son submit nativo, y los campos de texto, select y textarea ocupan al menos 80 % del ancho del formulario en los viewports móviles críticos.
- `/soluciones/` presenta seis necesidades compactas y enlaces a servicios existentes. Servicios enlaza a esta página sin añadirla al menú principal.
- `phase-01-content-check.mjs` descubre las páginas HTML generadas y ya no fija 22 rutas. Conserva la excepción canonical `/casos/` → `/proyectos/` y prueba un falso positivo donde la URL esperada aparece fuera del canonical.
- `local-ui-smoke.mjs` descubre rutas del build mediante su lista de recorridos, elimina la condición fija de cinco enlaces, incorpora `/soluciones/`, 320 y 430 px, y comprueba el bloqueo de submit nativo demo.
- Se mantienen URL de staging, `noindex`, endpoints vacíos, proveedores demo y LEGAL-01 pendiente.

## Rutas generadas y cobertura

El build produjo 23 páginas públicas HTML. Las 23 se recorrieron en los tres viewports base (69 combinaciones):

1. `/`
2. `/servicios/`
3. `/soluciones/`
4. `/servicios/software-a-medida/`
5. `/servicios/automatizaciones/`
6. `/servicios/dashboards/`
7. `/servicios/consultoria-ti-devops/`
8. `/servicios/sitios-web-corporativos/`
9. `/servicios/infraestructura-soporte/`
10. `/servicios/mantenimiento-mejora-continua/`
11. `/productos/`
12. `/productos/portik/`
13. `/productos/autoinventario/`
14. `/productos/autowhatsapp/`
15. `/contacto/`
16. `/diagnostico/`
17. `/auditoria/`
18. `/casos/`
19. `/demos/ecommerce/`
20. `/nosotros/`
21. `/politica-privacidad/`
22. `/proyectos/`
23. `/terminos/`

Viewports base: escritorio `1440×900`, tablet `768×1024`, móvil `375×812`.
Viewports críticos adicionales: `320×812`, `360×812`, `390×844` y `430×900`; se probaron formularios, cabecera, foco y overflow junto con `768×1024`.

## Resultados

| Comprobación | Resultado |
|---|---|
| `npm test` | PASS — 60/60 pruebas Worker |
| `npm run check` | PASS — 0 errores, 0 warnings, 0 hints |
| Build staging aislado | PASS — 23 páginas, `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com`, `PUBLIC_SITE_INDEXING=false`, proveedor demo y endpoints vacíos |
| `node scripts/phase-01-content-check.mjs` | PASS — 23 rutas descubiertas, canonical/noindex, `/casos/` → `/proyectos/`, identidad, soluciones y demos |
| Sitemap | PASS — `dist/sitemap-index.xml` referencia el sitemap generado y `sitemap-0.xml` contiene `https://prueba.sokatechnologies.com/soluciones/` |
| `npm run test:local-ui` | PASS — 23×3 rutas/viewports, 21 FAQ, overflow 0, foco 0, cabecera móvil 0, cobertura móvil <80 % 0, identidad 0 |
| Flujos Contacto/Diagnóstico | PASS — errores asociados, primer error enfocado, transición a éxito demo, `fetch=0`, submit nativo=0 |
| Simulación demo | PASS — escenarios genérico, web, datos e infraestructura; `fetch=0`, XHR=0, beacon=0, submit nativo=0, contenido completo, sin puntuación ni afirmación de escaneo |
| Soluciones | PASS — seis tarjetas, todas con relaciones a servicios y bloque de mantenimiento/acompañamiento |
| `git diff --check` | PASS |

El resultado completo del smoke está en [`local-ui-smoke.json`](./local-ui-smoke.json). La comprobación adicional está en [`accessibility-extra.json`](./accessibility-extra.json).

## Accesibilidad y revisión visual

Se usó Chromium `156.0.8078.47` en modo headless local. Se verificaron skip link, Tab, apertura/cierre del menú, Escape, devolución de foco, foco visible, campos no cubiertos por la cabecera, FAQ (21 elementos), reduced-motion, contenido sin JavaScript y un proxy de zoom 200 % mediante `document.documentElement.style.zoom = 2`.

El probe de contraste no interpreta automáticamente el fondo compuesto por gradientes. La revisión conservadora de los tokens declarados produjo estos ratios sobre `--color-ink`: texto normal 17.04, texto atenuado 7.67, texto del botón sobre `--color-blue-bright` 10.04 y aviso demo 16.15. No equivale a una auditoría WCAG completa de cada combinación y estado.

Capturas comparables:

- Antes: [`before/home-desktop.png`](./before/home-desktop.png), [`before/home-map-desktop.png`](./before/home-map-desktop.png), [`before/contacto-desktop.png`](./before/contacto-desktop.png), [`before/contacto-mobile.png`](./before/contacto-mobile.png), [`before/auditoria-demo-result-desktop.png`](./before/auditoria-demo-result-desktop.png).
- Después: [`after/home-desktop.png`](./after/home-desktop.png), [`after/home-map-desktop.png`](./after/home-map-desktop.png), [`after/soluciones-desktop.png`](./after/soluciones-desktop.png), [`after/soluciones-mobile.png`](./after/soluciones-mobile.png), [`after/contacto-desktop.png`](./after/contacto-desktop.png), [`after/contacto-mobile.png`](./after/contacto-mobile.png), [`after/auditoria-demo-result-desktop.png`](./after/auditoria-demo-result-desktop.png), [`after/auditoria-demo-result-mobile.png`](./after/auditoria-demo-result-mobile.png), [`after/proyectos-cards-desktop.png`](./after/proyectos-cards-desktop.png).

Todas las simulaciones usaron datos ficticios. No se hicieron peticiones a Turnstile, Resend ni a URLs introducidas en Auditoría.

## Pendientes y límites

- LEGAL-01 sigue pendiente de aprobación jurídica y de los textos definitivos; esta fase no modifica documentos legales.
- No se probó Firefox, Safari ni hardware móvil real.
- La comprobación de zoom es un proxy automatizado, no una medición de navegador asistivo ni una certificación WCAG.
- No hubo despliegue, cambios de DNS/Cloudflare/WordPress/Docker ni activación de formularios.
