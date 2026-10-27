import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { setupNetwork } from "@msw/cloudflare";
import { env } from "cloudflare:workers";
import { applyD1Migrations, createExecutionContext, reset, waitOnExecutionContext } from "cloudflare:test";
import consentCatalog from "../../src/data/consentCatalog.json" with { type: "json" };
import worker from "../src/index.mjs";
import { getAuthorizationForForm } from "../src/consentCatalog.mjs";
import { sha256Hex } from "../src/consentEvidence.mjs";

const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_URL = "https://api.resend.com/emails";
const ORIGIN = "https://prueba.sokatechnologies.com";
const authorization = getAuthorizationForForm("contact", "contact-response-v1");
const network = setupNetwork();

const makeLead = (overrides = {}) => ({
  formType: "contact",
  formContext: "Solicitud sintética de runtime local",
  name: "Synthetic Runtime Contact",
  company: "Synthetic Runtime Company",
  email: "synthetic-runtime@example.invalid",
  phone: "",
  country: "Colombia",
  service: "Software a medida",
  problemType: "manual",
  summary: "Solicitud sintética para probar el binding D1 nativo.",
  consent: true,
  noticeVersion: consentCatalog.noticeVersion,
  authorizationVersion: authorization.version,
  authorizationHash: authorization.hash,
  website: "",
  turnstileToken: "synthetic-turnstile-token",
  ...overrides
});

const makeRequest = (idempotencyKey, lead = makeLead()) => new Request("https://native-runtime.test/api/leads", {
  method: "POST",
  headers: {
    Origin: ORIGIN,
    "Content-Type": "application/json",
    "CF-Connecting-IP": "203.0.113.42",
    "Idempotency-Key": idempotencyKey
  },
  body: JSON.stringify(lead)
});

const dispatch = async (request, environment = env) => {
  const context = createExecutionContext();
  const response = await worker.fetch(request, environment, context);
  await waitOnExecutionContext(context);
  return { response, body: await response.json() };
};

const mockProviders = ({ resendStatus = 200, resendCode = "", resendDelay = 0 } = {}) => {
  const calls = { turnstile: 0, resend: [] };
  network.use(
    http.post(TURNSTILE_URL, () => {
      calls.turnstile += 1;
      return HttpResponse.json({
        success: true,
        hostname: "prueba.sokatechnologies.com",
        action: "lead"
      });
    }),
    http.post(RESEND_URL, async ({ request }) => {
      calls.resend.push(await request.json());
      if (resendDelay) await new Promise((resolve) => setTimeout(resolve, resendDelay));
      return HttpResponse.json(
        resendCode ? { code: resendCode } : { id: "synthetic-native-runtime-email" },
        { status: resendStatus }
      );
    })
  );
  return calls;
};

const rowByKey = async (idempotencyKey) => env.CONSENT_DB.prepare(
  "SELECT event_id, request_id, form_type, notice_version, authorization_version, authorization_hash, content_fingerprint, purpose, accepted, idempotency_key_hash, technical_status, created_at, updated_at FROM consent_evidence WHERE idempotency_key_hash = ?1"
).bind(await sha256Hex(idempotencyKey)).first();

beforeAll(() => network.enable());

beforeEach(async () => {
  await reset();
  await applyD1Migrations(env.CONSENT_DB, env.TEST_MIGRATIONS);
  network.resetHandlers();
  network.use(http.all("*", ({ request }) => {
    throw new Error(`unexpected outbound request: ${request.method} ${request.url}`);
  }));
});

afterAll(() => network.disable());

