# Auditoria segura de estructura visual

Fecha: 2026-05-14

## Alcance revisado

Esta auditoria se hizo solo con los archivos permitidos en la tarea. No se recorrio una instalacion completa de WordPress y no se leyo `public_html/wp-config.php`.

Archivos locales revisados dentro de `public_html/`:

- `public_html/wp-content/themes/sokatechnologies/README.md`
- `public_html/wp-content/themes/sokatechnologies/style.css`
- `public_html/wp-content/themes/sokatechnologies/functions.php`
- `public_html/wp-content/themes/sokatechnologies/theme.json`
- `public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css`
- `public_html/wp-content/themes/sokatechnologies/templates/front-page.html`
- `public_html/wp-content/themes/sokatechnologies/templates/page.html`
- `public_html/wp-content/themes/sokatechnologies/parts/header.html`
- `public_html/wp-content/themes/sokatechnologies/parts/footer.html`

Archivos versionados revisados:

- `README.md`
- `AGENTS.md`
- `.gitignore`
- `wp-theme/sokatechnologies-child-theme/README.md`
- `wp-theme/sokatechnologies-child-theme/style.css`
- `wp-theme/sokatechnologies-child-theme/functions.php`

Los archivos permitidos bajo `child-theme/sokatechnologies-child/` no estan disponibles en el estado actual del arbol de trabajo.

## Resumen de rutas visuales detectadas

### `public_html/wp-content/themes/sokatechnologies/`

Ruta local de ejecucion para evaluar WordPress. Contiene un tema hijo llamado `SokaTechnologies`, con `Template: twentytwentyfive` y `Version: 1.2.0`.

Elementos visuales detectados:

- `style.css`: cabecera del tema hijo.
- `functions.php`: registra soporte de estilos de editor y encola `assets/css/corporate.css`.
- `theme.json`: define paleta, tipografia system sans, layout y estilos base.
- `assets/css/corporate.css`: CSS corporativo local para bloques.
- `templates/front-page.html`: portada con header, hero, secciones, tarjetas y CTA.
- `templates/page.html`: plantilla de pagina con header, contenido y CTA.
- `parts/header.html`: cabecera con navegacion.
- `parts/footer.html`: pie de pagina corporativo.

Esta ruta sirve para pruebas locales, pero no debe tratarse como fuente versionada principal.

### `child-theme/sokatechnologies-child/`

Ruta previa o historica mencionada en instrucciones. En el estado actual, los archivos permitidos de esta ruta no existen:

- `README.md`
- `style.css`
- `functions.php`
- `assets/css/soka-custom.css`

No se debe mover, borrar ni reconstruir esta ruta sin una tarea explicita de migracion.

### `wp-theme/sokatechnologies-child-theme/`

Ruta versionada recomendada por `README.md` y `AGENTS.md` como fuente principal del child theme. Contiene un tema hijo llamado `SokaTechnologies`, con `Template: twentytwentyfive` y `Version: 1.1.0`.

Elementos detectados:

- `README.md`: documenta el tema hijo, clases CSS y flujo local.
- `style.css`: cabecera del tema hijo.
- `functions.php`: registra soporte de estilos de editor y encola `assets/css/corporate.css`.

El archivo `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css` esta referenciado por `functions.php` y `README.md`, pero no se leyo en esta auditoria porque no estaba incluido en la lista de archivos permitidos.

## Tema que parece activo o principal

El tema que parece ser el principal para pruebas locales es:

```text
public_html/wp-content/themes/sokatechnologies/
```

Motivos:

- Existe como tema hijo instalable dentro de `public_html/wp-content/themes/`.
- Su `style.css` declara `Theme Name: SokaTechnologies`.
- Su `style.css` declara `Template: twentytwentyfive`.
- Incluye `theme.json`, plantillas, partes y CSS corporativo local.
- El `README.md` del tema describe su uso para la web publica.

No se puede confirmar que este tema este activo en WordPress sin consultar administracion, base de datos o configuracion de WordPress. Esa comprobacion queda fuera del alcance seguro de esta auditoria.

La fuente versionada recomendada para conservar cambios es:

```text
wp-theme/sokatechnologies-child-theme/
```

## Archivos CSS disponibles

CSS confirmado en los archivos permitidos:

- `public_html/wp-content/themes/sokatechnologies/style.css`: cabecera del tema local; no contiene ajustes visuales extensos.
- `public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css`: CSS corporativo local con variables, estilos base, header, navegacion, hero, secciones, tarjetas, botones, CTA, footer, helpers de editor y responsive.
- `wp-theme/sokatechnologies-child-theme/style.css`: cabecera del child theme versionado; no contiene ajustes visuales extensos.

CSS referenciado, pendiente de revisar en una tarea posterior si se autoriza:

- `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css`: ruta esperada para CSS corporativo versionado segun `functions.php` y `README.md`.

CSS no disponible en el estado actual:

- `child-theme/sokatechnologies-child/style.css`
- `child-theme/sokatechnologies-child/assets/css/soka-custom.css`

## Diferencia entre rutas

`public_html/wp-content/themes/sokatechnologies/` es el tema local dentro de una instalacion WordPress ignorada por Git. Es util para evaluar cambios en `http://127.0.0.1:8088`, pero cualquier cambio hecho ahi debe considerarse local y temporal hasta migrarlo a la fuente versionada.

`child-theme/sokatechnologies-child/` parece una ruta antigua. Los archivos permitidos no estan presentes actualmente. Debe tratarse como referencia historica o pendiente de migracion, no como ruta de trabajo activa.

`wp-theme/sokatechnologies-child-theme/` es la ruta canonica versionada indicada por la documentacion del repositorio. Debe ser la fuente principal para cambios conservables del child theme.

## Recomendacion de ruta canonica para CSS visual

Aplicar ajustes visuales conservables en:

```text
wp-theme/sokatechnologies-child-theme/assets/css/corporate.css
```

Motivo:

- Es la ruta esperada por el `functions.php` del child theme versionado.
- Es coherente con `README.md` y `AGENTS.md`, que indican que `wp-theme/sokatechnologies-child-theme/` es la fuente versionada.
- Evita depender de `public_html/`, que esta ignorado por Git y solo debe usarse como entorno local.

Para pruebas locales controladas, el CSS puede reflejarse en:

```text
public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css
```

Ese reflejo debe hacerse solo para evaluar en local y debe quedar documentado o copiado de vuelta a la ruta canonica antes de aceptar cambios.

## Riesgos detectados

- Hay divergencia de version entre el tema local (`Version: 1.2.0`) y el tema versionado (`Version: 1.1.0`).
- `public_html/` esta ignorado por Git; los cambios hechos ahi pueden no quedar versionados.
- La ruta antigua `child-theme/sokatechnologies-child/` no esta disponible en el estado actual, lo que puede generar confusion si se usa documentacion o prompts antiguos.
- No se confirmo el tema activo desde WordPress; solo se infiere por estructura de archivos permitidos.
- El tema depende de que el tema padre instalado sea exactamente `twentytwentyfive`.
- El CSS versionado esperado en `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css` no fue revisado en esta auditoria porque no estaba autorizado en la lista de lectura.
- Cualquier cambio visual hecho solo en `public_html/` puede quedar fuera del diff revisable.

## Archivos y rutas que NO deben tocarse

- `public_html/wp-config.php`
- `public_html/wp-admin/`
- `public_html/wp-includes/`
- `public_html/wp-content/uploads/`
- `public_html/wp-content/plugins/`
- `public_html/.htaccess`
- Archivos `.sql`
- Backups y exportaciones
- Archivos `.env`
- Credenciales, tokens y llaves privadas
- WordPress core
- Tema padre o temas oficiales de WordPress
- Plugins de terceros
- `.cpanel.yml`, salvo aprobacion explicita

## Proximas tareas recomendadas

1. Autorizar una auditoria acotada de `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css` para confirmar si existe y si esta sincronizado con el CSS local.
2. Comparar de forma controlada el tema local con la ruta canonica versionada, solo en archivos del child theme.
3. Definir si la version canonica debe subir de `1.1.0` a `1.2.0` despues de revisar el contenido real.
4. Aplicar futuros ajustes visuales primero en la ruta canonica versionada y reflejarlos despues en `public_html/` solo para pruebas locales.
5. Validar cada ajuste visual en `http://127.0.0.1:8088`, incluyendo escritorio, movil, navegacion, portada, paginas internas, admin de WordPress y ausencia de errores PHP visibles.
6. Mantener una comprobacion final de seguridad: sin secretos, sin `wp-config.php`, sin SQL, sin backups, sin archivos de cPanel y sin cambios en produccion.
