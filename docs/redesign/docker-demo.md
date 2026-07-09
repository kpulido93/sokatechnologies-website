# Docker local para la demo Astro

## Objetivo

Construir y servir la demo estática de SokaTechnologies dentro de un contenedor Docker local, sin tocar WordPress ni `public_html/`.

## Archivos

- `Dockerfile`
- `.dockerignore`
- `docker/nginx.conf`

## Flujo

1. La etapa `build` usa `node:22-alpine`.
2. Se instala con `npm ci`.
3. Se compila la demo con `npm run build`.
4. La etapa final usa `nginx:1.29-alpine`.
5. Nginx sirve el contenido estático generado en `dist/`.

## Publicación local sugerida

```bash
docker build -t soka-web-demo:local .
docker run --rm -p 8091:80 --name soka-web-demo-2026 soka-web-demo:local
```

## Ruta esperada

- `http://127.0.0.1:8091/`
- `http://127.0.0.1:8091/servicios/`
- `http://127.0.0.1:8091/productos/portik/`

## Notas

- El puerto sugerido es `8091` para no chocar con `8088` de WordPress local ni con `8090` ya ocupado.
- La configuración usa `try_files` para resolver correctamente rutas estáticas con `index.html` por carpeta.
