# Engineering Standards

## Objetivo

Definir criterios minimos de ingenieria para mantener consistencia, mantenibilidad y velocidad razonable.

## Estandares base

| Area | Regla minima |
| --- | --- |
| Repositorio | Cada proyecto debe tener README, configuracion base y pasos de arranque. |
| Ramas | Trabajar con ramas cortas y nombres claros. |
| Revision | Todo cambio relevante debe poder revisarse antes de despliegue. |
| Pruebas | Probar al menos el flujo afectado y documentar limites de cobertura. |
| Logs | Los errores relevantes deben ser observables y trazables. |
| Documentacion | Decisiones no obvias y flujos operativos deben quedar escritos. |

## Checklist antes de cerrar trabajo

- El cambio resuelve el problema acordado.
- El codigo mantiene nombres y estructura legibles.
- Los casos de error principales estan considerados.
- El despliegue y rollback son viables.
- La documentacion afectada fue actualizada.

## Notas

- Evitar sobreingenieria en proyectos pequenos.
- Si se decide asumir deuda tecnica, debe quedar visible y priorizable.
