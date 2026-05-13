# Arquitectura Base

## Objetivo

Definir una base simple para una web pública corporativa sin atar todavía el repositorio a un framework concreto.

## Principios

- Separación clara entre páginas, secciones, componentes, contenido y estilos.
- Estructura compatible con una futura implementación estática o híbrida.
- Documentación primero: las decisiones relevantes deben quedar registradas antes de introducir complejidad.
- Minimizar acoplamientos tempranos para permitir comparar opciones de stack.

## Estructura propuesta

- `src/pages`: composición de páginas públicas.
- `src/sections`: bloques funcionales como hero, servicios, contacto o CTA.
- `src/components`: piezas reutilizables de interfaz.
- `src/content`: copy, datos de navegación, metadata y assets estructurados.
- `src/styles`: tokens, temas y estilos globales.
- `src/lib`: helpers, utilidades transversales y adaptadores futuros.
- `public`: activos estáticos como imágenes, iconos o archivos descargables.

## Decisiones abiertas

- Framework y estrategia de renderizado.
- Sistema de estilos y design tokens.
- Hosting, CDN y pipeline de despliegue.
- Integración de formularios, analítica y CMS.