describe("native D1 binding in the Cloudflare Workers runtime", () => {
  it("persists consent through env.CONSENT_DB and supports internal request_id lookup", async () => {
    const idempotencyKey = "native-runtime-success-001";
    const calls = mockProviders();
    const result = await dispatch(makeRequest(idempotencyKey));

    expect(result.response.status).toBe(200);
    expect(calls.resend).toHaveLength(1);
    const row = await rowByKey(idempotencyKey);
    expect(row).toMatchObject({ form_type: "contact", purpose: "contact_response", accepted: 1, technical_status: "resend_accepted" });
    expect(row.request_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    const queried = await env.CONSENT_DB.prepare(
      "SELECT request_id, form_type, purpose, technical_status FROM consent_evidence WHERE request_id = ?1"
    ).bind(row.request_id).first();
    expect(queried).toEqual({
      request_id: row.request_id,
      form_type: "contact",
      purpose: "contact_response",
      technical_status: "resend_accepted"
    });
    expect(calls.resend[0].text).toContain(row.request_id);
    expect(JSON.stringify(row)).not.toMatch(/Synthetic Runtime|synthetic-runtime@example|203\.0\.113\.42|synthetic-turnstile-token/);
  });

  it.each([
    ["missing consent", { consent: false }],
    ["invalid authorization version", { authorizationVersion: "unknown-v1" }]
  ])("rejects %s before creating evidence", async (_label, overrides) => {
    const calls = mockProviders();
    const result = await dispatch(makeRequest(`native-runtime-invalid-${_label.replaceAll(" ", "-")}`, makeLead(overrides)));

    expect(result.response.status).toBe(400);
    expect(result.body.error).toBe(overrides.consent === false ? "consent_required" : "consent_version_invalid");
    expect(calls.resend).toHaveLength(0);
    const count = await env.CONSENT_DB.prepare("SELECT COUNT(*) AS count FROM consent_evidence").first();
    expect(count.count).toBe(0);
  });

  it("rejects idempotency reuse with changed content", async () => {
    const idempotencyKey = "native-runtime-content-conflict-001";
    const calls = mockProviders();
    expect((await dispatch(makeRequest(idempotencyKey))).response.status).toBe(200);

    const result = await dispatch(makeRequest(
      idempotencyKey,
      makeLead({ summary: "Contenido sintético modificado para probar el conflicto." })
    ));

    expect(result.response.status).toBe(409);
    expect(result.body.error).toBe("idempotency_conflict");
    expect(calls.resend).toHaveLength(1);
  });

  it("serializes concurrent requests with the same idempotency key", async () => {
    const idempotencyKey = "native-runtime-concurrent-001";
    const calls = mockProviders({ resendDelay: 20 });
    const [first, second] = await Promise.all([
      dispatch(makeRequest(idempotencyKey)),
      dispatch(makeRequest(idempotencyKey))
    ]);

    expect([first.response.status, second.response.status].every((status) => [200, 202].includes(status))).toBe(true);
    expect(calls.resend).toHaveLength(1);
    const count = await env.CONSENT_DB.prepare(
      "SELECT COUNT(*) AS count FROM consent_evidence WHERE idempotency_key_hash = ?1"
    ).bind(await sha256Hex(idempotencyKey)).first();
    expect(count.count).toBe(1);
  });

  it("fails closed when native D1 storage is unavailable", async () => {
    await env.CONSENT_DB.prepare("DROP TABLE consent_evidence").run();
    const calls = mockProviders();
    const result = await dispatch(makeRequest("native-runtime-d1-failure-001"));

    expect(result.response.status).toBe(503);
    expect(result.body.error).toBe("consent_storage_error");
    expect(calls.resend).toHaveLength(0);
  });

  it("fails closed when the HMAC key is absent", async () => {
    const calls = mockProviders();
    const environment = { ...env, CONSENT_EVIDENCE_HMAC_KEY: "" };
    const result = await dispatch(makeRequest("native-runtime-hmac-missing-001"), environment);

    expect(result.response.status).toBe(503);
    expect(result.body.error).toBe("consent_fingerprint_key_missing");
    expect(calls.resend).toHaveLength(0);
  });

  it.each([
    ["HTTP 500", 500, ""],
    ["HTTP 409 concurrent", 409, "concurrent_idempotent_requests"]
  ])("keeps %s uncertain and blocks automatic retry", async (_label, status, code) => {
    const idempotencyKey = `native-runtime-uncertain-${status}`;
    const calls = mockProviders({ resendStatus: status, resendCode: code });
    const first = await dispatch(makeRequest(idempotencyKey));
    const second = await dispatch(makeRequest(idempotencyKey));
    expect(first.response.status).toBe(502);
    expect(first.body.error).toBe("provider_result_uncertain");
    expect(second.response.status).toBe(503);
    expect(second.body.error).toBe("provider_result_uncertain");
    expect(calls.resend).toHaveLength(1);
    expect((await rowByKey(idempotencyKey)).technical_status).toBe("resend_uncertain");
  });
});
