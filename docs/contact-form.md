# Guia de formulario de contacto

## Objetivo

Preparar el formulario funcional de diagnostico para la web WordPress local de SokaTechnologies sin tocar produccion, sin modificar WordPress core y sin guardar credenciales en el repositorio.

Entorno local permitido: `http://127.0.0.1:8088`.

## Estado local actual

- `WP-CLI` disponible con `wp --info`.
- `Fluent Forms Lite` (`fluentform`) disponible en el WordPress local.
- El formulario local se crea o reutiliza con [ensure-local-contact-form.ps1](/D:/repos/sokatechnologies-website/scripts/ensure-local-contact-form.ps1:1).
- La pagina versionada [contacto.html](/D:/repos/sokatechnologies-website/content/contacto.html:1) ya no muestra un mockup falso ni texto tecnico visible al usuario.
- El bloque real del formulario se inyecta al aplicar contenido local desde [apply-local-wordpress-pages.ps1](/D:/repos/sokatechnologies-website/scripts/apply-local-wordpress-pages.ps1:1) usando el token interno `%%SOKA_CONTACT_FORM_BLOCK%%`.

No se instalo ni modifico nada en produccion.

## Flujo local recomendado

1. Ejecutar `.\scripts\ensure-local-contact-form.ps1`.
2. Confirmar el `ID` y el shortcode devueltos por el script.
3. Ejecutar `.\scripts\apply-local-wordpress-pages.ps1 -Apply`.
4. Abrir `http://127.0.0.1:8088/contacto/`.
5. Enviar una prueba si el entorno local tiene correo saliente configurado.

## Que hace el script local

[ensure-local-contact-form.ps1](/D:/repos/sokatechnologies-website/scripts/ensure-local-contact-form.ps1:1):

- Verifica que `siteurl` y `home` sigan siendo `http://127.0.0.1:8088`.
- Instala y activa `fluentform` solo si falta en local y `WP-CLI` esta disponible.
- Reutiliza el formulario local administrado si ya existe.
- Si no existe, crea un formulario `Diagnostico comercial` con los campos definidos en esta guia.
- Marca el formulario con la meta local `_soka_local_contact_form=yes`.
- Devuelve el shortcode real para que el script de paginas lo inserte al aplicar `content/`.

## Como se inserta el shortcode en Contacto

El archivo versionado [contacto.html](/D:/repos/sokatechnologies-website/content/contacto.html:1) no guarda un ID duro de base de datos.

Usa este token interno:

```text
%%SOKA_CONTACT_FORM_BLOCK%%
```

[apply-local-wordpress-pages.ps1](/D:/repos/sokatechnologies-website/scripts/apply-local-wordpress-pages.ps1:1) lo reemplaza en local por el bloque real del formulario administrado, por ejemplo:

```text
<!-- wp:shortcode -->
[fluentform id="3"]
<!-- /wp:shortcode -->
```

Si el formulario local no existe todavia, el script ya no inserta un placeholder tecnico. En su lugar aplica un bloque honesto para usuario final:

```text
Formulario en configuración. Escríbenos por WhatsApp o correo para solicitar diagnóstico.
```

En ese caso, ejecutar `.\scripts\ensure-local-contact-form.ps1` y volver a aplicar las paginas si se quiere recuperar el formulario principal.

## Campos del formulario

Campos requeridos:

- Nombre
- Empresa
- Correo comercial
- Pais
- Servicio de interes
- Contexto general del caso
- Aceptacion de privacidad y confidencialidad

Campos opcionales:

- WhatsApp
- Herramientas actuales
- Resultado esperado
- Urgencia

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

## Texto de confidencialidad

Texto visible junto al formulario y alineado con el checkbox de aceptacion:

```text
No compartas contraseñas, tokens, llaves privadas, respaldos, bases de datos ni información sensible. Si el caso requiere revisar información privada, primero definiremos alcance, canal seguro y condiciones de manejo.
```

## Mensaje de confirmacion

Configurado para el envio exitoso:

```text
Gracias por contactar a SokaTechnologies. Revisaremos tu caso y te responderemos en horario de atención.
```

## Notificacion interna

Destino configurado para la notificacion del formulario:

```text
info@sokatechnologies.com
```

Notas:

- No guardar contrasenas SMTP en el repositorio.
- No documentar usuarios SMTP, servidores SMTP, API keys ni tokens.
- La entrega real del correo depende de la configuracion de correo saliente del WordPress local.
- `reply-to` queda apuntando al campo `Correo comercial`.

## Configuracion manual desde WordPress Admin

Si hace falta recrearlo sin script o revisar el formulario:

1. Entrar a WordPress Admin local.
2. Ir a **Fluent Forms > Forms**.
3. Crear un formulario nuevo en blanco.
4. Nombrarlo `Diagnostico comercial`.
5. Agregar los campos definidos en esta guia.
6. Configurar el mensaje de confirmacion.
7. Configurar la notificacion interna hacia `info@sokatechnologies.com`.
8. No habilitar adjuntos en la primera version.
9. Copiar el shortcode real.
10. Si se decide usar el flujo manual permanente, actualizar el token en el contenido aplicando el shortcode real por el script local o documentando el nuevo proceso.

## Reglas de seguridad

- No aceptar adjuntos en la primera version.
- No pedir contrasenas, tokens, llaves privadas ni accesos.
- No pedir backups, dumps SQL ni bases de datos.
- No pedir datos sensibles de clientes o terceros.
- Validar campos requeridos.
- Revisar que los campos de texto no acepten HTML o scripts.
- Si se agrega anti-spam, revisar antes su impacto de privacidad.

## Checklist de validacion

- [x] `WP-CLI` responde en local.
- [x] `fluentform` esta disponible en el entorno local.
- [x] Existe un script local para crear o reutilizar el formulario sin tocar produccion.
- [x] Contacto ya no muestra un formulario falso.
- [x] Existe un punto claro para insertar el shortcode real sin fijar un ID duro en `content/`.
- [ ] El formulario fue probado con envio real en este entorno.
- [ ] La notificacion llega a `info@sokatechnologies.com`.
- [ ] El correo saliente del entorno local esta verificado.

## Comandos utiles

```powershell
wp --info
wp plugin list
.\scripts\ensure-local-contact-form.ps1
.\scripts\apply-local-wordpress-pages.ps1 -Apply
git diff
```
