import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "../src/index.mjs";

const origin = "https://sokatechnologies.com";
const validLead = {
  formType: "contact",
  formContext: "Solicitud de contacto",
  name: "Ana Pérez",
  company: "Empresa B2B",
  email: "ana@example.com",
  phone: "+507 6000 0000",
  country: "Panamá",
  service: "Software a medida",
  problemType: "manual",
  summary: "Necesitamos ordenar un proceso interno que hoy depende de hojas de cálculo y seguimiento manual.",
  consent: true,
  website: ""
};

const baseEnv = (rateLimiter = { limit: async () => ({ success: true }) }) => ({
  ALLOWED_ORIGINS: origin,
  RATE_LIMITER: rateLimiter,
  RESEND_API_KEY: "test-only-not-a-credential",
  RESEND_FROM_EMAIL: "SokaTechnologies <leads@example.com>",
  LEADS_TO_EMAIL: "info@sokatechnologies.com"
});

const request = (payload = validLead, headers = {}) => new Request("https://leads.example.test/api/leads", {
  method: "POST",
  headers: { Origin: origin, "Content-Type": "application/json", ...headers },
  body: JSON.stringify(payload)
});

const providerOk = async () => new Response(JSON.stringify({ id: "test-email" }), { status: 200 });

test("accepts a valid contact request and confirms only after provider success", async () => {
  const response = await handleRequest(request(), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, message: "Solicitud recibida" });
});

test("escapes lead content and uses the validated prospect email as Reply-To", async () => {
  let resendRequest;
  const response = await handleRequest(request({ ...validLead, name: "<script>alert(1)</script>" }), baseEnv(), {
    fetchImpl: async (url, init) => {
      resendRequest = { url, init };
      return providerOk();
    }
  });
  const body = JSON.parse(resendRequest.init.body);
  assert.equal(response.status, 200);
  assert.equal(body.reply_to, "ana@example.com");
  assert.match(body.html, /&lt;script&gt;/);
  assert.doesNotMatch(body.html, /<script>alert/);
});

test("accepts the diagnostic form type and optional fields", async () => {
  const response = await handleRequest(request({ ...validLead, formType: "diagnostico", service: "", problemType: "" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 200);
});

test("rejects missing required fields", async () => {
  const { name, ...missing } = validLead;
  const response = await handleRequest(request(missing), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 400);
});

test("rejects an invalid email", async () => {
  const response = await handleRequest(request({ ...validLead, email: "not-an-email" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 400);
});

test("rejects missing consent", async () => {
  const response = await handleRequest(request({ ...validLead, consent: false }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 400);
});

test("rejects the honeypot", async () => {
  const response = await handleRequest(request({ ...validLead, website: "bot" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 400);
});

test("rejects an origin that is not explicitly allowed", async () => {
  const response = await handleRequest(request(validLead, { Origin: "https://attacker.example" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 403);
});

test("rejects an invalid Turnstile token without calling Resend", async () => {
  let calls = 0;
  const response = await handleRequest(request({ ...validLead, turnstileToken: "invalid" }), { ...baseEnv(), TURNSTILE_SECRET_KEY: "test-secret" }, {
    fetchImpl: async () => {
      calls += 1;
      return new Response(JSON.stringify({ success: false }), { status: 200 });
    }
  });
  assert.equal(response.status, 403);
  assert.equal(calls, 1);
});

test("fails closed when the real rate limiter is not configured", async () => {
  const env = { ...baseEnv() };
  delete env.RATE_LIMITER;
  const response = await handleRequest(request(), env, { fetchImpl: providerOk });
  assert.equal(response.status, 503);
});

test("rejects excessive and duplicate submissions through the rate limiter", async () => {
  let calls = 0;
  const rateLimiter = { limit: async () => ({ success: calls++ === 0 }) };
  const env = baseEnv(rateLimiter);
  const first = await handleRequest(request(), env, { fetchImpl: providerOk });
  const duplicate = await handleRequest(request(), env, { fetchImpl: providerOk });
  assert.equal(first.status, 200);
  assert.equal(duplicate.status, 429);
});

test("does not report success when Resend rejects the request", async () => {
  const response = await handleRequest(request(), baseEnv(), async () => new Response("rejected", { status: 500 }));
  assert.equal(response.status, 502);
});
