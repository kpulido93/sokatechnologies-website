# Assets en WordPress

Esta guia explica como preparar y cargar los assets visuales de SokaTechnologies en WordPress sin versionar una instalacion completa ni tocar produccion desde el entorno local.

## Alcance

Se puede documentar, preparar y versionar:

- Logos, isotipos e iconos propios.
- Imagenes web optimizadas y sin datos sensibles.
- CSS revisable en `snippets/css/`.
- Instrucciones para cargar assets desde el panel de WordPress.

No se debe versionar:

- `wp-config.php`.
- WordPress core.
- Plugins de terceros.
- `public_html/wp-content/uploads/`.
- Backups, dumps SQL o exportaciones.
- Credenciales, tokens o datos reales de cPanel.

## Cargar logo

1. Preparar el logo en `assets/brand/`.
2. Confirmar que existe version para fondo claro y fondo oscuro si aplica.
3. Optimizar el SVG o generar PNG fallback si WordPress no permite SVG en el flujo aprobado.
4. En WordPress, ir a Apariencia y usar el area de identidad del sitio o editor del tema.
5. Cargar el logo aprobado desde la biblioteca de medios.
6. Verificar header, footer y vista movil.

No instalar plugins solo para permitir SVG sin aprobacion explicita.

## Cargar favicon

1. Preparar `favicon-512.png` en `assets/brand/`.
2. Verificar que sea cuadrado, legible y sin bordes cortados.
3. En WordPress, cargarlo como icono del sitio.
4. Comprobar pestana del navegador, acceso directo movil y vista retina.

## Cargar Open Graph image

1. Preparar `og-image-default.png` en `assets/brand/`.
2. Usar 1200 x 630 px.
3. Evitar texto pequeno o informacion sensible.
4. Cargarla como imagen social por defecto mediante el plugin SEO ya aprobado, si existe.
5. Si no hay plugin SEO aprobado, documentar el pendiente y no instalar uno desde esta tarea.

## Cargar imagenes de paginas

1. Preparar imagenes en `assets/web/` segun su uso: hero, servicios, casos, blog, contacto o errores.
2. Optimizar formato, peso y dimensiones antes de subir.
3. Cargar en la biblioteca de medios de WordPress.
4. Completar texto alternativo claro y util.
5. Insertar en bloques, patrones o plantillas aprobadas.
6. Revisar desktop, tablet y movil.

## Checklist antes de cargar

- [ ] El asset esta en una carpeta correcta del repo.
- [ ] El nombre es descriptivo y estable.
- [ ] El formato es adecuado para el uso.
- [ ] El peso esta optimizado.
- [ ] Hay licencia comercial o es asset propio.
- [ ] No contiene datos de clientes, usuarios, infraestructura ni cPanel.
- [ ] No contiene metadatos sensibles.
- [ ] No requiere instalar plugins nuevos.

## Checklist despues de cargar

- [ ] El asset se ve nitido en desktop.
- [ ] El asset se ve correcto en tablet.
- [ ] El asset se ve correcto en movil.
- [ ] No genera scroll horizontal.
- [ ] No tapa texto ni CTAs.
- [ ] El contraste es suficiente.
- [ ] El texto alternativo esta completo si aplica.
- [ ] El sitio sigue navegable.
- [ ] No hay errores PHP visibles.
- [ ] El admin de WordPress sigue accesible si se probo en local.
