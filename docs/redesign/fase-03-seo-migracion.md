# Fase 3 — Validación SEO y preparación de migración

Fecha de evidencia: 2026-10-28 America/Bogota (2026-10-29 UTC)

Base verificada: `812cb0eb3fbae9992e1a09b71ef5d81852e8c71f` en `feature/web-demo-2026-gsap`.

Este documento prepara la migración y la revisión del lanzamiento. No instala redirecciones, no modifica Cloudflare, DNS, WordPress, producción ni el staging 8091.

## Configuración por entorno

Astro 7.4.0 y Vite 8.3.4 se validaron con builds aislados en SSD. `astro.config.mjs` usa `loadEnv` con el modo explícito de `--mode` (y solo usa `NODE_ENV` como fallback); así `--mode staging` sigue cargando `.env.staging` aunque `NODE_ENV` esté ausente o diga `production`. Las variables `PUBLIC_*` del proceso se superponen explícitamente a las de los archivos, conservando la precedencia de Vite.

Comandos de referencia, siempre desde una copia aislada:

```bash
env -u PUBLIC_SITE_URL -u PUBLIC_SITE_INDEXING -u PUBLIC_FORM_PROVIDER \
  -u PUBLIC_CONTACT_FORM_ENDPOINT -u PUBLIC_TURNSTILE_SITE_KEY \
  NODE_ENV=production ASTRO_TELEMETRY_DISABLED=1 \
  npm run build -- --mode staging

NODE_ENV=production \
PUBLIC_SITE_URL=https://sokatechnologies.com \
PUBLIC_SITE_INDEXING=true \
PUBLIC_FORM_PROVIDER=demo \
PUBLIC_CONTACT_FORM_ENDPOINT= \
PUBLIC_TURNSTILE_SITE_KEY= \
npm run build -- --mode production
```

El segundo comando solo genera un candidato local de producción. No autoriza publicación ni activa formularios.

Reproducción aislada de carga por modo, sin `PUBLIC_SITE_URL` en el proceso y usando una copia que contiene `.env.staging`:

```bash
env -u NODE_ENV -u PUBLIC_SITE_URL npm run build -- --mode staging
env -u PUBLIC_SITE_URL NODE_ENV=production npm run build -- --mode staging
```

En ambos casos, `Astro.site`, canonical, `og:url` y sitemap resolvieron la URL de `.env.staging`. Una variable `PUBLIC_SITE_URL` del proceso no vacía sigue sobrescribiendo ese archivo.

La evidencia histórica de la primera ejecución de fase 3 que usó `NODE_ENV=staging` se conserva como contexto y no como resultado de esta corrección. La nueva ejecución usa `NODE_ENV=production --mode staging`, con el origen únicamente en `.env.staging`; el artefacto candidato de producción se construyó por separado con `NODE_ENV=production --mode production` y `PUBLIC_SITE_URL=https://sokatechnologies.com`.

La carga de `PUBLIC_SITE_URL` se normaliza con `trim()` en la configuración y en `src/lib/seo.ts`. La política de indexación solo acepta el valor normalizado `true`; ausente, vacío, `false` o inválido generan `noindex,nofollow` y `Disallow: /`.

