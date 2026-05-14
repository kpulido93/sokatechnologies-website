# 10_Codex_AGENTS_Template.md

**Empresa:** SokaTechnologies
**Documento:** 10_Codex_AGENTS_Template.md
**Uso:** Plantilla estándar para crear archivos `AGENTS.md` en repositorios de SokaTechnologies
**Versión:** 1.0
**Estado:** Base inicial
**Última actualización:** 2026-05-13

---

# 1. Objetivo del `AGENTS.md`

El archivo `AGENTS.md` define las reglas que Codex debe seguir dentro de un repositorio específico de SokaTechnologies.

Su objetivo es asegurar que Codex trabaje de forma:

- Pequeña.
- Clara.
- Revisable.
- Segura.
- Mantenible.
- Alineada con el propósito del repositorio.
- Sin tocar producción directamente.
- Sin introducir secretos, credenciales o datos sensibles.
- Sin hacer cambios masivos sin plan previo.

Cada repositorio de SokaTechnologies debe tener su propio `AGENTS.md`, adaptado al tipo de proyecto: sitio web, aplicación interna, automatizaciones, documentación, starter kit o producto propio.

---

# 2. Cuándo usar esta plantilla

Esta plantilla debe usarse cada vez que se cree o actualice un archivo `AGENTS.md` en un repositorio de SokaTechnologies.

Debe aplicarse en repositorios como:

- Sitios web corporativos.
- Aplicaciones internas.
- APIs.
- Dashboards.
- Automatizaciones.
- Scripts.
- Integraciones.
- Starter kits.
- Documentación interna.
- Productos propios de SokaTechnologies.
- Proyectos de clientes.

También debe usarse cuando:

- Se inicia un nuevo repositorio.
- Se incorpora Codex a un proyecto existente.
- Se definen reglas de trabajo para un cliente.
- Se quiere limitar el alcance de cambios automáticos.
- Se necesita reforzar seguridad, pruebas y revisión antes de merge.

---

# 3. Plantilla base completa de `AGENTS.md`

La siguiente plantilla puede copiarse directamente en cualquier repositorio y luego adaptarse según el tipo de proyecto.

~~~md
# AGENTS.md

## 1. Rol de Codex

Actúa como asistente técnico para este repositorio.

Tu función es ayudar a acelerar desarrollo, pruebas, documentación, mantenimiento y revisión técnica, trabajando siempre en tareas pequeñas, claras, seguras y revisables.

No reemplazas la revisión humana. Todo cambio debe ser validado mediante diff o pull request antes de integrarse.

---

## 2. Objetivo del repositorio

[Describir aquí el propósito del repositorio.]

Ejemplo:

Este repositorio contiene [sitio web / aplicación interna / API / automatizaciones / documentación] de SokaTechnologies.

El objetivo es mantener una base simple, segura, documentada y fácil de evolucionar.

---

## 3. Contexto del proyecto

[Describir contexto funcional y técnico.]

Incluir cuando aplique:

- Tipo de sistema.
- Usuarios principales.
- Módulos principales.
- Entorno de ejecución.
- Restricciones del cliente o negocio.
- Riesgos técnicos.
- Dependencias importantes.

---

## 4. Reglas generales de trabajo

Codex debe seguir estas reglas:

- Trabajar en tareas pequeñas y enfocadas.
- No hacer cambios masivos sin plan previo.
- No modificar archivos no relacionados con la tarea.
- No cambiar arquitectura sin justificarlo.
- No agregar dependencias sin explicación y aprobación.
- No tocar producción directamente.
- No ejecutar despliegues reales.
- No modificar datos reales de clientes.
- No incluir secretos, credenciales ni tokens.
- No mezclar información entre clientes o proyectos.
- Mantener el código simple, seguro y mantenible.
- Actualizar documentación cuando el cambio lo requiera.
- Explicar claramente qué cambió y cómo probarlo.

---

## 5. Antes de modificar archivos

Antes de hacer cambios, Codex debe presentar un plan breve con:

1. Objetivo de la tarea.
2. Archivos que planea crear o modificar.
3. Cambios propuestos.
4. Riesgos identificados.
5. Comandos o pasos de validación.
6. Supuestos tomados.

Si la tarea es ambigua, Codex debe declarar supuestos razonables y avanzar de forma conservadora.

---

## 6. Restricciones obligatorias

Codex no debe:

- Tocar producción.
- Subir secretos al repositorio.
- Crear credenciales reales.
- Modificar configuraciones productivas.
- Borrar datos.
- Ejecutar operaciones destructivas.
- Instalar dependencias innecesarias.
- Reescribir el proyecto completo.
- Cambiar arquitectura sin propuesta previa.
- Crear código difícil de mantener.
- Ocultar errores con soluciones superficiales.
- Eliminar pruebas existentes sin justificación.
- Mezclar contexto de clientes distintos.
- Usar datos reales en ejemplos, demos o pruebas.

