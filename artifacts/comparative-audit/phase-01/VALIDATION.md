# Fase 0 y PR de fase 1 — validación local

Fecha de ejecución: 2026-10-28 (America/Bogota)

## Base y aislamiento

- Rama: `codex/cierre-contenido-identidad`.
- Base verificada: `feature/web-demo-2026-gsap` en `0204930e8594d90e48a5a323552d64e36f376ca9`.
- Worktree: `/srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-01-worktree`.
- Preflight SSD: PASS; `/srv/fast-storage` usa UUID `ed938ac0-0ba2-425d-acbf-5863f1e7f764`.
- Servidor de validación: únicamente `127.0.0.1:43891`.
- Build, caché temporal, capturas y este informe: SSD. No se usaron datos personales, secretos, proveedores de formularios ni formularios reales.

## Cambios verificados

| Hallazgo | Estado | Evidencia |
| --- | --- | --- |
| LEGAL-01 — salida pública | Corregido en la presentación pública; aprobación jurídica pendiente | `politica-privacidad` y `terminos` muestran solo estado demo, límites y canal de consulta. Los marcadores y la condición jurídica interna no aparecen en HTML ni bundles. `docs/redesign/politica-privacidad-colombia-borrador.md` se identifica explícitamente como plantilla pública de trabajo y no contiene identidad real, domicilio, NIT ni secretos. |
| CONTACT-01 | Verificado | `siteMeta` alimenta contacto, formularios y footer; schema usa correo sin `mailto:` y teléfono estructurado. Se conservaron `mailto:` y `tel:` en enlaces. |
| COPY-01 | Corregido y verificado | Los siete servicios conservan nombres propios como Power BI, Business Intelligence y DevOps en encabezados generados; el encabezado de alcance usa “A quién está dirigido y qué incluye”. Productos usa “Herramientas para necesidades operativas concretas” y “Qué puedes evaluar de cada producto”. EcomDemo describe capacidad y límites reales. |
| AUD-01 | Corregido y verificado | Auditoría usa “Simulación de diagnóstico web y operativo” en H1/SEO/CTA, indica que no visita ni escanea URLs y presenta hipótesis basadas en respuestas. “Solicitar una llamada” apunta a Contacto. |
| SCHEMA-01 — identidad/contacto | Corregido y verificado | Organization contiene `email: info@sokatechnologies.com`, `telephone: +57 321 2554930`, añade Colombia y conserva Panamá, República Dominicana y Latinoamérica en `areaServed`. |
| Formularios demo | Verificado | Contacto, Diagnóstico y Auditoría permanecen en demo, con endpoints vacíos y sin persistencia/envío. No se creó enlace oficial de WhatsApp. |

## Checks ejecutados

| Comando | Resultado |
| --- | --- |
| `npm ci --cache /srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-01-npm-cache --prefer-offline` | PASS; 369 paquetes, 0 vulnerabilidades reportadas. |
| `npm test` | PASS; 60 tests, 0 fallos. |
| `npm run check` | PASS; 0 errores, 0 warnings, 0 hints. |
| `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com PUBLIC_SITE_INDEXING=false PUBLIC_FORM_PROVIDER=demo PUBLIC_CONTACT_FORM_ENDPOINT= PUBLIC_TURNSTILE_SITE_KEY= npm run build` | PASS; 22 páginas estáticas generadas, staging y noindex. |
| `node scripts/phase-01-content-check.mjs` | PASS; 22 rutas, lectura específica de `link[rel="canonical"]`, excepción `/casos/` → `/proyectos/`, noindex, identidad, schema, salida legal pública, copy de Productos, CTA y límites de demos. El fixture negativo contiene la URL esperada en un `<meta>` pero un `href` canonical incorrecto; el fixture positivo acepta el `href` previsto. |
| `npm run test:local-ui` | PASS en servidor local; 22 rutas × 3 viewports, 21 FAQ y viewports críticos 360/375/390/768. |
| `git diff --check` | PASS. |

La primera ejecución del smoke no se marcó PASS: Chromium abortó antes de abrir por un `SingletonSocket` demasiado largo en el temporal SSD. Se reprodujo la causa, se pasó preflight a `/srv/fast-storage/labs/sokatechnologies-website/d1-native/t` y la segunda ejecución terminó con código 0. El temporal corto no cambia la aplicación ni el destino del build.

## Evidencia funcional

El smoke PASS confirmó:

- Overflow global e interno: 0 fallos; foco visible: 0 fallos; encabezado móvil cubriendo controles: 0 fallos.
- Menú móvil en 360, 375, 390 y 768 px: apertura, cinco enlaces visibles, Escape, devolución de foco y ausencia de overflow: PASS.
- Contacto y Diagnóstico: cinco controles inválidos detectados, asociaciones ARIA válidas, foco en el primer error, transición a éxito demo, 0 llamadas `fetch`.
- Auditoría con casos genérico, web, datos e infraestructura: 0 `fetch`, 0 XHR, 0 `sendBeacon`, 0 submit nativo; texto de simulación, hipótesis y recomendaciones visible; sin puntuaciones numéricas ni mensaje de endpoint indisponible; overflow interno: 0.
- Identidad: logo cargado, 40×40 explícito, nombre accesible, recorte circular, favicon PNG servido y datos de contacto correctos; ausencia de enlaces `wa.me`/WhatsApp: PASS.
- Proyectos: dos tarjetas, imágenes responsive cargadas, leyendas correctas, sin etiquetas duplicadas ni doble “Proyecto directo”.

## Capturas

- Comparativa previa disponible en [`before/`](./before/), tomada de la evidencia local anterior del mismo sitio.
- Evidencia posterior generada por el smoke en [`after/`](./after/), incluyendo portada, mapa, contacto, Auditoría, resultado demo, Proyectos y Nosotros en los viewports aplicables.
- Para este ajuste se revisaron específicamente [`servicio-automatizaciones-alcance-desktop.png`](./after/servicio-automatizaciones-alcance-desktop.png), [`productos-evaluacion-desktop.png`](./after/productos-evaluacion-desktop.png) y sus capturas de portada [`servicio-automatizaciones-desktop.png`](./after/servicio-automatizaciones-desktop.png), [`productos-desktop.png`](./after/productos-desktop.png): los encabezados se muestran completos, legibles y sin overflow interno.

## Pendientes y límites

- LEGAL-01 no está cerrado jurídicamente: falta aprobar responsable, textos definitivos, finalidades, proveedores, conservación, solicitudes de titulares y demás contenido aplicable.
- La ausencia de envíos en este modo demo no se presenta como ausencia absoluta de tratamiento técnico del sitio o de la infraestructura.
- No se activaron formularios, correo, persistencia, proveedores, analítica, WhatsApp ni infraestructura externa.
- No se ejecutó publicación, commit, push, merge ni despliegue. Este informe y los cambios quedan para revisión del PR de fase 1.
