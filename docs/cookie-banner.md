# Banner de cookies

## Plugin activo

- Plugin detectado en local: `cookieadmin` (`CookieAdmin - Cookie Consent Banner`, version `1.2.0`).
- Sitio local usado para pruebas: `http://127.0.0.1:8088`.

## Donde se configura

CookieAdmin mezcla tres fuentes:

- Defaults del plugin en `public_html/wp-content/plugins/cookieadmin/assets/cookie/policies.php`.
- Overrides guardados en base de datos en las opciones `cookieadmin_law`, `cookieadmin_consent_settings` y `cookieadmin_settings`.
- Ajustes visuales del child theme en [`wp-theme/sokatechnologies-child-theme/assets/css/corporate.css`](D:/repos/sokatechnologies-website/wp-theme/sokatechnologies-child-theme/assets/css/corporate.css).

Hallazgo local:

- Solo existia `cookieadmin_settings` con `block_scripts=true`.
- `cookieadmin_law` y `cookieadmin_consent_settings` no estaban creadas, por lo que el banner caia a los textos por defecto en ingles.

## Cambio aplicado en local

Se aplico una configuracion local segura con `WP-CLI` para:

- Forzar `GDPR`.
- Mantener `Notice Type = Box`.
- Cambiar `Notice Position = Bottom Right`.
- Mantener `Preference Position = Center`.
- Traducir el titulo, el texto principal y los botones principales al espanol.

Comando reproducible:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\configure-local-cookie-banner.ps1
```

Ese script solo modifica la base local bajo `public_html/`.

## Pasos manuales exactos en WordPress Admin

Si se prefiere hacerlo sin `WP-CLI`, en el admin local:

1. Abrir `CookieAdmin > Consent Form`.
2. En `Consent Type`, elegir `GDPR`.
3. En `Notice Type`, elegir `Box`.
4. En `Notice Position`, elegir `Bottom Right`.
5. En `Preference Position`, elegir `Center`.
6. En `Title`, escribir `Respetamos tu privacidad`.
7. En `Notice Text`, usar este texto provisional:

```text
Usamos cookies para funciones básicas, medición y mejora del sitio. Puedes elegir qué cookies permitir en Personalizar. Pulsa Aceptar todo para permitir cookies no esenciales o Rechazar para mantenerlas desactivadas.
```

8. En `Button Settings`, usar:
   - `Customize` -> `Personalizar`
   - `Reject All` -> `Rechazar`
   - `Accept All` -> `Aceptar todo`
   - `Save Preferences` -> `Guardar preferencias`
9. En `Preference Content`, usar:
   - `Title` -> `Personaliza tus preferencias de cookies`
   - `Privacy Notice` -> texto provisional breve en espanol acorde a la politica real
10. Guardar con `Save Settings`.

## Branding de tercero

- La opcion `Hide Powered by Link` existe en `CookieAdmin > Settings`.
- En el plugin libre aparece marcada como funcionalidad `Pro`.
- No se oculta por CSS ni por codigo para no saltarse la licencia del proveedor.
- El child theme solo reduce su peso visual para que no robe demasiada atencion.

## Compactacion visual aplicada

El child theme ajusta el banner para que ocupe menos espacio sin romper el consentimiento:

- ancho maximo controlado en desktop;
- padding mas contenido;
- botones mas compactos;
- `Aceptar todo` y `Rechazar` comparten fila;
- `Personalizar` baja como accion secundaria;
- branding visible pero menos dominante;
- ancho seguro en movil sin tapar tanto contenido.

## Traduccion adicional del front-end

El child theme agrega un filtro en [`wp-theme/sokatechnologies-child-theme/functions.php`](D:/repos/sokatechnologies-website/wp-theme/sokatechnologies-child-theme/functions.php) para traducir cadenas fijas de CookieAdmin que no quedan bien cubiertas solo con la configuracion del admin, por ejemplo:

- categorias del modal;
- etiquetas auxiliares;
- `Powered by`.

El filtro se limita al front-end y no modifica el plugin.

## Validacion recomendada

1. Borrar la cookie `cookieadmin_consent` o abrir ventana privada.
2. Abrir `/` y `/contacto/` en desktop.
3. Repetir en viewport movil de `390px`.
4. Confirmar:
   - titulo y botones en espanol;
   - banner visible pero no dominante;
   - no tapa CTA principal mas de lo razonable;
   - branding sigue visible;
   - `Personalizar` abre el modal sin desbordes.

## Pendientes

- Revisar el texto legal final del banner y del modal con la politica real de cookies.
- Completar enlaces reales a politica de privacidad y politica de cookies si se publican.
