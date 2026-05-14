# WordPress Security

## Objetivo

Definir controles minimos de seguridad para la web publica de SokaTechnologies en WordPress/cPanel.

## Principios

- Reducir superficie de ataque.
- Mantener WordPress, temas y plugins actualizados.
- Usar contrasenas fuertes y accesos nominales.
- Limitar permisos.
- Evitar plugins innecesarios.
- Configurar backups.
- No exponer errores en produccion.
- No subir secretos al repositorio.

## Checklist de seguridad basica

### Accesos

- [ ] Usar usuarios nominales, sin cuentas compartidas.
- [ ] Usar contrasenas fuertes.
- [ ] Activar 2FA si el hosting o plugin aprobado lo permite.
- [ ] Asignar roles minimos.
- [ ] Revisar o eliminar usuarios inactivos.
- [ ] Evitar nombres de usuario obvios para administracion.

### WordPress

- [ ] Mantener WordPress actualizado.
- [ ] Mantener tema padre actualizado.
- [ ] Mantener plugins actualizados.
- [ ] Eliminar plugins no usados.
- [ ] Eliminar temas no usados.
- [ ] Desactivar editor de archivos desde WordPress si la politica del sitio lo permite.
- [ ] Revisar que no haya errores visibles en produccion.

### Hosting/cPanel

- [ ] SSL activo.
- [ ] PHP en version soportada.
- [ ] `display_errors` desactivado en produccion.
- [ ] Backups configurados.
- [ ] Restauracion de backup verificada cuando sea posible.
- [ ] Permisos de archivos revisados.
- [ ] Acceso a cPanel limitado a personas autorizadas.

### Formularios

- [ ] Proteccion anti-spam activa.
- [ ] Campos minimos necesarios.
- [ ] Validacion de campos.
- [ ] Envio de correos probado.
- [ ] SMTP documentado sin credenciales.
- [ ] No guardar informacion sensible innecesaria.

### Repositorio

- [ ] No hay `wp-config.php`.
- [ ] No hay `.env`.
- [ ] No hay backups.
- [ ] No hay dumps SQL.
- [ ] No hay credenciales.
- [ ] No hay tokens.
- [ ] No hay llaves privadas.
- [ ] No hay datos reales de cPanel.
- [ ] No hay datos reales de clientes.

## Archivos que nunca deben versionarse

- `wp-config.php`
- `.env`
- Backups.
- Dumps SQL.
- Logs con datos sensibles.
- Credenciales.
- Tokens.
- Llaves privadas.
- Exportaciones del sitio.
- Archivos subidos por usuarios.

## Pendientes

- Definir plugin o medida de seguridad aprobada.
- Definir politica de backups.
- Definir responsable de revision mensual.
- Definir proceso de respuesta ante incidentes.
