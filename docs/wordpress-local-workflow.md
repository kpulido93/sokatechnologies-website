# Workflow local WordPress

Este documento describe el flujo local para aplicar contenido versionado de SokaTechnologies en una instalacion WordPress local.

## Entorno permitido

Antes de ejecutar cualquier script que modifique WordPress, confirma:

- Repositorio: `D:\repos\sokatechnologies-website`
- Instalacion WordPress local: `D:\repos\sokatechnologies-website\public_html`
- URL local esperada: `http://127.0.0.1:8088`

`public_html/` esta ignorado por Git y no es fuente versionada.

## Script de aplicacion de contenido

Script:

```text
scripts/apply-local-wordpress-pages.ps1
```

Fuente de contenido:

```text
content/
```

Paginas permitidas:

- `Inicio` desde `content/home.html`.
- `Servicios` desde `content/servicios.html`.
- `Soluciones` desde `content/soluciones.html`.
- `Sobre nosotros` desde `content/sobre-nosotros.html`.
- `Contacto` desde `content/contacto.html`.
- `Casos de exito` desde `content/casos-de-exito.html`.

## Dry-run obligatorio por defecto

Ejecutar sin parametros no modifica WordPress:

```powershell
cd D:\repos\sokatechnologies-website
.\scripts\apply-local-wordpress-pages.ps1
```

El dry-run:

- Valida `siteurl` y `home`.
- Muestra que paginas se actualizarian.
- Muestra paginas faltantes.
- No crea paginas.
- No actualiza contenido.
- No borra nada.

## Aplicar contenido

Para actualizar solo paginas existentes:

```powershell
.\scripts\apply-local-wordpress-pages.ps1 -Apply
```

Si falta una pagina permitida y debe crearse en local:

```powershell
.\scripts\apply-local-wordpress-pages.ps1 -Apply -CreateMissing
```

Usar `-CreateMissing` solo para las seis paginas permitidas. No usarlo para crear paginas nuevas fuera del alcance.

## Backups locales

Antes de modificar contenido con `-Apply`, el script crea un backup JSON del contenido previo en:

```text
%TEMP%\sokatechnologies-wordpress-local-backups\
```

Los backups quedan fuera del repositorio. No mover backups, SQL, ZIP, TAR, GZ ni exportaciones a este repo.

## Que no hace el script

El script no debe:

- Leer ni mostrar `wp-config.php`.
- Ejecutar `wp config get`.
- Modificar usuarios.
- Modificar plugins.
- Tocar uploads.
- Modificar WordPress core.
- Borrar paginas.
- Cambiar `sample-page`.
- Activar temas.
- Cambiar la portada.
- Cambiar slugs de paginas existentes.
- Ejecutar despliegues a produccion.

## Validacion posterior

Despues de aplicar contenido en local, revisar:

- `http://127.0.0.1:8088`
- `http://127.0.0.1:8088/servicios/` o la URL local que WordPress mantenga para la pagina Servicios.
- `http://127.0.0.1:8088/soluciones/`
- `http://127.0.0.1:8088/sobre-nosotros/`
- `http://127.0.0.1:8088/contacto/`
- `http://127.0.0.1:8088/casos-de-exito/` si la pagina fue creada.

Validar:

- El contenido se renderiza con bloques Gutenberg.
- El tema local `sokatechnologies` carga estilos.
- No hay errores PHP visibles.
- El administrador de WordPress sigue funcionando.
- No aparecen datos sensibles ni clientes reales.
- El sitio es navegable en escritorio y movil.

## Antes de produccion

Este flujo es solo local. No ejecuta despliegues, no toca cPanel y no reemplaza un checklist de publicacion.

Antes de publicar cualquier contenido:

- [ ] Revisar tono comercial.
- [ ] Confirmar correo comercial publico para reemplazar `[Definir correo comercial]`.
- [ ] Revisar textos legales.
- [ ] Confirmar que no hay secretos, tokens, backups, dumps SQL ni datos reales de clientes.
- [ ] Hacer backup controlado fuera del repositorio.
- [ ] Validar en staging o entorno seguro.
