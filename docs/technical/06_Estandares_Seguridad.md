# 06_Estandares_Seguridad.md

# Estándares de Seguridad de SokaTechnologies

**Documento:** 06_Estandares_Seguridad.md
**Empresa:** SokaTechnologies
**Versión:** 1.0
**Estado:** Borrador operativo inicial
**Última actualización:** 2026-05-13
**Responsable:** Fundador / Operador principal

---

## 1. Objetivo de los estándares de seguridad

Este documento define los estándares mínimos de seguridad que SokaTechnologies debe aplicar en sus proyectos, repositorios, servidores, credenciales, ambientes, bases de datos, integraciones, APIs, despliegues y operación cloud/on-prem.

El objetivo no es crear burocracia innecesaria, sino proteger a la empresa y a sus clientes desde el día uno mediante reglas simples, repetibles y verificables.

Estos estándares aplican a:

- Sistemas B2B desarrollados a medida.
- Sitios web corporativos.
- Automatizaciones.
- Integraciones entre sistemas.
- Dashboards.
- Infraestructura cloud.
- Infraestructura on-prem.
- Bases de datos.
- Repositorios de código.
- Ambientes de desarrollo, staging y producción.
- Trabajo asistido por Codex u otras herramientas de IA.

SokaTechnologies debe vender tecnología con responsabilidad. La seguridad no debe tratarse como un extra opcional cuando el proyecto maneja datos, accesos, infraestructura o procesos críticos del cliente.

---

## 2. Principios básicos de seguridad

SokaTechnologies debe operar bajo estos principios:

| Principio | Regla práctica |
|---|---|
| Menor privilegio | Cada usuario, servicio o sistema debe tener solo los permisos necesarios. |
| Separación de ambientes | Desarrollo, staging y producción deben mantenerse separados. |
| No exponer secretos | Contraseñas, tokens, llaves privadas y credenciales nunca deben guardarse en repositorios. |
| Seguridad por defecto | Todo sistema debe iniciar con configuración restrictiva, no abierta. |
| Trazabilidad | Los cambios importantes deben quedar documentados. |
| Backups verificables | Un backup que no se prueba no debe considerarse confiable. |
| Revisión antes de producción | Ningún cambio importante debe ir a producción sin revisión mínima. |
| Simplicidad mantenible | Preferir soluciones simples, claras y seguras antes que arquitecturas complejas difíciles de mantener. |
| Confidencialidad por cliente | No mezclar datos, accesos, archivos ni contexto entre clientes. |
| Responsabilidad final humana | Codex puede ayudar, pero el fundador conserva la responsabilidad técnica final. |

Regla general:

> Si una acción puede afectar datos, accesos, disponibilidad, facturación, reputación o cumplimiento del cliente, debe revisarse antes de ejecutarse.

---

## 3. Manejo de credenciales y secretos

Se consideran secretos:

- Contraseñas.
- Tokens de API.
- Llaves privadas SSH.
- Certificados privados.
- Cadenas de conexión a bases de datos.
- Credenciales de correo.
- Webhooks privados.
- Tokens de GitHub, cloud, hosting, DNS o proveedores externos.
- Credenciales de administradores.
- Archivos `.pem`, `.key`, `.pfx`, `.p12`.
- Claves de cifrado.
- Variables sensibles de producción.

### Reglas obligatorias

- No guardar secretos en repositorios.
- No pegar secretos en prompts de ChatGPT, Codex u otras herramientas.
- No enviar secretos por chats inseguros si existe una alternativa más segura.
- No reutilizar contraseñas entre clientes.
- No compartir cuentas personales entre varias personas.
- No usar credenciales de producción en desarrollo.
- Rotar secretos si fueron expuestos, compartidos de forma insegura o subidos por error.
- Documentar qué sistemas dependen de cada secreto crítico.
- Usar gestores de secretos o mecanismos seguros del proveedor cuando sea posible.

### Ubicación aceptable de secretos

| Contexto | Ubicación recomendada |
|---|---|
| Desarrollo local | Archivo `.env` local no versionado. |
| CI/CD | Secret manager del proveedor, por ejemplo GitHub Actions Secrets. |
| Cloud | Secret Manager, Parameter Store, Key Vault o equivalente. |
| Servidor Linux | Variables de entorno protegidas, archivos con permisos restringidos o gestor de secretos. |
| Cliente sin herramienta formal | Gestor de contraseñas acordado con el cliente. |

### Rotación de secretos

Los secretos deben rotarse cuando:

- Se sospecha exposición.
- Se subieron a un repositorio.
- Fueron enviados por un canal inseguro.
- Una persona deja de participar en el proyecto.
- Termina un contrato.
- Se entrega el sistema al cliente.
- Se detecta acceso no autorizado.
- El secreto tiene demasiados permisos.
- El secreto fue usado en pruebas, demos o ambientes temporales.

---

## 4. Uso de archivos `.env` y `.env.example`

Los archivos `.env` permiten configurar variables por ambiente. Deben usarse con cuidado.

### Reglas para `.env`

