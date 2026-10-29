# WhatsApp comercial — validación local

Base: `78d34926e73bfdb0d110650320219061f0076e47`, rama `feature/web-demo-2026-gsap`.

El propietario solicitó expresamente incorporar WhatsApp al sitio de prueba usando el número corporativo existente: **+57 321 2554930**. Esta solicitud sustituye la restricción anterior de los checkers que exigía ausencia de WhatsApp.

## Cambio

- Número y enlace `https://wa.me/573212554930` centralizados en `src/lib/site.ts`.
- Mensaje inicial fijo: «Hola, quiero conversar con SokaTechnologies sobre un proyecto.» No incorpora datos de formularios ni URLs del visitante.
- Componente compartido con texto visible, SVG local, aviso accesible de nueva pestaña y `noopener noreferrer`.
- Acceso flotante global, enlace en el pie y acción/tarjeta en Contacto. Se conservan correo y llamada.
- CSS con área táctil de al menos 48 px, foco visible, separación del borde seguro, espacio al final del documento y ocultación al enfocar formularios o desplegar el menú.
- El enlace funciona sin JavaScript. No se añadieron widgets, SDK, analítica ni dependencias al proyecto. Abrir el enlace no envía automáticamente el mensaje.
- Checkers actualizados para exigir el destino autorizado, mensaje y atributos externos; smoke ampliado con comprobaciones de visibilidad, foco y ocultación al enfocar campos.

## Ejecutado en el entorno de esta revisión

- `npm ci`: completado. Sin cambios en dependencias ni lockfile.
- `npm run check`: PASS, 97 archivos analizados, 0 errores, advertencias o hints en la copia dispersa de la aplicación.
- Build staging: PASS, 23 páginas; `PUBLIC_SITE_URL=https://prueba.sokatechnologies.com`, `PUBLIC_SITE_INDEXING=false`, `PUBLIC_FORM_PROVIDER=demo`, endpoint y Turnstile vacíos.
- `npm run test:contact`: PASS, tres canales y formularios demo.
- `SEO_EXPECTED_ORIGIN=https://prueba.sokatechnologies.com SEO_EXPECT_INDEXING=false npm run test:seo`: PASS. La primera invocación sin el origen esperado detectó correctamente la discrepancia frente a su valor predeterminado de producción; se corrigió la invocación, no el artefacto.
- `npm test`: PASS, 60/60 en la repetición. La primera ejecución simultánea con Astro check tuvo un timeout en `stores one evidence event and gives one process the dispatch claim`; la repetición pasó sin cambios de código. No se modificó el Worker.
- `node --check` de ambos scripts modificados: PASS.
- `git diff --check`: PASS.

## Pendiente, no declarado PASS

El smoke no llegó a ejecutar la revisión de páginas: Chromium no inició y el script terminó por timeout. El binario alternativo también falló al iniciar. No hay revisión visual, capturas válidas ni prueba con dispositivos físicos de este cambio en esta sesión.

Antes de integrar/publicar desde LPT-KEVIN:

1. Ejecutar el smoke estricto del PR en el preview de su propio worktree en SSD.
2. Revisar Inicio y Contacto en 320, 375, 768 y 1440 px: botón legible, sin overflow ni solapamientos con campos/CTA, menú o pie. Comprobar el foco con Tab y que el acceso flotante se oculta durante edición de formularios y con menú abierto.
3. Verificar apertura por clic y teclado interceptando la navegación externa para comprobar URL y mensaje sin enviar mensajes. Comprobar los enlaces también con JavaScript desactivado.
4. Confirmar que no hay peticiones a WhatsApp antes de activar voluntariamente el enlace y que los formularios siguen en demo.
5. Integrar y publicar únicamente el artefacto de staging en 8091 mediante el procedimiento existente, con respaldo verificado y conservación de permisos. Validar el resultado público.

No se realizó merge, publicación ni cambio en LPT-KEVIN, producción, WordPress, correo, DNS, Cloudflare, Docker o servicios. El candidato local de producción preparado antes de este cambio no lo incluye y deberá regenerarse cuando corresponda.
