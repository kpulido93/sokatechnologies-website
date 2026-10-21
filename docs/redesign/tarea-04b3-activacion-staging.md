# Tarea 04-B3 — Activación controlada de formularios en staging

Fecha de actualización: 2026-10-21
Rama: `codex/tarea-04b3-activacion-staging`
PR: #13
Commit validado: `03608c29fce0fde8bbb1087fbd99b1d42d695ddb`

## Alcance y decisión

Astro continúa como sitio estático (`output: "static"`). Nginx sirve los archivos generados y
los formularios permanecen en modo demo. Esta tarea documenta el candidato preparado y el
procedimiento reversible para publicar un release en el puerto 8091; no activa el Worker ni
recibe leads reales.

La activación pública permanece en **NO-GO** hasta completar la revisión legal de privacidad,
consentimiento, proveedores, retención y primer envío controlado. No se modifican DNS, Cloudflare,
WordPress, producción, Resend ni Turnstile.

## Estado real del despliegue

Los valores siguientes proceden de `docker inspect` en LPT-KEVIN.

### Staging principal — no modificado en esta validación

| Elemento | Valor |
|---|---|
| Contenedor | `soka-web-demo-2026-8091` |
| Estado | `running` |
| Imagen observada | `sha256:defaa5c5cfe0e7d0be0ea43471340b98322a7629ee548e30eb1787f59bffab52` |
| Puerto | `0.0.0.0:8091 -> 80/tcp` |
| Publicación | `--restart unless-stopped` |
| Bind read-only | `/srv/fast-storage/soka-web/site:/usr/share/nginx/html` |
| Comando | `nginx -g daemon off;` |

### Candidato de este PR

| Elemento | Valor |
|---|---|
| Contenedor | `soka-web-04b3-preview-8093` |
| Estado | `running` |
| Imagen | `soka-web-04b3:03608c2-demo` |
| Puerto | `127.0.0.1:8093 -> 80/tcp` |
| Publicación | `--restart no` |
| Bind read-only | `/srv/fast-storage/soka-web/releases/03608c2-demo:/usr/share/nginx/html` |
| Comando | `nginx -g daemon off;` |

El release versionado que se montó en 8093 es independiente de `/srv/fast-storage/soka-web/site`.
No se modificaron los contenedores de 8091 ni 8092.

### Preview anterior y rollback

`soka-web-ssd-preview-8092` continúa siendo un preview anterior que monta
`/srv/fast-storage/soka-web/site` en `127.0.0.1:8092` con política `no`. No se utiliza para el
candidato nuevo.

El rollback existente es:

| Elemento | Valor |
|---|---|
| Contenedor | `soka-web-demo-2026-8091-pre-ssd-20261020T233258` |
| Estado observado | `exited` |
| Imagen | `soka-web-preview:t04a-85ee748` |
| Puerto configurado | `0.0.0.0:8091 -> 80/tcp` |
| Política | `no` |
| Montajes | ninguno |

No eliminar ni reutilizar este contenedor para otro propósito antes de una activación aprobada.

## Formulario y privacidad

El build publicado en 8093 mantiene:

- `data-form-mode="demo"` en Contacto y Diagnóstico.
- Acción HTML `mailto:info@sokatechnologies.com` como alternativa sin JavaScript.
- Mensaje explícito de que la validación local no envía solicitudes.
- Sin credenciales privadas ni configuración real de Resend o Turnstile.

La política de privacidad sigue siendo un borrador. Antes de activar recepción real deben
confirmarse el responsable legal, la base jurídica, el consentimiento, proveedores, transferencias,
retención, eliminación y acceso al buzón.

## Validación del candidato en 8093

### Rutas HTTP

Se verificaron con HTTP 200 en `http://127.0.0.1:8093`:

```text
/
/servicios/
/proyectos/
/nosotros/
/contacto/
/diagnostico/
/politica-privacidad/
/servicios/consultoria-ti-devops/
/servicios/dashboards/
```

El release contiene 22 páginas Astro y el `404.html` de fallback; por eso el recuento bruto de
archivos HTML es 23.

### Chromium

