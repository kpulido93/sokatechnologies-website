# Auditoria de animaciones GSAP

Fecha: 2026-05-20

## Alcance revisado

- `demo-astro/src/scripts/animations/`
- `demo-astro/src/pages/`
- `demo-astro/src/layouts/BaseLayout.astro`
- `demo-astro/src/styles/global.css`

## Resumen ejecutivo

Estado: apto para demo local.

La capa GSAP quedo mas estable despues de dos ajustes de arquitectura:

1. La inicializacion de animaciones se movio a `BaseLayout.astro` para evitar wiring parcial o duplicado entre paginas.
2. `will-change` dejo de quedar activo desde el arranque en las secciones con `scrub` y ahora solo vive mientras el trigger esta activo.

No se detectaron animaciones GSAP sobre propiedades costosas de layout. ScrollTrigger sigue registrado una sola vez y no hay `markers` activos en el codigo revisado.

## Hallazgos y ajustes aplicados

### 1. Inicializacion parcial de animaciones

Hallazgo:
Solo `index.astro` y `productos/portik.astro` arrancaban `initAnimations()`. Eso dejaba fuera rutas que ya tenian clases `.js-reveal` y `.js-reveal-card`, como `/servicios`, `/casos`, `/contacto` y `/diagnostico`.

Ajuste aplicado:

- Se movio el arranque a `demo-astro/src/layouts/BaseLayout.astro`.
- Se eliminaron los scripts inline duplicados de:
  - `demo-astro/src/pages/index.astro`
  - `demo-astro/src/pages/productos/portik.astro`

Impacto:
La demo ahora inicializa GSAP de forma consistente en todas las paginas que usen hooks `.js-*`, sin agregar animaciones nuevas ni duplicar triggers.

### 2. `will-change` demasiado persistente en timelines con `scrub`

Hallazgo:
`processTimeline.ts` y `portikStory.ts` aplicaban `will-change` al montar la pagina y solo lo limpiaban al completar la timeline o al destruirla. En desktop, con `scrub`, eso podia dejar capas promocionadas mas tiempo del necesario.

Ajuste aplicado:

- En `demo-astro/src/scripts/animations/processTimeline.ts`
- En `demo-astro/src/scripts/animations/portikStory.ts`

Ahora `will-change` se activa con `onEnter` y `onEnterBack`, y se limpia con `onLeave` y `onLeaveBack` del `ScrollTrigger`.

Impacto:
Menor riesgo de trabajo extra de compositing fuera del rango activo del scroll.

## Validaciones realizadas

### GSAP solo corre en cliente

Validado.

- `initAnimations()` tiene guard clause para `window` y `document`.
- La invocacion vive dentro de un `<script>` del layout, por lo que no corre durante SSR.

### ScrollTrigger se registra una sola vez

Validado.

- `demo-astro/src/scripts/animations/initAnimations.ts` usa `registerScrollTriggerOnce()` con el flag `isScrollTriggerRegistered`.

### No hay `markers` en produccion

Validado.

- No se encontraron referencias a `markers: true` en `demo-astro/src/`.

### Se respeta `prefers-reduced-motion`

Validado.

- `initAnimations.ts` usa `gsap.matchMedia()` con `"(prefers-reduced-motion: reduce)"`.
- Los modulos de animacion hacen early return cuando `reduceMotion` es `true`.
- `global.css` tambien reduce transiciones de hover bajo `@media (prefers-reduced-motion: reduce)`.

### No se animan propiedades costosas con GSAP

Validado.

Las animaciones revisadas usan:

- `autoAlpha`
- `x`
- `y`
- `scale`
- `scaleY`

No se encontraron tweens GSAP sobre `top`, `left`, `width`, `height`, `margin` o `padding`.

### No hay ScrollTriggers duplicados por pagina

Validado con ajuste.

- `initAnimations.ts` limpia la sesion anterior via `__sokaDemoAnimationsCleanup`.
- `media.revert()` desmonta la configuracion de `matchMedia`.
- Cada modulo mata sus propios triggers o timelines en cleanup:
  - `scrollReveals.ts`
  - `processTimeline.ts`
  - `portikStory.ts`

### El contenido sigue visible sin JavaScript

Validado.

- No hay CSS base que oculte `.js-hero`, `.js-reveal`, `.js-reveal-card`, `.js-process-step` o `.js-portik-*`.
- Las entradas se basan en `from()` o `fromTo()` sobre contenido ya renderizado.

### No hay errores de consola conocidos

Validacion parcial.

- `npm run build` pasa.
- La build estatica cargo en Edge headless sin fallo de proceso.
- La captura automatizada de consola con Playwright no pudo completarse porque el runtime disponible en esta sesion trae `playwright` sin una resolucion funcional de `playwright-core`.

Conclusion operativa:
No hay evidencia actual de errores de runtime en la demo revisada, pero la inspeccion automatizada fina de consola quedo limitada por el entorno de herramientas, no por el codigo de la demo.

### No se toca WordPress

Validado.

Todos los cambios de esta auditoria quedaron limitados a:

- `demo-astro/`
- `docs/redesign/`

No se modifico `public_html/` ni archivos WordPress.

## Archivos ajustados en la auditoria

- `demo-astro/src/layouts/BaseLayout.astro`
- `demo-astro/src/pages/index.astro`
- `demo-astro/src/pages/productos/portik.astro`
- `demo-astro/src/scripts/animations/processTimeline.ts`
- `demo-astro/src/scripts/animations/portikStory.ts`

## Comando de validacion

```bash
cd demo-astro
npm run build
```

Resultado:

- `npm run build` pasa.

## QA manual recomendada

1. Abrir `/`, `/servicios`, `/casos` y `/productos/portik`.
2. Confirmar que los reveals se activan tambien fuera de Home y Portik hero.
3. Revisar desktop con scroll medio/lento en:
   - timeline de proceso
   - storytelling de Portik
4. Activar `prefers-reduced-motion` en el sistema y confirmar que:
   - no hay entradas GSAP
   - el contenido sigue visible y usable
5. Navegar con teclado por cards y CTAs para verificar foco visible y ausencia de bloqueo visual.

## Pendientes no bloqueantes

- Si mas adelante se habilita una herramienta de navegador con consola completa en la sesion, conviene repetir una pasada automatizada de console/runtime sobre las rutas principales.
