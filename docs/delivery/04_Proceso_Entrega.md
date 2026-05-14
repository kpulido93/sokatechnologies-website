# 04_Proceso_Entrega.md

**Documento:** Proceso de Entrega de Proyectos
**Empresa:** SokaTechnologies
**Versión:** 1.0
**Última actualización:** 2026-05-13
**Uso:** Guía operativa interna para ejecutar proyectos de software, sitios web, automatizaciones, integraciones, dashboards, infraestructura y soporte.

---

## 1. Objetivo del proceso de entrega

El objetivo de este proceso es establecer una forma simple, repetible y controlada para entregar proyectos en SokaTechnologies desde la firma del contrato hasta el cierre formal y la transición a soporte mensual.

Este proceso busca:

- Evitar desorden operativo durante los proyectos.
- Proteger el margen y el tiempo del fundador.
- Reducir retrabajo causado por requerimientos ambiguos.
- Mantener comunicación clara con el cliente.
- Documentar decisiones, entregables y cambios.
- Facilitar el uso responsable de Codex como apoyo técnico.
- Preparar la empresa para delegar trabajo a freelancers o empleados en el futuro.
- Convertir proyectos terminados en relaciones recurrentes de soporte, mantenimiento y mejora continua.

Este proceso está diseñado para una empresa pequeña operada por una sola persona. Por eso prioriza claridad, control y documentación mínima útil, sin asumir la existencia de un project manager.

---

## 2. Principios del proceso de entrega

Todo proyecto de SokaTechnologies debe seguir estos principios:

| Principio | Regla práctica |
|---|---|
| Alcance claro | No iniciar desarrollo sin alcance escrito y aprobado. |
| Anticipo obligatorio | No iniciar proyecto sin pago inicial acordado. |
| Comunicación centralizada | Usar un canal oficial por cliente o proyecto. |
| Decisiones documentadas | Toda aprobación importante debe quedar por escrito. |
| Entregas por hitos | Dividir el proyecto en fases pequeñas y verificables. |
| Cambios controlados | Lo que no esté en alcance se maneja como cambio o nueva fase. |
| Seguridad básica | No usar datos sensibles innecesarios ni guardar secretos en repositorios. |
| Documentación mínima | Todo proyecto debe tener instrucciones, accesos, despliegue y cierre. |
| Revisión antes de producción | No desplegar sin pruebas, backup y checklist. |
| Soporte recurrente | Todo cierre debe incluir oferta de soporte mensual. |

---

## 3. Etapas del proyecto desde contrato hasta cierre

| Etapa | Objetivo | Entregable principal |
|---|---|---|
| 1. Contrato y anticipo | Formalizar el inicio | Contrato, propuesta aprobada y pago inicial |
| 2. Inicio interno | Preparar estructura del proyecto | Carpeta, repositorio, tablero y checklist inicial |
| 3. Kickoff | Alinear expectativas con el cliente | Minuta de kickoff |
| 4. Levantamiento | Entender procesos, usuarios, datos y reglas | Documento de requerimientos |
| 5. Alcance | Definir qué entra y qué no entra | Alcance aprobado |
| 6. Diseño funcional | Describir cómo funcionará la solución | Flujos, pantallas, reportes o prototipo simple |
| 7. Diseño técnico | Definir arquitectura y componentes | Diseño técnico inicial |
| 8. Desarrollo | Construir la solución | Módulos o entregables funcionales |
| 9. QA interno | Validar antes de mostrar al cliente | Checklist QA completado |
| 10. Revisión con cliente | Obtener feedback y aprobación | Aprobación UAT o lista de ajustes |
| 11. Despliegue | Publicar en ambiente acordado | Release desplegado |
| 12. Capacitación | Enseñar uso básico | Sesión y guía de uso |
| 13. Entrega formal | Confirmar entrega del alcance | Acta o correo de entrega |
| 14. Garantía | Atender errores cubiertos por el proyecto | Correcciones dentro de garantía |
| 15. Soporte mensual | Mantener y mejorar la solución | Plan de soporte activo |
| 16. Cierre | Archivar y documentar cierre | Checklist de cierre completado |

---

## 4. Checklist de inicio de proyecto

Antes de iniciar cualquier proyecto, se debe completar este checklist:

