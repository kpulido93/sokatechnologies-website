import {
  escapeHtml,
  InputError,
  isAllowedOrigin,
  isValidEmail,
  normalizeLead,
  parseAllowedOrigins,
  parseIdempotencyKey,
  parseRequestBody
} from "./validation.mjs";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_URL = "https://api.resend.com/emails";
const APPROVED_RECIPIENT = "info@sokatechnologies.com";

const jsonResponse = (body, status, origin, allowedOrigins) => {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    Vary: "Origin"
  });
  if (isAllowedOrigin(origin, allowedOrigins)) headers.set("Access-Control-Allow-Origin", origin);
  return new Response(JSON.stringify(body), { status, headers });
};

const corsResponse = (origin, allowedOrigins) => {
  if (!isAllowedOrigin(origin, allowedOrigins)) return jsonResponse({ ok: false, error: "origin_not_allowed" }, 403, origin, allowedOrigins);
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "600",
      Vary: "Origin"
    }
  });
};

const parseFromAddress = (value) => {
  if (typeof value !== "string" || /[\r\n]/.test(value)) return "";
  const match = value.match(/<([^<>]+)>/);
  return (match ? match[1] : value).trim().toLowerCase();
};

const hasEmailConfiguration = (env) => {
  const from = parseFromAddress(env.RESEND_FROM_EMAIL);
  return Boolean(
    typeof env.RESEND_API_KEY === "string" &&
      env.RESEND_API_KEY.trim() &&
      isValidEmail(from) &&
      String(env.LEADS_TO_EMAIL || "").trim().toLowerCase() === APPROVED_RECIPIENT
  );
};

const getTurnstileConfiguration = (env) => {
  const secret = typeof env.TURNSTILE_SECRET_KEY === "string" ? env.TURNSTILE_SECRET_KEY.trim() : "";
  const hostname = typeof env.TURNSTILE_EXPECTED_HOSTNAME === "string" ? env.TURNSTILE_EXPECTED_HOSTNAME.trim().toLowerCase() : "";
  const action = typeof env.TURNSTILE_EXPECTED_ACTION === "string" ? env.TURNSTILE_EXPECTED_ACTION.trim() : "";
  if (!secret || !hostname || !action) return null;
  return { secret, hostname, action };
};

const getClientIp = (request) => {
  const ip = request.headers.get("CF-Connecting-IP")?.trim() || "";
  return /^[^\s\r\n]{1,128}$/.test(ip) ? ip : "";
};

const rateLimit = async (env, key) => {
  if (!env.RATE_LIMITER || typeof env.RATE_LIMITER.limit !== "function") return "not_configured";
  try {
    const result = await env.RATE_LIMITER.limit({ key });
    if (typeof result?.success !== "boolean") return "not_configured";
    return result.success ? "allowed" : "blocked";
  } catch {
    return "not_configured";
  }
};

const verifyTurnstile = async (config, token, clientIp, fetchImpl) => {
  const body = new URLSearchParams({ secret: config.secret, response: token });
  if (clientIp) body.set("remoteip", clientIp);
  try {
    const response = await fetchImpl(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!response.ok) return false;
    const result = await response.json();
    return Boolean(
      result?.success === true &&
        typeof result.hostname === "string" &&
        result.hostname.trim().toLowerCase() === config.hostname &&
        result.action === config.action
    );
  } catch {
    return false;
  }
};

const leadRows = (lead) => [
  ["Tipo de solicitud", lead.formType],
  ["Nombre", lead.name],
  ["Empresa", lead.company],
  ["Correo", lead.email],
  ["Teléfono", lead.phone || "No indicado"],
  ["País", lead.country || "No indicado"],
  ["Servicio", lead.service || "No indicado"],
  ["Tipo de problema", lead.problemType || "No indicado"],
  ["Descripción", lead.summary]
];

const renderHtml = (lead) => {
  const rows = leadRows(lead)
    .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value).replaceAll("\n", "<br>")}</dd>`)
    .join("");
  return `<h1>Nueva solicitud B2B</h1><dl>${rows}</dl>`;
};

const renderText = (lead) => leadRows(lead).map(([label, value]) => `${label}: ${value}`).join("\n");

const sendLead = async (env, lead, idempotencyKey, fetchImpl) => {
  if (!hasEmailConfiguration(env)) throw new Error("email_not_configured");

  const response = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [APPROVED_RECIPIENT],
      reply_to: lead.email,
      subject: `Nueva solicitud ${lead.formType === "diagnostico" ? "de diagnóstico" : "de contacto"}`,
      html: renderHtml(lead),
      text: renderText(lead)
    })
  });

  if (!response.ok) throw new Error("email_provider_rejected");
};

export async function handleRequest(request, env = {}, dependencies = {}) {
  const fetchImpl = dependencies.fetchImpl || fetch;
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const { pathname } = new URL(request.url);

  if (pathname !== "/api/leads") return jsonResponse({ ok: false, error: "not_found" }, 404, origin, allowedOrigins);
  if (request.method === "OPTIONS") return corsResponse(origin, allowedOrigins);
  if (request.method !== "POST") return jsonResponse({ ok: false, error: "method_not_allowed" }, 405, origin, allowedOrigins);
  if (!isAllowedOrigin(origin, allowedOrigins)) return jsonResponse({ ok: false, error: "origin_not_allowed" }, 403, origin, allowedOrigins);

  try {
    const idempotencyKey = parseIdempotencyKey(request.headers.get("Idempotency-Key"));
    const clientIp = getClientIp(request);
    if (!clientIp) return jsonResponse({ ok: false, error: "client_ip_unavailable" }, 503, origin, allowedOrigins);
    // The bucket must not be reset by choosing a different unverified email address.
    const rateResult = await rateLimit(env, `lead:${clientIp}`);

    if (rateResult === "not_configured") return jsonResponse({ ok: false, error: "rate_limit_not_configured" }, 503, origin, allowedOrigins);
    if (rateResult === "blocked") return jsonResponse({ ok: false, error: "rate_limited" }, 429, origin, allowedOrigins);

    const lead = normalizeLead(await parseRequestBody(request));
    const turnstile = getTurnstileConfiguration(env);
    if (!turnstile) return jsonResponse({ ok: false, error: "turnstile_not_configured" }, 503, origin, allowedOrigins);
    if (!lead.turnstileToken) return jsonResponse({ ok: false, error: "turnstile_required" }, 400, origin, allowedOrigins);
    if (!(await verifyTurnstile(turnstile, lead.turnstileToken, clientIp, fetchImpl))) {
      return jsonResponse({ ok: false, error: "turnstile_invalid" }, 403, origin, allowedOrigins);
    }

    await sendLead(env, lead, idempotencyKey, fetchImpl);
    return jsonResponse({ ok: true, message: "Solicitud recibida" }, 200, origin, allowedOrigins);
  } catch (error) {
    if (error instanceof InputError) return jsonResponse({ ok: false, error: error.code }, error.status, origin, allowedOrigins);
    if (error instanceof Error && error.message === "email_not_configured") {
      return jsonResponse({ ok: false, error: "email_not_configured" }, 503, origin, allowedOrigins);
    }
    return jsonResponse({ ok: false, error: "provider_error" }, 502, origin, allowedOrigins);
  }
}

export default { fetch: handleRequest };
