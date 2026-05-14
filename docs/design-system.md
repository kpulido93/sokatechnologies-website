# Design System

## Objetivo

Definir una base visual sobria, tecnologica y B2B para la web publica de SokaTechnologies en WordPress.

El sistema visual vive principalmente en:

- `public_html/wp-content/themes/sokatechnologies/theme.json`
- `public_html/wp-content/themes/sokatechnologies/assets/css/corporate.css`
- `wp-theme/sokatechnologies-child-theme/theme.json`
- `wp-theme/sokatechnologies-child-theme/assets/css/corporate.css`

`public_html/` es solo entorno local. La copia versionable debe mantenerse en `wp-theme/sokatechnologies-child-theme/`.

## Identidad visual

La direccion visual debe comunicar:

- Profesionalidad.
- Confianza operativa.
- Tecnologia aplicada.
- Claridad comercial.
- Conversion sin apariencia agresiva.

## Paleta

- `Ink` / `--soka-ink`: base oscura para header visual, CTA y footer.
- `Navy` / `--soka-navy`: azul oscuro corporativo.
- `Blue` / `--soka-blue`: accion principal, enlaces y botones.
- `Cyan` / `--soka-cyan`: acento tecnologico.
- `Emerald` / `--soka-emerald`: acento secundario para beneficios o checks.
- `Mist` / `--soka-mist`: fondos claros de seccion.
- `Surface` / `--soka-white`: superficies y tarjetas.
- `Text`, `Muted`, `Border`: texto, texto secundario y bordes.

## Tipografia

Se usa tipografia system sans para evitar dependencias externas y mantener buena carga:

```text
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif
```

Reglas:

- Titulares con peso alto y linea compacta.
- Parrafos con altura de linea amplia.
- Eyebrows en mayusculas, sin letter spacing negativo.
- No escalar fuentes directamente con ancho de viewport.

## Componentes CSS

Clases principales:

- `.soka-hero`: hero oscuro con acentos tecnologicos.
- `.soka-hero-grid`: layout de hero con contenido y panel lateral.
- `.soka-hero-copy`: bloque textual del hero.
- `.soka-hero-panel`: panel de prueba social, servicios o resumen.
- `.soka-section`: seccion principal.
- `.soka-section-light`: seccion con fondo claro.
- `.soka-section-compact`: seccion de menor altura.
- `.soka-page-header`: cabecera de pagina interna.
- `.soka-card-grid`, `.soka-card-grid-2`: grids de servicios con maximo 3 columnas en desktop, 2 en tablet y 1 en movil.
- `.soka-card`, `.soka-card-featured`: tarjetas.
- `.soka-benefit-grid`, `.soka-benefit`: beneficios.
- `.soka-check-list`: lista de checks.
- `.soka-process`, `.soka-process-step`: proceso numerado.
- `.soka-metric-row`, `.soka-metric`: metricas o resultados.
- `.soka-dark-cta`: CTA final.
- `.soka-button-row`: agrupacion de botones.
- `.soka-eyebrow`, `.soka-kicker`: etiquetas superiores.
- `.soka-muted`, `.soka-lead`: variantes de texto.

## Bloques WordPress

El tema mantiene compatibilidad con el editor de bloques:

- `theme.json` define paleta, tamanos tipograficos, espaciados y estilos base.
- `functions.php` activa `editor-styles`.
- `corporate.css` se carga en frontend y editor.

Al crear contenido, preferir bloques nativos de WordPress con clases `soka-*` en "Avanzado > Clase CSS adicional".

## Footer y navegacion

El CSS reduce la apariencia de plantilla default:

- Header blanco solido, sticky, con marca tipografica, simbolo visual y margen de scroll para no cubrir secciones ancladas.
- Navegacion con estados hover discretos.
- Footer oscuro, sobrio y consistente con la marca.

El contenido real del menu se gestiona desde WordPress. Si aparece `Sample Page`, corregirlo desde el admin local, no desde CSS.

Como medida local de limpieza, `functions.php` excluye `sample-page` del bloque automatico de paginas. La pagina no se borra ni se modifica en base de datos.

El footer oculta visualmente enlaces placeholder con `href="#"` para evitar apariencia de plantilla mientras se define el contenido final.

## Validacion

Antes de aceptar cambios visuales:

- [ ] La home se ve profesional en `http://127.0.0.1:8088`.
- [ ] Las paginas internas no quedan con apariencia de plantilla default.
- [ ] Header, menu y footer se ven consistentes.
- [ ] Botones y enlaces tienen estados hover/focus.
- [ ] Las tarjetas no se superponen en movil.
- [ ] El editor de bloques carga estilos sin errores visibles.
- [ ] `public_html/` no se versiona.
- [ ] Los cambios conservables estan copiados en `wp-theme/sokatechnologies-child-theme/`.