| Ítem | Estado |
|---|---|
| Propuesta comercial aprobada por el cliente | Pendiente |
| Contrato, acuerdo o aprobación formal recibida | Pendiente |
| Anticipo recibido o fecha de pago confirmada | Pendiente |
| Alcance inicial identificado | Pendiente |
| Exclusiones iniciales definidas | Pendiente |
| Responsable principal del cliente identificado | Pendiente |
| Canal oficial de comunicación definido | Pendiente |
| Carpeta del cliente creada | Pendiente |
| Carpeta del proyecto creada | Pendiente |
| Repositorio Git creado, si aplica | Pendiente |
| Tablero de tareas creado | Pendiente |
| Accesos solicitados | Pendiente |
| Riesgos iniciales registrados | Pendiente |
| Fecha de kickoff definida | Pendiente |

### Estructura mínima recomendada

    Clientes/
      Cliente_X/
        Proyecto_Y/
          00_Comercial/
          01_Requerimientos/
          02_Diseno_Funcional/
          03_Diseno_Tecnico/
          04_Desarrollo/
          05_QA/
          06_Despliegue/
          07_Capacitacion/
          08_Soporte/
          09_Cierre/

---

## 5. Reunión de kickoff

### Objetivo

La reunión de kickoff sirve para alinear expectativas, confirmar responsables, revisar el alcance inicial y establecer la forma de trabajo.

No debe ser una reunión técnica profunda. Debe dejar claro cómo se ejecutará el proyecto.

### Participantes mínimos

- Fundador o responsable de SokaTechnologies.
- Contacto principal del cliente.
- Usuarios clave, si aplica.
- Persona que aprueba entregables, si es diferente del contacto principal.

### Agenda sugerida

1. Presentación rápida de participantes.
2. Objetivo del proyecto.
3. Problema que se busca resolver.
4. Alcance inicial aprobado.
5. Exclusiones conocidas.
6. Responsabilidades de SokaTechnologies.
7. Responsabilidades del cliente.
8. Canal oficial de comunicación.
9. Frecuencia de seguimiento.
10. Accesos e información pendiente.
11. Riesgos o dependencias iniciales.
12. Próximos pasos y fechas inmediatas.

### Resultado esperado

Al finalizar el kickoff debe existir una minuta con:

- Fecha de reunión.
- Participantes.
- Decisiones tomadas.
- Pendientes del cliente.
- Pendientes de SokaTechnologies.
- Próxima fecha de revisión.

---

## 6. Levantamiento de requerimientos

### Objetivo

Entender el proceso actual del cliente, los problemas reales, los usuarios, los datos, las reglas de negocio y los resultados esperados antes de construir.

### Qué se debe levantar

| Área | Preguntas clave |
|---|---|
| Contexto del negocio | ¿Qué hace la empresa y qué problema quiere resolver? |
| Proceso actual | ¿Cómo se hace hoy el trabajo? |
| Dolor principal | ¿Qué errores, retrasos o riesgos existen? |
| Usuarios | ¿Quién usará la solución? |
| Roles y permisos | ¿Qué puede ver o hacer cada usuario? |
| Datos | ¿Qué información se captura, consulta o procesa? |
| Reglas de negocio | ¿Qué validaciones o condiciones deben cumplirse? |
| Reportes | ¿Qué información necesita ver gerencia o supervisión? |
| Integraciones | ¿Con qué sistemas, APIs, archivos o bases debe conectarse? |
| Infraestructura | ¿Dónde se alojará o ejecutará la solución? |
| Seguridad | ¿Qué información debe protegerse? |
| Aprobación | ¿Quién valida que el entregable está correcto? |

### Entregable

El resultado debe ser un documento simple de requerimientos con:

- Objetivo del proyecto.
- Usuarios.
- Flujos principales.
- Funcionalidades incluidas.
- Funcionalidades excluidas.
- Datos requeridos.
- Reportes.
- Integraciones.
- Criterios de aceptación.
- Riesgos.
- Dependencias del cliente.

### Uso de Codex en esta etapa

Codex puede ayudar a:

- Convertir notas de reuniones en requerimientos estructurados.
- Crear criterios de aceptación por funcionalidad.
- Detectar ambigüedades en requerimientos.
- Generar casos de prueba preliminares.
- Proponer preguntas faltantes para el cliente.

Regla: no incluir secretos, credenciales, datos personales innecesarios ni información sensible del cliente al usar Codex.

---

## 7. Definición de alcance

### Objetivo

Definir claramente qué se entregará, qué no se entregará y bajo qué condiciones se considerará completado el proyecto.

### Alcance incluido

Debe describir los entregables comprometidos. Ejemplos:

- Módulos del sistema.
- Páginas del sitio web.
- Automatizaciones específicas.
- Dashboards y reportes.
- Integraciones definidas.
- Configuración de infraestructura.
- Documentación y capacitación.

### Alcance excluido

Debe dejar claro lo que no está incluido. Ejemplos:

- App móvil nativa.
- Integraciones no mencionadas.
- Migración histórica completa de datos.
- Rediseños ilimitados.
- Soporte 24/7.
- Compra de dominios, licencias o servicios externos.
- Cambios solicitados después de aprobación final.

### Criterios de aceptación

Cada entregable importante debe tener criterios de aceptación.

Ejemplo:

| Entregable | Criterio de aceptación |
|---|---|
| Formulario de clientes | Permite crear, editar, consultar y desactivar clientes. |
| Dashboard gerencial | Muestra métricas acordadas con filtros por fecha. |
| Automatización de reportes | Genera archivo en formato acordado y registra errores. |
| Sitio web | Carga correctamente en desktop y móvil, con formulario funcional. |

### Regla de control

Si una solicitud no está en el alcance aprobado, debe manejarse como:

1. Ajuste menor dentro del alcance.
2. Cambio de alcance con costo y fecha adicional.
3. Nueva fase del proyecto.
4. Solicitud para soporte mensual o bolsa de horas.

---

## 8. Diseño funcional

### Objetivo

Definir cómo funcionará la solución desde el punto de vista del usuario antes de construirla.

### Elementos del diseño funcional

Según el tipo de proyecto, puede incluir:

| Proyecto | Diseño funcional recomendado |
|---|---|
| Software a medida | Flujos, pantallas, roles y reglas de negocio |
| Sitio web | Mapa del sitio, secciones, formularios y contenido |
| Automatización | Flujo actual, flujo automatizado, entradas y salidas |
| Integración | Sistemas origen/destino, eventos, datos y errores |
| Dashboard | Métricas, filtros, fuentes de datos y usuarios |
| Infraestructura | Servicios, accesos, dominios, ambientes y responsabilidades |

### Nivel de detalle recomendado

Como SokaTechnologies es operada por una sola persona, el diseño funcional debe ser suficiente para evitar confusión, no un documento excesivamente largo.

Debe responder:

- ¿Qué hará el usuario?
- ¿Qué verá el usuario?
- ¿Qué información se captura?
- ¿Qué validaciones existen?
- ¿Qué pasa si hay error?
- ¿Qué reportes o salidas se generan?
- ¿Qué queda fuera?

### Uso de Codex en esta etapa

Codex puede ayudar a:

- Convertir requerimientos en historias de usuario.
- Crear flujos funcionales.
- Sugerir casos borde.
- Preparar wireframes textuales.
- Crear checklist de validación funcional.

---

## 9. Diseño técnico

### Objetivo

Definir la solución técnica de forma simple, segura y mantenible.

### Elementos mínimos

| Área | Definición requerida |
|---|---|
| Arquitectura | Componentes principales y cómo se comunican |
| Tecnología | Lenguaje, framework, base de datos y servicios |
| Datos | Entidades, tablas, campos principales o estructura |
| Seguridad | Roles, permisos, autenticación y protección de datos |
| Integraciones | APIs, archivos, webhooks o conexiones externas |
| Ambientes | Desarrollo, pruebas, staging y producción, si aplica |
| Configuración | Variables de entorno y servicios requeridos |
| Backups | Qué se respalda y cómo se restaura |
| Logs | Qué eventos o errores deben registrarse |
| Despliegue | Dónde y cómo se publicará |

### Entregables técnicos mínimos

- Arquitectura resumida.
- Modelo de datos inicial, si aplica.
- Estructura de carpetas.
- Variables de entorno en `.env.example`.
- Estrategia de despliegue.
- Checklist de seguridad básica.
- Plan de backup, si aplica.

### Uso de Codex en esta etapa

Codex puede ayudar a:

- Proponer arquitectura inicial.
- Revisar estructura de carpetas.
- Generar modelos de datos preliminares.
- Crear endpoints o contratos de API.
- Crear checklist técnico por tipo de proyecto.
- Revisar riesgos de seguridad básicos.

Regla: Codex no debe recibir credenciales, tokens, contraseñas, llaves privadas ni datos sensibles.

---

## 10. Desarrollo

### Objetivo

Construir los entregables aprobados de forma ordenada, revisable y mantenible.

### Flujo de trabajo recomendado

| Paso | Acción |
|---|---|
| 1. Preparar tarea | Definir objetivo, contexto, archivos y criterios de aceptación. |
| 2. Crear rama | Usar una rama por funcionalidad o corrección. |
| 3. Desarrollar | Implementar cambios pequeños y revisables. |
| 4. Probar localmente | Ejecutar pruebas, build o revisión manual. |
| 5. Revisar diff | Confirmar que no hay cambios innecesarios. |
| 6. Documentar | Actualizar README, notas técnicas o comentarios necesarios. |
| 7. Integrar | Hacer merge solo si cumple los criterios. |
| 8. Preparar demo | Validar que se puede mostrar al cliente. |

