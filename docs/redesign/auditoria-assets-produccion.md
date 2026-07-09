# Auditoría de assets para producción

Fecha: 2026-07-09  
Rama auditada: `feature/web-demo-2026-gsap`

## Alcance revisado

Se auditó el material en:

- `assets/`
- `wp-theme/sokatechnologies-child-theme/assets/`
- `public/` como equivalente operativo de la app Astro actual

Observaciones de estructura:

- `demo-astro/public/` no existe en esta rama. La app Astro vigente publica desde `public/`.
- `demo-astro/src/assets/` no existe.
- `wp-theme/sokatechnologies-child-theme/assets/` contiene sobre todo duplicados de favicon/isotipo y dos CSS de soporte del child theme.

## Resumen ejecutivo

Decisión recomendada:

- Reutilizar sin fricción: isotipo, favicon set y el OG SVG actual.
- Reutilizar con criterio editorial: algunas imágenes abstractas de servicios y la imagen 404.
- Evitar como visual principal de producción: imágenes con look stock/IA demasiado literal, especialmente contacto y varias piezas de servicios si el objetivo es una landing premium más sobria.
- No tomar `wp-theme/.../assets/` como fuente maestra para la demo Astro; usarlo solo como referencia o copia heredada.

Hallazgos clave:

- No se observan datos sensibles visibles en los assets revisados.
- Hay duplicación innecesaria entre `assets/` y `wp-theme/.../assets/`.
- El isotipo existe solo en WebP; faltan variantes SVG de logo/isotipo listas para producción.
- El OG actual en `public/og/soka-demo-2026.svg` es el asset mejor alineado con la demo Astro por peso, control y consistencia.
- `assets/web/` ya define una estructura útil, pero está vacía; conviene llenarla con assets definitivos y no seguir dispersando imágenes.

## Inventario visual

### Marca e identidad

| Nombre | Ruta | Tipo | Peso | Dimensiones | Uso recomendado | Riesgo | Datos sensibles | Encaje con estilo |
|---|---|---:|---:|---|---|---|---|---|
| `og-sokatechnologies-default.webp` | `assets/brand/og-sokatechnologies-default.webp` | WebP | 43 KB | 1729x910 | Fallback de Open Graph si se necesita raster | No es 1200x630 exacto; revisar consistencia de copy y licencia/fuente | No visible | Medio |
| `isotipo-sokatechnologies-s-modular.webp` | `assets/logos/isotipo-sokatechnologies-s-modular.webp` | WebP | 67 KB | 1024x1024 | Reutilizar en hero secundario, footer, favicon source o fondos sutiles | Falta versión SVG maestra; WebP no es ideal para todos los usos de marca | No visible | Alto |
| `favicon-32x32.png` | `assets/icons/favicon-32x32.png` | PNG | 1.6 KB | 32x32 | Reutilizar tal cual | Ninguno relevante | No visible | Alto |
| `favicon-180x180.png` | `assets/icons/favicon-180x180.png` | PNG | 25 KB | 180x180 | Reutilizar como Apple touch icon | Ninguno relevante | No visible | Alto |
| `favicon-192x192.png` | `assets/icons/favicon-192x192.png` | PNG | 29 KB | 192x192 | Reutilizar para PWA/site icon | Ninguno relevante | No visible | Alto |
| `favicon-512x512.png` | `assets/icons/favicon-512x512.png` | PNG | 204 KB | 512x512 | Reutilizar para site icon principal | Peso aceptable, pero se puede optimizar algo más | No visible | Alto |
| `favicon.ico` | `assets/icons/favicon.ico` | ICO | 5 KB | 16x16 y 32x32 | Reutilizar para compatibilidad legacy | Ninguno relevante | No visible | Alto |
| `favicon-sokatechnologies.png` | `assets/icons/favicon-sokatechnologies.png` | PNG | 915 KB | 1254x1254 | Conservar solo como fuente de exportación, no servirlo directo | Muy pesado para web; no usar en runtime | No visible | Medio |
| `soka-demo-2026.svg` | `public/og/soka-demo-2026.svg` | SVG | 3.3 KB | 1200x630 | Reutilizar como OG de la demo actual y base para futuras variantes | Tipografía incrustada como texto; si cambia branding, hay que regenerarlo | No visible | Alto |

### Imágenes editoriales y de servicio