La matriz ejecutada contra `http://127.0.0.1:8093` cubrió 7 rutas a 320, 390, 768 y 1440 px:

- 28 comprobaciones de página.
- 0 errores de consola.
- 0 respuestas HTTP de error observadas por Chromium.
- 0 casos con `document.scrollWidth > document.clientWidth`.
- Navegación por teclado: 42 elementos enfocables por viewport; foco visible en la secuencia
  comprobada.
- `prefers-reduced-motion: reduce`: activo durante la prueba.
- Contacto y Diagnóstico: modo `demo`, confirmación visible, campos y consentimiento conservados,
  0 solicitudes `POST` y fallback `mailto:info@sokatechnologies.com`.

La inspección de límites geométricos también encontró el honeypot desplazado fuera de pantalla y
tarjetas decorativas del Hero recortadas dentro del viewport a 320 px. Son falsos positivos para
scroll horizontal porque el ancho real del documento no aumentó; quedan conservados en la evidencia
para revisión visual.

Evidencia local, fuera del repositorio:

```text
/srv/fast-storage/soka-web/evidence/03608c2-demo/
```

Incluye `chromium-results.json` y capturas de Inicio, Contacto y Diagnóstico en los cuatro anchos.
No contiene secretos ni datos de clientes.

## Publicar un release en 8091

Este procedimiento no se ejecutó durante la validación. Requiere aprobación explícita de la
activación y debe conservar el contenedor actual y el rollback existente.

### 1. Preflight

```bash
set -euo pipefail

current=soka-web-demo-2026-8091
rollback=soka-web-demo-2026-8091-pre-ssd-20261020T233258

test "$(docker inspect -f '{{.State.Status}}' "$current")" = running
test "$(docker inspect -f '{{.HostConfig.RestartPolicy.Name}}' "$current")" = unless-stopped
test "$(docker inspect -f '{{(index (index .HostConfig.PortBindings "80/tcp") 0).HostIp}}:{{(index (index .HostConfig.PortBindings "80/tcp") 0).HostPort}}' "$current")" = '0.0.0.0:8091'
test "$(docker inspect -f '{{(index .Mounts 0).Source}}' "$current")" = /srv/fast-storage/soka-web/site
test "$(docker inspect -f '{{.State.Status}}' "$rollback")" = exited

docker inspect soka-web-04b3-preview-8093
curl -fsSI http://127.0.0.1:8093/
curl -fsSI http://127.0.0.1:8093/contacto/
curl -fsSI http://127.0.0.1:8093/diagnostico/

test -d /srv/fast-storage/soka-web/releases/03608c2-demo
test -r /srv/fast-storage/soka-web/releases/03608c2-demo/index.html
```

El puerto 8091 no debe estar libre en este punto: debe pertenecer al contenedor `current` esperado.
Este preflight confirma su estado `running`, el bind de `/srv/fast-storage/soka-web/site`, el
puerto `0.0.0.0:8091` y la política `unless-stopped`. El contenedor `rollback` solo se comprueba
como respaldo de emergencia y no se utiliza para el cambio normal.

### 2. Sustitución reversible

La sustitución conserva el contenedor que funciona actualmente desde SSD. Solo se renombra
temporalmente para liberar el nombre; su imagen, bind, puerto y política `unless-stopped` no se
modifican. El alias debe estar libre antes de empezar.

