# Validación previa al lanzamiento — PR #30

Fecha: 2026-11-03 (America/Bogota)

Rama de trabajo: `codex/mision-vision-auditoria`
Base revisada: `feature/web-demo-2026-gsap`
Build validado: `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com`, `PUBLIC_SITE_INDEXING=false`, `PUBLIC_FORM_PROVIDER=demo`, endpoint y Turnstile vacíos.
Preview local: `http://127.0.0.1:4326` sirviendo el artefacto SSD `phase30-evidence/staging/`.

## Resultado

| Comprobación | Estado | Evidencia |
|---|---|---|
| `npm test` | PASS | 60/60 pruebas, 0 fallos |
| `npm run check` | PASS | 120 archivos, 0 errores, warnings ni hints |
| Build de staging | PASS | Astro estático, 23 páginas generadas |
| `npm run test:contact` | PASS | Recorrido directo, copy demo, endpoint vacío; también cubre Proyectos y EcomDemo |
| `npm run test:contact:modes` | PASS | Demo explícito, worker incompleto en demo y worker sintético válido en live |
| `npm run test:seo` | PASS | 23 rutas; canonical/OG, sitemap, robots y noindex de staging alineados |
| `npm run test:local-ui` | PASS | Chromium for Testing 156.0.8078.4; 23 rutas, 3 viewports base y 6 responsive |
| `git diff --check` | PASS | Sin errores de whitespace |

La primera ejecución del smoke no se marca como PASS: falló porque Chromium recibió un `TMPDIR` SSD demasiado profundo y rechazó `SingletonSocket` por longitud. Se repitió con un perfil relativo dentro del worktree SSD; la ejecución final terminó con código 0 y su salida JSON está en [`local-ui-smoke.json`](./local-ui-smoke.json).

## Alcance funcional comprobado

- Inventario generado: 23 rutas, sin faltantes ni inesperadas. Incluye rutas comerciales, demos y compatibilidad; `/casos/` conserva su clasificación de compatibilidad.
- Inicio: misión visual, H1 y CTA visibles; la imagen del hero carga con `srcset` y `sizes`.
- Nosotros: misión y visión conservadas con anclas `#mision` y `#vision`; el título y la descripción SEO siguen presentes.
- Navegación: `Productos` es accesible desde la cabecera y el pie. Diagnóstico, Auditoría y EcomDemo se identifican como simulaciones.
- CTA comercial: los CTA revisados apuntan a `/contacto/#contacto-directo`; las acciones demo permanecen separadas.
- El checker de contacto ahora contrasta también Proyectos y EcomDemo, y exige el texto de alcance de demo e-commerce sin fijar un número de rutas.
- Formularios: Contacto, Diagnóstico y Auditoría conservan modo demo. Validación vacía enfoca el primer campo inválido; las asociaciones `aria-invalid`, `aria-describedby` y `aria-errormessage` se resolvieron. El formulario completo transiciona a éxito demo.
- Red: durante los flujos demo se instrumentaron `fetch`, XHR, `sendBeacon` y `HTMLFormElement.submit`; el resultado fue 0 llamadas en los tres formularios. No hubo correo, persistencia ni proveedor externo.
- Auditoría: se probaron respuestas genéricas y escenarios de web, datos e infraestructura. El resultado indica temas/hipótesis derivados de las respuestas, no problemas medidos, escaneados o confirmados; no presenta puntuaciones numéricas.
- Responsive: no hubo overflow global, interno ni anidado en 320, 360, 375, 390, 430 y 768 px. Los campos alcanzaron como mínimo 80.25% del ancho útil de página a 320 px; se registraron también el ancho del formulario y el del `page-shell`.
- Menú y foco: teclado, apertura, foco del primer enlace, Escape, devolución de foco y foco visible pasaron en los viewports responsive. FAQ: 21 preguntas, asociaciones válidas y apertura del primer elemento.
- Identidad: logo, proporciones, favicon, teléfono, correo y ubicación pública pasaron en las comprobaciones del smoke.

## Evidencia visual

- [Inicio escritorio](./home-desktop.png) y [Inicio móvil](./home-mobile.png)
- [Nosotros escritorio](./nosotros-desktop.png) y [Nosotros móvil](./nosotros-mobile.png)
- [Contacto escritorio](./contacto-form-desktop.png) y [Contacto a 320 px](./contacto-form-mobile-320.png)
- [Diagnóstico escritorio](./diagnostico-form-desktop.png) y [Diagnóstico a 320 px](./diagnostico-form-mobile-320.png)
- [Simulación generada escritorio](./auditoria-demo-result-desktop.png) y [móvil](./auditoria-demo-result-mobile.png)
- [Soluciones escritorio](./soluciones-desktop.png) y [móvil](./soluciones-mobile.png)

Las capturas se generaron después de las validaciones de demo. La inspección visual confirmó contenido completo, columnas legibles, ausencia de recortes internos y separación clara entre simulación y contacto.

## Revalidación del P2 de modo de formulario

Revisión local adicional sobre el HEAD de esta rama: `src/pages/diagnostico.astro` ya no añade un aviso independiente que contradiga el modo efectivo. `ContactForm.astro` mantiene la única resolución de modo (`worker` + endpoint permitido + clave Turnstile = `live`; cualquier otra combinación = `demo`) y renderiza título, descripción, eyebrow, aviso y botón desde esa misma fuente.

| Escenario | Resultado |
|---|---|
| Demo explícito | PASS: copy demo, atributos `data-form-mode="demo"` y endpoint vacío |
| Worker incompleto | PASS: permanece demo |
| Worker sintético válido | PASS: copy y atributos live coherentes en build aislado; no se realizaron solicitudes |
| Smoke local posterior al ajuste | PASS: 23 rutas, 21 FAQ, foco/overflow/cobertura responsive y formularios demo sin red; [`p2-local-ui-smoke.json`](./p2-local-ui-smoke.json) |

Esta es evidencia de revisión local del código y no sustituye la revisión remota de Codex del nuevo HEAD.

## Pendientes y límites

- No se ejecutaron Firefox, Safari/WebKit real, dispositivos físicos, lector de pantalla real ni zoom físico del navegador. El smoke solo acredita Chromium for Testing y emulación de viewport.
- No se desplegó ni se consultó el dominio público. No se probaron servicios reales, correo, persistencia, proveedores, Cloudflare ni infraestructura.
- `LEGAL-01` permanece pendiente de aprobación jurídica; ocultar un borrador o conservar `noindex` no constituye aprobación.