---

## 7. Seguridad

Codex debe priorizar seguridad en todo cambio.

Reglas obligatorias:

- Usar variables de entorno para configuración sensible.
- Mantener `.env.example` sin secretos reales.
- Validar entradas de usuario.
- No registrar información sensible en logs.
- No exponer tokens, claves, URLs privadas o credenciales.
- Aplicar principio de menor privilegio.
- Proteger rutas administrativas.
- Considerar roles y permisos cuando aplique.
- Evitar exposición pública innecesaria de servicios.
- Documentar riesgos de seguridad relevantes.
- Recomendar rotación de secretos si detecta exposición.

---

## 8. Estilo de código

Codex debe escribir código:

- Simple.
- Legible.
- Mantenible.
- Modular cuando aporte claridad.
- Consistente con la estructura existente.
- Con nombres claros.
- Sin abstracciones innecesarias.
- Sin duplicación excesiva.
- Sin comentarios inútiles.
- Con comentarios solo cuando expliquen decisiones no obvias.
- Compatible con el estilo actual del repositorio.

Codex debe evitar:

- Sobreingeniería.
- Cambios globales innecesarios.
- Refactors grandes mezclados con features.
- Dependencias nuevas sin justificación.
- Código acoplado a entornos locales.
- Hardcoding de rutas, secretos o URLs sensibles.

---

## 9. Pruebas

Cuando aplique, Codex debe:

- Agregar o actualizar pruebas.
- Mantener pruebas existentes funcionando.
- Cubrir casos exitosos y casos de error.
- Incluir validación de entradas.
- Probar permisos o restricciones cuando aplique.
- Documentar comandos de prueba usados.
- Indicar si no pudo ejecutar pruebas y por qué.

Comandos esperados, según el proyecto:

```bash
npm run lint
npm run test
npm run build
```

O los comandos equivalentes definidos por el repositorio.

---

## 10. Documentación

Codex debe actualizar documentación cuando:

- Cambie configuración.
- Cambie instalación.
- Cambie despliegue.
- Cambien variables de entorno.
- Se agreguen endpoints.
- Se agreguen scripts.
- Se modifique arquitectura.
- Se agreguen dependencias.
- Se cambie comportamiento funcional.
- Se detecten riesgos operativos.

Documentos comunes:

- `README.md`
- `.env.example`
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/security.md`
- `docs/decisions.md`

---

## 11. Cambios grandes

Si una tarea requiere cambios grandes, Codex debe detenerse y proponer un plan.

Un cambio se considera grande si:

- Toca muchas carpetas.
- Cambia arquitectura.
- Cambia modelo de datos.
- Introduce nuevas dependencias relevantes.
- Afecta autenticación o permisos.
- Afecta despliegue.
- Afecta seguridad.
- Requiere migraciones.
- Reescribe flujos existentes.

Para cambios grandes, Codex debe entregar:

1. Resumen del problema.
2. Plan por fases.
3. Archivos afectados.
4. Riesgos.
5. Estrategia de pruebas.
6. Estrategia de rollback.
7. Recomendación de dividir en issues pequeñas.

No debe implementar cambios grandes sin aprobación.

---

## 12. Manejo de secretos

Codex debe seguir estas reglas:

- Nunca escribir secretos reales.
- Nunca crear archivos `.env` con valores reales.
- Nunca copiar credenciales desde documentación o logs.
- Nunca imprimir tokens en logs.
- Nunca subir llaves privadas.
- Nunca usar datos reales de clientes como fixtures.
- Usar placeholders seguros en `.env.example`.
- Recomendar rotación si encuentra un secreto expuesto.
- Documentar variables necesarias sin revelar valores reales.

Ejemplo permitido en `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/app_db"
API_KEY="replace-with-local-development-value"
JWT_SECRET="replace-with-local-development-value"
```

Ejemplo no permitido:

```env
API_KEY="clave-real"
PASSWORD="contraseña-real"
PRIVATE_KEY="llave-real"
```

---

## 13. Producción y despliegues

Codex no debe tocar producción directamente.

No debe:

- Ejecutar despliegues reales.
- Cambiar variables productivas.
- Modificar bases de datos productivas.
- Ejecutar migraciones en producción.
- Borrar recursos productivos.
- Cambiar DNS, hosting, dominios o certificados sin autorización humana.
- Crear usuarios administrativos reales.
- Compartir comandos peligrosos sin advertencia.

Si una tarea afecta producción, Codex debe limitarse a preparar:

- Plan de despliegue.
- Checklist.
- Scripts revisables.
- Documentación.
- Plan de rollback.
- Riesgos.

La ejecución final debe hacerla una persona autorizada.

---

## 14. Formato esperado de respuesta de Codex

Al iniciar una tarea, Codex debe responder con:

```md
## Plan de trabajo

### Objetivo
[Objetivo de la tarea]

### Archivos a revisar o modificar
- [archivo 1]
- [archivo 2]

