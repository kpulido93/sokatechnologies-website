# QA final de produccion

Fecha: 2026-07-09  
Rama auditada: `feature/web-demo-2026-gsap`  
App auditada: Astro en la raiz del repo

## Veredicto

Estado actual para produccion publica: `NO-GO`  
Estado actual para staging privado o review interna: `GO`

Bloqueos reales para produccion publica:

1. La ruta `404` sigue usando la pagina default de Astro y no una pagina propia de marca.
2. `politica-privacidad` y `terminos` siguen indexables y dentro del sitemap aunque el propio copy las declara como borradores legales.
3. El formulario sigue en `modo demo`; valida y comunica bien, pero no envia a un backend real.

## Alcance auditado

Se reviso:

- `git status`, build y type check
- preview local
- rutas principales y respuesta `404`
- metadata, canonical, OG, Twitter y JSON-LD
- robots y sitemap
- enlaces internos generados en `dist/`
- scroll, responsive y primer viewport de la home
- GSAP, reduced motion y riesgos de contenido oculto
- formulario
- rastros de secretos, `localhost`, `127.0.0.1` y `stillion`
- peso aproximado de `dist/`

## Comandos ejecutados

```bash
git status --short --branch
npm run build
npm run check
npm run preview -- --host 127.0.0.1 --port 4325
```

Comandos de verificacion adicionales:

- chequeo HTTP de rutas clave sobre preview
- chequeo mecanico de metadata y `h1` en `dist/`
- chequeo mecanico de `href` y `src` internos en `dist/`
- chequeo de `robots.txt` y sitemap
- auditoria con Chromium headless para medir hero y primer bloque visible
- busqueda de referencias prohibidas y patrones obvios de secretos

## Resultado resumido

| Area | Resultado | Nota |
|---|---|---|
| Build | `PASS` | `npm run build` completo |
| Type check | `PASS` | `npm run check` sin errores |
| Preview | `PASS` | `astro preview` levantado en `http://127.0.0.1:4325/` |
| Rutas | `PASS` | principales en `200`, inexistente en `404` |
| 404 | `FAIL` | responde `404`, pero con template default de Astro |
| Metadata | `PASS` | `title`, `description`, `canonical`, OG, Twitter y JSON-LD en todas las rutas auditadas |
| H1 | `PASS` | una sola etiqueta `h1` por pagina auditada |
| Links internos | `PASS` | sin enlaces rotos obvios en `dist/` |
| Robots | `PASS` | generado correctamente |
| Sitemap | `PASS` con observacion | generado, pero incluye paginas legales borrador |
| Responsive | `PASS` con observacion | home correcta en desktop y mobile; falta QA manual en mas navegadores |
| Scroll vacio | `PASS` | el bloque siguiente aparece inmediatamente despues del hero en mobile |
| Animaciones | `PASS` estructural | GSAP solo cliente, sin `markers`, sin `pinning` agresivo |
| Reduced motion | `PASS` estructural | CSS y JS respetan `prefers-reduced-motion` |
| Formulario | `PARTIAL` | accesible y endurecido, pero sigue en modo demo |
| No secretos | `PASS` | sin coincidencias reales; solo placeholders seguros en `.env.example` |
| No datos reales | `PASS` | casos anonimizados, sin capturas ni clientes reales |
| No referencias prohibidas | `PASS` | sin `stillion`, `localhost` ni `127.0.0.1` en `dist`, `src` o `public` |
| Performance | `PARTIAL` | build ligera, pero falta Lighthouse real y aun carga Google Fonts remotas |

## Evidencia

### Build y rutas

Resultados confirmados en preview:

- `200 /`
- `200 /servicios/`
- `200 /servicios/software-a-medida/`
- `200 /servicios/automatizaciones/`
- `200 /servicios/dashboards/`
- `200 /servicios/infraestructura-soporte/`
- `200 /servicios/sitios-web-corporativos/`
- `200 /servicios/mantenimiento-mejora-continua/`
- `200 /productos/`
- `200 /productos/portik/`
- `200 /productos/autoinventario/`
- `200 /productos/autowhatsapp/`
- `200 /casos/`
- `200 /contacto/`
- `200 /diagnostico/`
- `200 /politica-privacidad/`
- `200 /terminos/`
- `200 /demos/ecommerce/`
- `404 /ruta-inexistente-soka/`

`npm run build` genero 18 paginas estaticas sin errores.  
`npm run check` reporto `0 errors`, `0 warnings`, `0 hints`.

### Metadata, semantica y enlaces

Chequeo mecanico sobre `dist/`:

- todas las paginas auditadas tienen `title`
- todas tienen `meta description`
- todas tienen `canonical`
- todas tienen Open Graph basico
- todas tienen Twitter Card basica
- todas tienen JSON-LD
- todas tienen exactamente un `h1`
- no se detectaron `href` o `src` internos rotos en la salida generada

