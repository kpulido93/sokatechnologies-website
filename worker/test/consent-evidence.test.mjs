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
  "content_fingerprint",
  "purpose",
  "accepted",
  "idempotency_key_hash",
  "technical_status",
  "created_at",
  "updated_at"
];

class MockD1Database {
  constructor({ failInsert = false, failUpdate = false, failComplete = false, beforeInsert = null } = {}) {
    this.rows = [];
    this.failInsert = failInsert;
    this.failUpdate = failUpdate;
    this.failComplete = failComplete;
    this.beforeInsert = beforeInsert;
    this.claimAttempts = 0;
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
      if (this.database.beforeInsert) await this.database.beforeInsert();
      const idempotencyKeyHash = this.values[10];
      if (this.database.rows.some((row) => row.idempotency_key_hash === idempotencyKeyHash)) {
        return { meta: { changes: 0 } };
      }
      this.database.rows.push(Object.fromEntries(columns.map((column, index) => [column, this.values[index]])));
      return { meta: { changes: 1 } };
    }

    if (this.sql.startsWith("UPDATE")) {
      if (this.database.failUpdate) throw new Error("mock_update_failed");
      if (this.sql.includes("SET technical_status = 'resend_dispatching'")) {
        this.database.claimAttempts += 1;
        const row = this.database.rows.find((candidate) => candidate.request_id === this.values[1]);
        if (!row || !["evidence_recorded", "resend_error"].includes(row.technical_status)) return { meta: { changes: 0 } };
        row.technical_status = "resend_dispatching";
        row.updated_at = this.values[0];
        return { meta: { changes: 1 } };
      }

      if (this.database.failComplete) throw new Error("mock_complete_failed");
      const row = this.database.rows.find((candidate) => candidate.request_id === this.values[2]);
      if (!row) return { meta: { changes: 0 } };
      if (this.sql.includes("IN ('resend_dispatching', 'resend_uncertain')")) {
        if (!["resend_dispatching", "resend_uncertain"].includes(row.technical_status)) return { meta: { changes: 0 } };
      } else if (this.sql.includes("resend_dispatching") && row.technical_status !== "resend_dispatching") {
        return { meta: { changes: 0 } };
      }
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
  CONSENT_EVIDENCE_HMAC_KEY: "synthetic-consent-hmac-key",
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

const provider = ({ resendStatuses = [200], resendErrorCodes = [], turnstileSuccess = true, resendError = false, resendGate = null, calls = [] } = {}) => {
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
    if (resendGate) await resendGate.promise;
    const callIndex = resendCall++;
    const status = resendStatuses[Math.min(callIndex, resendStatuses.length - 1)];
    const code = resendErrorCodes[callIndex];
    const body = status >= 200 && status < 300
      ? JSON.stringify({ id: "synthetic-email" })
      : code
        ? JSON.stringify({ name: code, code })
        : "rejected";
    return new Response(body, { status });
  };
};

const resendCalls = (calls) => calls.filter((call) => call.url.includes("api.resend.com"));

const createBarrier = (participants) => {
  let arrived = 0;
  let release;
  const released = new Promise((resolve) => {
    release = resolve;
  });
  return {
    wait: async () => {
      arrived += 1;
      if (arrived === participants) release();
      await released;
    }
  };
};

const createDeferred = () => {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

const waitFor = async (predicate) => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (predicate()) return;
    await new Promise((resolve) => setImmediate(resolve));
  }
  throw new Error("test_condition_timeout");
};

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
  const stored = await createConsentEvidenceStore(database).findByRequestId(evidence.request_id);
  assert.equal(stored.event_id, evidence.event_id);
  assert.equal(stored.accepted, true);
  const notification = JSON.parse(resendCalls(calls)[0].init.body);
  assert.match(notification.text, new RegExp(evidence.request_id));
  assert.equal(stored.request_id, evidence.request_id);
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

  await t.test("fingerprint key is required", async () => {
    const calls = [];
    const env = baseEnv(new MockD1Database());
    delete env.CONSENT_EVIDENCE_HMAC_KEY;
    const response = await handleRequest(request(), env, { fetchImpl: provider({ calls }) });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, "consent_fingerprint_key_missing");
    assert.equal(resendCalls(calls).length, 0);
  });
});