- El archivo `.env` real nunca debe subirse al repositorio.
- Debe estar incluido en `.gitignore`.
- Cada ambiente debe tener sus propios valores.
- No se deben compartir archivos `.env` completos por canales inseguros.
- No se deben copiar variables de producción a desarrollo salvo que sea estrictamente necesario y aprobado.
- Las variables sensibles deben rotarse si se filtran.

Ejemplo de `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

> Explicación: se ignoran todos los archivos `.env`, pero se permite versionar `.env.example` porque no debe contener secretos reales.

### Reglas para `.env.example`

El archivo `.env.example` sí debe versionarse, pero solo con nombres de variables y valores ficticios.

Ejemplo:

```env
APP_ENV=development
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
JWT_SECRET=change_me_in_real_environment
SMTP_HOST=smtp.example.com
SMTP_USER=example_user
SMTP_PASSWORD=change_me
```

### Prohibido en `.env.example`

- Tokens reales.
- Contraseñas reales.
- URLs internas sensibles.
- IPs privadas del cliente si no son necesarias.
- Credenciales de producción.
- Llaves privadas.
- Datos personales.

### Checklist de variables de entorno

```text
[ ] Existe archivo .env.example actualizado.
[ ] .env está en .gitignore.
[ ] No hay secretos reales en .env.example.
[ ] Las variables están documentadas en README.
[ ] Producción usa valores separados de desarrollo.
[ ] Staging usa credenciales separadas de producción.
[ ] Codex no recibió secretos reales en el prompt.
```

---

## 5. Gestión de accesos

Todo acceso debe asignarse según necesidad real.

### Reglas generales

- Usar cuentas individuales cuando sea posible.
- Evitar usuarios compartidos.
- Activar MFA en cuentas administrativas.
- Dar permisos mínimos necesarios.
- Retirar accesos cuando ya no sean necesarios.
- Revisar accesos periódicamente.
- Separar accesos por cliente.
- No mezclar cuentas personales con cuentas de producción del cliente.
- Documentar quién tiene acceso a qué sistema crítico.

### Tipos de acceso a controlar

| Tipo de acceso | Ejemplos |
|---|---|
| Repositorios | GitHub, GitLab, Bitbucket. |
| Cloud | AWS, Azure, Google Cloud, DigitalOcean, Oracle Cloud, etc. |
| Hosting | cPanel, VPS, Plesk, proveedores administrados. |
| Dominios/DNS | Registradores, Cloudflare, zonas DNS. |
| Bases de datos | PostgreSQL, MySQL, SQL Server, MongoDB. |
| Servidores | SSH, RDP, VPN, paneles de administración. |
| Aplicaciones | Panel administrativo, usuarios internos, dashboards. |
| CI/CD | GitHub Actions, runners, tokens, deploy keys. |
| Herramientas externas | APIs, correo, pagos, mensajería, CRM, ERP. |

### Matriz simple de acceso

| Rol | Acceso permitido |
|---|---|
| Fundador / operador principal | Acceso administrativo controlado, con MFA. |
| Cliente dueño del sistema | Acceso administrativo funcional, no necesariamente acceso técnico completo. |
| Usuario operativo del cliente | Solo funciones necesarias para su trabajo. |
| Soporte externo | Acceso temporal, limitado y documentado. |
| Codex / IA | Sin acceso directo a producción ni secretos reales. |

---

## 6. MFA y cuentas administrativas

MFA significa autenticación multifactor. Debe activarse en toda cuenta crítica.

### MFA obligatorio en

- GitHub o plataforma de repositorios.
- Cuentas cloud.
- Paneles de hosting.
- DNS y dominios.
- Correo administrativo.
- Gestores de contraseñas.
- Herramientas de monitoreo.
- Sistemas de soporte.
- Cuentas administrativas de aplicaciones.
- Paneles de bases de datos.
- VPN o herramientas de acceso remoto.

### Reglas para cuentas administrativas

- No usar cuentas admin para tareas diarias si existe un rol limitado.
- No compartir cuentas admin.
- No usar contraseñas repetidas.
- Usar contraseñas largas y únicas.
- Guardar credenciales en gestor seguro.
- Tener método de recuperación documentado.
- Revisar usuarios admin mensualmente en sistemas críticos.
- Desactivar cuentas antiguas o no usadas.

### Cuentas raíz o principales

Las cuentas raíz de proveedores cloud, dominios o hosting deben usarse solo para tareas estrictamente necesarias.

Reglas:

```text
[ ] MFA activado.
[ ] Contraseña única y fuerte.
[ ] Acceso guardado en gestor seguro.
[ ] No usar para operación diaria.
[ ] Crear usuarios o roles separados para trabajo normal.
[ ] Revisar métodos de recuperación.
```

---

## 7. Separación de ambientes: desarrollo, staging y producción

Todo proyecto debe separar ambientes según su criticidad.

### Ambientes mínimos

| Ambiente | Uso | Reglas |
|---|---|---|
| Desarrollo | Construcción y pruebas locales. | Puede usar datos ficticios o anonimizados. |
| Staging | Validación antes de producción. | Debe parecerse a producción sin usar secretos reales de producción. |
| Producción | Sistema real del cliente. | Solo cambios aprobados, respaldados y controlados. |

### Reglas obligatorias

- Producción no debe usarse para pruebas improvisadas.
- Desarrollo no debe conectarse a bases de datos productivas salvo autorización excepcional.
- Staging debe usar credenciales separadas.
- Los datos reales no deben copiarse a desarrollo sin anonimización.
- Cada ambiente debe tener sus propias variables.
- Los despliegues deben seguir flujo controlado.
- Toda migración de base de datos debe probarse antes de producción cuando sea posible.

### Datos por ambiente

| Tipo de dato | Desarrollo | Staging | Producción |
|---|---|---|---|
| Datos ficticios | Permitido | Permitido | No recomendable salvo demo interna. |
| Datos anonimizados | Permitido | Permitido | No aplica. |
| Datos reales | Evitar | Solo si es necesario y controlado | Sí, con protección. |
| Secretos reales de producción | Prohibido | Prohibido salvo excepción aprobada | Permitido solo con control. |

---

## 8. Backups

Los backups son obligatorios para cualquier sistema que tenga datos importantes, archivos de cliente, bases de datos o configuración crítica.

### Principios de backup

- El backup debe ser automático cuando sea posible.
- El backup debe almacenarse fuera del servidor principal.
- El backup debe cifrarse cuando contenga información sensible.
- El backup debe probarse periódicamente.
- El backup debe tener retención definida.
- El backup debe generar alerta si falla.
- El backup debe estar protegido contra borrado accidental o malicioso.

### Frecuencia recomendada

| Tipo de sistema | Frecuencia mínima |
|---|---|
| Sitio web estático o corporativo | Semanal o antes de cada cambio importante. |
| Sitio web con CMS | Diario. |
| Sistema interno con base de datos | Diario como mínimo. |
| Sistema operativo crítico | Cada 1 a 4 horas según necesidad del cliente. |
| Sistema regulado o de alta criticidad | Definir RPO/RTO formal con el cliente. |

### Retención inicial recomendada

```text
[ ] 7 backups diarios.
[ ] 4 backups semanales.
[ ] 3 backups mensuales.
[ ] Backup antes de cambios grandes.
[ ] Backup antes de migraciones de base de datos.
```

### Prueba de restauración

Un backup debe probarse en un ambiente seguro antes de considerarse confiable.

Checklist de prueba:

```text
[ ] Se identifica backup a restaurar.
[ ] Se restaura en ambiente no productivo.
[ ] La aplicación inicia correctamente.
[ ] Los datos principales son legibles.
[ ] Se verifican usuarios, archivos o registros críticos.
[ ] Se documenta fecha, responsable y resultado.
```

---

## 9. Monitoreo

El monitoreo permite detectar problemas antes de que el cliente los reporte.

### Monitoreo mínimo por proyecto

| Área | Qué monitorear |
|---|---|
| Disponibilidad | Sitio o API responde correctamente. |
| Certificado SSL | Fecha de vencimiento. |
| Dominio | Fecha de vencimiento si SokaTechnologies lo administra. |
| Servidor | CPU, RAM, disco, reinicios. |
| Base de datos | Espacio, conexiones, errores. |
| Aplicación | Errores 500, excepciones, jobs fallidos. |
| Backups | Éxito o falla de ejecución. |
| Seguridad | Intentos fallidos, accesos administrativos, cambios críticos. |
| Costos cloud | Picos o recursos inesperados. |

### Severidades

| Severidad | Descripción | Ejemplo |
|---|---|---|
| P1 Crítica | Servicio caído o pérdida de datos. | Producción no responde. |
| P2 Alta | Degradación fuerte o riesgo serio. | Backups fallando, disco casi lleno. |
| P3 Media | Riesgo controlable. | Certificado vence pronto. |
| P4 Baja | Mejora o mantenimiento. | Limpieza de logs antiguos. |

### Reglas

- Toda alerta crítica debe revisarse.
- Las alertas deben tener responsable.
- No crear alertas innecesarias que generen ruido.
- Las alertas de backup y disponibilidad son prioritarias.
- Para clientes con soporte mensual, incluir reporte periódico de estado.

---

## 10. Logging

Los logs ayudan a diagnosticar errores, auditar eventos y responder incidentes.

### Qué debe registrarse

| Evento | Registrar |
|---|---|
| Inicio de sesión | Usuario, fecha, IP aproximada, resultado. |
| Fallos de login | Usuario o identificador, fecha, IP aproximada. |
| Acciones administrativas | Usuario, acción, recurso afectado, fecha. |
| Cambios de permisos | Quién cambió qué y cuándo. |
| Errores de aplicación | Mensaje técnico, stack trace controlado, contexto no sensible. |
| Jobs o procesos automáticos | Inicio, fin, resultado, errores. |
| Integraciones | Solicitud, resultado, código de respuesta, ID de correlación. |
| Cambios críticos | Creación, edición o eliminación de registros importantes. |

### Qué no debe registrarse

- Contraseñas.
- Tokens.
- Llaves privadas.
- Números completos de tarjetas.
- Datos sensibles innecesarios.
- Archivos completos enviados por usuarios.
- Credenciales en URLs.
- Códigos de recuperación.
- Respuestas completas de APIs externas si contienen información sensible.

### Buenas prácticas

- Usar niveles de log: debug, info, warning, error, critical.
- En producción, evitar logs excesivamente detallados.
- Proteger acceso a logs.
- Definir retención.
- Revisar logs después de incidentes o despliegues.
- Usar IDs de correlación cuando existan integraciones.

---

## 11. Control de cambios

Todo cambio que afecte producción debe gestionarse con control mínimo.

### Tipos de cambios

| Tipo | Ejemplos | Requiere aprobación |
|---|---|---|
| Bajo riesgo | Texto, estilos, cambios menores sin lógica crítica. | Aprobación simple. |
| Medio riesgo | Nueva funcionalidad, integración, cambios de permisos. | Revisión y prueba. |
| Alto riesgo | Migración de base de datos, cambios de autenticación, infraestructura. | Backup, plan y aprobación. |
| Emergencia | Corrección urgente por caída o incidente. | Documentar después si no hubo tiempo antes. |

### Reglas

- No tocar producción sin saber qué se va a cambiar.
- Hacer backup antes de cambios de alto riesgo.
- Revisar diff o lista de cambios.
- Probar en staging cuando aplique.
- Comunicar al cliente si el cambio puede afectar operación.
- Tener plan de rollback.
- Documentar resultado del cambio.

### Plantilla simple de cambio

```md
## Cambio en producción

