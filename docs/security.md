# Seguridad

## Objetivo

Establecer una baseline de seguridad para la futura web pública de SokaTechnologies.

## Reglas base

- No almacenar secretos, tokens ni credenciales en el repositorio.
- No publicar datos reales de clientes ni información sensible en ejemplos o contenidos.
- Mantener el menor número posible de integraciones de terceros.
- Aplicar principio de mínimo privilegio a despliegues y automatizaciones.

## Controles recomendados

- Configurar headers de seguridad apropiados en producción.
- Revisar formularios públicos para evitar abuso, spam y exposición innecesaria de datos.
- Evaluar política de cookies y analítica antes de integrar herramientas de tracking.
- Incluir revisiones de dependencias y secret scanning cuando exista pipeline.

## Operación

- Si un secreto se expone, debe rotarse fuera del repositorio de inmediato.
- Cualquier excepción de seguridad debe quedar registrada en `docs/decisions.md`.
