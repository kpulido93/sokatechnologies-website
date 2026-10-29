# Validación fase 3 — SEO por entorno y migración

Fecha: 2026-10-28 America/Bogota (2026-10-29 UTC)

Base: `812cb0eb3fbae9992e1a09b71ef5d81852e8c71f` en `feature/web-demo-2026-gsap`.

## Resultados

| Comprobación | Resultado |
|---|---|
| Inventario compartido | PASS — 23 rutas, sin faltantes ni sobrantes |
| Checker SEO staging | PASS — origen de prueba, canonical/OG/JSON-LD, sitemap, robots y noindex |
| Checker candidato producción | PASS local — origen principal, canonical/OG/JSON-LD, sitemap, robots e indexación explícita |
| `.env` solamente | PASS — `https://dotenv.example.test`, noindex |
| Archivo `.env.staging` | PASS — `https://mode.example.test`, indexación true explícita |
| Proceso sobre archivo | PASS — `https://process.example.test`, noindex |
| Fallback sin variables | PASS — `https://sokatechnologies.com`, noindex |
| Valores de indexación | PASS — ausente, vacío, false e inválido noindex; solo true index |
| Formularios | PASS — demo, endpoints públicos vacíos; no se habilitó backend |
| Prueba de permisos aislada | PASS — publicación y restauración conservan raíz 755, propietario/grupo y contenido |
| Consultas públicas | PASS — producción, `www` y staging consultados sin credenciales |
| `npm test` | PASS — 60 pruebas, 0 fallos |
| `npm run check` | PASS — 116 archivos, 0 errores, advertencias ni hints |
| Build staging | PASS — `npm run build -- --mode staging`, 23 páginas generadas |
| `npm run test:seo` | PASS — `SEO_EXPECTED_ORIGIN` de staging y `SEO_EXPECT_INDEXING=false` |
| `git diff --check` | PASS |

Comandos finales ejecutados desde el worktree SSD:

```bash
npm test
npm run check
NODE_ENV=staging PUBLIC_SITE_URL=https://prueba.sokatechnologies.com \
  PUBLIC_SITE_INDEXING=false PUBLIC_FORM_PROVIDER=demo \
  PUBLIC_CONTACT_FORM_ENDPOINT= PUBLIC_TURNSTILE_SITE_KEY= \
  npm run build -- --mode staging
SEO_DIST=dist SEO_EXPECTED_ORIGIN=https://prueba.sokatechnologies.com \
  SEO_EXPECT_INDEXING=false npm run test:seo
git diff --check
```

Los reportes de cada build son [`env-only.json`](./env-only.json), [`mode-file.json`](./mode-file.json), [`process-override.json`](./process-override.json), [`fallback.json`](./fallback.json), [`staging-build.json`](./staging-build.json) y [`production-candidate.json`](./production-candidate.json). La matriz de cinco valores está en [`indexing-values.json`](./indexing-values.json).

## Consultas públicas

- [`public-queries.json`](./public-queries.json): 3 hosts, 17 rutas conocidas, headers seleccionados, enlaces y sitemaps.
- [`wordpress-sitemap-inventory.json`](./wordpress-sitemap-inventory.json): índice actual y sus tres sitemaps hijos.
- [`wordpress-default-queries.json`](./wordpress-default-queries.json): feeds, API, administración y contenido predeterminado.
- [`url-migration-map.csv`](./url-migration-map.csv): origen, destino, respuesta prevista, mecanismo y decisión pendiente.

Observaciones verificadas:

- Producción devuelve 200 para `/`, `/servicios/`, `/contacto/`, `/soluciones/`, `/sobre-nosotros/` y `/casos-de-exito/`.
- `/casos/` devuelve 301 a `/casos-de-exito/` en producción; el Astro de staging mantiene `/casos/` como compatibilidad con canonical `/proyectos/`.
- Producción tiene `/en/` en 200, `/en/services/` y `/en/about-us/` en 404, y `/en/contact/` en 301 a `/en/contacto/`; la decisión de idioma queda pendiente.
- El sitemap WordPress actual enumera `hello-world`, `sample-page` y `category/uncategorized`; su retirada propone 404/410 tras revisar consumidores.
- `www` redirige al dominio principal. No se asume que esa normalización sea suficiente para el cambio de aplicación.

## Procedimiento de permisos

[`permissions-test.json`](./permissions-test.json) documenta el ensayo en `/srv/fast-storage` con una fuente sintética de modo 775 y destino de raíz 755. No se tocó el staging activo.

La publicación futura debe usar dos pasadas sin `--delete`:

```bash
rsync -a --no-perms --no-owner --no-group --omit-dir-times --exclude='*.html' DIST/ TARGET/
rsync -a --no-perms --no-owner --no-group --omit-dir-times --include='*/' --include='*.html' --exclude='*' DIST/ TARGET/
```

El rollback requiere un backup previamente verificado y `rsync -a --delete` únicamente contra el destino exacto confirmado.

## Pendientes

- No se instalaron redirects, ni se modificaron DNS, Cloudflare, WordPress o producción.
- El candidato de producción es un artefacto local; no es autorización de publicación.
- Pendientes: destino definitivo, inglés, catálogo, aprobación legal LEGAL-01, formularios reales, Firefox, Safari, dispositivos físicos, zoom real y lector de pantalla.
