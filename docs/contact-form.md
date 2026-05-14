# Guia de formulario de contacto

## Objetivo

Preparar el formulario funcional de contacto para la web WordPress local de SokaTechnologies sin tocar produccion, sin modificar WordPress core y sin guardar credenciales en el repositorio.

Entorno local permitido: `http://127.0.0.1:8088`.

## Plugin usado

Plugin: **Fluent Forms Lite** (`fluentform`).

Estado local revisado:

- WP-CLI disponible con `wp --info`.
- `fluentform` no estaba instalado al iniciar la tarea.
- Instalacion local realizada con WP-CLI contra `public_html`.
- Plugin activo en local: `fluentform` version `6.2.2`.

No se instalo nada en produccion.

## Creacion del formulario

Fluent Forms Lite expone WP-CLI como `wp fluentform`, pero en este entorno solo ofrece comandos de licencia y estadisticas. No hay un comando oficial disponible para crear formularios completos por CLI.

Por esa razon, el formulario debe crearse manualmente desde WordPress Admin para no escribir directamente en tablas internas del plugin.

Ruta sugerida:

1. Entrar a WordPress Admin local.
2. Ir a **Fluent Forms > Forms**.
3. Crear un formulario nuevo en blanco.
4. Nombrarlo `Diagnostico comercial`.
5. Agregar los campos definidos en este documento.
6. Configurar confirmacion, notificacion por correo y anti-spam desde la interfaz del plugin.
7. Guardar el formulario.
8. Copiar el shortcode generado por Fluent Forms.

## Ubicacion en Contacto

La pagina versionada `content/contacto.html` ya no muestra un mockup de formulario como si fuera funcional.

El bloque preparado usa temporalmente este placeholder:

```text
[fluentform id="PENDIENTE"]
```

Cuando el formulario real exista, reemplazar `PENDIENTE` por el ID real del formulario.

## Como obtener el shortcode

Desde WordPress Admin local:

1. Abrir **Fluent Forms > Forms**.
2. Ubicar el formulario `Diagnostico comercial`.
3. Copiar el shortcode mostrado por el plugin, por ejemplo:

```text
[fluentform id="3"]
```

4. Editar la pagina **Contacto**.
5. Sustituir `[fluentform id="PENDIENTE"]` por el shortcode real.
6. Actualizar la pagina y probar el envio.

## Campos del formulario

Campos requeridos para la primera version:

| Campo | Tipo sugerido | Requerido | Nota |
| --- | --- | ---: | --- |
| Nombre | Texto | Si | Persona que solicita contacto. |
| Empresa | Texto | Si | Contexto comercial B2B. |
| Correo comercial | Email | Si | Canal principal de respuesta. |
| WhatsApp | Telefono/texto | Si | Canal secundario de contacto. |
| Pais | Texto o selector | Si | Pais donde opera la empresa. |
| Servicio de interes | Selector | Si | Clasifica la solicitud. |
| Contexto general del caso | Area de texto | Si | Describe problema, proceso o necesidad. |
| Herramientas actuales | Area de texto | Si | Sistemas, hojas, sitio web, hosting, CRM, ERP u otras herramientas usadas hoy. |
| Resultado esperado | Area de texto | Si | Resultado que la empresa busca lograr. |
| Aceptacion de privacidad y confidencialidad | Checkbox | Si | Debe estar marcado antes de enviar. |

## Servicios

Opciones del campo `Servicio de interes`:

- Software a medida
- Automatizaciones e integraciones
- Sitio web WordPress corporativo
- Dashboards y reportes
- Infraestructura cloud/on-prem
- Soporte y mantenimiento
- Diagnostico inicial
- No estoy seguro todavia

## Correo destino

Correo destino para notificaciones del formulario:

```text
info@sokatechnologies.com
```

Reglas:

- No guardar contrasenas SMTP en el repositorio.
- No documentar usuarios SMTP, servidores SMTP, API keys ni tokens.
- Configurar credenciales o proveedor SMTP solo desde WordPress Admin/cPanel en el entorno aprobado.
- Probar entregabilidad antes de publicar.

Asunto sugerido:

```text
Nuevo contacto web - {Servicio de interes} - {Empresa}
```

Contenido minimo de la notificacion:

- Nombre.
- Empresa.
- Correo comercial.
- WhatsApp.
- Pais.
- Servicio de interes.
- Contexto general del caso.
- Herramientas actuales.
- Resultado esperado.
- URL de origen.
- Fecha y hora del envio.

## Mensaje de confirmacion

Configurar este mensaje despues del envio:

```text
Gracias por contactar a SokaTechnologies. Revisaremos tu caso y te responderemos en horario de atención.
```

## Texto de confidencialidad

Texto visible junto al checkbox o antes del boton de envio:

```text
No compartas contraseñas, tokens, llaves privadas, respaldos, bases de datos ni información sensible. Si el caso requiere revisar información privada, primero definiremos alcance, canal seguro y condiciones de manejo.
```

## Reglas de seguridad del formulario

- No aceptar adjuntos en la primera version.
- No pedir contrasenas, tokens, llaves privadas ni accesos.
- No pedir backups, dumps SQL ni bases de datos.
- No pedir datos sensibles de clientes o terceros.
- Activar honeypot si esta disponible.
- Activar reCAPTCHA, hCaptcha o Turnstile solo despues de revisar privacidad y proveedor.
- Validar campos requeridos.
- Revisar que los campos de texto no acepten HTML o scripts.

## Checklist de configuracion

- [x] Fluent Forms Lite instalado y activo en local.
- [ ] Formulario `Diagnostico comercial` creado desde WordPress Admin.
- [ ] Campos requeridos configurados.
- [ ] Campo WhatsApp agregado como canal secundario.
- [ ] Campo de aceptacion de privacidad y confidencialidad agregado.
- [ ] Texto de confidencialidad visible.
- [ ] Mensaje de confirmacion configurado.
- [ ] Notificacion interna configurada hacia `info@sokatechnologies.com`.
- [ ] Anti-spam revisado.
- [ ] Adjuntos desactivados.
- [ ] Shortcode real copiado desde Fluent Forms.
- [ ] `[fluentform id="PENDIENTE"]` reemplazado por el shortcode real.

## Checklist de prueba

- [ ] Abrir `http://127.0.0.1:8088/contacto/`.
- [ ] Confirmar que la pagina Contacto no muestra un formulario falso.
- [ ] Confirmar que el bloque de shortcode esta visible o preparado para el formulario real.
- [ ] Enviar una prueba desde desktop.
- [ ] Enviar una prueba desde movil.
- [ ] Confirmar que los campos requeridos bloquean envios incompletos.
- [ ] Confirmar que el mensaje de confirmacion aparece despues del envio.
- [ ] Confirmar que la notificacion llega a `info@sokatechnologies.com`.
- [ ] Confirmar que el correo no expone credenciales ni datos sensibles.
- [ ] Confirmar que no se aceptan adjuntos.
- [ ] Confirmar que el sitio sigue navegable.
- [ ] Confirmar que WhatsApp sigue visible como canal secundario.
- [ ] Confirmar que no se modifico `public_html/wp-config.php`.
- [ ] Confirmar que no se documentaron credenciales, tokens ni datos privados.

## Pendientes antes de produccion

- Crear el formulario real desde WordPress Admin.
- Sustituir el placeholder por el shortcode real.
- Revisar texto legal contra la politica de privacidad final.
- Configurar SMTP desde WordPress/cPanel sin guardar secretos en el repositorio.
- Probar entregabilidad real de correos.
- Revisar anti-spam elegido y su impacto de privacidad.
