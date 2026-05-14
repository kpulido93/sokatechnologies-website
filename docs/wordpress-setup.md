# WordPress Setup

## Objetivo

Documentar una instalacion base de WordPress para la web publica de SokaTechnologies usando cPanel, sin guardar credenciales ni configuracion sensible en el repositorio.

## Alcance

Incluye:

- Preparacion previa.
- Instalacion con WP Toolkit o Softaculous.
- Configuracion inicial de WordPress.
- Preparacion del tema padre y child theme.
- Validaciones basicas antes de publicar.

No incluye:

- Usuarios reales.
- Contrasenas.
- Datos de cPanel.
- Nombres reales de base de datos.
- `wp-config.php`.

## Entorno local `public_html/`

El repositorio puede contener una instalacion local de WordPress en `public_html/`. Esta carpeta esta ignorada por Git y debe usarse solo para evaluacion local en `http://127.0.0.1:8088`.

`public_html/` no es fuente versionada. No debe copiarse completa al repositorio, no debe desplegarse a produccion y no debe usarse para guardar credenciales o backups.

Codex puede modificar unicamente estas rutas durante trabajo local:

- `public_html/wp-content/themes/sokatechnologies/`
- `public_html/wp-content/themes/sokatechnologies/assets/`
- `content/`
- `website/`
- `docs/`
- `snippets/`
- `scripts/`

Rutas y archivos prohibidos:

- `public_html/wp-config.php`
- `public_html/wp-admin/`
- `public_html/wp-includes/`
- `public_html/wp-content/uploads/`
- `public_html/wp-content/plugins/`, salvo instruccion explicita.
- Archivos `.sql`.
- Backups.
- Credenciales, tokens, llaves privadas o datos sensibles.

No leer ni mostrar el contenido de `public_html/wp-config.php`.

Si un cambio probado en `public_html/wp-content/themes/sokatechnologies/` debe conservarse, copiarlo despues a `wp-theme/sokatechnologies-child-theme/` y revisar el diff.

### Sincronizacion del tema local

Tema activo local:

```text
public_html/wp-content/themes/sokatechnologies/
```

Copia versionable:

```text
wp-theme/sokatechnologies-child-theme/
```

El flujo recomendado es:

1. Probar cambios visuales o de tema en `public_html/wp-content/themes/sokatechnologies/`.
2. Confirmar que el sitio local carga en `http://127.0.0.1:8088`.
3. Copiar solo los archivos relevantes del tema a `wp-theme/sokatechnologies-child-theme/`.
4. Revisar el diff versionado.
5. No versionar `public_html/`.

Archivos que deben mantenerse sincronizados:

- `style.css`
- `functions.php`
- `theme.json`
- `assets/css/corporate.css`
- `README.md`
- `parts/.gitkeep`, si la carpeta no contiene partes propias todavia.
- `patterns/.gitkeep`, si la carpeta no contiene patrones propios todavia.

El campo `Template` debe mantenerse como `twentytwentyfive` mientras el tema dependa de Twenty Twenty-Five.

La carpeta antigua `child-theme/` no debe usarse como fuente principal. Si se conserva, debe quedar archivada para revision en `__archive_review__/child-theme/`.

### Aplicar contenido local a paginas

El contenido versionado para paginas principales puede aplicarse a WordPress local con:

```text
scripts/apply-local-wordpress-pages.ps1
```

El script trabaja sobre la instalacion local en `public_html/` y usa los archivos de `content/`.

Modo seguro por defecto:

```powershell
cd D:\repos\sokatechnologies-website
.\scripts\apply-local-wordpress-pages.ps1
```

Sin `-Apply`, el script ejecuta un dry-run: valida `siteurl` y `home`, muestra el plan de paginas y no modifica WordPress.

Para aplicar contenido a paginas existentes:

```powershell
.\scripts\apply-local-wordpress-pages.ps1 -Apply
```

Si falta una pagina permitida, crearla requiere confirmacion explicita mediante parametro:

```powershell
.\scripts\apply-local-wordpress-pages.ps1 -Apply -CreateMissing
```

Paginas permitidas:

- `Inicio` desde `content/home.html`.
- `Servicios` desde `content/servicios.html`.
- `Soluciones` desde `content/soluciones.html`.
- `Sobre nosotros` desde `content/sobre-nosotros.html`.
- `Contacto` desde `content/contacto.html`.
- `Casos de exito` desde `content/casos-de-exito.html`.

