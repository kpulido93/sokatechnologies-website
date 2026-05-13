# WordPress Setup

## Objetivo

Documentar el proceso base para instalar y configurar la web pública de SokaTechnologies en WordPress usando cPanel.

## Alcance

Este documento cubre:

- Instalación inicial de WordPress.
- Configuración básica.
- Tema padre.
- Child theme.
- SSL.
- PHP.
- Backups.
- Primeras validaciones.

No incluye credenciales ni datos reales del cPanel.

## Herramientas esperadas

- WordPress Management / WP Toolkit.
- Softaculous.
- MySQL.
- phpMyAdmin.
- MultiPHP Manager.
- SSL/TLS.
- Backups.
- Git Version Control.

## Instalación recomendada

1. Ingresar a cPanel.
2. Confirmar dominio o subdominio.
3. Instalar WordPress usando WordPress Management o Softaculous.
4. Confirmar versión PHP compatible.
5. Activar SSL.
6. Configurar título del sitio.
7. Crear usuario administrador seguro.
8. Instalar tema padre aprobado.
9. Instalar child theme de SokaTechnologies.
10. Configurar enlaces permanentes.
11. Crear páginas base.
12. Revisar seguridad inicial.
13. Configurar backups.
14. Documentar decisiones.

## Configuración inicial de WordPress

- Site Title: `SokaTechnologies`
- Tagline: definir según posicionamiento comercial.
- Timezone: definir según operación.
- Permalinks: usar estructura amigable.
- Search engine visibility: permitir indexación solo cuando el sitio esté listo.
- Idioma: español inicialmente, salvo decisión comercial distinta.

## Tema padre

Tema padre pendiente de decisión.

Criterios:

- Ligero.
- Mantenido.
- Compatible con bloques.
- Compatible con buenas prácticas SEO.
- Sin exceso de funcionalidades innecesarias.
- Buena reputación.
- Actualizaciones frecuentes.

## Child theme

El child theme se encuentra en:

```text
child-theme/sokatechnologies-child/

Antes de instalar, ajustar en style.css:

Template: nombre-carpeta-tema-padre
Validaciones iniciales
WordPress carga correctamente.
SSL activo.
Admin accesible.
Tema padre activo.
Child theme activo.
No hay errores visibles.
No hay plugins innecesarios.
Backups configurados.
No se expone información sensible.
Pendientes
Definir tema padre.
Definir plugin de formularios.
Definir plugin SEO.
Definir plugin de seguridad.
Definir plugin de caché si el hosting lo permite.