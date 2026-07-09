# Estrategia de despliegue — Astro a producción

Fecha de evaluación: 2026-07-09  
Rama evaluada: `feature/web-demo-2026-gsap`

## Objetivo

Definir una ruta segura para pasar la nueva web Astro de SokaTechnologies a producción sin reemplazar el sitio actual en WordPress/cPanel sin validación, rollback y control de riesgo.

## Estado actual del proyecto

La app nueva tiene estas propiedades:

- Se compila como sitio estático con `npm run build`.
- El artefacto final está en `dist/`.
- Ya existe un `Dockerfile` multistage con Nginx.
- Ya existen `robots.txt`, `sitemap-index.xml`, metadata SEO y páginas estáticas públicas.
- No depende de un backend Node en runtime para servir la web pública.

Implicación:

- La mejor categoría de hosting para esta versión es hosting estático con CDN y rollback rápido.
- No hace falta una plataforma serverful para publicar la versión actual.

## Criterios de decisión

Se priorizan estos criterios:

1. Riesgo bajo de corte.
2. Facilidad de staging en subdominio.
3. Rollback rápido.
4. SSL automático.
5. CI/CD simple desde Git.
6. Coste controlado.
7. Capacidad de convivir temporalmente con WordPress.

## Resumen ejecutivo

### Recomendación principal

La ruta más segura para esta web, en su estado actual, es:

1. Publicar Astro en staging en `preview.sokatechnologies.com` o `new.sokatechnologies.com`.
2. Mantener WordPress activo en producción durante toda la validación.
3. Validar UX, SEO, redirects, formularios, contenido legal y monitoreo.
4. Preparar mapa de redirects y rollback.
5. Cambiar DNS solo cuando la revisión final esté aprobada.
6. Mantener backup verificable de WordPress y posibilidad de retorno rápido.

### Plataforma recomendada

Opción preferida: `Cloudflare Pages + Cloudflare DNS`

Motivo:

- La app es estática.
- Cloudflare Pages ofrece SSL, CDN global, Git integration, preview deployments y rollback nativo.
- Para estáticos, el precio base y la elasticidad son especialmente favorables.
- Permite una ruta clara a staging por subdominio y luego a corte controlado.

### Segunda mejor opción

`Vercel`

Motivo:

- Excelente experiencia de previews, despliegue y rollback.
- Menor fricción de producto para equipos de frontend.
- Menos ideal que Cloudflare Pages para este caso si el objetivo es un sitio estático corporativo con coste predecible y staging con dominio propio sin añadir complejidad o gasto innecesario.

## Comparativa por opción

### 1. Cloudflare Pages

#### Encaje

Muy alto para el estado actual del proyecto.

#### Pros

- Muy buen fit para sitios estáticos Astro.
- SSL integrado.
- CDN global.
- Preview deployments automáticos por pull request.
- Branch deployment configurable.
- Rollback nativo a despliegues previos de producción.
- Coste base muy competitivo para assets estáticos.
- Si el dominio está en Cloudflare, el manejo de DNS y staging por subdominio queda muy directo.

#### Contras

- El alias de dominio custom a una rama concreta requiere DNS proxied en Cloudflare.
- Si el equipo no quiere mover DNS a Cloudflare, se pierde parte de la experiencia más cómoda de staging por rama con dominio propio.
- Preview deployments son públicos por defecto salvo que se protejan.

#### Costos esperados

Según la página oficial revisada el 2026-07-09:

- Free: `$0`, 1 build concurrente, `500` builds/mes, `100` custom domains/project, estáticos con requests y bandwidth ilimitados.
- Pro: `$20/mes` anual o `$25/mes` mensual, `5` builds concurrentes, `5,000` builds/mes, `250` custom domains/project, estáticos con requests y bandwidth ilimitados.

Coste esperado para Soka:

- Staging: probablemente `Free` es suficiente.
- Producción corporativa: `Free` o `Pro` según política interna, necesidad de concurrencia y gobierno del equipo.

#### Complejidad

Baja a media.

#### Rollback

Fuerte.

- Cloudflare Pages permite rollback instantáneo a un despliegue previo de producción.

#### DNS

- Muy cómodo si el dominio está o se mueve a Cloudflare DNS.
- Para staging por rama con subdominio custom, Cloudflare documenta `staging.example.com` apuntando a una rama específica.

#### SSL

- Automático.

#### CI/CD

- Git integration nativa.
- Preview deployments por PR.
- Controles por branch.

#### Recomendación

La mejor opción para esta versión estática si Soka acepta usar Cloudflare como capa principal de DNS/CDN para la nueva web.

---

### 2. Vercel

#### Encaje

Alto.

#### Pros