test("fails closed for an unknown evidence mode", async () => {
  const database = new MockD1Database();
  const calls = [];
  const response = await handleRequest(request(), baseEnv(database, "requierd"), { fetchImpl: provider({ calls }) });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "consent_mode_invalid");
  assert.equal(database.rows.length, 0);
  assert.equal(resendCalls(calls).length, 0);
});

test("stores one evidence event and gives one process the dispatch claim", async () => {
  const insertBarrier = createBarrier(2);
  const resendGate = createDeferred();
  const database = new MockD1Database({ beforeInsert: insertBarrier.wait });
  const calls = [];
  const fetchImpl = provider({ calls, resendGate });
  const responsesPromise = Promise.all([
    handleRequest(request(), baseEnv(database), { fetchImpl }),
    handleRequest(request(), baseEnv(database), { fetchImpl })
  ]);

  await waitFor(() => database.claimAttempts === 2);
  assert.equal(resendCalls(calls).length, 1);
  resendGate.resolve();
  const responses = await responsesPromise;

  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 202]);
  assert.equal(database.rows.length, 1);
  assert.equal(new Set(resendCalls(calls).map(({ init }) => init.headers["Idempotency-Key"])).size, 1);
});

test("rejects a same-key content change after the winning evidence is read back", async () => {
  const database = new MockD1Database();
  const calls = [];
  const first = await handleRequest(request(), baseEnv(database), { fetchImpl: provider({ calls }) });
  const changed = await handleRequest(
    request({ ...validLead(), summary: "Otra solicitud sintética con contenido diferente para la misma clave." }),
    baseEnv(database),
    { fetchImpl: provider({ calls }) }
  );

  assert.equal(first.status, 200);
  assert.equal(changed.status, 409);
  assert.equal((await changed.json()).error, "idempotency_conflict");
  assert.equal(database.rows.length, 1);
  assert.equal(resendCalls(calls).length, 1);
});

test("rejects concurrent cross-form reuse without sending the losing request", async () => {
  const insertBarrier = createBarrier(2);
  const database = new MockD1Database({ beforeInsert: insertBarrier.wait });
  const calls = [];
  const fetchImpl = provider({ calls });
  const [contact, diagnostico] = await Promise.all([
    handleRequest(request(validLead("contact")), baseEnv(database), { fetchImpl }),
    handleRequest(
      request(validLead("diagnostico"), { "Idempotency-Key": "synthetic-idempotency-key" }),
      baseEnv(database),
      { fetchImpl }
    )
  ]);

  assert.deepEqual([contact.status, diagnostico.status].sort(), [200, 409]);
  assert.equal(database.rows.length, 1);
  assert.equal(resendCalls(calls).length, 1);
});

