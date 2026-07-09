# Deployment Checklist

## Objetivo

Definir un checklist operativo y seguro para publicar en produccion la web WordPress validada localmente de SokaTechnologies en `sokatechnologies.com` usando cPanel, sin perder configuracion, sin subir archivos indebidos y con rollback preparado antes de cualquier cambio.

Este documento solo describe pasos manuales. No autoriza despliegues automaticos, no pide credenciales y no debe usarse para tocar produccion sin backup previo.

## Estado base aprobado

- Fuente validada: rama `dev`.
- Validacion funcional local: `http://127.0.0.1:8088`.
- Hosting destino: cPanel con WordPress Management, Softaculous, SSL/TLS, JetBackup, MySQL y phpMyAdmin.
- Tema hijo versionado: `wp-theme/sokatechnologies-child-theme/`.
- Tema padre requerido por el child theme: `twentytwentyfive`.

## Alcance publicable

Se puede trasladar a produccion:

- Child theme versionado en `wp-theme/sokatechnologies-child-theme/`.
- Assets propios ya incluidos dentro del child theme.
- Contenido aprobado, recreado o importado por WordPress Admin segun el metodo aprobado.
- Ajustes manuales de WordPress, tema y plugins hechos directamente en el entorno productivo.
- Plugins aprobados e instalados desde fuentes oficiales.

No se debe subir ni versionar como parte de la publicacion:

- `public_html/` del repo local.
- `public_html/wp-config.php`.
- `wp-admin/`.
- `wp-includes/`.
- WordPress core.
- Plugins completos copiados desde el entorno local.
- `uploads/` locales sin revision previa.
- Backups, `.sql`, `.zip` operativos, caches o archivos temporales.
- Credenciales, tokens, llaves privadas o datos reales de cPanel.

## Riesgos antes de publicar

- Publicar desde una carpeta equivocada, por ejemplo el `public_html/` local, y arrastrar core, plugins o archivos no aprobados.
- Sobrescribir una instalacion activa sin punto de restauracion valido en JetBackup.
- Activar el child theme sin tener instalado el tema padre `twentytwentyfive`.
- Mover contenido o media sin revisar URLs, enlaces a `localhost` o rutas locales.
- Cambiar plugins o tema sin documentar su configuracion previa y sin evidencia de rollback.
- Publicar formulario sin validar correo saliente, anti-spam y destinatario final.
- Dejar el banner de cookies incompleto o en ingles aunque el layout este listo.
- Confiar solo en el fallback del favicon sin cargar el `Site Icon` final en WordPress.
- Dejar schema o SEO con placeholders, por ejemplo redes sociales vacias o nombre incompleto.
- No regrabar permalinks y romper slugs o paginas ya enlazadas.

## Checklist previa al cambio

### 1. Backup antes de cambios

- [ ] Crear backup completo de archivos y base de datos desde JetBackup o herramienta equivalente del hosting.
- [ ] Verificar que el backup se pueda restaurar y que aparezca con fecha/hora correctas.
- [ ] Confirmar alcance del backup: archivos del sitio, base de datos y configuracion restaurable.
- [ ] Guardar evidencia minima del backup: fecha, herramienta usada y responsable.
- [ ] Si el sitio ya esta publicado, capturar pantallas del estado actual de tema activo, plugins activos y ajustes clave.
- [ ] No seguir si no existe backup previo confirmado.

### 2. SSL y dominio

- [ ] Confirmar que `sokatechnologies.com` y, si aplica, `www.sokatechnologies.com` apuntan al hosting correcto.
- [ ] Confirmar que el certificado SSL/TLS esta emitido y vigente.
- [ ] Confirmar que el dominio carga por `https://`.
- [ ] Confirmar redireccion de `http` a `https`.
- [ ] Verificar que no hay contenido mixto previsto por URLs absolutas antiguas.

### 3. PHP y stack del hosting

- [ ] Revisar en cPanel la version PHP activa para el dominio.
- [ ] Confirmar compatibilidad de esa version con WordPress, `twentytwentyfive`, el child theme y los plugins aprobados.
- [ ] Revisar limites operativos basicos: `memory_limit`, `upload_max_filesize`, `post_max_size` y `max_execution_time`.
- [ ] Confirmar extensiones PHP necesarias para WordPress y plugins aprobados.
- [ ] No cambiar configuraciones globales del hosting si no son necesarias para esta publicacion.

### 4. Plugins necesarios

