# 05_Stack_Tecnico.md

**Empresa:** SokaTechnologies
**Documento:** Stack Técnico Base
**Versión:** 1.0
**Fecha:** 2026-05-13
**Uso:** Guía técnica interna para seleccionar tecnologías, diseñar arquitecturas, crear repositorios, desplegar proyectos y trabajar con Codex.
**Estado:** Documento base operativo.

---

## 1. Objetivo del stack técnico

El objetivo del stack técnico de SokaTechnologies es definir un conjunto reducido, claro y repetible de tecnologías para construir, desplegar y mantener soluciones B2B como:

- Sitios web corporativos.
- Aplicaciones web internas.
- APIs.
- Dashboards.
- Automatizaciones.
- Integraciones.
- Herramientas Windows.
- Infraestructura cloud y on-prem.
- Soporte, backups y monitoreo.

Este stack debe permitir que SokaTechnologies entregue soluciones simples, seguras, mantenibles y escalables sin caer en sobrearquitectura.

La prioridad no es usar la tecnología más nueva, sino la tecnología más adecuada para resolver problemas reales de clientes con bajo riesgo operativo.

### Decisión técnica base

Para proyectos nuevos, la combinación recomendada por defecto es:

| Capa | Stack base recomendado |
|---|---|
| Frontend web | Next.js + TypeScript + Tailwind CSS |
| Backend / APIs | ASP.NET Core Web API sobre .NET LTS vigente |
| ORM | Entity Framework Core |
| Base de datos principal | PostgreSQL |
| Automatizaciones | Python, PowerShell o .NET Worker según el caso |
| Infraestructura simple | Docker Compose + Linux VPS o servicio cloud administrado |
| CI/CD | GitHub Actions |
| Documentación | README + docs internas + `.env.example` + checklist de despliegue |
| IA para desarrollo | Codex con tareas pequeñas, revisión de diff y pruebas |

### Alineación con proyectos actuales

El stack se alinea con los repositorios actuales de trabajo:

| Proyecto | Tipo | Alineación técnica |
|---|---|---|
| LoteriaPanama | Sistema interno / back-office regulado | .NET, frontend web, base de datos relacional y documentación técnica |
| Portik | Aplicación web multi-cliente | Next.js, TypeScript, Tailwind, ASP.NET Core, EF Core, PostgreSQL, JWT y Docker Compose |
| Auto-Whatsapp | Herramienta Windows controlada | .NET, Windows Forms, Excel, Selenium y variables de entorno |
| AutoInv | Producto técnico pendiente de estabilización | Debe evolucionar bajo reglas de seguridad, documentación y remediación |
| OptimaVerifica | Pendiente de revisión técnica | No se deben asumir detalles hasta revisar el repositorio o documentación |

---

## 2. Principios técnicos

Todo proyecto técnico de SokaTechnologies debe seguir estos principios.

### 2.1 Simplicidad primero

- Empezar con una arquitectura monolítica modular antes de considerar microservicios.
- Usar una sola base de datos principal por proyecto, salvo necesidad real.
- Evitar colas, caches, workers o servicios externos si el problema aún no los necesita.
- Preferir tecnologías conocidas, soportadas y fáciles de contratar en el futuro.
- No crear abstracciones complejas para problemas simples.

### 2.2 Mantenibilidad

- Código entendible antes que código sofisticado.
- Separar responsabilidades por capas o módulos.
- Usar nombres claros para carpetas, entidades, servicios y endpoints.
- Mantener documentación mínima actualizada.
- Priorizar pruebas básicas en flujos críticos.
- Diseñar para que otro desarrollador pueda entender el proyecto en el futuro.

### 2.3 Seguridad por defecto

- No guardar secretos en repositorios.
- Usar variables de entorno.
- Mantener `.env.example` sin valores sensibles.
- Usar HTTPS en producción.
- Aplicar principio de menor privilegio.
- Validar entradas de usuario.
- Registrar eventos importantes sin exponer datos sensibles.
- Separar ambientes de desarrollo, pruebas y producción.
- Hacer backups antes de despliegues importantes.

### 2.4 Escalabilidad gradual

- Escalar cuando exista evidencia: usuarios, tráfico, volumen de datos o criticidad.
- Medir antes de optimizar.
- Separar servicios solo cuando haya una razón operativa clara.
- Preferir mejoras incrementales: índices, paginación, caché simple, background jobs y separación de ambientes.

### 2.5 Costos controlados

- Elegir infraestructura acorde al tamaño real del cliente.
- Evitar servicios administrados caros si el cliente no los necesita o no los pagará.
- Siempre separar costo de hosting, dominios, backups, monitoreo y soporte.
- Diseñar propuestas con margen para mantenimiento mensual.

### 2.6 Portabilidad razonable

- Evitar dependencia innecesaria de un solo proveedor cloud.
- Usar Docker cuando facilite despliegue y operación.
- Mantener scripts de instalación y despliegue.
- Documentar cómo restaurar el sistema en otro servidor.

---

## 3. Stack recomendado para sitios web

Los sitios web corporativos deben ser simples, rápidos, seguros y fáciles de mantener.

### 3.1 Stack principal para sitios corporativos

| Necesidad | Stack recomendado |
|---|---|
| Landing page simple | Next.js + TypeScript + Tailwind CSS |
| Sitio corporativo de servicios | Next.js + TypeScript + Tailwind CSS |
| Portafolio de SokaTechnologies | Next.js + TypeScript + Tailwind CSS |
| Blog o contenido frecuente | Next.js con contenido Markdown/MDX o CMS simple |
| Cliente necesita editar contenido sin depender de Soka | WordPress administrado y endurecido, solo si aplica |
| Formularios de contacto | API simple propia, servicio de formularios o endpoint serverless controlado |
| Analítica | Plausible, Google Analytics o herramienta acordada con el cliente |

### 3.2 Reglas para sitios web

- No usar backend completo si el sitio solo muestra información.
- No instalar WordPress si el cliente no necesita autogestión de contenido.
- No usar plantillas pesadas sin revisar rendimiento y seguridad.
- No publicar formularios sin protección básica contra spam.
- No recolectar datos personales innecesarios.
- Usar HTTPS siempre.
- Configurar dominio, DNS y certificado correctamente.
- Entregar acceso y documentación básica al cliente.

