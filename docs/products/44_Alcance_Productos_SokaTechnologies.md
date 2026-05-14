# 44_Alcance_Productos_SokaTechnologies.md

# Alcance Estratégico y Técnico de Productos SokaTechnologies

**Documento:** 44_Alcance_Productos_SokaTechnologies.md
**Empresa:** SokaTechnologies
**Fecha:** 2026-05-13
**Estado:** Borrador estratégico basado en revisión de ramas de desarrollo
**Productos revisados:** AutoInventario, Portik, Auto Whatsapp

---

## 1. Resumen ejecutivo

SokaTechnologies tiene tres activos de producto con potencial comercial, pero cada uno debe posicionarse y madurarse de forma distinta:

| Producto | Naturaleza real | Estado recomendado | Prioridad |
|---|---|---|---|
| AutoInventario | Inventario automático de activos Windows e integración con ManageEngine | Producto técnico potente, pero requiere estabilización antes de vender | Alta, pero no vender aún sin remediación |
| Portik | Plataforma web para operación de portería y administración de conjuntos residenciales | MVP más cercano a piloto comercial | Muy alta |
| Auto Whatsapp | Herramienta Windows para envíos programados por WhatsApp Web desde Excel | Utilidad interna/operativa con riesgos comerciales y de cumplimiento | Media, con límites estrictos |

Decisión recomendada:

1. **Portik debe ser el producto principal para validación comercial inmediata.**
2. **AutoInventario debe tratarse como producto B2B técnico para empresas con infraestructura Windows/ManageEngine, no como inventario comercial de productos.**
3. **Auto Whatsapp no debe venderse como herramienta de spam, marketing masivo, cobranzas agresivas ni campañas reguladas. Debe limitarse a comunicación operativa con consentimiento verificable.**

---

## 2. AutoInventario

## 2.1 Posicionamiento recomendado

AutoInventario debe posicionarse como:

> Plataforma de inventario automático de activos Windows para empresas que necesitan controlar equipos, usuarios, hardware, software, seguridad y sincronización con herramientas ITSM como ManageEngine ServiceDesk Plus.

No debe posicionarse inicialmente como:

- Sistema de inventario comercial.
- Control de almacén.
- Punto de venta.
- Inventario de productos para tiendas.
- Sistema de ventas o facturación.

La base técnica encontrada apunta a inventario de infraestructura y activos tecnológicos, no a inventario de mercancía.

---

## 2.2 Cliente ideal

AutoInventario debe apuntar a:

- Empresas con parque de equipos Windows.
- Empresas con soporte técnico interno o externo.
- Empresas que usan o desean usar ManageEngine ServiceDesk Plus.
- Proveedores de soporte IT gestionado.
- Empresas que necesitan trazabilidad de hardware, software, usuarios, IPs, licencias y estado del equipo.
- Organizaciones que requieren auditoría de activos tecnológicos.

Cliente no ideal en esta etapa:

- Tiendas pequeñas que solo quieren stock de productos.
- Negocios que necesitan lector de código de barras.
- Empresas que buscan POS o facturación.
- Clientes sin madurez mínima de infraestructura.

---

## 2.3 Alcance funcional del MVP vendible

El MVP vendible de AutoInventario debe incluir:

### Agente Windows

- Instalación en equipos Windows.
- Recolección de inventario básico del equipo.
- Datos de hardware.
- Datos de sistema operativo.
- Datos de red.
- Datos de usuario o equipo necesarios para inventario IT.
- Envío seguro hacia un Webhook.
- Ejecución programada.
- Logs locales mínimos.
- Soporte de actualización del agente.

### Webhook central

- Recepción de inventarios.
- Validación de API key.
- Validación de payload.
- Desencriptado controlado.
- Registro mínimo de eventos sin datos sensibles.
- Endpoint de salud.
- Endpoint de actualización del agente.
- Separación de configuración por entorno.

### Integración con ManageEngine

- Crear o actualizar activos tipo workstation.
- Normalizar datos recibidos.
- Manejar errores de sincronización.
- Registrar eventos de integración.
- Configurar credenciales vía secretos externos.

### Actualizador

- Verificación de versión.
- Descarga de nueva versión.
- Validación de hash.
- Reemplazo controlado del ejecutable.
- Relanzamiento de tarea programada.

### Infraestructura

- Lambda para procesamiento.
- AWS Secrets Manager para secretos.
- Terraform para infraestructura.
- Pipeline para build, pruebas, firma y publicación.

