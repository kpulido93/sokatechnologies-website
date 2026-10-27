# Evidencia técnica de consentimiento

**Estado:** preparada para revisión; `CONSENT_EVIDENCE_MODE=off` por defecto.
**Alcance:** formularios Astro de Contacto y Diagnóstico y su Worker de leads.
**No incluido:** activación de formularios, recursos D1 remotos, despliegues, correos reales o suscripciones de marketing.

La base operativa y jurídica está en [`05_Gestion_Datos_Personales.md`](https://github.com/kpulido93/sokatechnologies-docs/blob/main/docs/procesos/05_Gestion_Datos_Personales.md). Esta documentación describe únicamente la preparación técnica de la evidencia.

## 1. Arquitectura

```text
src/data/consentCatalog.json
        ├── Astro: muestra texto + versión + hash como metadatos del formulario
        └── Worker: valida versión, hash, formulario y finalidad contra el mismo catálogo

Contacto/Diagnóstico
        └── Worker
              ├── modo off: conserva el flujo actual, sin D1
              └── modo required:
                    Turnstile válido
                    → registra evidencia mínima en D1
                    → reclama atómicamente el despacho
                    → un único proceso envía a Resend
                    → actualiza estado técnico de la evidencia
```

El catálogo se comparte como JSON para evitar que el navegador pueda seleccionar una versión que el Worker no conozca. El navegador puede alterar campos ocultos, por lo que nunca se consideran confiables por sí mismos.

Archivos principales:

- `src/data/consentCatalog.json`: catálogo de autorizaciones y hashes.
- `src/components/ContactForm.astro`: muestra la autorización y envía sus metadatos.
- `worker/src/consentCatalog.mjs`: lectura del catálogo desde el Worker.
- `worker/src/consentEvidence.mjs`: validación, huellas de idempotencia y adaptador D1.
- `worker/0001_consent_evidence.sql`: esquema SQL versionado; no se ejecuta automáticamente.
- `worker/src/index.mjs`: flujo de persistencia, Resend y estados técnicos.

## 2. Catálogo versionado

El catálogo actual contiene únicamente finalidades de respuesta a una solicitud:

| Formulario | Versión | Finalidad | Fecha | Marketing |
|---|---|---|---|---|
| Contacto | `contact-response-v1` | `contact_response` | `2026-10-26` | No activa |
| Diagnóstico | `diagnostico-response-v1` | `diagnostic_response` | `2026-10-26` | No activa |

Cada entrada incluye el texto completo, la fecha de versión y el SHA-256 del texto. El hash se comprueba en las pruebas para detectar cambios de texto sin actualización de versión.

En modo `required`, el Worker acepta una autorización solo cuando coinciden todos estos valores:

1. `formType` y `authorizationVersion` corresponden a una entrada conocida.
2. `noticeVersion` coincide con `privacy-colombia-draft-v1`.
3. `authorizationHash` coincide con el hash del catálogo.
4. `consent` es verdadero.

La finalidad del evento se deriva del catálogo, no de un campo enviado por el navegador. No existe un checkbox ni una finalidad de marketing activa.

`privacy-colombia-draft-v1` identifica el aviso provisional que hoy se muestra, por lo que el modo `required` no debe activarse con este catálogo. Antes de cualquier activación, el catálogo y la página deben cambiar juntos a una versión inmutable del aviso jurídicamente aprobada y realmente mostrada al titular; `notice_version` debe conservar esa referencia junto con el hash de autorización.

## 3. Evento mínimo

En modo `required`, el Worker genera la evidencia después de validar el formulario y Turnstile, antes de llamar a Resend:

| Campo | Origen y uso |
|---|---|
| `event_id` | UUID generado por el servidor. Identifica el evento de evidencia. |
| `request_id` | UUID generado por el servidor. Referencia interna para consulta. |
| `server_timestamp_utc` | Fecha/hora generada por el servidor en UTC. |
| `form_type` | `contact` o `diagnostico`, validado por el Worker. |
| `notice_version` | Versión del aviso validada contra el catálogo. |
| `authorization_version` | Versión de autorización validada contra el catálogo. |
| `authorization_hash` | SHA-256 del texto definido en el catálogo. |
| `content_fingerprint` | HMAC-SHA-256 del contenido normalizado de la solicitud; no contiene PII en claro y excluye Turnstile. |
| `purpose` | Finalidad derivada: `contact_response` o `diagnostic_response`. |
| `accepted` | Siempre `true` para una fila creada; la ausencia de consentimiento no crea evidencia. |
| `idempotency_key_hash` | SHA-256 de `Idempotency-Key`; nunca se guarda la clave original. |
| `technical_status` | `evidence_recorded`, `resend_dispatching`, `resend_accepted`, `resend_error` o `resend_uncertain`. |
| `created_at`, `updated_at` | Marcas técnicas para seguimiento interno. |

No se guardan nombre, empresa, correo, teléfono, descripción, mensaje completo, token Turnstile, IP, user-agent, documento de identidad ni secretos.

## 4. Persistencia D1 preparada

`worker/0001_consent_evidence.sql` crea una tabla con:

- `event_id` como clave primaria.
- `request_id` e `idempotency_key_hash` únicos.
- Restricciones para formularios, finalidades, consentimiento y estados válidos.
- Huella HMAC de contenido para impedir reutilizar una clave con otra solicitud.
- Índice para localizar una evidencia por `request_id`.

`createConsentEvidenceStore()` usa la interfaz estándar de D1 (`prepare`, `bind`, `first`, `run`) y expone solo estas operaciones internas:

- Buscar por hash de idempotencia.
- Buscar por `request_id`.
- Insertar una evidencia con `INSERT OR IGNORE`.
- Reclamar y completar el despacho con compare-and-set.
- Reconciliar manualmente un estado incierto o un despacho atascado.

No hay rutas HTTP de consulta, exportación ni eliminación. El adaptador solo puede ser utilizado por código interno del Worker o por una futura tarea autenticada y aprobada.

No se añadió un binding D1 al `wrangler.toml` ni un `database_id`. La suite usa `MockD1Database` y aplica la migración real en una base SQLite `:memory:` mediante la biblioteca estándar local de Python; no se ejecutó una migración remota.

## 5. Idempotencia y estados de Resend

La clave recibida en `Idempotency-Key` se transforma en SHA-256 antes de persistirse. La solicitud normalizada se transforma en un HMAC-SHA-256 con `CONSENT_EVIDENCE_HMAC_KEY`; Turnstile, la clave original y valores temporales quedan fuera de la huella. La restricción única evita crear dos eventos para la misma referencia y la huella impide reutilizarla con contenido diferente.

- Si la evidencia ya está en `resend_accepted`, un reintento válido no vuelve a llamar a Resend.
- Si está en `evidence_recorded` o `resend_error`, una reclamación compare-and-set la pasa a `resend_dispatching`; solo quien obtiene esa reclamación puede llamar a Resend. `resend_error` se reserva para rechazos definitivos y un nuevo intento siempre requiere una solicitud explícita.
- Si está en `resend_dispatching`, el proceso concurrente recibe `202 provider_processing` sin afirmar entrega.
- Si está en `resend_uncertain`, no se reintenta automáticamente: el proceso devuelve error hasta una reconciliación interna documentada.
- La protección local persiste más allá de la ventana de idempotencia de Resend de 24 horas.

El Worker distingue:

- `resend_accepted`: Resend aceptó la solicitud HTTP; no significa entrega confirmada al buzón.
- `resend_error`: rechazo definitivo conocido, actualmente HTTP 400/422 o `409 invalid_idempotent_request`; no afirma entrega y solo permite un nuevo intento explícito.
- `resend_uncertain`: HTTP 5xx, `409 concurrent_idempotent_requests`, 409 sin código reconocido, otro código no clasificable o una falla de red; puede existir un procesamiento en Resend y queda bloqueado hasta reconciliación.
- `resend_dispatching`: un proceso tiene el derecho exclusivo de despacho; también protege el caso en que no pudo guardarse el resultado final.

En `resend_error` y `resend_uncertain` no se devuelve éxito al navegador. Las respuestas 2xx, incluyendo 200 y 201, pasan a `resend_accepted`; ese estado significa aceptación HTTP de Resend, no entrega confirmada al buzón.

Un `request_id` generado por el servidor se incluye únicamente en la notificación interna enviada a `info@sokatechnologies.com`. No se devuelve al navegador ni se expone mediante una ruta pública. La consulta se realiza internamente en D1 con ese identificador.

La única recuperación de `resend_uncertain` o `resend_dispatching` atascado es una reconciliación interna autenticada que confirme `resend_error` o `resend_accepted`. Solo el primer resultado permite un nuevo despacho explícito; nunca se reabre automáticamente un estado incierto.

## 6. Modos de ejecución

`worker/wrangler.toml` fija explícitamente:

```toml
CONSENT_EVIDENCE_MODE = "off"
```

El Worker acepta `off` o `required`; un valor desconocido, como `requierd`, devuelve `503 consent_mode_invalid` y nunca degrada a `off`. Para un futuro entorno obligatorio se necesitarán, como mínimo:

```text
CONSENT_EVIDENCE_MODE=required
CONSENT_DB=<binding D1 aprobado para ese entorno>
CONSENT_EVIDENCE_HMAC_KEY=<secreto estable aprobado para ese entorno>
```

Si el modo es `required` y el binding, la clave HMAC o la escritura no están disponibles, el Worker devuelve error antes de llamar a Resend. En modo `off` no escribe evidencia y conserva el comportamiento existente. El formulario demo corta antes de `fetch`, por lo que no escribe ni envía.

## 7. Consulta, supresión y revocación

La consulta interna futura debe usar `request_id` y un canal autenticado del fundador. No se debe buscar por correo, nombre o mensaje ni crear un endpoint público.

Para una revocación o solicitud de supresión, la futura operación deberá:

1. Verificar razonablemente la identidad y registrar la solicitud fuera de Git.
2. Localizar la evidencia por `request_id` y los sistemas/proveedores relacionados.
3. Revisar si existe una excepción legal, contractual o probatoria antes de eliminar.
4. Restringir, eliminar o anonimizar según la decisión aprobada.
5. Registrar solo la acción, fecha, responsable y motivo mínimo.

No se implementó borrado remoto ni retención automática. Los periodos deben aprobarse conforme al procedimiento documental y revisión jurídica.

## 8. Validación local

Desde la raíz del repositorio:

```bash
npm test
npm run check
npm run build
git diff --check
```

Las pruebas de `worker/test/consent-evidence.test.mjs` cubren:

- Hash exacto del catálogo.
- Contacto y Diagnóstico con finalidades separadas.
- Consentimiento ausente.
- Versión desconocida y hash alterado.
- Turnstile inválido.
- D1 ausente y error de escritura.
- Migración y restricciones en SQLite local en memoria.
- Evento único ante concurrencia y una sola reclamación de despacho.
- Conflicto por cambio de contenido y conflicto entre formularios.
- Reintento explícito después de error de Resend.
- Bloqueo ante resultado incierto y recuperación por reconciliación interna.
- Modo desconocido rechazado de forma segura.
- Consulta interna por `request_id`.
- `request_id` presente en la notificación interna.
- Ausencia de datos del lead en la evidencia.
- Modo demo sin invocar el endpoint.

Las llamadas a Turnstile y Resend son simuladas. No se usan secretos, cuentas remotas, datos de clientes ni correos reales.

## 9. GO / NO-GO

Estado de esta tarea: **NO-GO para tratamiento real**.

### GO requiere aprobación explícita posterior

```text
[ ] Política y autorización revisadas jurídicamente y con responsable real identificado.
[ ] Texto, hash y versión aprobados para cada formulario.
[ ] Retención, supresión y revocación aprobadas.
[ ] Binding D1 del entorno aprobado y creado fuera de esta tarea.
[ ] Migración revisada y aplicada solo en el entorno autorizado.
[ ] Acceso interno autenticado para consulta por request_id.
[ ] Contratos y transferencias/transmisiones de proveedores revisados.
[ ] Turnstile, rate limiting, honeypot, validación e Idempotency-Key probados en el entorno objetivo.
[ ] Resend probado sin afirmar entrega al buzón.
[ ] Evidencia persistida antes del envío, reclamación exclusiva y estados de error verificados.
[ ] Clave HMAC estable y gestionada como secreto del entorno.
[ ] Rollback probado y modo demo disponible.
[ ] Aprobación explícita para habilitar el tratamiento real.
```

### NO-GO automático

- `CONSENT_EVIDENCE_MODE` no está explícitamente aprobado como `required`.
- Falta `CONSENT_DB`, la escritura de evidencia falla o el catálogo no coincide.
- Se requiere modificar secretos, DNS, Worker desplegado o recursos remotos.
- No existe canal autenticado para solicitudes de titulares.
- El proveedor, la retención o la eliminación no están documentados.
- La prueba usa datos reales o envía un correo real.

## 10. Riesgos, decisiones y rollback

Decisiones pendientes:

- Aprobar la versión final del aviso y de los textos; el catálogo usa una versión identificada como borrador.
- Confirmar nombre legal, responsable y canal de solicitudes.
- Elegir y autorizar el binding D1 del entorno futuro.
- Definir periodos de retención y excepciones legales.
- Confirmar contratos y transferencias/transmisiones de Cloudflare, Resend y cualquier proveedor futuro.

Riesgos conocidos:

- Un estado `resend_uncertain` evita afirmar éxito, pero requiere revisión interna antes de reintentar o cerrar la solicitud.
- La protección local depende de que D1 conserve la restricción única y el estado técnico.
- Cambiar el texto sin cambiar su versión rompe la prueba de hash y debe bloquear el PR.

Rollback:

1. Mantener `CONSENT_EVIDENCE_MODE=off`.
2. No añadir el binding D1 al entorno desplegado.
3. Si una versión futura ya estuviera preparada y fallara localmente, volver al commit anterior de la rama sin ejecutar migraciones remotas.
4. No borrar evidencias existentes como parte del rollback; cualquier eliminación requiere el procedimiento aprobado.
