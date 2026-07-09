# Auditoría de performance y accesibilidad

## Hallazgos principales

- La demo mantiene contenido visible sin depender de JavaScript.
- `ScrollTrigger` se registra una sola vez desde `src/scripts/animations/init.ts`.
- La limpieza de animaciones quedó centralizada y se ejecuta en `pagehide`.
- Reduced motion se respeta en CSS y en la inicialización JS.
- Las animaciones usan `transform`, `opacity`, `scaleX` y `scaleY`; no se animan propiedades de layout.
- No hay markers activos.
- La navegación principal y los CTAs tienen focus visible.
- El sitio compila como estático sin errores SSR.

## Ajustes realizados

- Refactor de `homeMotion.ts` hacia módulos de animación separados.
- Eliminación del hint de script inline no procesado en `BaseLayout`.
- Separación de tokens, motion y estilos globales.
- Incorporación de `skip-link`, landmarks semánticos y metadata por página.
- Sustitución de Open Graph dependiente de assets ambiguos por un SVG local en `public/og/`.

## Riesgos pendientes

- No se ejecutó Lighthouse ni medición de Web Vitals; la auditoría es estructural y de build.
- La demo sigue usando Google Fonts, por lo que la carga tipográfica depende de un origen externo.
- `robots.txt` existe, pero no se añadió sitemap porque no había dependencia instalada ni flujo aprobado para ello.
- No hubo validación visual asistida por navegador real en múltiples tamaños; la validación fue de build, markup y arquitectura.

## Recomendaciones antes de staging

- Ejecutar revisión visual manual en desktop y móvil.
- Medir Lighthouse sobre la build estática.
- Evaluar si conviene autohospedar tipografías para reducir dependencia externa.
- Si la demo va a exponerse públicamente, definir `site` final y ajustar `robots.txt`.

## Checklist final

- [x] `prefers-reduced-motion` validado a nivel CSS y JS.
- [x] Contenido visible sin JS.
- [x] Focus states visibles.
- [x] ScrollTrigger registrado una sola vez.
- [x] Cleanup centralizado.
- [x] Sin markers.
- [x] Sin animaciones de layout.
- [x] Sin secretos, tokens ni datos sensibles.
- [x] Sin cambios en `public_html/`, WordPress core, plugins o rutas prohibidas.
- [x] `npm run build` pasa.
