# Plugins

## Objetivo

Definir criterios para seleccionar plugins de WordPress sin sobrecargar el sitio.

## Principio general

Usar la menor cantidad de plugins posible.

Cada plugin debe resolver una necesidad clara.

## Categorías recomendadas

| Categoría | Necesidad | Estado |
|---|---|---|
| Seguridad | Protección básica, hardening, login | Pendiente |
| Backups | Respaldos programados | Pendiente |
| SEO | Metadata, sitemap, indexación | Pendiente |
| Formularios | Captura de contacto | Pendiente |
| Caché / rendimiento | Optimización de carga | Pendiente |
| SMTP | Entrega confiable de correos | Pendiente |
| Analytics | Medición básica | Pendiente |

## Criterios para aprobar un plugin

- Mantenido activamente.
- Compatible con la versión actual de WordPress.
- Buen historial.
- No duplica funcionalidad existente.
- No agrega peso innecesario.
- Tiene documentación.
- No requiere credenciales en el repositorio.
- Cumple con la necesidad real.
- Puede desactivarse sin romper todo el sitio.

## Reglas

- No instalar plugins nulled o de fuentes no confiables.
- No instalar varios plugins para la misma función.
- No instalar plugins solo por conveniencia visual.
- No activar plugins en producción sin revisar impacto.
- Documentar cada plugin aprobado.
- Eliminar plugins no usados.
- Mantener plugins actualizados.

## Registro de plugins aprobados

| Plugin | Categoría | Motivo | Configuración sensible | Responsable | Estado |
|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | No documentar secretos | Pendiente | Pendiente |

## Plugins no permitidos

- Plugins abandonados.
- Plugins de origen desconocido.
- Plugins nulled.
- Plugins que requieren subir credenciales al repo.
- Plugins que agregan funciones innecesarias.
- Plugins que modifican login, permisos o seguridad sin revisión.