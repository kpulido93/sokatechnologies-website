# Despliegue

## Estado actual

El despliegue se plantea para WordPress gestionado desde cPanel. Este repositorio no despliega automáticamente ni contiene configuración productiva.

## Alcance del repositorio

- Mantener el child theme y snippets revisables.
- Documentar pasos manuales de instalación, actualización y rollback.
- Conservar checklists de seguridad y publicación.
- Evitar credenciales, rutas reales y datos de producción.

## Flujo recomendado

1. Preparar o actualizar archivos en el repositorio.
2. Revisar el diff y validar que no incluye secretos ni WordPress core.
3. Probar el child theme en staging o entorno local.
4. Subir únicamente los archivos necesarios al WordPress autorizado.
5. Activar o verificar cambios desde el panel de WordPress.
6. Ejecutar el checklist de `docs/deployment-checklist.md`.

## Pendientes por decidir

- Existencia de staging gestionado por WP Toolkit.
- Método exacto para transferir el child theme al hosting.
- Responsables de aprobación y publicación.
- Política de rollback y retención de backups.