### 3.3 Estructura sugerida para sitio web

```txt
sitio-cliente/
├── src/
│   ├── app/
│   ├── components/
│   ├── content/
│   ├── lib/
│   └── styles/
├── public/
├── docs/
│   ├── DEPLOYMENT.md
│   └── CONTENT_GUIDE.md
├── .env.example
├── package.json
├── README.md
└── next.config.ts
```

### 3.4 Entregables mínimos para sitios web

- Código fuente versionado.
- README con instalación y ejecución local.
- Guía corta para editar contenido.
- Variables de entorno documentadas.
- Dominio y SSL configurados.
- Formulario probado.
- Checklist SEO básico.
- Checklist de seguridad básico.
- Propuesta de mantenimiento mensual.

---

## 4. Stack recomendado para aplicaciones web

Las aplicaciones web son sistemas internos, portales administrativos, dashboards operativos o productos B2B como Portik.

### 4.1 Stack principal para aplicaciones web

| Capa | Recomendación |
|---|---|
| Frontend | Next.js + TypeScript + Tailwind CSS |
| Componentes UI | Componentes propios simples; librería UI solo si acelera sin bloquear mantenimiento |
| Formularios | React Hook Form + Zod o validación equivalente |
| Backend | ASP.NET Core Web API |
| Lenguaje backend | C# sobre .NET LTS vigente |
| ORM | Entity Framework Core |
| Base de datos | PostgreSQL por defecto |
| Autenticación | Cookies seguras o JWT según arquitectura |
| Autorización | Roles y permisos por módulo |
| Multi-cliente / multi-tenant | `ClienteId`, `EmpresaId`, `ConjuntoId` o equivalente en entidades principales |
| Archivos | Almacenamiento S3-compatible, cloud storage o volumen local respaldado |
| Despliegue | Docker Compose, VPS, PaaS o cloud administrado según cliente |

### 4.2 Reglas de arquitectura para aplicaciones web

- Empezar con monolito modular.
- Separar frontend y backend solo cuando aporte claridad o despliegue más simple.
- Usar REST antes que GraphQL.
- Usar PostgreSQL salvo que el cliente ya tenga una base estándar diferente.
- Mantener reglas de negocio en backend, no solo en frontend.
- Aplicar validaciones en frontend y backend.
- Implementar paginación en listados desde el inicio.
- Registrar auditoría en operaciones importantes.
- Separar permisos por rol y por cliente/tenant.
- No exponer datos de otros clientes o conjuntos por error de filtros.

### 4.3 Capas backend recomendadas

Para proyectos medianos o productos, usar capas claras:

```txt
backend/
├── src/
│   ├── Proyecto.Domain/
│   ├── Proyecto.Application/
│   ├── Proyecto.Infrastructure/
│   └── Proyecto.Api/
└── tests/
    ├── Proyecto.UnitTests/
    └── Proyecto.IntegrationTests/
```

| Capa | Responsabilidad |
|---|---|
| Domain | Entidades, reglas de negocio puras, enums, value objects |
| Application | Casos de uso, DTOs, validaciones, interfaces |
| Infrastructure | EF Core, repositorios, servicios externos, email, archivos |
| Api | Controllers/endpoints, autenticación, middlewares, Swagger |
| Tests | Pruebas unitarias e integración de flujos críticos |

Para proyectos pequeños, se puede usar una estructura más simple dentro de un solo proyecto API, siempre que esté organizada por módulos.

### 4.4 Permisos base

Toda aplicación web debe tener una matriz de permisos.

Ejemplo:

| Rol | Uso típico | Permisos |
|---|---|---|
| SuperAdmin | SokaTechnologies o dueño del sistema | Configuración global, clientes, usuarios, auditoría |
| AdminCliente | Administrador del cliente | Gestión de datos del cliente, usuarios internos, reportes |
| Supervisor | Usuario de revisión | Consultar, aprobar, auditar, generar reportes |
| Operador | Usuario operativo | Crear y actualizar registros operativos |
| Auditor | Revisión interna o externa | Solo lectura y exportes controlados |

Reglas:

- Nunca depender solo del frontend para ocultar acciones.
- Validar permisos en backend.
- Registrar quién hizo qué y cuándo.
- Separar acceso por cliente, empresa, conjunto o unidad operativa.

---

## 5. Stack recomendado para APIs

Las APIs de SokaTechnologies deben ser claras, documentadas y fáciles de consumir.

### 5.1 Stack principal para APIs

| Capa | Recomendación |
|---|---|
| Framework | ASP.NET Core Web API |
| Documentación | OpenAPI / Swagger |
| Validación | Data Annotations, FluentValidation o validadores propios simples |
| Acceso a datos | EF Core |
| Base de datos | PostgreSQL o base definida por el cliente |
| Logs | Logging estructurado con nivel por ambiente |
| Autenticación | JWT, cookies seguras, API keys o integración externa según caso |
| Autorización | Roles, policies y permisos por recurso |
| Versionado | `/api/v1` cuando haya clientes externos o riesgo de cambios |

### 5.2 Estándares de diseño de APIs

- Usar REST como primera opción.
- Documentar endpoints con Swagger.
- Definir DTOs de entrada y salida.
- No exponer entidades internas directamente si el dominio es sensible.
- Usar códigos HTTP correctos.
- Mantener formato consistente de errores.
- Implementar paginación en listados.
- Implementar filtros controlados.
- Validar límites de tamaño para payloads y archivos.
- Agregar rate limiting si la API será pública o expuesta a terceros.
- Registrar requests críticos sin guardar datos sensibles.

### 5.3 Endpoints mínimos sugeridos

```txt
GET    /api/v1/health
GET    /api/v1/version
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
GET    /api/v1/audit-log
```

Para cada módulo:

