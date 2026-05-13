# AGENTS

Guía breve para colaboradores humanos y agentes automatizados en este repositorio.

## Principios

- Mantener cambios pequeños, enfocados y fáciles de revisar.
- No introducir framework, dependencias o tooling sin dejar constancia en `docs/decisions.md`.
- No añadir secretos al repositorio. Toda configuración debe partir de placeholders seguros en `.env.example`.
- No incluir datos reales de clientes, credenciales ni material confidencial.
- Priorizar documentación clara antes de añadir complejidad técnica.

## Organización prevista

- `src/pages`: páginas y rutas públicas.
- `src/sections`: bloques de contenido reutilizables por página.
- `src/components`: componentes UI compartidos.
- `src/content`: contenido estructurado, copy y datos editoriales.
- `src/styles`: estilos globales, tokens y convenciones visuales.
- `src/lib`: utilidades y lógica transversal independiente del framework.
- `public`: archivos estáticos servibles tal cual.

## Reglas de trabajo

- Si una decisión cambia el alcance del repositorio, documentarla.
- Si aparece nueva configuración local, reflejarla en `.env.example`.
- Si se añade una carpeta nueva, justificar su propósito en la documentación o en el PR.