- UX de despliegue muy madura.
- Preview deployments excelentes.
- SSL automático.
- CI/CD muy simple.
- Rollback muy fuerte.
- Buen manejo de dominios y entornos preview/production.

#### Contras

- Los URLs de preview son públicos por defecto si no se configura protección.
- El coste puede volverse menos predecible que Cloudflare en escenarios de tráfico o uso adicional.
- Para este caso, parte del valor de Vercel está más alineado con apps dinámicas o flujos más complejos que esta web estática actual.
- El uso de custom preview suffix para previews con dominio personalizado está ligado a planes `Pro` y `Enterprise`.

#### Costos esperados

Según la página oficial revisada el 2026-07-09:

- Hobby: `$0/mes`.
- Pro: `$20/mes`, con `$20` de usage credit incluido.
- En Pro también aparecen incluidos `10M` edge requests/mes y `1TB` de fast data transfer/mes; luego hay cobros adicionales.

Coste esperado para Soka:

- Staging: `Hobby` puede servir técnicamente.
- Producción: preferible `Pro` para control de equipo, gasto y capacidades de preview/domain más corporativas.

#### Complejidad

Baja.

#### Rollback

Muy fuerte.

- Vercel ofrece Instant Rollback.
- En Hobby, el CLI documenta límite para rollback más allá del despliegue previo de producción.

#### DNS

- Flexible: se puede usar DNS externo o nameservers de Vercel.
- No obliga a mover DNS completo si solo se apuntan registros específicos.

#### SSL

- Automático al validar el dominio.

#### CI/CD

- Excelente con Git, CLI, Deploy Hooks y previews automáticos.

#### Recomendación

Muy buena segunda opción si el equipo prefiere la experiencia Vercel o no quiere apoyarse en Cloudflare Pages.

---

### 3. Netlify

#### Encaje

Medio a alto.

#### Pros

- Muy buen soporte para sitios estáticos.
- Deploy previews muy potentes.
- SSL automático.
- Rollback de un clic sobre deploys previos.
- Branch deploys y deploy previews bien resueltos.
- Puede personalizar subdominios automáticos para previews y branch deploys cuando se usa Netlify DNS.

#### Contras

- El modelo de costes actual está más centrado en créditos/uso que en un simple “sitio estático casi gratis”.
- Para staging con subdominios custom, Netlify DNS añade dependencia operativa.
- En este caso no ofrece una ventaja clara frente a Cloudflare Pages o Vercel.

#### Costos esperados

Según la página oficial revisada el 2026-07-09:

- Free: `$0`, previews ilimitados, custom domains con SSL, 300 créditos/mes.
- Personal: `$9/mes`, 1,000 créditos/mes.
- Pro: `$20/mes`, 3,000 créditos/mes, variables compartidas y `3+` concurrent builds.
- Enterprise: desde `$500/mes`.

Coste esperado para Soka:

- Free puede servir para pruebas.
- Pro tiene más sentido para equipo real y gobierno mínimo.
- Hay que vigilar el consumo de créditos si el tráfico, builds o features crecen.

#### Complejidad

Media.

#### Rollback

Fuerte.

- Netlify permite publicar un deploy previo como live y la reversión es instantánea.

#### DNS

- Funciona con DNS externo.
- Para deploy subdomains automáticos y branch subdomains cómodos, Netlify recomienda/usa Netlify DNS.

#### SSL

- Automático con Let’s Encrypt para custom domains.

#### CI/CD

- Bueno con Git.
- Deploy previews por PR.
- Branch deploys.

#### Recomendación

Válida, pero no la primera recomendación para esta web concreta salvo que el equipo ya use Netlify y quiera concentrar ahí el flujo.

---

### 4. VPS / cPanel estático

#### Encaje

Medio.

#### Pros

- Máximo control sobre archivos, rutas y entorno.
- Puede convivir cerca del hosting actual.
- Puede desplegarse como estático puro con Nginx/Apache o incluso con `public_html` de un subdominio.
- Git Version Control y deployment existen en cPanel/WHM.
- Si ya existe una cuenta/cPanel operativa con capacidad disponible, el coste incremental puede ser bajo.

#### Contras

- Más responsabilidad operativa.
- Más superficie de error humano.
- SSL, redirects, rollback, permisos y publicación quedan menos automatizados que en Pages/Vercel/Netlify.
- Si se hace en el mismo entorno que WordPress, se incrementa el acoplamiento con la plataforma actual.
- Publicar desde el mismo cPanel que hoy sirve WordPress reduce aislamiento del cambio.

#### Costos esperados

Hay dos escenarios:

1. Reusar hosting/cPanel existente:
   - Puede ser costo incremental `0` o bajo, pero depende del plan actual y de si permite subdominios/document roots separados.