### Buenas prácticas mínimas

- Usar Git para todo proyecto técnico.
- Hacer commits claros.
- Mantener cambios pequeños.
- Separar configuración de código.
- No subir `.env` con secretos.
- Mantener `.env.example` actualizado.
- Validar entradas del usuario.
- Manejar errores básicos.
- Agregar logs útiles sin exponer información sensible.
- Documentar comandos de instalación, ejecución y despliegue.

### Uso de Codex en desarrollo

Codex puede usarse para:

- Implementar tareas pequeñas.
- Crear pruebas.
- Refactorizar código puntual.
- Mejorar documentación técnica.
- Revisar errores.
- Generar scripts de automatización.
- Crear componentes de interfaz.
- Revisar diffs antes de integrar.

### Plantilla de tarea para Codex

    ## Tarea para Codex

    ### Objetivo
    Describir exactamente qué se debe construir o corregir.

    ### Contexto
    Explicar por qué se necesita y cómo se relaciona con el proyecto.

    ### Archivos relevantes
    - archivo_1
    - archivo_2

    ### Restricciones
    - No modificar configuración de producción.
    - No cambiar el modelo de datos sin aprobación.
    - No agregar dependencias nuevas sin justificar.
    - No incluir secretos ni datos reales.

    ### Criterios de aceptación
    - Criterio 1.
    - Criterio 2.
    - Criterio 3.

    ### Comandos de prueba
    - npm test
    - npm run build
    - npm run lint

    ### Resultado esperado
    Explicar cómo validar que la tarea quedó completa.

---

## 11. QA y pruebas

### Objetivo

Detectar errores antes de que el cliente los encuentre o antes de pasar a producción.

### Tipos de pruebas

| Tipo | Qué valida |
|---|---|
| Funcional | La solución hace lo acordado. |
| Visual | La interfaz se ve correctamente. |
| Datos | Cálculos, filtros, reportes y registros son correctos. |
| Permisos | Cada usuario ve y hace solo lo permitido. |
| Integración | APIs, archivos, webhooks o sistemas externos funcionan. |
| Regresión | Lo nuevo no rompe lo anterior. |
| Despliegue | La solución funciona en el ambiente donde será usada. |
| Seguridad básica | No hay exposición evidente de datos, secretos o accesos. |

### Checklist QA mínimo

| Ítem | Estado |
|---|---|
| Funcionalidades principales probadas | Pendiente |
| Casos de error probados | Pendiente |
| Validaciones de formularios revisadas | Pendiente |
| Permisos revisados | Pendiente |
| Reportes revisados | Pendiente |
| Integraciones probadas | Pendiente |
| Logs revisados | Pendiente |
| Variables de entorno revisadas | Pendiente |
| Build ejecutado correctamente | Pendiente |
| Pruebas automatizadas ejecutadas, si existen | Pendiente |
| No hay secretos en repositorio | Pendiente |
| Documentación actualizada | Pendiente |

### Clasificación de errores

| Severidad | Descripción | Acción |
|---|---|---|
| Crítico | Bloquea operación, afecta datos o impide uso principal | Corregir antes de entregar |
| Alto | Afecta funcionalidad importante | Corregir antes de producción |
| Medio | Tiene workaround temporal | Evaluar si va al release o backlog |
| Bajo | Visual, texto o mejora menor | Puede quedar para mejora posterior |

### Uso de Codex en QA

Codex puede ayudar a:

- Generar casos de prueba.
- Crear pruebas unitarias o de integración.
- Revisar errores en logs.
- Sugerir casos borde.
- Crear checklist específico por módulo.
- Revisar posibles regresiones.

---

## 12. Revisión con cliente

### Objetivo

Validar el entregable con el cliente antes de considerarlo final o antes de desplegarlo a producción.

### Formas de revisión

- Demo por videollamada.
- Acceso a ambiente de pruebas.
- Video corto mostrando funcionalidad.
- Capturas con explicación.
- Documento de cambios entregados.

### Reglas para la revisión

- Mostrar solo funcionalidades listas para feedback.
- Separar errores reales de nuevas solicitudes.
- Registrar todo feedback por escrito.
- Pedir aprobación formal cuando se complete un hito.
- No aceptar nuevos alcances como si fueran correcciones.

### Resultado esperado

Después de cada revisión debe quedar una de estas decisiones:

