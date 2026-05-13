# Checklist de Seguridad WordPress

## Accesos

- Usuarios nominales, sin cuentas compartidas.
- Contraseñas fuertes.
- 2FA habilitado si está disponible.
- Roles asignados con mínimo privilegio.
- Usuarios inactivos revisados o eliminados.

## Actualizaciones

- WordPress actualizado.
- Tema padre actualizado.
- Child theme probado después de cambios.
- Plugins actualizados y compatibles.
- Plugins inactivos eliminados.

## Configuración

- HTTPS activo y forzado.
- Backups activos y restauración verificada.
- Permisos de archivos revisados.
- Edición de archivos desde WordPress desactivada si la política del sitio lo permite.
- Formularios protegidos contra spam.

## Repositorio

- Sin `wp-config.php`.
- Sin backups, SQL, uploads ni WordPress core.
- Sin credenciales, tokens ni datos de cPanel.
- Sin `.cpanel.yml`.
- Snippets revisados y documentados antes de aplicar.
