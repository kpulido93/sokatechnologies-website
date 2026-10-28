# Integración de imágenes — validación local

Implementación: rama `codex/imagenes-web-demo`, basada en `885ecff`.

## Validación registrada

- Smoke local: 22 rutas × 3 viewports.
- 21 FAQ verificadas.
- Inicio, Proyectos y Nosotros capturados en escritorio, tablet y móvil.
- Formularios Contacto y Diagnóstico permanecen en modo demo; no hubo `fetch`, envíos ni persistencia.
- Imágenes responsive cargadas correctamente, con captions de proyectos y sin overflow detectado.
- `npm test`: 60/60 pruebas.
- `npm run check`: 0 errores, 0 warnings.
- `npm run build`: correcto, 22 páginas.
- `git diff --check`: correcto.

## Pesos de salida Astro

Las imágenes se generaron como variantes AVIF/WebP; no se sirven los PNG originales completos.

| Imagen | Variantes | Rango por variante | Total generado |
| --- | ---: | ---: | ---: |
| Hero | 10 | 4–28 KB | 136 KB |
| Proyecto CRM | 8 | 8–40 KB | 177 KB |
| Proyecto solicitudes | 8 | 7–35 KB | 153 KB |
| Retrato | 9 | 4–57 KB | 176 KB |

Las capturas de esta carpeta son evidencia local y no implican publicación ni despliegue.
