# Prompts ajustados para Codex — Web WordPress de SokaTechnologies

**Archivo:** `prompts_codex_sokatechnologies_website_wordpress.md`
**Repositorio objetivo:** `sokatechnologies-website`
**Uso:** Prompts listos para ejecutar en Codex como issues/PRs pequeñas y revisables.
**Contexto:** Web pública en WordPress usando cPanel. El repo no versiona WordPress completo.
**Versión:** 1.0
**Fecha:** 2026-05-13

---

# 0. Objetivo del plan

Este documento contiene prompts ajustados para generar el contenido inicial del sitio web público de SokaTechnologies en archivos Markdown dentro del repositorio `sokatechnologies-website`.

La web será construida en WordPress usando cPanel, pero Codex **no debe tocar WordPress, cPanel ni producción**. Codex solo debe generar archivos de contenido y documentación revisables por pull request.

---

# 1. Principios obligatorios para todos los prompts

Codex debe trabajar bajo estas reglas en todas las tareas:

- Trabajar en tareas pequeñas y revisables.
- Crear una rama por prompt.
- Modificar solo los archivos permitidos por la tarea.
- No hacer cambios masivos sin plan.
- No tocar producción.
- No acceder a cPanel.
- No crear `.cpanel.yml`.
- No versionar WordPress core.
- No subir `wp-config.php`.
- No incluir credenciales.
- No incluir tokens.
- No incluir secretos.
- No incluir dumps SQL.
- No incluir backups.
- No incluir datos reales de clientes.
- No inventar clientes, testimonios, cifras ni casos de éxito.
- No incluir HTML; el contenido debe estar en Markdown.
- Mantener tono B2B, profesional, claro y consultivo.
- Posicionar a SokaTechnologies como empresa tecnológica, no como freelancer.
- Vender resultados de negocio: ahorro de tiempo, reducción de errores, trazabilidad, control operativo, seguridad, reportes confiables y continuidad operativa.

---

# 2. Documentos de referencia del repo

Antes de generar contenido, Codex debe leer los documentos disponibles del repo y priorizar estos si existen:

- `00_Contexto_Empresa.md`
- `01_Vision_Mision_Posicionamiento.md`
- `02_Oferta_Servicios.md`
- `03_Mercado_Clientes_Ideales.md`
- `04_Modelo_Negocio_Ingresos.md`
- `05_Roadmap_90_Dias.md`
- `13_Casos_Exito_Anonimizados.md`
- `33_Seguridad_Confidencialidad.md`
- `40_AutoInventario_Alcance_Producto.md`
- `41_AutoInventario_Remediacion_Tecnica.md`
- `42_Portik_Pitch_Comercial_y_Demo.md`
- `42_Portik_Propuesta_Piloto.md`
- `43_Portik_Validacion_Mercado.md`
- `44_AutoWhatsapp_Alcance_Uso_Aceptable.md`
- `45_Portafolio_Productos_SokaTechnologies.md`
- `website/pages/00_mapa_sitio.md`, cuando exista

Si un documento no existe, Codex debe continuar usando los documentos disponibles y declarar el supuesto tomado.

---

# 3. Orden recomendado de ejecución

Ejecutar como issues/PRs separadas:

1. Prompt 0 — Verificar estructura base.
2. Prompt 1 — Crear mapa del sitio.
3. Prompt 2 — Crear página de Inicio.
4. Prompt 3 — Crear página Servicios.
5. Prompt 4A — Crear página Software a medida.
6. Prompt 4B — Crear página Automatizaciones.
7. Prompt 4C — Crear página Dashboards y analítica.
8. Prompt 4D — Crear página Infraestructura y soporte.
9. Prompt 4E — Crear página Sitios web corporativos.
10. Prompt 5 — Crear página Portik.
11. Prompt 6 — Crear página AutoInventario.
12. Prompt 7 — Crear páginas Sobre nosotros, Casos de uso y Contacto.
13. Prompt 8 — Crear Política de privacidad y Términos de uso como borradores.
14. Prompt 9 — Revisión SEO, consistencia y tono.
15. Prompt 10 — Crear guía de carga manual en WordPress.

---

# 4. Checklist común antes de aceptar cualquier PR de Codex

## Alcance