- [ ] Confirmar lista final de plugins aprobados antes de tocar produccion.
- [ ] Instalar plugins solo desde WordPress Admin, WordPress Management o fuentes oficiales.
- [ ] No copiar `public_html/wp-content/plugins/` desde el entorno local.
- [ ] Validar al menos estos componentes funcionales segun el estado local:
- [ ] `Fluent Forms Lite` si el formulario de contacto se publicara con el mismo flujo.
- [ ] `CookieAdmin` si se mantendra el banner de cookies validado localmente.
- [ ] `SiteSEO` o el plugin SEO aprobado si se mantendra el comportamiento actual de schema.
- [ ] Plugin SMTP, anti-spam o backup solo si fueron aprobados para produccion.
- [ ] Documentar cualquier diferencia final en `docs/plugins.md`.

### 5. Tema hijo, tema padre y assets

- [ ] Confirmar que el tema padre `twentytwentyfive` esta instalado en produccion.
- [ ] Preparar un ZIP limpio unicamente del contenido de `wp-theme/sokatechnologies-child-theme/` si el metodo elegido requiere subida por WordPress Admin.
- [ ] Verificar que el child theme incluye `style.css`, `functions.php`, `theme.json`, CSS y assets necesarios.
- [ ] Confirmar que los favicons optimizados y logos necesarios existen dentro del child theme.
- [ ] No subir la raiz del repo, `docs/`, `scripts/` ni el `public_html/` local al directorio publico.
- [ ] Activar el child theme solo cuando el tema padre y plugins dependientes ya esten listos.

### 6. Formulario

- [ ] Confirmar el plugin o mecanismo definitivo del formulario de contacto en produccion.
- [ ] Confirmar destinatario aprobado para notificaciones, actualmente `info@sokatechnologies.com`.
- [ ] Confirmar que no se piden contrasenas, tokens, llaves privadas ni adjuntos sensibles.
- [ ] Revisar mensaje de confirmacion y validaciones del formulario.
- [ ] Configurar anti-spam compatible con hosting compartido.
- [ ] Verificar que el correo saliente de WordPress esta listo antes del corte.

### 7. Cookies

- [ ] Confirmar si produccion usara `CookieAdmin` o el sistema de consentimiento aprobado.
- [ ] Replicar la configuracion funcional validada: `GDPR`, `Box`, `Bottom Right`, `Center`.
- [ ] Confirmar textos en espanol para titulo, botones y modal.
- [ ] Confirmar que el banner no oculta CTA criticos en desktop ni movil.
- [ ] Confirmar que enlaces a politica de privacidad y politica de cookies apunten a paginas reales si ya existen.
- [ ] No ocultar branding del plugin por CSS o hacks no aprobados.

### 8. Favicon / Site Icon

- [ ] Subir `favicon-512x512.png` aprobado como `Site Icon` desde WordPress Admin.
- [ ] Confirmar que el navegador recibe el icono correcto por HTTPS.
- [ ] Confirmar que el fallback del child theme sigue disponible si WordPress todavia no tiene `Site Icon`.
- [ ] Confirmar que ya no se sirve como favicon principal el PNG grande original.
- [ ] Revisar favicon en desktop y movil.

### 9. SEO y schema

- [ ] Configurar nombre de organizacion como `SokaTechnologies`.
- [ ] Confirmar que no existan perfiles sociales ficticios ni placeholders en el plugin SEO.
- [ ] Validar que el schema de organizacion no expone `https://x.com/` vacio ni campos incompletos.
- [ ] Confirmar pagina frontal, titulo del sitio, descripcion corta y slugs finales.
- [ ] Confirmar que el logo/schema apunten a un asset valido.
- [ ] Revisar indexacion, sitemap y metadatos basicos segun el plugin SEO aprobado.

### 10. Permalinks y ajustes finales

- [ ] Confirmar estructura de enlaces permanentes prevista para produccion.
- [ ] Confirmar que la Home apunta a la pagina correcta.
- [ ] Confirmar pagina de blog si aplica.
- [ ] Confirmar menus, footer y widgets segun el estado aprobado.
- [ ] Eliminar referencias a `localhost`, `127.0.0.1` o rutas locales.
- [ ] Dejar caches limpias o purgarlas despues de publicar si existe cache activa.

## Publicacion en cPanel

Secuencia recomendada para una publicacion manual segura:

