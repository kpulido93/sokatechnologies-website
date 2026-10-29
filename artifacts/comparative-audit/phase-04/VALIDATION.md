# Fase 4 — ruta A: contacto directo

Validación local del worktree SSD `codex/canal-comercial`, basada en el merge
`368216a2a735eb0518d377bc21fdc116e0cfae09` de `feature/web-demo-2026-gsap`.

## Resultado

La fase queda validada localmente, sin commit, push, merge ni despliegue.
Contacto ofrece dos acciones directas: `mailto:info@sokatechnologies.com` y
`tel:+573212554930`. Inicio, Servicios, Soluciones y Diagnóstico conducen a
`/contacto/` mediante «Abrir conversación»; Diagnóstico conserva además el
acceso directo de correo.

Las vistas de Contacto y Diagnóstico identifican sus formularios como
simulaciones. El build mantiene `PUBLIC_FORM_PROVIDER=demo`, endpoint vacío,
clave Turnstile vacía y noindex. No se habilitaron proveedores, analítica,
WhatsApp, persistencia ni envíos.

## Comandos y resultados

Todos los artefactos, caché, worktree y capturas se mantuvieron bajo
`/srv/fast-storage`.

| Comando | Resultado |
|---|---|
| `npm ci --ignore-scripts` | PASS; 385 paquetes auditados, 0 vulnerabilidades reportadas por npm |
| `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com PUBLIC_SITE_INDEXING=false PUBLIC_FORM_PROVIDER=demo PUBLIC_CONTACT_FORM_ENDPOINT= PUBLIC_TURNSTILE_SITE_KEY= ASTRO_TELEMETRY_DISABLED=1 npm run build -- --mode staging` | PASS; 23 rutas generadas, imágenes optimizadas |
| `npm test` | PASS; 60/60 pruebas |
| `npm run check` | PASS; 118 archivos, 0 errores, 0 warnings, 0 hints |
| `npm run test:contact` | PASS; CTA, correo, teléfono, contenido orientativo, modo demo, endpoint vacío y ausencia de promesas no aprobadas |
| `node scripts/phase-01-content-check.mjs` | PASS; inventario público, canonical/noindex, contenido legal público, soluciones y demos |
| `SEO_DIST=dist SEO_EXPECTED_ORIGIN=https://prueba.sokatechnologies.com SEO_EXPECT_INDEXING=false npm run test:seo` | PASS; 23 rutas, 22 URLs de sitemap, sin fallos |
| `npm run test:local-ui` con `BASE_URL=http://127.0.0.1:4326` y `UI_SMOKE_STRICT=true` | PASS; 23 rutas × 3 viewports, 118 capturas generadas, 0 overflow, 0 fallos de foco y 0 fallos de cobertura móvil |
| Smoke responsive | PASS en 320, 360, 375, 390, 430 y 768 px para Contacto, Diagnóstico y Auditoría; menú, Escape, devolución de foco y ausencia de overflow |
| Flujo demo de formularios | PASS; errores asociados, foco en el primer error, transición a éxito demo y 0 `fetch`, XHR, `sendBeacon` o submit nativo |
| Auditoría demo | PASS en escenarios genérico, web, datos e infraestructura; resultado como simulación/hipótesis, sin escaneo afirmado, puntuaciones ni indisponibilidad de endpoint; 0 overflow interno |
| `git diff --check` | PASS |

La primera ejecución del smoke sobre el puerto 4323 no se considera una
validación del artefacto: ese puerto estaba ocupado por un servidor de otra
copia del repositorio. Se repitió en el preview correcto del worktree, puerto
4326, y el resultado estricto anterior es el válido.

## Evidencia

- Antes: `before/contacto-desktop.png`, `before/contacto-mobile.png`,
  `before/diagnostico-desktop.png` y `before/home-desktop.png`.
- Después: 26 PNG conservados en `after/`, incluyendo cabecera móvil, CTA de
  Inicio y Soluciones, Contacto, Diagnóstico, formularios y resultados de
  Auditoría. Las capturas restantes generadas por el smoke no se incluyen por
  no ser necesarias para este PR.
- Resultado estructurado del smoke estricto: `local-ui-smoke-strict.json`.
- El smoke también comprobó navegación por teclado, foco visible, menú móvil,
  honeypot no visible/no alcanzable con Tab y botones demo activables por clic,
  teclado y `requestSubmit()`.

## Revisión manual

Se inspeccionaron visualmente las capturas antes/después de Contacto,
Diagnóstico e Inicio en escritorio, y Contacto en móvil. Se verificaron las
dos acciones directas, el CTA de cabecera, la separación entre orientación
comercial y formulario demo, y la legibilidad del contenido.

La comprobación se realizó con Chromium headless local. Firefox, Safari,
dispositivos físicos y lectores de pantalla no fueron ejecutados en esta fase.

## Pendientes

- `LEGAL-01`: los textos legales siguen pendientes de aprobación del
  responsable y revisión jurídica; esta validación no constituye aprobación.
- No se habilita ningún canal de recepción automática. La ruta A solo prepara
  el contacto directo por correo o llamada.