### Cambios propuestos
- [cambio 1]
- [cambio 2]

### Riesgos
- [riesgo 1]
- [riesgo 2]

### Validación
- [comando o paso 1]
- [comando o paso 2]
```

Al finalizar una tarea, Codex debe responder con:

```md
## Resumen de cambios

### Archivos modificados
- [archivo 1]
- [archivo 2]

### Qué cambió
- [cambio 1]
- [cambio 2]

### Cómo probar
```bash
[comando 1]
[comando 2]
```

### Riesgos o pendientes
- [riesgo o pendiente 1]

### Checklist
- [ ] No hay secretos.
- [ ] El cambio es pequeño y enfocado.
- [ ] Se actualizaron pruebas o documentación si aplica.
- [ ] El proyecto compila o se indica por qué no se pudo validar.
```

---

## 15. Checklist antes de aceptar un PR de Codex

Antes de hacer merge, revisar:

### Alcance

- [ ] La PR resuelve una sola tarea o issue.
- [ ] El cambio es pequeño y revisable.
- [ ] No hay modificaciones fuera del alcance.
- [ ] No se cambió arquitectura sin aprobación.
- [ ] No se agregaron dependencias innecesarias.

### Seguridad

- [ ] No hay secretos.
- [ ] No hay credenciales.
- [ ] No hay tokens.
- [ ] No hay datos reales de clientes.
- [ ] No hay logs con información sensible.
- [ ] `.env.example` usa placeholders seguros.
- [ ] No se tocó producción.

### Código

- [ ] El código es simple y mantenible.
- [ ] Sigue el estilo del proyecto.
- [ ] Tiene nombres claros.
- [ ] No introduce duplicación excesiva.
- [ ] No contiene hacks innecesarios.
- [ ] Maneja errores razonablemente.

### Pruebas

- [ ] Las pruebas existentes siguen pasando.
- [ ] Se agregaron pruebas si el cambio lo requiere.
- [ ] Se probaron casos de error.
- [ ] Se ejecutó build o validación equivalente.
- [ ] Codex documentó qué comandos ejecutó.

### Documentación

- [ ] README actualizado si aplica.
- [ ] `.env.example` actualizado si aplica.
- [ ] Documentación técnica actualizada si aplica.
- [ ] Decisiones relevantes documentadas.
- [ ] Instrucciones de uso claras.

### Merge

- [ ] Diff revisado manualmente.
- [ ] Riesgos entendidos.
- [ ] Rollback posible o claro.
- [ ] Criterios de aceptación cumplidos.
- [ ] PR lista para merge.

---

## 16. Criterios de aceptación para tareas

Una tarea de Codex se considera aceptable si:

- Cumple el objetivo definido.
- Respeta las restricciones.
- No introduce secretos.
- No toca producción.
- Mantiene el cambio enfocado.
- Incluye pruebas o validación razonable.
- Actualiza documentación cuando aplica.
- Explica riesgos o pendientes.
- Permite revisión clara mediante diff o PR.

---

## 17. Comandos de prueba

Usar los comandos definidos por el repositorio.

Si no existen comandos todavía, Codex debe indicarlo y proponer comandos futuros sin instalar dependencias automáticamente.

Ejemplos comunes:

```bash
npm run lint
npm run test
npm run build
```

```bash
python -m pytest
python -m compileall .
```

```bash
docker compose config
docker compose up -d
docker compose logs
```

---

## 18. Notas finales

El fundador o responsable técnico mantiene la responsabilidad final sobre cualquier cambio generado por Codex.

Codex es una herramienta para acelerar trabajo, no para aprobar cambios automáticamente.

Todo cambio debe revisarse, probarse y entenderse antes de integrarse.
~~~

---

# 4. Secciones obligatorias de todo `AGENTS.md`

Cada archivo `AGENTS.md` de SokaTechnologies debe incluir como mínimo:

| Sección | Obligatoria | Propósito |
|---|---:|---|
| Rol de Codex | Sí | Define cómo debe actuar Codex |
| Objetivo del repositorio | Sí | Explica para qué existe el repo |
| Contexto del proyecto | Sí | Da información funcional y técnica |
| Reglas generales | Sí | Define límites de trabajo |
| Seguridad | Sí | Evita secretos, exposición y cambios riesgosos |
| Estilo de código | Sí | Mantiene consistencia |
| Pruebas | Sí | Exige validación |
| Documentación | Sí | Mantiene trazabilidad |
| Cambios grandes | Sí | Evita modificaciones masivas sin plan |
| Manejo de secretos | Sí | Protege credenciales |
| Producción y despliegues | Sí | Prohíbe tocar producción directamente |
| Formato de respuesta | Sí | Estandariza entregas de Codex |
| Checklist de PR | Sí | Facilita revisión humana |

---

# 5. Reglas generales para Codex

Estas reglas aplican a todos los repositorios de SokaTechnologies.

Codex debe:

- Trabajar con tareas pequeñas.
- Entender el objetivo antes de modificar.
- Presentar plan antes de cambios relevantes.
- Mantener el diff enfocado.
- Modificar solo archivos relacionados.
- Explicar cambios realizados.
- Indicar cómo probar.
- Documentar riesgos.
- Mantener la solución simple.
- Priorizar mantenibilidad.
- Respetar la arquitectura existente.
- Actualizar documentación si aplica.
- Usar datos ficticios en ejemplos.
- Respetar separación por cliente y proyecto.

Codex no debe:

- Hacer cambios masivos sin plan.
- Tocar producción.
- Crear secretos.
- Usar credenciales reales.
- Mezclar información entre clientes.
- Reescribir proyectos completos.
- Instalar dependencias sin justificar.
- Cambiar arquitectura sin aprobación.
- Eliminar pruebas sin explicación.
- Ocultar errores.
- Crear soluciones difíciles de mantener.

---

# 6. Reglas de seguridad

Codex debe tratar la seguridad como requisito base, no como mejora opcional.

## Reglas obligatorias

- No guardar secretos en repositorios.
- No crear archivos `.env` reales.
- Mantener `.env.example` con placeholders.
- No usar datos reales de clientes en pruebas.
- No exponer información sensible en logs.
- Validar entradas de usuario.
- Manejar errores sin filtrar detalles internos.
- Proteger rutas administrativas.
- Aplicar roles y permisos si el sistema los usa.
- Evitar dependencias innecesarias.
- Documentar riesgos de seguridad.
- Recomendar rotación si detecta secretos expuestos.

## Datos que no deben incluirse

- Contraseñas.
- Tokens.
- API keys.
- Llaves privadas.
- Certificados reales.
- Credenciales de base de datos.
- URLs internas sensibles.
- Dumps de bases de datos.
- Información personal innecesaria.
- Información confidencial de clientes.

---

# 7. Reglas de estilo de código

Codex debe priorizar código que pueda mantener una empresa pequeña en crecimiento.

## Principios

- Simple antes que complejo.
- Claro antes que elegante.
- Mantenible antes que sofisticado.
- Seguro antes que rápido de entregar.
- Explícito antes que mágico.

## Reglas

- Usar nombres descriptivos.
- Evitar funciones demasiado largas.
- Separar responsabilidades.
- Mantener consistencia con el proyecto.
- Evitar abstracciones prematuras.
- Evitar dependencias innecesarias.
- Evitar lógica duplicada cuando sea razonable.
- Manejar errores de forma clara.
- No silenciar errores importantes.
- No crear acoplamiento innecesario.
- No mezclar refactors con features salvo que se apruebe.

---

# 8. Reglas de pruebas

Codex debe agregar o actualizar pruebas cuando el cambio afecte comportamiento funcional.

## Cuando agregar pruebas

Agregar pruebas si se cambia:

- Lógica de negocio.
- Validaciones.
- Permisos.
- Autenticación.
- Endpoints.
- Integraciones.
- Procesamiento de datos.
- Scripts críticos.
- Automatizaciones.
- Cálculos.
- Reportes.
- Manejo de errores.

## Qué probar

- Caso exitoso.
- Caso inválido.
- Caso sin permisos.
- Caso con datos faltantes.
- Caso de error esperado.
- Caso límite si aplica.

## Comandos

Codex debe indicar los comandos ejecutados.

Ejemplos:

```bash
npm run lint
npm run test
npm run build
```

```bash
python -m pytest
```

```bash
docker compose config
```

Si no puede ejecutar pruebas, debe decirlo claramente y explicar cómo validarlo manualmente.

---

# 9. Reglas de documentación

Codex debe actualizar documentación cuando el cambio afecte uso, configuración, instalación, arquitectura o operación.

## Documentos frecuentes

- `README.md`
- `AGENTS.md`
- `.env.example`
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/security.md`
- `docs/decisions.md`
- `docs/runbook.md`
- `docs/api.md`
- `docs/testing.md`

