# Security Standards

## Objetivo

Establecer requisitos minimos de seguridad para proteger credenciales, acceso y operacion basica de los proyectos.

## Reglas minimas

| Tema | Regla |
| --- | --- |
| Secretos | Nunca guardar secretos en repositorios ni documentos compartidos. |
| Accesos | Usar minimo privilegio y retirar accesos no necesarios. |
| Dependencias | Revisar dependencias criticas y evitar paquetes sin mantenimiento. |
| Datos | Minimizar datos sensibles y limitar su exposicion. |
| Backups | Definir si el sistema necesita respaldo y como se valida. |
| Incidentes | Registrar y escalar eventos de seguridad con rapidez. |

## Checklist operativo

- Las variables sensibles viven fuera del repo.
- Hay responsables claros para accesos y rotacion.
- Los ambientes tienen separacion razonable.
- Se revisan integraciones de terceros antes de confiar datos.
- Se documenta como actuar ante una exposicion o incidente.

## Validaciones externas

- Requisitos legales, regulatorios o contractuales deben revisarse con especialistas cuando aplique.
