# Uso de CSS en WordPress

## Objetivo

Explicar como aplicar manualmente las clases visuales `.soka-*` dentro del editor de bloques de WordPress, sin tocar produccion desde Codex y sin depender de plugins visuales innecesarios.

Esta guia no autoriza cambios en WordPress core, tema padre, plugins ni cPanel.

## Ruta del CSS principal

Ruta local donde se prueban estilos en la instalacion WordPress de trabajo:

```text
public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css
```

Ruta canonica recomendada para conservar cambios revisables del child theme:

```text
wp-theme/sokatechnologies-child-theme/assets/css/corporate.css
```

Reglas:

- `public_html/` es entorno local, no fuente versionada principal.
- Los cambios visuales que deban conservarse deben migrarse o replicarse en la ruta canonica versionada.
- No modificar WordPress core, tema padre, plugins, `wp-config.php`, `.cpanel.yml` ni archivos de produccion.

## Reglas de layout actuales

- Contenedor principal: `max-width: 1120px`.
- Contenedores de texto: `max-width: 760px`.
- Grids de tarjetas: maximo 3 columnas en desktop, 2 en tablet y 1 en movil; las variantes de dos columnas suben a 3 cuando tienen 5 o mas tarjetas.
- En movil, las tarjetas pasan a una columna.
- Las tarjetas mantienen `min-width` efectivo de 280px cuando el viewport lo permite.
- Los headings usan `overflow-wrap: normal`, `word-break: normal` y `hyphens: manual`.
- Los tamanos principales usan `clamp()` para evitar saltos bruscos entre desktop, tablet y movil.
- El header sticky usa fondo blanco solido, `z-index` alto y conserva espacio de scroll con `scroll-padding-top` y `scroll-margin-top` en secciones anclables.
- Las imagenes de pagina usan clases como `soka-hero-media`, `soka-page-image` y `soka-card__media`.

## Como aplicar clases en bloques

En WordPress Admin:

1. Abrir la pagina en el editor de bloques.
2. Seleccionar el bloque que recibira la clase: Grupo, Columnas, Boton, Lista, Formulario o Contenedor equivalente.
3. Abrir el panel lateral de ajustes.
4. Desplegar `Avanzado`.
5. En `Clase(s) CSS adicional(es)`, escribir las clases separadas por espacios.
6. Guardar solo en entorno local o staging aprobado.
7. Revisar desktop, tablet y movil antes de publicar.

Buenas practicas:

- Aplicar clases de layout a bloques Grupo o Contenedor.
- Aplicar clases de boton al bloque Boton o al enlace revisado.
- Usar clases con prefijo `soka-`.
- Usar una clase por responsabilidad visual.
- Mantener textos, enlaces y formularios revisados antes de publicar.

## Ejemplos de uso

### Hero interno

Uso recomendado para paginas como Servicios, Sobre nosotros o Contacto.

Bloque exterior:

```text
soka-internal-hero
```

Bloque interno de ancho controlado:

```text
soka-container soka-internal-hero__content
```

Contenido sugerido:

- H1 claro.
- Texto introductorio breve.
- Boton opcional con `soka-button soka-button--primary`.

### Seccion clara

Bloque exterior:

```text
soka-section soka-section--soft
```

Bloque interno:

```text
soka-container
```

Uso:

- Explicar beneficios.
- Presentar proceso.
- Separar contenido largo sin fondos pesados.

### Seccion oscura

Bloque exterior:

```text
soka-section soka-section--dark
```

Bloque interno:

```text
soka-container
```

Uso:

- CTA destacado.
- Mensaje de confianza.
- Bloque de cierre de pagina.

Revisar contraste de texto y botones antes de publicar.

### Grid de servicios

Contenedor del grid:

```text
soka-card-grid
```

Comportamiento responsive: 3 columnas como maximo en desktop, 2 en tablet y 1 en movil.

Cada tarjeta:

```text
soka-card
```

Elementos internos opcionales:

```text
soka-card__icon
soka-card__media
soka-card__title
soka-card__text
soka-card__list
soka-card__link
```

Uso:

- Servicios principales.
- Capacidades tecnicas.
- Bloques de solucion.

### Tarjeta de servicio

Clase en el bloque Grupo de la tarjeta:

```text
soka-card
```

Estructura recomendada:

1. Icono o inicial con `soka-card__icon`.
2. Imagen opcional con `soka-card__media`.
3. Titulo con `soka-card__title`.
4. Texto breve con `soka-card__text`.
5. Lista corta con `soka-card__list`.
6. Enlace discreto con `soka-card__link`.

No incluir logos o nombres reales de clientes sin autorizacion.

### CTA final

Opcion sobria:

```text
soka-final-cta
```

Opcion tipo tarjeta:

```text
soka-cta-card
```

Fila de botones:

```text
soka-button-row
```

Boton principal:

```text
soka-button soka-button--primary
```

Boton secundario:

```text
soka-button soka-button--secondary
```

Regla editorial: evitar textos genericos como `Click aqui` o `Mas informacion`. Preferir acciones concretas como `Solicitar diagnostico`, `Agendar llamada` o `Contar mi proceso`.

### Formulario de diagnostico

Contenedor del formulario:

```text
soka-form
```

Grid de campos:

```text
soka-form__grid
```

Campo individual:

```text
soka-form__field
```

Campo de ancho completo:

```text
soka-form__field soka-form__field--full
```

Acciones:

```text
soka-form__actions
```

Privacidad:

```text
soka-form__privacy
```

Reglas:

- Mantener labels visibles.
- No usar placeholders como unica etiqueta.
- No pedir datos sensibles.
- No incluir correos reales o datos internos sin aprobacion.
- Probar envio, errores y mensaje de exito en entorno aprobado.

## Que no hacer

- No pegar CSS inline en bloques o paginas.
- No usar `!important` sin una razon documentada.
- No instalar plugins visuales innecesarios.
- No tocar tema padre, WordPress core ni plugins de terceros.
- No editar templates desde esta guia.
- No guardar cambios directamente en produccion desde Codex.
- No incluir credenciales, tokens, llaves, datos de cPanel, backups o SQL.
- No publicar logos, nombres de clientes, capturas o datos reales sin autorizacion.
- No depender de IDs generados automaticamente por WordPress.
- No agregar selectores globales agresivos para `body`, `a`, `button`, `input`, `h1` o `p`.

## Checklist antes de publicar cambios visuales

- [ ] La pagina tiene un H1 claro.
- [ ] El CTA principal usa una accion concreta.
- [ ] No hay varios botones primarios compitiendo en la misma seccion.
- [ ] Las tarjetas tienen espaciado coherente y texto legible.
- [ ] Los formularios tienen labels visibles y campos necesarios.
- [ ] Hay referencia de privacidad si se recolectan datos personales.
- [ ] No hay placeholders visibles no aprobados.
- [ ] No hay nombres reales de clientes sin autorizacion.
- [ ] No hay logos, capturas, dominios, usuarios o correos internos.
- [ ] No hay credenciales, tokens, datos de cPanel, backups ni SQL.
- [ ] Header, footer, CTAs y enlaces apuntan a rutas aprobadas.
- [ ] No aparecen enlaces hacia `localhost`, `127.0.0.1` o rutas internas.
- [ ] No hay errores PHP visibles.
- [ ] El admin de WordPress sigue accesible si se probo localmente.

## Checklist responsive

### Movil

- [ ] No hay texto cortado, solapado o fuera de pantalla.
- [ ] No hay scroll horizontal inesperado.
- [ ] Los botones tienen area tactil suficiente.
- [ ] Las grillas pasan a una columna cuando corresponde.
- [ ] Formularios, labels y mensajes de error son legibles.

### Tablet

- [ ] Las columnas se reorganizan de forma natural.
- [ ] Las tarjetas no quedan comprimidas.
- [ ] Navegacion, CTAs y formularios son faciles de usar con tactil.
- [ ] El hero mantiene jerarquia clara.

### Desktop

- [ ] El contenido no queda demasiado ancho.
- [ ] Las grillas conservan alineacion y ritmo.
- [ ] Hover y focus son visibles en botones y enlaces.
- [ ] Header y footer no se ven vacios o saturados.

## Flujo recomendado

1. Definir una tarea visual pequena.
2. Aplicar clases `.soka-*` en el editor local o staging aprobado.
3. Revisar Home, pagina interna relacionada y Contacto si aplica.
4. Validar movil, tablet y desktop.
5. Revisar que no hay secretos ni datos reales no autorizados.
6. Documentar cualquier pendiente.
7. Migrar al child theme versionado solo los cambios que deban conservarse.