```txt
GET    /api/v1/{recurso}
GET    /api/v1/{recurso}/{id}
POST   /api/v1/{recurso}
PUT    /api/v1/{recurso}/{id}
PATCH  /api/v1/{recurso}/{id}/estado
DELETE /api/v1/{recurso}/{id}
```

### 5.4 Cuándo usar otra tecnología para APIs

| Caso | Alternativa permitida |
|---|---|
| Proceso intensivo de datos o IA ligera | Python + FastAPI |
| Proyecto completamente JavaScript/TypeScript | NestJS, solo si simplifica el equipo |
| Integración muy pequeña | Endpoint serverless simple |
| Cliente exige ecosistema Microsoft completo | ASP.NET Core + SQL Server |

Regla: no introducir un segundo stack backend en un cliente si no hay una razón clara.

---

## 6. Stack recomendado para bases de datos

La base de datos debe elegirse por estabilidad, soporte, facilidad de backup, conocimiento disponible y compatibilidad con el cliente.

### 6.1 Base de datos por defecto

PostgreSQL es la base de datos recomendada por defecto para proyectos nuevos.

Motivos:

- Robusta para aplicaciones B2B.
- Excelente soporte para datos relacionales.
- Buen rendimiento para sistemas internos y dashboards.
- Compatible con EF Core.
- Buena disponibilidad en cloud, VPS y on-prem.
- Permite crecer sin cambiar de motor rápidamente.

### 6.2 Bases de datos permitidas

| Tecnología | Uso recomendado |
|---|---|
| PostgreSQL | Opción por defecto para aplicaciones nuevas |
| MySQL / MariaDB | Proyectos heredados, clientes que ya lo usan o sistemas simples existentes |
| SQL Server | Clientes con ecosistema Microsoft, Windows Server, ERP o requerimiento corporativo |
| SQLite | Herramientas locales, prototipos, agentes pequeños o apps desktop sin concurrencia alta |
| Redis | Caché, locks o colas ligeras solo cuando haya necesidad real |

### 6.3 Tecnologías de base de datos a evitar inicialmente

| Tecnología | Motivo para evitarla como default |
|---|---|
| MongoDB | No usar si el modelo es claramente relacional |
| Cassandra / DynamoDB | Complejidad innecesaria para clientes pequeños y medianos |
| Elasticsearch como base principal | Debe ser motor de búsqueda, no fuente primaria de verdad |
| Múltiples bases por sistema | Aumenta operación, backups, costos y riesgo |

### 6.4 Reglas de modelado de datos

Toda tabla principal debe evaluar si necesita:

- `Id` único.
- `ClienteId`, `EmpresaId`, `ConjuntoId` o equivalente si hay multi-tenant.
- `CreatedAt`.
- `UpdatedAt`.
- `CreatedBy`.
- `UpdatedBy`.
- `IsActive` o estado controlado.
- Auditoría para cambios sensibles.

Reglas:

- No usar datos reales de clientes en seeds públicos.
- No guardar contraseñas en texto plano.
- No guardar tokens externos sin cifrado o mecanismo seguro.
- No depender de nombres de personas como identificadores únicos.
- Usar migraciones revisadas antes de producción.
- Respaldar antes de ejecutar migraciones destructivas.

---

## 7. Stack recomendado para automatizaciones

Las automatizaciones deben resolver tareas repetitivas con bajo riesgo y alta trazabilidad.

### 7.1 Stack según tipo de automatización

| Tipo de automatización | Stack recomendado |
|---|---|
| Procesamiento de archivos Excel/CSV | Python o .NET console app |
| Tareas Windows / administración local | PowerShell o .NET |
| Agentes Windows | .NET Worker Service, Windows Service o app de consola empaquetada |
| Herramienta con interfaz Windows | Windows Forms o WPF, solo si hay usuario operador |
| Integraciones por API | .NET Worker, Python o job programado |
| Reportes automáticos | Python + SQL + generación de archivo o dashboard |
| Web automation sin API disponible | Playwright o Selenium, con límites y documentación |
| Flujos internos simples | n8n o herramienta equivalente, solo si queda documentado y respaldado |

### 7.2 Reglas para automatizaciones

- Preferir APIs oficiales antes que automatización de navegador.
- No automatizar procesos que violen términos, consentimiento o cumplimiento.
- Registrar entradas, salidas, errores y omisiones.
- Agregar modo dry-run cuando sea posible.
- Validar datos antes de ejecutar acciones masivas.
- No guardar credenciales en archivos del repositorio.
- Usar `.env.example` para documentar variables.
- Definir límites por corrida.
- Crear reporte final de ejecución.
- Separar automatizaciones por cliente.

### 7.3 Automatizaciones con WhatsApp

Las automatizaciones relacionadas con WhatsApp deben tratarse como herramientas operativas controladas, no como herramientas de marketing masivo.

Usos permitidos:

- Recordatorios operativos con consentimiento.
- Confirmaciones de citas.
- Notificaciones de servicio a contactos existentes.
- Comunicaciones internas o de bajo volumen.

Usos no permitidos:

- Spam.
- Bases compradas.
- Scraping de números.
- Mensajes a contactos sin consentimiento.
- Bypass de límites o controles.
- Promoción de apuestas, juegos de azar o captación de jugadores.
- Cobranzas agresivas sin revisión legal.

Controles mínimos:

- Lista de opt-out o bloqueados.
- Límite de envíos por corrida.
- Reporte de enviados, fallidos y omitidos.
- Registro de fuente de consentimiento.
- Confirmación manual antes de enviar.

---

## 8. Stack recomendado para infraestructura cloud

La infraestructura cloud debe elegirse según criticidad, presupuesto y capacidad de mantenimiento.

### 8.1 Opción cloud base para clientes pequeños

Para clientes pequeños o MVPs B2B:

```txt
Usuario
  ↓
Dominio + HTTPS
  ↓
Reverse proxy
  ↓
Frontend / Backend en Docker
  ↓
PostgreSQL
  ↓
Backups offsite
```

Stack sugerido:

| Componente | Recomendación |
|---|---|
| Servidor | VPS Linux con recursos acordes al proyecto |
| Sistema operativo | Ubuntu LTS o distribución Linux estable |
| Contenedores | Docker + Docker Compose |
| Reverse proxy | Caddy, Nginx o Traefik simple |
| SSL | Automático con Let's Encrypt |
| Base de datos | PostgreSQL en contenedor o servicio administrado |
| Archivos | Volumen respaldado o almacenamiento S3-compatible |
| Backups | Dump de base de datos + copia offsite |
| Monitoreo | Uptime + logs + alertas básicas |

### 8.2 Opción cloud administrada

Usar servicios administrados cuando:

- El cliente requiere mayor disponibilidad.
- Hay presupuesto mensual claro.
- El fundador no debe cargar toda la operación del servidor.
- Hay necesidad de SLA más formal.
- La base de datos es crítica.

Componentes posibles:

| Necesidad | Solución administrada |
|---|---|
| Frontend estático | Vercel, Netlify, Cloudflare Pages o equivalente |
| API | App Service, Container Apps, Cloud Run, Render o equivalente |
| Base de datos | PostgreSQL administrado |
| Archivos | Object Storage S3-compatible |
| Secretos | Secret manager del proveedor o variables protegidas |
| Monitoreo | Servicio de uptime, logs y errores |

Regla: no vender alta disponibilidad si el cliente no paga infraestructura, monitoreo y soporte acorde.

### 8.3 Reglas cloud

- No exponer la base de datos públicamente salvo necesidad muy justificada y controlada.
- Usar firewall y puertos mínimos.
- Usar usuarios separados por servicio.
- No desplegar producción desde una laptop sin proceso.
- No hacer cambios manuales sin documentarlos.
- Mantener backups fuera del mismo servidor.
- Documentar dominio, DNS, servidor, servicios, puertos y responsables.

---

## 9. Stack recomendado para on-prem

On-prem aplica cuando el cliente necesita mantener datos o servicios en su propia infraestructura.

### 9.1 Stack on-prem recomendado

| Componente | Recomendación |
|---|---|
| Servidor principal | Linux Server preferiblemente; Windows Server si el cliente lo exige |
| Contenedores | Docker Compose si el entorno lo permite |
| Reverse proxy | Nginx, Caddy o IIS según plataforma |
| Base de datos | PostgreSQL, MySQL/MariaDB o SQL Server según cliente |
| Acceso remoto | VPN, WireGuard, Tailscale empresarial o canal aprobado por el cliente |
| Backups | NAS, disco externo cifrado y copia offsite si es posible |
| Monitoreo | Uptime local + alertas + revisión programada |
| Actualizaciones | Ventanas de mantenimiento acordadas |

### 9.2 Reglas on-prem

- No abrir puertos innecesarios a internet.
- No exponer bases de datos directamente.
- Usar VPN para administración remota.
- Documentar red, IPs, puertos, usuarios técnicos y responsables.
- Acordar quién mantiene hardware, energía, internet y sistema operativo.
- Configurar backups dentro y fuera del sitio cuando sea posible.
- Probar restauración antes de considerar el sistema estable.
- Definir horario de soporte y mantenimiento.

### 9.3 Entregables mínimos on-prem

- Diagrama simple de infraestructura.
- Inventario de servicios instalados.
- Puertos utilizados.
- Procedimiento de backup.
- Procedimiento de restauración.
- Usuario responsable del cliente.
- Checklist de actualización.
- Plan de contingencia ante caída del servidor.

---

## 10. Monitoreo y logging

El monitoreo debe ser suficiente para detectar problemas antes de que el cliente los reporte, sin montar una plataforma compleja innecesaria.

### 10.1 Niveles de monitoreo

| Nivel | Uso | Herramientas posibles |
|---|---|---|
| Básico | Sitios y apps pequeñas | Uptime monitor + alertas por email |
| Estándar | Apps de negocio | Uptime + logs de app + errores + recursos del servidor |
| Avanzado | Sistemas críticos | Métricas, dashboards, trazas, alertas, revisión periódica |

### 10.2 Monitoreo mínimo por proyecto

Todo proyecto en producción debe tener:

- Health check.
- Monitoreo de disponibilidad.
- Logs de errores de backend.
- Registro de despliegues.
- Verificación de backups.
- Alerta si el sitio o API cae.
- Alerta si falla el backup.
- Revisión de uso de disco.

### 10.3 Logging recomendado

Reglas:

- Usar logs estructurados cuando sea posible.
- Registrar errores con contexto suficiente.
- No registrar contraseñas, tokens, documentos sensibles o datos personales innecesarios.
- Diferenciar niveles: `Debug`, `Info`, `Warning`, `Error`, `Critical`.
- Configurar retención de logs.
- Rotar logs para evitar llenar disco.

Eventos recomendados:

| Evento | Debe registrarse |
|---|---|
| Login exitoso/fallido | Sí, sin contraseña |
| Cambio de contraseña | Sí |
| Cambio de permisos | Sí |
| Creación/eliminación de registros críticos | Sí |
| Exportación de datos | Sí |
| Error de integración externa | Sí |
| Fallo de backup | Sí |
| Despliegue | Sí |

---

## 11. Backups

Los backups son parte del producto, no un extra opcional.

### 11.1 Política base de backups

| Tipo | Frecuencia sugerida | Retención sugerida |
|---|---|---|
| Base de datos | Diario | 7 diarios, 4 semanales, 12 mensuales |
| Archivos subidos | Diario o según criticidad | 7 diarios, 4 semanales, 12 mensuales |
| Configuración de despliegue | En cada cambio | Historial en repositorio sin secretos |
| Backup antes de despliegue | Antes de cambios críticos | Hasta validar salida a producción |
| Prueba de restauración | Mensual o trimestral | Evidencia documentada |

### 11.2 Reglas de backup

- Todo proyecto con datos debe tener backup automático.
- Todo backup debe guardarse fuera del servidor principal.
- Todo backup sensible debe estar cifrado o protegido.
- No guardar `.env` con secretos en texto plano dentro de backups compartidos.
- Probar restauración periódicamente.
- Documentar ubicación, frecuencia, retención y responsable.
- Alertar fallos de backup.
- Hacer backup manual antes de migraciones destructivas.