La documentación oficial de Astro explica que `astro.config.mjs` se evalúa antes de `import.meta.env` y recomienda `loadEnv` para leer archivos `.env`; también documenta `--mode` para cargar archivos por modo: [Astro — variables de entorno](https://docs.astro.build/en/guides/environment-variables/). La precedencia de archivos y variables del proceso corresponde al comportamiento de [Vite — env y modes](https://vite.dev/guide/env-and-mode).

No se crearon archivos `.env` en Git. Los archivos de prueba sintéticos se mantuvieron en `/srv/fast-storage/labs/sokatechnologies-website/d1-native/phase-03-lab/`.

## Matriz SEO

| Artefacto | Origen efectivo | Indexación | Robots | Formularios | Estado |
|---|---|---|---|---|---|
| Staging | `https://prueba.sokatechnologies.com` | `noindex,nofollow` | `Disallow: /` | Demo, endpoints vacíos | PASS local |
| Candidato producción | `https://sokatechnologies.com` | `index,follow,...` solo con `PUBLIC_SITE_INDEXING=true` | `Allow: /` y sitemap | Demo, endpoints vacíos | PASS local; NO-GO publicación |
| Fallback | `https://sokatechnologies.com` | `noindex,nofollow` | `Disallow: /` | No se habilita | PASS |

Cada ruta generada comprueba un único canonical, `og:url` igual al canonical, imagen social existente, enlace de sitemap, JSON-LD con URLs del origen esperado y `robots` coherente. `worksFor.url` en el schema de `/nosotros/` se registra aparte como URL de identidad organizacional `https://sokatechnologies.com`; no se sustituye por el hostname de staging.

El checker usa `fast-xml-parser` y `fast-xml-validator` para seguir el índice y cada hijo del sitemap, exigir origen exacto, archivo existente y correspondencia deduplicada con las 22 URLs canónicas esperadas. También falla si cualquier bloque JSON-LD está malformado, aunque otro bloque de la misma página sea válido. La excepción de compatibilidad se conserva: `/casos/` responde como ruta Astro, pero su canonical es `/proyectos/` y no aparece en el sitemap.

## Inventario y migración

El inventario compartido de Astro contiene 23 rutas: comerciales, demos y compatibilidad. El mapa detallado está en [`url-migration-map.csv`](../../artifacts/comparative-audit/phase-03/url-migration-map.csv).

Decisiones principales:

- `/`, `/servicios/`, `/contacto/` y `/soluciones/` se conservan sin redirect.
- `/sobre-nosotros/` propone `301` directo a `/nosotros/`, pendiente de aprobación.
- `/casos-de-exito/` propone `301` directo a `/proyectos/`, pendiente de aprobación.
- `/casos/` no debe crear una cadena: se debe elegir entre mantener la compatibilidad 200 con canonical o configurar un 301 directo.
- `/en/` enlaza actualmente cinco rutas que responden 200 en producción: `/en/servicios/`, `/en/soluciones/`, `/en/casos-de-exito/`, `/en/sobre-nosotros/` y `/en/contacto/`. Se conservan como están, sin traducir, retirar ni redirigir, hasta decidir idioma, catálogo y slugs. La evidencia detallada está en [`wordpress-english-routes.json`](../../artifacts/comparative-audit/phase-03/wordpress-english-routes.json).
- Los aliases no enlazados `/en/services/`, `/en/about-us/` y `/en/contact/` se mantienen solo como observaciones públicas pendientes; no se convierten en destinos por suposición.
- Las páginas, categorías, feeds y endpoints predeterminados de WordPress se proponen para retirada con 404/410 cuando se confirme que no existe consumidor. No se redirigen indiscriminadamente a Inicio.
- Las rutas de administración (`/wp-login.php`, `/wp-admin/`, `/wp-includes/`) permanecen fuera de la migración pública y requieren una decisión operativa separada.

El sitemap público actual de WordPress (`/sitemaps.xml`) contiene tres índices hijos y todavía enumera contenido predeterminado (`hello-world`, `sample-page` y `uncategorized`). El sitemap Astro del candidato usa `sitemap-index.xml` y excluye `/casos/`. No se cambia el sitemap WordPress en esta fase.

## Robots, noindex y acceso

Son controles distintos:

- `robots.txt` comunica instrucciones de rastreo; no es autenticación ni control de acceso.
- `noindex` se entrega en HTML y pide no indexar una página ya accesible.
- Una restricción HTTP, autenticación o firewall impide el acceso y debe verificarse por separado.

El checker del artefacto no busca subcadenas: analiza grupos `User-agent` y directivas completas y compara la política normalizada con la salida esperada. Staging exige exactamente `User-agent: *` + `Disallow: /`; producción exige `User-agent: *` + `Allow: /` + `Sitemap: https://sokatechnologies.com/sitemap-index.xml`. Las regresiones cubren `Disallow: /wp-admin/`, un bloqueo raíz para un bot específico y un sitemap de producción de origen ajeno.

La consulta pública observó producción WordPress con `server: LiteSpeed`, `robots.txt` que solo bloquea `/wp-admin/` y sin línea de sitemap, mientras staging responde mediante Cloudflare con reglas administradas de Content Signals y `Disallow: /`. Esto evidencia una transformación del origen en staging; no se modifica en esta fase.

## Procedimiento estático seguro

La prueba aislada en SSD está en [`permissions-test.json`](../../artifacts/comparative-audit/phase-03/permissions-test.json). La solución para el incidente recurrente de permisos es:

1. Confirmar el bind mount y registrar `stat` de la raíz antes de escribir.
2. Copiar el contenido actual a un respaldo nuevo con `cp -a`; generar y verificar un manifiesto de hashes y metadatos.
3. Copiar activos primero y HTML después, siempre con `rsync -a --no-perms --no-owner --no-group --omit-dir-times`; no usar `--delete` durante publicación.
4. Comprobar que la raíz conserva modo `755`, propietario y grupo, y que el contenido del artefacto coincide por hash.
5. Para rollback, usar únicamente el respaldo verificado: `rsync -a --delete BACKUP/site/ TARGET/site/`, comprobar de nuevo raíz, propietario, modo y manifiesto.

La prueba sintética usó una fuente con modo `775`, un destino con raíz `755`, un activo anterior que debía conservarse y un archivo nuevo eliminado durante rollback. Publicación y restauración conservaron `755` y `1000:1000`. No se ensayó sobre el staging activo.

## GO/NO-GO

GO para revisar el PR y los artefactos locales: checker SEO, matriz de indexación y procedimiento de permisos pasan.

NO-GO para publicar el candidato de producción hasta aprobar responsable/dominio definitivo, redirecciones, inglés, catálogo, robots, política legal, accesibilidad y formularios reales. Staging sigue siendo demo y no autoriza tratamiento real de leads.

LEGAL-01, Firefox, Safari, dispositivos físicos, zoom real y lector de pantalla continúan pendientes.
