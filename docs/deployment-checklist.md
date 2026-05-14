# Deployment Checklist

## Objetivo

Definir un proceso seguro para publicar la web WordPress de SokaTechnologies desde el entorno local hacia un hosting compartido con cPanel cuando el diseno y el contenido esten aprobados.

Este documento es una guia de preparacion. No autoriza despliegues automaticos ni contiene credenciales.

## Reglas principales

- No ejecutar despliegues a produccion desde Codex.
- No crear `.cpanel.yml` sin aprobacion explicita.
- No incluir credenciales, tokens, llaves privadas, dumps SQL, backups ni datos reales de cPanel.
- No leer ni mostrar el contenido de `public_html/wp-config.php`.
- No asumir servidor dedicado, acceso root, Docker, CI/CD ni permisos fuera de un hosting compartido con cPanel.
- `public_html/` es un entorno local ignorado por Git para validar en `http://127.0.0.1:8088`; no es fuente versionada ni mecanismo de despliegue.
- Solo se conservan cambios del tema si tambien se copian a `wp-theme/sokatechnologies-child-theme/`.

## Alcance publicable

Se puede preparar para entrega manual:

- Child theme propio en `wp-theme/sokatechnologies-child-theme/`.
- CSS, `theme.json`, partes de template y assets propios del tema.
- Contenido aprobado en `content/` o `website/wordpress/`.
- Snippets revisados, si aplican.
- Documentacion operativa.

No se debe publicar desde este repo:

- WordPress core.
- `wp-config.php`.
- `wp-admin/`.
- `wp-includes/`.
- Plugins completos de terceros.
- Tema padre completo.
- Instalaciones completas o parciales de `public_html/`.
- `uploads/`.
- Base de datos sin un proceso de migracion aprobado.
- Backups, `.sql`, `.zip` sensibles o credenciales.

## 1. Revision de contenido

- [ ] Confirmar que las paginas principales estan completas: Inicio, Servicios, Soluciones, Casos de exito, Sobre nosotros, Blog y Contacto.
- [ ] Revisar ortografia, tono B2B y consistencia de marca.
- [ ] Confirmar que no hay nombres reales de clientes sin aprobacion.
- [ ] Confirmar que no hay precios definitivos si no fueron aprobados.
- [ ] Confirmar que no hay datos internos, credenciales, usuarios reales ni informacion sensible.
- [ ] Revisar que los placeholders visibles esten resueltos o identificados antes de publicar.

## 2. Revision de menu

- [ ] Confirmar menu principal: Inicio, Servicios, Soluciones, Casos de exito, Sobre nosotros, Blog, Contacto.
- [ ] Confirmar que no aparece `Sample Page`.
- [ ] Confirmar que cada enlace apunta a una pagina publicada.
- [ ] Confirmar que el orden del menu coincide con `docs/content-structure.md`.
- [ ] Revisar menu en desktop, tablet y movil.

## 3. Revision de footer

- [ ] Confirmar que el footer no muestra enlaces genericos de WordPress.
- [ ] Confirmar columnas: SokaTechnologies, Servicios, Empresa y Contacto.
- [ ] Reemplazar placeholders de email y WhatsApp solo con datos aprobados.
- [ ] Confirmar que el texto de cobertura geografica es correcto.
- [ ] Revisar enlaces del footer en desktop, tablet y movil.

## 4. Revision responsive

- [ ] Probar Home en ancho movil, tablet y desktop.
- [ ] Probar Servicios, Soluciones, Casos de exito, Sobre nosotros y Contacto.
- [ ] Confirmar que no hay texto solapado.
- [ ] Confirmar que botones y enlaces son tactiles en movil.
- [ ] Confirmar que tarjetas, columnas y CTA se reorganizan correctamente.
- [ ] Confirmar que el header y el footer no rompen el layout.

## 5. Revision de enlaces

