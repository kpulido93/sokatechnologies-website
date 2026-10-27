import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import consentCatalog from "../../src/data/consentCatalog.json" with { type: "json" };
import { handleRequest } from "../src/index.mjs";
import { createConsentEvidenceStore, getConsentEvidenceMode } from "../src/consentEvidence.mjs";
import { getAuthorizationForForm } from "../src/consentCatalog.mjs";

const origin = "https://prueba.sokatechnologies.com";
const testEmail = "test@example.invalid";
const testTurnstileToken = "synthetic-turnstile-token";

const columns = [
  "event_id",
  "request_id",
  "server_timestamp_utc",
  "form_type",
  "notice_version",
  "authorization_version",
  "authorization_hash",
  "purpose",
  "accepted",
  "idempotency_key_hash",
  "technical_status",
  "created_at",
  "updated_at"
];

class MockD1Database {
  constructor({ failInsert = false, failUpdate = false } = {}) {
    this.rows = [];
    this.failInsert = failInsert;
    this.failUpdate = failUpdate;
  }

  prepare(sql) {
    return new MockD1Statement(this, sql);
  }
}

class MockD1Statement {
  constructor(database, sql) {
    this.database = database;
    this.sql = sql;
    this.values = [];
  }

  bind(...values) {
    this.values = values;
    return this;
  }

  async first() {
    if (this.sql.includes("idempotency_key_hash = ?1")) {
      return this.database.rows.find((row) => row.idempotency_key_hash === this.values[0]) ?? null;
    }
    if (this.sql.includes("request_id = ?1")) {
      return this.database.rows.find((row) => row.request_id === this.values[0]) ?? null;
    }
    throw new Error("unsupported_mock_select");
  }

  async run() {
    if (this.sql.startsWith("INSERT")) {
      if (this.database.failInsert) throw new Error("mock_insert_failed");
      const idempotencyKeyHash = this.values[9];
      if (this.database.rows.some((row) => row.idempotency_key_hash === idempotencyKeyHash)) {
        return { meta: { changes: 0 } };
      }
      this.database.rows.push(Object.fromEntries(columns.map((column, index) => [column, this.values[index]])));
      return { meta: { changes: 1 } };
    }

    if (this.sql.startsWith("UPDATE")) {
      if (this.database.failUpdate) throw new Error("mock_update_failed");
      const row = this.database.rows.find((candidate) => candidate.request_id === this.values[2]);
      if (!row) return { meta: { changes: 0 } };
      row.technical_status = this.values[0];
      row.updated_at = this.values[1];
      return { meta: { changes: 1 } };
    }

    throw new Error("unsupported_mock_statement");
  }
}

const authorization = (formType) => getAuthorizationForForm(formType, {
  contact: "contact-response-v1",
  diagnostico: "diagnostico-response-v1"
}[formType]);

const validLead = (formType = "contact") => ({
  formType,
  formContext: formType === "contact" ? "Solicitud de contacto" : "Solicitud de diagnóstico",
  name: "Test Contact",
  company: "Synthetic Company",
  email: testEmail,
  phone: "",
  country: "Colombia",
  service: "Software a medida",
  problemType: "manual",
  summary: "Solicitud sintética para verificar el flujo local de consentimiento.",
  consent: true,
  noticeVersion: consentCatalog.noticeVersion,
  authorizationVersion: authorization(formType).version,
  authorizationHash: authorization(formType).hash,
  website: "",
  turnstileToken: testTurnstileToken
});

const baseEnv = (database, mode = "required") => ({
  ALLOWED_ORIGINS: origin,
  CONSENT_EVIDENCE_MODE: mode,
  CONSENT_DB: database,
  RATE_LIMITER: { limit: async () => ({ success: true }) },
  TURNSTILE_SECRET_KEY: "synthetic-turnstile-secret",
  TURNSTILE_EXPECTED_HOSTNAME: "prueba.sokatechnologies.com",
  TURNSTILE_EXPECTED_ACTION: "lead",
  RESEND_API_KEY: "synthetic-resend-value",
  RESEND_FROM_EMAIL: "SokaTechnologies <no-reply@example.invalid>",
  LEADS_TO_EMAIL: "info@sokatechnologies.com"
});

const request = (payload = validLead(), headers = {}) => new Request("https://leads.example.test/api/leads", {
  method: "POST",
  headers: {
    Origin: origin,
    "Content-Type": "application/json",
    "CF-Connecting-IP": "203.0.113.8",
    "Idempotency-Key": "synthetic-idempotency-key",
    ...headers
  },
  body: JSON.stringify(payload)
});

const provider = ({ resendStatuses = [200], turnstileSuccess = true, resendError = false, calls = [] } = {}) => {
  let resendCall = 0;
  return async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes("turnstile/v0/siteverify")) {
      return new Response(JSON.stringify({
        success: turnstileSuccess,
        hostname: "prueba.sokatechnologies.com",
        action: "lead"
      }), { status: 200 });
    }
    if (resendError) throw new Error("synthetic_network_failure");
    const status = resendStatuses[Math.min(resendCall++, resendStatuses.length - 1)];
    return new Response(status === 200 ? JSON.stringify({ id: "synthetic-email" }) : "rejected", { status });
  };
};

const resendCalls = (calls) => calls.filter((call) => call.url.includes("api.resend.com"));

test("catalog hashes match the exact authorization text", () => {
  for (const item of consentCatalog.authorizations) {
    const hash = createHash("sha256").update(item.text, "utf8").digest("hex");
    assert.equal(item.hash, hash);
  }
});

