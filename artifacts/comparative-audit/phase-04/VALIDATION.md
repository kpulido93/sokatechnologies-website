# Fase 4 — ruta A: contacto directo

Validación local del worktree SSD `codex/canal-comercial`, basada en el merge
`368216a2a735eb0518d377bc21fdc116e0cfae09` de `feature/web-demo-2026-gsap`.

## Resultado

La actualización queda validada localmente, sin merge ni despliegue.
Contacto ofrece dos acciones directas: `mailto:info@sokatechnologies.com` y
`tel:+573212554930`. Inicio, Servicios, Soluciones y Diagnóstico conducen a
`/contacto/#contacto-directo` mediante «Abrir conversación»; Contacto también
expone correo y llamada en el hero, y Diagnóstico conserva el acceso directo
de correo.

`ContactForm` calcula una única vez el modo efectivo: solo es `live` cuando el
proveedor es Worker, el endpoint está permitido y existe la clave Turnstile.
Título, descripción, eyebrow, aviso, botón, atributos y estado de éxito salen
de esa misma selección. El build de staging mantiene
`PUBLIC_FORM_PROVIDER=demo`, endpoint vacío, clave Turnstile vacía y noindex.
No se habilitaron proveedores, analítica, WhatsApp, persistencia ni envíos.

## Comandos y resultados

Todos los artefactos, caché, worktree y capturas se mantuvieron bajo
`/srv/fast-storage`.

| Comando | Resultado |
|---|---|
| `npm ci --ignore-scripts` | PASS; 385 paquetes auditados, 0 vulnerabilidades reportadas por npm |
| `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com PUBLIC_SITE_INDEXING=false PUBLIC_FORM_PROVIDER=demo PUBLIC_CONTACT_FORM_ENDPOINT= PUBLIC_TURNSTILE_SITE_KEY= ASTRO_TELEMETRY_DISABLED=1 npm run build -- --mode staging` | PASS; 23 rutas generadas, imágenes optimizadas |
| `npm test` | PASS; 60/60 pruebas |
| `npm run check` | PASS; 119 archivos, 0 errores, 0 warnings, 0 hints |
| `npm run test:contact` | PASS; CTA con ancla, correo, teléfono, contenido orientativo, modo demo, endpoint vacío y ausencia de promesas no aprobadas |
| `npm run test:contact:modes` | PASS; demo explícito, Worker incompleto → demo y Worker válido → live con copy/atributos coherentes |
| Builds de matriz aislada | PASS; 23 rutas por caso en `phase-04-mode-builds/{demo,worker-incomplete,worker-valid}`. Endpoint `https://forms.example.invalid/api/leads` y clave sintéticos; no se cargaron servicios externos |
| `node scripts/phase-01-content-check.mjs` | PASS; inventario público, canonical/noindex, contenido legal público, soluciones y demos |
| `SEO_DIST=dist SEO_EXPECTED_ORIGIN=https://prueba.sokatechnologies.com SEO_EXPECT_INDEXING=false npm run test:seo` | PASS; 23 rutas, 22 URLs de sitemap, sin fallos |
| `BASE_URL=http://127.0.0.1:4330 node scripts/local-ui-smoke.mjs` con `UI_SMOKE_STRICT=true` implícito | PASS; 23 rutas × 3 viewports, 118 capturas generadas, 0 overflow, 0 fallos de foco y 0 fallos de cobertura móvil; JSON válido |
| Smoke responsive | PASS en 320, 360, 375, 390, 430 y 768 px para Contacto, Diagnóstico y Auditoría; menú, Escape, devolución de foco y ausencia de overflow |
| Flujo demo de formularios | PASS; errores asociados, foco en el primer error, transición a éxito demo y 0 `fetch`, XHR, `sendBeacon` o submit nativo |
| Auditoría demo | PASS en escenarios genérico, web, datos e infraestructura; resultado como simulación/hipótesis, sin escaneo afirmado, puntuaciones ni indisponibilidad de endpoint; 0 overflow interno |
| `git diff --check` | PASS |

Las ejecuciones sobre 4323 y 4326 no se consideran evidencia de esta
actualización: 4323 estaba ocupado por otra copia del repositorio y 4326
correspondía al preview de la ejecución anterior. La ejecución válida de este
HEAD usa el preview del worktree SSD en `http://127.0.0.1:4330`.
El archivo `local-ui-smoke-strict.json` se generó directamente con Node, sin
la cabecera de `npm`, y se valida con `JSON.parse`; la salida de error se
separó fuera del PR en el laboratorio SSD.

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