### 11.3 Checklist de restauración

Antes de declarar que existe backup real, debe existir respuesta para:

- ¿Dónde está el backup?
- ¿Cada cuánto corre?
- ¿Cuánto tiempo se retiene?
- ¿Quién puede acceder?
- ¿Está cifrado o protegido?
- ¿Cómo se restaura?
- ¿Cuándo fue la última prueba de restauración?
- ¿Cuánto tiempo estimado toma recuperar el servicio?

---

## 12. CI/CD

El CI/CD debe ayudar a reducir errores, no agregar complejidad innecesaria.

### 12.1 Flujo recomendado de ramas

| Rama | Uso |
|---|---|
| `main` | Producción o versión estable |
| `dev` | Desarrollo integrado |
| `feature/nombre` | Funcionalidad nueva |
| `fix/nombre` | Corrección puntual |
| `codex/nombre-tarea` | Cambios generados o apoyados por Codex |
| `hotfix/nombre` | Corrección urgente controlada |

### 12.2 Pipeline mínimo

Todo repositorio debe tener al menos:

- Restauración de dependencias.
- Build.
- Pruebas disponibles.
- Validación de formato o lint cuando aplique.
- Verificación de que no se incluyan secretos evidentes.

### 12.3 Pipeline recomendado para backend .NET

```txt
1. Checkout
2. dotnet restore
3. dotnet build --configuration Release
4. dotnet test
5. Publicar artefacto o imagen Docker si aplica
```

### 12.4 Pipeline recomendado para frontend Next.js

```txt
1. Checkout
2. npm ci
3. npm run lint
4. npm run build
5. Publicar artefacto o desplegar según ambiente
```

### 12.5 Reglas de despliegue

- Producción debe desplegarse desde `main` o release aprobada.
- Todo despliegue debe tener rollback o plan de reversa.
- Las migraciones deben revisarse antes de ejecutarse en producción.
- No guardar secretos en GitHub ni en archivos versionados.
- Usar GitHub Secrets o el secret manager del proveedor.
- Para clientes críticos, usar aprobación manual antes de producción.
- Después del despliegue, revisar health check, logs y flujo principal.

---

## 13. Estructura base de repositorios

La estructura debe ser consistente para que SokaTechnologies pueda mantener múltiples proyectos sin perder control.

### 13.1 Estructura base para aplicación web

```txt
proyecto/
├── backend/
│   ├── src/
│   │   ├── Proyecto.Domain/
│   │   ├── Proyecto.Application/
│   │   ├── Proyecto.Infrastructure/
│   │   └── Proyecto.Api/
│   ├── tests/
│   └── Proyecto.sln
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── infra/
│   ├── docker/
│   ├── nginx/
│   └── scripts/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── API.md
│   ├── PERMISSIONS.md
│   ├── DEPLOYMENT.md
│   ├── BACKUP_RESTORE.md
│   ├── RUNBOOK.md
│   ├── DECISIONS_LOG.md
│   └── PROJECT_STATE.md
├── scripts/
├── tests/
├── _codex_delivery/
├── .env.example
├── .gitignore
├── AGENTS.md
├── docker-compose.yml
└── README.md
```

### 13.2 Estructura base para automatización

```txt
automatizacion/
├── src/
├── config/
│   └── config.example.json
├── input_examples/
├── output_examples/
├── docs/
│   ├── USAGE.md
│   ├── SECURITY.md
│   └── RUNBOOK.md
├── tests/
├── scripts/
├── .env.example
├── AGENTS.md
└── README.md
```

### 13.3 Archivos obligatorios

| Archivo | Obligatorio | Propósito |
|---|---:|---|
| `README.md` | Sí | Explicar proyecto, instalación y ejecución |
| `.env.example` | Sí | Documentar variables sin secretos |
| `.gitignore` | Sí | Evitar subir binarios, secretos y temporales |
| `AGENTS.md` | Sí si se usa Codex | Reglas para trabajo con IA |
| `docs/DEPLOYMENT.md` | Sí en producción | Cómo desplegar |
| `docs/BACKUP_RESTORE.md` | Sí si hay datos | Cómo respaldar y restaurar |
| `docs/PERMISSIONS.md` | Sí si hay usuarios | Matriz de roles y permisos |
| `docs/DECISIONS_LOG.md` | Recomendado | Decisiones técnicas importantes |
| `docs/PROJECT_STATE.md` | Recomendado | Estado real del proyecto |

---

## 14. Criterios para elegir tecnología por proyecto

La tecnología debe elegirse por el problema, no por preferencia personal.

### 14.1 Matriz de decisión

| Pregunta | Decisión sugerida |
|---|---|
| ¿Es solo sitio informativo? | Next.js estático o WordPress si el cliente edita contenido |
| ¿Es aplicación interna con usuarios y datos? | Next.js + ASP.NET Core + PostgreSQL |
| ¿Requiere escritorio Windows? | .NET Windows Forms/WPF o Worker Service |
| ¿Procesa Excel/CSV y reportes? | Python o .NET según integración |
| ¿El cliente ya usa MySQL? | Mantener MySQL si reduce riesgo |
| ¿El cliente ya usa SQL Server? | Evaluar SQL Server si hay integración Microsoft |
| ¿Necesita multi-cliente? | Diseñar tenant desde el inicio |
| ¿Necesita auditoría? | Agregar logs, historial y permisos desde el diseño |
| ¿Tiene pocos usuarios? | No usar microservicios ni Kubernetes |
| ¿Tiene datos sensibles? | Priorizar seguridad, backups, accesos y trazabilidad |
| ¿Debe operar on-prem? | Docker Compose o instalación documentada en servidor del cliente |
| ¿Debe crecer comercialmente como producto? | Arquitectura modular, documentación y plan de soporte |

### 14.2 Criterios de evaluación

Antes de aprobar una tecnología nueva, responder:

