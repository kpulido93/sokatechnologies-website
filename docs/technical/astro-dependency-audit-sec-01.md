# SEC-01 — Auditoría y remediación de dependencias Astro

Fecha: 2026-10-19
Rama: `codex/sec-01-astro-dependencies`
Base: `c5e9590199fb360a879e164dc11cb93c527b8959`

## Alcance

Se actualizaron únicamente dependencias del toolchain Astro y el lockfile. No se modificaron contenido, diseño, formularios, SEO, WordPress, hosting, DNS ni producción.

## Cambios directos

| Paquete | Antes | Después | Motivo |
|---|---:|---:|---|
| `astro` | `^7.0.7` | `^7.4.0` | Corrige los advisories críticos de Astro sin cambiar de major. |
| `@astrojs/check` | `^0.9.9` | `^0.9.10` | Actualiza el árbol de validación de TypeScript/YAML. |

`fast-uri` no se añadió como dependencia directa. Su entrada transitiva del árbol de `@astrojs/check` se actualizó de `3.1.3` a `3.1.8` mediante el lockfile.

## Remediación transitiva verificada

| Paquete | Antes | Después | Ruta principal | Alcance |
|---|---:|---:|---|---|
| `devalue` | 5.8.1 | 6.0.3 | Astro | Build/runtime de Astro, no bundle del navegador. |
| `fast-uri` | 3.1.3 | 3.1.8 | `@astrojs/check` → language server → Ajv | Solo desarrollo. |
| `http-cache-semantics` | 4.2.0 | 4.3.0 | Astro | Toolchain. |
| `js-yaml` | 4.3.0 | sin entrada vulnerable | Astro/internal helpers | La ruta vulnerable desaparece con Astro actualizado. |
| `nanoid` | 3.3.15 | 3.3.20 | Astro → Vite → PostCSS | Toolchain. |
| `postcss` | 8.5.16 | 8.5.31 | Astro → Vite | Toolchain CSS. |
| `sharp` | 0.35.3 | 0.35.5 | Astro, opcional | Optimización de imágenes durante build. |
| `smol-toml` | 1.7.0 | 1.9.1 | Astro/internal helpers | Toolchain. |
| `source-map-js` | 1.2.1 | 1.2.2 | Vite/PostCSS/SVGO | Toolchain. |
| `svgo` | 4.0.1 | 4.1.0 | Astro | Optimización de SVG durante build. |

## Resultados

Antes de la remediación:

- `npm audit`: 11 vulnerabilidades — 1 crítica y 10 altas.
- `npm audit --omit=dev`: 10 vulnerabilidades — 1 crítica y 9 altas.

Después de la remediación:

- `npm ci`: correcto.
- `npm audit`: 0 vulnerabilidades.
- `npm audit --omit=dev`: 0 vulnerabilidades.
- `npm run check`: 0 errores, warnings o hints.
- `npm run build`: correcto; 19 páginas estáticas generadas.
- `git diff --check`: correcto.

La aplicación conserva `output: "static"`. GSAP no fue actualizado ni reemplazado. Los paquetes auditados son dependencias de compilación o de validación; los assets publicados se generan en `dist/`. Los formularios conservan su modo demo y no se incluyeron credenciales.

No se utilizó `npm audit fix --force`, no se añadieron overrides y no se suprimieron advisories.
