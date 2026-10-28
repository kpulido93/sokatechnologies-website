# Validación local — auditoría pública

Fecha: 2026-10-28 (America/Bogota)

## Resultado

- `npm test`: PASS — 60 pruebas.
- `npm run check`: PASS — 0 errores, 0 warnings, 0 hints.
- `npm run build`: PASS — 22 páginas generadas.
- `npm run test:local-ui`: PASS en `http://127.0.0.1:4321`.
- `git diff --check`: PASS.

## Cobertura UI

El smoke recorrió las 22 rutas existentes en los tres viewports base:

- 1440×900.
- 768×1024.
- 375×812.

Además, comprobó Contacto, Diagnóstico y Auditoría en 360×812, 375×812,
390×844 y 768×1024.

Se verificaron overflow global e interno, foco visible, errores asociados por
campo, foco en el primer error, transición de error a éxito demo, honeypot no
visible/no tabbable, 21 FAQ, imágenes responsive y etiquetas de Proyectos.

La cabecera móvil pasó en los cuatro tamaños: menú accesible, cinco enlaces
de navegación visibles al abrirlo, `aria-expanded`, foco en el primer enlace,
cierre con Escape, retorno del foco al botón y sin overflow horizontal.

La Auditoría demo pasó con cero llamadas a `fetch`, XHR, `sendBeacon` o
`HTMLFormElement.submit`. El resultado muestra “Simulación local basada en tus
respuestas”, no afirma evaluar o escanear la URL, no muestra valores numéricos
de medición y no muestra el mensaje de indisponibilidad temporal.

## Evidencia

Las capturas de esta carpeta fueron generadas por el smoke local. Las más
relevantes son:

- `header-mobile-375.png` — cabecera compacta a 375 px.
- `home-map-desktop.png` — portada y visualización de datos.
- `auditoria-form-desktop.png` — aviso demo antes de los campos.
- `auditoria-demo-result-desktop.png` — resultado de simulación sin medición.
- `contacto-form-desktop.png` y `diagnostico-form-desktop.png` — formularios demo.
- `proyectos-cards-desktop.png` — imágenes conceptuales y etiquetas sin duplicar.

## Estado y límites

Los formularios siguen en modo demo: no se habilitaron envíos, correos,
persistencia ni servicios externos. No se modificaron producción, WordPress,
Docker, Cloudflare, DNS, Nginx ni túneles.

VIS-02 continúa como recomendación opcional. LEGAL-01 continúa pendiente de
textos aprobados por el responsable antes de una publicación definitiva.