- [ ] Revisar enlaces internos de menu, footer, CTA y tarjetas.
- [ ] Confirmar que no hay enlaces hacia `localhost`, `127.0.0.1` o rutas locales.
- [ ] Confirmar que no hay enlaces rotos.
- [ ] Confirmar que los enlaces externos abren correctamente.
- [ ] Confirmar que telefonos, email y WhatsApp usan valores aprobados.

## 6. Revision de formularios

- [ ] Definir que plugin o mecanismo de formulario se usara en produccion.
- [ ] Confirmar que el formulario envia correos al destinatario aprobado.
- [ ] Probar envio exitoso.
- [ ] Probar mensajes de error.
- [ ] Confirmar que no se exponen emails internos innecesarios.
- [ ] Confirmar proteccion antispam compatible con cPanel compartido.
- [ ] Confirmar politica de privacidad si se recolectan datos personales.

## 7. Revision SEO basica

- [ ] Configurar titulo del sitio y descripcion corta.
- [ ] Revisar title/meta description de paginas principales.
- [ ] Confirmar un solo H1 por pagina principal.
- [ ] Confirmar jerarquia clara de H2 y H3.
- [ ] Revisar slugs limpios: `/servicios/`, `/soluciones/`, `/casos-de-exito/`, `/sobre-nosotros/`, `/contacto/`.
- [ ] Confirmar que la Home esta configurada como pagina frontal.
- [ ] Revisar sitemap si se usa plugin SEO.
- [ ] Confirmar indexacion solo cuando el sitio este listo para publicarse.

## 8. Revision de imagenes

- [ ] Confirmar que las imagenes tienen licencia o aprobacion de uso.
- [ ] Optimizar peso antes de subir.
- [ ] Usar nombres de archivo descriptivos.
- [ ] Agregar texto alternativo util.
- [ ] Evitar imagenes con datos sensibles visibles.
- [ ] Confirmar que no se suben archivos fuente innecesarios.

## 9. Backup local

- [ ] Confirmar que el estado local funciona en `http://127.0.0.1:8088`.
- [ ] Confirmar que `public_html/` sigue ignorado por Git.
- [ ] Exportar contenido local solo si el proceso fue aprobado.
- [ ] Guardar backup local fuera del repo.
- [ ] No versionar backups ni dumps SQL.
- [ ] Documentar fecha, alcance y responsable del backup.

## 10. Exportacion y migracion

- [ ] Definir si se migrara solo tema/contenido o instalacion completa.
- [ ] Preparar ZIP limpio del child theme desde `wp-theme/sokatechnologies-child-theme/` si aplica.
- [ ] Exportar paginas con herramienta aprobada si se requiere migrar contenido.
- [ ] Revisar que la exportacion no incluya usuarios, credenciales, logs ni datos sensibles.
- [ ] No migrar `wp-config.php` local.
- [ ] No migrar `uploads/` sin revision previa.
- [ ] Mantener una copia de rollback antes de tocar produccion.

## 11. Instalacion WordPress en cPanel

- [ ] Crear o preparar instalacion WordPress desde herramientas del hosting o instalador aprobado.
- [ ] Confirmar dominio o subdominio destino.
- [ ] Confirmar ruta de instalacion en cPanel.
- [ ] Instalar el tema padre requerido, por ejemplo `twentytwentyfive`, si el child theme depende de el.
- [ ] Subir e instalar el child theme propio.
- [ ] Activar el child theme solo despues de verificar dependencias.
- [ ] No editar WordPress core.

## 12. SSL

- [ ] Activar SSL desde cPanel o proveedor del hosting.
- [ ] Confirmar que el dominio responde por HTTPS.
- [ ] Forzar HTTPS desde la configuracion aprobada del sitio o hosting.
- [ ] Revisar que no haya contenido mixto.
- [ ] Confirmar redireccion de HTTP a HTTPS.

## 13. PHP