| Resultado | Acción |
|---|---|
| Aprobado | Pasar al siguiente hito o despliegue. |
| Aprobado con ajustes menores | Corregir y confirmar por escrito. |
| Requiere correcciones | Registrar bugs y resolver. |
| Solicita cambios nuevos | Activar control de cambios. |
| Cliente no responde | Aplicar regla de retrasos causados por el cliente. |

---

## 13. Despliegue

### Objetivo

Publicar la solución de forma segura, controlada y documentada.

### Checklist antes de desplegar

| Ítem | Estado |
|---|---|
| Alcance del release confirmado | Pendiente |
| Código revisado | Pendiente |
| Pruebas ejecutadas | Pendiente |
| Backup realizado, si aplica | Pendiente |
| Variables de entorno verificadas | Pendiente |
| Credenciales protegidas | Pendiente |
| Migraciones revisadas, si aplica | Pendiente |
| Plan de rollback definido, si aplica | Pendiente |
| Ventana de despliegue acordada con cliente | Pendiente |
| Documentación actualizada | Pendiente |
| Cliente informado | Pendiente |

### Checklist después de desplegar

| Ítem | Estado |
|---|---|
| Aplicación o servicio carga correctamente | Pendiente |
| Login o acceso funciona, si aplica | Pendiente |
| Funcionalidad principal validada | Pendiente |
| Logs sin errores críticos | Pendiente |
| Integraciones operativas | Pendiente |
| Cliente notificado | Pendiente |
| Release documentado | Pendiente |
| Próximo paso definido | Pendiente |

### Regla crítica

No desplegar cambios importantes sin:

- Backup previo, si hay datos o configuración crítica.
- Confirmación del cliente, si afecta operación.
- Validación básica posterior al despliegue.
- Plan de reversión cuando aplique.

---

## 14. Capacitación

### Objetivo

Asegurar que el cliente pueda usar correctamente la solución y reducir solicitudes repetitivas de soporte.

### Modalidades simples

- Sesión por videollamada.
- Video corto grabado.
- Guía en PDF o Markdown.
- Manual básico por rol.
- Checklist de operación diaria.

### Contenido mínimo de capacitación

| Tema | Descripción |
|---|---|
| Acceso | Cómo entrar al sistema o herramienta. |
| Roles | Qué puede hacer cada usuario. |
| Flujo principal | Cómo completar la operación principal. |
| Errores comunes | Qué revisar antes de pedir soporte. |
| Reportes | Cómo consultar o exportar información. |
| Soporte | Cómo reportar incidentes o mejoras. |

### Recomendación

Para proyectos pequeños, una capacitación de 30 a 60 minutos puede ser suficiente. Para sistemas internos más importantes, se recomienda una sesión por tipo de usuario.

---

## 15. Entrega formal

### Objetivo

Confirmar que el proyecto o hito fue entregado según el alcance aprobado.

### Elementos de la entrega formal

- Resumen de lo entregado.
- Lista de funcionalidades incluidas.
- Lista de exclusiones o pendientes fuera de alcance.
- Accesos entregados o confirmados.
- Documentación entregada.
- Fecha de inicio de garantía.
- Condiciones de soporte posterior.
- Factura final o pago pendiente, si aplica.

### Formato recomendado

Puede ser un correo formal, documento PDF o acta simple.

Ejemplo de estructura:

    Asunto: Entrega formal - Proyecto [Nombre]

    Hola [Cliente],

    Confirmo la entrega del proyecto [Nombre] correspondiente al alcance aprobado.

    Entregables incluidos:
    - Entregable 1
    - Entregable 2
    - Entregable 3

    Documentación entregada:
    - Manual de uso
    - Instrucciones técnicas
    - Checklist de despliegue

    A partir de esta fecha inicia el período de garantía acordado para corrección de errores relacionados con el alcance entregado.

    Las nuevas funcionalidades, cambios de alcance o mejoras posteriores se manejarán mediante cotización adicional o plan de soporte mensual.

    Saludos,
    SokaTechnologies

---

## 16. Garantía

### Objetivo

Definir un período limitado para corregir errores relacionados con el alcance entregado, sin convertir la garantía en soporte ilimitado.

### Alcance recomendado de garantía

La garantía debe cubrir:

- Errores funcionales dentro del alcance aprobado.
- Fallas reproducibles causadas por el desarrollo entregado.
- Correcciones necesarias para que el entregable cumpla los criterios de aceptación.

La garantía no debe cubrir:

- Nuevas funcionalidades.
- Cambios de diseño no acordados.
- Cambios de reglas de negocio posteriores.
- Errores causados por terceros.
- Cambios en APIs externas.
- Fallas por mal uso.
- Cambios de infraestructura no administrada por SokaTechnologies.
- Soporte operativo continuo.

