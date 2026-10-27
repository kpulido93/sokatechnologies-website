import { CONSENT_CATALOG, getAuthorizationForForm } from "./consentCatalog.mjs";

export const CONSENT_EVIDENCE_STATUSES = Object.freeze([
  "evidence_recorded",
  "resend_dispatching",
  "resend_accepted",
  "resend_error",
  "resend_uncertain"
]);

const CLAIMABLE_STATUSES = Object.freeze(["evidence_recorded", "resend_error"]);
const RECONCILABLE_TARGETS = Object.freeze(["resend_accepted", "resend_error"]);
const CONTENT_FIELDS = Object.freeze([
  "formType",
  "formContext",
  "name",
  "company",
  "email",
  "phone",
  "country",
  "service",
  "problemType",
  "summary",
  "consent",
  "noticeVersion",
  "authorizationVersion",
  "authorizationHash"
]);

export class ConsentEvidenceError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.name = "ConsentEvidenceError";
    this.code = code;
    this.status = status;
  }
}

const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export const sha256Hex = async (value) => {
  const encoded = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
  return toHex(new Uint8Array(digest));
};

export const hmacSha256Hex = async (value, key) => {
  if (typeof key !== "string" || !key) throw new ConsentEvidenceError("consent_fingerprint_key_missing", 503);
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(value));
  return toHex(new Uint8Array(signature));
};

export const canonicalizeLead = (lead) => JSON.stringify(
  Object.fromEntries(CONTENT_FIELDS.map((field) => [field, lead[field] ?? ""]))
);

export const getConsentEvidenceMode = (env = {}) => {
  const value = String(env.CONSENT_EVIDENCE_MODE ?? "").trim().toLowerCase();
  if (!value || value === "off") return "off";
  if (value === "required") return "required";
  return "invalid";
};

const createId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  throw new Error("secure_uuid_unavailable");
};

export const buildConsentEvidence = async ({
  lead,
  idempotencyKey,
  contentHmacKey,
  now = new Date().toISOString(),
  createIdImpl = createId
}) => {
  const authorization = getAuthorizationForForm(lead.formType, lead.authorizationVersion);
  if (
    lead.consent !== true ||
    lead.noticeVersion !== CONSENT_CATALOG.noticeVersion ||
    !authorization ||
    lead.authorizationHash !== authorization.hash
  ) {
    throw new ConsentEvidenceError("consent_version_invalid");
  }

  const idempotencyKeyHash = await sha256Hex(idempotencyKey);
  const contentFingerprint = await hmacSha256Hex(canonicalizeLead(lead), contentHmacKey);
  return {
    event_id: createIdImpl(),
    request_id: createIdImpl(),
    server_timestamp_utc: now,
    form_type: lead.formType,
    notice_version: CONSENT_CATALOG.noticeVersion,
    authorization_version: authorization.version,
    authorization_hash: authorization.hash,
    content_fingerprint: contentFingerprint,
    purpose: authorization.purpose,
    accepted: true,
    idempotency_key_hash: idempotencyKeyHash,
    technical_status: "evidence_recorded",
    created_at: now,
    updated_at: now
  };
};

export const isSameEvidenceScope = (left, right) =>
  left.form_type === right.form_type &&
  left.notice_version === right.notice_version &&
  left.authorization_version === right.authorization_version &&
  left.authorization_hash === right.authorization_hash &&
  left.purpose === right.purpose &&
  left.content_fingerprint === right.content_fingerprint &&
  left.accepted === right.accepted;

const columns = [
  "event_id",
  "request_id",
  "server_timestamp_utc",
  "form_type",
  "notice_version",
  "authorization_version",
  "authorization_hash",
  "content_fingerprint",
  "purpose",
  "accepted",
  "idempotency_key_hash",
  "technical_status",
  "created_at",
  "updated_at"
];

const selectByIdempotencyKeyHash = `SELECT ${columns.join(", ")} FROM consent_evidence WHERE idempotency_key_hash = ?1 LIMIT 1`;
const selectByRequestId = `SELECT ${columns.join(", ")} FROM consent_evidence WHERE request_id = ?1 LIMIT 1`;
const insertEvidence = `INSERT OR IGNORE INTO consent_evidence (${columns.join(", ")}) VALUES (${columns.map((_, index) => `?${index + 1}`).join(", ")})`;
const claimDispatch = `UPDATE consent_evidence
  SET technical_status = 'resend_dispatching', updated_at = ?1
  WHERE request_id = ?2 AND technical_status IN (${CLAIMABLE_STATUSES.map((status) => `'${status}'`).join(", ")})`;
const completeDispatch = `UPDATE consent_evidence
  SET technical_status = ?1, updated_at = ?2
  WHERE request_id = ?3 AND technical_status = 'resend_dispatching'`;
const reconcilePending = `UPDATE consent_evidence
  SET technical_status = ?1, updated_at = ?2
  WHERE request_id = ?3 AND technical_status IN ('resend_dispatching', 'resend_uncertain')`;

const fromRow = (row) => {
  if (!row) return null;
  return {
    ...row,
    accepted: row.accepted === true || row.accepted === 1
  };
};

export const createConsentEvidenceStore = (db) => {
  if (!db || typeof db.prepare !== "function") throw new Error("consent_db_not_configured");

  const first = async (sql, value) => fromRow(await db.prepare(sql).bind(value).first());

  const findByIdempotencyKeyHash = (hash) => first(selectByIdempotencyKeyHash, hash);
  const findByRequestId = (requestId) => first(selectByRequestId, requestId);

  const recordEvidence = async (evidence) => {
    const existing = await findByIdempotencyKeyHash(evidence.idempotency_key_hash);
    if (existing) return { created: false, record: existing };

    const values = columns.map((column) => (column === "accepted" ? (evidence[column] ? 1 : 0) : evidence[column]));
    const result = await db.prepare(insertEvidence).bind(...values).run();
    const record = await findByIdempotencyKeyHash(evidence.idempotency_key_hash);
    if (!record) throw new Error("consent_evidence_missing_after_insert");
    return { created: Number(result?.meta?.changes || 0) > 0, record };
  };

  const update = async (sql, requestId, status, updatedAt) => {
    const result = await db.prepare(sql).bind(status, updatedAt, requestId).run();
    const record = await findByRequestId(requestId);
    if (!record) throw new Error("consent_evidence_missing_after_update");
    return { updated: Number(result?.meta?.changes || 0) === 1, record };
  };

  const claimDispatchFor = async (requestId, updatedAt = new Date().toISOString()) => {
    const result = await db.prepare(claimDispatch).bind(updatedAt, requestId).run();
    const record = await findByRequestId(requestId);
    if (!record) throw new Error("consent_evidence_missing_after_claim");
    return { claimed: Number(result?.meta?.changes || 0) === 1, record };
  };

  const completeDispatchFor = async (requestId, status, updatedAt = new Date().toISOString()) => {
    if (!["resend_accepted", "resend_error", "resend_uncertain"].includes(status)) {
      throw new Error("invalid_consent_evidence_status");
    }
    return update(completeDispatch, requestId, status, updatedAt);
  };

  const reconcilePendingFor = async (requestId, status, updatedAt = new Date().toISOString()) => {
    if (!RECONCILABLE_TARGETS.includes(status)) throw new Error("invalid_reconciliation_status");
    return update(reconcilePending, requestId, status, updatedAt);
  };

  return Object.freeze({
    findByIdempotencyKeyHash,
    findByRequestId,
    recordEvidence,
    claimDispatch: claimDispatchFor,
    completeDispatch: completeDispatchFor,
    reconcilePending: reconcilePendingFor
  });
};
