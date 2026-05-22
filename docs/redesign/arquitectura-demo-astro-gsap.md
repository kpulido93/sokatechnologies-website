# Arquitectura Demo Astro + GSAP

## Estado

Documento de arquitectura para una demo corporativa separada de WordPress.

- No crea todavia el proyecto Astro.
- No instala dependencias.
- No toca `public_html/`.
- No reemplaza la web principal en WordPress.

## 1. Objetivo de la demo

Crear una demo web moderna para SokaTechnologies con enfoque B2B, capaz de validar una direccion visual y de movimiento mas cuidada que la web actual, sin comprometer produccion ni acoplarse a WordPress.

La demo debe servir para:

- evaluar una narrativa visual tipo startup tecnologica, pero sobria y corporativa;
- probar un sistema de animaciones GSAP mantenible;
- definir una base reutilizable para futuras landing pages o micrositios;
- extraer aprendizajes de UX y motion antes de decidir si algo migra a WordPress.

## 2. Principios de la arquitectura

- La demo vive separada de WordPress y se implementara como proyecto aislado dentro de `website/`.
- El mensaje principal sigue la estrategia ya definida para SokaTechnologies: resultados de negocio, claridad operativa y confianza B2B.
- La animacion apoya la comprension del contenido; no compite con el contenido.
- GSAP se usa de forma intencional: timelines para secuencias, ScrollTrigger para narrativa de scroll limitada y `matchMedia()` para responsive y accesibilidad.
- El proyecto debe poder mantenerse sin depender de React ni de un stack de frontend innecesariamente complejo.

## 3. Stack recomendado

### Base

- Astro
- TypeScript
- GSAP 3
- ScrollTrigger
- CSS nativo con variables de diseno y archivos por seccion

### Decisiones recomendadas

- Usar Astro sin framework de UI por defecto.
- Mantener salida estatica para preview y despliegues de demo.
- Cargar GSAP solo en paginas o secciones que realmente lo necesiten.
- Reservar componentes interactivos hidratados para una fase posterior si aparecen necesidades reales.

### Fuera de alcance en esta fase

- Three.js
- ScrollSmoother
- React por defecto
- builders visuales
- integraciones con WordPress

## 4. Estrategia de separacion con WordPress

La demo no sustituye la arquitectura del sitio principal en WordPress. Su funcion es explorar experiencia visual, jerarquia de contenido y motion design con un stack mas flexible.

Lineamientos:

- El codigo futuro de la demo debe vivir en una ruta propia, por ejemplo `website/demo-astro-gsap/`.
- No debe leer configuracion de WordPress ni depender de `public_html/`.
- El contenido base de la demo debe alinearse con `docs/content-structure.md` y `docs/marketing/Web_SokaTechnologies_WordPress.md`.
- Cualquier hallazgo reutilizable para WordPress debe documentarse primero; no se migra automaticamente.

## 5. Estructura de carpetas propuesta

```text
website/
└── demo-astro-gsap/
    ├── astro.config.mjs
    ├── package.json
    ├── tsconfig.json
    ├── public/
    │   ├── favicon.svg
    │   └── images/
    └── src/
        ├── pages/
        │   ├── index.astro
        │   ├── servicios.astro
        │   ├── casos-de-exito.astro
        │   ├── sobre-sokatechnologies.astro
        │   └── contacto.astro
        ├── layouts/
        │   └── MainLayout.astro
        ├── components/
        │   ├── layout/
        │   │   ├── SiteHeader.astro
        │   │   └── SiteFooter.astro
        │   ├── sections/
        │   │   ├── HeroSection.astro
        │   │   ├── ResultsStrip.astro
        │   │   ├── ProblemsSection.astro
        │   │   ├── ServicesSection.astro
        │   │   ├── ProcessSection.astro
        │   │   ├── CaseStudiesSection.astro
        │   │   ├── InsightsSection.astro
        │   │   └── FinalCtaSection.astro
        │   └── ui/
        │       ├── SectionHeading.astro
        │       ├── ServiceCard.astro
        │       ├── MetricPill.astro
        │       └── CtaButton.astro
        ├── content/
        │   ├── navigation.ts
        │   ├── services.ts
        │   ├── metrics.ts
        │   └── caseStudies.ts
        ├── lib/
        │   └── gsap/
        │       ├── register.ts
        │       ├── media.ts
        │       ├── tokens.ts
        │       ├── home/
        │       │   ├── intro.ts
        │       │   ├── sections.ts
        │       │   └── scroll.ts
        │       └── shared/
        │           ├── reveal.ts
        │           └── cleanup.ts
        └── styles/
            ├── tokens.css
            ├── base.css
            ├── layout.css
            └── sections/
```

## 6. Paginas iniciales recomendadas

La demo debe empezar con pocas paginas, pero suficientes para validar narrativa, navegacion y animacion.

### Fase 1

