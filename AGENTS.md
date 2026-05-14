# AGENTS.md

## Rol de Codex

Codex actua como asistente tecnico para el repositorio `sokatechnologies-website`.

El trabajo debe limitarse a documentacion, child theme, assets, snippets, checklists y pruebas controladas en el entorno local `public_html/` para la web publica de SokaTechnologies en WordPress/cPanel.

## Objetivo del repositorio

Este repositorio versiona la parte controlada por SokaTechnologies para una web en WordPress. No debe contener una instalacion completa de WordPress.

Debe contener:

- Documentacion.
- Child theme propio.
- Assets propios.
- Snippets revisables.
- Checklists de seguridad.
- Checklists de instalacion y despliegue.
- Guias de configuracion.

## Reglas generales

Codex debe:

- Trabajar en tareas pequenas, claras y revisables.
- Presentar plan antes de cambios relevantes.
- Modificar solo archivos relacionados con la tarea.
- Usar placeholders seguros.
- Mantener documentacion clara y accionable.
- Explicar como validar cada cambio.
- Indicar riesgos y pendientes.

Codex no debe:

- Versionar WordPress core.
- Subir `wp-config.php`.
- Leer, imprimir o copiar contenido de `public_html/wp-config.php`.
- Subir credenciales, tokens, llaves privadas o backups.
- Subir dumps SQL o exportaciones de base de datos.
- Incluir datos reales de cPanel.
- Tocar produccion.
- Crear `.cpanel.yml` sin aprobacion explicita.
- Instalar plugins.
- Cambiar configuracion real de cPanel.
- Crear apps Next/React o dependencias de build innecesarias para este repo.
- Hacer cambios masivos sin plan previo.

## Reglas para `public_html/` local

`public_html/` puede existir dentro del repositorio como entorno local de ejecucion de WordPress. Esta carpeta debe seguir ignorada por Git y no es fuente versionada.

Codex puede modificar unicamente:

- `public_html/wp-content/themes/sokatechnologies/`
- `public_html/wp-content/themes/sokatechnologies/assets/`
- `content/`
- `website/`
- `docs/`
- `snippets/`
- `scripts/`

Todo cambio dentro de `public_html/` debe considerarse local y solo sirve para evaluar la web en `http://127.0.0.1:8088`.

Si un cambio del tema local debe conservarse, debe copiarse luego a `wp-theme/sokatechnologies-child-theme/` o documentarse como pendiente de migracion al child theme versionado.

Codex no debe tocar:

- `public_html/wp-config.php`
- `public_html/wp-admin/`
- `public_html/wp-includes/`
- `public_html/wp-content/uploads/`
- `public_html/wp-content/plugins/`, salvo instruccion explicita.
- Archivos `.sql`.
- Backups.
- Credenciales, tokens, llaves privadas o datos sensibles.

Codex no debe leer ni mostrar el contenido de `public_html/wp-config.php`.

No ejecutar despliegues a produccion desde `public_html/` ni desde ninguna automatizacion local.

## Seguridad

Reglas obligatorias:

- No incluir secretos.
- No incluir usuarios reales.
- No incluir contrasenas.
- No incluir tokens.
- No incluir llaves privadas.
- No incluir URLs internas sensibles.
- No incluir datos reales de clientes.
- No crear archivos `.env`.
- No subir archivos de backup.
- No subir exportaciones de base de datos.

Si Codex detecta un secreto, debe detenerse, no copiarlo y recomendar rotacion.

## Reglas para WordPress

Codex puede ayudar con:

- Documentacion.
- Child theme.
- CSS.
- Snippets PHP documentados.
- Checklists.
- Estructura de contenido.
- Recomendaciones de plugins.
- Guias de configuracion.

Codex no debe:

- Modificar WordPress core.
- Editar plugins de terceros.
- Editar tema padre directamente.
- Copiar funciones del tema padre sin revision.
- Crear snippets PHP riesgosos.
- Desactivar controles de seguridad.
- Proponer plugins innecesarios.
- Ejecutar acciones en produccion.

## Reglas para child theme

La ruta principal del child theme en esta estructura base es:

```text
wp-theme/sokatechnologies-child-theme/
```

El child theme debe:

- Tener `style.css`.
- Tener `functions.php`.
- Cargar CSS propio de forma segura.
- No copiar codigo del tema padre.
- Mantener personalizaciones pequenas.
- Documentar dependencias del tema padre.

El campo `Template` en `style.css` debe coincidir exactamente con el nombre de carpeta del tema padre instalado en WordPress.

Si existe una ruta previa como `child-theme/`, no moverla ni borrarla sin una tarea explicita de migracion.

El tema local `public_html/wp-content/themes/sokatechnologies/` puede usarse para evaluar cambios en `127.0.0.1:8088`, pero no reemplaza la fuente versionada del child theme.

## Estilo de codigo

Para CSS:

- Usar clases claras.
- Evitar `!important` salvo justificacion.
- Agrupar estilos por seccion.
- Mantener comentarios utiles.
- Evitar selectores fragiles.
- Priorizar responsive design.

Para PHP:

- Usar funciones con prefijo `soka_`.
- Evitar logica compleja en `functions.php`.
- Sanitizar y escapar datos si se imprimen.
- No hacer consultas directas innecesarias.
- No manejar credenciales.
- No romper el admin de WordPress.

## Validacion

Cada cambio debe indicar como validar:

- Que el child theme carga.
- Que CSS no rompe responsive.
- Que no hay errores PHP visibles.
- Que no se afecto el panel de administracion.
- Que el sitio sigue navegable.
- Que los formularios siguen funcionando si aplica.
- Que no hay datos sensibles.

## Documentacion principal

- `docs/wordpress-setup.md`
- `docs/content-structure.md`
- `docs/plugins.md`
- `docs/security.md`
- `docs/deployment-checklist.md`

Actualizar documentacion cuando cambie estructura de paginas, plugins recomendados, configuracion, seguridad, child theme, snippets o proceso de despliegue.

## Checklist antes de aceptar PR

- [ ] La PR resuelve una sola tarea o issue.
- [ ] No hay secretos.
- [ ] No hay datos de cPanel.
- [ ] No hay tokens.
- [ ] No hay `wp-config.php`.
- [ ] No se leyo ni mostro `public_html/wp-config.php`.
- [ ] No hay backups.
- [ ] No hay dumps SQL.
- [ ] No hay WordPress core.
- [ ] `public_html/` sigue ignorado por Git.
- [ ] No se versionaron cambios de `public_html/`.
- [ ] Los cambios locales del tema que deban conservarse se copiaron a `wp-theme/sokatechnologies-child-theme/`.
- [ ] No se creo `.cpanel.yml` sin aprobacion.
- [ ] No se edito tema padre.
- [ ] No se editaron plugins de terceros.
- [ ] El child theme es simple.
- [ ] La documentacion esta actualizada si aplica.
- [ ] El diff es pequeno y revisable.
