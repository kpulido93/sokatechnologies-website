# SokaTechnologies Website

Repositorio con dos areas separadas para la presencia corporativa de SokaTechnologies:

- Una aplicacion Astro independiente, con Astro, TypeScript y GSAP, preparada en una rama de desarrollo para sustituir la web corporativa despues de su revision y autorizacion.
- Los elementos controlados de la web actual en WordPress/cPanel, que no constituyen una instalacion completa de WordPress.

Cada area debe trabajarse en su rama y flujo de pull requests correspondiente. Los cambios Astro no implican cambios directos en WordPress, cPanel ni produccion.

Puede existir una carpeta `public_html/` con una instalacion local de WordPress para pruebas en `http://127.0.0.1:8088`. Esa carpeta esta ignorada por Git y no forma parte de la fuente versionada.

## Contenido del repositorio

```text
/
├── src/                    # aplicacion Astro: paginas, componentes, datos, estilos y logica
├── public/                 # assets publicos de la aplicacion Astro
├── package.json            # dependencias y comandos de Astro
├── astro.config.mjs        # configuracion de la aplicacion Astro
├── content/
├── docs/
├── website/
├── wp-theme/
│   └── sokatechnologies-child-theme/
├── assets/
│   ├── logos/
│   ├── images/
│   └── icons/
├── snippets/
│   ├── css/
│   ├── js/
│   └── php/
├── scripts/
└── public_html/  # ignorado por Git; entorno local opcional
```

## Que se versiona

- Documentacion de configuracion y mantenimiento.
- Estructura de contenido del sitio.
- Child theme propio.
- Assets propios de marca.
- Snippets revisables.
- Checklists de instalacion, seguridad y despliegue.

## Que no se versiona

- WordPress core.
- `wp-config.php`.
- Credenciales, tokens o llaves privadas.
- Datos reales de cPanel.
- Backups reales.
- Dumps de base de datos.
- Instalaciones locales completas en `public_html/`.
- Archivos subidos por usuarios en `wp-content/uploads/`.
- Plugins o temas de terceros completos.

## Trabajo local con `public_html/`

`public_html/` es solo un entorno local de ejecucion para evaluar WordPress en `http://127.0.0.1:8088`. No debe usarse como fuente versionada ni como mecanismo de despliegue.

Codex puede modificar de forma controlada:

- `public_html/wp-content/themes/sokatechnologies/`
- `public_html/wp-content/themes/sokatechnologies/assets/`
- `content/`
- `website/`
- `docs/`
- `snippets/`
- `scripts/`

No se debe tocar ni mostrar:

- `public_html/wp-config.php`
- `public_html/wp-admin/`
- `public_html/wp-includes/`
- `public_html/wp-content/uploads/`
- `public_html/wp-content/plugins/`, salvo instruccion explicita.
- Archivos `.sql`, backups, credenciales, tokens o llaves privadas.

Todo cambio en `public_html/` es local. Si una modificacion del tema debe conservarse, copiarla despues a `wp-theme/sokatechnologies-child-theme/` y revisar el diff antes de aprobarla.

## Documentacion principal

- `docs/wordpress-setup.md`
- `docs/content-structure.md`
- `docs/plugins.md`
- `docs/security.md`
- `docs/deployment-checklist.md`
- `docs/consent-evidence.md`
- `docs/d1-local-operations.md`
- `docs/d1-native-runtime-tests.md`
- `docs/d1-remote-staging-plan.md`
- `docs/redesign/fase-03-seo-migracion.md`

## Child theme

El child theme base esta en:

```text
wp-theme/sokatechnologies-child-theme/
```

Antes de instalarlo en WordPress, confirmar el tema padre aprobado y ajustar el campo `Template` en `style.css` para que coincida exactamente con el nombre de la carpeta del tema padre instalado.

## Flujo recomendado

1. Hacer cambios pequenos y revisables.
2. Revisar que no haya secretos ni archivos sensibles.
3. Validar documentacion y estructura.
4. Probar cambios locales en `public_html/` si aplica.
5. Copiar al child theme versionado solo los cambios que deban conservarse.
6. Probar el child theme en staging o entorno seguro.
7. Subir manualmente solo los archivos aprobados.
8. Validar el sitio antes de aplicar cambios en produccion.

## Estado pendiente

- Definir tema padre.
- Definir plugins aprobados.
- Completar assets finales.
- Confirmar proceso de despliegue manual o staging.
