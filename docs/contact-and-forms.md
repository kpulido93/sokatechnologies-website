# Contacto y formularios

## Objetivo

Definir como se manejara el contacto comercial en la web WordPress de SokaTechnologies antes de publicar en hosting cPanel.

Este documento solo contiene recomendaciones y placeholders seguros. No incluye credenciales, no instala plugins y no configura produccion.

## Reglas de seguridad

- No incluir correos, telefonos, credenciales ni tokens reales sin aprobacion.
- No guardar contrasenas SMTP en el repositorio.
- No tocar `public_html/wp-config.php`.
- No modificar base de datos desde este documento.
- No editar plugins directamente.
- No publicar formularios hasta validar privacidad, anti-spam y entregabilidad.
- No pedir informacion sensible que no sea necesaria para una primera conversacion comercial.

## Datos de contacto pendientes

Antes de publicar hay que definir y aprobar:

| Dato | Placeholder seguro | Estado |
|---|---|---|
| Email comercial publico | `[Definir correo comercial]` | Pendiente |
| WhatsApp comercial publico | `[Definir WhatsApp comercial]` | Pendiente |
| Email interno de notificaciones | `[Definir email interno de notificaciones]` | Pendiente |
| Responsable de responder leads | `[Definir responsable comercial]` | Pendiente |
| Horario de atencion | `[Definir horario de atencion]` | Pendiente |
| Paises de atencion | `Panama, Republica Dominicana y Latinoamerica` | Revisar |
| URL de politica de privacidad | `[Definir URL de politica de privacidad]` | Pendiente |
| Proveedor SMTP | `[Definir proveedor SMTP]` | Pendiente |

## Placeholders para desarrollo local

Usar estos textos mientras el sitio siga en local:

- Email visible: `[Definir correo comercial]`
- WhatsApp visible: `[Definir WhatsApp comercial]`
- CTA de contacto: `Solicitar diagnostico`
- Destinatario interno: `[Definir email interno de notificaciones]`
- Politica de privacidad: `[Definir URL de politica de privacidad]`
- Mensaje legal corto: `[Texto de privacidad pendiente de aprobacion]`

No reemplazar estos placeholders por datos reales hasta que esten aprobados para publicacion.

## Recomendacion de plugin de formularios

Recomendacion principal: **Fluent Forms Lite**.

Motivo:

- Tiene constructor visual para formularios sin escribir codigo.
- Incluye campos suficientes para un formulario B2B inicial.
- Permite notificaciones por email.
- Tiene opciones anti-spam como reCAPTCHA, hCaptcha o Turnstile.
- Es compatible con bloques/Gutenberg y formularios responsive.
- Permite mantener el formulario fuera del tema, facilitando cambios desde el admin de WordPress.

Alternativa simple: **Contact Form 7**.

Usarlo si se prefiere una solucion mas minima y conocida. Es menos comodo para administracion visual, pero puede servir para un formulario sencillo. Su configuracion base no almacena datos personales en la base de datos, lo que puede ser util si se quiere reducir retencion inicial.

Decision recomendada para SokaTechnologies:

- Usar **Fluent Forms Lite** para el formulario comercial inicial.
- No activar integraciones externas, pagos, archivos adjuntos ni automatizaciones hasta aprobarlas.
- Documentar el plugin elegido en `docs/plugins.md` antes de produccion.

Referencias oficiales:

- Fluent Forms en WordPress.org: <https://wordpress.org/plugins/fluentform/>
- Contact Form 7 en WordPress.org: <https://wordpress.org/plugins/contact-form-7/>

## Campos minimos del formulario

| Campo | Tipo sugerido | Requerido | Nota |
|---|---|---:|---|
| Nombre | Texto | Si | Nombre de la persona que solicita contacto. |
| Empresa | Texto | Si | Ayuda a calificar el lead B2B. |
| Email | Email | Si | Canal principal de respuesta. |
| Telefono | Telefono/texto | No | Opcional; no bloquear el envio si no se completa. |
| Pais | Selector | Si | Usar lista simple o campo texto controlado. |
| Servicio de interes | Selector | Si | Ver opciones sugeridas abajo. |
| Mensaje | Area de texto | Si | Pedir contexto del problema, no informacion sensible. |

Opciones sugeridas para `Servicio de interes`:

- Software a medida.
- Automatizaciones.
- Sitio web corporativo WordPress.
- Integraciones.
- Dashboards y reportes.
- Infraestructura cloud/on-prem.
- Soporte y mantenimiento.
- No estoy seguro; necesito orientacion.

## Campos que no debemos pedir inicialmente

No pedir en el primer formulario:

- Contrasenas.
- Usuarios de sistemas internos.
- Tokens, API keys o llaves privadas.
- Datos bancarios o tarjetas.
- Documentos de identidad.
- Contratos o documentos legales como adjuntos.
- Acceso a cPanel, hosting, servidores o repositorios.
- Dumps SQL, backups o archivos de produccion.
- Informacion detallada de infraestructura sensible.
- Datos personales de terceros.
- Presupuesto exacto obligatorio.