---

## 2.4 Fuera de alcance inicial

AutoInventario no debe incluir en la primera versión comercial:

- Inventario comercial de productos.
- Módulo de ventas.
- Facturación.
- Punto de venta.
- Código de barras.
- App móvil.
- Control de almacenes.
- Compras y proveedores.
- Integraciones múltiples con ERPs.
- Dashboard BI avanzado.
- Soporte multiplataforma Linux/macOS.
- Instalador empresarial complejo.
- Administración remota completa del equipo.
- Recolección de datos sensibles no necesarios.

---

## 2.5 Bloqueadores antes de vender

Antes de vender AutoInventario, se deben resolver estos bloqueadores:

| Bloqueador | Riesgo | Acción |
|---|---|---|
| Build principal roto | No se puede entregar con confianza | Corregir estructura del agente y solución |
| Secretos expuestos o versionados | Riesgo crítico de seguridad | Rotar, eliminar del repo e historial |
| Webhook en .NET 6 | Riesgo de soporte y seguridad | Migrar a .NET LTS vigente |
| Autenticación del endpoint incompleta | Riesgo de acceso no autorizado | Rehabilitar API key/middleware |
| Tests insuficientes | Riesgo de regresiones | Crear pruebas reales |
| Cifrado sin autenticidad fuerte | Riesgo de manipulación de payload | Migrar a AEAD o agregar firma/HMAC |
| Terraform incompleto | Riesgo de despliegue inconsistente | Corregir handler, IAM, regiones y formato |
| Dependencias vulnerables | Riesgo técnico y comercial | Actualizar paquetes |

---

## 2.6 Versión comercial recomendada

### AutoInventario Starter

Para empresas pequeñas con parque Windows limitado.

Incluye:

- Instalación inicial.
- Agente Windows.
- Webhook.
- Sincronización básica con ManageEngine.
- Actualizador.
- Documentación.
- Soporte mensual.

Modelo de precio:

- Setup inicial.
- Mensualidad por soporte.
- Opcional: precio por rango de equipos.

### AutoInventario Pro

Para empresas con más equipos o necesidad de soporte gestionado.

Incluye:

- Todo Starter.
- Monitoreo del proceso.
- Revisión mensual de errores.
- Mejoras menores.
- Reporte mensual de inventario.
- Soporte prioritario.

### AutoInventario Enterprise

Para clientes con requerimientos de seguridad, auditoría o infraestructura más compleja.

Incluye:

- Ambientes separados.
- Hardening.
- CI/CD.
- Revisión de seguridad.
- Integración avanzada.
- SLA.
- Soporte evolutivo.

---

## 2.7 Decisión recomendada

No vender AutoInventario como producto listo todavía.

Primero ejecutar una fase de estabilización técnica de 2 a 4 semanas con este objetivo:

> Convertir AutoInventario en un producto instalable, compilable, seguro y demostrable para un piloto controlado.

---

## 3. Portik

## 3.1 Posicionamiento recomendado

Portik debe posicionarse como:

> Plataforma web para control de acceso, operación de portería y administración básica de conjuntos residenciales, con trazabilidad, reglas configurables y autogestión del residente.

El mensaje comercial debe enfocarse en:

- Menos desorden en portería.
- Mejor control de visitantes.
- Mejor trazabilidad.
- Menos dependencia de llamadas y hojas de cálculo.
- Mejor comunicación entre administración, portería y residentes.
- Operación multi-conjunto para administradores que manejan varias propiedades.

---

## 3.2 Cliente ideal

Portik debe apuntar a:

- Administradores de condominios.
- Administradores de conjuntos residenciales.
- Juntas directivas.
- Empresas de administración de propiedades.
- Residenciales con portería física.
- Conjuntos con problemas de control de visitantes, parqueaderos, reservas y novedades.

Cliente no ideal en esta etapa:

- Edificios sin portería.
- Residenciales muy pequeños sin presupuesto.
- Clientes que exigen hardware, OCR o reconocimiento de placas desde el inicio.
- Clientes que necesitan pagos en línea como requisito principal.
- Clientes que requieren app móvil nativa antes de validar el MVP web.

---

## 3.3 Alcance funcional del MVP

Portik debe dividirse en cuatro grandes módulos:

## A. Administración del conjunto

Incluye:

- Gestión de conjuntos.
- Torres, bloques, etapas o estructura inmobiliaria.
- Predios.
- Personas.
- Relaciones persona-predio.
- Vehículos.
- Estado operativo del predio.
- Restricciones.
- Alertas.
- Novedades.
- Listas negras con exposición limitada de datos.

## B. Operación de portería

Incluye:

- Login de portería.
- Búsqueda por placa.
- Búsqueda por predio.
- Ficha operativa del predio.
- Estado operativo visible.
- Restricciones visibles.
- Alertas visibles.
- Autorizaciones activas.
- Empleados de servicio.
- Vehículos asociados.
- Registro manual de ingresos.
- Registro manual de salidas.
- Ocupación y liberación de parqueaderos.
- Registro de paquetes, domicilios o correspondencia.
- Confirmación de novedades aprobadas.

## C. Autogestión del residente

Incluye:

- Mi espacio.
- Anunciar visitante.
- Autorizar vehículo.
- Asociar personas a vehículo.
- Gestionar empleados de servicio.
- Solicitar trasteos o arreglos locativos.
- Crear o cancelar reservas si el conjunto lo permite.
- Consultar notificaciones internas.
- Consultar historial básico.

## D. Configuración y reportes

Incluye:

- Reglas de mora.
- Reglas de sanción.
- Reglas de paz y salvo.
- Reglas de depósito.
- Horario de visitas.
- Reglas de parqueadero visitante.
- Reglas de autogestión.
- Reglas de reservas.
- Bitácora.
- Reportes filtrables.
- Exportación CSV simple.

---

## 3.4 Fuera de alcance inicial

Portik no debe incluir en la primera versión comercial:

- WhatsApp.
- Correo automático.
- Hardware.
- OCR.
- Reconocimiento automático de placas.
- App móvil nativa.
- Push móvil nativo.
- Pagos en línea.
- Firma electrónica.
- Microservicios.
- CQRS.
- Integraciones complejas con ERP externos.
- Exportación Excel/PDF.
- Analítica avanzada.
- Marketplace de servicios.
- Cámaras o integración con control físico de acceso.

---

## 3.5 Riesgos técnicos y comerciales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Exceso de módulos | Retrasa salida comercial | Vender piloto con portería + administración base |
| Datos personales sensibles | Riesgo legal y reputacional | Minimizar datos visibles y documentar privacidad |
| Multi-conjunto mal segregado | Riesgo crítico | Tests obligatorios por `ConjuntoId` |
| Portería necesita rapidez | Riesgo de adopción | UX simple, pocos clics, búsqueda rápida |
| Clientes piden hardware | Aumenta complejidad | Dejar hardware para fase 2 o 3 |
| Pagos en línea pueden complicar operación | Riesgo legal/financiero | Excluir del MVP |

---

## 3.6 Versión comercial recomendada

### Portik Piloto

Objetivo:

Validar el producto con un conjunto residencial real.

Incluye:

- Configuración de un conjunto.
- Usuarios de administración y portería.
- Carga inicial de predios, personas y vehículos.
- Búsqueda por placa/predio.
- Registro de ingresos/salidas.
- Parqueaderos.
- Reservas básicas.
- Bitácora.
- Capacitación inicial.
- Soporte mensual.

Modelo de precio:

- Setup inicial.
- Mensualidad por conjunto o por rango de unidades.

### Portik Administración Pro

Para administradores con varios conjuntos.

Incluye:

- Multi-conjunto.
- Reportes.
- Reglas configurables.
- Autogestión del residente.
- Soporte prioritario.
- Mejoras evolutivas.

---

## 3.7 Decisión recomendada

Portik debe ser el producto con mayor prioridad comercial.

Próximo objetivo:

> Conseguir 3 conversaciones con administradores reales y 1 piloto pagado o semi-pagado en los próximos 30 días.

---

## 4. Auto Whatsapp

## 4.1 Posicionamiento recomendado

Auto Whatsapp debe posicionarse con mucho cuidado como:

> Herramienta Windows de apoyo operativo para programar mensajes por WhatsApp Web desde Excel, orientada únicamente a contactos con consentimiento y comunicaciones permitidas.

No debe posicionarse como:

- Herramienta de spam.
- Bot para evadir controles.
- Plataforma de marketing masivo.
- Solución para scraping de números.
- Sistema de campañas no solicitadas.
- Herramienta para cobranzas agresivas.
- Herramienta para loterías, apuestas o actividades reguladas.
- Reemplazo empresarial de la API oficial de WhatsApp Business.