- [ ] La PR corresponde a una sola tarea.
- [ ] Solo modificó los archivos permitidos.
- [ ] No modificó archivos fuera del alcance.
- [ ] El diff es pequeño y revisable.
- [ ] No hizo cambios masivos.
- [ ] No reescribió contenido estratégico existente sin instrucción explícita.

## Seguridad y confidencialidad

- [ ] No hay credenciales.
- [ ] No hay tokens.
- [ ] No hay secretos.
- [ ] No hay datos reales de clientes.
- [ ] No hay información de cPanel.
- [ ] No hay `wp-config.php`.
- [ ] No hay `.env`.
- [ ] No hay archivos SQL.
- [ ] No hay backups.
- [ ] No hay WordPress core.

## WordPress / cPanel

- [ ] No creó `.cpanel.yml`.
- [ ] No tocó producción.
- [ ] No agregó comandos productivos.
- [ ] No asumió plugins no aprobados.
- [ ] No modificó child theme salvo que la tarea lo indique.
- [ ] No instaló ni recomendó instalar plugins sin criterio claro.

## Contenido comercial

- [ ] No posiciona SokaTechnologies como freelancer.
- [ ] No vende solo programación.
- [ ] Comunica resultados de negocio.
- [ ] No promete resultados garantizados.
- [ ] No inventa clientes.
- [ ] No inventa testimonios.
- [ ] No inventa métricas.
- [ ] No usa lenguaje exagerado.
- [ ] El tono es profesional, claro y consultivo.

## Productos propios

- [ ] Portik respeta el alcance MVP.
- [ ] Portik no promete app móvil, pagos, hardware, OCR, reconocimiento automático de placas ni integraciones complejas como si ya existieran.
- [ ] AutoInventario se presenta como solución técnica en evaluación, diagnóstico o remediación si así indica la documentación.
- [ ] AutoInventario no se presenta como inventario comercial de mercancía.
- [ ] Auto Whatsapp no se presenta como herramienta de spam, campañas masivas, loterías, apuestas, captación o comunicaciones sin consentimiento.

## SEO y WordPress

- [ ] Cada página tiene título de página.
- [ ] Cada página tiene slug sugerido.
- [ ] Cada página tiene título SEO.
- [ ] Cada página tiene meta description.
- [ ] Cada página tiene CTA.
- [ ] Hay enlaces internos sugeridos.
- [ ] El contenido puede copiarse manualmente a WordPress.

## Legal

- [ ] Política de privacidad y términos se marcan como borradores.
- [ ] No se presentan como asesoría legal definitiva.
- [ ] No afirman cumplimiento legal específico sin revisión profesional.
- [ ] Queda pendiente revisión legal antes de publicar.

---

# Prompt 0 — Verificar estructura base del repo

Copia esto en Codex:

```markdown
## Tarea para Codex

### Objetivo
Verificar que el repositorio `sokatechnologies-website` está listo para generar contenido del sitio web en Markdown.

### Contexto
Este repositorio se usará para documentación, contenido web, child theme, assets, snippets y checklists de una web pública en WordPress usando cPanel.

El contenido comercial del sitio se generará en Markdown dentro de `website/pages/` y luego se copiará manualmente a WordPress.

### Rama sugerida
Crear o trabajar en una rama llamada:

`content/00-verificar-estructura`

### Tarea
Revisar si existen:

- `README.md`
- `AGENTS.md`
- `.gitignore`
- `docs/`
- `website/`
- `website/pages/`

Si falta `website/pages/`, crearla con un archivo `.gitkeep`.

### Restricciones
- No modificar contenido estratégico existente.
- No modificar documentos fuera de lo estrictamente necesario.
- No tocar producción.
- No crear archivos de WordPress core.
- No crear `.cpanel.yml`.
- No incluir credenciales.
- No incluir tokens.
- No instalar dependencias.
- No agregar plugins.
- No generar contenido comercial todavía.

### No modificar
- No modificar child theme.
- No modificar archivos de configuración de cPanel.
- No crear archivos `.env`.
- No crear archivos SQL.
- No crear backups.
- No crear páginas de contenido todavía.

### Criterios de aceptación
- Existe `website/pages/`.
- Si se creó la carpeta, incluye `.gitkeep`.
- No se modificaron archivos fuera de lo necesario.
- No se incluyeron secretos.
- No se incluyeron archivos de WordPress core.
- Codex reporta qué encontró y qué creó.

### Entrega esperada
Al finalizar, reporta:

1. Archivos o carpetas revisadas.
2. Archivos o carpetas creadas.
3. Riesgos o pendientes.
4. Confirmación de que no se incluyeron datos sensibles.
```