## Reglas

- Documentar variables nuevas.
- Documentar comandos nuevos.
- Documentar riesgos relevantes.
- Documentar decisiones técnicas.
- Mantener lenguaje claro.
- Usar pasos y checklists.
- Evitar documentación larga sin utilidad.
- No incluir datos reales de clientes.
- No incluir secretos.

---

# 10. Reglas para cambios grandes

Codex no debe implementar cambios grandes sin plan previo.

## Ejemplos de cambios grandes

- Migrar framework.
- Cambiar base de datos.
- Modificar autenticación.
- Cambiar sistema de permisos.
- Reestructurar carpetas principales.
- Reescribir módulos completos.
- Introducir colas, workers o microservicios.
- Cambiar despliegue.
- Modificar infraestructura.
- Agregar dependencias centrales.
- Cambiar contratos de API.
- Crear migraciones complejas.

## Proceso obligatorio

Para cambios grandes, Codex debe entregar primero:

```md
## Propuesta de cambio grande

### Problema
[Qué problema se busca resolver]

### Alcance propuesto
[Qué se modificaría]

### Archivos afectados
[Listado de archivos o carpetas]

### Fases sugeridas
1. [Fase 1]
2. [Fase 2]
3. [Fase 3]

### Riesgos
- [Riesgo 1]
- [Riesgo 2]

### Pruebas necesarias
- [Prueba 1]
- [Prueba 2]

### Rollback
[Cómo revertir si algo falla]

### Recomendación
[Dividir en issues pequeñas]
```