---

## 4.2 Cliente ideal

Auto Whatsapp puede servir para:

- Pequeñas empresas con base de contactos propia y consentimiento.
- Recordatorios de citas.
- Confirmaciones operativas.
- Notificaciones internas o de servicio.
- Seguimientos permitidos a clientes existentes.
- Comunicaciones de bajo volumen y alto control.

No debe venderse a:

- Empresas que compran bases de datos.
- Empresas que desean enviar mensajes no solicitados.
- Negocios de apuestas, loterías o juegos de azar.
- Campañas de cobranzas sin revisión legal/compliance.
- Empresas que necesiten alto volumen y operación formal de WhatsApp.
- Clientes que quieran evadir bloqueos o límites de plataforma.

---

## 4.3 Alcance funcional del MVP

Incluye:

- Aplicación Windows Forms.
- Carga de Excel.
- Plantilla descargable.
- Vista previa de mensajes.
- Validación de columnas.
- Campo de código de país.
- Campo de teléfono.
- Campo de mensaje.
- Campo `toAudio`.
- Envío de texto.
- Conversión opcional de texto a audio con ElevenLabs.
- Programación de fecha y hora.
- Enviar ahora.
- Preparación manual de sesión de WhatsApp Web.
- Gestión local de líneas.
- Selección de líneas por corrida.
- Fallback entre líneas habilitadas.
- Log de ejecución.
- Manejo de errores por contacto.
- Manejo de fallos globales.
- Configuración local en AppData.
- Variables de entorno para credenciales externas.

---

## 4.4 Requisitos de cumplimiento mínimos

Antes de vender o usar Auto Whatsapp con clientes:

- Debe existir consentimiento verificable del destinatario.
- Debe existir mecanismo de opt-out.
- Debe respetarse cualquier solicitud de no recibir mensajes.
- No deben enviarse mensajes engañosos.
- No deben usarse bases compradas.
- No deben enviarse mensajes a menores sobre actividades restringidas.
- No debe usarse para apuestas, loterías, juegos de azar, cobranzas agresivas o actividades reguladas sin revisión legal.
- Debe existir política de privacidad si se manejan datos de clientes.
- Los Excel con teléfonos y mensajes no deben versionarse ni compartirse sin anonimización.
- Las sesiones de Chrome y credenciales no deben guardarse en Git.
- Los audios generados con contenido de clientes deben tratarse como datos sensibles.

---

## 4.5 Fuera de alcance inicial

Auto Whatsapp no debe incluir inicialmente:

- Scraping de contactos.
- Compra o importación de bases externas.
- Envíos no solicitados.
- Bypass de límites o bloqueos.
- Automatización oculta sin interacción del usuario.
- Envíos masivos de alto volumen.
- Promoción de loterías, apuestas o juegos de azar.
- Cobranzas automatizadas sin revisión legal.
- Chatbot comercial completo.
- CRM completo.
- Integración con pagos.
- Dashboard cloud multi-cliente.
- Reventa como SaaS sin revisar términos de plataforma.

---

## 4.6 Mejoras necesarias antes de comercializar

| Mejora | Prioridad |
|---|---|
| Checklist de consentimiento antes de cargar Excel | Alta |
| Registro de opt-out/bloqueados | Alta |
| Límite configurable de envíos por corrida | Alta |
| Pausas entre mensajes | Alta |
| Reporte final de enviados, fallidos y omitidos | Alta |
| Validación fuerte de números | Media |
| Plantillas de mensajes aprobadas internamente | Media |
| Documentación de uso aceptable | Alta |
| Advertencia legal/compliance dentro de la app | Alta |
| Modo prueba con pocos contactos | Media |
| Empaquetado e instalador simple | Media |

---

## 4.7 Decisión recomendada

Auto Whatsapp no debe ser prioridad comercial principal.

Debe mantenerse como herramienta utilitaria o producto experimental controlado, con reglas estrictas de consentimiento y cumplimiento.

Para empresas medianas o clientes regulados, lo correcto es evaluar la API oficial de WhatsApp Business o un proveedor autorizado, no depender de automatización con Selenium sobre WhatsApp Web.

---

## 5. Priorización recomendada

| Prioridad | Producto | Acción |
|---|---|---|
| 1 | Portik | Preparar demo, pitch y piloto comercial |
| 2 | AutoInventario | Estabilizar seguridad, build y documentación antes de vender |
| 3 | Auto Whatsapp | Limitar a uso operativo consentido; agregar controles de cumplimiento |

