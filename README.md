# SokaTechnologies Website

Repositorio de documentación, child theme, assets, snippets y checklists para la web pública de SokaTechnologies en WordPress/cPanel.

## Propósito

Este repositorio NO contiene una instalación completa de WordPress.

Se usa para versionar únicamente:

- Documentación técnica y operativa.
- Estructura de contenido del sitio.
- Child theme personalizado.
- Assets propios de marca.
- Snippets CSS/PHP revisables.
- Checklists de instalación, seguridad y despliegue.
- Guías para mantenimiento del sitio.

## Contexto

La web pública de SokaTechnologies será construida en WordPress usando cPanel.

El hosting cuenta con herramientas como:

- WordPress Management / WP Toolkit.
- Softaculous.
- MySQL.
- phpMyAdmin.
- MultiPHP Manager.
- Git Version Control.
- SSL/TLS.
- Backups.

## Qué se versiona

- `docs/`: documentación del sitio.
- `child-theme/`: tema hijo personalizado.
- `snippets/`: fragmentos CSS/PHP documentados.
- `assets/`: recursos de marca y elementos visuales propios.
- `checklists/`: listas de verificación para instalación, seguridad y despliegue.

## Qué NO se versiona

- WordPress core.
- Plugins instalados desde WordPress.
- Temas de terceros completos.
- `wp-config.php`.
- Credenciales.
- Tokens.
- Backups reales.
- Dumps de base de datos.
- Archivos del cPanel.
- Archivos subidos por usuarios en `uploads/`.

## Flujo recomendado

1. Crear cambios en rama separada.
2. Revisar diff.
3. Probar en ambiente local o staging si existe.
4. Subir manualmente el child theme o archivos específicos.
5. Validar en WordPress antes de tocar producción.
6. Documentar cambios importantes.

## Reglas

- No incluir secretos.
- No incluir datos del cPanel.
- No subir `wp-config.php`.
- No tocar producción directamente desde Codex.
- No usar `.cpanel.yml` sin estrategia de despliegue aprobada.
- Mantener cambios pequeños y revisables.
- Priorizar seguridad, simplicidad y mantenimiento.

## Documentación principal

- `docs/wordpress-setup.md`
- `docs/content-structure.md`
- `docs/plugins.md`
- `docs/security.md`
- `docs/deployment-checklist.md`

## Child theme

El child theme base está en:

```text
child-theme/sokatechnologies-child/

Antes de instalarlo, confirmar el tema padre y ajustar el campo Template en style.css.

Mantenimiento

Cada cambio relevante debe indicar:

Qué cambió.
Qué archivos se modificaron.
Cómo probar.
Riesgos.
Si requiere acción manual en WordPress/cPanel.