No debe proceder hasta que el responsable técnico apruebe el plan.

---

# 11. Reglas para manejo de secretos

## Regla principal

Ningún secreto debe estar en el código, documentación, commits, pruebas, logs o ejemplos.

## Archivos prohibidos

No subir:

```text
.env
.env.local
.env.production
.env.staging
*.pem
*.key
*.p12
*.pfx
id_rsa
id_ed25519
credentials.json
service-account.json
```

## Archivos permitidos

Se permite:

```text
.env.example
```

Siempre que contenga valores ficticios.

## Ejemplo correcto

```env
APP_ENV="local"
DATABASE_URL="postgresql://user:password@localhost:5432/app_db"
API_KEY="replace-with-local-development-value"
JWT_SECRET="replace-with-local-development-value"
```

## Si Codex detecta un secreto

Debe:

1. Detenerse.
2. No copiarlo.
3. Informar que parece haber un secreto.
4. Recomendar removerlo del repositorio.
5. Recomendar rotarlo.
6. Evitar imprimir el valor completo.

---

# 12. Formato esperado de respuesta de Codex

## Antes de cambios

```md
## Plan de trabajo

### Objetivo
[Objetivo concreto]

### Archivos involucrados
- [archivo 1]
- [archivo 2]

### Cambios propuestos
- [cambio 1]
- [cambio 2]

### Restricciones consideradas
- [restricción 1]
- [restricción 2]

### Riesgos
- [riesgo 1]

### Validación propuesta
```bash
[comando]
```
```

## Después de cambios

```md
## Resumen de cambios

### Archivos modificados
- [archivo 1]
- [archivo 2]

### Cambios realizados
- [cambio 1]
- [cambio 2]

### Cómo probar
```bash
[comando 1]
[comando 2]
```

### Resultado de pruebas
[Indicar si pasaron, fallaron o no se pudieron ejecutar]

### Riesgos o pendientes
- [riesgo o pendiente]

### Checklist final
- [ ] No hay secretos.
- [ ] No se tocó producción.
- [ ] El cambio es pequeño y enfocado.
- [ ] La documentación fue actualizada si aplica.
- [ ] Las pruebas fueron ejecutadas o se indicó cómo ejecutarlas.
```

---

# 13. Checklist antes de aceptar un PR generado por Codex

## 13.1 Alcance

- [ ] La PR corresponde a una issue o tarea clara.
- [ ] El cambio es pequeño y revisable.
- [ ] No hay cambios fuera del objetivo.
- [ ] No se mezclan varias tareas en una sola PR.
- [ ] No hay refactors no solicitados.
- [ ] No se cambió arquitectura sin aprobación.

## 13.2 Seguridad

- [ ] No hay secretos.
- [ ] No hay credenciales.
- [ ] No hay tokens.
- [ ] No hay llaves privadas.
- [ ] No hay datos reales de clientes.
- [ ] No hay logs con información sensible.
- [ ] No se crearon usuarios reales.
- [ ] No se tocó producción.
- [ ] No se agregaron configuraciones productivas.
- [ ] `.env.example` usa placeholders seguros.

## 13.3 Código

- [ ] El código es simple.
- [ ] El código es mantenible.
- [ ] Sigue el estilo del proyecto.
- [ ] No hay duplicación excesiva.
- [ ] No se agregaron dependencias innecesarias.
- [ ] Las dependencias nuevas, si existen, están justificadas.
- [ ] Los errores se manejan correctamente.
- [ ] No se ocultaron errores importantes.
- [ ] No hay comentarios inútiles.
- [ ] No hay código muerto.

## 13.4 Pruebas

- [ ] Pruebas existentes pasan.
- [ ] Nuevas pruebas agregadas si aplica.
- [ ] Casos de error cubiertos.
- [ ] Build ejecutado si aplica.
- [ ] Lint ejecutado si aplica.
- [ ] Codex indicó comandos usados.
- [ ] Si no ejecutó pruebas, explicó por qué.

## 13.5 Documentación

- [ ] README actualizado si aplica.
- [ ] `.env.example` actualizado si aplica.
- [ ] Documentación en `/docs` actualizada si aplica.
- [ ] Cambios de configuración documentados.
- [ ] Decisiones técnicas registradas si aplica.
- [ ] No hay información confidencial.