---

## 6. Roadmap sugerido de 30 días

## Semana 1

- Crear pitch comercial de Portik.
- Preparar demo de Portik con datos ficticios.
- Definir precio piloto de Portik.
- Abrir issues técnicos críticos de AutoInventario.
- Definir política de uso aceptable de Auto Whatsapp.

## Semana 2

- Contactar administradores de condominios.
- Hacer 3 entrevistas de validación de Portik.
- Corregir estructura de build de AutoInventario.
- Crear checklist de consentimiento para Auto Whatsapp.

## Semana 3

- Ejecutar demo de Portik.
- Ajustar MVP según feedback.
- Rotar y limpiar secretos de AutoInventario.
- Agregar opt-out y reporte de corrida a Auto Whatsapp.

## Semana 4

- Cerrar piloto de Portik.
- Preparar propuesta comercial.
- Avanzar remediación de AutoInventario.
- Decidir si Auto Whatsapp sigue como producto o herramienta interna.

---

## 7. Próximas tareas para Codex

## 7.1 Portik

```md
Objetivo:
Revisar el flujo de portería y reducir fricción para una demo comercial.

Contexto:
Portik es una plataforma multi-conjunto para control de acceso y operación residencial.

Archivos relevantes:
- frontend/src/app
- frontend/src/components
- backend/src/Portik.Api
- backend/src/Portik.Application

Restricciones:
- No modificar el modelo de datos sin plan previo.
- No romper segregación por ConjuntoId.
- No agregar dependencias nuevas sin justificar.
- No tocar producción.

Criterios de aceptación:
- La búsqueda por placa/predio es clara.
- La ficha de portería muestra solo datos operativos necesarios.
- El flujo de ingreso/salida se puede demostrar en menos de 2 minutos.
- El build frontend y backend sigue funcionando.
```

## 7.2 AutoInventario

```md
Objetivo:
Restaurar build principal y normalizar estructura del agente.

Contexto:
AutoInventario tiene una reubicación incompleta del agente. La solución apunta a una ruta histórica mientras el código aparece en raíz.

Restricciones:
- No eliminar archivos sin revisar git status y diff.
- No tocar secretos reales.
- No modificar lógica funcional salvo lo necesario para compilar.
- No cambiar pipeline sin explicar impacto.

Criterios de aceptación:
- dotnet build AutoInventario.sln -c Debug pasa.
- dotnet build AutoInventario.csproj -c Debug pasa.
- dotnet test AutoInventario.Tests/AutoInventario.Tests.csproj -c Debug pasa.
- No quedan secretos nuevos en el diff.
```

## 7.3 Auto Whatsapp

```md
Objetivo:
Agregar controles mínimos de uso responsable antes de cualquier demo.

Contexto:
Auto Whatsapp envía mensajes desde Excel usando WhatsApp Web y Selenium.

Restricciones:
- No agregar scraping.
- No automatizar bypass de límites.
- No guardar sesiones, cookies ni credenciales en Git.
- No enviar mensajes sin confirmación explícita del usuario.

Criterios de aceptación:
- La app muestra advertencia de consentimiento antes de enviar.
- Existe lista local de números bloqueados/opt-out.
- El reporte final indica enviados, fallidos, omitidos y opt-out.
- dotnet build AutoWhatsApp.sln pasa.
```

---

## 8. Decisiones recomendadas

1. Portik debe tener prioridad comercial inmediata.
2. AutoInventario debe tener prioridad técnica de remediación antes de venta.
3. Auto Whatsapp debe mantenerse limitado por consentimiento y cumplimiento.
4. SokaTechnologies no debe vender herramientas que faciliten spam, evasión de controles, captación indebida, apuestas, loterías o uso no autorizado de plataformas.
5. Cada producto debe tener README comercial, README técnico, demo, pricing inicial, checklist de despliegue y plan de soporte mensual.

---

## 9. Próximo paso recomendado

Crear tres documentos separados:

- `40_AutoInventario_Alcance_Producto.md`
- `42_Portik_Alcance_Producto.md`
- `44_AutoWhatsapp_Alcance_Producto.md`

Luego convertir cada uno en:

- Pitch comercial.
- Demo script.
- Backlog técnico.
- Plan de precios.
- Checklist de seguridad.