### Duración sugerida

| Tipo de proyecto | Garantía sugerida |
|---|---|
| Sitio web simple | 7 a 15 días |
| Automatización puntual | 15 días |
| Dashboard o integración | 15 a 30 días |
| Software a medida | 30 días |
| Infraestructura | Según alcance y contrato |

Nota: las condiciones de garantía deben validarse con un asesor legal según el país, tipo de cliente y contrato utilizado.

---

## 17. Soporte mensual

### Objetivo

Convertir proyectos terminados en ingresos recurrentes y asegurar continuidad operativa para el cliente.

### Cuándo ofrecer soporte mensual

Debe ofrecerse en todo proyecto que incluya:

- Sistema en producción.
- Sitio web empresarial.
- Automatización crítica.
- Integración con sistemas externos.
- Dashboard usado por gerencia.
- Infraestructura, hosting, backups o monitoreo.
- Procesos que puedan cambiar con el tiempo.

### Tipos de soporte

| Tipo | Incluye |
|---|---|
| Correctivo | Corrección de errores posteriores a garantía. |
| Preventivo | Revisión, backups, actualizaciones y monitoreo. |
| Evolutivo | Mejoras menores y ajustes controlados. |
| Operativo | Ayuda de uso, consultas y pequeños cambios. |
| Infraestructura | Servidores, dominios, certificados, despliegues y logs. |

### Planes sugeridos

| Plan | Uso recomendado | Incluye |
|---|---|---|
| Básico | Sitios web y herramientas pequeñas | Revisión mensual, backups básicos, soporte limitado |
| Operativo | Sistemas usados semanalmente | Soporte mensual, ajustes menores, revisión de logs |
| Continuidad | Sistemas críticos para operación | Mayor prioridad, monitoreo, backups, mejoras controladas |

### Reglas importantes

- El soporte mensual se cobra por adelantado.
- Las horas no deben ser ilimitadas.
- Las mejoras grandes se cotizan aparte.
- La atención fuera de horario debe tener tarifa especial.
- El soporte no reemplaza un nuevo proyecto.

---

## 18. Control de cambios

### Objetivo

Evitar que el proyecto crezca sin control, proteger el margen y mantener claridad con el cliente.

### Cuándo se considera cambio de alcance

Una solicitud es cambio de alcance si implica:

- Nueva funcionalidad.
- Nuevo reporte.
- Nueva integración.
- Cambio importante en flujo aprobado.
- Cambio de diseño posterior a aprobación.
- Migración de datos no contemplada.
- Nuevo tipo de usuario o permiso.
- Cambio en infraestructura no previsto.
- Ajuste solicitado después de entrega o UAT aprobado.

### Flujo de control de cambios

| Paso | Acción |
|---|---|
| 1. Registrar solicitud | Anotar qué pide el cliente. |
| 2. Evaluar impacto | Revisar tiempo, costo, riesgo y dependencias. |
| 3. Clasificar | Bug, ajuste menor, cambio de alcance o nueva fase. |
| 4. Cotizar | Preparar costo y nueva fecha si aplica. |
| 5. Aprobar | Obtener confirmación escrita del cliente. |
| 6. Ejecutar | Agregar al backlog o plan de trabajo. |
| 7. Documentar | Actualizar alcance, entregables o release notes. |

### Plantilla simple de cambio

| Campo | Descripción |
|---|---|
| Cliente | Nombre del cliente |
| Proyecto | Nombre del proyecto |
| Fecha | Fecha de solicitud |
| Solicitud | Qué se pide |
| Motivo | Por qué se solicita |
| Impacto en tiempo | Días u horas estimadas |
| Impacto en costo | Monto adicional |
| Impacto en alcance | Qué cambia |
| Riesgos | Qué puede afectar |
| Estado | Pendiente, aprobado, rechazado o ejecutado |

### Regla interna

Si cambia el alcance, debe cambiar al menos una de estas variables:

- Precio.
- Fecha.
- Prioridad.
- Fase del proyecto.
- Alcance de otro entregable.

---

## 19. Manejo de retrasos causados por el cliente

### Objetivo

Proteger el calendario de SokaTechnologies cuando el cliente no entrega información, aprobaciones, accesos o feedback a tiempo.

### Causas comunes

- El cliente no entrega accesos.
- El cliente no envía información requerida.
- El cliente no aprueba requerimientos.
- El cliente retrasa feedback de UAT.
- El cliente cambia responsables internos.
- El cliente no paga a tiempo.
- El cliente no define reglas de negocio necesarias.