- `/`
  Objetivo: vender propuesta de valor, presentar resultados de negocio y dirigir a contacto.
- `/servicios/`
  Objetivo: agrupar oferta principal y enlazar a especialidades.
- `/casos-de-exito/`
  Objetivo: demostrar credibilidad con casos anonimizados.
- `/sobre-sokatechnologies/`
  Objetivo: reforzar confianza, enfoque consultivo y capacidad tecnica integral.
- `/contacto/`
  Objetivo: convertir interes en conversacion comercial.

### Fase 2

- `/servicios/software-a-medida/`
- `/servicios/automatizaciones-integraciones/`
- `/servicios/sitios-web-corporativos/`

La home debe seguir de cerca la estructura de mensajes ya definida en los documentos de marketing: hero, problemas, servicios, proceso, resultados, casos y CTA final.

## 7. Componentes principales

### Layout

- `MainLayout`
- `SiteHeader`
- `SiteFooter`
- `SeoHead` en una fase posterior

### Secciones corporativas de la home

- `HeroSection`
- `ResultsStrip`
- `ProblemsSection`
- `ServicesSection`
- `ProcessSection`
- `CaseStudiesSection`
- `InsightsSection`
- `FinalCtaSection`

### Componentes reutilizables

- `SectionHeading`
- `ServiceCard`
- `MetricPill`
- `CaseStudyCard`
- `ProcessStepCard`
- `CtaButton`

### Criterio de composicion

- Cada seccion debe poder renderizarse sin JavaScript.
- La animacion debe inicializarse encima de una base ya legible.
- Los componentes no deben contener logica GSAP dispersa; la orquestacion vive en `src/lib/gsap/`.

## 8. Estrategia GSAP

### Principios de implementacion

- Registrar `ScrollTrigger` una sola vez.
- Centralizar defaults de easing, duration y stagger.
- Usar `gsap.timeline()` para toda secuencia multi-paso.
- Usar `gsap.matchMedia()` para desktop, mobile y `prefers-reduced-motion`.
- Aplicar ScrollTrigger solo a tweens o timelines de nivel superior.
- Separar animaciones por pagina y por seccion para evitar scripts monoliticos.

### Regla operativa

Usar CSS para:

- hover simples;
- focus states;
- transiciones menores de interfaz.

Usar GSAP para:

- secuencias de entrada;
- reveals coreografiados;
- scroll narratives moderadas;
- coordinacion entre varias piezas visuales.

## 9. Timelines previstas

### 9.1 Timeline de carga de pagina

Objetivo: construir una primera impresion mas premium sin bloquear la lectura.

Secuencia prevista:

- aparicion del header;
- entrada del eyebrow o badge de contexto;
- entrada del H1;
- entrada del parrafo principal;
- aparicion escalonada de CTAs;
- entrada de metricas o trust signals;
- activacion sutil del arte visual del hero.

### 9.2 Timeline del hero

Objetivo: presentar una narrativa clara de valor y capacidad.

Patron:

- texto principal primero;
- CTA inmediatamente visible;
- visual de apoyo despues;
- animaciones ornamentales muy discretas.

La prioridad es que el mensaje se entienda en menos de tres segundos, incluso si GSAP no se ejecuta.

### 9.3 Timeline de servicios

Objetivo: revelar tarjetas por grupos, reforzando jerarquia y escaneabilidad.

Patron:

- heading y copy introductorio;
- grid de tarjetas con stagger corto;
- CTA de exploracion al cierre.

### 9.4 Timeline de proceso

Objetivo: explicar como trabaja SokaTechnologies de forma ordenada.

Patron:

- pasos revelados en secuencia;
- linea o acento visual que acompana el avance;
- version desktop mas expresiva y version mobile mas simple.

### 9.5 Timeline de casos y cierre

Objetivo: cerrar con confianza y convertir.

Patron:

- reveal de casos anonimizados;
- bloque de diferenciadores;
- CTA final con presencia clara, sin efectos agresivos.

## 10. Uso de ScrollTrigger

### Casos recomendados

- reveals de secciones al entrar en viewport;
- stagger de cards de servicios o casos;
- activacion de bloques de proceso;
- una sola narrativa con `scrub` si aporta claridad real.

### Casos permitidos con cautela

- un unico bloque pinneado en desktop para `ProcessSection` o una narrativa similar;
- `batch()` para grids repetitivos;
- `refresh()` despues de cambios reales de layout, imagenes o tipografias.

### Casos a evitar en la primera iteracion

- varias secciones pinneadas encadenadas;
- animaciones horizontales complejas;
- ScrollTrigger dentro de timelines hijas;
- `markers` fuera de desarrollo;
- mezclar `scrub` y `toggleActions` en el mismo trigger;
- efectos que dependan de scroll muy fino en mobile.

### Politica de uso