test("retries a Resend error with the same evidence and idempotency reference", async () => {
  const database = new MockD1Database();
  const calls = [];
  const first = await handleRequest(request(), baseEnv(database), {
    fetchImpl: provider({ calls, resendStatuses: [422, 200] })
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

test("keeps ambiguous Resend responses uncertain and blocks automatic retries", async (t) => {
  for (const [name, status, code] of [
    ["HTTP 500", 500, ""],
    ["HTTP 502", 502, ""],
    ["HTTP 503", 503, ""],
    ["concurrent idempotency conflict", 409, "concurrent_idempotent_requests"],
    ["unknown conflict", 409, ""]
  ]) {
    await t.test(name, async () => {
      const database = new MockD1Database();
      const calls = [];
      const first = await handleRequest(request(), baseEnv(database), {
        fetchImpl: provider({ calls, resendStatuses: [status], resendErrorCodes: [code] })
      });
      const retry = await handleRequest(request(), baseEnv(database), {
        fetchImpl: provider({ calls, resendStatuses: [200] })
      });

      assert.equal(first.status, 502);
      assert.equal((await first.json()).error, "provider_result_uncertain");
      assert.equal(database.rows[0].technical_status, "resend_uncertain");
      assert.equal(retry.status, 503);
      assert.equal((await retry.json()).error, "provider_result_uncertain");
      assert.equal(resendCalls(calls).length, 1);
    });
  }
});

test("keeps definitive Resend rejections retryable only after an explicit request", async (t) => {
  for (const [name, status, code] of [
    ["HTTP 400", 400, ""],
    ["HTTP 422", 422, ""],
    ["invalid idempotency request", 409, "invalid_idempotent_request"]
  ]) {
    await t.test(name, async () => {
      const database = new MockD1Database();
      const calls = [];
      const first = await handleRequest(request(), baseEnv(database), {
        fetchImpl: provider({ calls, resendStatuses: [status], resendErrorCodes: [code] })
      });
      assert.equal(first.status, 502);
      assert.equal((await first.json()).error, "provider_error");
      assert.equal(database.rows[0].technical_status, "resend_error");
      const retry = await handleRequest(request(), baseEnv(database), {
        fetchImpl: provider({ calls, resendStatuses: [200] })
      });

      assert.equal(retry.status, 200);
      assert.equal(database.rows[0].technical_status, "resend_accepted");
      assert.equal(resendCalls(calls).length, 2);
    });
  }
});

test("accepts successful 200 and 201 Resend responses", async (t) => {
  for (const status of [200, 201]) {
    await t.test(String(status), async () => {
      const database = new MockD1Database();
      const response = await handleRequest(request(), baseEnv(database), {
        fetchImpl: provider({ resendStatuses: [status] })
      });
      assert.equal(response.status, 200);
      assert.equal(database.rows[0].technical_status, "resend_accepted");
    });
  }
});

test("blocks automatic retries after uncertainty and allows only explicit reconciliation", async () => {
  const database = new MockD1Database();
  const calls = [];
  const first = await handleRequest(request(), baseEnv(database), {
    fetchImpl: provider({ calls, resendError: true })
  });
  const automaticRetry = await handleRequest(request(), baseEnv(database), {
    fetchImpl: provider({ calls })
  });
  const evidence = database.rows[0];
  const store = createConsentEvidenceStore(database);
  const reconciliation = await store.reconcilePending(evidence.request_id, "resend_error");
  const recovered = await handleRequest(request(), baseEnv(database), {
    fetchImpl: provider({ calls })
  });

  assert.equal(first.status, 502);
  assert.equal((await first.json()).error, "provider_result_uncertain");
  assert.equal(automaticRetry.status, 503);
  assert.equal((await automaticRetry.json()).error, "provider_result_uncertain");
  assert.equal(reconciliation.updated, true);
  assert.equal(recovered.status, 200);
  assert.equal(database.rows.length, 1);
  assert.equal(database.rows[0].technical_status, "resend_accepted");
  assert.equal(resendCalls(calls).length, 2);
});

test("does not reopen dispatch after the accepted status write is lost", async () => {
  const database = new MockD1Database({ failComplete: true });
  const calls = [];
  const first = await handleRequest(request(), baseEnv(database), { fetchImpl: provider({ calls }) });
  const retry = await handleRequest(request(), baseEnv(database), { fetchImpl: provider({ calls }) });

  assert.equal(first.status, 502);
  assert.equal((await first.json()).error, "provider_result_uncertain");
  assert.equal(retry.status, 202);
  assert.equal((await retry.json()).error, "provider_processing");
  assert.equal(database.rows[0].technical_status, "resend_dispatching");
  assert.equal(resendCalls(calls).length, 1);

  database.failComplete = false;
  const reconciliation = await createConsentEvidenceStore(database).reconcilePending(
    database.rows[0].request_id,
    "resend_accepted"
  );
  const recovered = await handleRequest(request(), baseEnv(database), { fetchImpl: provider({ calls }) });
  assert.equal(reconciliation.updated, true);
  assert.equal(recovered.status, 200);
  assert.equal(resendCalls(calls).length, 1);
});

test("keeps demo mode from invoking the submission endpoint", async () => {
  const source = await readFile(new URL("../../src/components/ContactForm.astro", import.meta.url), "utf8");
  const demoBranch = source.indexOf('if (mode === "demo")');
  const submitCall = source.indexOf("fetch(submitEndpoint");
  assert.notEqual(demoBranch, -1);
  assert.ok(demoBranch < submitCall);
  assert.equal(getConsentEvidenceMode({}), "off");
});