**Cliente:**
**Proyecto:**
**Fecha:**
**Responsable:**
**Motivo del cambio:**
**Archivos o componentes afectados:**
**Riesgo:** Bajo / Medio / Alto
**Backup realizado:** Sí / No / No aplica
**Pruebas realizadas:**
**Plan de rollback:**
**Resultado:**
**Observaciones:**
```

---

## 12. Seguridad en repositorios

Los repositorios son activos críticos de SokaTechnologies y de los clientes.

### Reglas obligatorias

- Usar repositorios privados para proyectos de clientes.
- No subir secretos.
- Proteger la rama principal.
- Usar pull requests o revisión de cambios cuando sea posible.
- Escribir commits claros.
- Mantener README actualizado.
- Mantener `.env.example` actualizado.
- No mezclar código de clientes diferentes.
- No publicar código del cliente sin autorización.
- No usar datos reales en tests versionados.
- Revisar dependencias antes de agregarlas.

### Branch protection recomendado

```text
[ ] Rama main/master protegida.
[ ] No permitir push directo a main en proyectos importantes.
[ ] Requerir pull request.
[ ] Requerir revisión antes de merge cuando sea posible.
[ ] Requerir CI exitoso antes de merge.
[ ] Activar secret scanning si la plataforma lo permite.
```

### Archivos que deben existir

```text
[ ] README.md
[ ] .gitignore
[ ] .env.example
[ ] Documentación de instalación
[ ] Documentación de despliegue
[ ] Checklist de producción
[ ] Licencia o nota de propiedad si aplica
```

### Archivos que no deben subirse

```text
[ ] .env
[ ] Dumps de base de datos reales
[ ] Backups del cliente
[ ] Llaves privadas
[ ] Certificados privados
[ ] Tokens
[ ] Archivos temporales con datos sensibles
[ ] Capturas con información privada
```

---

## 13. Seguridad en APIs

Las APIs deben proteger datos, usuarios e integraciones.

### Reglas mínimas

- Usar HTTPS en producción.
- Validar entradas.
- Autenticar endpoints privados.
- Autorizar según rol o permiso.
- No confiar en datos enviados por el cliente.
- No exponer errores internos al usuario final.
- No devolver más datos de los necesarios.
- Aplicar paginación en listados grandes.
- Proteger endpoints administrativos.
- Registrar eventos importantes.
- Usar rate limiting cuando exista riesgo de abuso.
- Documentar endpoints críticos.

### Autenticación y autorización

| Área | Regla |
|---|---|
| Login | Debe validar credenciales de forma segura. |
| Sesiones | Deben expirar razonablemente. |
| Tokens | Deben tener expiración y secreto protegido. |
| Roles | No confiar solo en el frontend. |
| Admin | Requiere permisos explícitos. |
| Integraciones | Usar tokens separados por servicio. |

### Datos sensibles en APIs

- No devolver contraseñas, hashes, tokens ni secretos.
- No incluir información interna innecesaria.
- No exponer IDs si permiten enumeración sensible sin control.
- No permitir acceso cruzado entre clientes o tenants.
- No registrar payloads sensibles completos.

### Checklist API antes de producción

```text
[ ] HTTPS activo.
[ ] Endpoints privados requieren autenticación.
[ ] Permisos validados en backend.
[ ] Entradas validadas.
[ ] Errores controlados.
[ ] No se exponen secretos.
[ ] Rate limiting considerado.
[ ] Logs sin datos sensibles.
[ ] Documentación mínima disponible.
```

---

## 14. Seguridad en bases de datos

Las bases de datos suelen contener la información más sensible del cliente.

### Reglas obligatorias

- No exponer bases de datos públicamente si no es necesario.
- Usar credenciales únicas por proyecto y ambiente.
- No usar usuario root/admin para la aplicación.
- Limitar permisos del usuario de aplicación.
- Hacer backups automáticos.
- Probar restauración.
- Usar cifrado cuando el proveedor lo permita.
- No copiar datos reales a local sin anonimización.
- Proteger dumps de base de datos.
- Eliminar dumps temporales cuando ya no sean necesarios.
- Evitar compartir dumps por canales inseguros.

### Usuarios de base de datos

| Usuario | Permisos recomendados |
|---|---|
| Aplicación | Solo permisos necesarios para operar. |
| Migraciones | Permisos elevados solo si se requiere y de forma controlada. |
| Lectura/reportes | Solo lectura. |
| Admin | Uso excepcional, protegido y no usado por la app. |

### Dumps y exportaciones

Los dumps pueden contener datos sensibles.

Reglas:

```text
[ ] Cifrar dumps si contienen datos reales.
[ ] No subir dumps a repositorios.
[ ] No enviar dumps por WhatsApp o correo sin protección.
[ ] Guardar dumps solo el tiempo necesario.
[ ] Eliminar copias temporales después de usarlas.
[ ] Anonimizar datos si se usarán para desarrollo o demo.
```

---

## 15. Seguridad en servidores Linux

Los servidores Linux deben configurarse con una línea base de seguridad.

### Reglas mínimas

- Mantener sistema actualizado.
- Usar firewall.
- Exponer solo puertos necesarios.
- Usar SSH con llaves cuando sea posible.
- Deshabilitar acceso root directo por SSH cuando sea viable.
- No usar contraseñas débiles.
- Crear usuarios individuales o por rol.
- Revisar servicios activos.
- Configurar backups.
- Configurar monitoreo.
- Revisar logs relevantes.
- Proteger archivos de configuración.
- Usar HTTPS para servicios web.
- Renovar certificados antes de vencimiento.

### Puertos

Solo deben estar abiertos los puertos necesarios.

Ejemplos comunes:

| Puerto | Uso | Recomendación |
|---|---|---|
| 22 | SSH | Restringir por IP o proteger con llaves. |
| 80 | HTTP | Redirigir a HTTPS cuando aplique. |
| 443 | HTTPS | Permitido para servicios web. |
| 5432 | PostgreSQL | No exponer públicamente salvo necesidad controlada. |
| 3306 | MySQL/MariaDB | No exponer públicamente salvo necesidad controlada. |

### Comandos de Linux

Este documento no incluye comandos destructivos. Cualquier comando que modifique permisos, usuarios, firewall, discos, bases de datos o servicios debe ejecutarse solo si se entiende su efecto y existe respaldo o plan de reversa.

Antes de ejecutar comandos en producción:

```text
[ ] Confirmar servidor correcto.
[ ] Confirmar ambiente correcto.
[ ] Confirmar usuario actual.
[ ] Confirmar backup si aplica.
[ ] Leer el comando antes de ejecutarlo.
[ ] Evitar copiar/pegar comandos sin entenderlos.
[ ] Documentar el cambio.
```

---

## 16. Seguridad en cloud

La infraestructura cloud debe configurarse con control de accesos, costos, backups y monitoreo.

### Reglas generales

- Activar MFA en cuentas principales.
- No usar cuenta root para operación diaria.
- Crear usuarios o roles con permisos mínimos.
- Separar proyectos o cuentas por cliente cuando sea viable.
- Activar logs de auditoría si el proveedor lo permite.
- Configurar alertas de costos.
- Cifrar almacenamiento sensible.
- No hacer públicos buckets, discos o bases de datos sin necesidad.
- Usar security groups/firewalls restrictivos.
- Documentar recursos creados.
- Eliminar recursos que ya no se usan.
- Etiquetar recursos por cliente, proyecto y ambiente.

### Checklist cloud

```text
[ ] MFA activo.
[ ] Usuario root/principal protegido.
[ ] IAM con menor privilegio.
[ ] Recursos etiquetados.
[ ] Backups configurados.
[ ] Logs de auditoría activos si aplica.
[ ] Alertas de costo configuradas.
[ ] Puertos restringidos.
[ ] Bases de datos privadas si es posible.
[ ] Storage privado por defecto.
[ ] Cifrado habilitado cuando aplique.
[ ] Documentación de arquitectura actualizada.
```

### Accesos cloud para clientes

Cuando el cliente es dueño de la cuenta cloud:

- Solicitar acceso con usuario individual.
- No pedir contraseña de la cuenta principal salvo emergencia justificada.
- Recomendar MFA.
- Documentar permisos necesarios.
- Retirar acceso al finalizar el servicio si corresponde.
- Evitar crear dependencias con cuentas personales de SokaTechnologies.

---

## 17. Seguridad en on-prem

Algunos clientes pueden tener servidores físicos, redes internas, NAS, equipos Windows, routers, firewalls o sistemas locales.

### Reglas generales

- Documentar inventario básico.
- Identificar responsables del lado del cliente.
- No hacer cambios de red sin aprobación.
- Realizar backup antes de cambios importantes.
- Separar accesos administrativos.
- Usar VPN o acceso seguro si se administra remotamente.
- No exponer servicios internos directamente a internet sin evaluación.
- Mantener antivirus/EDR si el cliente lo tiene.
- Revisar energía, UPS y condiciones físicas en sistemas críticos.
- Documentar dependencias: red, internet, energía, almacenamiento, usuarios clave.

### Checklist on-prem

```text
[ ] Inventario de servidores y servicios.
[ ] Responsable del cliente identificado.
[ ] Accesos administrativos controlados.
[ ] Backups locales y externos definidos.
[ ] UPS o protección eléctrica considerada.
[ ] Red documentada de forma básica.
[ ] Puertos expuestos revisados.
[ ] Acceso remoto protegido.
[ ] Plan de recuperación ante falla de hardware.
[ ] Cambios documentados.
```

### Consideraciones especiales

En ambientes on-prem, el riesgo físico también importa:

- Robo de equipos.
- Daño eléctrico.
- Fallas de disco.
- Falta de aire acondicionado.
- Acceso físico no controlado.
- Backups conectados permanentemente al mismo equipo.
- Dependencia de una sola persona del cliente.

---

## 18. Checklist antes de producción

Antes de lanzar un sistema, sitio, API, automatización o infraestructura a producción, debe revisarse este checklist.

### Checklist técnico

```text
[ ] Código en repositorio privado o autorizado.
[ ] README actualizado.
[ ] .env.example actualizado.
[ ] .env real no versionado.
[ ] Variables de producción configuradas.
[ ] Secretos protegidos.
[ ] Dependencias instaladas desde fuentes confiables.
[ ] Pruebas básicas ejecutadas.
[ ] Build exitoso.
[ ] Migraciones revisadas.
[ ] Backups configurados.
[ ] Restauración considerada o probada según criticidad.
[ ] Logs configurados.
[ ] Monitoreo básico configurado.
[ ] HTTPS activo si aplica.
[ ] Dominio/DNS revisado si aplica.
[ ] Accesos administrativos definidos.
[ ] Usuario admin inicial protegido.
[ ] MFA activado donde aplique.
[ ] Plan de rollback definido.
```

### Checklist funcional

```text
[ ] Flujos principales probados.
[ ] Roles y permisos revisados.
[ ] Formularios validan datos.
[ ] Mensajes de error entendibles.
[ ] Reportes principales revisados.
[ ] Integraciones probadas.
[ ] Usuarios del cliente validados.
[ ] Criterios de aceptación cumplidos.
```

### Checklist de seguridad

```text
[ ] No hay secretos en el repositorio.
[ ] No hay datos reales en archivos de prueba.
[ ] Endpoints privados requieren autenticación.
[ ] Permisos se validan en backend.
[ ] Base de datos no está expuesta innecesariamente.
[ ] Logs no guardan contraseñas ni tokens.
[ ] Panel administrativo protegido.
[ ] Backups protegidos.
[ ] Accesos mínimos configurados.
```

### Checklist de entrega

```text
[ ] Cliente aprobó salida a producción.
[ ] Se comunicó fecha y hora de despliegue.
[ ] Se documentaron accesos entregados.
[ ] Se entregó guía básica de uso si aplica.
[ ] Se ofreció soporte/mantenimiento mensual.
[ ] Se registraron pendientes y mejoras futuras.
```

---

## 19. Checklist antes de tocar producción

Antes de realizar cualquier cambio en producción, responder:

```text
[ ] ¿Estoy en el cliente correcto?
[ ] ¿Estoy en el ambiente correcto?
[ ] ¿Este cambio está aprobado o justificado?
[ ] ¿Entiendo el impacto del cambio?
[ ] ¿Hay backup reciente si el cambio afecta datos?
[ ] ¿Existe forma de revertir?
[ ] ¿Probé esto en desarrollo o staging?
[ ] ¿Estoy usando credenciales correctas?
[ ] ¿Hay usuarios trabajando ahora en el sistema?
[ ] ¿Necesito avisar al cliente antes?
[ ] ¿Voy a documentar el cambio después?
```

### No tocar producción si

- No se sabe qué sistema se está modificando.
- No hay backup y el cambio afecta datos.
- No existe rollback para un cambio riesgoso.
- Se está trabajando con sueño, prisa extrema o presión sin análisis.
- El cliente pidió algo ambiguo que puede romper operación.
- Codex generó cambios no revisados.
- Hay secretos expuestos y no se ha definido rotación.
- No se tiene acceso adecuado o se está usando una cuenta incorrecta.

---

## 20. Reglas específicas para Codex

Codex puede acelerar desarrollo, pruebas, documentación y mantenimiento, pero debe trabajar bajo control.

### Principios

- Codex no debe tocar producción directamente.
- Codex no debe recibir secretos reales.
- Codex no debe recibir datos personales innecesarios.
- Codex debe trabajar con tareas pequeñas y claras.
- Codex no debe hacer cambios masivos sin plan previo.
- Todo cambio de Codex debe revisarse mediante diff.
- Todo cambio debe probarse antes de merge o despliegue.
- Codex no decide arquitectura crítica sin revisión humana.
- Codex no debe modificar seguridad, autenticación, permisos o base de datos sin criterios claros.
- Codex no debe mezclar contexto de clientes.

### Formato obligatorio de tarea para Codex

```md
## Tarea para Codex

