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

## 2026-05-13

### D-004: Orientar el repositorio a WordPress sobre cPanel

- Estado: aceptada.
- Motivo: la web pública se construirá en WordPress usando las herramientas disponibles del hosting cPanel.
- Consecuencia: el repositorio documenta operación, child theme, assets, snippets y checklists, pero no versiona WordPress core ni configuración productiva.

### D-005: Mantener el child theme como personalización mínima

- Estado: aceptada.
- Motivo: reducir acoplamiento al tema padre hasta confirmar la elección definitiva.
- Consecuencia: `Template: parent-theme-folder-name` queda como placeholder y `functions.php` solo carga `assets/css/soka-custom.css`.
