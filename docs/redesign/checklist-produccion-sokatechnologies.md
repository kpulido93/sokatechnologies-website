# Checklist de producción — SokaTechnologies

Fecha: 2026-07-09  
Rama objetivo: `feature/web-demo-2026-gsap`

## Objetivo

Usar este checklist para decidir si la nueva web Astro de SokaTechnologies está lista para publicación pública o si debe permanecer en revisión interna.

Este checklist asume el estado actual del proyecto en esta rama:

- App Astro está en la raíz del repo.
- Build estática con `astro build`.
- Sitemap generado con `@astrojs/sitemap`.
- `robots.txt` dinámico.
- Preview Docker local disponible con Nginx.

## Roles sugeridos

| Código | Responsable sugerido | Alcance |
|---|---|---|
| `DEV` | Desarrollo | Build, código, SEO técnico, GSAP, formularios demo, revisión de secretos |
| `INFRA` | Infraestructura / DevOps | Hosting, DNS, certificados, backups, rollback, redirects |
| `SEO` | Marketing / SEO | metadata, Open Graph, Search Console, indexing, analytics |
| `CONT` | Contenido / Dirección | copy, claims, CTA, consistencia comercial, revisión editorial |
| `LEGAL` | Legal / Dirección | privacidad, términos, consentimiento, confidencialidad |
| `QA` | QA / Dirección / Desarrollo | revisión funcional, responsive, accesibilidad, navegabilidad |

## Reglas de decisión

### Go

Se puede publicar solo si:

- No hay bloqueadores abiertos.
- Build y preview pasan.
- No hay secretos ni datos reales expuestos.
- SEO técnico mínimo está completo.
- Formularios y CTA no inducen a error.
- Dirección aprueba contenido, claims y posicionamiento.

### No-Go

No se publica si ocurre cualquiera de estos casos:

- `npm run build` falla.
- Hay URLs `localhost`, `127.0.0.1` o dominios de prueba en `dist/`.
- Faltan `robots.txt` o `sitemap-index.xml`.
- Hay contenido sensible, secretos o datos reales de clientes.
- Formularios envían a destinos no validados o recogen datos sensibles.
- No existe plan de rollback.
- No hay backup del sitio actual ni del hosting destino.
- No hay revisión legal mínima de privacidad/consentimiento.

## Comandos base

Ejecutar desde la raíz del repo:

```bash
git status
npm ci
npm run check
npm run build
docker build -t soka-web-demo:local .
docker run --rm -p 8091:80 --name soka-web-demo-2026 soka-web-demo:local
curl -I http://127.0.0.1:8091
ls dist
cat dist/robots.txt
rg -n "localhost|127\\.0\\.0\\.1|example\\.com" dist -S
rg -n "canonical|application/ld\\+json|og:title|twitter:card|sitemap-index\\.xml" dist -S
```

## Checklist go/no-go