### Reglas operativas

| Situación | Acción |
|---|---|
| Falta información | Registrar pendiente y fecha límite. |
| Falta aprobación | Enviar recordatorio formal. |
| Falta acceso | Pausar tareas dependientes. |
| Más de 3 días hábiles sin respuesta | Enviar seguimiento y advertir impacto en cronograma. |
| Más de 7 días hábiles sin respuesta | Pausar proyecto o mover fecha de entrega. |
| Retraso afecta agenda de otros proyectos | Reprogramar según disponibilidad de SokaTechnologies. |
| Falta de pago | Suspender avance según condiciones comerciales. |

### Mensaje sugerido de seguimiento

    Hola [Nombre],

    Para continuar con el proyecto [Nombre], queda pendiente recibir/aprobar [pendiente].

    Este punto es necesario para avanzar con [fase o entregable]. Si no recibimos respuesta antes de [fecha], el cronograma podrá moverse y la nueva fecha dependerá de la disponibilidad operativa de SokaTechnologies.

    Quedo atento para continuar.

    Saludos,
    SokaTechnologies

### Regla comercial

Los retrasos causados por el cliente no deben absorberse automáticamente como responsabilidad de SokaTechnologies. Si el cliente retrasa información, aprobaciones o pagos, el cronograma debe ajustarse.

---

## 20. Documentos que debe tener cada proyecto

Cada proyecto debe tener documentación mínima. No todos los documentos tienen que ser largos, pero sí deben existir.

| Documento | Obligatorio | Propósito |
|---|---|---|
| Propuesta aprobada | Sí | Define alcance comercial y precio. |
| Contrato o aprobación formal | Sí | Formaliza relación y condiciones. |
| Minuta de kickoff | Sí | Registra acuerdos iniciales. |
| Requerimientos | Sí | Define necesidades y funcionalidades. |
| Alcance y exclusiones | Sí | Protege margen y evita confusión. |
| Diseño funcional | Según proyecto | Explica cómo funcionará la solución. |
| Diseño técnico | Según proyecto | Explica cómo se construirá y desplegará. |
| README | Sí para proyectos técnicos | Explica instalación, uso y mantenimiento. |
| `.env.example` | Sí si hay variables | Documenta configuración sin secretos. |
| Checklist QA | Sí | Registra validaciones realizadas. |
| Checklist despliegue | Sí si hay producción | Reduce riesgos de publicación. |
| Manual de usuario | Según proyecto | Ayuda al cliente a usar la solución. |
| Release notes | Sí si hay versiones | Registra cambios entregados. |
| Acta o correo de entrega | Sí | Formaliza entrega. |
| Plan de soporte | Recomendado | Propone mantenimiento recurrente. |
| Checklist de cierre | Sí | Confirma cierre operativo. |

---

## 21. Checklist de cierre

El proyecto solo debe considerarse cerrado cuando se haya completado este checklist.

| Ítem | Estado |
|---|---|
| Alcance aprobado entregado | Pendiente |
| Funcionalidades principales probadas | Pendiente |
| QA completado | Pendiente |
| Revisión con cliente realizada | Pendiente |
| Ajustes acordados completados | Pendiente |
| Despliegue realizado, si aplica | Pendiente |
| Capacitación realizada, si aplica | Pendiente |
| Documentación entregada | Pendiente |
| Accesos entregados o confirmados | Pendiente |
| Backup inicial o final realizado, si aplica | Pendiente |
| Acta o correo de entrega enviado | Pendiente |
| Factura final enviada | Pendiente |
| Pago final recibido o fecha confirmada | Pendiente |
| Garantía iniciada y comunicada | Pendiente |
| Soporte mensual ofrecido | Pendiente |
| Mejoras futuras registradas | Pendiente |
| Caso de éxito evaluado, sin datos sensibles | Pendiente |
| Proyecto archivado en carpeta correspondiente | Pendiente |

---

## 22. Flujo resumido para operar solo

Como SokaTechnologies actualmente es operada por una sola persona, este es el flujo mínimo recomendado:

1. Confirmar contrato, alcance y anticipo.
2. Crear carpeta, repositorio y tablero.
3. Hacer kickoff con minuta.
4. Levantar requerimientos.
5. Aprobar alcance y exclusiones.
6. Diseñar funcional y técnicamente solo lo necesario.
7. Dividir el desarrollo en tareas pequeñas.
8. Usar Codex para acelerar tareas específicas, no para reemplazar revisión técnica.
9. Probar internamente antes de mostrar.
10. Revisar con cliente por hitos.
11. Controlar cambios fuera de alcance.
12. Desplegar con checklist y backup.
13. Capacitar al cliente.
14. Entregar formalmente.
15. Ofrecer soporte mensual.
16. Cerrar y documentar.

