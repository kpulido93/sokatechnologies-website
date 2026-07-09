# Fix de scroll vacio en la demo

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Causa encontrada

El espacio vacio visible debajo del hero no venia de `pinSpacing`, ni de `ScrollTrigger`, ni de un `min-height: 100vh` global.

La causa real estaba en el hero responsive de la home:

- en mobile, el hero pasaba a una sola columna
- el bloque `.hero-visual` se apilaba debajo del copy
- el panel ficticio del hero seguia renderizando demasiada altura
- en el breakpoint estrecho, ese visual consumia mucho scroll antes de mostrar el siguiente bloque util

Medicion tomada en runtime antes del ajuste:

- hero mobile: ~`1891px`
- visual mobile: ~`1231px`
- primer bloque siguiente (`.metrics-band`): ~`2136px` desde el top del documento

Conclusion tecnica:

- no habia contenido oculto por GSAP
- no habia `pinSpacing`
- el hueco era layout real del hero en mobile

## Archivos modificados

- `src/styles/global.css`
- `docs/redesign/fix-scroll-vacio-demo.md`

Archivos auditados sin necesidad de cambio:

- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/tokens.css`
- `src/styles/motion.css`
- `src/scripts/animations/heroTimeline.ts`
- `src/scripts/animations/scrollReveals.ts`
- `src/scripts/animations/init.ts`

## Que reglas se ajustaron

### Hero

- se compactaron `gap` y `padding-block` del hero en breakpoints responsive
- se redujo el tamaño del `h1` y del texto base en mobile
- se controlo mejor el ancho del bloque de copy

### Visual del hero

- en tablet y rangos medios se compactaron `padding` y `gap` del panel
- se mantuvo el grid del visual mas contenido
- en mobile estrecho (`max-width: 520px`) se oculto `.hero-visual`

Decisión:

- en ese ancho, el visual ocupaba demasiado espacio y no aportaba suficiente lectura antes del primer scroll
- la propuesta de valor principal ya queda clara con copy, CTAs y signals

### GSAP

Resultado de auditoria:

- no se detecto `pinSpacing`
- no se detectaron elementos del hero con `opacity: 0`, `visibility: hidden` o `transform` residual al final de la animacion
- `ScrollTrigger.refresh()` ya estaba acotado al init y fuentes; no hizo falta tocarlo

## Resultado despues del ajuste

Medicion tomada en runtime despues del ajuste:

- hero mobile: ~`603px`
- visual mobile: `display: none`
- primer bloque siguiente (`.metrics-band`): ~`848px`

Impacto:

- el siguiente bloque aparece practicamente al terminar el primer viewport mobile
- desaparece la sensacion de scroll vacio
- desktop conserva el visual del hero
- no se introdujo layout shift visible en la validacion hecha

## Validacion realizada

Comandos:

```bash
git status
npm run build
npm run check
npm run preview -- --host 127.0.0.1 --port 4323
```

Validaciones estructurales:

- `npm run build` pasa
- `npm run check` pasa
- no se detectaron `markers`
- no se detecto `pinSpacing`

Validacion visual local:

- captura mobile final: [home-mobile-final.png](/home/kevin/soka-qa/home-mobile-final.png)
- captura desktop final: [home-desktop-final.png](/home/kevin/soka-qa/home-desktop-final.png)

## Riesgo pendiente

- el ajuste prioriza ritmo y claridad en mobile estrecho ocultando el visual del hero en ese breakpoint
- conviene una revision manual final en telefonos reales para decidir si ese comportamiento queda definitivo o si luego se reemplaza por una version mobile mas compacta del panel