- ¿Resuelve un problema real del proyecto?
- ¿Reduce tiempo o riesgo?
- ¿Aumenta mantenimiento innecesariamente?
- ¿Tiene comunidad y soporte suficiente?
- ¿Se puede desplegar fácilmente?
- ¿Se puede respaldar y restaurar?
- ¿Codex puede trabajar con ella de forma segura?
- ¿Otro desarrollador podrá mantenerla?
- ¿El cliente puede pagar su operación?
- ¿Hay alternativa más simple?

### 14.3 Regla de aprobación

Una tecnología nueva entra al stack solo si cumple al menos una de estas condiciones:

- Es requerida por el cliente.
- Reduce claramente riesgo o costo.
- Evita trabajo manual repetitivo.
- Mejora seguridad o trazabilidad.
- Es necesaria para cumplir el alcance.
- Permite convertir el proyecto en producto mantenible.

---

## 15. Tecnologías permitidas

### 15.1 Stack primario

| Categoría | Tecnologías permitidas |
|---|---|
| Backend | ASP.NET Core Web API, .NET LTS vigente |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| ORM | Entity Framework Core |
| Base de datos | PostgreSQL, MySQL/MariaDB, SQL Server según contexto |
| Automatización | Python, PowerShell, .NET Console/Worker Service |
| Desktop Windows | Windows Forms o WPF cuando sea necesario |
| Contenedores | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Servidores | Linux VPS, Windows Server si el cliente lo requiere |
| Web server / proxy | Nginx, Caddy, IIS según caso |
| Documentación | Markdown en `docs/` |
| Monitoreo | Uptime monitor, logs estructurados, error tracking, métricas simples |

### 15.2 Tecnologías permitidas con condición

| Tecnología | Condición |
|---|---|
| WordPress | Solo para sitios con autogestión de contenido por parte del cliente |
| FastAPI | APIs pequeñas de datos, IA ligera o automatizaciones Python |
| NestJS | Solo si el proyecto ya es TypeScript full-stack o el equipo lo requiere |
| Redis | Solo para caché, sesiones, locks o jobs cuando haya evidencia |
| n8n | Automatizaciones internas documentadas y respaldadas |
| Playwright / Selenium | Solo si no existe API y el flujo respeta consentimiento y cumplimiento |
| Servicios serverless | Funciones pequeñas y aisladas, no como arquitectura compleja inicial |
| Servicios administrados cloud | Si el cliente paga el costo y se documenta dependencia |

### 15.3 Política de versiones

- Usar versiones LTS o soportadas.
- Evitar versiones Current, beta, preview o experimentales en producción.
- Mantener un calendario de actualización por proyecto.
- Revisar dependencias al menos mensualmente en proyectos con soporte activo.
- Planificar migraciones antes de fin de soporte.
- No actualizar producción sin pruebas, backup y plan de rollback.

---

## 16. Tecnologías a evitar inicialmente

Estas tecnologías no están prohibidas para siempre, pero no deben usarse como primera opción en SokaTechnologies.

| Tecnología / enfoque | Motivo |
|---|---|
| Microservicios | Aumentan complejidad operativa sin necesidad inicial |
| Kubernetes | Exceso para clientes pequeños y medianos salvo caso justificado |
| Service mesh | Complejidad innecesaria |
| Kafka | No usar si no hay eventos de alto volumen o necesidad real |
| RabbitMQ como default | Solo usar si hay procesos asíncronos reales |
| Event sourcing | Complejo para MVPs y sistemas internos simples |
| CQRS completo | Evitar salvo dominio complejo y equipo preparado |
| GraphQL como default | REST es más simple para la mayoría de clientes actuales |
| MongoDB como default | La mayoría de sistemas B2B actuales son relacionales |
| Bases multi-motor | Dificultan backup, monitoreo y soporte |
| Firebase/Supabase sin evaluación | Puede acelerar, pero puede crear dependencia fuerte del proveedor |
| Serverless complejo | Difícil de depurar y presupuestar si se usa sin control |
| Apps móviles nativas iniciales | Validar primero con web responsive o PWA |
| Electron | Evitar si una web o herramienta .NET simple resuelve el problema |
| FTP manual a producción | Riesgo operativo alto |
| Secretos en repositorio | Prohibido |
| Datos reales en demos | Prohibido salvo autorización y anonimización |
| Automatizaciones masivas no consentidas | Riesgo legal, reputacional y de plataforma |

---

## 17. Arquitectura base para proyectos pequeños

Un proyecto pequeño es un sitio o aplicación con pocos usuarios, alcance claro, bajo tráfico y presupuesto limitado.

### 17.1 Arquitectura pequeña recomendada

```txt
Usuarios
  ↓
Dominio + HTTPS
  ↓
Frontend / Backend
  ↓
Base de datos PostgreSQL
  ↓
Backups automáticos
  ↓
Monitoreo básico
```

### 17.2 Variante A: aplicación web simple en un VPS

| Componente | Recomendación |
|---|---|
| Servidor | 1 VPS Linux |
| Deploy | Docker Compose |
| Frontend | Next.js |
| Backend | ASP.NET Core Web API |
| DB | PostgreSQL |
| Proxy | Caddy o Nginx |
| SSL | Let's Encrypt |
| Backups | Script diario + copia offsite |
| Monitoreo | Uptime + logs + disco |

Ventajas:

- Bajo costo.
- Fácil de entender.
- Control total del servidor.
- Bueno para MVPs, pilotos y clientes pequeños.

Riesgos:

- Si el VPS cae, cae todo.
- Requiere mantenimiento del servidor.
- No es alta disponibilidad.

### 17.3 Variante B: sitio estático + backend administrado

| Componente | Recomendación |
|---|---|
| Frontend | Hosting estático administrado |
| API | Servicio administrado o contenedor simple |
| DB | PostgreSQL administrado |
| Archivos | Object Storage |
| Monitoreo | Servicio externo |

Ventajas:

- Menos mantenimiento de servidor.
- Escala mejor sin administrar tanto sistema operativo.
- Buena opción si el cliente paga mensualidad.

Riesgos:

- Mayor costo mensual.
- Más dependencia de proveedores.

### 17.4 Checklist mínimo para proyectos pequeños

