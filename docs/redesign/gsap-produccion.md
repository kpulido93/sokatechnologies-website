# GSAP para producción

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Contexto

La app Astro activa en esta rama está en la raíz del repositorio, no en `demo-astro/`.  
La auditoría y los ajustes de GSAP se aplicaron sobre:

- `src/scripts/animations/`
- `src/styles/motion.css`
- páginas y componentes que usan clases `.js-*`

## Objetivo

Dejar la capa de animación lista para producción con estos criterios:

- GSAP solo en cliente.
- `ScrollTrigger` registrado una sola vez.
- `prefers-reduced-motion` respetado.
- Sin animaciones de layout (`width`, `height`, `top`, `left`, `margin`, `padding`).
- Sin `markers`.
- Sin pinning agresivo en mobile.
- Sin triggers duplicados.
- Cleanup correcto.
- `ScrollTrigger.refresh()` solo cuando aporta valor.
- Contenido visible si JavaScript falla.

## Hallazgos iniciales

1. Había triggers duplicados en reveals.
   - `ServiceCard` y `CaseCard` tenían simultáneamente `.js-reveal-card` y `.js-service-card` / `.js-case-card`.
   - Eso creaba batches redundantes sobre los mismos nodos.

2. El `refresh()` se disparaba siempre.
   - La inicialización hacía `requestAnimationFrame(refresh)` y además un listener de `load`.
   - Era más de lo necesario para una landing sin imágenes pesadas controladas por GSAP.

3. La timeline de proceso generaba demasiados triggers.
   - Un trigger por reveal de step.
   - Más otro trigger por step para el estado activo.

4. La sección Portik usaba dos reveals separados sobre el mismo bloque.
   - Uno para panel.
   - Otro para módulos.

5. Las interacciones hover podían acumular tweens.
   - `mouseenter` / `mouseleave` hacían `gsap.to()` sin cancelar tween previo.

6. Reduced motion no anulaba del todo los pequeños desplazamientos CSS.
   - Las transiciones se reducían, pero algunos `transform` de hover seguían existiendo.

## Cambios implementados

### 1. Inicialización y cleanup

Archivo: `src/scripts/animations/init.ts`

- Se mantiene registro único de `ScrollTrigger`.
- Se añadió `ScrollTrigger.config({ limitCallbacks: true })`.
- Se reorganizó la inicialización con `gsap.matchMedia()`.
- Las animaciones solo arrancan en `prefers-reduced-motion: no-preference`.
- `ScrollTrigger.refresh()` ya no se dispara por `load` siempre.
- Ahora se agenda un refresh solo si existen triggers.
- También se hace un refresh adicional cuando `document.fonts.ready` resuelve, para corregir layout por tipografías cuando aplica.
- El cleanup revierte `matchMedia`, ejecuta cleanups locales y mata cualquier trigger residual.

### 2. Hero timeline

Archivo: `src/scripts/animations/heroTimeline.ts`

- Las búsquedas se acotaron al hero con `gsap.utils.selector(hero)`.
- Se añadió `overwrite: "auto"` a la timeline.
- Se usa `willChange` antes de animar y se limpia al terminar.
- Se limpian `transform`, `opacity` y `visibility` al final de cada tween.

Resultado:

- Menos riesgo de afectar nodos fuera del hero.
- Menos estilos inline persistentes tras la animación.

### 3. Scroll reveals

Archivo: `src/scripts/animations/scrollReveals.ts`

- Se eliminó la duplicación entre `.js-reveal-card`, `.js-service-card` y `.js-case-card`.
- Se separaron los batches para:
  - `.js-reveal`
  - `.js-reveal-card` no especializados
  - `.js-service-card`
  - `.js-case-card`
  - `.js-visual-card` y `.js-visual-node`
- Las secciones `.js-section` solo se animan si no contienen reveals internos.
- Se redujo la presión visual del reveal general:
  - menos desplazamiento vertical
  - menos duración
  - menos triggers redundantes
