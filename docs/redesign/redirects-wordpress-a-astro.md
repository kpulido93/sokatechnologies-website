# Redirects WordPress a Astro

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Objetivo

Preparar un mapa inicial de redirects para migrar desde la web actual en WordPress/cPanel hacia la nueva web Astro sin perder trafico organico, romper enlaces internos ni dejar rutas huérfanas.

## Alcance y supuestos

- Este documento no modifica servidor, `.htaccess`, Nginx, DNS ni produccion.
- El mapa se basa en evidencia del repositorio, no en un crawl de produccion.
- Antes del corte final hay que reconciliar este mapa con:
  - export real de URLs de WordPress
  - Search Console
  - sitemap actual
  - logs o analytics si existen

## Fuentes versionadas usadas

- `docs/wordpress-local-workflow.md`
- `docs/content-structure.md`
- `content/wordpress/inicio.html`
- `content/wordpress/soluciones.html`
- `website/wordpress/08_portik_wp_blocks.html`

## Reglas base recomendadas

- Usar `301` para cambios definitivos de slug.
- Preservar query strings cuando existan.
- Normalizar protocolo y host al destino final definido.
- Mantener trailing slash consistente en Astro.
- No redirigir en cadena.
- No mandar todo al home; si no hay equivalencia clara, documentar el vacio y decidirlo antes del corte.

## Leyenda

- `P0`: obligatorio antes del switch.
- `P1`: importante, pero puede esperar a una segunda pasada si el origen no tiene trafico.
- `P2`: mejora recomendada.

Estado:

- `Confirmado`: aparece de forma clara en contenido o docs versionadas.
- `Probable`: slug legacy sugerido por documentacion previa, pero no confirmado contra produccion.
- `Pendiente`: requiere decidir destino o validar si realmente existe en la web viva.

## Redirects confirmados

| URL antigua | URL nueva | Redirect recomendado | Prioridad | Riesgo | Estado |
|---|---|---|---|---|---|
| `/` | `/` | Sin redirect | `P0` | Bajo | Confirmado |
| `/servicios/` | `/servicios/` | Sin redirect | `P0` | Bajo | Confirmado |
| `/soluciones/` | `/productos/` | `301` | `P0` | Medio: cambia de etiqueta editorial, pero conserva la intencion de productos y soluciones operativas | Confirmado |
| `/casos-de-exito/` | `/casos/` | `301` | `P0` | Bajo | Confirmado |
| `/contacto/` | `/contacto/` | Sin redirect | `P0` | Bajo | Confirmado |
| `/portik/` | `/productos/portik/` | `301` | `P0` | Bajo | Confirmado |
| `/politica-privacidad/` | `/politica-privacidad/` | Sin redirect | `P1` | Bajo | Confirmado |

## Redirects probables por slugs legacy

Estos slugs aparecen en la documentacion previa de estructura de contenido o son consistentes con la organizacion anterior, pero deben validarse contra la instalacion real o Search Console antes de publicarlos.

| URL antigua | URL nueva | Redirect recomendado | Prioridad | Riesgo | Estado |
|---|---|---|---|---|---|
| `/software-a-medida/` | `/servicios/software-a-medida/` | `301` | `P1` | Medio: posible cambio de taxonomia si nunca existio como pagina publica | Probable |
| `/automatizaciones/` | `/servicios/automatizaciones/` | `301` | `P1` | Medio | Probable |
| `/dashboards-analitica/` | `/servicios/dashboards/` | `301` | `P1` | Medio: el nombre nuevo es mas corto y cambia el slug | Probable |
| `/infraestructura-soporte/` | `/servicios/infraestructura-soporte/` | `301` | `P1` | Bajo | Probable |
| `/sitios-web-corporativos/` | `/servicios/sitios-web-corporativos/` | `301` | `P1` | Bajo | Probable |
| `/soluciones/portik/` | `/productos/portik/` | `301` | `P1` | Medio: no confirmado en contenido versionado, pero plausible como subruta legacy | Probable |
| `/soluciones/autoinventario/` | `/productos/autoinventario/` | `301` | `P1` | Medio | Probable |
| `/soluciones/autowhatsapp/` | `/productos/autowhatsapp/` | `301` | `P1` | Medio | Probable |
| `/terminos-uso/` | `/terminos/` | `301` | `P2` | Bajo | Probable |

## Rutas sin equivalente directo en Astro actual