| Nombre | Ruta | Tipo | Peso | Dimensiones | Uso recomendado | Riesgo | Datos sensibles | Encaje con estilo |
|---|---|---:|---:|---|---|---|---|---|
| `hero-sokatechnologies-operaciones-digitales.webp` | `assets/images/hero-sokatechnologies-operaciones-digitales.webp` | WebP | 134 KB | 1920x1081 | Usar solo como apoyo secundario o placeholder; no como hero definitivo si la demo ya usa panel HTML/CSS | Muy ilustrativa y genérica; puede empujar la estética hacia mockup 3D estándar | No visible | Medio |
| `servicio-software-a-medida-sistemas-internos.webp` | `assets/images/servicio-software-a-medida-sistemas-internos.webp` | WebP | 47 KB | 1448x1086 | Reutilizable en blog o apoyo de servicio si no hay alternativa mejor | Se siente asset de catálogo; no tan distintivo | No visible | Medio |
| `servicio-automatizaciones-flujos-integraciones.webp` | `assets/images/servicio-automatizaciones-flujos-integraciones.webp` | WebP | 44 KB | 1448x1086 | Reutilizable como visual explicativo en sección secundaria | Genérico; riesgo de verse “AI stock” | No visible | Medio |
| `servicio-dashboards-reportes-metricas.webp` | `assets/images/servicio-dashboards-reportes-metricas.webp` | WebP | 34 KB | 1448x1086 | Útil como soporte en una página de servicio o demo de dashboards | Demasiado literal para portada premium; mejor no usar como visual principal | No visible | Medio |
| `servicio-wordpress-corporativo-web-b2b.webp` | `assets/images/servicio-wordpress-corporativo-web-b2b.webp` | WebP | 39 KB | 1448x1086 | Puede servir como placeholder en la página de sitios corporativos | Se apoya en mockup genérico de landing; no diferencia a Soka | No visible | Medio-bajo |
| `servicio-infraestructura-cloud-on-prem.webp` | `assets/images/servicio-infraestructura-cloud-on-prem.webp` | WebP | 89 KB | 1448x1086 | Apto para apoyo visual en infraestructura | Más pesado y relativamente genérico; revisar si realmente aporta | No visible | Medio |
| `servicio-soporte-mantenimiento-monitoreo.webp` | `assets/images/servicio-soporte-mantenimiento-monitoreo.webp` | WebP | 73 KB | 1448x1086 | Usar solo si hace falta reforzar contenido de soporte | Puede verse como mockup estándar; no suma identidad fuerte | No visible | Medio-bajo |
| `sobre-sokatechnologies-socio-tecnologico.webp` | `assets/images/sobre-sokatechnologies-socio-tecnologico.webp` | WebP | 74 KB | 1672x941 | Buena candidata para “Nosotros” o bloque de proceso/arquitectura | Sigue siendo raster decorativo; no tan flexible como una composición HTML/CSS | No visible | Alto |
| `casos-exito-anonimizados-transformacion-operativa.webp` | `assets/images/casos-exito-anonimizados-transformacion-operativa.webp` | WebP | 62 KB | 1672x941 | Reutilizable en `/casos/` como cabecera editorial | Muy narrativa/literal; mejor en secciones internas que en hero | No visible | Medio-alto |
| `contacto-diagnostico-consultivo-b2b.webp` | `assets/images/contacto-diagnostico-consultivo-b2b.webp` | WebP | 87 KB | 1672x941 | Mejor omitir en la landing principal; podría usarse solo si se confirma licencia y se busca un tono más humano | Parece foto stock/IA con personas identificables; rompe la línea más sobria y de producto | No visible sensible, pero sí personas | Bajo |
| `404-sokatechnologies-ruta-no-encontrada.webp` | `assets/images/404-sokatechnologies-ruta-no-encontrada.webp` | WebP | 63 KB | 1600x900 | Reutilizar en página 404 o estados vacíos | Ninguno relevante; visual abstracto y seguro | No visible | Alto |

### Duplicados heredados en el child theme

| Nombre | Ruta | Tipo | Peso | Dimensiones | Uso recomendado | Riesgo | Datos sensibles | Encaje con estilo |
|---|---|---:|---:|---|---|---|---|---|
| `favicon-32x32.png` | `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-32x32.png` | PNG | 1.6 KB | 32x32 | Mantener solo como copia legacy del child theme | Duplicado del asset fuente en `assets/icons/` | No visible | Alto |
| `favicon-180x180.png` | `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-180x180.png` | PNG | 25 KB | 180x180 | Igual que arriba | Duplicado | No visible | Alto |
| `favicon-192x192.png` | `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-192x192.png` | PNG | 29 KB | 192x192 | Igual que arriba | Duplicado | No visible | Alto |
| `favicon-512x512.png` | `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-512x512.png` | PNG | 204 KB | 512x512 | Igual que arriba | Duplicado | No visible | Alto |
| `favicon.ico` | `wp-theme/sokatechnologies-child-theme/assets/icons/favicon.ico` | ICO | 5 KB | 16x16 y 32x32 | Igual que arriba | Duplicado | No visible | Alto |
| `favicon-sokatechnologies.png` | `wp-theme/sokatechnologies-child-theme/assets/images/favicon-sokatechnologies.png` | PNG | 915 KB | 1254x1254 | Conservar solo como fuente local heredada | Muy pesado y duplicado | No visible | Medio |
| `isotipo-sokatechnologies-s-modular.webp` | `wp-theme/sokatechnologies-child-theme/assets/images/isotipo-sokatechnologies-s-modular.webp` | WebP | 67 KB | 1024x1024 | Mantener solo si el child theme lo consume directamente | Duplicado del asset base | No visible | Alto |

