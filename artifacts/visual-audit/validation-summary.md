# Validación de auditoría visual y formularios demo

Rama: `codex/auditoria-visual-formularios`

## Cobertura

El smoke test local recorre las 22 páginas HTML generadas en los tres viewports
actuales:

- desktop: 1440 × 900
- tablet: 768 × 1024
- mobile: 375 × 812

Rutas cubiertas: `/`, `/servicios/`, las siete páginas de servicios,
`/productos/`, las tres páginas de productos, `/contacto/`, `/diagnostico/`,
`/auditoria/`, `/casos/`, `/demos/ecommerce/`, `/nosotros/`,
`/politica-privacidad/`, `/proyectos/` y `/terminos/`.

También se verificaron 21 FAQ, overflow global e interno, foco visible,
cabecera móvil, honeypot y modo demo.

## SEO-01

La indexación se habilita únicamente cuando `PUBLIC_SITE_INDEXING`, después de
recortar espacios y normalizar mayúsculas, es exactamente `true`. Las
compilaciones locales confirmaron `noindex,nofollow` para la variable ausente,
vacía, `false` y un valor inválido; solo el valor normalizado `true` produjo la
directiva `index,follow` en el HTML generado.

## Cierre P2 de `PUBLIC_SITE_URL`

Con Astro `7.4.0` y Vite `8.3.4`, `astro.config.mjs` usa la API soportada
`loadEnv(process.env.NODE_ENV, process.cwd(), "PUBLIC_")`. Vite conserva la
precedencia de variables del proceso sobre los archivos `.env`; el valor se
recorta y, si queda vacío o no existe, se usa `https://sokatechnologies.com`.
`src/lib/seo.ts` aplica la misma normalización, por lo que `Astro.site` y las
URLs SEO comparten el origen efectivo.

Se verificaron en copias aisladas los valores definidos solo en `.env`, solo en
`.env.production`, sobrescritos por el proceso y ausentes. En cada caso
`canonical`, `og:url`, las URLs de JSON-LD y el sitemap usaron el mismo origen.

| Caso aislado | Origen efectivo | Robots | URLs contrastadas |
| --- | --- | --- | ---: |
| `.env` | `https://env-only.example.test` | `noindex,nofollow` | 27 |
| `.env.production` | `https://mode-file.example.test` | `noindex,nofollow` | 27 |
| Proceso sobre archivo | `https://process-override.example.test` | `index,follow,...` | 27 |
| Sin variable | `https://sokatechnologies.com` | `noindex,nofollow` | 27 |
| `PUBLIC_SITE_INDEXING="  TrUe  "` | `https://sokatechnologies.com` | `index,follow,...` | 27 |

## Formularios

Contacto y Diagnóstico pasaron el flujo completo en modo demo:

- 5 controles inválidos detectados por formulario.
- Mensajes asociados mediante `aria-errormessage` y `aria-describedby`.
- Foco situado en el primer error.
- Transición de error a éxito demo comprobada.
- 0 errores de campo visibles al completar datos sintéticos.
- 0 llamadas `fetch`; no se enviaron solicitudes ni se almacenaron datos.

## Resultado de validaciones

- `npm test`: 60/60 pruebas aprobadas.
- `npm run test:local-ui`: aprobado; 22 rutas × 3 viewports.
- `npm run check`: 0 errores, warnings o hints.
- `npm run build`: 22 páginas generadas.
- `git diff --check`: aprobado.

## Pendientes

- `VIS-02`: recomendación pendiente; no se implementó en esta auditoría.
- `LEGAL-01`: pendiente de texto aprobado por el responsable y revisión jurídica.

## Evidencias

- [Portada](after/home-desktop.png)
- [Mapa de portada](after/home-map-desktop.png)
- [Cabecera móvil](after/contacto-mobile.png)
- [Formulario de Contacto](after/contacto-form-desktop.png)
- [Formulario de Diagnóstico](after/diagnostico-form-desktop.png)
- [Proyectos](after/proyectos-cards-desktop.png)

La revisión fue exclusivamente local. No se desplegaron cambios ni se tocaron
WordPress, Docker, Cloudflare, DNS, producción o infraestructura.
