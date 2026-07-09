# Guía visual SokaTechnologies 2026

## Propósito

Definir una dirección visual premium B2B para la demo Astro de SokaTechnologies, inspirada en la sensación de orden, sobriedad y fluidez que transmite Stillion, sin copiar su layout, textos, paleta exacta, assets ni composición.

## Patrones que sí se toman como inspiración

- Hero con mensaje fuerte, poco ruido y CTA visible.
- Navegación corta y comercialmente orientada.
- Alto contraste con superficies oscuras y bordes sutiles.
- Secciones amplias, respiradas y con jerarquía editorial.
- Repetición disciplinada de CTAs.
- Sensación de control, calma y continuidad.
- Motion sutil que acompaña lectura y foco visual.
- Prueba de confianza basada en proceso, casos y producto.

## Patrones que no se deben copiar

- Paleta exacta o proporciones cromáticas de Stillion.
- Composición exacta del hero o de sus paneles.
- Tipografías, textos o claims equivalentes.
- Mismos ritmos de scroll storytelling o secuencias de animación.
- UI de dashboard, cards o métricas calcadas.
- Tonalidad visual que haga parecer a Soka una marca ajena.

## Paleta propuesta para Soka

- Fondo profundo: `#06101D`
- Fondo elevado: `#0C1829`
- Superficie: `rgba(11, 24, 40, 0.82)`
- Borde sutil: `rgba(135, 170, 230, 0.16)`
- Texto principal: `#EDF3FB`
- Texto secundario: `#92A6C3`
- Acento principal Soka: `#55B0FF`
- Acento suave: `#90D9FF`
- Acento secundario: `#22D4BF`

## Tipografía recomendada

- Display: `Space Grotesk`
- Body: `Manrope`
- Headings compactos, con tracking negativo controlado.
- Cuerpo legible con `line-height` amplio y tono editorial.
- Eyebrows y labels en mayúscula corta, espaciadas y discretas.

## Sistema de espaciado

- Secciones: entre `3rem` y `8rem` según jerarquía.
- Containers con ancho máximo de `1200px`.
- Cards con padding mínimo de `1.4rem`.
- Gaps visibles entre módulos para evitar saturación.
- Repetir márgenes y gutters consistentes antes que introducir variaciones arbitrarias.

## Estilo de cards

- Fondo oscuro translúcido con blur moderado.
- Bordes finos y contrastados, nunca pesados.
- Radio amplio, no experimental.
- Glow muy contenido solo en bordes o acentos.
- Sombra profunda, más corporativa que dramática.

## Estilo de CTA

- CTA primario claro con contraste alto.
- CTA secundarios oscuros, delimitados por borde.
- Copys directos: “Solicitar diagnóstico”, “Ver Portik”, “Hablar con Soka”.
- Repetir CTA principal a mitad y al cierre de la landing.

## Estilo del hero

- Copy dominante a la izquierda y panel operativo abstracto a la derecha.
- Visual sin capturas reales, sin mockups de login y sin datos sensibles.
- Señales: operación, automatización, reportes, continuidad y Portik.
- Mensaje principal enfocado en control operativo y claridad.

## Estilo de secciones editoriales

- Encabezado con eyebrow, título corto y párrafo de contexto.
- Un solo mensaje principal por sección.
- Alternar grids con paneles anchos para dar ritmo.
- Evitar exceso de iconografía decorativa.

## Estilo de casos

- Casos anonimizados con enfoque de contexto, problema, enfoque y resultado cualitativo.
- Nada de cifras inventadas, clientes reales ni logos.
- Tags discretos para servicios aplicados.
- Nota de confidencialidad visible.

## Estilo de Portik

- Debe sentirse como producto propio prioritario.
- Presentación centrada en control operativo, no en promesas futuristas.
- Módulos MVP visibles como bloques simples, claros y trazables.
- No venderlo visualmente como ERP, app móvil o sistema de seguridad avanzada.

## Reglas de motion

- GSAP solo para entrada, reveal, secuencia y activación de estados.
- Preferir `transform` y `opacity`.
- No animar layout real.
- Hero rápido y sobrio, menor a 1.4 segundos.
- Scroll reveals con `once: true` donde aplique.
- Reduced motion respetado desde base CSS y arquitectura JS.

## Reglas responsive

- Header puede envolver contenido; no depender de hamburguesa para esta demo.
- Hero apila copy y visual sin romper jerarquía.
- Timelines y grids pasan a una columna en tablet/mobile.
- Hover nunca debe ser requisito funcional.

## Checklist visual

- ¿La página se entiende en menos de 5 segundos?
- ¿Se siente corporativa y no experimental?
- ¿Los CTAs se repiten con disciplina?
- ¿Los paneles tienen contraste suficiente?
- ¿Portik se ve como producto protagonista?
- ¿Los casos transmiten confianza sin revelar datos?
- ¿El motion acompaña la lectura sin distraer?
- ¿La versión móvil mantiene jerarquía y claridad?
