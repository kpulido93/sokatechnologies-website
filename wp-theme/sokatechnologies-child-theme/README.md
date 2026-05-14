# Tema SokaTechnologies

Tema hijo corporativo para la web publica de SokaTechnologies en WordPress.

## Objetivo

Este tema define una base visual sobria para una empresa B2B de soluciones operativas. Su funcion es mantener estilos, paleta, layout y clases reutilizables para contenido creado con bloques Gutenberg.

No reemplaza WordPress core, no modifica plugins y no debe copiar codigo del tema padre.

## Tema padre

- Tema padre: `twentytwentyfive`
- Campo requerido en `style.css`: `Template: twentytwentyfive`

El tema padre debe estar instalado en WordPress antes de activar este tema hijo.

## Archivos principales

- `style.css`: cabecera del tema hijo.
- `functions.php`: carga `assets/css/corporate.css` y `assets/css/soka-brand.css`.
- `theme.json`: paleta, tipografia system sans, layout y estilos base.
- `assets/css/corporate.css`: clases corporativas para bloques.
- `assets/css/soka-brand.css`: tokens y clases de marca reutilizables con prefijo `.soka-`.
- `patterns/`: reservado para patrones propios.
- `parts/`: reservado para partes propias.

## CSS de marca

El CSS de marca vive en:

```text
assets/css/soka-brand.css
```

`functions.php` lo encola con `wp_enqueue_style` usando el handle `sokatechnologies-brand`, con dependencia de `sokatechnologies-corporate`. La version se calcula con `filemtime()` mediante `soka_asset_version()`, por lo que los cambios locales del archivo invalidan cache de forma controlada.

La misma hoja tambien se registra como editor style para que el editor de bloques pueda reflejar las clases de marca cuando el tema hijo este activo.

## Clases CSS disponibles

- `soka-theme`
- `soka-theme--light`
- `soka-theme--white`
- `soka-theme--dark`
- `soka-theme--petroleum`
- `soka-button`
- `soka-button--primary`
- `soka-button--secondary`
- `soka-button--dark`
- `soka-button--ghost`
- `soka-section`
- `soka-section--white`
- `soka-section--light`
- `soka-section--dark`
- `soka-section--petroleum`
- `soka-section-light`
- `soka-hero`
- `soka-hero__inner`
- `soka-hero__content`
- `soka-hero__actions`
- `soka-hero-grid`
- `soka-hero-copy`
- `soka-hero-panel`
- `soka-card-grid`
- `soka-card-grid--two`
- `soka-card-grid-2`
- `soka-card`

Los grids de tarjetas usan un patron responsive 3/2/1: maximo 3 columnas en desktop, 2 en tablet y 1 en movil.
- `soka-card__icon`
- `soka-card__kicker`
- `soka-card__title`
- `soka-card__text`
- `soka-card__action`
- `soka-card-featured`
- `soka-form`
- `soka-form__row`
- `soka-form__field`
- `soka-form__label`
- `soka-form__control`
- `soka-form__actions`
- `soka-dark-cta`
- `soka-button-row`
- `soka-eyebrow`
- `soka-muted`
- `soka-kicker`
- `soka-process`
- `soka-process-step`
- `soka-service-list`
- `soka-metric-row`
- `soka-metric`
- `soka-page-header`
- `soka-content-narrow`
- `soka-warning-note`

## Aplicar contenido local

El contenido versionado vive en:

```text
content/wordpress/
```

Para aplicarlo en WordPress local:

```powershell
cd D:\repos\sokatechnologies-website
.\scripts\apply-local-wordpress-pages.ps1
```

El script valida primero que `siteurl` y `home` sean exactamente `http://sokatech.local`. Si no coinciden, se detiene sin modificar WordPress.

## Checklist de revision visual

- [ ] El tema hijo `SokaTechnologies` esta activo.
- [ ] En el HTML publico aparece la hoja `soka-brand.css`.
- [ ] `sokatechnologies-brand` carga despues de `sokatechnologies-corporate`.
- [ ] Una seccion con clase `soka-theme soka-section` muestra tokens de color y tipografia.
- [ ] Un enlace o boton con `soka-button soka-button--primary` usa azul `#2563EB` y hover `#1D4ED8`.
- [ ] Una tarjeta con `soka-card` mantiene borde suave, fondo blanco y responsive correcto.
- [ ] La portada muestra el hero y CTAs principales.
- [ ] Las paginas `servicios`, `soluciones`, `sobre-nosotros` y `contacto` cargan sin errores.
- [ ] El contenido es legible en escritorio y movil.
- [ ] Las tarjetas no se superponen ni cortan texto.
- [ ] Los botones apuntan a rutas internas correctas.
- [ ] El administrador de WordPress sigue funcionando.
- [ ] No hay errores PHP visibles.

## Validacion manual en WordPress

1. Activar el tema hijo desde Apariencia.
2. Abrir la Home en una ventana sin sesion de administrador.
3. Verificar en el inspector del navegador que carga:

```text
/wp-content/themes/sokatechnologies-child-theme/assets/css/soka-brand.css
```

4. Aplicar temporalmente clases `.soka-` a un bloque de prueba en el editor, por ejemplo `soka-theme soka-section`.
5. Confirmar que el front y el editor no muestran errores visibles.
6. Revisar desktop, tablet y movil.
7. Confirmar que el admin sigue accesible y sin estilos alterados.
8. Retirar cualquier bloque de prueba si no forma parte del contenido final.

## Checklist antes de produccion

- [ ] Confirmar canal comercial publico antes de publicar.
- [ ] Revisar contenido legal y privacidad antes de publicar textos definitivos.
- [ ] Confirmar que no hay datos reales de clientes.
- [ ] Confirmar que no hay secretos, backups, SQL, tokens ni archivos `.env`.
- [ ] Hacer backup fuera del repositorio antes de migrar cambios.
- [ ] Validar que no se editaron temas oficiales ni plugins de terceros.

## Advertencia

No editar temas oficiales de WordPress como `twentytwentyfive`, `twentytwentyfour` o `twentytwentythree`. Cualquier personalizacion debe vivir en este tema hijo o en contenido versionado revisable.
