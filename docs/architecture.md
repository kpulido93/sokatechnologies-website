# Arquitectura Base

## Objetivo

Definir una base simple para mantener una web pública corporativa en WordPress sin versionar la instalación completa.

## Principios

- WordPress y cPanel son la plataforma operativa; el repositorio conserva solo documentación y personalizaciones controladas.
- El child theme debe ser pequeño y depender del tema padre real instalado en WordPress.
- Los cambios de contenido, plugins y configuración se documentan antes de aplicarse en producción.
- La configuración sensible vive fuera del repositorio.

## Estructura principal

- `docs`: guías y decisiones de mantenimiento.
- `child-theme/sokatechnologies-child`: child theme mínimo.
- `snippets`: fragmentos revisables para CSS y PHP.
- `assets`: recursos de marca y medios aprobados.
- `checklists`: comprobaciones operativas.

## Fuera de alcance

- WordPress core.
- Plugins instalados.
- Tema padre.
- Base de datos.
- `wp-config.php`.
- Uploads, backups y configuración real del hosting.

## Decisiones abiertas

- Tema padre definitivo.
- Plugin de formularios, SEO, seguridad y caché.
- Flujo exacto de staging, revisión y publicación.
- Política final de analítica, cookies y privacidad.
