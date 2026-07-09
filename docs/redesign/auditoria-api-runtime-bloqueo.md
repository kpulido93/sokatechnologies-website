# Runtime actual de `/api/audit` en Astro static

Fecha: 2026-07-09  
Rama: `feature/web-demo-2026-gsap`

## Resumen

Se implemento `src/pages/api/audit.ts` con:

- validacion de entrada
- bloqueo de URLs peligrosas
- reporte simulado local
- recomendaciones iniciales de Soka

El build actual **si compila** porque Astro prerenderiza una respuesta `GET` para `/api/audit`.

Sin embargo, con la configuracion actual:

- `output: "static"` en `astro.config.mjs`
- sin adapter de runtime aprobado

el despliegue resultante **no puede procesar `POST` reales en produccion**.

## Evidencia observada

### Build

`npm run build` pasa y genera:

- `/api/audit`

### Preview estatico

En `astro preview`:

- `GET /api/audit` devuelve la nota prerenderizada del endpoint
- `POST /api/audit` no ejecuta el flujo server-side; el servidor estatico responde el recurso prerenderizado

Interpretacion:

- el endpoint existe como salida de build
- pero la estrategia actual no ofrece ejecucion on-demand para aceptar solicitudes reales

## Motivo tecnico

Segun la documentacion oficial de Astro:

- las rutas y endpoints se prerenderizan por defecto en `static`
- para usar server endpoints reales hay que habilitar on-demand rendering
- esto requiere adapter de servidor
- en `static`, un endpoint server-side debe optar por `export const prerender = false`

Referencias oficiales:

- Endpoints: https://docs.astro.build/en/guides/endpoints/
- On-demand rendering: https://docs.astro.build/en/guides/on-demand-rendering/
- Routing reference / `prerender`: https://docs.astro.build/en/reference/routing-reference/

## Decision tomada en esta fase

No se instalo adapter ni se cambio la estrategia de despliegue.

Se dejo:

- la logica del endpoint implementada
- una respuesta `GET` explicativa compatible con build estatico
- el `POST` listo para usarse cuando exista runtime server-side aprobado

## Que conviene hacer despues

### Opcion recomendada

Cuando se apruebe runtime server-side:

1. elegir adapter alineado con el despliegue real
2. habilitar on-demand rendering para `/api/audit`
3. usar `export const prerender = false` en ese endpoint o mover el proyecto a `output: "server"` si la estrategia cambia
4. volver a probar `POST` real

### Adapters a evaluar cuando se apruebe

- `@astrojs/node`
- `@astrojs/cloudflare`
- `@astrojs/netlify`
- `@astrojs/vercel`

La seleccion debe responder al hosting final, no al gusto de implementacion.

## Impacto actual

### Lo que si queda listo

- contrato de datos
- validaciones reutilizables
- reglas de seguridad para URL
- scoring local
- recomendaciones locales de Soka

### Lo que no debe asumirse todavia

- recepcion real de auditorias en produccion
- persistencia
- envio de emails
- crawling remoto o integraciones externas