### Objetivo
Describir claramente qué debe lograr.

### Contexto
Explicar proyecto, módulo y razón del cambio.

### Archivos relevantes
Listar rutas o componentes que puede revisar.

### Restricciones
- No tocar producción.
- No modificar archivos fuera del alcance.
- No agregar dependencias sin justificar.
- No cambiar modelos de datos sin propuesta previa.
- No incluir secretos.
- No usar datos reales de clientes.

### Criterios de aceptación
- Resultado esperado.
- Pruebas que deben pasar.
- Comportamientos que no deben romperse.

### Comandos de prueba
Listar comandos seguros de build, lint o test.

### Qué no debe modificar
Listar archivos, módulos o configuraciones fuera de alcance.
```

### Revisión obligatoria de cambios de Codex

```text
[ ] Revisar diff completo.
[ ] Verificar que no agregó secretos.
[ ] Verificar que no modificó archivos no relacionados.
[ ] Verificar que no cambió configuración de producción.
[ ] Verificar que no debilitó autenticación o permisos.
[ ] Ejecutar pruebas disponibles.
[ ] Revisar migraciones si existen.
[ ] Revisar dependencias nuevas.
[ ] Actualizar documentación si aplica.
[ ] Hacer commit claro.
```

### Codex no debe hacer

```text
[ ] Desplegar a producción.
[ ] Rotar secretos reales.
[ ] Acceder a servidores reales.
[ ] Ejecutar comandos destructivos.
[ ] Cambiar permisos cloud sin revisión.
[ ] Modificar backups sin revisión.
[ ] Eliminar datos.
[ ] Cambiar autenticación sin plan.
[ ] Agregar librerías innecesarias.
[ ] Crear usuarios admin sin aprobación.
```

---

## 21. Manejo de incidentes

Un incidente es cualquier evento que afecte o pueda afectar confidencialidad, integridad o disponibilidad.

### Ejemplos de incidentes

- Producción caída.
- Pérdida o corrupción de datos.
- Credencial expuesta.
- Repositorio público por error.
- Acceso no autorizado.
- Backup fallando en sistema crítico.
- Malware o ransomware.
- Cambio en producción que rompió operación.
- Filtración de información.
- Error que muestra datos de un cliente a otro.
- Base de datos expuesta a internet.
- Cuenta administrativa comprometida.

### Prioridades durante un incidente

1. Proteger datos y accesos.
2. Contener el daño.
3. Restaurar operación si es seguro.
4. Comunicar al cliente con claridad.
5. Documentar hechos.
6. Corregir causa raíz.
7. Prevenir repetición.

### Proceso básico de respuesta

```text
1. Detectar
   - ¿Qué ocurrió?
   - ¿Quién lo reportó?
   - ¿Cuándo empezó?

