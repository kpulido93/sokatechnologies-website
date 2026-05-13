# WordPress Security

## Objetivo

Definir controles mínimos de seguridad para la web pública de SokaTechnologies en WordPress/cPanel.

## Principios

- Reducir riesgo, no asumir seguridad perfecta.
- Mantener WordPress, temas y plugins actualizados.
- Usar contraseñas fuertes.
- Limitar accesos.
- Evitar plugins innecesarios.
- Configurar backups.
- No exponer errores en producción.
- No subir secretos al repositorio.

## Controles mínimos

### Accesos

- Usar usuario administrador no obvio.
- Usar contraseña fuerte.
- Activar 2FA si el plugin o hosting lo permite.
- No compartir usuarios personales.
- Eliminar usuarios innecesarios.
- Asignar roles mínimos.

### WordPress

- Mantener WordPress actualizado.
- Mantener tema padre actualizado.
- Mantener child theme bajo control de versiones.
- Mantener plugins actualizados.
- Eliminar temas no usados.
- Eliminar plugins no usados.
- Desactivar editor de archivos desde WordPress si aplica.

### Hosting / cPanel

- SSL activo.
- PHP actualizado y soportado por el hosting.
- `display_errors` desactivado en producción.
- Backups configurados.
- Permisos de archivos revisados.
- Acceso al cPanel limitado.

### Archivos sensibles

No versionar:

- `wp-config.php`
- `.env`
- Backups.
- Dumps SQL.
- Logs con datos sensibles.
- Credenciales.
- Tokens.
- Llaves privadas.

### Formularios

- Usar protección anti-spam.
- No pedir datos innecesarios.
- Validar campos.
- Evitar guardar información sensible.
- Probar envío de correos.
- Documentar integración SMTP si se usa.

## Checklist rápido

- [ ] SSL activo.
- [ ] WordPress actualizado.
- [ ] Plugins actualizados.
- [ ] Tema padre actualizado.
- [ ] Plugins innecesarios eliminados.
- [ ] Temas innecesarios eliminados.
- [ ] Usuarios revisados.
- [ ] Backups activos.
- [ ] `display_errors` apagado en producción.
- [ ] No hay secretos en el repo.
- [ ] No hay datos sensibles en contenido público.