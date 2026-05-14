# Assets en WordPress

Esta guia explica como preparar y cargar los assets visuales de SokaTechnologies en WordPress sin versionar una instalacion completa ni tocar produccion desde el entorno local.

## Alcance

Se puede documentar, preparar y versionar:

- Logos, isotipos e iconos propios.
- Imagenes web optimizadas y sin datos sensibles.
- CSS revisable en `snippets/css/`.
- Instrucciones para cargar assets desde el panel de WordPress.

No se debe versionar:

- `wp-config.php`.
- WordPress core.
- Plugins de terceros.
- `public_html/wp-content/uploads/`.
- Backups, dumps SQL o exportaciones.
- Credenciales, tokens o datos reales de cPanel.

## Estrategia local actual

Los assets fuente se mantienen versionados en:

```text
assets/images/
assets/brand/
assets/logos/
```

Para que WordPress local pueda servirlos como archivos publicos, se copian a:

```text
public_html/wp-content/uploads/sokatech/
```

Esa carpeta sigue ignorada por Git y no es fuente versionada. La copia local se crea con:

```powershell
.\scripts\sync-local-wordpress-assets.ps1
```

El HTML de `content/` referencia las imagenes con rutas web estables:

```text
/wp-content/uploads/sokatech/<archivo.webp>
```

No usar rutas absolutas del repositorio dentro del contenido publicado.

## Cargar logo

1. Preparar el logo en `assets/brand/`.
2. Confirmar que existe version para fondo claro y fondo oscuro si aplica.
3. Optimizar el SVG o generar PNG fallback si WordPress no permite SVG en el flujo aprobado.
4. En WordPress, ir a Apariencia y usar el area de identidad del sitio o editor del tema.
5. Cargar el logo aprobado desde la biblioteca de medios.
6. Verificar header, footer y vista movil.

No instalar plugins solo para permitir SVG sin aprobacion explicita.

## Cargar favicon

1. Preparar `favicon-512.png` en `assets/brand/`.
2. Verificar que sea cuadrado, legible y sin bordes cortados.
3. En WordPress, cargarlo como icono del sitio.
4. Comprobar pestana del navegador, acceso directo movil y vista retina.

## Cargar Open Graph image

1. Preparar `og-sokatechnologies-default.webp` en `assets/brand/`.
2. Evitar texto pequeno o informacion sensible.
3. Sincronizarlo a `public_html/wp-content/uploads/sokatech/`.
4. El tema imprime `og:image` y `twitter:image` solo si el archivo existe en esa ruta local.
5. Si en produccion se usa un plugin SEO aprobado, revisar duplicados de meta tags antes de publicar.

## Cargar imagenes de paginas

1. Preparar imagenes en `assets/images/` segun su uso: hero, servicios, casos, contacto, sobre nosotros o errores.
2. Optimizar formato, peso y dimensiones antes de subir.
3. Sincronizar en local con `scripts/sync-local-wordpress-assets.ps1`.
4. Completar texto alternativo claro y util en el HTML o al cargarlo en la biblioteca de medios.
5. Insertar en bloques, patrones o plantillas aprobadas usando `/wp-content/uploads/sokatech/`.
6. Revisar desktop, tablet y movil.

## Reporte de uso de assets generados

Revision realizada contra archivos versionados en `assets/`, referencias de `content/`, plantillas del child theme y el script `scripts/sync-local-wordpress-assets.ps1`. No se inspecciona ni versiona `public_html/wp-content/uploads/`.

Todos los assets esperados existen como fuente versionada. El script local sincroniza 12 de 13 assets a `/wp-content/uploads/sokatech/`; el isotipo existe en `assets/logos/`, pero no esta en uso ni en el script de sincronizacion.