Reglas del script:

- Solo acepta `siteurl` y `home` en `http://127.0.0.1:8088` salvo que se pase una lista local explicita con `-AllowedUrls`.
- No lee ni muestra `wp-config.php`.
- No ejecuta `wp config get`.
- No modifica usuarios.
- No modifica plugins.
- No toca uploads.
- No modifica WordPress core.
- No borra paginas.
- No cambia `sample-page`.
- No cambia configuracion de portada.
- No cambia slugs de paginas existentes.
- Antes de aplicar con `-Apply`, crea backup JSON del contenido previo en `%TEMP%\sokatechnologies-wordpress-local-backups\`.
- Los backups quedan fuera del repositorio y no deben versionarse.

## Herramientas esperadas

- WordPress Management / WP Toolkit.
- Softaculous.
- MySQL.
- phpMyAdmin.
- MultiPHP Manager.
- SSL/TLS.
- Backups.
- Git Version Control.

## Checklist de preparacion

- [ ] Confirmar que `public_html/` sigue ignorado por Git.
- [ ] Confirmar que el entorno local responde en `http://127.0.0.1:8088` si se usara para pruebas.
- [ ] Confirmar dominio o subdominio autorizado: `[pendiente]`.
- [ ] Confirmar responsable de instalacion: `[pendiente]`.
- [ ] Confirmar ambiente objetivo: `[staging/produccion pendiente]`.
- [ ] Confirmar version PHP soportada por el hosting.
- [ ] Confirmar que SSL/TLS esta disponible.
- [ ] Confirmar politica de backups del hosting.
- [ ] Confirmar que no se documentaran credenciales en este repo.

## Checklist de instalacion WordPress/cPanel

- [ ] Ingresar a cPanel desde canal seguro.
- [ ] Instalar WordPress con WP Toolkit o Softaculous.
- [ ] Usar HTTPS cuando el certificado este disponible.
- [ ] Configurar idioma del sitio: `[pendiente]`.
- [ ] Configurar zona horaria: `[pendiente]`.
- [ ] Configurar titulo del sitio: `SokaTechnologies`.
- [ ] Configurar tagline: `[pendiente]`.
- [ ] Configurar enlaces permanentes con estructura amigable.
- [ ] Crear usuarios nominales con roles minimos.
- [ ] Eliminar contenido de ejemplo si no se usara.
- [ ] Revisar que `display_errors` no quede activo en produccion.
- [ ] Activar backups antes de cambios relevantes.

## Tema padre

Tema padre pendiente de decision.

Criterios de seleccion:

- Mantenido activamente.
- Compatible con bloques de WordPress.
- Ligero.
- Buena reputacion.
- Compatible con buenas practicas SEO.
- Sin exceso de funcionalidades innecesarias.

## Child theme

Ruta en este repositorio:

```text
wp-theme/sokatechnologies-child-theme/
```

Ruta permitida para pruebas locales del tema activo:

```text
public_html/wp-content/themes/sokatechnologies/
```

Antes de instalar:

- [ ] Confirmar que el tema padre esta instalado.
- [ ] Confirmar nombre exacto de la carpeta del tema padre.
- [ ] Confirmar que `Template: twentytwentyfive` coincide con el tema padre instalado.
- [ ] Si se probo en `public_html/`, copiar al child theme versionado solo los cambios que deban conservarse.
- [ ] Crear un ZIP solo del directorio del child theme.
- [ ] Instalar desde WordPress Admin > Apariencia > Temas > Anadir nuevo.
- [ ] Activar en staging o entorno seguro antes de produccion.

## Validaciones iniciales

- [ ] Home carga por HTTPS.
- [ ] Admin de WordPress es accesible.
- [ ] Tema padre activo o disponible.
- [ ] Child theme activo.
- [ ] No hay errores PHP visibles.
- [ ] No hay plugins innecesarios.
- [ ] Backups configurados.
- [ ] No se expone informacion sensible.
- [ ] No se leyo ni mostro `public_html/wp-config.php`.
- [ ] No se versiono contenido de `public_html/`.
- [ ] El sitio es navegable en escritorio y movil.

## Pendientes

- Definir tema padre.
- Definir plugin de formularios.
- Definir plugin SEO.
- Definir plugin de seguridad.
- Definir plugin de cache si el hosting lo permite.
- Definir proceso de staging.
