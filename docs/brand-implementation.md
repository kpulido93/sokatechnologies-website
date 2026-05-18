# Implementacion de marca en WordPress local

Esta guia documenta el estado real de la marca de SokaTechnologies en el repo y en el WordPress local `http://127.0.0.1:8088`.

## Estado actual

- El header usa el isotipo real `S` modular junto al texto `SokaTechnologies`.
- El footer usa el mismo isotipo para mantener consistencia con el header.
- El favicon local sale por fallback del tema, no por `site_icon` de WordPress.
- En el entorno local, `wp option get site_icon` devuelve `0`.

## Assets disponibles hoy

| Asset | Ruta | Formato | Peso aprox. | Uso actual |
|---|---|---|---:|---|
| Isotipo modular `S` | `assets/logos/isotipo-sokatechnologies-s-modular.webp` | WebP | 68 KB | Marca visual en header y footer |
| Favicon actual | `assets/icons/favicon-sokatechnologies.png` | PNG | 915 KB | Favicon fallback local |
| Imagen OG por defecto | `assets/brand/og-sokatechnologies-default.webp` | WebP | 43 KB | Open Graph local |

## Copias usadas por el tema

- `public_html/wp-content/themes/sokatechnologies/assets/images/isotipo-sokatechnologies-s-modular.webp`
- `public_html/wp-content/themes/sokatechnologies/assets/images/favicon-sokatechnologies.png`
- `wp-theme/sokatechnologies-child-theme/assets/images/isotipo-sokatechnologies-s-modular.webp`
- `wp-theme/sokatechnologies-child-theme/assets/images/favicon-sokatechnologies.png`

## Assets faltantes o mejorables

Hoy no existe en el repo un lockup horizontal final en formato ideal. Siguen faltando:

- `logo-horizontal-dark.svg`
- `logo-horizontal-light.svg`
- `logo-horizontal-dark.png` como fallback raster ligero
- `isotipo-sokatechnologies-s-modular.svg`
- `favicon-512.png` optimizado para Site Icon
- `apple-touch-icon.png` de `180x180`
- `favicon.ico` multiresolucion opcional

Tambien conviene reemplazar el PNG actual de favicon por una version optimizada. El archivo actual funciona, pero es demasiado pesado para su uso ideal como icono.

## Implementacion local aplicada

### Header

- Archivo: `public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css`
- Archivo versionado espejo: `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css`
- Estrategia: mantener el `site-title` de WordPress y reforzar el lockup visual con el isotipo real como marca previa al texto.

### Footer

- Archivo: `public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css`
- Archivo versionado espejo: `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css`
- Estrategia: usar el mismo isotipo real en `.soka-footer-title` para que la marca no quede solo como texto plano.

### Favicon local

- Archivo: `public_html/wp-content/themes/sokatechnologies/functions.php`
- Archivo versionado espejo: `wp-theme/sokatechnologies-child-theme/functions.php`
- Estado: activo mediante fallback del tema.
- URL local actual:
  - `/wp-content/themes/sokatechnologies/assets/images/favicon-sokatechnologies.png`

La salida del tema inserta:

- `rel="icon"`
- `rel="shortcut icon"`
- `rel="apple-touch-icon"`

Si en el futuro se configura `site_icon` desde WordPress, ese valor pasara a tener prioridad y el fallback del tema dejara de emitirse.

## Configuracion manual opcional del Site Icon

No hace falta para que el favicon funcione hoy en local, pero estos son los pasos exactos si se quiere mover la configuracion al admin de WordPress cuando exista un PNG final optimizado.

### Opcion admin local

1. Abrir `http://127.0.0.1:8088/wp-admin/customize.php?autofocus[section]=title_tagline`
2. Entrar en `Identidad del sitio`.
3. Buscar `Icono del sitio`.
4. Subir un PNG cuadrado idealmente de `512x512`.
5. Confirmar recorte si WordPress lo pide.
6. Publicar los cambios.

### Opcion WP-CLI local

1. Importar el PNG final:

```powershell
wp media import ..\assets\icons\favicon-sokatechnologies.png --title="SokaTechnologies Site Icon"
```

2. Tomar el ID del adjunto creado.
3. Asignarlo como `site_icon`:

```powershell
wp option update site_icon <ATTACHMENT_ID>
```

No ejecutar estos pasos en produccion desde este repo.

## Validacion recomendada

- Confirmar que el header muestra isotipo + texto sin deformacion.
- Confirmar que el footer usa el mismo isotipo.
- Confirmar que el favicon del HTML apunta al asset local correcto.
- Confirmar que no se toca `wp-admin`, `wp-includes`, core ni plugins.
- Confirmar que el layout del header sigue estable en desktop y movil.

## Proximo paquete de assets recomendado

1. Exportar lockup horizontal final en SVG para fondos claros.
2. Exportar variante clara para footer o fondos oscuros.
3. Generar `favicon-512.png` optimizado y `apple-touch-icon.png`.
4. Generar `favicon.ico` si se quiere compatibilidad adicional con navegadores antiguos.
