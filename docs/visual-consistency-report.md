# Reporte de consistencia visual

Fecha: 2026-05-14

## Alcance

Este reporte revisa solo los archivos permitidos del tema local `public_html/wp-content/themes/sokatechnologies/` y la documentacion visual asociada.

No se leyo ni modifico `public_html/wp-config.php`, `wp-admin/`, `wp-includes/`, `wp-content/uploads/`, `wp-content/plugins/`, archivos `.env`, backups ni dumps SQL.

## Resumen del estado visual

- El tema se declara como `SokaTechnologies`, version `1.2.0`, con `Template: twentytwentyfive`.
- `functions.php` carga `assets/css/corporate.css` en frontend con `wp_enqueue_style` y tambien en editor con `add_editor_style`.
- `theme.json` define una base sobria: system sans, paleta azul/ink/mist, layout `760px`/`1180px` y botones redondeados.
- `corporate.css` contiene estilos reales para header, hero, secciones, tarjetas, CTAs, footer, formularios, paginas internas y responsive.
- La documentacion visual ya describe el uso manual de clases `.soka-*` desde el editor de bloques.
- Las plantillas actuales usan una parte del sistema visual; varias clases nuevas estan preparadas para uso futuro en contenido o plantillas, pero todavia no aparecen en templates.

## Clases `.soka-*` disponibles

Total detectado en CSS: 78 clases.

### Layout, paginas y secciones

- `soka-container`
- `soka-section`
- `soka-section-light`
- `soka-section--soft`
- `soka-section--dark`
- `soka-section-heading`
- `soka-section-compact`
- `soka-page-header`
- `soka-page-title`
- `soka-page-content-wrap`
- `soka-page-main`
- `soka-content-block`
- `soka-content-narrow`
- `soka-content-medium`
- `soka-internal-hero`
- `soka-internal-hero__content`
- `soka-404`
- `soka-404__actions`

### Hero, CTA y botones

- `soka-hero`
- `soka-hero-grid`
- `soka-hero-copy`
- `soka-hero-panel`
- `soka-hero-visual`
- `soka-button`
- `soka-button--primary`
- `soka-button--secondary`
- `soka-button-row`
- `soka-dark-cta`
- `soka-cta-inner`
- `soka-cta-copy`
- `soka-cta-band`
- `soka-cta-card`
- `soka-final-cta`
- `soka-page-cta`
- `soka-page-cta-copy`

### Tarjetas, servicios, casos y confianza

- `soka-card-grid`
- `soka-card-grid-2`
- `soka-card`
- `soka-card-featured`
- `soka-card__icon`
- `soka-card__title`
- `soka-card__text`
- `soka-card__list`
- `soka-card__link`
- `soka-case-card`
- `soka-case-card__tag`
- `soka-trust-grid`
- `soka-trust-item`
- `soka-benefit`
- `soka-benefit-grid`
- `soka-service-list`
- `soka-check-list`
- `soka-process`
- `soka-process-step`
- `soka-metric`
- `soka-metric-row`
- `soka-warning-note`

### Formularios

- `soka-form`
- `soka-form__grid`
- `soka-form__field`
- `soka-form__field--full`
- `soka-form__actions`
- `soka-form__privacy`

### Header, footer y texto auxiliar

- `soka-site-header`
- `soka-site-header__inner`
- `soka-primary-nav`
- `soka-site-footer`
- `soka-footer-grid`
- `soka-footer-title`
- `soka-footer-note`
- `soka-eyebrow`
- `soka-kicker`
- `soka-lead`
- `soka-muted`
- `soka-dashboard-card`
- `soka-dashboard-label`
- `soka-signal-list`

## Clases usadas en templates

### `templates/front-page.html`

- `soka-front-page`
- `soka-hero`
- `soka-hero-grid`
- `soka-hero-copy`
- `soka-eyebrow`
- `soka-button-row`
- `soka-hero-visual`
- `soka-dashboard-card`
- `soka-dashboard-label`
- `soka-signal-list`
- `soka-section`
- `soka-section-light`
- `soka-section-heading`
- `soka-kicker`
- `soka-lead`
- `soka-card-grid`
- `soka-card`
- `soka-card-featured`
- `soka-dark-cta`
- `soka-cta-inner`
- `soka-cta-copy`

### `templates/page.html`

- `soka-page-shell`
- `soka-page-header`
- `soka-page-title`
- `soka-page-content-wrap`
- `soka-page-cta`
- `soka-page-cta-copy`
- `soka-kicker`

### `parts/header.html`

- `soka-site-header`
- `soka-site-header__inner`
- `soka-primary-nav`

### `parts/footer.html`

- `soka-site-footer`
- `soka-footer-grid`
- `soka-footer-title`
- `soka-footer-note`

## Clases definidas pero no usadas en templates

