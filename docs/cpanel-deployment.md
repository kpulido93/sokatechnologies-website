# cPanel Git Deployment

## Objetivo

Preparar un despliegue seguro para la web WordPress de SokaTechnologies usando `cPanel > Git Version Control`, sin tocar produccion ahora y sin convertir el repo en una copia completa de WordPress.

## Rutas aprobadas

- Repositorio clonado por cPanel: `/home/sokatech/repositories/sokatechnologies-website`
- WordPress de produccion: `/home/sokatech/public_html`
- Tema fuente dentro del repo clonado: `/home/sokatech/repositories/sokatechnologies-website/wp-theme/sokatechnologies-child-theme`
- Destino del deploy manual: `/home/sokatech/public_html/wp-content/themes/sokatechnologies`

## Decision recomendada

Usar `pull deployment` manual desde cPanel y dejar fuera cualquier automatizacion por `git push` al repositorio gestionado por cPanel en esta primera fase.

Esto implica dos capas distintas:

- El repositorio gestionado por cPanel puede contener una copia completa del repo fuera de `public_html/`.
- El archivo `.cpanel.yml` debe copiar a la web publica solo lo estrictamente necesario para el sitio activo.

## Que si debe desplegarse a la web publica

Solo debe publicarse el tema versionado y sus archivos operativos:

| Fuente en el repo | Destino en produccion | Incluir | Motivo |
| --- | --- | --- | --- |
| `wp-theme/sokatechnologies-child-theme/style.css` | `public_html/wp-content/themes/sokatechnologies/style.css` | Si | Cabecera del tema. |
| `wp-theme/sokatechnologies-child-theme/functions.php` | `public_html/wp-content/themes/sokatechnologies/functions.php` | Si | Logica propia revisada del tema. |
| `wp-theme/sokatechnologies-child-theme/theme.json` | `public_html/wp-content/themes/sokatechnologies/theme.json` | Si | Configuracion de bloques, tipografia y estilos. |
| `wp-theme/sokatechnologies-child-theme/assets/css/**` | `public_html/wp-content/themes/sokatechnologies/assets/css/**` | Si | CSS del tema. |
| `wp-theme/sokatechnologies-child-theme/assets/icons/**` | `public_html/wp-content/themes/sokatechnologies/assets/icons/**` | Si | Iconos del tema. |
| `wp-theme/sokatechnologies-child-theme/assets/images/**` | `public_html/wp-content/themes/sokatechnologies/assets/images/**` | Si | Imagenes embebidas por el tema. |
| `wp-theme/sokatechnologies-child-theme/templates/**` | `public_html/wp-content/themes/sokatechnologies/templates/**` | Si | Plantillas del tema. |
| `wp-theme/sokatechnologies-child-theme/parts/**` | `public_html/wp-content/themes/sokatechnologies/parts/**` | Si | Header, footer y partes del tema. |
| `wp-theme/sokatechnologies-child-theme/patterns/**` | `public_html/wp-content/themes/sokatechnologies/patterns/**` | Si, si existe | Soporte futuro para patrones versionados. |

## Que no debe desplegarse a la web publica

Estos directorios o archivos pueden existir en el repo, pero no deben copiarse a `public_html/` por Git deployment:

| Ruta | Incluir | Motivo |
| --- | --- | --- |
| `public_html/` | No | Entorno local ignorado por Git; no es fuente de produccion. |
| `public_html/wp-config.php` | No | Archivo sensible y fuera de alcance. |
| `public_html/wp-admin/` | No | WordPress core. |
| `public_html/wp-includes/` | No | WordPress core. |
| `public_html/wp-content/plugins/` | No | No desplegar plugins por este flujo. |
| `public_html/wp-content/uploads/` | No | No desplegar uploads por Git. |
| `assets/` | No | Fuente de marca y media; no debe copiarse directo a la web publica. |
| `content/` | No | Fuente editorial para carga manual en WordPress, no archivos publicables por Git. |
| `scripts/` | No | Utilidades locales y operativas, no runtime web. |
| `docs/` | No | Documentacion interna, no debe exponerse en webroot. |
| `.tmp/` | No | Temporal de trabajo, no runtime. |
| `snippets/` | No | Material de apoyo y referencia, no runtime. |
| `checklists/` | No | Material operativo, no runtime. |
| Dotfiles dentro del tema, excepto `.gitkeep` | No | El preflight rechaza dotfiles no permitidos; `.gitkeep` se tolera pero no se copia. |
| `README.md`, `AGENTS.md`, prompts y plantillas | No | Documentacion interna. |
| `.env*`, backups, `.sql`, `.zip`, `.tar*`, `.wpress`, `*.old`, `*.log` | No | Sensible o no operativo. |

