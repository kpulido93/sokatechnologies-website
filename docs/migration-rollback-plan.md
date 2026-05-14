# Plan de migracion y rollback

## Objetivo

Definir un proceso seguro para migrar la web WordPress de SokaTechnologies desde el entorno local hacia un hosting compartido con cPanel, y dejar preparado un plan de rollback antes de tocar produccion.

Este documento complementa `docs/deployment-checklist.md`. No ejecuta migraciones, no contiene credenciales y no autoriza cambios en produccion.

## Reglas principales

- No incluir credenciales, tokens, llaves privadas ni datos reales de cPanel.
- No leer ni mostrar `public_html/wp-config.php`.
- No modificar base de datos desde este repo.
- No ejecutar comandos destructivos.
- No tocar produccion sin aprobacion explicita, backup y ventana de cambio.
- No migrar archivos locales sensibles.
- Pensar siempre en hosting compartido con cPanel, sin acceso root ni infraestructura dedicada.

## 1. Supuestos del entorno local

- La instalacion local de WordPress vive dentro de `public_html/`.
- `public_html/` esta ignorado por Git y no es fuente versionada.
- El sitio local se valida en `http://127.0.0.1:8088`.
- El tema activo local esperado es `public_html/wp-content/themes/sokatechnologies/`.
- La copia versionable del tema debe estar en `wp-theme/sokatechnologies-child-theme/`.
- El contenido preparado para paginas puede vivir en `content/` o `website/wordpress/`.
- Los datos locales pueden contener configuraciones temporales que no deben copiarse a produccion.
- No se debe usar el `wp-config.php` local como insumo de migracion.

## 2. Supuestos del hosting cPanel

- El hosting es compartido y administrado desde cPanel.
- WordPress se instalara o administrara con herramientas disponibles del hosting.
- No se asume acceso root, Docker, SSH avanzado, workers, colas ni CI/CD.
- La base de datos se administra desde cPanel, phpMyAdmin o herramientas equivalentes del proveedor.
- SSL se activa desde cPanel o desde la herramienta del proveedor.
- El sitio debe funcionar con el tema padre requerido, por ejemplo `twentytwentyfive`, y el child theme de SokaTechnologies.
- La configuracion de correo saliente dependera del proveedor SMTP aprobado.
- Cualquier plugin debe instalarse desde el admin de WordPress o fuente oficial aprobada.

## 3. Que se debe respaldar antes de migrar

Antes de tocar cPanel o produccion, preparar backups verificables:

- Archivos actuales del sitio destino, si ya existe un sitio.
- Base de datos actual del sitio destino, si ya existe un sitio.
- Carpeta `wp-content/uploads/` del sitio destino, si ya existe contenido publico.
- Tema activo actual del sitio destino.
- Lista de plugins activos del sitio destino.
- Configuracion de enlaces permanentes.
- Configuracion de Home y pagina de entradas.
- Menus y widgets existentes, si aplica.
- Exportacion de contenido actual, si hay contenido que podria necesitar rollback.
- Version aprobada del child theme desde `wp-theme/sokatechnologies-child-theme/`.

Los backups deben guardarse fuera del directorio publico y fuera del repositorio.

## 4. Que NO debe migrarse

No migrar ni subir:

- Credenciales locales.
- `public_html/wp-config.php`.
- Backups viejos.
- Dumps SQL no revisados.
- Logs.
- Caches.
- Archivos temporales.
- Archivos de sistema local.
- Configuraciones de desarrollo.
- Plugins descargados desde fuentes no oficiales.
- WordPress core desde el entorno local.
- `wp-admin/` local.
- `wp-includes/` local.
- `wp-content/uploads/` local sin revision y aprobacion.
- Archivos `.env`.
- Tokens, API keys o llaves privadas.

## 5. Opciones de migracion

### Opcion A: plugin de migracion

Usar un plugin de migracion puede ser conveniente si se quiere mover un sitio completo con base de datos, medios y configuracion.

Ventajas:

- Reduce pasos manuales.
- Puede manejar reemplazos de URL.
- Puede simplificar migraciones completas.

Riesgos:

- Puede arrastrar configuraciones locales innecesarias.
- Puede incluir medios, usuarios, plugins, caches o datos que no deben publicarse.
- Puede requerir limites de subida mayores a los disponibles en cPanel compartido.
- Puede depender de funciones premium.

Usar solo si:

- El plugin fue aprobado y documentado en `docs/plugins.md`.
- Hay backup completo del destino.
- Se reviso exactamente que incluye la exportacion.
- Se probo en staging o entorno seguro si esta disponible.

### Opcion B: export/import de WordPress

Usar las herramientas de exportacion/importacion de WordPress para mover contenido, paginas y entradas.

Ventajas:

- Menos invasivo que una migracion completa.
- Evita copiar WordPress core.
- Permite instalar WordPress limpio en cPanel.

