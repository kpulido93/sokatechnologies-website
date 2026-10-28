# Validación local — auditoría pública

Fecha: 2026-10-28 (America/Bogota)

## Resultado

- `npm test`: PASS — 60 pruebas.
- `npm run check`: PASS — 0 errores, 0 warnings, 0 hints.
- `npm run build`: PASS — 22 páginas generadas.
- `npm run test:local-ui`: PASS en `http://127.0.0.1:4321` después de generar la simulación.
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

La validación de Auditoría cubrió cuatro entradas sintéticas: caso genérico,
web y conversión, datos y reportes, e infraestructura y continuidad. En los
cuatro casos se verificó que los textos se presenten como “Tema por explorar”,
que el tema esperado aparezca, y que observaciones y recomendaciones tengan
contenido completo, legible y explícitamente marcado como hipótesis derivada de
las respuestas. Los resultados reales de PageSpeed continúan
separados en la ruta de medición; la transformación de hipótesis se aplica
solo a la simulación local.

La reproducción inicial mostró que el resultado quedaba restringido a la
columna derecha del formulario en escritorio y que algunas etiquetas desbordaban
su tarjeta en móvil. Se corrigió la distribución del formulario, se limitaron
los anchos mínimos internos y se permitió el salto de las etiquetas. La
validación final registró `overflowFailures: 0`, `focusFailures: 0`, y cero
desbordamientos internos en los cuatro escenarios. El informe ocupa dos
columnas en escritorio (`reportWidth: 1093.625`) y una en móvil
(`reportWidth: 252.625`) sin recortes de contenido.

## Evidencia

Las capturas de esta carpeta fueron generadas por el smoke local. Las más
relevantes son:

- `header-mobile-375.png` — cabecera compacta a 375 px.
- `home-map-desktop.png` — portada y visualización de datos.
- `auditoria-form-desktop.png` — aviso demo antes de los campos.
- `auditoria-demo-result-desktop.png` — informe completo generado, con encabezado,
  áreas, observaciones y recomendaciones, sin medición.
- `auditoria-demo-result-mobile.png` — el mismo informe completo en el viewport
  móvil, validado después de generar la simulación.
- `contacto-form-desktop.png` y `diagnostico-form-desktop.png` — formularios demo.
- `proyectos-cards-desktop.png` — imágenes conceptuales y etiquetas sin duplicar.

## Estado y límites

Los formularios siguen en modo demo: no se habilitaron envíos, correos,
persistencia ni servicios externos. No se modificaron producción, WordPress,
Docker, Cloudflare, DNS, Nginx ni túneles.

VIS-02 continúa como recomendación opcional. LEGAL-01 continúa pendiente de
textos aprobados por el responsable antes de una publicación definitiva.