test("records valid consent before accepting the Resend result and stores no lead fields", async () => {
  const database = new MockD1Database();
  const calls = [];
  const response = await handleRequest(request(), baseEnv(database), { fetchImpl: provider({ calls }) });
  const evidence = database.rows[0];

  assert.equal(response.status, 200);
  assert.equal(database.rows.length, 1);
  assert.equal(evidence.technical_status, "resend_accepted");
  assert.equal(evidence.purpose, "contact_response");
  assert.equal(resendCalls(calls).length, 1);
  assert.equal(await createConsentEvidenceStore(database).findByRequestId(evidence.request_id).then((row) => row.event_id), evidence.event_id);
  assert.doesNotMatch(JSON.stringify(evidence), /Test Contact|Synthetic Company|test@example|Solicitud sintética|turnstile|203\.0\.113\.8/i);
});

test("derives diagnostic purpose from the server catalog", async () => {
  const database = new MockD1Database();
  const response = await handleRequest(request(validLead("diagnostico")), baseEnv(database), { fetchImpl: provider() });
  assert.equal(response.status, 200);
  assert.equal(database.rows[0].purpose, "diagnostic_response");
});

test("rejects missing consent without writing or sending", async () => {
  const database = new MockD1Database();
  const calls = [];
  const response = await handleRequest(request({ ...validLead(), consent: false }), baseEnv(database), { fetchImpl: provider({ calls }) });
  assert.equal(response.status, 400);
  assert.equal(database.rows.length, 0);
  assert.equal(calls.length, 0);
});

test("rejects unknown and altered authorization versions", async (t) => {
  for (const [name, changes] of [
    ["unknown version", { authorizationVersion: "unknown-v99" }],
    ["altered hash", { authorizationHash: "0".repeat(64) }]
  ]) {
    await t.test(name, async () => {
      const database = new MockD1Database();
      const calls = [];
      const response = await handleRequest(request({ ...validLead(), ...changes }), baseEnv(database), { fetchImpl: provider({ calls }) });
      assert.equal(response.status, 400);
      assert.equal(database.rows.length, 0);
      assert.equal(resendCalls(calls).length, 0);
    });
  }
});

test("rejects an invalid Turnstile token before persistence", async () => {
  const database = new MockD1Database();
  const calls = [];
  const response = await handleRequest(request(), baseEnv(database), { fetchImpl: provider({ calls, turnstileSuccess: false }) });
  assert.equal(response.status, 403);
  assert.equal(database.rows.length, 0);
  assert.equal(resendCalls(calls).length, 0);
});

test("fails closed when consent storage is unavailable or cannot write", async (t) => {
  await t.test("binding unavailable", async () => {
    const calls = [];
    const env = baseEnv(undefined);
    delete env.CONSENT_DB;
    const response = await handleRequest(request(), env, { fetchImpl: provider({ calls }) });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, "consent_storage_error");
    assert.equal(resendCalls(calls).length, 0);
  });

  await t.test("write fails", async () => {
    const calls = [];
    const response = await handleRequest(request(), baseEnv(new MockD1Database({ failInsert: true })), { fetchImpl: provider({ calls }) });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, "consent_storage_error");
    assert.equal(resendCalls(calls).length, 0);
  });
});

test("stores one evidence event for concurrent identical requests", async () => {
  const database = new MockD1Database();
  const calls = [];
  const fetchImpl = provider({ calls });
  const [first, second] = await Promise.all([
    handleRequest(request(), baseEnv(database), { fetchImpl }),
    handleRequest(request(), baseEnv(database), { fetchImpl })
  ]);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(database.rows.length, 1);
  assert.equal(new Set(resendCalls(calls).map(({ init }) => init.headers["Idempotency-Key"])).size, 1);
});

test("retries a Resend error with the same evidence and idempotency reference", async () => {
  const database = new MockD1Database();
  const calls = [];
  const first = await handleRequest(request(), baseEnv(database), {
    fetchImpl: provider({ calls, resendStatuses: [500, 200] })
  });
  const eventId = database.rows[0].event_id;
  const retry = await handleRequest(
    request({ ...validLead(), turnstileToken: "synthetic-fresh-turnstile-token" }),
    baseEnv(database),
    { fetchImpl: provider({ calls, resendStatuses: [200] }) }
  );

  assert.equal(first.status, 502);
  assert.equal(retry.status, 200);
  assert.equal(database.rows.length, 1);
  assert.equal(database.rows[0].event_id, eventId);
  assert.equal(database.rows[0].technical_status, "resend_accepted");
});

test("marks an uncertain Resend result without claiming success", async () => {
  const database = new MockD1Database();
  const calls = [];
  const response = await handleRequest(request(), baseEnv(database), {
    fetchImpl: provider({ calls, resendError: true })
  });

  assert.equal(response.status, 502);
  assert.equal((await response.json()).error, "provider_result_uncertain");
  assert.equal(database.rows.length, 1);
  assert.equal(database.rows[0].technical_status, "resend_uncertain");
});

test("keeps demo mode from invoking the submission endpoint", async () => {
  const source = await readFile(new URL("../../src/components/ContactForm.astro", import.meta.url), "utf8");
  const demoBranch = source.indexOf('if (mode === "demo")');
  const submitCall = source.indexOf("fetch(submitEndpoint");
  assert.notEqual(demoBranch, -1);
  assert.ok(demoBranch < submitCall);
  assert.equal(getConsentEvidenceMode({}), "off");
});
