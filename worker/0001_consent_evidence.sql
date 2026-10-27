CREATE TABLE IF NOT EXISTS consent_evidence (
  event_id TEXT PRIMARY KEY NOT NULL,
  request_id TEXT NOT NULL UNIQUE,
  server_timestamp_utc TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'diagnostico')),
  notice_version TEXT NOT NULL,
  authorization_version TEXT NOT NULL,
  authorization_hash TEXT NOT NULL,
  content_fingerprint TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('contact_response', 'diagnostic_response')),
  accepted INTEGER NOT NULL CHECK (accepted = 1),
  idempotency_key_hash TEXT NOT NULL UNIQUE,
  technical_status TEXT NOT NULL CHECK (technical_status IN ('evidence_recorded', 'resend_dispatching', 'resend_accepted', 'resend_error', 'resend_uncertain')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consent_evidence_request_id ON consent_evidence (request_id);