- [ ] Confirmar version PHP compatible con WordPress, tema y plugins.
- [ ] Revisar limites basicos disponibles en hosting compartido: memoria, upload max size y tiempo de ejecucion.
- [ ] Confirmar extensiones PHP requeridas por WordPress.
- [ ] Evitar cambios globales no necesarios en cPanel.
- [ ] Registrar cualquier ajuste aplicado sin incluir datos sensibles.

## 14. Base de datos

- [ ] Crear base de datos y usuario desde cPanel solo durante la instalacion aprobada.
- [ ] No documentar credenciales.
- [ ] Confirmar prefijo de tablas y configuracion de WordPress sin exponer secretos.
- [ ] Hacer backup antes de cualquier importacion.
- [ ] Probar importacion en staging o entorno seguro si esta disponible.
- [ ] No ejecutar reemplazos masivos sin backup y validacion.

## 15. Plugins minimos

- [ ] Instalar solo plugins necesarios.
- [ ] Priorizar formulario, SEO, seguridad/cache si aplica y backup.
- [ ] Evitar plugins duplicados por funcion.
- [ ] Confirmar compatibilidad con hosting compartido.
- [ ] Activar y configurar uno por uno.
- [ ] Documentar plugins aprobados en `docs/plugins.md`.

## 16. Seguridad

- [ ] Usar usuarios individuales, no cuentas compartidas.
- [ ] Aplicar contrasenas fuertes y 2FA si el hosting o WordPress lo permite.
- [ ] Mantener WordPress, tema padre y plugins actualizados.
- [ ] Desactivar edicion de archivos desde admin si la politica del sitio lo requiere.
- [ ] Confirmar permisos de archivos compatibles con cPanel.
- [ ] Confirmar que no hay backups publicos en `public_html/`.
- [ ] Confirmar que no hay dumps SQL accesibles por web.
- [ ] Confirmar que no se publico ningun archivo sensible del repo.

## 17. Pruebas post-publicacion

- [ ] Abrir Home por HTTPS.
- [ ] Probar navegacion principal y footer.
- [ ] Probar paginas principales.
- [ ] Probar formulario de contacto.
- [ ] Revisar responsive en movil y desktop.
- [ ] Revisar consola del navegador.
- [ ] Revisar errores PHP visibles.
- [ ] Revisar enlaces permanentes.
- [ ] Confirmar que el admin de WordPress carga correctamente.
- [ ] Confirmar que no aparece contenido generico como `Sample Page`.

## 18. Backup post-publicacion

- [ ] Crear backup completo desde cPanel o herramienta aprobada despues de validar.
- [ ] Incluir archivos y base de datos si el proceso lo permite.
- [ ] Guardar backup fuera del directorio publico.
- [ ] No subir backup al repo.
- [ ] Registrar fecha, alcance y ubicacion segura del backup sin credenciales.

## 19. Checklist mensual

- [ ] Revisar actualizaciones de WordPress, tema padre y plugins.
- [ ] Hacer backup antes de actualizar.
- [ ] Probar Home, Contacto y paginas principales despues de actualizar.
- [ ] Revisar formularios y entregabilidad de correo.
- [ ] Revisar SSL y vencimiento.
- [ ] Revisar usuarios administradores.
- [ ] Revisar plugins inactivos o innecesarios.
- [ ] Revisar backups antiguos y politica de retencion.
- [ ] Revisar errores en logs si el hosting los expone.
- [ ] Revisar rendimiento basico y peso de imagenes nuevas.

## Rollback

Opciones de reversa si una publicacion falla:

- Restaurar backup del hosting.
- Restaurar version anterior del child theme.
- Desactivar child theme y activar tema padre temporalmente si el admin sigue accesible.
- Revertir contenido desde backup o revision de WordPress.
- Revertir PR o commit del repo si el problema viene de archivos versionados.

Antes de revertir, documentar que fallo, que se cambio y que backup se usara.

## Notas sobre Git en cPanel

cPanel permite configurar despliegues mediante `.cpanel.yml`, pero este archivo puede enviar archivos hacia directorios productivos. No usarlo hasta aprobar una estrategia segura, revisable y con rollback probado.