2. VPS/cPanel nuevo:
   - El coste no es solo el VPS.
   - cPanel publica tiers oficiales de licencia; una referencia oficial reciente muestra:
     - Solo: `$29.99/mes`
     - Admin: `$35.99/mes`
     - Pro: `$53.99/mes`
     - Premier: `$69.99/mes`
   - A eso se suma el VPS, backups y operación.

#### Complejidad

Media a alta.

#### Rollback

Medio.

- Se puede hacer con backup/restore, Git deployment o recopiando un build anterior.
- No es tan instantáneo ni tan limpio como en plataformas especializadas de deploy estático.

#### DNS

- Flexible.
- Muy útil si se quiere publicar primero en un subdominio dentro del hosting actual.

#### SSL

- cPanel/WHM documenta AutoSSL y gestión de certificados.
- Requiere validación más manual que en plataformas especializadas.

#### CI/CD

- Posible, pero menos directo.
- cPanel soporta Git Version Control y Git deployment.
- También puede hacerse por CI que suba `dist/` por SFTP/rsync o despliegue sobre contenedor.

#### Recomendación

Buena opción solo si existe una razón fuerte para quedarse dentro del ecosistema actual o si se quiere un staging temporal muy cercano a cPanel. No la recomiendo como primera elección para el sitio Astro público final si se busca simplicidad operativa.

---

### 5. Mantener WordPress temporalmente y publicar Astro en subdominio

#### Encaje

Muy alto como estrategia de transición.

#### Pros

- Minimiza riesgo.
- Permite QA real con usuarios internos y stakeholders.
- Evita corte prematuro.
- Facilita revisión de SEO, legal, formularios y contenido antes del cambio del dominio principal.
- Hace posible comparar la nueva web contra la actual sin tocar producción.
- Mantiene WordPress como rollback “macro” mientras Astro madura.

#### Contras

- Duplica temporalmente la gestión de dos sitios.
- Puede generar confusión si el staging se indexa o comparte sin control.
- Requiere disciplina para que el staging no se convierta en “producción paralela” indefinida.

#### Costos esperados

- Muy bajos si se usa una plataforma estática con plan base.
- El mayor coste es operativo: QA, contenido, SEO, redirects y seguimiento.

#### Complejidad

Baja a media.

#### Rollback

Muy fuerte.

- Si el corte falla, WordPress sigue vivo y puede retomarse el DNS o redirección.

#### DNS

- Requiere solo un subdominio nuevo para staging: `preview.` o `new.`.
- No requiere mover aún el apex ni `www`.

#### SSL

- Normalmente automático en Pages/Vercel/Netlify.
- Si se hace en cPanel, depende del flujo AutoSSL/certificado.

#### CI/CD

- Depende de la plataforma donde viva el staging.

#### Recomendación

No es solo válida: es la estrategia que recomiendo adoptar aunque se elija cualquiera de las otras cuatro plataformas.

## Matriz de decisión

| Opción | Encaje técnico actual | Coste base esperado | Complejidad | Rollback | Staging con subdominio | Recomendación |
|---|---|---:|---|---|---|---|
| Cloudflare Pages | Muy alto | Bajo | Baja-media | Muy fuerte | Muy bueno | `Preferida` |
| Vercel | Alto | Bajo-medio | Baja | Muy fuerte | Muy bueno | `Segunda opción` |
| Netlify | Medio-alto | Bajo-medio | Media | Fuerte | Bueno | `Válida, no preferida` |
| VPS/cPanel estático | Medio | Medio-alto | Media-alta | Medio | Bueno | `Solo si hay restricción operativa` |
| WordPress + Astro en subdominio | Muy alto como estrategia | Bajo | Baja-media | Muy fuerte | Excelente | `Obligatoria como fase de transición` |

## Ruta recomendada

### Fase 1 — Staging aislado

Objetivo:

- Publicar Astro sin tocar WordPress.

Recomendación:

- Crear `preview.sokatechnologies.com` o `new.sokatechnologies.com`.
- Publicarlo en Cloudflare Pages.
- Si se usa Cloudflare DNS, apuntar ese subdominio al proyecto/branch de staging.

Resultado esperado:

- WordPress sigue en producción.
- Astro queda disponible para QA real.

### Fase 2 — Validación funcional y editorial

Validar:

- UX desktop y mobile.
- SEO técnico.
- metadata y OG.
- redirects.
- formularios demo.
- privacidad y legal.
- no secretos / no datos reales.
- rendimiento y reduced motion.

### Fase 3 — Corte controlado

Antes del cambio:

- bajar TTL del dominio con anticipación razonable;
- confirmar backup de WordPress;
- confirmar rollback;
- cerrar mapa de redirects;
- validar Search Console, analytics y sitemap;
- congelar cambios editoriales de última hora.

### Fase 4 — Cambio de DNS / publicación principal

Ruta sugerida:

1. Mantener WordPress como origen de respaldo.
2. Apuntar `www` y apex al hosting Astro elegido.
3. Verificar SSL, headers y redirects.
4. Monitorear errores, indexación y accesos.

### Fase 5 — Ventana de observación

Monitorear mínimo:

- 24 a 72 horas.
- errores 404.
- problemas de DNS/SSL.
- páginas faltantes.
- enlaces internos.
- comportamiento de formularios.
- indexación básica.

### Fase 6 — Retiro controlado o conservación de WordPress

Después de estabilizar:

- decidir si WordPress se apaga, se archiva o se conserva como backup frío;
- conservar export y backup verificable antes de cualquier retiro definitivo.

## Rollback recomendado

### Rollback corto

Aplicar si la plataforma nueva sigue siendo la misma pero el deploy actual falla.

- Cloudflare Pages: rollback al deploy previo de producción.
- Vercel: Instant Rollback al deploy estable previo.
- Netlify: publicar un deploy previo como live.

### Rollback largo

Aplicar si el problema es estructural del nuevo stack o del cambio de DNS.

- Reapuntar DNS al sitio WordPress actual.
- Restaurar configuración previa del dominio.
- Mantener staging Astro aparte para seguir corrigiendo sin exponer producción.

## Recomendación final

### Opción preferida

`Cloudflare Pages + staging en subdominio + corte posterior`

### Secuencia recomendada

1. Publicar staging en `preview.sokatechnologies.com` o `new.sokatechnologies.com`.
2. Validar UX, contenido, SEO, formularios, legal y performance.
3. Preparar redirects y monitoreo.
4. Confirmar backup de WordPress y plan de rollback.
5. Cambiar DNS solo tras aprobación final.
6. Monitorear.

### Qué no hacer

- No reemplazar el sitio WordPress actual directamente.
- No hacer el corte sin staging navegable.
- No hacer el corte sin rollback probado.
- No asumir que “porque la build pasa” el lanzamiento está listo.

## Comandos útiles del repo

Desde la raíz:

```bash
git status
npm ci
npm run check
npm run build
docker build -t soka-web-demo:local .
docker run --rm -p 8091:80 --name soka-web-demo-2026 soka-web-demo:local
curl -I http://127.0.0.1:8091
```

## Fuentes oficiales revisadas

Revisadas el 2026-07-09:

- Cloudflare Pages pricing: https://pages.cloudflare.com/
- Cloudflare Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/
- Cloudflare Pages branch custom domain: https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/
- Cloudflare Pages rollbacks: https://developers.cloudflare.com/pages/configuration/rollbacks/
- Vercel pricing: https://vercel.com/pricing
- Vercel deployments: https://vercel.com/docs/deployments
- Vercel environments: https://vercel.com/docs/deployments/environments
- Vercel generated URLs: https://vercel.com/docs/deployments/generated-urls
- Vercel custom domains: https://vercel.com/docs/domains
- Vercel SSL: https://vercel.com/docs/domains/working-with-ssl
- Vercel rollback: https://vercel.com/docs/instant-rollback
- Netlify pricing: https://www.netlify.com/pricing/
- Netlify deploy previews: https://docs.netlify.com/deploy/deploy-types/deploy-previews/
- Netlify deploy overview: https://docs.netlify.com/deploy/deploy-overview/
- Netlify manage deploys / rollbacks: https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/
- Netlify domains: https://docs.netlify.com/manage/domains/get-started-with-domains/
- Netlify automatic deploy subdomains: https://docs.netlify.com/manage/domains/configure-domains/configure-an-automatic-subdomain-for-deploys/
- Netlify branch deploy domains: https://docs.netlify.com/manage/domains/manage-domains/manage-domains-for-branch-deploys/
- cPanel Git Version Control: https://docs.cpanel.net/cpanel/files/git-version-control/
- cPanel Git deployment: https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/
- cPanel File Manager: https://docs.cpanel.net/cpanel/files/file-manager/
- cPanel SSL guide: https://docs.cpanel.net/knowledge-base/security/guide-to-ssl/
- cPanel AutoSSL: https://docs.cpanel.net/whm/ssl-tls/manage-autossl/
- cPanel backups: https://docs.cpanel.net/cpanel/files/backup-for-cpanel/
- cPanel pricing/licensing: https://www.cpanel.net/pricing/ and https://support.cpanel.net/hc/en-us/articles/360044466254-Store-License-Tiers