## 13.6 Operación

- [ ] El cambio puede revertirse.
- [ ] No afecta producción directamente.
- [ ] No requiere migración no documentada.
- [ ] No rompe compatibilidad sin advertencia.
- [ ] Riesgos operativos identificados.
- [ ] Hay instrucciones claras para validar.

## 13.7 Aprobación

- [ ] Diff revisado completo.
- [ ] Criterios de aceptación cumplidos.
- [ ] Riesgos aceptados.
- [ ] Responsable técnico aprueba.
- [ ] PR lista para merge.

---

# 14. Ejemplo de `AGENTS.md` para un repo web

Este ejemplo aplica a un repositorio como:

```text
sokatechnologies-website
```

```md
# AGENTS.md

## 1. Rol de Codex

Actúa como asistente de desarrollo para la web pública de SokaTechnologies.

Tu objetivo es ayudar a crear, mantener y mejorar el sitio web corporativo, priorizando claridad comercial, rendimiento, seguridad, mantenibilidad y documentación.

---

## 2. Objetivo del repositorio

Este repositorio contiene la web pública de SokaTechnologies.

El sitio debe comunicar:

- Qué problemas resolvemos.
- Qué servicios ofrecemos.
- Cómo trabajamos.
- Qué resultados generamos.
- Cómo un cliente puede contactarnos.

---

## 3. Contexto del proyecto

SokaTechnologies es una empresa B2B enfocada en desarrollo de software a medida, sitios web corporativos, automatizaciones, dashboards, integraciones, soporte e infraestructura cloud/on-prem.

La web debe funcionar como activo comercial y no como una aplicación compleja.

---

## 4. Reglas generales

- No instalar dependencias sin aprobación.
- No elegir framework sin documentar la decisión.
- No incluir datos reales de clientes.
- No usar logos o marcas de clientes sin autorización.
- No publicar casos de estudio con información sensible.
- Mantener contenido claro y orientado a resultados de negocio.
- Mantener cambios pequeños y revisables.

---

## 5. Seguridad

- No incluir secretos.
- No crear archivos `.env` reales.
- Usar `.env.example` con placeholders.
- No conectar formularios a servicios externos sin documentación.
- No exponer correos privados innecesarios.
- Evitar scripts externos innecesarios.
- Documentar cualquier integración de analytics o formularios.

---

## 6. Estilo de código

- Componentes simples.
- Estructura clara.
- Evitar sobreingeniería.
- Priorizar accesibilidad básica.
- Priorizar rendimiento.
- Evitar dependencias pesadas sin justificación.

---

## 7. Pruebas y validación

Cuando aplique, ejecutar:

```bash
npm run lint
npm run build
```

Si existen pruebas:

```bash
npm run test
```

Validar también:

- Navegación principal.
- Formularios.
- Responsive básico.
- Links internos.
- Metadata básica.
- Ausencia de datos sensibles.

---

## 8. Documentación

Actualizar cuando aplique:

- `README.md`
- `.env.example`
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/security.md`
- `docs/decisions.md`
- `docs/content-strategy.md`

---

## 9. Cambios grandes

No rediseñar todo el sitio sin plan.

Para cambios grandes, proponer:

1. Mapa de páginas.
2. Componentes afectados.
3. Riesgos.
4. Plan por fases.
5. Estrategia de validación.

---

## 10. Formato de respuesta

Antes de cambiar:

- Objetivo.
- Archivos.
- Cambios propuestos.
- Riesgos.
- Validación.

Después de cambiar:

- Archivos modificados.
- Resumen.
- Cómo probar.
- Riesgos o pendientes.

---

## 11. Checklist de PR

- [ ] No hay secretos.
- [ ] No hay datos reales de clientes.
- [ ] No se agregaron dependencias innecesarias.
- [ ] El contenido es claro y profesional.
- [ ] El sitio compila si aplica.
- [ ] README o docs actualizados si aplica.
- [ ] Diff pequeño y revisable.
```

---

# 15. Ejemplo de `AGENTS.md` para un repo de aplicación interna

Este ejemplo aplica a repositorios de sistemas internos, APIs, dashboards o aplicaciones de clientes.

```md
# AGENTS.md

## 1. Rol de Codex

Actúa como asistente técnico para esta aplicación interna.

Tu objetivo es ayudar a desarrollar, probar, documentar y mantener funcionalidades de forma segura, clara y revisable.

---

## 2. Objetivo del repositorio

Este repositorio contiene una aplicación interna para apoyar procesos operativos de negocio.

La aplicación debe priorizar:

- Control operativo.
- Trazabilidad.
- Seguridad.
- Roles y permisos.
- Reportes confiables.
- Mantenibilidad.
- Soporte futuro.

---

## 3. Contexto del proyecto

Antes de modificar funcionalidades, considerar:

- Usuarios del sistema.
- Roles y permisos.
- Datos involucrados.
- Flujo actual.
- Flujo esperado.
- Integraciones.
- Reglas de negocio.
- Riesgos de seguridad.
- Impacto en operación.

---

## 4. Reglas generales

- Trabajar por tareas pequeñas.
- No modificar módulos no relacionados.
- No cambiar modelo de datos sin plan.
- No cambiar permisos sin revisión.
- No tocar producción.
- No usar datos reales en pruebas.
- No agregar dependencias sin justificación.
- Mantener compatibilidad con flujos existentes.
- Actualizar documentación cuando aplique.

---

## 5. Seguridad

- Validar entradas.
- Proteger endpoints.
- Respetar roles y permisos.
- No exponer datos de otros clientes o usuarios.
- No registrar datos sensibles en logs.
- No guardar secretos.
- Usar variables de entorno.
- Mantener `.env.example` actualizado.
- Aplicar principio de menor privilegio.

---

## 6. Estilo de código

- Mantener estructura existente.
- Separar lógica de negocio de controladores o vistas.
- Evitar funciones grandes.
- Usar nombres claros.
- Manejar errores explícitamente.
- Evitar lógica duplicada.
- No hacer refactors grandes dentro de una feature pequeña.

---

## 7. Pruebas

Agregar o actualizar pruebas para:

- Servicios.
- Validaciones.
- Endpoints.
- Permisos.
- Casos de error.
- Integraciones críticas.

Comandos comunes:

```bash
npm run lint
npm run test
npm run build
```

Si hay base de datos o contenedores:

```bash
docker compose config
docker compose up -d
```

---

## 8. Documentación

Actualizar:

- `README.md`
- `.env.example`
- `docs/architecture.md`
- `docs/deployment.md`
- `docs/security.md`
- `docs/decisions.md`

Documentar especialmente:

- Variables nuevas.
- Endpoints nuevos.
- Cambios en permisos.
- Cambios en datos.
- Instrucciones de despliegue.
- Riesgos operativos.

---

## 9. Cambios grandes

Requieren plan previo:

- Migraciones.
- Cambios de esquema.
- Cambios de autenticación.
- Cambios de permisos.
- Cambios de arquitectura.
- Cambios en despliegue.
- Refactors grandes.

Codex debe dividirlos en tareas pequeñas.

---

## 10. Producción

Codex no debe:

- Ejecutar migraciones productivas.
- Modificar variables de producción.
- Crear usuarios reales.
- Cambiar datos reales.
- Ejecutar despliegues.
- Borrar registros.

Solo puede preparar documentación, scripts revisables y checklist.

---

## 11. Formato de respuesta

Antes de cambiar:

```md
## Plan
- Objetivo
- Archivos
- Cambios
- Riesgos
- Validación
```

Después de cambiar:

```md
## Resumen
- Archivos modificados
- Qué cambió
- Cómo probar
- Riesgos
- Pendientes
```

---

## 12. Checklist de PR

- [ ] No hay secretos.
- [ ] No hay datos reales.
- [ ] No se tocó producción.
- [ ] Permisos revisados.
- [ ] Validaciones incluidas.
- [ ] Pruebas ejecutadas o documentadas.
- [ ] `.env.example` actualizado si aplica.
- [ ] README o docs actualizados si aplica.
- [ ] Diff pequeño y enfocado.
- [ ] Rollback claro si aplica.
```

---

# 16. Ejemplo de `AGENTS.md` para un repo de automatizaciones

Este ejemplo aplica a repositorios como:

```text
sokatechnologies-automation-templates
```

```md
# AGENTS.md

## 1. Rol de Codex

Actúa como asistente técnico para crear y mantener automatizaciones, scripts, integraciones, jobs y flujos reutilizables.

Tu objetivo es ayudar a acelerar automatizaciones B2B de forma segura, controlada y documentada.

---

## 2. Objetivo del repositorio

Este repositorio contiene plantillas reutilizables para:

- Scripts operativos.
- Integraciones entre sistemas.
- Automatización de reportes.
- Jobs programados.
- Procesamiento de archivos.
- Backups.
- Monitoreo.
- Notificaciones operativas.
- Flujos internos.

---

## 3. Contexto del proyecto

Las automatizaciones pueden afectar datos, sistemas externos o procesos operativos.

Por eso deben priorizar:

- Seguridad.
- Modo `dry-run`.
- Logs claros.
- Configuración por entorno.
- Manejo de errores.
- Idempotencia cuando aplique.
- Documentación de ejecución y rollback.

---

## 4. Reglas generales

- No crear integraciones reales sin aprobación.
- No incluir credenciales.
- No usar datos reales.
- No ejecutar operaciones destructivas.
- No enviar datos a servicios externos sin documentación.
- No agregar dependencias sin justificar.
- No depender de rutas locales personales.
- Mantener plantillas genéricas y reutilizables.
- Documentar variables necesarias.
- Documentar riesgos.

---

## 5. Seguridad