### Robots y sitemap

`dist/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://sokatechnologies.com/sitemap-index.xml
```

Estado del sitemap:

- `dist/sitemap-index.xml` generado
- `dist/sitemap-0.xml` generado
- `18` URLs listadas
- incluye `/politica-privacidad/`
- incluye `/terminos/`

Observacion:

- esto no rompe build, pero no deberia salir publico mientras el propio contenido siga marcado como borrador legal

### Scroll vacio y responsive

Resultado actual: `PASS`

Hallazgo:

- El problema de scroll vacio debajo del hero ya no se reproduce en la home auditada.
- En mobile el siguiente bloque util arranca practicamente al terminar el hero.
- En desktop el hero mantiene presencia editorial, pero sin dejar un tramo muerto antes de la franja siguiente.

Metricas capturadas con Chromium headless:

- desktop `1440x900`
  - `hero.top = 97`
  - `hero.height = 892`
  - `metricsBand.top = 989`
- mobile `390x844`
  - `hero.top = 245`
  - `hero.height = 603`
  - `heroVisual.display = none`
  - `metricsBand.top = 848`

Interpretacion:

- en mobile, el bloque siguiente entra inmediatamente despues del hero y ya no hay un scroll vacio evidente
- el visual del hero se oculta en `390px` para priorizar ritmo y legibilidad

Capturas de evidencia:

- `/home/kevin/soka-qa/qa-home-desktop-1440x900-20260709.png`
- `/home/kevin/soka-qa/qa-home-mobile-390x844-20260709.png`

### 404

Resultado actual: `FAIL`

Hallazgo:

- la ruta inexistente devuelve `404` correcto a nivel HTTP
- pero el HTML corresponde a la pagina default de Astro en ingles
- no existe `dist/404.html` propio de marca

Impacto:

- mala experiencia de usuario
- pagina fuera del tono visual y comercial
- senal de sitio no terminado antes de produccion publica

### Animaciones y reduced motion

Resultado actual: `PASS` estructural

Hallazgos:

- `ScrollTrigger` se registra una sola vez
- la inicializacion ocurre solo en cliente
- `gsap.matchMedia()` limita timelines complejas a `prefers-reduced-motion: no-preference`
- `ScrollTrigger.refresh()` se agenda de forma controlada y no en bucle
- no se detectaron `markers`
- no se detectaron `pin` ni `pinSpacing`
- no se detectaron reglas CSS que oculten por defecto las clases `.js-*` cuando JS falla

Observacion:

- sigue faltando una pasada manual en navegadores reales para validar sensacion y foco con teclado, pero a nivel estructural la arquitectura de motion esta bien encaminada

### Formulario

Resultado actual: `PARTIAL`

Hallazgos:

- el formulario tiene labels, consentimiento, honeypot y mensajes de estado
- en preview se confirma `data-form-mode="demo"`
- la UI explica que el envio real aun no esta conectado
- existe CTA alternativo por correo

Impacto:

- sirve para demo, staging y review interna
- no deberia salir a produccion publica sin endpoint real, manejo de errores real y variables productivas

### Seguridad y contenido

Resultado actual: `PASS`

Chequeos realizados:

- sin coincidencias para `stillion` en `dist`, `src` o `public`
- sin coincidencias para `localhost` o `127.0.0.1` en la build publica
- sin patrones obvios de secretos reales en el repo auditado
- las coincidencias con `example.com` estan solo en `.env.example` y son placeholders esperados
- los casos visibles siguen anonimizados
- no se detectaron nombres reales de clientes, capturas reales ni datos sensibles en la salida generada

### Performance

Resultado actual: `PARTIAL`

Datos rapidos:

- `dist/`: `540K`
- `dist/_astro/`: `144K`
- JS principal aprox.: `120 KB`
- CSS principal aprox.: `20 KB`
- archivos generados en `dist`: `25`

Observaciones:

- el peso base es razonable para staging
- falta una corrida real de Lighthouse o Web Vitals antes de publicar
- se cargan fuentes remotas de Google, lo que introduce peticiones a terceros y una pequena dependencia extra de red

## Pendientes antes de publicar

Bloqueantes:

1. Crear una `404` propia y alineada con la marca.
2. Marcar `politica-privacidad` y `terminos` como `noindex` o excluirlas del sitemap hasta revision legal final.
3. Conectar el formulario a un proveedor real seguro y validar flujo de exito/error en entorno no demo.

Importantes, pero no bloqueantes para staging:

1. Ejecutar Lighthouse en mobile y desktop.
2. Hacer QA manual con teclado y lector de pantalla basico.
3. Evaluar si conviene self-host de fuentes para reducir dependencia externa.
4. Revisar nuevamente redirects y estrategia de migracion antes de exponer trafico real.

## Decision recomendada

- `GO` para staging privado o revision interna
- `NO-GO` para produccion publica hasta cerrar 404, legal indexable y formulario real

