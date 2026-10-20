import test from "node:test";
import assert from "node:assert/strict";
import { handleRequest } from "../src/index.mjs";

const origin = "https://prueba.sokatechnologies.com";
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
  website: "",
  turnstileToken: "valid-token"
};

const baseEnv = (rateLimiter = { limit: async () => ({ success: true }) }) => ({
  ALLOWED_ORIGINS: origin,
  RATE_LIMITER: rateLimiter,
  TURNSTILE_SECRET_KEY: "test-only-turnstile-secret",
  TURNSTILE_EXPECTED_HOSTNAME: "prueba.sokatechnologies.com",
  TURNSTILE_EXPECTED_ACTION: "lead",
  RESEND_API_KEY: "test-only-not-a-credential",
  RESEND_FROM_EMAIL: "SokaTechnologies <leads@example.com>",
  LEADS_TO_EMAIL: "info@sokatechnologies.com"
});

const request = (payload = validLead, headers = {}) => new Request("https://leads.example.test/api/leads", {
  method: "POST",
  headers: {
    Origin: origin,
    "Content-Type": "application/json",
    "CF-Connecting-IP": "203.0.113.8",
    "Idempotency-Key": "test-lead-001",
    ...headers
  },
  body: JSON.stringify(payload)
});

const providerOk = async (url) => {
  if (String(url).includes("turnstile/v0/siteverify")) {
    return new Response(JSON.stringify({ success: true, hostname: "prueba.sokatechnologies.com", action: "lead" }), { status: 200 });
  }
  return new Response(JSON.stringify({ id: "test-email" }), { status: 200 });
};

test("accepts a valid contact request and confirms only after provider success", async () => {
  const response = await handleRequest(request(), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, message: "Solicitud recibida" });
});

test("escapes lead content and uses the validated prospect email as Reply-To", async () => {
  let resendRequest;
  const response = await handleRequest(request({ ...validLead, name: "<script>alert(1)</script>" }), baseEnv(), {
    fetchImpl: async (url, init) => {
      if (String(url).includes("api.resend.com")) resendRequest = { url, init };
      return providerOk(url, init);
    }
  });
  const body = JSON.parse(resendRequest.init.body);
  assert.equal(response.status, 200);
  assert.equal(body.reply_to, "ana@example.com");
  assert.equal(resendRequest.init.headers["Idempotency-Key"], "test-lead-001");
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

test("requires an idempotency key before a real submission", async () => {
  const response = await handleRequest(request(validLead, { "Idempotency-Key": "" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: "idempotency_key_required" });
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

test("requires Turnstile configuration instead of sending without it", async () => {
  const env = { ...baseEnv() };
  delete env.TURNSTILE_SECRET_KEY;
  const response = await handleRequest(request(), env, { fetchImpl: providerOk });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "turnstile_not_configured" });
});

test("fails closed when Turnstile hostname or action is not configured", async () => {
  const missingHostname = { ...baseEnv() };
  delete missingHostname.TURNSTILE_EXPECTED_HOSTNAME;
  const first = await handleRequest(request(), missingHostname, { fetchImpl: providerOk });
  assert.equal(first.status, 503);

  const missingAction = { ...baseEnv() };
  delete missingAction.TURNSTILE_EXPECTED_ACTION;
  const second = await handleRequest(request(), missingAction, { fetchImpl: providerOk });
  assert.equal(second.status, 503);
});

test("requires a Turnstile token for every real submission", async () => {
  const response = await handleRequest(request({ ...validLead, turnstileToken: "" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { ok: false, error: "turnstile_required" });
});

test("rejects a successful Turnstile response for another hostname", async () => {
  const response = await handleRequest(request(), baseEnv(), {
    fetchImpl: async (url) => String(url).includes("siteverify")
      ? new Response(JSON.stringify({ success: true, hostname: "attacker.example", action: "lead" }), { status: 200 })
      : providerOk(url)
  });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { ok: false, error: "turnstile_invalid" });
});

test("rejects a successful Turnstile response for another action", async () => {
  const response = await handleRequest(request(), baseEnv(), {
    fetchImpl: async (url) => String(url).includes("siteverify")
      ? new Response(JSON.stringify({ success: true, hostname: "prueba.sokatechnologies.com", action: "other" }), { status: 200 })
      : providerOk(url)
  });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { ok: false, error: "turnstile_invalid" });
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

test("rejects requests without the Cloudflare client IP", async () => {
  const response = await handleRequest(request(validLead, { "CF-Connecting-IP": "" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, error: "client_ip_unavailable" });
});

test("rate limit cannot be bypassed by changing the unverified email", async () => {
  const keys = [];
  const rateLimiter = {
    limit: async ({ key }) => {
      keys.push(key);
      return { success: keys.length === 1 };
    }
  };
  const headers = { "CF-Connecting-IP": "203.0.113.8" };
  const first = await handleRequest(request(validLead, headers), baseEnv(rateLimiter), { fetchImpl: providerOk });
  const second = await handleRequest(
    request({ ...validLead, email: "other@example.com" }, headers),
    baseEnv(rateLimiter),
    { fetchImpl: providerOk }
  );
  assert.equal(first.status, 200);
  assert.equal(second.status, 429);
  assert.deepEqual(keys, ["lead:203.0.113.8", "lead:203.0.113.8"]);
});

test("does not report success when Resend rejects the request", async () => {
  const response = await handleRequest(request(), baseEnv(), {
    fetchImpl: async (url) => String(url).includes("siteverify")
      ? providerOk(url)
      : new Response("rejected", { status: 500 })
  });
  assert.equal(response.status, 502);
});

test("returns a controlled error when Turnstile verification has a network failure", async () => {
  const response = await handleRequest(request(), baseEnv(), {
    fetchImpl: async (url) => {
      if (String(url).includes("siteverify")) throw new Error("timeout");
      return providerOk(url);
    }
  });
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { ok: false, error: "turnstile_invalid" });
});

test("returns a controlled error when Resend has a network failure", async () => {
  const response = await handleRequest(request(), baseEnv(), {
    fetchImpl: async (url) => {
      if (String(url).includes("siteverify")) return providerOk(url);
      throw new Error("timeout");
    }
  });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { ok: false, error: "provider_error" });
});

test("rejects a route different from the lead endpoint", async () => {
  const wrongRoute = new Request("https://leads.example.test/api/other", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.8", "Idempotency-Key": "test-lead-001" },
    body: JSON.stringify(validLead)
  });
  const response = await handleRequest(wrongRoute, baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { ok: false, error: "not_found" });
});

test("rejects unsupported content types and oversized requests before parsing", async () => {
  const unsupported = await handleRequest(request(validLead, { "Content-Type": "text/plain" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(unsupported.status, 415);

  const oversized = await handleRequest(request(validLead, { "Content-Length": "40000" }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(oversized.status, 413);
});

test("accepts the documented form-urlencoded contract", async () => {
  const response = await handleRequest(new Request("https://leads.example.test/api/leads", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/x-www-form-urlencoded",
      "CF-Connecting-IP": "203.0.113.9",
      "Idempotency-Key": "test-form-urlencoded-001"
    },
    body: new URLSearchParams(Object.entries(validLead))
  }), baseEnv(), { fetchImpl: providerOk });
  assert.equal(response.status, 200);
});