1. Confirmar nuevamente el backup valido en JetBackup antes de tocar archivos, base de datos o configuracion.
2. Entrar a cPanel y verificar el estado del dominio, SSL/TLS y version PHP del sitio destino.
3. Si WordPress aun no existe en produccion, crear la instalacion con WordPress Management o Softaculous en el dominio correcto. Si ya existe, no reinstalar encima sin backup confirmado.
4. Confirmar que el tema padre `twentytwentyfive` esta instalado.
5. Subir el child theme `sokatechnologies-child-theme` por `Appearance > Themes > Add New > Upload Theme` o por File Manager solo dentro de `public_html/wp-content/themes/`.
6. No subir `public_html/` del repo local, no subir plugins locales, no subir backups, no subir `.sql` ni `.zip` ajenos al tema.
7. Instalar o activar solo los plugins aprobados desde fuentes oficiales.
8. Activar el child theme `SokaTechnologies`.
9. Cargar o recrear el contenido aprobado en WordPress Admin.
10. Subir assets faltantes desde Media Library solo si no viajan ya dentro del child theme y si son necesarios para contenido o SEO.
11. Configurar formulario, correo saliente y anti-spam.
12. Configurar banner de cookies y revisar textos.
13. Configurar `Site Icon`, logo de schema y ajustes SEO.
14. Guardar enlaces permanentes desde `Settings > Permalinks` sin cambiar a una estructura no aprobada.
15. Revisar rapidamente el front antes de cerrar la ventana de cambio.

## Smoke test post-publicacion

- [ ] Abrir `https://sokatechnologies.com/` en ventana privada.
- [ ] Confirmar que la Home carga por HTTPS y sin alertas de certificado.
- [ ] Confirmar que header, menu principal y footer cargan correctamente.
- [ ] Confirmar que el tema activo es el child theme `SokaTechnologies`.
- [ ] Confirmar que las paginas principales responden: Inicio, Servicios, Soluciones, Casos de exito, Sobre nosotros, Blog y Contacto.
- [ ] Confirmar que no quedan enlaces a `localhost`, `127.0.0.1` o assets rotos.
- [ ] Confirmar que el formulario de contacto abre, valida y envia correctamente.
- [ ] Confirmar que llega la notificacion al destino aprobado o, como minimo, que WordPress muestra envio exitoso y existe trazabilidad de prueba.
- [ ] Confirmar que el banner de cookies aparece en espanol y que `Personalizar` abre el modal sin desbordes.
- [ ] Confirmar que favicon y `Site Icon` se ven correctamente en la pestana del navegador.
- [ ] Confirmar que el schema de organizacion existe y no contiene placeholders.
- [ ] Confirmar que no hay errores visibles de PHP ni errores criticos en pantalla.
- [ ] Confirmar que no hay contenido mixto en consola del navegador.
- [ ] Confirmar que el admin de WordPress sigue accesible.
- [ ] Confirmar responsive basico en movil y desktop para Home y Contacto.
- [ ] Confirmar que guardar de nuevo `Permalinks` no cambia slugs esperados ni rompe navegacion.

## Rollback

No intentar rollback improvisado. Usar un orden simple y documentado.

### Disparadores de rollback

- El sitio deja de cargar o entra en error critico.
- El admin de WordPress deja de ser accesible.
- El tema activo rompe layout, navegacion o contenido clave.
- El formulario no funciona y no hay correccion rapida y segura.
- El cambio deja expuestos placeholders, enlaces rotos, contenido mixto o configuracion incompleta.

### Orden de rollback recomendado

1. Pausar nuevos cambios y registrar que fallo.
2. Si el problema esta solo en el tema y el admin sigue accesible, reactivar temporalmente el tema anterior o el tema padre seguro.
3. Si el problema no se resuelve rapido, restaurar desde JetBackup el punto previo a la publicacion.
4. Restaurar archivos y base de datos como un solo conjunto si hubo cambios en ambas capas.
5. Revalidar SSL, tema activo, plugins activos, permalinks y formulario despues de la restauracion.
6. Documentar causa, hora de restauracion, backup usado y siguientes acciones antes de reintentar.

### Evidencia minima tras rollback

- Fecha y hora del incidente.
- Alcance de lo restaurado.
- Herramienta usada, por ejemplo JetBackup.
- Responsable que ejecuto la reversa.
- Estado final del sitio tras restaurar.

## Registro minimo de publicacion

Antes de cerrar la ventana de cambio, dejar constancia de:

- Fecha y hora de publicacion.
- Rama o commit publicado.
- Responsable del cambio.
- Backup previo usado como punto de retorno.
- Plugins instalados o modificados.
- Tema activo final.
- Resultado del smoke test.
- Necesidades pendientes para la siguiente iteracion.
