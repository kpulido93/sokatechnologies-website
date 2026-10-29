# WhatsApp comercial — validación local

Base validada: `e61359c37237f665bb75ddc3a0adbb834ef58e90` (HEAD del PR #29), rama `codex/whatsapp-contacto` sobre `feature/web-demo-2026-gsap`.

El propietario solicitó expresamente incorporar WhatsApp al sitio de prueba usando el número corporativo existente: **+57 321 2554930**. Esta solicitud sustituye la restricción anterior de los checkers que exigía ausencia de WhatsApp.

## Cambio

- Número y enlace `https://wa.me/573212554930` centralizados en `src/lib/site.ts`.
- Mensaje inicial fijo: «Hola, quiero conversar con SokaTechnologies sobre un proyecto.» No incorpora datos de formularios ni URLs del visitante.
- Componente compartido con texto visible, SVG local, aviso accesible de nueva pestaña y `noopener noreferrer`.
- Acceso flotante global, enlace en el pie y acción/tarjeta en Contacto. Se conservan correo y llamada.
- CSS con área táctil de al menos 48 px, foco visible, separación del borde seguro, espacio al final del documento y ocultación al enfocar formularios, abrir el menú o visitar una página con formulario. Las acciones directas de Contacto permanecen visibles en el flujo y el enlace flotante no cubre campos ni resultados.
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
- `npm run build -- --mode staging`: PASS después del ajuste visual; 23 páginas estáticas.

## Chromium independiente de Snap

La herramienta quedó aislada fuera del repositorio en `/srv/fast-storage/labs/sokatechnologies-website/d1-native/pr29-playwright-20261029/`.

- Playwright `1.64.1`, Node `v22.22.3`.
- Chromium for Testing `156.0.8078.4`, instalado únicamente con `playwright install chromium --no-shell`.
- Ejecutable usado: `/srv/fast-storage/labs/sokatechnologies-website/d1-native/pr29-playwright-20261029/browsers/chromium-1248/chrome-linux64/chrome`.
- `PLAYWRIGHT_BROWSERS_PATH` y perfiles bajo el laboratorio SSD. `TMPDIR` usó `/srv/fast-storage/labs/sokatechnologies-website/d1-native/tpw`, también en SSD; se escogió una ruta corta porque Chromium rechaza sockets Unix demasiado largos.
- La prueba directa de inicio con perfil temporal propio pasó; su stderr y el resultado están en `evidence/executable-direct-shorttmp.{stderr,status}`. Un intento previo con ruta temporal larga terminó con código 21 por el límite de socket, no por el ejecutable; quedó conservado en `evidence/executable-direct-short.{stderr,status}`.

## Smoke estricto y revisión visual

Comando ejecutado contra el build staging servido como preview estático local:

```text
BASE_URL=http://127.0.0.1:39077 CHROME_BIN=/srv/fast-storage/labs/sokatechnologies-website/d1-native/pr29-playwright-20261029/browsers/chromium-1248/chrome-linux64/chrome UI_SMOKE_STRICT=true TMPDIR=/srv/fast-storage/labs/sokatechnologies-website/d1-native/tpw PLAYWRIGHT_BROWSERS_PATH=/srv/fast-storage/labs/sokatechnologies-website/d1-native/pr29-playwright-20261029/browsers npm run test:local-ui
```

Resultado: **PASS**, salida completa en `artifacts/whatsapp/runtime/playwright-local-ui-smoke.log` y capturas en `artifacts/whatsapp/runtime/playwright-smoke-screenshots/`.

- Inventario: 23/23 rutas; sin faltantes ni inesperadas; 23 clasificadas como comerciales, demo o compatibilidad.
- Viewports: 1440×900, 768×1024 y 375×812; responsive adicional en 320, 360, 390 y 430 px.
- Overflow global/interno, foco, cabecera móvil, menú (apertura, teclado, Escape y devolución de foco), campos al 80 % y navegación: PASS.
- Contacto y Diagnóstico: errores asociados, foco en el primer error, transición a éxito demo, `fetch` 0 y envío nativo 0: PASS.
- Auditoría: cuatro escenarios ficticios, resultado orientativo completo y legible, sin mediciones numéricas, sin afirmación de escaneo, sin llamadas `fetch`/XHR/beacon ni envío nativo: PASS.
- WhatsApp: destino `https://wa.me/573212554930` y mensaje fijo verificados sin abrir el enlace; no se enviaron mensajes.

Revisión visual realizada sobre las capturas de Contacto de escritorio, formulario móvil, cabecera móvil y resultado de Auditoría en escritorio/móvil. Las acciones de correo, llamada y WhatsApp se leen completas; el botón flotante no aparece sobre los campos ni sobre el informe de Auditoría. Logo, menú, foco y ausencia de overflow coinciden con el smoke.

## Pendiente, no declarado PASS

Antes de integrar/publicar desde LPT-KEVIN:

1. Repetir la validación pública tras publicar únicamente en staging 8091; esta revisión local no acredita el HTTPS público.
2. Verificar apertura por clic y teclado interceptando la navegación externa para comprobar URL y mensaje sin enviar mensajes. Comprobar los enlaces también con JavaScript desactivado.
3. Completar pruebas en dispositivos físicos y otros navegadores si se requieren.

No se realizó todavía merge ni publicación. La validación no envió mensajes ni modificó LPT-KEVIN, producción, WordPress, correo, DNS, Cloudflare, Docker o servicios persistentes. El modo demo, noindex y endpoints vacíos se conservaron.
