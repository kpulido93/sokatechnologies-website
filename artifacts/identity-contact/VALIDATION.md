# Validación local de identidad y contacto

## Alcance

- Rama: `codex/identidad-contacto`.
- Base: `feature/web-demo-2026-gsap` en `305de3a4cd65fe872c22f9ed33bf1552194f09ca`.
- Logo fuente: `logo-sokatechnologies.png` adjunto en `soka-imagenes`.
- Logo servido: `public/brand/sokatechnologies-logo.png`.
- El PNG original no fue modificado; ambos archivos tienen dimensiones 638×634
  y SHA-256 `d97c1fa7ee072db59683a06ab07c512e20f4f266cc270d7d7bb50e0fd78e5cb4`.

## Comprobaciones

| Comprobación | Resultado |
| --- | --- |
| `npm test` | PASS — 60/60 pruebas |
| `npm run check` | PASS — 0 errores, 0 warnings, 0 hints |
| `npm run build` | PASS — 22 páginas estáticas |
| Build aislado de staging | PASS — `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com`, `PUBLIC_SITE_INDEXING=false`, proveedor demo y endpoints vacíos |
| `npm run test:local-ui` | PASS — 22 rutas × 3 viewports |
| FAQ | PASS — 21 FAQ verificadas |
| Overflow global e interno | PASS — 0 fallos |
| Foco y menú móvil | PASS — 360, 375, 390 y 768 px; Escape devuelve el foco |
| Formularios Contacto/Diagnóstico | PASS — errores asociados, primer foco, éxito demo y 0 `fetch` |
| Auditoría demo | PASS — escenarios genérico, web, datos e infraestructura; 0 `fetch`/XHR/beacon/envío nativo |
| Identidad | PASS — logo cargado, 40×40 explícitos, nombre accesible, `border-radius: 50%` y favicon PNG en Inicio/Contacto desktop/mobile |
| Canales | PASS — Colombia, `tel:+573212554930`, `info@sokatechnologies.com`; sin enlace oficial de WhatsApp |
| `git diff --check` | PASS |

El smoke se ejecutó contra `http://127.0.0.1:4323` con datos ficticios. No se
enviaron solicitudes, correos ni datos a servicios externos; el formulario
conservó `data-form-mode="demo"` y no se habilitó persistencia.

En el build aislado de staging, `/`, `/contacto/` y `/diagnostico/` generaron
canonical y `og:url` bajo `https://prueba.sokatechnologies.com`, sitemap con el
mismo origen, `noindex,nofollow`, `robots.txt` con `Disallow: /`, favicon PNG y
formularios con `data-form-mode="demo"`.

## Capturas

- `home-desktop.png` y `home-mobile.png`: cabecera y logo en escritorio/móvil.
- `home-map-desktop.png`: portada y composición del hero.
- `contacto-desktop.png` y `contacto-mobile.png`: cabecera y canales públicos.
- `contacto-form-desktop.png`: formulario en modo demo.
- `diagnostico-form-desktop.png`: segundo formulario conservado en modo demo.
- `auditoria-demo-result-desktop.png`: resultado demo sin activar solicitudes.

## Pendientes

- No se modificó la política de privacidad ni se declaró aprobado el texto legal.
- La retención máxima de 12 meses para consultas no convertidas es una propuesta
  operativa pendiente de aprobación y revisión jurídica.
- No se hizo commit remoto, despliegue, activación de formularios ni cambio de infraestructura.
