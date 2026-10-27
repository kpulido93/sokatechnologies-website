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
                    → envía a Resend
                    → actualiza estado técnico de la evidencia
```

El catálogo se comparte como JSON para evitar que el navegador pueda seleccionar una versión que el Worker no conozca. El navegador puede alterar campos ocultos, por lo que nunca se consideran confiables por sí mismos.

Archivos principales:

- `src/data/consentCatalog.json`: catálogo de autorizaciones y hashes.
- `src/components/ContactForm.astro`: muestra la autorización y envía sus metadatos.
- `worker/src/consentCatalog.mjs`: lectura del catálogo desde el Worker.
- `worker/src/consentEvidence.mjs`: validación, hash de idempotencia y adaptador D1.
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
| `purpose` | Finalidad derivada: `contact_response` o `diagnostic_response`. |
| `accepted` | Siempre `true` para una fila creada; la ausencia de consentimiento no crea evidencia. |
| `idempotency_key_hash` | SHA-256 de `Idempotency-Key`; nunca se guarda la clave original. |
| `technical_status` | `evidence_recorded`, `resend_accepted`, `resend_error` o `resend_uncertain`. |
| `created_at`, `updated_at` | Marcas técnicas para seguimiento interno. |

No se guardan nombre, empresa, correo, teléfono, descripción, mensaje completo, token Turnstile, IP, user-agent, documento de identidad ni secretos.

## 4. Persistencia D1 preparada

`worker/0001_consent_evidence.sql` crea una tabla con:

- `event_id` como clave primaria.
- `request_id` e `idempotency_key_hash` únicos.
- Restricciones para formularios, finalidades, consentimiento y estados válidos.
- Índice para localizar una evidencia por `request_id`.

`createConsentEvidenceStore()` usa la interfaz estándar de D1 (`prepare`, `bind`, `first`, `run`) y expone solo estas operaciones internas:

- Buscar por hash de idempotencia.
- Buscar por `request_id`.
- Insertar una evidencia con `INSERT OR IGNORE`.
- Actualizar el estado técnico.

No hay rutas HTTP de consulta, exportación ni eliminación. El adaptador solo puede ser utilizado por código interno del Worker o por una futura tarea autenticada y aprobada.

No se añadió un binding D1 al `wrangler.toml` ni un `database_id`. Las pruebas usan `MockD1Database`; no se ejecutó una migración local ni remota.

## 5. Idempotencia y estados de Resend

La clave recibida en `Idempotency-Key` se transforma en SHA-256 antes de persistirse. La restricción única evita crear dos eventos para la misma referencia.

- Si la evidencia ya está en `resend_accepted`, un reintento válido no vuelve a llamar a Resend.
- Si está en `evidence_recorded`, `resend_error` o `resend_uncertain`, el reintento puede continuar usando la misma clave de Resend.
- Las solicitudes concurrentes pueden llegar a Resend con la misma clave, pero la tabla local conserva un solo evento y Resend recibe una referencia estable.
- La protección local persiste más allá de la ventana de idempotencia de Resend de 24 horas.

El Worker distingue:

- `resend_accepted`: Resend aceptó la solicitud HTTP; no significa entrega confirmada al buzón.
- `resend_error`: Resend respondió con error HTTP.
- `resend_uncertain`: la llamada falló sin permitir conocer si Resend la aceptó, o el estado posterior no pudo persistirse.

En `resend_error` y `resend_uncertain` no se devuelve éxito al navegador.

## 6. Modos de ejecución

`worker/wrangler.toml` fija explícitamente:

```toml
CONSENT_EVIDENCE_MODE = "off"
```

El Worker trata cualquier valor distinto de `required` como `off`. Para un futuro entorno obligatorio se necesitarán, como mínimo:

```text
CONSENT_EVIDENCE_MODE=required
CONSENT_DB=<binding D1 aprobado para ese entorno>
```

Si el modo es `required` y el binding o la escritura no están disponibles, el Worker devuelve error antes de llamar a Resend. En modo `off` no escribe evidencia y conserva el comportamiento existente. El formulario demo corta antes de `fetch`, por lo que no escribe ni envía.

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
- Evento único ante concurrencia.
- Reintento después de error de Resend.
- Consulta interna por `request_id`.
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
[ ] Evidencia persistida antes del envío y estados de error verificados.
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