- [ ] README completo.
- [ ] `.env.example` sin secretos.
- [ ] Docker Compose o instrucciones claras.
- [ ] Base de datos con backup diario.
- [ ] Health check.
- [ ] Logs revisables.
- [ ] HTTPS.
- [ ] Roles básicos si hay usuarios.
- [ ] Prueba del flujo principal.
- [ ] Checklist de despliegue.
- [ ] Propuesta de soporte mensual.

---

## 18. Arquitectura base para proyectos medianos

Un proyecto mediano tiene más usuarios, más módulos, datos sensibles, integración con otros sistemas o necesidad de soporte recurrente formal.

### 18.1 Arquitectura mediana recomendada

```txt
Usuarios
  ↓
CDN / Dominio / HTTPS
  ↓
Frontend web
  ↓
API backend
  ↓           ↓
Base DB     Storage archivos
  ↓           ↓
Backups     Backups
  ↓
Monitoreo + logs + alertas
  ↓
Soporte y mantenimiento
```

Si hay procesos pesados:

```txt
API backend
  ↓
Background worker / jobs
  ↓
Base de datos / integraciones externas
```

### 18.2 Componentes recomendados

| Componente | Recomendación |
|---|---|
| Frontend | Next.js desplegado separado |
| Backend | ASP.NET Core Web API en contenedor o servicio administrado |
| Base de datos | PostgreSQL administrado o servidor dedicado |
| Jobs | Worker .NET, Hangfire, Quartz o cron controlado |
| Archivos | Object Storage o volumen con backup fuerte |
| Cache | Redis solo si hay necesidad demostrada |
| Ambientes | Desarrollo, staging y producción |
| CI/CD | GitHub Actions con aprobación para producción |
| Observabilidad | Uptime, logs, errores, métricas básicas y alertas |
| Seguridad | Roles, auditoría, backups, control de acceso y hardening |

### 18.3 Reglas para proyectos medianos

- Separar staging y producción.
- No ejecutar pruebas con datos reales sin autorización.
- Documentar permisos por módulo.
- Implementar auditoría desde el inicio.
- Definir RPO y RTO con el cliente.
- Automatizar backups y verificar restauración.
- Usar migraciones revisadas.
- Incluir plan de soporte mensual.
- Definir proceso de cambios fuera de alcance.
- Evaluar costos mensuales antes de vender.

### 18.4 Cuándo escalar a una arquitectura más avanzada

Escalar solo si ocurre una o más de estas condiciones:

- El sistema tiene caídas por carga real.
- La base de datos necesita separación o tuning.
- Los jobs bloquean la operación principal.
- Hay varios equipos trabajando en módulos separados.
- El cliente requiere SLA formal.
- Hay requisitos regulatorios fuertes.
- El costo de caída supera el costo de infraestructura adicional.

---

## 19. Reglas para documentación técnica

La documentación técnica debe permitir instalar, entender, operar y recuperar un proyecto.

### 19.1 Documentos mínimos por proyecto

| Documento | Propósito |
|---|---|
| `README.md` | Qué es el proyecto, cómo instalar, ejecutar y probar |
| `.env.example` | Variables requeridas sin secretos |
| `docs/ARCHITECTURE.md` | Componentes, capas y decisiones técnicas |
| `docs/DATA_MODEL.md` | Entidades, relaciones y reglas de datos |
| `docs/API.md` | Endpoints principales y contratos |
| `docs/PERMISSIONS.md` | Roles y permisos |
| `docs/DEPLOYMENT.md` | Cómo desplegar por ambiente |
| `docs/BACKUP_RESTORE.md` | Cómo respaldar y restaurar |
| `docs/RUNBOOK.md` | Operación, incidentes y soporte |
| `docs/DECISIONS_LOG.md` | Decisiones cerradas y razones |
| `docs/PROJECT_STATE.md` | Estado real del proyecto |
| `AGENTS.md` | Reglas para Codex y asistentes IA |

### 19.2 Reglas de documentación

- Toda instrucción debe poder seguirse paso a paso.
- No documentar secretos reales.
- No mezclar información confidencial de clientes.
- Usar nombres genéricos para casos públicos.
- Actualizar documentación cuando cambie arquitectura, variables, endpoints o despliegue.
- Documentar decisiones importantes, no solo el resultado final.
- Mantener comandos de instalación y prueba actualizados.
- Incluir limitaciones conocidas.

### 19.3 README mínimo

Todo README debe incluir:

```md
# Nombre del proyecto

## Descripción

## Stack técnico

## Requisitos

## Variables de entorno

## Instalación local

## Ejecución

## Pruebas

## Estructura del proyecto

## Despliegue

## Backups

## Seguridad

## Estado actual

## Contacto / responsable
```

### 19.4 Documentación antes de producción

Antes de enviar a producción, deben existir como mínimo:

- README actualizado.
- `.env.example` actualizado.
- Checklist de despliegue.
- Procedimiento de backup.
- Procedimiento de rollback.
- Matriz de permisos.
- Lista de variables de producción.
- Confirmación de pruebas mínimas.

---

## 20. Cómo debe trabajar Codex dentro de este stack

Codex debe ser un acelerador técnico, no un reemplazo de revisión técnica.

### 20.1 Principios de uso de Codex

- Trabajar con tareas pequeñas y claras.
- No hacer cambios masivos sin plan previo.
- No tocar producción directamente.
- No recibir secretos, tokens, contraseñas ni datos sensibles.
- No modificar configuraciones críticas sin autorización.
- No agregar dependencias sin justificar.
- No cambiar el modelo de datos sin explicar impacto y migración.
- Todo cambio debe revisarse mediante diff o pull request.
- Todo cambio debe probarse antes de integrarse.
- El fundador mantiene la responsabilidad técnica final.

### 20.2 Flujo recomendado con Codex

```txt
1. Definir tarea pequeña
2. Entregar contexto mínimo necesario
3. Indicar archivos relevantes
4. Definir restricciones
5. Definir criterios de aceptación
6. Indicar comandos de prueba
7. Ejecutar Codex en rama separada
8. Revisar diff completo
9. Ejecutar pruebas
10. Ajustar documentación si aplica
11. Integrar mediante PR o merge controlado
```