```bash
set -euo pipefail

current=soka-web-demo-2026-8091
previous=soka-web-demo-2026-8091-previous-ssd
candidate=soka-web-04b3:03608c2-demo
release=/srv/fast-storage/soka-web/releases/03608c2-demo

if docker inspect "$previous" >/dev/null 2>&1; then
  echo "El alias de rollback ya existe; detenerse y revisarlo manualmente" >&2
  exit 1
fi

check_http() {
  local url code
  for url in \
    http://127.0.0.1:8091/ \
    http://127.0.0.1:8091/contacto/ \
    http://127.0.0.1:8091/diagnostico/ \
    https://prueba.sokatechnologies.com/ \
    https://prueba.sokatechnologies.com/contacto/ \
    https://prueba.sokatechnologies.com/diagnostico/; do
    code=$(curl --fail --silent --show-error --connect-timeout 5 --max-time 15 -o /dev/null -w '%{http_code}' "$url") || return 1
    test "$code" = 200 || return 1
  done
}

restore_previous() {
  if docker inspect "$current" >/dev/null 2>&1; then
    docker stop "$current" || true
    docker rm "$current" || true
  fi
  docker rename "$previous" "$current"
  docker start "$current"
  check_http
}

docker stop "$current"
docker rename "$current" "$previous"

if ! docker run -d \
  --name "$current" \
  --restart unless-stopped \
  -p 0.0.0.0:8091:80 \
  --mount type=bind,src="$release",dst=/usr/share/nginx/html,readonly \
  "$candidate"; then
  restore_previous
  exit 1
fi

if ! check_http; then
  restore_previous
  exit 1
fi
```

El `restore_previous` elimina únicamente el candidato fallido, renombra el contenedor SSD original
a su nombre `soka-web-demo-2026-8091` y lo inicia con su configuración original. Así se recuperan
el mismo bind, el puerto 8091 y `unless-stopped` tanto si falla `docker run` como si falla cualquier
GET local o público posterior.

## Rollback exacto

El rollback normal utiliza el contenedor SSD original conservado bajo el alias
`soka-web-demo-2026-8091-previous-ssd`. No reconstruye imágenes ni toca el release:

```bash
set -euo pipefail

current=soka-web-demo-2026-8091
previous=soka-web-demo-2026-8091-previous-ssd

docker stop "$current" || true
docker rm "$current" || true
docker rename "$previous" "$current"
docker start "$current"

for url in \
  http://127.0.0.1:8091/ \
  http://127.0.0.1:8091/contacto/ \
  http://127.0.0.1:8091/diagnostico/ \
  https://prueba.sokatechnologies.com/ \
  https://prueba.sokatechnologies.com/contacto/ \
  https://prueba.sokatechnologies.com/diagnostico/; do
  test "$(curl --fail --silent --show-error --connect-timeout 5 --max-time 15 -o /dev/null -w '%{http_code}' "$url")" = 200
done
```

El contenedor anterior mantiene su configuración original porque nunca se recrea ni se ejecuta
`docker update`: el bind sigue apuntando a `/srv/fast-storage/soka-web/site`, el puerto es
`0.0.0.0:8091` y la política es `unless-stopped`. El candidato eliminado es el único que se
retira; los releases, el alias de rollback y el respaldo `pre-ssd` se conservan.

### Respaldo de emergencia pre-SSD

`soka-web-demo-2026-8091-pre-ssd-20261020T233258` es solo una segunda opción si el contenedor SSD
original está dañado o no puede restaurarse. Su imagen es `soka-web-preview:t04a-85ee748`, no tiene
bind de release y su política observada es `no`; por tanto no sustituye al rollback normal y requiere
aprobación y verificación manual adicional. No eliminarlo ni cambiar su política automáticamente.

En ningún caso ejecutar `docker system prune`, eliminar releases ni borrar respaldos.

## Activación de leads: NO-GO

La publicación del HTML candidato no activa el Worker. La activación real requeriría, en una tarea
posterior y con aprobación separada:

1. aprobación legal y del fundador;
2. confirmación de secretos del Worker fuera de Git;
3. verificación de origen, Turnstile, rate limit e idempotencia;
4. una prueba real de Contacto y otra de Diagnóstico desde el hostname autorizado;
5. confirmación de recepción en `info@sokatechnologies.com`;
6. rollback inmediato si falla cualquier comprobación.

No se deben usar overrides de versión del Worker desde el navegador ni activar Resend, Turnstile o
el tráfico real como parte de este PR.

## Resultado

El candidato `03608c29fce0fde8bbb1087fbd99b1d42d695ddb` está validado en el preview local 8093 y
el runbook queda alineado con releases versionados en SSD. La recomendación para fusionar el código
es **GO técnico condicionado a la revisión del PR #13**. La recomendación para activar leads
públicos sigue siendo **NO-GO**.
