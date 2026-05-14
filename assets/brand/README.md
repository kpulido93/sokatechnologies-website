# Assets de marca

Esta carpeta contiene los assets de identidad visual aprobados para SokaTechnologies. Debe usarse para piezas de marca reutilizables en WordPress, documentacion, child theme y materiales web controlados por el repo.

No guardar aqui capturas con datos reales, archivos editables pesados, credenciales, backups ni exportaciones de WordPress.

## Assets recomendados

| Archivo | Uso | Formato recomendado | Tamano recomendado |
|---|---|---|---|
| `logo-horizontal-dark.svg` | Logo horizontal para fondos claros | SVG optimizado | ViewBox proporcional, ancho util 240-360 px |
| `logo-horizontal-light.svg` | Logo horizontal para fondos oscuros | SVG optimizado | ViewBox proporcional, ancho util 240-360 px |
| `isotipo-soka.svg` | Isotipo modular basado en la S tecnologica | SVG optimizado | ViewBox cuadrado, 64-512 px |
| `favicon-512.png` | Site icon de WordPress | PNG | 512 x 512 px |
| `apple-touch-icon.png` | Icono para dispositivos Apple | PNG | 180 x 180 px |
| `og-image-default.png` | Imagen Open Graph por defecto | PNG o WebP fuente + PNG final si el plugin lo requiere | 1200 x 630 px |

## Formatos

- Usar SVG para logos e isotipos cuando WordPress, el tema o el flujo aprobado lo permitan.
- Usar PNG para favicon, Apple touch icon y piezas que requieran transparencia raster.
- Usar WebP para imagenes web optimizadas cuando sean compatibles con el uso final.
- Mantener los SVG limpios: sin scripts, sin metadatos innecesarios y sin fuentes embebidas pesadas.
- No subir archivos editables de diseno pesados salvo que exista una tarea especifica para versionarlos.

## Reglas de peso

- Logos SVG: idealmente menos de 50 KB.
- Favicon y Apple touch icon: idealmente menos de 100 KB cada uno.
- Open Graph default: idealmente menos de 350 KB.
- No subir archivos de varios MB si existe una version optimizada suficiente para web.
- Si se necesita conservar un archivo fuente pesado, documentarlo como pendiente fuera del repo.

## Licencia y confidencialidad

- Usar solo assets propios, generados internamente o con licencia clara para uso comercial.
- No usar imagenes encontradas en internet sin licencia verificable.
- No incluir logos de clientes sin autorizacion escrita.
- No incluir capturas con dominios internos, usuarios, emails, tickets, metricas reales o datos de negocio.
- No inventar certificaciones, partners o sellos de confianza.

## Validacion antes de usar

- Confirmar que el archivo abre correctamente.
- Confirmar que el contraste funciona en fondos claros y oscuros.
- Confirmar que el peso esta dentro del rango recomendado.
- Confirmar que no contiene datos sensibles ni metadatos innecesarios.
- Confirmar que el nombre de archivo es estable y descriptivo.