Regla practica:

- Todo lo que no pertenezca al tema versionado en `wp-theme/sokatechnologies-child-theme/` queda excluido del despliegue a `public_html/`.

## Tratamiento de `assets/` y `content/`

Aunque `assets/` y `content/` son parte importante del repositorio, en este proyecto deben tratarse como fuente operativa, no como artefactos de despliegue directo:

- `assets/` contiene fuentes de marca e imagenes maestras.
- `content/` contiene HTML y estructura editorial para cargar o recrear desde WordPress.
- Las imagenes referenciadas desde `content/` apuntan a `/wp-content/uploads/sokatech/`, por lo que su carga a produccion debe hacerse de forma manual y controlada desde WordPress o por un proceso separado aprobado.

Por este motivo, el `.cpanel.yml` no debe copiar ni `assets/` ni `content/` a `public_html/`.

## Propuesta de `.cpanel.yml`

El archivo versionado en la raiz del repo debe limitarse a copiar solo el tema.

Puntos de seguridad de esta propuesta:

- No usa credenciales.
- Valida que el repo gestionado por cPanel este exactamente en `/home/sokatech/repositories/sokatechnologies-website`.
- Valida que el origen sea exactamente `/home/sokatech/repositories/sokatechnologies-website/wp-theme/sokatechnologies-child-theme`.
- Valida que el destino sea exactamente `/home/sokatech/public_html/wp-content/themes/sokatechnologies`.
- No toca `wp-config.php`.
- No toca WordPress core.
- No toca plugins.
- No toca `uploads`.
- No usa `rm -rf`.
- No usa `rsync --delete`.
- Rechaza el deploy si detecta `.env`, `.env.*`, `wp-config.php`, backups, dumps SQL, `.old`, `.log`, `docs/`, `scripts/`, `.tmp/`, `plugins/`, `uploads/` o `public_html/` dentro del tema fuente.
- Rechaza cualquier dotfile o dot-directory no permitido dentro del tema fuente.
- Permite `.gitkeep` como placeholder de carpetas vacias, pero no lo copia al destino.
- Copia solo archivos raiz del tema y subdirectorios permitidos: `assets/css`, `assets/icons`, `assets/images`, `templates`, `parts` y `patterns`.
- La copia de subdirectorios se hace archivo por archivo con una allowlist, sin arrastrar dotfiles.

Contenido propuesto:

