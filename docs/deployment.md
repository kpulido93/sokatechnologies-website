# Despliegue

## Estado actual

El repositorio todavía no define framework, pipeline ni proveedor de hosting. Este documento fija únicamente una base para futuras decisiones de despliegue.

## Supuestos iniciales

- El sitio será público, con foco en disponibilidad, rendimiento y facilidad de mantenimiento.
- El despliegue debería soportar entornos al menos de preview y producción.
- La configuración sensible deberá vivir fuera del repositorio.
- El pipeline mínimo debería incluir validación, build y publicación.

## Aspectos a decidir

- Proveedor de hosting y CDN.
- Estrategia de previews por rama o PR.
- Gestión de dominio, DNS y certificados.
- Monitorización básica, alertas y rollback.

## Checklist previa a go-live

- Variables de entorno configuradas fuera del repositorio.
- Headers y políticas de seguridad revisadas.
- Rendimiento y accesibilidad validados.
- Responsable operativo definido para incidencias y cambios urgentes.
