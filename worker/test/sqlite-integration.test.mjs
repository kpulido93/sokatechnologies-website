import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import test from "node:test";
import assert from "node:assert/strict";

const migration = await readFile(new URL("../0001_consent_evidence.sql", import.meta.url), "utf8");

const runLocalSqlite = (sql) => new Promise((resolve, reject) => {
  const script = String.raw`
import json
import sqlite3
import sys

db = sqlite3.connect(":memory:")
db.executescript(sys.stdin.read())
insert = """
INSERT INTO consent_evidence (
  event_id, request_id, server_timestamp_utc, form_type, notice_version,
  authorization_version, authorization_hash, content_fingerprint, purpose,
  accepted, idempotency_key_hash, technical_status, created_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""
values = (
    "event-synthetic-1", "request-synthetic-1", "2026-10-27T00:00:00.000Z",
    "contact", "privacy-colombia-draft-v1", "contact-response-v1", "hash-synthetic-1",
    "fingerprint-synthetic-1", "contact_response", 1, "idempotency-hash-1",
    "evidence_recorded", "2026-10-27T00:00:00.000Z", "2026-10-27T00:00:00.000Z"
)
db.execute(insert, values)
duplicate = db.execute("INSERT OR IGNORE INTO consent_evidence SELECT * FROM consent_evidence WHERE event_id = ?", (values[0],)).rowcount
claim_first = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_dispatching' WHERE request_id = ? AND technical_status IN ('evidence_recorded', 'resend_error')",
    (values[1],)
).rowcount
claim_second = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_dispatching' WHERE request_id = ? AND technical_status IN ('evidence_recorded', 'resend_error')",
    (values[1],)
).rowcount
accepted = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_accepted' WHERE request_id = ? AND technical_status = 'resend_dispatching'",
    (values[1],)
).rowcount
regression = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_error' WHERE request_id = ? AND technical_status = 'resend_dispatching'",
    (values[1],)
).rowcount

uncertain = list(values)
uncertain[0:2] = ["event-synthetic-2", "request-synthetic-2"]
uncertain[10] = "idempotency-hash-2"
uncertain[11] = "resend_uncertain"
db.execute(insert, tuple(uncertain))
automatic_claim_after_uncertain = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_dispatching' WHERE request_id = ? AND technical_status IN ('evidence_recorded', 'resend_error')",
    (uncertain[1],)
).rowcount
reconciled = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_error' WHERE request_id = ? AND technical_status = 'resend_uncertain'",
    (uncertain[1],)
).rowcount
claim_after_reconciliation = db.execute(
    "UPDATE consent_evidence SET technical_status = 'resend_dispatching' WHERE request_id = ? AND technical_status IN ('evidence_recorded', 'resend_error')",
    (uncertain[1],)
).rowcount
queried = db.execute(
    "SELECT request_id, technical_status, content_fingerprint FROM consent_evidence WHERE request_id = ?",
    (values[1],)
).fetchone()
print(json.dumps({
    "row_count": db.execute("SELECT COUNT(*) FROM consent_evidence").fetchone()[0],
    "duplicate": duplicate,
    "claim_first": claim_first,
    "claim_second": claim_second,
    "accepted": accepted,
    "regression": regression,
    "automatic_claim_after_uncertain": automatic_claim_after_uncertain,
    "reconciled": reconciled,
    "claim_after_reconciliation": claim_after_reconciliation,
    "queried": queried
}))
`;
  const child = spawn("python3", ["-c", script], { stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  child.on("error", reject);
  child.on("close", (code) => {
    if (code !== 0) reject(new Error(`local_sqlite_failed:${stderr || code}`));
    else resolve(JSON.parse(stdout));
  });
  child.stdin.end(sql);
});

test("applies the D1 migration and exercises atomic local SQLite operations", async () => {
  const result = await runLocalSqlite(migration);

  assert.deepEqual(result, {
    row_count: 2,
    duplicate: 0,
    claim_first: 1,
    claim_second: 0,
    accepted: 1,
    regression: 0,
    automatic_claim_after_uncertain: 0,
    reconciled: 1,
    claim_after_reconciliation: 1,
    queried: ["request-synthetic-1", "resend_accepted", "fingerprint-synthetic-1"]
  });
});