Riesgos:

- Puede requerir ajustes manuales de menus, Home, slugs y medios.
- Puede no migrar configuraciones de tema, formularios o plugins.
- Puede duplicar contenido si se importa mas de una vez sin control.

Usar si:

- El objetivo es publicar contenido aprobado sin copiar toda la instalacion local.
- Se acepta una revision manual posterior.

### Opcion C: migracion manual con archivos y base de datos

Mover manualmente archivos propios, tema y base de datos exportada.

Ventajas:

- Maximo control tecnico.
- Permite revisar cada parte antes de subir.

Riesgos:

- Mayor probabilidad de error humano.
- Requiere cuidado con URLs, prefijos, codificacion y permisos.
- Puede exponer secretos si se exporta o edita sin revision.

Usar solo si:

- Hay responsable tecnico asignado.
- Hay backup completo.
- Se conoce el alcance exacto de archivos y tablas.
- Se evitan comandos destructivos y reemplazos masivos sin validacion.

## 6. Recomendacion para primera publicacion

Para la primera publicacion de SokaTechnologies, la recomendacion conservadora es:

1. Instalar WordPress limpio en cPanel.
2. Instalar el tema padre requerido desde fuente oficial.
3. Subir el child theme propio desde `wp-theme/sokatechnologies-child-theme/`.
4. Crear o importar paginas aprobadas.
5. Configurar menu, footer, Home, enlaces permanentes y formularios desde el admin.
6. Instalar solo plugins minimos aprobados.
7. Validar todo antes de anunciar.

No se recomienda migrar toda la instalacion local de `public_html/` como primer paso, porque puede arrastrar configuracion local, archivos innecesarios o datos no aprobados.

## 7. Pasos antes de tocar cPanel

- [ ] Confirmar aprobacion de contenido, diseno y estructura.
- [ ] Confirmar que `wp-theme/sokatechnologies-child-theme/` contiene la version final del tema.
- [ ] Confirmar que `public_html/` sigue ignorado por Git.
- [ ] Confirmar que no hay secretos, backups ni dumps SQL en el repo.
- [ ] Confirmar que no se requiere migrar `wp-config.php`.
- [ ] Definir dominio o subdominio destino.
- [ ] Definir si se publicara sobre sitio nuevo, staging o sitio existente.
- [ ] Definir quien tiene acceso a cPanel.
- [ ] Definir ventana de cambio.
- [ ] Definir responsable de aprobar rollback.
- [ ] Definir plugin de formularios y SMTP.
- [ ] Definir si se importara contenido o se pegara manualmente desde `content/`.
- [ ] Preparar backup del sitio destino si existe.
- [ ] Preparar lista de pruebas post-migracion.

## 8. Pasos durante la migracion

- [ ] Entrar a cPanel con cuenta aprobada.
- [ ] Confirmar que se trabaja sobre el dominio correcto.
- [ ] Confirmar que existe backup previo del destino.
- [ ] Instalar o preparar WordPress limpio si corresponde.
- [ ] Activar SSL si el proveedor lo permite antes de publicar.
- [ ] Instalar tema padre requerido.
- [ ] Subir child theme aprobado.
- [ ] Activar child theme.
- [ ] Crear o importar paginas aprobadas.
- [ ] Configurar Home como pagina frontal.
- [ ] Configurar menu principal.
- [ ] Configurar footer.
- [ ] Configurar enlaces permanentes.
- [ ] Instalar plugins minimos aprobados.
- [ ] Configurar formulario de contacto.
- [ ] Configurar SMTP aprobado.
- [ ] Mantener el sitio sin anunciar hasta completar pruebas.

## 9. Pruebas despues de migrar

- [ ] Abrir Home por HTTPS.
- [ ] Confirmar que carga el child theme.
- [ ] Confirmar que no hay errores PHP visibles.
- [ ] Revisar Inicio, Servicios, Soluciones, Casos de exito, Sobre nosotros, Blog y Contacto.
- [ ] Revisar menu principal.
- [ ] Revisar footer.
- [ ] Revisar CTA principales.
- [ ] Revisar formulario de contacto.
- [ ] Revisar responsive.
- [ ] Revisar enlaces internos y externos.
- [ ] Revisar imagenes y textos alternativos.
- [ ] Revisar consola del navegador.
- [ ] Revisar que no aparece `Sample Page`.
- [ ] Confirmar que no hay enlaces a `localhost` ni `127.0.0.1`.
- [ ] Confirmar que el admin de WordPress sigue accesible.

## 10. Plan de rollback

Antes de migrar, debe existir una decision clara de rollback.

### Si falla antes de anunciar el sitio