2. Contener
   - Desactivar acceso comprometido.
   - Revocar token expuesto.
   - Aislar servidor o servicio si aplica.
   - Detener proceso problemático.

3. Evaluar impacto
   - ¿Qué sistemas fueron afectados?
   - ¿Qué datos pudieron verse afectados?
   - ¿Hay clientes impactados?
   - ¿Hay pérdida de datos?

4. Recuperar
   - Restaurar backup si aplica.
   - Revertir cambio.
   - Aplicar parche.
   - Validar operación.

5. Comunicar
   - Informar al cliente con hechos confirmados.
   - Evitar especulación.
   - Indicar acciones tomadas y próximos pasos.

6. Documentar
   - Fecha y hora.
   - Causa probable.
   - Impacto.
   - Acciones tomadas.
   - Pendientes.
   - Medidas preventivas.
```

### Plantilla de reporte de incidente

```md
# Reporte de incidente

**Cliente:**
**Proyecto:**
**Fecha/hora de detección:**
**Reportado por:**
**Severidad:** P1 / P2 / P3 / P4
**Descripción:**
**Sistemas afectados:**
**Datos potencialmente afectados:**
**Acciones de contención:**
**Acciones de recuperación:**
**Estado actual:**
**Causa probable:**
**Acciones preventivas:**
**Pendientes:**
**Responsable:**
```

### Comunicación con el cliente

La comunicación debe ser clara y profesional:

```text
Detectamos un incidente relacionado con [sistema/proceso].
Estamos priorizando la contención y protección de la información.
Hasta el momento, las acciones tomadas son: [acciones].
El impacto conocido es: [impacto confirmado].
Próximo paso: [acción].
Compartiremos actualización cuando tengamos información verificada adicional.
```

No se debe:

- Ocultar incidentes relevantes.
- Culpar al cliente sin evidencia.
- Prometer recuperación sin validar.
- Compartir información de otros clientes.
- Enviar detalles sensibles por canales inseguros.
- Afirmar que no hubo impacto sin investigación suficiente.

---

## 22. Qué hacer si un cliente comparte credenciales de forma insegura

Es común que clientes compartan contraseñas por WhatsApp, correo, capturas o documentos. SokaTechnologies debe manejar esto con cuidado.

### Si el cliente envía una credencial por canal inseguro

Pasos:

```text
1. No reenviar la credencial.
2. No guardarla en notas, documentos o repositorios.
3. Moverla a un gestor seguro si debe usarse temporalmente.
4. Recomendar rotarla.
5. Explicar al cliente el riesgo de forma profesional.
6. Proponer un método seguro para próximos accesos.
7. Documentar que se solicitó rotación si el acceso es crítico.
```

### Respuesta sugerida al cliente

```text
Gracias. Por seguridad, te recomiendo que esta credencial sea rotada después de que terminemos esta configuración, porque fue compartida por un canal no diseñado para manejo seguro de contraseñas.