| ID | Área | Verificación | Responsable | Evidencia / comando | Riesgo si falla | Estado |
|---|---|---|---|---|---|---|
| `P01` | Build | `npm ci`, `npm run check` y `npm run build` pasan sin errores | `DEV` | `npm ci && npm run check && npm run build` | Alto | `[ ]` |
| `P02` | Build | `dist/` contiene todas las rutas esperadas de producción | `DEV` | `ls dist` | Alto | `[ ]` |
| `P03` | Build | Preview local en Docker responde correctamente | `DEV` / `INFRA` | `docker build ...` y `curl -I http://127.0.0.1:8091` | Medio | `[ ]` |
| `P04` | SEO | Cada página pública tiene `title`, `meta description` y `canonical` | `DEV` / `SEO` | inspección en `dist/*.html` | Alto | `[ ]` |
| `P05` | SEO | Un solo `h1` por página | `DEV` / `QA` | revisión manual + `rg -n "<h1"` en `src/pages` y `dist` | Alto | `[ ]` |
| `P06` | Sitemap | `sitemap-index.xml` y `sitemap-0.xml` existen en `dist/` | `DEV` / `SEO` | `ls dist | rg sitemap` | Medio | `[ ]` |
| `P07` | Robots | `robots.txt` existe y referencia el sitemap real | `DEV` / `SEO` | `cat dist/robots.txt` | Medio | `[ ]` |
| `P08` | Metadata | Open Graph y Twitter Card existen en páginas clave | `DEV` / `SEO` | `rg -n "og:title|twitter:card" dist -S` | Medio | `[ ]` |
| `P09` | Metadata | JSON-LD existe en Home, servicios y productos | `DEV` / `SEO` | `rg -n "application/ld\\+json" dist -S` | Medio | `[ ]` |
| `P10` | SEO | No hay `localhost`, `127.0.0.1` ni dominios placeholder en el build | `DEV` | `rg -n "localhost|127\\.0\\.0\\.1|example\\.com" dist -S` | Alto | `[ ]` |
| `P11` | Performance | Hero y primera sección cargan sin scroll vacío perceptible | `QA` / `DEV` | revisión visual desktop y mobile | Alto | `[ ]` |
| `P12` | Performance | No hay imágenes pesadas o innecesarias en páginas públicas | `DEV` / `QA` | revisión de assets y `dist` | Medio | `[ ]` |
| `P13` | Performance | GSAP no usa `markers`, pinning agresivo ni animaciones de layout | `DEV` | revisión `src/scripts/animations/` | Medio | `[ ]` |
| `P14` | Accesibilidad | `prefers-reduced-motion` funciona sin ocultar contenido | `QA` / `DEV` | prueba manual sistema operativo + navegador | Alto | `[ ]` |
| `P15` | Accesibilidad | Navegación por teclado y estados de foco son utilizables | `QA` | revisión manual | Alto | `[ ]` |
| `P16` | Accesibilidad | Contraste y lectura móvil son aceptables | `QA` / `CONT` | revisión manual | Alto | `[ ]` |
| `P17` | Formularios | `/contacto/` y `/diagnostico/` dejan claro si son demo o no conectan backend | `DEV` / `CONT` | revisión funcional y copy | Alto | `[ ]` |
| `P18` | Formularios | No se solicitan contraseñas, tokens ni datos sensibles | `DEV` / `LEGAL` | inspección de campos en `src/components/ContactForm.astro` | Alto | `[ ]` |
| `P19` | Seguridad | No hay secretos, tokens, llaves ni `.env` versionados | `DEV` | `git status`, inspección manual, búsqueda por patrones | Alto | `[ ]` |
| `P20` | Seguridad | No se exponen datos reales de clientes, números, placas, correos o capturas sensibles | `DEV` / `LEGAL` / `CONT` | revisión de contenido y assets | Alto | `[ ]` |
| `P21` | Variables de entorno | Si producción requiere variables, están documentadas y provisionadas fuera del repo | `DEV` / `INFRA` | checklist de despliegue interno | Alto | `[ ]` |
| `P22` | Backups | Existe backup verificado del sitio actual antes del corte | `INFRA` | evidencia en hosting o proveedor | Alto | `[ ]` |
| `P23` | Rollback | Existe plan de reversión con pasos y tiempo estimado | `INFRA` / `DEV` | documento interno o ticket aprobado | Alto | `[ ]` |
| `P24` | Redirects | Están definidos redirects desde URLs antiguas relevantes | `SEO` / `INFRA` / `CONT` | mapa de URLs | Alto | `[ ]` |
| `P25` | DNS | Dominio/subdominio objetivo, TTL y ventana de cambio están aprobados | `INFRA` | ticket o documento interno | Alto | `[ ]` |
| `P26` | Hosting | Hosting final, TLS/SSL y compresión están listos | `INFRA` | validación del entorno destino | Alto | `[ ]` |
| `P27` | Analytics | Herramienta de analítica decidida y snippet validado antes de insertar | `SEO` / `INFRA` | decisión aprobada | Medio | `[ ]` |
| `P28` | Search Console | Propiedad y sitemap preparados para alta o actualización | `SEO` | acceso confirmado | Medio | `[ ]` |
| `P29` | Legal | Política de privacidad y términos revisados para el flujo real | `LEGAL` / `CONT` | revisión documental | Alto | `[ ]` |
| `P30` | Privacidad | Consentimiento de contacto es claro y consistente con el uso real de datos | `LEGAL` / `CONT` | revisión formulario y páginas | Alto | `[ ]` |
| `P31` | Confidencialidad | Casos, productos y demos no revelan clientes ni entornos internos | `LEGAL` / `CONT` / `DEV` | revisión editorial y visual | Alto | `[ ]` |
| `P32` | Contenido | Claims comerciales no exageran resultados ni prometen funciones no existentes | `CONT` / `DEV` | revisión de copy | Alto | `[ ]` |
| `P33` | Contenido | Home, servicios, productos y casos mantienen tono premium B2B consistente | `CONT` / `QA` | revisión manual | Medio | `[ ]` |
| `P34` | No secretos | `git diff` / `git status` no muestran archivos prohibidos ni cambios fuera de alcance | `DEV` | `git status` | Alto | `[ ]` |

## Revisión manual mínima

Validar al menos:

- Home en desktop y mobile.
- `/servicios/`
- una página de servicio SEO
- `/productos/`
- `/productos/portik/`
- `/casos/`
- `/contacto/`
- `/diagnostico/`
- `/politica-privacidad/`
- `/terminos/`

## Matriz de riesgos

| Riesgo | Impacto | Probabilidad | Mitigación | Responsable |
|---|---|---|---|---|
| Publicar con metadata incompleta | Alto | Media | revisar `dist/` y SEO antes del corte | `DEV` / `SEO` |
| Dejar scroll vacío o ritmo deficiente en Home | Alto | Media | revisión visual final desktop/mobile | `QA` / `DEV` |
| Exponer datos o referencias sensibles en casos/productos | Alto | Media | revisión editorial y visual cruzada | `LEGAL` / `CONT` / `DEV` |
| Cortar tráfico sin rollback probado | Alto | Baja-media | definir reversión antes de DNS/cambio de hosting | `INFRA` |
| Insertar analytics sin validación legal o técnica | Medio | Media | aprobar herramienta antes de producción | `SEO` / `LEGAL` / `INFRA` |
| Romper indexación por redirects o robots incorrecto | Alto | Media | validar `robots`, sitemap y mapa de URLs | `SEO` / `DEV` / `INFRA` |

## Resultado final

### Aprobación

- Fecha:
- Responsable final:
- Decisión: `GO` / `NO-GO`

### Bloqueadores abiertos

- [ ]
- [ ]
- [ ]

### Notas de publicación

- Ventana sugerida:
- URL objetivo:
- Plan de rollback confirmado: `sí / no`
- Backup confirmado: `sí / no`