- Mantener el sitio sin anunciar.
- Restaurar backup del hosting si se modifico un sitio existente.
- Desactivar el child theme y volver al tema anterior si el problema es visual.
- Revertir paginas importadas desde revisiones o backup si el problema es contenido.
- Desactivar plugins recien instalados si el problema viene de formularios, SMTP, cache o seguridad.
- Documentar causa, hora y accion tomada.

### Si falla despues de anunciar el sitio

- Evaluar impacto: caida total, error visual, formulario roto, SSL, enlaces o contenido.
- Si el sitio esta caido, restaurar backup completo del hosting.
- Si el admin funciona, volver temporalmente al tema anterior o tema padre.
- Si el problema es contenido, restaurar paginas desde backup o revisiones.
- Si el problema es formulario, desactivar el formulario y dejar contacto alternativo aprobado.
- Si el problema es SSL o dominio, coordinar con soporte del hosting.
- Comunicar internamente que se ejecuto rollback y que queda pendiente correccion.

### Criterios para activar rollback

- Home no carga.
- Admin no carga.
- Errores PHP visibles en produccion.
- SSL no funciona y el sitio queda marcado como inseguro.
- Formulario no envia ni muestra alternativa de contacto.
- Menu o enlaces principales llevan a errores.
- Se detecta exposicion de datos sensibles.

## 11. Como validar que SSL funciona

- [ ] Abrir el sitio usando `https://`.
- [ ] Confirmar que el navegador no muestra advertencias de certificado.
- [ ] Confirmar que HTTP redirige a HTTPS.
- [ ] Revisar que imagenes, CSS y JS cargan por HTTPS.
- [ ] Confirmar que no hay contenido mixto en la consola del navegador.
- [ ] Probar Home, Contacto y una pagina interna.
- [ ] Confirmar que el certificado corresponde al dominio correcto.

## 12. Como validar formularios

- [ ] Enviar prueba con datos ficticios aprobados.
- [ ] Confirmar mensaje de exito visible.
- [ ] Confirmar recepcion en el email interno aprobado.
- [ ] Confirmar que el remitente y asunto son claros.
- [ ] Probar validacion de campos requeridos.
- [ ] Probar desde movil.
- [ ] Confirmar que anti-spam no bloquea envios legitimos.
- [ ] Confirmar que no se piden campos sensibles.
- [ ] Confirmar que el texto breve de privacidad esta visible.
- [ ] Confirmar que SMTP entrega correctamente y no depende solo de PHP `mail()`.

## 13. Como validar enlaces

- [ ] Revisar menu principal completo.
- [ ] Revisar footer completo.
- [ ] Revisar CTA de Home.
- [ ] Revisar tarjetas de servicios y soluciones.
- [ ] Revisar enlaces a politica de privacidad si aplica.
- [ ] Confirmar slugs esperados: `/servicios/`, `/soluciones/`, `/casos-de-exito/`, `/sobre-nosotros/`, `/contacto/`.
- [ ] Confirmar que no hay enlaces a `localhost`, `127.0.0.1`, rutas locales ni archivos temporales.
- [ ] Confirmar que paginas inexistentes muestran 404 normal, no error tecnico.

## 14. Como validar responsive

- [ ] Revisar en movil angosto.
- [ ] Revisar en tablet.
- [ ] Revisar en desktop.
- [ ] Confirmar que header y menu no se solapan.
- [ ] Confirmar que tarjetas y columnas se apilan correctamente.
- [ ] Confirmar que botones se pueden tocar comodamente.
- [ ] Confirmar que texto no se corta ni desborda.
- [ ] Confirmar que footer conserva legibilidad.
- [ ] Confirmar que formularios son usables en movil.

## 15. Checklist final antes de anunciar el sitio

- [ ] Contenido aprobado.
- [ ] Menu aprobado.
- [ ] Footer aprobado.
- [ ] Datos de contacto aprobados.
- [ ] Formulario probado.
- [ ] SMTP probado.
- [ ] SSL validado.
- [ ] Enlaces permanentes validados.
- [ ] Responsive validado.
- [ ] SEO basico revisado.
- [ ] Imagenes optimizadas.
- [ ] Plugins minimos documentados.
- [ ] Backup post-migracion creado.
- [ ] Rollback disponible.
- [ ] No hay placeholders visibles pendientes.
- [ ] No hay `Sample Page`.
- [ ] No hay enlaces locales.
- [ ] No hay secretos publicados.
- [ ] Responsable comercial listo para responder contactos.
- [ ] Aprobacion final registrada.

## Decisiones pendientes antes de publicar

- Definir si la publicacion sera sobre dominio final, subdominio o staging.
- Definir si se importara contenido o se cargara manualmente.
- Elegir plugin de formulario.
- Elegir proveedor SMTP.
- Definir datos reales de contacto aprobados.
- Definir si se migraran medios existentes.
- Definir politica de retencion de formularios.
- Definir responsable y ventana de rollback.
