# Implementacion de marca en WordPress

La identidad visual de SokaTechnologies debe aplicarse de forma controlada, revisable y compatible con WordPress/cPanel. El objetivo es mantener una marca B2B tecnologica, sobria y clara sin convertir el repo en una instalacion completa de WordPress.

## Principios

- Tecnologia clara para operaciones empresariales reales.
- Estetica profesional, limpia, tecnica y confiable.
- Personalizaciones pequenas y revisables.
- Assets optimizados y con licencia clara.
- Ningun dato sensible en el repo.

## Que se puede versionar

- Documentacion en `docs/`.
- Checklists en `checklists/`.
- Assets propios en `assets/`.
- CSS revisable en `snippets/css/`.
- Snippets documentados en `snippets/`.
- Child theme en `wp-theme/sokatechnologies-child-theme/`.
- Contenido estructurado en `content/` o `website/`.

## Que no se debe versionar

- WordPress core.
- `public_html/wp-config.php`.
- `public_html/wp-admin/`.
- `public_html/wp-includes/`.
- `public_html/wp-content/uploads/`.
- Plugins de terceros.
- Backups.
- Dumps SQL.
- Credenciales, tokens, llaves privadas o datos reales de cPanel.
- `.env`.
- `.cpanel.yml` sin aprobacion explicita.

## Relacion entre carpetas

| Carpeta | Funcion |
|---|---|
| `assets/brand/` | Logos, isotipo, favicon e imagen Open Graph por defecto |
| `assets/web/` | Imagenes para paginas, servicios, casos, blog, contacto y errores |
| `assets/icons/` | Iconos SVG propios o aprobados |
| `snippets/css/` | CSS reusable para aplicar en WordPress o migrar al child theme |
| `wp-theme/sokatechnologies-child-theme/` | Fuente versionada del child theme |
| `docs/` | Guias de configuracion e implementacion |
| `checklists/` | Revision antes de subir o publicar cambios |

## Flujo recomendado

1. Preparar assets en `assets/` con nombres estables.
2. Optimizar imagenes antes de subirlas a WordPress.
3. Documentar cualquier decision visual relevante.
4. Probar CSS primero como snippet controlado o en entorno local.
5. Migrar CSS estable al child theme si debe conservarse.
6. Cargar assets manualmente desde WordPress cuando corresponda.
7. Revisar responsive, accesibilidad basica y ausencia de datos sensibles.

## Uso de CSS

- Usar clases con prefijo `.soka-`.
- Evitar selectores globales agresivos.
- Separar tokens, botones, tarjetas, formularios y secciones.
- No aplicar estilos al admin de WordPress.
- Mantener el CSS suficientemente simple para revisarlo en PR.

## Uso de assets

- Subir a WordPress solo versiones optimizadas.
- Conservar fuentes ligeras y aprobadas en el repo.
- No duplicar assets sin necesidad.
- No usar imagenes genericas que reduzcan confianza.
- No incluir pantallas reales ni datos de clientes.

## Validacion

- Confirmar que el child theme carga si se migra CSS.
- Confirmar que no hay errores PHP visibles.
- Confirmar que el admin de WordPress sigue funcionando.
- Confirmar que el sitio sigue navegable.
- Confirmar que formularios y CTAs no quedan tapados.
- Confirmar que no se tocaron core, plugins, uploads ni produccion.