## Archivos de soporte revisados

Estos archivos no son imágenes de producción, pero sí afectan el inventario:

| Archivo | Ruta | Tipo | Observación |
|---|---|---|---|
| `README.md` | `assets/brand/README.md` | Documentación | Define bien usos ideales, pero faltan los SVG de marca que recomienda. |
| `README.md` | `assets/icons/README.md` | Documentación | Pide SVG de iconos, pero esos iconos aún no existen en el repositorio. |
| `README.md` | `assets/web/README.md` | Documentación | La estructura `assets/web/` está lista, pero vacía. |
| `corporate.css` | `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css` | CSS | No auditado como asset visual independiente; pertenece al child theme. |
| `soka-brand.css` | `wp-theme/sokatechnologies-child-theme/assets/css/soka-brand.css` | CSS | Igual que arriba; no es asset raster/vector de producción. |

## Recomendación de reutilización

### Reutilizar ahora

- `public/og/soka-demo-2026.svg`
- `assets/logos/isotipo-sokatechnologies-s-modular.webp`
- `assets/icons/favicon-*`
- `assets/images/404-sokatechnologies-ruta-no-encontrada.webp`

### Reutilizar solo como apoyo o placeholder

- `assets/images/sobre-sokatechnologies-socio-tecnologico.webp`
- `assets/images/casos-exito-anonimizados-transformacion-operativa.webp`
- `assets/images/servicio-dashboards-reportes-metricas.webp`
- `assets/images/servicio-automatizaciones-flujos-integraciones.webp`
- `assets/images/servicio-software-a-medida-sistemas-internos.webp`

### Omitir o reemplazar antes de producción

- `assets/images/contacto-diagnostico-consultivo-b2b.webp`
- `assets/images/hero-sokatechnologies-operaciones-digitales.webp` como hero principal
- `assets/images/servicio-wordpress-corporativo-web-b2b.webp` si el objetivo es una identidad más propia
- `assets/images/servicio-soporte-mantenimiento-monitoreo.webp` y `assets/images/servicio-infraestructura-cloud-on-prem.webp` si no aportan narrativa real al contenido
- Cualquier copia duplicada dentro de `wp-theme/.../assets/` como fuente primaria para la demo Astro

## Assets faltantes recomendados

1. OG image final de producción
   - Formatos: SVG maestro + PNG/WebP exportado 1200x630.
   - Variante por defecto y, si hace falta, una variante para Portik.

2. Hero abstracto definitivo
   - Preferible en HTML/CSS o SVG compuesto.
   - Debe reforzar operación, automatización, infraestructura y control sin parecer stock.

3. Mockups de dashboards anonimizados
   - Uno general corporativo.
   - Uno para reporting operativo.
   - Uno para back-office/regulatorio sin datos reales.

4. Mockup específico de Portik
   - Vista desktop + móvil.
   - Módulos visibles: visitantes, vehículos, reservas, bitácora y novedades.

5. Sistema de iconos propio
   - SVG consistentes para servicios, productos, soporte, diagnóstico, seguridad e infraestructura.
   - Idealmente `currentColor` y grosor uniforme.

6. Logos de marca en SVG
   - `logo-horizontal-dark.svg`
   - `logo-horizontal-light.svg`
   - `isotipo-soka.svg`

## Riesgos pendientes

- No se validó licencia/procedencia externa de las imágenes raster; visualmente no muestran datos sensibles, pero producción requiere confirmar origen.
- El repositorio tiene duplicación de assets entre `assets/` y `wp-theme/.../assets/`, lo que puede crear divergencia si se editan por separado.
- Falta una fuente vectorial oficial de marca para evitar depender de WebP en usos de logo.
- `assets/web/` sigue vacío, así que aún no existe una biblioteca ordenada de assets finales para la web pública.