Si un prospecto necesita compartir informacion sensible, debe hacerse por un canal aprobado y despues de una conversacion inicial.

## Mensaje de confirmacion

Texto recomendado despues de enviar el formulario:

```text
Gracias por contactar a SokaTechnologies. Recibimos tu solicitud y revisaremos la informacion para responder con el siguiente paso. Si el caso requiere una reunion de diagnostico, te contactaremos por el canal indicado.
```

No prometer tiempos de respuesta especificos hasta que el equipo defina un SLA comercial.

## Email de notificacion interna

Destinatario:

```text
[Definir email interno de notificaciones]
```

Asunto sugerido:

```text
Nuevo contacto web - [Servicio de interes] - [Empresa]
```

Contenido minimo de la notificacion:

- Nombre.
- Empresa.
- Email.
- Telefono, si fue informado.
- Pais.
- Servicio de interes.
- Mensaje.
- URL de origen del formulario.
- Fecha y hora del envio.

No enviar credenciales ni adjuntos desde el formulario.

## Reglas anti-spam

Configuracion recomendada antes de publicar:

- Activar honeypot si el plugin lo permite.
- Activar reCAPTCHA, hCaptcha o Cloudflare Turnstile solo despues de revisar privacidad y proveedor.
- Limitar campos abiertos al minimo necesario.
- No permitir adjuntos en el formulario inicial.
- Validar email y campos requeridos.
- Evitar que el formulario acepte HTML o scripts en el mensaje.
- Revisar si el plugin permite bloqueo por frecuencia o rate limiting.
- Revisar periodicamente envios sospechosos.
- No guardar IPs u otros datos tecnicos salvo que sea necesario y este cubierto por la politica de privacidad.

## Recomendacion de SMTP

WordPress no debe depender solo de `mail()` de PHP para mensajes comerciales importantes.

Recomendacion inicial:

- Evaluar **WP Mail SMTP** para configurar entrega de correos desde el admin de WordPress.
- Usar un proveedor aprobado: correo del dominio, Microsoft 365, Google Workspace, Brevo, SendGrid, SMTP2GO u otro definido por SokaTechnologies.
- Configurar SPF, DKIM y DMARC en DNS antes de produccion.
- Enviar una prueba de correo antes de activar el formulario.
- No guardar credenciales SMTP en el repositorio.
- No documentar usuario, servidor, contrasena, tokens ni API keys.
- No editar `wp-config.php` para guardar credenciales desde este flujo.

Referencia oficial:

- WP Mail SMTP en WordPress.org: <https://wordpress.org/plugins/wp-mail-smtp/>

## Texto breve de privacidad

Texto sugerido junto al boton de envio:

```text
Usaremos la informacion enviada para responder tu solicitud comercial y coordinar una posible reunion de diagnostico. No compartiremos estos datos con terceros salvo obligacion legal o proveedores necesarios para operar el sitio. Al enviar el formulario aceptas ser contactado por SokaTechnologies en relacion con tu consulta.
```

Antes de produccion, este texto debe ser revisado contra la politica de privacidad final y las jurisdicciones aplicables.

## Checklist antes de activar en produccion

- [ ] Email comercial publico aprobado.
- [ ] WhatsApp comercial aprobado o removido si no se usara.
- [ ] Email interno de notificaciones aprobado.
- [ ] Responsable de responder leads definido.
- [ ] Plugin de formulario aprobado y documentado en `docs/plugins.md`.
- [ ] Plugin SMTP aprobado y documentado en `docs/plugins.md`.
- [ ] Proveedor SMTP configurado desde WordPress/cPanel sin exponer credenciales.
- [ ] SPF, DKIM y DMARC revisados.
- [ ] Formulario creado con campos minimos.
- [ ] Campos sensibles excluidos.
- [ ] Mensaje de confirmacion validado.
- [ ] Notificacion interna probada.
- [ ] Anti-spam activado y probado.
- [ ] Politica de privacidad publicada o enlazada.
- [ ] Texto breve de privacidad visible junto al formulario.
- [ ] Prueba de envio realizada desde desktop y movil.
- [ ] Confirmado que no se guardaron secretos en el repo.
- [ ] Confirmado que no se modifico `public_html/wp-config.php`.
- [ ] Confirmado que no se tocaron plugins directamente ni base de datos fuera del admin.

## Pendientes antes de publicar

- Definir datos reales de contacto aprobados.
- Elegir formalmente plugin de formulario.
- Elegir formalmente proveedor SMTP.
- Confirmar si se almacenaran entradas en WordPress o solo se enviaran por email.
- Definir politica de retencion de leads.
- Revisar texto de privacidad con criterio legal/comercial.
