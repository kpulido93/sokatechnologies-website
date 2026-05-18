# Implementacion de marca en WordPress local

Esta guia documenta el estado real de la marca de SokaTechnologies en el repo y en el WordPress local `http://127.0.0.1:8088`.

## Estado actual

- El header usa el isotipo real `S` modular junto al texto `SokaTechnologies`.
- El footer usa el mismo isotipo para mantener consistencia con el header.
- El favicon local sale por fallback del tema, no por `site_icon` de WordPress.
- El fallback del tema ya no sirve el PNG pesado de `1254x1254` como favicon principal.
- En el entorno local, `wp option get site_icon` devuelve `0`.

## Assets disponibles hoy

| Asset | Ruta | Formato | Peso aprox. | Uso actual |
|---|---|---|---:|---|
| Isotipo modular `S` | `assets/logos/isotipo-sokatechnologies-s-modular.webp` | WebP | 68 KB | Marca visual en header y footer |
| Favicon fuente | `assets/icons/favicon-sokatechnologies.png` | PNG | 915 KB | Fuente maestra cuadrada, no servida como favicon principal |
| Favicon 32 | `assets/icons/favicon-32x32.png` | PNG | liviano | `rel="icon"` principal del fallback del tema |
| Favicon 180 | `assets/icons/favicon-180x180.png` | PNG | liviano | `rel="apple-touch-icon"` |
| Favicon 192 | `assets/icons/favicon-192x192.png` | PNG | liviano | icono adicional para navegadores/dispositivos |
| Favicon 512 | `assets/icons/favicon-512x512.png` | PNG | liviano | candidato recomendado para `Site Icon` y schema fallback |
| Favicon ICO | `assets/icons/favicon.ico` | ICO | liviano | `rel="shortcut icon"` |
| Imagen OG por defecto | `assets/brand/og-sokatechnologies-default.webp` | WebP | 43 KB | Open Graph local |

## Copias usadas por el tema

- `public_html/wp-content/themes/sokatechnologies/assets/images/isotipo-sokatechnologies-s-modular.webp`
- `public_html/wp-content/themes/sokatechnologies/assets/icons/favicon-32x32.png`
- `public_html/wp-content/themes/sokatechnologies/assets/icons/favicon-180x180.png`
- `public_html/wp-content/themes/sokatechnologies/assets/icons/favicon-192x192.png`
- `public_html/wp-content/themes/sokatechnologies/assets/icons/favicon-512x512.png`
- `public_html/wp-content/themes/sokatechnologies/assets/icons/favicon.ico`
- `wp-theme/sokatechnologies-child-theme/assets/images/isotipo-sokatechnologies-s-modular.webp`
- `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-32x32.png`
- `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-180x180.png`
- `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-192x192.png`
- `wp-theme/sokatechnologies-child-theme/assets/icons/favicon-512x512.png`
- `wp-theme/sokatechnologies-child-theme/assets/icons/favicon.ico`

## Assets faltantes o mejorables

Hoy no existe en el repo un lockup horizontal final en formato ideal. Siguen faltando:

- `logo-horizontal-dark.svg`
- `logo-horizontal-light.svg`
- `logo-horizontal-dark.png` como fallback raster ligero
- `isotipo-sokatechnologies-s-modular.svg`

El set de favicon optimizado ya existe. El PNG grande original se mantiene solo como fuente maestra en `assets/icons/favicon-sokatechnologies.png`.

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
- Assets servidos por el fallback:
  - `/wp-content/themes/sokatechnologies/assets/icons/favicon-32x32.png`
  - `/wp-content/themes/sokatechnologies/assets/icons/favicon-180x180.png`
  - `/wp-content/themes/sokatechnologies/assets/icons/favicon-192x192.png`
  - `/wp-content/themes/sokatechnologies/assets/icons/favicon.ico`

La salida del tema inserta:

- `rel="icon"` con `sizes="32x32"`
- `rel="icon"` con `sizes="192x192"`
- `rel="shortcut icon"` apuntando a `favicon.ico`
- `rel="apple-touch-icon"` con `sizes="180x180"`

Si en el futuro se configura `site_icon` desde WordPress, ese valor pasara a tener prioridad y el fallback del tema dejara de emitirse.

## Configuracion manual opcional del Site Icon

No hace falta para que el favicon funcione hoy en local, pero estos son los pasos exactos si se quiere mover la configuracion al admin de WordPress cuando exista un PNG final optimizado.

### Opcion admin local

1. Abrir `http://127.0.0.1:8088/wp-admin/customize.php?autofocus[section]=title_tagline`
2. Entrar en `Identidad del sitio`.
3. Buscar `Icono del sitio`.
4. Subir `assets/icons/favicon-512x512.png` o una variante final equivalente de `512x512`.
5. Confirmar recorte si WordPress lo pide.
6. Publicar los cambios.

### Opcion WP-CLI local

1. Importar el PNG final:

```powershell
wp media import ..\assets\icons\favicon-512x512.png --title="SokaTechnologies Site Icon"
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
- Confirmar que el favicon del HTML apunta a los assets optimizados en `assets/icons/`.
- Confirmar que el HTML ya no sirve `favicon-sokatechnologies.png` de `1254x1254` como favicon principal.
- Confirmar que no se toca `wp-admin`, `wp-includes`, core ni plugins.
- Confirmar que el layout del header sigue estable en desktop y movil.

## Proximo paquete de assets recomendado

1. Exportar lockup horizontal final en SVG para fondos claros.
2. Exportar variante clara para footer o fondos oscuros.
3. Evaluar si hace falta un alias `apple-touch-icon.png` adicional por compatibilidad o tooling externo.
4. Configurar `site_icon` real en WordPress cuando convenga mover la gestion al admin.
