import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import consentCatalog from "../src/data/consentCatalog.json" with { type: "json" };
import { handleRequest } from "../worker/src/index.mjs";
import { buildConsentEvidence, createConsentEvidenceStore, sha256Hex } from "../worker/src/consentEvidence.mjs";
import { getAuthorizationForForm } from "../worker/src/consentCatalog.mjs";

const persistPath = process.env.D1_LOCAL_PERSIST_PATH;
const hmacKey = process.env.D1_LOCAL_HMAC_KEY;

const findSqliteFiles = (directory) => {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...findSqliteFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".sqlite")) files.push(path);
  }
  return files;
};

const openLocalD1 = (directory) => {
  const d1Directory = join(directory, "v3", "d1", "miniflare-D1DatabaseObject");
  const files = findSqliteFiles(d1Directory).filter((file) => !file.endsWith("/metadata.sqlite"));
  assert.equal(files.length, 1, `expected one local D1 SQLite file, found ${files.length}`);
  const sqlite = new DatabaseSync(files[0]);
  return {
    sqlite,
    db: {
      prepare(sql) {
        return {
          bind(...values) {
            return {
              async first() {
                return sqlite.prepare(sql).get(...values) ?? null;
              },
              async run() {
                const result = sqlite.prepare(sql).run(...values);
                return { meta: { changes: Number(result.changes) } };
              }
            };
          }
        };
      }
    }
  };
};

const authorization = getAuthorizationForForm("contact", "contact-response-v1");
const syntheticLead = {
  formType: "contact",
  formContext: "Solicitud sintética local",
  name: "Synthetic Contact",
  company: "Synthetic Company",
  email: "synthetic@example.invalid",
  phone: "",
  country: "Colombia",
  service: "Software a medida",
  problemType: "manual",
  summary: "Solicitud sintética para probar D1 local persistente.",
  consent: true,
  noticeVersion: consentCatalog.noticeVersion,
  authorizationVersion: authorization.version,
  authorizationHash: authorization.hash,
  website: "",
  turnstileToken: "synthetic-turnstile-token"
};

const makeRequest = () => new Request("https://leads.example.test/api/leads", {
  method: "POST",
  headers: {
    Origin: "https://prueba.sokatechnologies.com",
    "Content-Type": "application/json",
    "CF-Connecting-IP": "203.0.113.8",
    "Idempotency-Key": "d1-local-synthetic-idempotency"
  },
  body: JSON.stringify(syntheticLead)
});

const main = async () => {
  assert.ok(persistPath, "D1_LOCAL_PERSIST_PATH is required");
  assert.ok(hmacKey, "D1_LOCAL_HMAC_KEY is required");
  const local = openLocalD1(persistPath);
  local.sqlite.exec("DELETE FROM consent_evidence");
  const calls = [];
  const env = {
    ALLOWED_ORIGINS: "https://prueba.sokatechnologies.com",
    CONSENT_EVIDENCE_MODE: "required",
    CONSENT_DB: local.db,
    CONSENT_EVIDENCE_HMAC_KEY: hmacKey,
    RATE_LIMITER: { limit: async () => ({ success: true }) },
    TURNSTILE_SECRET_KEY: "synthetic-turnstile-secret",
    TURNSTILE_EXPECTED_HOSTNAME: "prueba.sokatechnologies.com",
    TURNSTILE_EXPECTED_ACTION: "lead",
    RESEND_API_KEY: "synthetic-resend-value",
    RESEND_FROM_EMAIL: "SokaTechnologies <no-reply@example.invalid>",
    LEADS_TO_EMAIL: "info@sokatechnologies.com"
  };
  const fetchImpl = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes("turnstile/v0/siteverify")) {
      return new Response(JSON.stringify({
        success: true,
        hostname: "prueba.sokatechnologies.com",
        action: "lead"
      }), { status: 200 });
    }
    return new Response(JSON.stringify({ id: "synthetic-local-email" }), { status: 200 });
  };

  const first = await handleRequest(makeRequest(), env, { fetchImpl });
  assert.equal(first.status, 200);
  const store = createConsentEvidenceStore(local.db);
  const row = await store.findByIdempotencyKeyHash(await sha256Hex("d1-local-synthetic-idempotency"));
  assert.ok(row?.request_id);
  assert.equal(row.technical_status, "resend_accepted");
  assert.equal(row.purpose, "contact_response");
  assert.equal(row.accepted, true);
  assert.equal(calls.filter(({ url }) => url.includes("api.resend.com")).length, 1);

  const notification = JSON.parse(calls.find(({ url }) => url.includes("api.resend.com")).init.body);
  assert.match(notification.text, new RegExp(row.request_id));
  assert.doesNotMatch(JSON.stringify(row), /Synthetic Contact|Synthetic Company|synthetic@example|synthetic-local/);

  const duplicate = await handleRequest(makeRequest(), env, { fetchImpl });
  assert.equal(duplicate.status, 200);
  assert.equal(calls.filter(({ url }) => url.includes("api.resend.com")).length, 1);

  const uncertainCandidate = await buildConsentEvidence({
    lead: { ...syntheticLead, summary: "Segundo registro sintético para probar reconciliación local." },
    idempotencyKey: "d1-local-uncertain-idempotency",
    contentHmacKey: hmacKey
  });
  const recorded = await store.recordEvidence(uncertainCandidate);
  assert.equal(recorded.created, true);
  const claimed = await store.claimDispatch(uncertainCandidate.request_id);
  assert.equal(claimed.claimed, true);
  const uncertain = await store.completeDispatch(uncertainCandidate.request_id, "resend_uncertain");
  assert.equal(uncertain.updated, true);
  const blocked = await store.claimDispatch(uncertainCandidate.request_id);
  assert.equal(blocked.claimed, false);
  const reconciled = await store.reconcilePending(uncertainCandidate.request_id, "resend_error");
  assert.equal(reconciled.updated, true);
  const reclaimed = await store.claimDispatch(uncertainCandidate.request_id);
  assert.equal(reclaimed.claimed, true);
  await store.completeDispatch(uncertainCandidate.request_id, "resend_error");
  local.sqlite.close();

  const reopened = openLocalD1(persistPath);
  const persisted = await createConsentEvidenceStore(reopened.db).findByIdempotencyKeyHash(
    await sha256Hex("d1-local-synthetic-idempotency")
  );
  assert.deepEqual({ ...persisted }, {
    ...row
  });
  reopened.sqlite.close();
  console.log("d1-local-integration: PASS (synthetic evidence persisted, queried and deduplicated)");
};

await main();