Estas rutas no tienen hoy una pagina dedicada equivalente en la nueva web. No conviene improvisar un `301` al home sin revisar impacto SEO y UX.

| URL antigua | URL nueva | Redirect recomendado | Prioridad | Riesgo | Estado |
|---|---|---|---|---|---|
| `/sobre-nosotros/` | `/` temporalmente o futura `/sobre-nosotros/` | `302` temporal en staging; decidir `301` solo si no se creara pagina equivalente | `P0` | Alto: mismatch tematico y perdida de señales de confianza | Pendiente |
| `/blog/` | Mantener fuera del cutover o crear destino real | Sin redirect todavia | `P1` | Alto: perderia historico si se manda al home | Pendiente |
| `/soluciones/` seccion de AutoInventario y AutoWhatsapp enlazada solo desde la pagina agregada | `/productos/autoinventario/` y `/productos/autowhatsapp/` | Evaluar redirects granulares solo si existieron URLs propias | `P1` | Medio | Pendiente |

## Nuevas rutas Astro que deben quedar accesibles

Estas rutas nuevas deben responder `200` despues del corte o del staging final:

- `/`
- `/servicios/`
- `/servicios/software-a-medida/`
- `/servicios/automatizaciones/`
- `/servicios/dashboards/`
- `/servicios/infraestructura-soporte/`
- `/servicios/sitios-web-corporativos/`
- `/productos/portik/`
- `/productos/autoinventario/`
- `/productos/autowhatsapp/`
- `/casos/`
- `/contacto/`
- `/diagnostico/`

## Reglas de host y protocolo

Definirlas junto con el despliegue, pero la recomendacion es:

| URL antigua | URL nueva | Redirect recomendado | Prioridad | Riesgo | Estado |
|---|---|---|---|---|---|
| `http://sokatechnologies.com/*` | `https://sokatechnologies.com/:splat` | `301` | `P0` | Bajo | Pendiente de confirmar dominio final |
| `https://www.sokatechnologies.com/*` | `https://sokatechnologies.com/:splat` | `301` | `P0` | Bajo | Pendiente de confirmar politica `www` |
| `http://www.sokatechnologies.com/*` | `https://sokatechnologies.com/:splat` | `301` | `P0` | Bajo | Pendiente de confirmar politica `www` |

## Orden de implementacion recomendado

1. Exportar URLs reales de WordPress antes de tocar reglas.
2. Marcar cuales tienen backlinks, trafico organico o impresiones.
3. Validar este mapa con Search Console y sitemap legacy.
4. Crear redirects `301` solo para equivalencias definitivas.
5. Dejar `302` en staging para rutas sin equivalente claro.
6. Probar manualmente cada `P0`.
7. Revisar que no existan cadenas ni loops.

## Checklist de validacion previa al corte

- [ ] Confirmar si `/sobre-nosotros/` seguira existiendo o si se creara pagina equivalente en Astro.
- [ ] Confirmar si hay blog indexado o con trafico; si existe, no redirigir a ciegas.
- [ ] Confirmar si en produccion hubo slugs individuales para servicios fuera de `/servicios/`.
- [ ] Confirmar si existieron URLs de productos bajo `/soluciones/`.
- [ ] Confirmar version canonica del dominio: `www` o no `www`.
- [ ] Verificar que cada redirect `301` llegue en un solo salto.
- [ ] Verificar `200` en todas las rutas nuevas criticas.
- [ ] Verificar que `404` real siga funcionando para rutas no mapeadas.

## Riesgos abiertos

- El mapa no proviene aun de un crawl de produccion.
- `sobre-nosotros` y `blog` no tienen reemplazo directo hoy.
- Si WordPress tuvo taxonomias, attachments o slugs alternos no versionados, no estan cubiertos aqui.
- Si hubo cambios manuales en WordPress Admin fuera del repositorio, esos slugs no aparecen en este documento.

## Siguiente paso recomendado

Antes de escribir reglas de servidor, generar una lista maestra de URLs reales de WordPress y comparar contra estas rutas Astro:

```bash
git status
find src/pages -maxdepth 3 -type f | sort
rg -n "/servicios/|/soluciones/|/casos-de-exito/|/portik/|/contacto/|/sobre-nosotros/" docs content website -S
```

Con ese contraste ya se puede preparar una segunda version del mapa lista para `.htaccess`, Nginx, Cloudflare o la plataforma elegida de hosting.