- La sección de “ruido operativo” quedó en una sola timeline con cleanup de `willChange`.
- Los CTA finales mantienen reveal propio, pero más contenido y con menos desplazamiento.

Resultado:

- Menos compounding motion.
- Mejor ritmo en el scroll.
- Menos probabilidad de sensación de scroll vacío o tardío por reveals encadenados.

### 4. Timeline de proceso

Archivo: `src/scripts/animations/processTimeline.ts`

- El reveal principal ahora usa una sola timeline para línea + steps.
- Los steps se consultan dentro del bloque `.js-process`, no globalmente.
- En desktop se mantiene el estado activo con triggers por step.
- En mobile no se usa esa activación adicional.
- Se limpian `willChange` y props inline al terminar.

Resultado:

- Menos triggers totales.
- Menos coste en mobile.
- La línea ya no intenta animarse donde no aporta.

### 5. Portik story

Archivo: `src/scripts/animations/portikStory.ts`

- Panel y módulos ahora comparten una sola timeline por sección.
- Se limpian `willChange` y props inline al terminar.

Resultado:

- Menos triggers sobre el mismo bloque.
- Entrada más consistente y menos costosa.

### 6. Microinteracciones

Archivo: `src/scripts/animations/cardInteractions.ts`

- Se añade `gsap.killTweensOf(element)` antes de cada entrada/salida.
- Se usa `overwrite: "auto"`.
- Se reduce ligeramente la duración.
- Se limpia `transform` y `willChange` al volver al estado base.

Resultado:

- Hover más estable.
- Sin acumulación de tweens rápidos al mover el mouse.

### 7. Reduced motion en CSS

Archivo: `src/styles/motion.css`

- Además de reducir animaciones/transiciones globales, ahora se desactivan los desplazamientos por `transform` en:
  - `.button:hover`
  - `.button:focus-visible`
  - `[data-card-interaction]`
  - `[data-link-shift]`

Resultado:

- Reduced motion también cubre los pequeños desplazamientos CSS, no solo GSAP.

## Validación técnica

Comandos ejecutados:

- `git status --short --branch`
- `npm run check`
- `npm run build`
- `rg -n "markers|pin\\s*:|pinSpacing|refresh\\(|width\\s*:|height\\s*:|top\\s*:|left\\s*:|margin\\s*:|padding\\s*:" src/scripts/animations -S`

Resultado:

- `astro check`: OK
- `astro build`: OK
- No se encontraron `markers`.
- No se encontraron `pin` ni `pinSpacing`.
- No se detectaron animaciones GSAP sobre `width`, `height`, `top`, `left`, `margin` o `padding`.
- `refresh()` quedó centralizado en `init.ts`.

## Archivos modificados

- `src/scripts/animations/cardInteractions.ts`
- `src/scripts/animations/heroTimeline.ts`
- `src/scripts/animations/init.ts`
- `src/scripts/animations/portikStory.ts`
- `src/scripts/animations/processTimeline.ts`
- `src/scripts/animations/scrollReveals.ts`
- `src/styles/motion.css`
- `docs/redesign/gsap-produccion.md`

## Qué no se tocó

- `public_html/`
- WordPress core
- `wp-theme/`
- plugins
- uploads
- backups
- dumps SQL
- credenciales
- `.env`
- `.gitignore`
- `content/home.html`
- `docs/deployment-checklist.md`

## Riesgos pendientes

1. No se hizo medición Lighthouse real dentro de esta tarea.
   - La optimización es estructural y de código, no una auditoría de navegador con métricas de campo.

2. Los nuevos visuales `src/components/visuals/` ya están preparados para reveals, pero aún no están montados en las páginas.
   - Cuando se conecten, conviene revisar el ritmo final del scroll en Home, productos y demos.

3. El scroll vacío visible previamente mejoró por reducción de reveals redundantes, pero la validación final ideal sigue siendo visual en viewport real desktop y mobile.