```yaml
---
# Manual cPanel deployment for the SokaTechnologies WordPress theme only.
deployment:
  tasks:
    - export EXPECTED_REPO="/home/sokatech/repositories/sokatechnologies-website"
    - export EXPECTED_THEMESOURCE="$EXPECTED_REPO/wp-theme/sokatechnologies-child-theme"
    - export EXPECTED_THEMEPATH="/home/sokatech/public_html/wp-content/themes/sokatechnologies"
    - export REPO_ROOT="$(pwd)"
    - export THEMESOURCE="$REPO_ROOT/wp-theme/sokatechnologies-child-theme"
    - export THEMEPATH="/home/sokatech/public_html/wp-content/themes/sokatechnologies"
    - if [ "$REPO_ROOT" != "$EXPECTED_REPO" ]; then echo "Unexpected repo path $REPO_ROOT"; exit 1; fi
    - if [ "$THEMESOURCE" != "$EXPECTED_THEMESOURCE" ]; then echo "Unexpected theme source $THEMESOURCE"; exit 1; fi
    - if [ "$THEMEPATH" != "$EXPECTED_THEMEPATH" ]; then echo "Unsafe theme path $THEMEPATH"; exit 1; fi
    - if [ ! -d "$THEMESOURCE" ]; then echo "Missing theme source $THEMESOURCE"; exit 1; fi
    - if [ ! -f "$THEMESOURCE/style.css" ] || [ ! -f "$THEMESOURCE/functions.php" ] || [ ! -f "$THEMESOURCE/theme.json" ]; then echo "Missing required theme files"; exit 1; fi
    - if find "$THEMESOURCE" -mindepth 1 \( -type f -o -type d \) -name '.*' ! -name '.gitkeep' | grep -q .; then echo "Blocked dotfile or dot-directory detected inside theme source"; exit 1; fi
    - if find "$THEMESOURCE" -type f \( -name ".env" -o -name ".env.*" -o -name "wp-config.php" -o -name "*.sql" -o -name "*.sql.gz" -o -name "*.zip" -o -name "*.tar" -o -name "*.tar.gz" -o -name "*.tgz" -o -name "*.bak" -o -name "*.backup" -o -name "*.old" -o -name "*.log" \) | grep -q .; then echo "Blocked sensitive file detected inside theme source"; exit 1; fi
    - if find "$THEMESOURCE" \( -path "$THEMESOURCE/docs" -o -path "$THEMESOURCE/docs/*" -o -path "$THEMESOURCE/scripts" -o -path "$THEMESOURCE/scripts/*" -o -path "$THEMESOURCE/.tmp" -o -path "$THEMESOURCE/.tmp/*" -o -path "$THEMESOURCE/backups" -o -path "$THEMESOURCE/backups/*" -o -path "$THEMESOURCE/plugins" -o -path "$THEMESOURCE/plugins/*" -o -path "$THEMESOURCE/uploads" -o -path "$THEMESOURCE/uploads/*" -o -path "$THEMESOURCE/public_html" -o -path "$THEMESOURCE/public_html/*" \) | grep -q .; then echo "Blocked directory detected inside theme source"; exit 1; fi
    - /bin/mkdir -p "$THEMEPATH"
    - /bin/cp "$THEMESOURCE/style.css" "$THEMEPATH/style.css"
    - /bin/cp "$THEMESOURCE/functions.php" "$THEMEPATH/functions.php"
    - /bin/cp "$THEMESOURCE/theme.json" "$THEMEPATH/theme.json"
    - for DIR in assets/css assets/icons assets/images templates parts patterns; do if [ -d "$THEMESOURCE/$DIR" ]; then /bin/mkdir -p "$THEMEPATH/$DIR" || exit 1; find "$THEMESOURCE/$DIR" -mindepth 1 ! -name '.*' | while IFS= read -r ITEM; do REL="${ITEM#$THEMESOURCE/}"; DEST="$THEMEPATH/$REL"; if [ -d "$ITEM" ]; then /bin/mkdir -p "$DEST" || exit 1; else DESTDIR="${DEST%/*}"; /bin/mkdir -p "$DESTDIR" || exit 1; /bin/cp "$ITEM" "$DEST" || exit 1; fi; done; fi; done
    - /bin/echo "SokaTechnologies theme copied to $THEMEPATH"
```

## Politica de preflight segura

Antes de copiar cualquier archivo, `.cpanel.yml` debe detener el deploy si ocurre cualquiera de estos casos:

- El repo no esta montado exactamente en `/home/sokatech/repositories/sokatechnologies-website`.
- El origen no coincide exactamente con `/home/sokatech/repositories/sokatechnologies-website/wp-theme/sokatechnologies-child-theme`.
- El destino no coincide exactamente con `/home/sokatech/public_html/wp-content/themes/sokatechnologies`.
- Faltan `style.css`, `functions.php` o `theme.json`.
- Existe cualquier dotfile o dot-directory no permitido dentro del tema.
- Existe cualquier archivo sensible: `.env`, `.env.*`, `wp-config.php`, `*.sql`, `*.zip`, `*.tar`, `*.tar.gz`, `*.tgz`, `*.bak`, `*.backup`, `*.old`, `*.log`.
- Existe cualquier arbol bloqueado dentro del tema: `docs/`, `scripts/`, `.tmp/`, `backups/`, `plugins/`, `uploads/`, `public_html/`.

Excepcion controlada:

- `.gitkeep` puede existir para conservar carpetas vacias en Git, pero el deploy no lo copia a produccion.

## Implicaciones de esta estrategia

- El despliegue no elimina archivos viejos del tema en produccion.
- Si en el futuro se renombran o eliminan archivos del tema, habra que limpiar esos restos manualmente y de forma controlada.
- La primera publicacion es adecuada para este enfoque porque evita operaciones destructivas.

## Shell y SSH

Estado recomendado:

- Para la primera publicacion manual con `pull deployment`, shell/SSH no es estrictamente obligatorio si cPanel puede clonar el repositorio por la URL permitida desde la interfaz.
- Para automatizar por `push deployment`, usar repositorios privados por SSH, o empujar directamente al repositorio gestionado por cPanel, si hace falta shell/SSH.

Con la advertencia actual de cPanel sobre `shell access`:

- Si el repositorio remoto es privado y se quiere clonarlo por SSH, hay que habilitar shell/SSH.
- Si se quiere una automatizacion futura por `git push` al repo gestionado por cPanel, tambien conviene habilitar shell/SSH.
- Si solo se hara `pull deployment` manual desde la interfaz de cPanel y el repo puede clonarse por HTTPS desde ahi, se puede preparar el flujo sin shell en esta fase.

## Flujo recomendado para la primera publicacion

1. Confirmar que `main` contiene el child theme y la documentacion final aprobada.
2. Confirmar en el repo que `public_html/` sigue ignorado y que no hay core, plugins, uploads, backups ni secretos versionados.
3. En cPanel, crear o confirmar el repositorio gestionado por Git en `/home/sokatech/repositories/sokatechnologies-website`, siempre fuera de `public_html/`.
4. Elegir `pull deployment` manual, no `push deployment`, para evitar despliegue automatico en esta primera etapa.
5. Clonar desde el remoto aprobado hacia el repositorio gestionado por cPanel.
6. Verificar que `.cpanel.yml` exista en la raiz del repo y que mantenga las rutas exactas de `sokatech`.
7. Desde cPanel, ejecutar `Update from Remote`.
8. Revisar rama y commit que quedaron en la copia gestionada.
9. Ejecutar `Deploy HEAD Commit` de forma manual.
10. Verificar en WordPress que el tema `SokaTechnologies` existe y activarlo solo si corresponde al corte aprobado.
11. Cargar manualmente media y contenido que dependan de `uploads` o de configuracion en WordPress.
12. Ejecutar smoke test funcional y visual.

## Uso en cPanel: Pull and Deploy

Secuencia operativa recomendada dentro de `cPanel > Git Version Control`:

1. Crear o abrir el repositorio `sokatechnologies-website`.
2. Confirmar que la ruta del repositorio sea `/home/sokatech/repositories/sokatechnologies-website`.
3. Entrar en `Manage`.
4. Abrir la pestana `Pull or Deploy`.
5. Pulsar `Update from Remote` para traer el ultimo commit aprobado.
6. Revisar `Checked-Out Branch`, `HEAD Commit` y `Last Deployment Information`.
7. Confirmar que el repo ya contiene `.cpanel.yml` en su raiz.
8. Pulsar `Deploy HEAD Commit`.
9. Esperar a que cPanel termine las tareas del YAML.
10. Verificar que el resultado exista solo en `/home/sokatech/public_html/wp-content/themes/sokatechnologies/`.

Si el repo de cPanel se crea en otra ruta, no usar este `.cpanel.yml` sin actualizar primero la constante `EXPECTED_REPO`.

## Riesgos y pendientes antes del primer deploy

- El tema local en `public_html/wp-content/themes/sokatechnologies/` no coincide al cien por cien con `wp-theme/sokatechnologies-child-theme/`: en la copia versionada existe `assets/css/soka-brand.css` y en la copia local no.
- Antes de publicar, conviene repetir un smoke test usando exactamente el child theme versionado como artefacto fuente del despliegue.
- Si el hosting solo permite repositorios privados por SSH y shell sigue deshabilitado, la automatizacion quedara bloqueada hasta que el proveedor habilite shell/SSH.
- El contenido que depende de `/wp-content/uploads/sokatech/` requiere una carga manual separada; no debe resolverse via `.cpanel.yml`.
- El deploy copia al directorio exacto `/home/sokatech/public_html/wp-content/themes/sokatechnologies`, asi que el slug del tema en hosting debe seguir siendo `sokatechnologies`.

## Validacion de esta propuesta

- [ ] `.cpanel.yml` existe en la raiz del repo y solo copia el tema versionado.
- [ ] `.cpanel.yml` usa la ruta exacta `/home/sokatech/public_html/wp-content/themes/sokatechnologies`.
- [ ] `.cpanel.yml` valida el origen exacto `/home/sokatech/repositories/sokatechnologies-website/wp-theme/sokatechnologies-child-theme`.
- [ ] `.cpanel.yml` valida la ruta del repo `/home/sokatech/repositories/sokatechnologies-website`.
- [ ] `.cpanel.yml` rechaza dotfiles no permitidos y no copia `.gitkeep`.
- [ ] `public_html/` sigue ignorado por Git.
- [ ] No se despliegan core, plugins ni `uploads`.
- [ ] No hay credenciales ni rutas reales sensibles en la configuracion.
- [ ] El flujo recomendado deja el primer deploy como accion manual desde cPanel.
