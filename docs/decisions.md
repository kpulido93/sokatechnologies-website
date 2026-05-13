# Registro de Decisiones

## 2026-05-07

### D-001: Mantener el repositorio sin framework por ahora

- Estado: aceptada.
- Motivo: evitar acoplar la base del proyecto a una tecnología antes de definir requisitos de contenido, despliegue y mantenimiento.
- Consecuencia: la estructura se limita a carpetas, placeholders y documentación.

### D-002: Priorizar documentación antes que implementación

- Estado: aceptada.
- Motivo: facilitar una revisión clara del alcance y de las decisiones iniciales.
- Consecuencia: las primeras iteraciones deben mantener un diff pequeño y centrado.

### D-003: Prohibir secretos y datos reales en la base inicial

- Estado: aceptada.
- Motivo: reducir riesgo operativo y de cumplimiento desde el inicio.
- Consecuencia: `.env.example` usa solo valores ficticios y la documentación evita referencias sensibles.