---

# Prompt 1 — Preparar estructura de contenido del sitio

Copia esto en Codex:

```markdown
## Tarea para Codex

### Objetivo
Crear la estructura inicial de contenido del sitio web corporativo de SokaTechnologies, en archivos Markdown listos para revisar y luego copiar a WordPress.

### Contexto
SokaTechnologies es una empresa B2B en etapa inicial enfocada en software a medida, automatizaciones de flujos de trabajo, integraciones, dashboards, sitios web corporativos, infraestructura cloud/on-prem, soporte técnico y mantenimiento recurrente.

La empresa no debe vender “programación” como commodity. Debe vender resultados de negocio: ahorro de tiempo, reducción de errores, trazabilidad, control operativo, seguridad, reportes confiables y continuidad operativa.

### Rama sugerida
Crear o trabajar en una rama llamada:

`content/01-mapa-sitio`

### Archivos de referencia
Lee y usa como fuente principal la documentación existente del repositorio, especialmente:

- `00_Contexto_Empresa.md`
- `01_Vision_Mision_Posicionamiento.md`, si existe
- `02_Oferta_Servicios.md`, si existe
- `03_Mercado_Clientes_Ideales.md`, si existe
- `04_Modelo_Negocio_Ingresos.md`, si existe
- `05_Roadmap_90_Dias.md`, si existe
- `40_AutoInventario_Alcance_Producto.md`, si existe
- `41_AutoInventario_Remediacion_Tecnica.md`, si existe
- `42_Portik_Pitch_Comercial_y_Demo.md`, si existe
- `42_Portik_Propuesta_Piloto.md`, si existe
- `43_Portik_Validacion_Mercado.md`, si existe
- `44_AutoWhatsapp_Alcance_Uso_Aceptable.md`, si existe
- `45_Portafolio_Productos_SokaTechnologies.md`, si existe
- Documentos comerciales, operativos y de productos disponibles

### Tarea
Crear la carpeta, si no existe:

`website/pages/`

Dentro de esa carpeta, crear el archivo:

`website/pages/00_mapa_sitio.md`

El archivo debe incluir:

1. Mapa de páginas recomendado.
2. Objetivo de cada página.
3. Público objetivo de cada página.
4. Mensaje principal.
5. CTA recomendado.
6. Notas de SEO:
   - slug sugerido
   - título SEO
   - meta description
7. Enlaces internos sugeridos entre páginas.
8. Prioridad sugerida de publicación.
9. Nota de qué páginas requieren revisión legal o comercial antes de publicar.

### Restricciones
- No inventar clientes reales.
- No revelar información confidencial.
- No usar datos sensibles.
- No posicionar SokaTechnologies como freelancer.
- No prometer resultados garantizados.
- No vender AutoInventario como producto listo si la documentación indica que está pendiente de remediación.
- No promover Auto Whatsapp como herramienta de spam, campañas masivas, apuestas, loterías o captación.
- No modificar documentos estratégicos existentes.
- No modificar archivos fuera de `website/pages/`.
- No incluir HTML.

### No modificar
- No modificar `README.md`.
- No modificar `AGENTS.md`.
- No modificar `docs/`.
- No modificar child theme.
- No crear `.cpanel.yml`.
- No crear archivos de WordPress core.
- No tocar producción.

### Estilo esperado
- Español profesional, claro y comercial.
- Orientado a empresas pequeñas y medianas de Panamá, República Dominicana y Latinoamérica.
- Tono consultivo, confiable y práctico.
- Enfoque en resultados de negocio, no solo tecnología.
- Contenido fácil de revisar antes de copiar a WordPress.

### Criterios de aceptación
- Existe `website/pages/00_mapa_sitio.md`.
- El mapa cubre las páginas principales del sitio.
- Cada página tiene objetivo, CTA, SEO y enlaces internos sugeridos.
- El contenido respeta la documentación del repositorio.
- No se incluyen datos confidenciales ni afirmaciones no verificadas.
- No se modificaron archivos fuera del alcance.

### Entrega esperada
Al finalizar, reporta:

1. Archivos creados.
2. Resumen del mapa del sitio.
3. Riesgos o dudas.
4. Confirmación de que no se incluyeron datos sensibles.
```