- Crear triggers en orden top-to-bottom.
- Mantener un numero acotado de ScrollTriggers por pagina.
- Priorizar `toggleActions` para reveals discretos.
- Reservar `scrub` para uno o dos momentos narrativos maximo.

## 11. Reglas de performance

### Reglas tecnicas

- Animar `transform`, `autoAlpha` y `opacity`.
- Evitar `width`, `height`, `top`, `left`, `margin` y `padding` para movimiento.
- Usar `stagger` en lugar de multiples tweens manuales.
- Limitar `will-change` a elementos realmente animados.
- Evitar timelines o triggers en elementos fuera del viewport que no aporten valor.
- Hacer cleanup al cambiar de pagina o rehidratar scripts.

### Reglas de producto

- Una sola seccion con pin en desktop como maximo en la primera version.
- Ninguna animacion debe impedir click inmediato sobre CTAs.
- No usar loops decorativos largos si no aportan lectura ni jerarquia.
- No cargar GSAP en paginas estaticas que no usen motion.

### Regla visual

La demo debe sentirse fluida y sobria, no pesada. Si una animacion no mejora comprension, conversion o percepcion de marca, debe eliminarse.

## 12. Reglas de accesibilidad

- Todo contenido clave debe estar presente en el HTML antes de animarse.
- Ninguna informacion critica depende de scroll preciso para ser entendida.
- El orden visual y el orden del DOM deben permanecer coherentes.
- Los CTAs deben mantener foco visible y no moverse de forma inesperada al navegar con teclado.
- El contraste visual debe seguir siendo valido con y sin animacion.
- Evitar flashes, desplazamientos bruscos, parallax agresivo y movimientos continuos grandes.
- Formularios y enlaces deben seguir siendo completamente utilizables con JavaScript desactivado en la medida razonable para una demo estatica.

## 13. Estrategia `prefers-reduced-motion`

La implementacion debe considerar `prefers-reduced-motion` desde el primer commit.

### Regla base

Usar `gsap.matchMedia()` con una condicion explicita para `reduce`.

### Comportamiento esperado

- eliminar `scrub` y pinning cuando `reduce` este activo;
- reducir durations a transiciones muy cortas o a estado inmediato;
- mantener solo fades sutiles si aportan claridad;
- desactivar animaciones decorativas de background;
- mostrar contenido ya visible por defecto.

### Resultado esperado

La experiencia con reduced motion debe seguir siendo limpia, corporativa y completa, no una version rota o vacia.

## 14. Que no se debe animar

- campos de formulario durante escritura;
- textos legales o de privacidad;
- navegacion principal de forma excesiva;
- layout estructural completo si genera reflow visible;
- fondos grandes con parallax agresivo;
- contadores falsos o metricas inventadas;
- botones con rebotes continuos;
- elementos criticos que necesiten estabilidad para leer o clicar;
- cualquier contenido que parezca gimmick experimental en lugar de solucion B2B.

## 15. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Sobrecargar la demo con animacion | Percepcion menos corporativa y peor conversion | Definir presupuesto de motion por seccion y eliminar efectos decorativos redundantes |
| ScrollTrigger excesivo en mobile | Jank y mala experiencia tactil | Limitar scrub y pinning a desktop mediante `matchMedia()` |
| Animaciones dispersas en componentes | Mantenimiento dificil | Centralizar orquestacion GSAP en `src/lib/gsap/` |
| Dependencia de JS para mostrar contenido | Riesgo de accesibilidad y SEO | Renderizar contenido completo en HTML y usar GSAP como mejora progresiva |
| Desalineacion con la estrategia WordPress | Demo atractiva pero poco util para negocio | Basar estructura y copy en la documentacion de contenido ya aprobada |
| Uso de propiedades costosas | Jank y peor Lighthouse | Animar solo transform y opacidad, con revision tecnica por seccion |
| Pinning o scrub mal calibrado | Sensacion experimental o cansina | Permitir como maximo un momento narrativo principal y testear antes de expandir |

## 16. Validacion futura al implementar

Cuando se construya el proyecto, validar como minimo:

- que la home se entiende sin esperar animaciones;
- que el hero presenta propuesta de valor y CTA de inmediato;
- que no hay errores de consola al registrar GSAP y ScrollTrigger;
- que `prefers-reduced-motion` elimina el motion intrusivo;
- que mobile mantiene navegacion y scroll fluidos;
- que los CTAs siguen siendo clicables durante las animaciones;
- que no se ha introducido ninguna dependencia con WordPress ni con `public_html/`.

## 17. Decision recomendada

La demo debe construirse como un micrositio Astro estatico, aislado del entorno WordPress, con GSAP como capa de motion enfocada en:

- intro del hero;
- reveals de secciones;
- una narrativa de scroll moderada y controlada;
- performance y accesibilidad como restricciones de arquitectura, no como mejora posterior.

El enfoque correcto para SokaTechnologies es corporativo, claro y ejecutable: motion premium, pero sin experimentalismo innecesario.
