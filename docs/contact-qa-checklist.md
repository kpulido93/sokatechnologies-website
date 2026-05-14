# Checklist QA de Contacto, WhatsApp y traduccion

Fecha de revision: 2026-05-14

## Estados

- `[x]` Verificado en archivos, enlace o entorno local.
- `[~]` Preparado o documentado; requiere configuracion manual en WordPress Admin para cierre definitivo.
- `[ ]` Pendiente de prueba real con plugin, correo, dispositivo o traduccion activa.

## WhatsApp

- [x] El boton abre WhatsApp Web en desktop. Verificado a nivel de enlace: `wa.me` responde con redireccion `302` hacia `api.whatsapp.com/send`.
- [ ] El boton abre WhatsApp en movil. Pendiente de prueba en dispositivo movil real despues de aplicar contenido en WordPress.
- [x] El numero no tiene `+`, espacios ni guiones en el enlace: `573107482865`.
- [x] El mensaje aparece prellenado. La URL decodifica el mensaje aprobado.
- [x] El boton usa `target="_blank"`.
- [x] El boton usa `rel="noopener noreferrer"`.

## Formulario

- [~] El formulario tiene campos obligatorios claros. El bloque de Contacto ya no muestra campos falsos; `docs/contact-form.md` documenta la configuracion real.
- [~] El correo destino es `info@sokatechnologies.com`. Documentado como destino publico; falta configurarlo en Fluent Forms Lite.
- [ ] El mensaje de confirmacion funciona. Pendiente hasta crear el formulario real.
- [ ] El usuario recibe feedback despues de enviar. Pendiente hasta crear el formulario real.
- [x] No se piden datos sensibles. El contenido y la guia excluyen contrasenas, tokens, llaves privadas, backups, dumps SQL y datos sensibles.
- [~] Existe checkbox de confidencialidad. Preparado como campo requerido de privacidad/confidencialidad; falta crearlo en Fluent Forms Lite.
- [ ] Se probo envio real. Pendiente de crear el formulario real, configurar SMTP y ejecutar prueba manual.
- [ ] El correo no cae en spam. Pendiente de configuracion SMTP, SPF, DKIM, DMARC y prueba de entregabilidad.

## Pagina Contacto

- [x] Hero claro.
- [x] CTA principal visible. El formulario de diagnostico queda como canal principal y el CTA final mantiene accion de contacto.
- [x] CTA de WhatsApp visible.
- [x] No hay placeholders publicos visibles de correo o WhatsApp pendientes. El placeholder temporal aprobado es `[fluentform id="PENDIENTE"]` hasta crear el formulario real.
- [x] No hay scroll horizontal en la revision responsive local.
- [x] Se ve bien en movil en la revision responsive local.
- [x] La nota de confidencialidad esta visible.

## Traduccion

- [x] Plugin elegido: TranslatePress.
- [x] Idioma principal ES.
- [x] Idioma secundario EN.
- [x] Selector visible. El header incluye selector pasivo `ES | EN` sin enlaces a URLs no publicadas.
- [ ] Menu traducido. Pendiente de activar TranslatePress y traducir desde WordPress Admin.
- [ ] Contacto traducido. Pendiente de activar TranslatePress.
- [ ] Servicios traducido. Pendiente de activar TranslatePress.
- [ ] Footer traducido. Pendiente de activar TranslatePress.
- [ ] URLs EN probadas. Pendiente hasta que exista `/en/` en WordPress.

## Pruebas ejecutadas

- Revision de enlaces `wa.me` en `content/contacto.html`, `content/home.html` y `wp-theme/sokatechnologies-child-theme/parts/footer.html`.
- Verificacion HTTP del enlace de WhatsApp con `curl.exe -I`.
- Decodificacion del mensaje prellenado para confirmar el texto aprobado.
- Revision de atributos `target="_blank"` y `rel="noopener noreferrer"`.
- Revision de placeholders publicos con busqueda en `content/`, `wp-theme/`, `docs/` y `scripts/`.
- Verificacion de WP-CLI e instalacion local de `fluentform` version `6.2.2`.
- Aplicacion local de la pagina Contacto al post `contacto` mediante WP-CLI y API de WordPress.
- Verificacion HTTP `200 OK` en `http://127.0.0.1:8088/contacto/`.
- Verificacion en navegador local: titulo de shortcode visible, mockup anterior ausente y CTA de WhatsApp visible.
- Revision responsive local en desktop, tablet y movil.

## Pendientes de cierre

- Crear el formulario real en Fluent Forms Lite desde WordPress Admin.
- Configurar campos requeridos, checkbox, confirmacion y notificaciones.
- Probar clic real en WhatsApp desde movil.
- Configurar SMTP y validar entregabilidad.
- Instalar TranslatePress manualmente desde WordPress Admin.
- Traducir Inicio, Servicios, Contacto y footer.
- Probar URLs `/en/` cuando existan.
