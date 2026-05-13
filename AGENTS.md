```markdown
# AGENTS.md

## 1. Rol de Codex

Actúa como asistente técnico para el repositorio `sokatechnologies-website`.

Tu función es ayudar a mantener documentación, child theme, assets, snippets y checklists para la web pública de SokaTechnologies en WordPress/cPanel.

Codex debe trabajar en tareas pequeñas, claras, seguras y revisables.

---

## 2. Objetivo del repositorio

Este repositorio sirve para versionar la parte controlada por SokaTechnologies de la web pública en WordPress.

El repositorio NO debe contener una instalación completa de WordPress.

Debe contener:

- Documentación.
- Child theme.
- Assets propios.
- Snippets revisables.
- Checklists de seguridad.
- Checklists de instalación y despliegue.
- Guías de configuración.

---

## 3. Contexto técnico

La web se construirá con WordPress en un hosting con cPanel.

Herramientas disponibles:

- WordPress Management / WP Toolkit.
- Softaculous.
- MySQL.
- phpMyAdmin.
- MultiPHP Manager.
- Git Version Control.
- SSL/TLS.
- Backups.

El repo no debe asumir acceso directo a producción.

---

## 4. Reglas generales

Codex debe:

- Trabajar en tareas pequeñas.
- Presentar plan antes de cambios relevantes.
- Modificar solo archivos relacionados con la tarea.
- Mantener el child theme simple.
- Mantener documentación clara y accionable.
- Usar placeholders seguros.
- Explicar cómo probar cada cambio.
- Indicar riesgos y pendientes.

Codex no debe:

- Versionar WordPress core.
- Subir `wp-config.php`.
- Subir credenciales.
- Subir tokens.
- Subir backups reales.
- Subir dumps de base de datos.
- Tocar producción.
- Crear `.cpanel.yml` sin aprobación explícita.
- Instalar plugins.
- Cambiar configuración real de cPanel.
- Hacer cambios masivos sin plan previo.

---

## 5. Seguridad

Reglas obligatorias:

- No incluir secretos.
- No incluir datos del cPanel.
- No incluir usuarios reales.
- No incluir contraseñas.
- No incluir tokens.
- No incluir llaves privadas.
- No incluir URLs internas sensibles.
- No incluir datos reales de clientes.
- No crear archivos `.env`.
- No subir archivos de backup.
- No subir exportaciones de base de datos.

Si Codex detecta un secreto, debe detenerse, no copiarlo y recomendar rotación.

---

## 6. Reglas para WordPress

Codex puede ayudar con:

- Documentación.
- Child theme.
- CSS.
- Snippets PHP documentados.
- Checklists.
- Estructura de contenido.
- Recomendaciones de plugins.
- Guías de configuración.

Codex no debe:

- Modificar WordPress core.
- Editar plugins de terceros.
- Editar tema padre directamente.
- Copiar funciones del tema padre sin revisión.
- Crear snippets PHP riesgosos.
- Desactivar seguridad.
- Proponer plugins innecesarios.
- Ejecutar acciones en producción.

---

## 7. Reglas para child theme

El child theme debe:

- Estar dentro de `child-theme/sokatechnologies-child/`.
- Tener `style.css`.
- Tener `functions.php`.
- Cargar CSS propio de forma segura.
- No copiar código del tema padre.
- Mantener personalizaciones pequeñas.
- Documentar dependencias del tema padre.

El campo `Template` en `style.css` debe coincidir exactamente con el nombre de carpeta del tema padre instalado en WordPress.

---

## 8. Estilo de código

Para CSS:

- Usar clases claras.
- Evitar `!important` salvo justificación.
- Agrupar estilos por sección.
- Mantener comentarios útiles.
- Evitar selectores frágiles.
- Priorizar responsive design.

Para PHP:

- Usar funciones con prefijo `soka_`.
- Evitar lógica compleja en `functions.php`.
- Sanitizar y escapar datos si se imprimen.
- No hacer consultas directas innecesarias.
- No manejar credenciales.
- No romper el admin de WordPress.

---

## 9. Pruebas y validación

Codex debe indicar cómo validar:

- Que el child theme carga.
- Que CSS no rompe responsive.
- Que no hay errores PHP visibles.
- Que no se afectó el panel de administración.
- Que el sitio sigue navegable.
- Que los formularios siguen funcionando si aplica.

Validaciones manuales esperadas:

- Revisar home.
- Revisar página de servicios.
- Revisar página de contacto.
- Revisar móvil.
- Revisar consola del navegador.
- Revisar logs si hay error.
- Confirmar que no hay datos sensibles.

---

## 10. Documentación

Actualizar documentación cuando cambie:

- Estructura de páginas.
- Plugins recomendados.
- Configuración.
- Seguridad.
- Child theme.
- Snippets.
- Proceso de despliegue.

Documentos principales:

- `docs/wordpress-setup.md`
- `docs/content-structure.md`
- `docs/plugins.md`
- `docs/security.md`
- `docs/deployment-checklist.md`

---

## 11. Cambios grandes

Codex no debe realizar cambios grandes sin plan.

Son cambios grandes:

- Cambiar tema padre.
- Rediseñar toda la web.
- Agregar múltiples snippets PHP.
- Crear `.cpanel.yml`.
- Proponer despliegue automático.
- Cambiar estructura completa del child theme.
- Agregar dependencias de build.
- Introducir librerías JS.
- Cambiar formularios o integraciones.

Para cambios grandes, Codex debe proponer fases pequeñas y esperar aprobación.

---

## 12. Formato esperado de respuesta

Antes de modificar:

```md
## Plan de trabajo

### Objetivo
[Objetivo concreto]

### Archivos a modificar
- [archivo]

### Cambios propuestos
- [cambio]

### Riesgos
- [riesgo]

### Validación
- [paso o comando]

Después de modificar:

## Resumen de cambios

### Archivos modificados
- [archivo]

### Qué cambió
- [cambio]

### Cómo validar
- [paso]

### Riesgos o pendientes
- [pendiente]

### Checklist
- [ ] No hay secretos.
- [ ] No se tocó producción.
- [ ] No se versionó WordPress core.
- [ ] El cambio es pequeño.
- [ ] La documentación fue actualizada si aplica.
13. Checklist antes de aceptar PR
 La PR resuelve una sola issue.
 No hay secretos.
 No hay datos de cPanel.
 No hay tokens.
 No hay wp-config.php.
 No hay backups.
 No hay dumps SQL.
 No hay WordPress core.
 No se creó .cpanel.yml sin aprobación.
 No se editó tema padre.
 No se editaron plugins de terceros.
 El child theme es simple.
 La documentación está actualizada.
 El diff es pequeño y revisable.