# Auditoría inicial de la demo Astro

## Contexto auditado

La auditoría se hizo sobre el estado real del repositorio en `feature/web-demo-2026-gsap`. No existía `demo-astro/`; la app Astro estaba ubicada en la raíz del repo.

## Estructura encontrada al inicio

- `package.json` en raíz con Astro 7, TypeScript y GSAP.
- `src/pages/index.astro` como única página funcional.
- `src/layouts/BaseLayout.astro` como layout único.
- `src/styles/global.css` como hoja de estilos monolítica.
- `src/scripts/homeMotion.ts` como script GSAP único.
- `public/` sin assets funcionales aparte de `.gitkeep`.

## Páginas existentes

- `/` únicamente.

## Componentes existentes

- No había componentes reutilizables implementados.
- `src/components/` solo tenía `.gitkeep`.

## Sistema CSS actual

- Todo el diseño estaba concentrado en `src/styles/global.css`.
- No existían tokens separados.
- No existía archivo específico de motion ni sistema de variables tipográficas/espaciado más allá de variables básicas en `:root`.

## Animaciones GSAP existentes

- Un solo archivo: `src/scripts/homeMotion.ts`.
- Mezclaba hero intro, reveals, activación del proceso, floating loops y drift.
- No había separación por módulos funcionales.
- No había una capa central explícita de init/cleanup.

## Qué se podía reutilizar

- La decisión de usar Astro + GSAP en la raíz.
- La intención visual de un panel abstracto para hero.
- Parte del enfoque editorial y corporativo ya presente en el contenido inicial.

## Qué requería refactor

- Separar componentes, contenido y páginas.
- Centralizar metadata y navegación.
- Crear páginas secundarias.
- Reemplazar el script GSAP monolítico por módulos con cleanup.
- Separar tokens, motion y estilos globales.

## Riesgos detectados antes de implementar

- La ruta `demo-astro/` definida en los prompts no coincidía con la realidad del repo.
- Había worktree con cambios no commiteados que debían asumirse como baseline.
- El sistema de animación inicial era válido para una sola página, pero escalarlo sin refactor habría generado duplicación y acoplamiento.

## Validación realizada

- `git status`
- `npm run build`

Resultado en la auditoría inicial: el build de la base Astro pasaba y la app era viable como punto de partida.
