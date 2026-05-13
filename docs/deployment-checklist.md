# Deployment Checklist

## Objetivo

Definir un checklist seguro para pasar cambios del repositorio al sitio WordPress en cPanel.

## Regla principal

No usar despliegue automático hacia producción hasta tener una estrategia aprobada.

No crear `.cpanel.yml` sin aprobación explícita.

## Qué se puede desplegar manualmente

- Child theme.
- CSS custom.
- Assets propios.
- Snippets revisados.
- Documentación no pública, si aplica.

## Qué no se despliega desde este repo

- WordPress core.
- `wp-config.php`.
- Plugins completos de terceros.
- Tema padre completo.
- Backups.
- Base de datos.
- Uploads.
- Credenciales.

## Flujo recomendado

1. Crear rama de trabajo.
2. Hacer cambios pequeños.
3. Revisar diff.
4. Validar localmente si aplica.
5. Crear zip del child theme si aplica.
6. Subir a WordPress en ambiente de prueba o staging.
7. Validar páginas principales.
8. Validar responsive.
9. Validar que no hay errores PHP.
10. Validar que no se afectó el admin.
11. Hacer backup antes de producción.
12. Aplicar cambio en producción manualmente.
13. Documentar resultado.

## Checklist antes de producción

- [ ] Backup reciente disponible.
- [ ] Cambio revisado por diff.
- [ ] No hay secretos.
- [ ] No hay `wp-config.php`.
- [ ] No hay dumps SQL.
- [ ] No hay datos de cPanel.
- [ ] Child theme validado.
- [ ] CSS revisado en móvil.
- [ ] Formularios probados si aplica.
- [ ] SSL activo.
- [ ] Plugins actualizados.
- [ ] Tema padre actualizado.
- [ ] Rollback definido.

## Rollback

Opciones:

- Revertir PR.
- Restaurar versión anterior del child theme.
- Desactivar child theme y activar tema padre temporalmente.
- Restaurar backup del hosting si aplica.

## Notas sobre Git en cPanel

cPanel permite configurar despliegues mediante `.cpanel.yml`, pero este archivo puede enviar archivos hacia directorios productivos. No usarlo hasta aprobar una estrategia segura.