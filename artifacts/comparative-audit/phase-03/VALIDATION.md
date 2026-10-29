# Validación fase 3 — SEO por entorno y migración

Fecha: 2026-10-28 America/Bogota (2026-10-29 UTC)

Base: `812cb0eb3fbae9992e1a09b71ef5d81852e8c71f` en `feature/web-demo-2026-gsap`.

## Resultados

| Comprobación | Resultado |
|---|---|
| Inventario compartido | PASS — 23 rutas, sin faltantes ni sobrantes |
| Checker SEO staging | PASS nueva ejecución — origen de prueba, canonical/OG/JSON-LD, sitemap, robots exacto para `User-agent: *` y noindex |
| Checker candidato producción | PASS nueva ejecución local — origen principal, canonical/OG/JSON-LD, sitemap y política robots exacta con indexación explícita |
| `.env` solamente | PASS — `https://dotenv.example.test`, noindex |
| Archivo `.env.staging` | PASS — `https://mode.example.test`, indexación true explícita |
| Proceso sobre archivo | PASS — `https://process.example.test`, noindex |
| `.env.staging` con `--mode staging`, `NODE_ENV` ausente | PASS — `https://mode-file.example.test`, Astro.site/canonical/OG/sitemap alineados |
| `.env.staging` con `--mode staging`, `NODE_ENV=production` | PASS — el modo CLI conserva `https://mode-file.example.test`, sin URL de proceso |
| Fallback sin variables | PASS — `https://sokatechnologies.com`, noindex |
| Valores de indexación | PASS — ausente, vacío, false e inválido noindex; solo true index |
| JSON-LD negativo | PASS — 1 bloque roto + 1 válido produce fallo específico por ruta |
| Sitemap XML negativo | PASS — índice vacío, XML inválido, hijo ausente, URL faltante y origen ajeno producen fallo |
| Sitemap XML positivo | PASS — parser valida índice, hijos, origen y 22 URLs canónicas deduplicadas sin `/casos/` |
| Robots negativo | PASS — `/wp-admin/`, User-agent específico y sitemap de origen ajeno producen fallo; no se usan subcadenas |
| Inventario inglés | PASS — cinco rutas enlazadas desde `/en/`, estado 200 público y sin cambios de idioma |
| Formularios | PASS — demo, endpoints públicos vacíos; no se habilitó backend |
| Prueba de permisos aislada | PASS — publicación y restauración conservan raíz 755, propietario/grupo y contenido |
| Consultas públicas | PASS — producción, `www` y staging consultados sin credenciales |
| `npm ci --ignore-scripts` | PASS — dependencias instaladas en SSD, 0 vulnerabilidades reportadas |
| `npm test` | PASS — 60 pruebas, 0 fallos |
| `npm run check` | PASS — 117 archivos, 0 errores, advertencias ni hints |
| Build staging | PASS — `npm run build -- --mode staging`, 23 páginas generadas |
| `npm run test:seo` | PASS — `SEO_EXPECTED_ORIGIN` de staging y `SEO_EXPECT_INDEXING=false` |
| `npm run test:seo:fixtures` | PASS — 11 fixtures: 6 regresiones anteriores y 5 regresiones nuevas de robots |
| `git diff --check` | PASS |

Comandos finales ejecutados desde el worktree SSD:

```bash
npm test
npm run check
env -u PUBLIC_SITE_URL -u PUBLIC_SITE_INDEXING -u PUBLIC_FORM_PROVIDER \
  -u PUBLIC_CONTACT_FORM_ENDPOINT -u PUBLIC_TURNSTILE_SITE_KEY \
  NODE_ENV=production ASTRO_TELEMETRY_DISABLED=1 \
  npm run build -- --mode staging
( cd /srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-03-lab/robots-p2-20261029/staging && \
  SEO_DIST=dist SEO_EXPECTED_ORIGIN=https://prueba.sokatechnologies.com \
  SEO_EXPECT_INDEXING=false npm run test:seo )
( cd /srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-03-lab/robots-p2-20261029/production && \
  SEO_DIST=dist SEO_EXPECTED_ORIGIN=https://sokatechnologies.com \
  SEO_EXPECT_INDEXING=true npm run test:seo )
SEO_STAGING_DIST=/srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-03-lab/robots-p2-20261029/staging/dist \
  SEO_FIXTURE_ROOT=/srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-03-lab/robots-p2-20261029/fixtures/ \
  npm run test:seo:fixtures
git diff --check
```

La ejecución histórica de fase 3 documentada inicialmente usó `NODE_ENV=staging`; no se usa como evidencia de esta corrección. Las nuevas ejecuciones reproducibles usan `NODE_ENV=production --mode staging`, sin `PUBLIC_SITE_URL` de proceso, sobre una copia SSD con `.env.staging`. Los reportes anteriores siguen disponibles para comparación.

Los reportes de cada build son [`env-only.json`](./env-only.json), [`mode-file.json`](./mode-file.json), [`process-override.json`](./process-override.json), [`fallback.json`](./fallback.json), [`staging-build.json`](./staging-build.json) y [`production-candidate.json`](./production-candidate.json); todos registran 23 rutas, 22 URLs de sitemap y cero fallos. La matriz de cinco valores está en [`indexing-values.json`](./indexing-values.json). La reproducción específica de modo está en [`mode-resolution.json`](./mode-resolution.json), las negativas acumuladas en [`negative-fixtures.json`](./negative-fixtures.json) y la ejecución nueva de robots en [`robots-validation.json`](./robots-validation.json).

## Consultas públicas

- [`public-queries.json`](./public-queries.json): 3 hosts, 17 rutas conocidas, headers seleccionados, enlaces y sitemaps.
- [`wordpress-sitemap-inventory.json`](./wordpress-sitemap-inventory.json): índice actual y sus tres sitemaps hijos.
- [`wordpress-english-routes.json`](./wordpress-english-routes.json): las cinco rutas inglesas realmente enlazadas desde `/en/` y su estado público.
- [`wordpress-default-queries.json`](./wordpress-default-queries.json): feeds, API, administración y contenido predeterminado.
- [`url-migration-map.csv`](./url-migration-map.csv): origen, destino, respuesta prevista, mecanismo y decisión pendiente.

Observaciones verificadas:

- Producción devuelve 200 para `/`, `/servicios/`, `/contacto/`, `/soluciones/`, `/sobre-nosotros/` y `/casos-de-exito/`.
- `/casos/` devuelve 301 a `/casos-de-exito/` en producción; el Astro de staging mantiene `/casos/` como compatibilidad con canonical `/proyectos/`.
- Producción tiene `/en/` en 200, `/en/services/` y `/en/about-us/` en 404, y `/en/contact/` en 301 a `/en/contacto/`; la decisión de idioma queda pendiente.
- La portada `/en/` enlaza `/en/servicios/`, `/en/soluciones/`, `/en/casos-de-exito/`, `/en/sobre-nosotros/` y `/en/contacto/`; las cinco respondieron 200 y conservan su canonical público. No se traducen, retiran ni redirigen en esta fase.
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