---

## 23. Tablero recomendado de proyecto

Para operar sin project manager, usar un tablero simple con estas columnas:

| Columna | Uso |
|---|---|
| Backlog | Ideas, pendientes y solicitudes no priorizadas. |
| Por definir | Tareas que necesitan información del cliente. |
| Listo para trabajar | Tareas claras y aprobadas. |
| En desarrollo | Trabajo activo. |
| En revisión interna | Pendiente de revisión o pruebas. |
| En QA | Validación funcional, técnica o visual. |
| En revisión con cliente | Pendiente de feedback o aprobación. |
| Listo para despliegue | Aprobado para publicar. |
| Desplegado | Publicado y validado. |
| Cerrado | Completado y documentado. |

---

## 24. Indicadores simples del proceso de entrega

Al inicio, medir solo lo necesario:

| Indicador | Para qué sirve |
|---|---|
| Proyectos activos | Evitar sobrecarga del fundador. |
| Hitos atrasados | Detectar riesgos temprano. |
| Retrasos por cliente | Justificar cambios de fecha. |
| Cambios de alcance | Proteger margen. |
| Bugs en QA | Medir calidad antes de entrega. |
| Bugs post-producción | Mejorar pruebas y despliegue. |
| Horas reales vs estimadas | Mejorar cotizaciones futuras. |
| Proyectos convertidos a soporte | Medir ingreso recurrente. |

---

## 25. Reglas para delegar en el futuro

Este proceso debe permitir contratar freelancers o empleados sin perder control.

Antes de delegar una tarea, debe existir:

- Objetivo claro.
- Contexto suficiente.
- Archivos o módulos relevantes.
- Restricciones.
- Criterios de aceptación.
- Fecha esperada.
- Comando o método de prueba.
- Responsable de revisión.

### Tareas que se pueden delegar primero

| Tarea | Perfil recomendado |
|---|---|
| Maquetación de páginas | Frontend freelancer |
| Componentes UI | Frontend freelancer |
| Pruebas manuales | QA part-time |
| Documentación de usuario | Asistente operativo |
| Ajustes visuales | Diseñador/frontend |
| Scripts simples | Desarrollador junior |
| Soporte de primer nivel | Asistente técnico |

### Tareas que deben seguir bajo control del fundador al inicio

- Arquitectura.
- Seguridad.
- Accesos y credenciales.
- Despliegue a producción.
- Relación comercial con cliente.
- Aprobación final de cambios.
- Control de alcance.
- Decisiones técnicas críticas.

---

## 26. Riesgos principales y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Requerimientos ambiguos | Retrabajo y retrasos | Documento de requerimientos y criterios de aceptación. |
| Cliente pide cambios constantes | Pérdida de margen | Control de cambios. |
| Falta de respuesta del cliente | Cronograma bloqueado | Regla de retrasos por cliente. |
| Despliegue apresurado | Fallos en producción | Checklist, backup y pruebas. |
| Documentación insuficiente | Soporte difícil | README, manual y release notes. |
| Uso descontrolado de Codex | Código inseguro o inconsistente | Tareas pequeñas, revisión de diff y pruebas. |
| No ofrecer soporte mensual | Pérdida de ingreso recurrente | Incluir soporte en cada cierre. |
| Sobrecarga del fundador | Retrasos y baja calidad | Limitar proyectos activos y documentar tareas. |

---

## 27. Próximo paso recomendado

Implementar este proceso en el próximo proyecto activo o nuevo de SokaTechnologies.

Acciones inmediatas:

1. Crear una carpeta base de proyecto usando la estructura propuesta.
2. Crear un tablero simple con las columnas recomendadas.
3. Preparar plantillas separadas para:
   - Minuta de kickoff.
   - Requerimientos.
   - Alcance y exclusiones.
   - Checklist QA.
   - Checklist de despliegue.
   - Entrega formal.
   - Control de cambios.
   - Cierre de proyecto.
4. Usar este documento como regla operativa interna para todo nuevo proyecto.
5. Revisar el proceso cada 3 proyectos y ajustar lo que genere fricción innecesaria.

---

## 28. Decisión operativa recomendada

SokaTechnologies debe tratar cada proyecto como una entrega profesional, aunque la empresa todavía sea operada por una sola persona.

La regla central es:

**Nada se construye sin alcance claro, nada se entrega sin pruebas, nada se cierra sin documentación y todo proyecto debe abrir la puerta a soporte mensual.**