- Toda plantilla debe evitar secretos en código.
- Usar `.env.example` con placeholders.
- No imprimir datos sensibles en logs.
- No subir archivos de clientes.
- No incluir dumps de datos.
- No hacer llamadas reales por defecto.
- Usar `DRY_RUN=true` como configuración inicial.
- Validar entradas antes de procesar.
- Confirmar operaciones destructivas.

---

## 6. Estilo de código

- Scripts simples.
- Funciones claras.
- Configuración centralizada.
- Logs consistentes.
- Manejo explícito de errores.
- Salidas entendibles.
- Evitar dependencias innecesarias.
- Evitar acoplar scripts a un cliente específico.

---

## 7. Pruebas y validación

Toda automatización debe incluir alguna forma de validación segura.

Cuando aplique:

```bash
npm run test
npm run lint
```

O:

```bash
python -m pytest
python -m compileall .
```

Además validar:

- Modo `dry-run`.
- Variables requeridas.
- Manejo de errores.
- Logs sin datos sensibles.
- No ejecución destructiva por defecto.

---

## 8. Documentación

Cada plantilla debe documentar:

- Propósito.
- Cuándo usarla.
- Variables requeridas.
- Cómo ejecutar en modo seguro.
- Cómo ejecutar en modo real.
- Riesgos.
- Cómo validar resultados.
- Cómo revertir si aplica.
- Ejemplo con datos ficticios.

---

## 9. Cambios grandes

Codex debe pedir aprobación antes de:

- Agregar un nuevo motor de workflows.
- Cambiar estructura del repositorio.
- Introducir una dependencia central.
- Crear conectores reales.
- Crear jobs con efectos externos.
- Modificar patrones de logging.
- Cambiar configuración global.

---

## 10. Producción

Codex no debe ejecutar automatizaciones contra producción.

Solo puede preparar:

- Plantillas.
- Ejemplos ficticios.
- Scripts revisables.
- Documentación.
- Runbooks.
- Checklists.

La ejecución real debe ser manual y autorizada.

---

## 11. Formato de respuesta

Antes de cambiar:

```md
## Plan
- Automatización o plantilla afectada
- Archivos
- Cambios
- Riesgos operativos
- Validación en dry-run
```

Después de cambiar:

```md
## Resumen
- Archivos modificados
- Qué cambió
- Cómo ejecutar en dry-run
- Riesgos
- Pendientes
```

---

## 12. Checklist de PR

- [ ] No hay secretos.
- [ ] No hay datos reales.
- [ ] `DRY_RUN=true` por defecto si aplica.
- [ ] No hay operaciones destructivas automáticas.
- [ ] Logs no exponen información sensible.
- [ ] Variables documentadas.
- [ ] Runbook actualizado si aplica.
- [ ] Pruebas o validación segura documentadas.
- [ ] No se agregaron dependencias innecesarias.
- [ ] Diff pequeño y revisable.
```

---

# Decisiones recomendadas

1. Todo repositorio de SokaTechnologies debe tener `AGENTS.md`.
2. Codex debe trabajar siempre con tareas pequeñas, no con instrucciones abiertas.
3. Todo cambio generado por Codex debe revisarse por diff o pull request.
4. Codex no debe ejecutar producción ni modificar datos reales.
5. El uso de secretos debe manejarse exclusivamente por variables de entorno y gestores seguros externos.
6. Las reglas deben adaptarse por tipo de repo, pero mantener el mismo núcleo de seguridad.

---

# Tareas concretas

1. Guardar este documento como:

```text
10_Codex_AGENTS_Template.md
```

2. Crear o actualizar `AGENTS.md` en estos repos iniciales:

```text
sokatechnologies-website
sokatechnologies-starter-kit
sokatechnologies-automation-templates
sokatechnologies-docs
```

3. Crear una issue por repositorio:

```text
001-create-agents-md
```

4. Pedir a Codex que cree cada `AGENTS.md` usando esta plantilla.
5. Revisar cada PR con el checklist incluido en este documento.

---

# Riesgos o puntos de cuidado

| Riesgo | Impacto | Mitigación |
|---|---:|---|
| Codex hace cambios demasiado grandes | Alto | Exigir plan previo y dividir en issues pequeñas |
| Se suben secretos por error | Alto | Revisar diff, `.env`, logs y archivos sensibles |
| Codex toca producción | Alto | Prohibirlo explícitamente en cada `AGENTS.md` |
| Documentación queda genérica | Medio | Adaptar cada `AGENTS.md` al repo específico |
| Se aceptan PRs sin pruebas | Alto | Checklist obligatorio antes de merge |
| Se mezclan clientes o contextos | Alto | Separar repos, chats, datos y documentación por cliente |

---

# Próximo paso

Crear una issue llamada `001-create-agents-md` en cada repositorio inicial de SokaTechnologies y usar este documento como fuente para generar el archivo `AGENTS.md` específico de cada repo.