Para próximos accesos, podemos usar una alternativa más segura, como un gestor de contraseñas, una invitación con usuario individual o un acceso temporal con permisos limitados.
```

### Si la credencial es crítica

Ejemplos:

- Cuenta cloud principal.
- Panel de dominio.
- Base de datos de producción.
- Correo administrativo.
- Servidor de producción.
- GitHub del cliente.
- Cuenta bancaria, pagos o facturación.
- Llave privada.

Acciones:

```text
[ ] Usar solo si es necesario.
[ ] Pedir creación de usuario individual.
[ ] Activar MFA si no existe.
[ ] Rotar contraseña después del uso.
[ ] Evitar guardar copia local.
[ ] Documentar recomendación de seguridad.
```

### Si el cliente insiste en prácticas inseguras

SokaTechnologies debe dejar constancia escrita:

```text
Para proteger la operación y la información del sistema, recomendamos no compartir credenciales administrativas por canales informales y activar MFA en las cuentas críticas.

Podemos continuar bajo tu autorización, pero dejamos documentado que esta práctica aumenta el riesgo de acceso no autorizado, pérdida de control de cuentas o exposición de información.
```

Cuando el riesgo sea alto, SokaTechnologies debe considerar rechazar la acción o exigir una alternativa segura antes de continuar.

---

## Anexo A. Checklist mínimo de seguridad por proyecto

```text
[ ] Repositorio privado.
[ ] README actualizado.
[ ] .env.example sin secretos.
[ ] .env fuera del repositorio.
[ ] Secretos protegidos.
[ ] Branch principal protegida si aplica.
[ ] Desarrollo separado de producción.
[ ] Staging definido para sistemas operativos.
[ ] Backups configurados.
[ ] Monitoreo básico configurado.
[ ] Logs sin secretos.
[ ] Accesos mínimos.
[ ] MFA en cuentas críticas.
[ ] HTTPS en producción.
[ ] Base de datos protegida.
[ ] Checklist antes de producción completado.
[ ] Plan de rollback para cambios importantes.
[ ] Documentación de despliegue.
[ ] Reglas para Codex aplicadas.
```

---

## Anexo B. Clasificación rápida de criticidad

| Nivel | Descripción | Ejemplos | Exigencia |
|---|---|---|---|
| Bajo | Bajo impacto si falla. | Landing page, sitio informativo. | Backup básico, HTTPS, repo seguro. |
| Medio | Afecta operación diaria. | Dashboard, automatización, portal interno. | Backup diario, monitoreo, staging, control de cambios. |
| Alto | Afecta datos sensibles o procesos críticos. | Sistema administrativo, base de datos operativa. | Backups probados, MFA, logs, monitoreo, rollback. |
| Crítico | Riesgo legal, regulatorio, reputacional o financiero alto. | Sistemas regulados, infraestructura clave. | DR, auditoría, accesos estrictos, pruebas formales. |

---

## Anexo C. Decisiones recomendadas para SokaTechnologies

1. Todo proyecto debe tener repositorio organizado, `.env.example`, README y checklist de despliegue.
2. Ningún secreto debe guardarse en repositorios.
3. Todo cliente debe tener accesos separados.
4. Todo sistema con datos debe tener backup.
5. Todo sistema en producción debe tener monitoreo mínimo.
6. Todo cambio riesgoso debe tener rollback.
7. Codex debe trabajar solo con tareas pequeñas, sin secretos y sin producción.
8. Los datos reales no deben usarse en demos públicas.
9. Los clientes regulados deben manejarse con controles más estrictos.
10. Toda propuesta comercial debe incluir soporte/mantenimiento cuando haya operación continua.

---

## Anexo D. Próximo paso operativo

Convertir este documento en una plantilla práctica de revisión por proyecto:

```text
Nombre del cliente:
Nombre del proyecto:
Nivel de criticidad:
Ambientes:
Repositorio:
Backups:
Monitoreo:
Base de datos:
Servidor/cloud:
Responsables:
Fecha de última revisión:
Pendientes críticos:
```

Este formulario debe completarse al iniciar un proyecto y actualizarse antes de producción.
