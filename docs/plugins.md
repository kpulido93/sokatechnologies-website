# Plugins

## Objetivo

Definir criterios para seleccionar plugins de WordPress sin sobrecargar el sitio ni introducir riesgos innecesarios.

## Principio general

Usar la menor cantidad de plugins posible. Cada plugin debe resolver una necesidad concreta y documentada.

## Categorias a evaluar

| Categoria | Necesidad | Estado |
|---|---|---|
| Seguridad | Hardening, login, proteccion basica | Pendiente |
| Backups | Respaldos programados y restauracion | Pendiente |
| SEO | Metadata, sitemap, indexacion | Pendiente |
| Formularios | Captura de contacto | Local: Fluent Forms Lite activo; formulario pendiente |
| Cache/rendimiento | Optimizacion de carga | Pendiente |
| SMTP | Entrega confiable de correos | Pendiente |
| Analytics | Medicion basica | Pendiente |
| Anti-spam | Proteccion de formularios | Pendiente |

## Criterios de aprobacion

- Mantenido activamente.
- Compatible con la version actual de WordPress.
- Buen historial y reputacion.
- No duplica funcionalidad existente.
- No agrega peso innecesario.
- Tiene documentacion.
- No requiere guardar credenciales en el repositorio.
- Puede desactivarse sin romper todo el sitio.
- Resuelve una necesidad real.

## Reglas

- No instalar plugins nulled o de fuentes no confiables.
- No instalar varios plugins para la misma funcion.
- No instalar plugins solo por conveniencia visual.
- No activar plugins en produccion sin revisar impacto.
- Documentar cada plugin aprobado.
- Eliminar plugins no usados.
- Mantener plugins actualizados.

## Registro de plugins aprobados

| Plugin | Categoria | Motivo | Configuracion sensible | Responsable | Estado |
|---|---|---|---|---|---|
| `[pendiente]` | `[pendiente]` | `[pendiente]` | No documentar secretos | `[pendiente]` | Pendiente |

## Plugins recomendados

| Plugin | Categoria | Motivo | Configuracion sensible | Estado |
|---|---|---|---|---|
| Fluent Forms Lite | Formularios | Crear el formulario de diagnostico de Contacto e insertar el shortcode real en `content/contacto.html`. | No documentar tokens, claves anti-spam ni credenciales SMTP en el repositorio. | Recomendado; instalado y activo solo en WordPress local con WP-CLI. |

## Plugins no permitidos

- Plugins abandonados.
- Plugins de origen desconocido.
- Plugins nulled.
- Plugins que requieren subir credenciales al repositorio.
- Plugins que agregan funciones innecesarias.
- Plugins que modifican login, permisos o seguridad sin revision.

## Validacion

- [ ] Cada plugin tiene necesidad documentada.
- [ ] No hay plugins duplicados.
- [ ] No hay secretos en configuraciones versionadas.
- [ ] Se probo compatibilidad en staging o entorno seguro.