Estas clases existen en CSS, pero no aparecen directamente en los templates/parts revisados. No todas son problemas: muchas parecen preparadas para bloques manuales en el editor o futuras plantillas.

- `soka-404`
- `soka-404__actions`
- `soka-benefit`
- `soka-benefit-grid`
- `soka-button`
- `soka-button--primary`
- `soka-button--secondary`
- `soka-card__icon`
- `soka-card__link`
- `soka-card__list`
- `soka-card__text`
- `soka-card__title`
- `soka-card-grid-2`
- `soka-case-card`
- `soka-case-card__tag`
- `soka-check-list`
- `soka-container`
- `soka-content-block`
- `soka-content-medium`
- `soka-content-narrow`
- `soka-cta-band`
- `soka-cta-card`
- `soka-final-cta`
- `soka-form`
- `soka-form__actions`
- `soka-form__field`
- `soka-form__field--full`
- `soka-form__grid`
- `soka-form__privacy`
- `soka-hero-panel`
- `soka-internal-hero`
- `soka-internal-hero__content`
- `soka-metric`
- `soka-metric-row`
- `soka-muted`
- `soka-page-main`
- `soka-problem-list`
- `soka-process`
- `soka-process-step`
- `soka-section-compact`
- `soka-section--dark`
- `soka-section--soft`
- `soka-service-list`
- `soka-trust-grid`
- `soka-trust-item`
- `soka-warning-note`

## Clases usadas pero sin regla directa propia

- `soka-front-page`
- `soka-page-shell`

Ambas se usan como wrappers de template. No tienen regla directa en `corporate.css`; esto no rompe nada necesariamente, pero reduce claridad si se esperan estilos de shell o anchura.

## Riesgos de CSS global

- Hay reglas globales sobre `*`, `html`, `body`, encabezados, `a`, `button:focus-visible` y `::selection`. Son utiles como base, pero tienen mayor alcance que las clases `.soka-*`.
- `.wp-block-button__link` se estiliza globalmente, por lo que todos los botones de WordPress reciben sombra, borde y hover aunque no tengan clase `.soka-button`.
- `.wp-block-navigation` y elementos de navegacion reciben estilos globales, no solo dentro de `soka-primary-nav`.
- `footer.wp-block-template-part` y sus descendientes reciben reglas amplias que pueden afectar cualquier footer de template part.
- Hay dos familias de tokens visuales: legacy (`--soka-blue`, `--soka-border`) y nueva (`--soka-color-primary`, `--soka-color-border`). Funcionan, pero conviene evitar mas duplicacion.
- La paleta del `theme.json` y la guia visual no coinciden exactamente en todos los valores: por ejemplo `#DCE5EF` vs `#CBD5E1`, `#08111F` vs `#07111F`, `#10B981` vs `#14B8A6`.
- `soka-section` se define en dos zonas del CSS; por cascada gana la definicion mas reciente con `--soka-section-padding`.
- La clase historica `soka-section-light` se usa en templates, mientras que la documentacion reciente recomienda `soka-section--soft`.
- `soka-internal-hero`, `soka-final-cta`, formularios y 404 estan preparados en CSS/documentacion, pero no hay templates que los apliquen todavia.
- La regla `footer.wp-block-template-part .wp-block-navigation li:has(a[href="#"])` depende de `:has()`. Es razonable en navegadores modernos, pero conviene revisar compatibilidad si se apunta a navegadores antiguos.

## Recomendaciones de proximos cambios pequenos

1. Crear una tarea pequena para decidir si `soka-front-page` y `soka-page-shell` deben tener estilos propios o si deben quedar solo como wrappers semanticos.
2. Migrar gradualmente `soka-section-light` hacia `soka-section--soft` o documentar que ambas clases son validas.
3. Revisar si los estilos globales de `.wp-block-button__link` deben acotarse a `.soka-*` o mantenerse como estilo base del sitio.
4. Alinear tokens entre `theme.json`, `docs/visual-style-guide.md` y `corporate.css`, especialmente bordes, texto secundario e ink/petrol.
5. Aplicar `soka-internal-hero`, `soka-content-block` y `soka-final-cta` en una pagina interna piloto antes de tocar todas las paginas.
6. Preparar una futura tarea separada para plantilla 404, usando solo `soka-404` y `soka-404__actions`, sin modificar contenido sensible.
7. Crear una revision visual manual con capturas en Home, Servicios, Contacto y una pagina interna usando movil, tablet y desktop.

## Archivos que NO deben tocarse

- `public_html/wp-config.php`
- `public_html/wp-admin/`
- `public_html/wp-includes/`
- `public_html/wp-content/uploads/`
- `public_html/wp-content/plugins/`
- Archivos `.env`
- Backups
- Dumps SQL
- Credenciales, tokens y llaves privadas
- `.cpanel.yml`, salvo aprobacion explicita
- WordPress core
- Tema padre y plugins de terceros
- Produccion