| Asset | Estado | Pagina o uso donde aparece | Ruta publica en WordPress | Pendiente de configurar |
| --- | --- | --- | --- | --- |
| `hero-sokatechnologies-operaciones-digitales.webp` | Usado | Home, hero visual en `content/home.html` | `/wp-content/uploads/sokatech/hero-sokatechnologies-operaciones-digitales.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `servicio-software-a-medida-sistemas-internos.webp` | Usado | Servicios, cabecera y tarjeta Software en `content/servicios.html` | `/wp-content/uploads/sokatech/servicio-software-a-medida-sistemas-internos.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `servicio-automatizaciones-flujos-integraciones.webp` | Usado | Servicios, tarjetas Automatizaciones e Integraciones en `content/servicios.html` | `/wp-content/uploads/sokatech/servicio-automatizaciones-flujos-integraciones.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `servicio-wordpress-corporativo-web-b2b.webp` | Usado | Servicios, tarjeta Sitios web corporativos WordPress en `content/servicios.html` | `/wp-content/uploads/sokatech/servicio-wordpress-corporativo-web-b2b.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `servicio-dashboards-reportes-metricas.webp` | Usado | Servicios, tarjeta Dashboards y reportes en `content/servicios.html` | `/wp-content/uploads/sokatech/servicio-dashboards-reportes-metricas.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `servicio-infraestructura-cloud-on-prem.webp` | Usado | Servicios, tarjeta Infraestructura cloud/on-prem en `content/servicios.html` | `/wp-content/uploads/sokatech/servicio-infraestructura-cloud-on-prem.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `servicio-soporte-mantenimiento-monitoreo.webp` | Usado | Servicios, tarjeta Soporte y mantenimiento en `content/servicios.html` | `/wp-content/uploads/sokatech/servicio-soporte-mantenimiento-monitoreo.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `casos-exito-anonimizados-transformacion-operativa.webp` | Usado | Casos de exito, imagen de pagina en `content/casos-de-exito.html` | `/wp-content/uploads/sokatech/casos-exito-anonimizados-transformacion-operativa.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `contacto-diagnostico-consultivo-b2b.webp` | Usado | Contacto, imagen de pagina en `content/contacto.html` | `/wp-content/uploads/sokatech/contacto-diagnostico-consultivo-b2b.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `sobre-sokatechnologies-socio-tecnologico.webp` | Usado | Sobre nosotros, imagen de pagina en `content/sobre-nosotros.html` | `/wp-content/uploads/sokatech/sobre-sokatechnologies-socio-tecnologico.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `404-sokatechnologies-ruta-no-encontrada.webp` | Usado | Plantilla 404 en `wp-theme/sokatechnologies-child-theme/templates/404.html` | `/wp-content/uploads/sokatech/404-sokatechnologies-ruta-no-encontrada.webp` | Sincronizar/subir en cada entorno antes de publicar. |
| `og-sokatechnologies-default.webp` | Usado | Global: `functions.php` imprime `og:image` y `twitter:image` si el archivo existe en uploads | `/wp-content/uploads/sokatech/og-sokatechnologies-default.webp` | Confirmar que el archivo exista en produccion y revisar duplicados si se usa un plugin SEO aprobado. |
| `isotipo-sokatechnologies-s-modular.webp` | No usado | No aparece en contenido, plantillas ni `functions.php`; esta en `assets/logos/` | Pendiente: `/wp-content/uploads/sokatech/isotipo-sokatechnologies-s-modular.webp` si se aprueba su uso | Definir si sera logo/site icon o asset descartado. Si se aprueba, agregarlo al flujo de carga/sincronizacion y configurarlo en WordPress. No esta incluido en `scripts/sync-local-wordpress-assets.ps1`. |

## Checklist antes de cargar

- [ ] El asset esta en una carpeta correcta del repo.
- [ ] El nombre es descriptivo y estable.
- [ ] El formato es adecuado para el uso.
- [ ] El peso esta optimizado.
- [ ] Hay licencia comercial o es asset propio.
- [ ] No contiene datos de clientes, usuarios, infraestructura ni cPanel.
- [ ] No contiene metadatos sensibles.
- [ ] No requiere instalar plugins nuevos.

## Checklist despues de cargar

- [ ] El asset se ve nitido en desktop.
- [ ] El asset se ve correcto en tablet.
- [ ] El asset se ve correcto en movil.
- [ ] No genera scroll horizontal.
- [ ] No tapa texto ni CTAs.
- [ ] El contraste es suficiente.
- [ ] El texto alternativo esta completo si aplica.
- [ ] El sitio sigue navegable.
- [ ] No hay errores PHP visibles.
- [ ] El admin de WordPress sigue accesible si se probo en local.
