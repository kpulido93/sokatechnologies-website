# Validación de auditoría visual y formularios demo

Rama: `codex/auditoria-visual-formularios`

## Cobertura

El smoke test local recorre las 22 páginas HTML generadas en los tres viewports
actuales:

- desktop: 1440 × 900
- tablet: 768 × 1024
- mobile: 375 × 812

Rutas cubiertas: `/`, `/servicios/`, las siete páginas de servicios,
`/productos/`, las tres páginas de productos, `/contacto/`, `/diagnostico/`,
`/auditoria/`, `/casos/`, `/demos/ecommerce/`, `/nosotros/`,
`/politica-privacidad/`, `/proyectos/` y `/terminos/`.

También se verificaron 21 FAQ, overflow global e interno, foco visible,
cabecera móvil, honeypot y modo demo.

## Formularios

Contacto y Diagnóstico pasaron el flujo completo en modo demo:

- 5 controles inválidos detectados por formulario.
- Mensajes asociados mediante `aria-errormessage` y `aria-describedby`.
- Foco situado en el primer error.
- Transición de error a éxito demo comprobada.
- 0 errores de campo visibles al completar datos sintéticos.
- 0 llamadas `fetch`; no se enviaron solicitudes ni se almacenaron datos.

## Resultado de validaciones

- `npm test`: 60/60 pruebas aprobadas.
- `npm run test:local-ui`: aprobado; 22 rutas × 3 viewports.
- `npm run check`: 0 errores, warnings o hints.
- `npm run build`: 22 páginas generadas.
- `git diff --check`: aprobado.

## Pendientes

- `VIS-02`: recomendación pendiente; no se implementó en esta auditoría.
- `LEGAL-01`: pendiente de texto aprobado por el responsable y revisión jurídica.

## Evidencias

- [Portada](after/home-desktop.png)
- [Mapa de portada](after/home-map-desktop.png)
- [Cabecera móvil](after/contacto-mobile.png)
- [Formulario de Contacto](after/contacto-form-desktop.png)
- [Formulario de Diagnóstico](after/diagnostico-form-desktop.png)
- [Proyectos](after/proyectos-cards-desktop.png)

La revisión fue exclusivamente local. No se desplegaron cambios ni se tocaron
WordPress, Docker, Cloudflare, DNS, producción o infraestructura.