### 20.3 Formato estándar de tarea para Codex

````md
# Tarea para Codex

## Objetivo
[Describe el resultado esperado en una frase clara.]

## Contexto
[Explica el proyecto, módulo y problema de negocio/técnico.]

## Archivos relevantes
- `ruta/archivo1`
- `ruta/archivo2`

## Restricciones
- No tocar producción.
- No agregar secretos.
- No modificar archivos no relacionados.
- No agregar dependencias sin justificar.
- No cambiar esquema de base de datos sin propuesta previa.
- Mantener estilo y arquitectura existente.

## Criterios de aceptación
- [Criterio 1]
- [Criterio 2]
- [Criterio 3]

## Comandos de prueba
```bash
# Backend
dotnet restore
dotnet build
dotnet test

# Frontend
npm ci
npm run lint
npm run build
```

## Qué no debe modificar
- `.env`
- secretos
- configuración de producción
- migraciones existentes sin explicación
- archivos de otros módulos

## Entrega esperada
- Resumen de cambios.
- Archivos modificados.
- Riesgos detectados.
- Pruebas ejecutadas.
````

### 20.4 Checklist de revisión de cambios de Codex

Antes de aceptar cambios:

- [ ] Revisé el diff completo.
- [ ] No hay secretos ni datos sensibles.
- [ ] No modificó archivos fuera del alcance.
- [ ] No agregó dependencias innecesarias.
- [ ] No rompió arquitectura existente.
- [ ] Las migraciones son entendibles y necesarias.
- [ ] Se ejecutaron pruebas o build.
- [ ] Se actualizó documentación si aplica.
- [ ] Se revisó impacto de seguridad.
- [ ] Se revisó impacto en datos.
- [ ] El cambio cumple los criterios de aceptación.

### 20.5 Uso de `AGENTS.md`

Cada repositorio donde Codex trabaje debe incluir un `AGENTS.md` con reglas como:

```md
# AGENTS.md

## Reglas generales
- No agregar secretos.
- No tocar producción.
- No modificar archivos fuera del alcance de la tarea.
- Mantener arquitectura existente.
- Preferir cambios pequeños y revisables.
- Actualizar documentación si cambia comportamiento.

## Comandos
- Backend: `dotnet build`, `dotnet test`
- Frontend: `npm run lint`, `npm run build`

## Restricciones
- No agregar dependencias sin justificar.
- No cambiar base de datos sin migración y explicación.
- No usar datos reales de clientes en pruebas.
- No mezclar información entre clientes.
```

### 20.6 Tipos de tareas ideales para Codex

| Tipo de tarea | Adecuada para Codex |
|---|---:|
| Crear README inicial | Sí |
| Agregar endpoint simple | Sí |
| Crear DTOs y validaciones | Sí |
| Escribir pruebas básicas | Sí |
| Refactor pequeño | Sí |
| Revisar duplicación | Sí |
| Generar checklist | Sí |
| Crear migración compleja sin revisión | No |
| Rediseñar arquitectura completa | No sin plan previo |
| Tocar producción | No |
| Manejar secretos | No |
| Mezclar datos de clientes | No |

---

## Decisiones recomendadas

1. Adoptar como stack base: **Next.js + TypeScript + Tailwind + ASP.NET Core + EF Core + PostgreSQL + Docker Compose + GitHub Actions**.
2. Usar **.NET LTS vigente** para proyectos backend nuevos y planificar migraciones de proyectos existentes antes de fin de soporte.
3. Mantener **PostgreSQL como base de datos por defecto** y usar MySQL/SQL Server solo por contexto del cliente o legado.
4. Usar **monolito modular** como arquitectura inicial para aplicaciones B2B.
5. Usar **Docker Compose** antes que Kubernetes para clientes pequeños y medianos.
6. Hacer que todo proyecto tenga **README, `.env.example`, documentación de despliegue, backups y permisos**.
7. Usar Codex solo con **tareas pequeñas, criterios de aceptación y revisión de diff**.
8. Vender mantenimiento, backups, monitoreo y soporte como parte natural del servicio.

---

## Tareas concretas

- [ ] Crear plantilla base de repositorio para aplicación web SokaTechnologies.
- [ ] Crear plantilla base de README.
- [ ] Crear plantilla `AGENTS.md` para Codex.
- [ ] Crear checklist de despliegue.
- [ ] Crear checklist de backups y restauración.
- [ ] Crear matriz estándar de roles y permisos.
- [ ] Revisar Portik contra este stack y abrir backlog técnico.
- [ ] Revisar Auto-Whatsapp contra reglas de consentimiento y uso aceptable.
- [ ] Revisar AutoInv contra reglas de seguridad, secretos, build y documentación.
- [ ] Revisar OptimaVerifica cuando el repositorio o documentación esté disponible.

---

## Riesgos o puntos de cuidado

| Riesgo | Cuidado recomendado |
|---|---|
| Sobrearquitectura | No usar microservicios, Kubernetes o colas sin evidencia |
| Falta de backups | No subir producción sin backup automático y prueba de restauración |
| Secretos expuestos | Revisar repos, rotar credenciales y usar variables de entorno |
| Dependencia del fundador | Estandarizar repos, docs, despliegue y soporte |
| Costos cloud mal estimados | Separar hosting, monitoreo, backups y soporte en propuestas |
| Uso riesgoso de automatizaciones | Exigir consentimiento, límites, logs y revisión legal si aplica |
| Proyectos regulados | Limitarse a sistemas internos, reportes, seguridad, auditoría y cumplimiento |
| Uso descontrolado de Codex | Trabajar por PR, diff, pruebas y criterios de aceptación |

---

## Próximo paso

El próximo paso recomendado es crear el repositorio o carpeta interna:

```txt
soka-templates/
├── web-app-template/
├── website-template/
├── automation-template/
├── docs-template/
└── codex-task-template/
```

Ese repositorio debe convertir este documento en plantillas reutilizables para acelerar nuevos proyectos, reducir errores y preparar a SokaTechnologies para contratar equipo en el futuro.
