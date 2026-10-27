export const SERVICE_OPTIONS = Object.freeze([
  "Software a medida",
  "Automatizaciones e integraciones",
  "Power BI y Business Intelligence",
  "Consultoría TI y DevOps",
  "Infraestructura cloud/on-prem",
  "Sitios web corporativos",
  "Soporte, mantenimiento y mejora continua"
]);

export const PROBLEM_TYPES = Object.freeze([
  "manual",
  "reporting",
  "infra",
  "web"
]);

const FORM_TYPES = new Set(["contact", "diagnostico"]);
const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9._~:/-]{1,256}$/;
const MAX_BODY_BYTES = 32 * 1024;

export class InputError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.name = "InputError";
    this.code = code;
    this.status = status;
  }
}

const text = (value, maxLength) => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") throw new InputError("invalid_field_type");
  const result = value.trim();
  if (result.length > maxLength) throw new InputError("field_too_long");
  return result;
};

const isConsentGiven = (value) => value === true || ["true", "1", "on"].includes(String(value).toLowerCase());

export const isValidEmail = (value) => value.length <= 254 && EMAIL_PATTERN.test(value);

export function normalizeLead(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new InputError("invalid_payload");

  const formType = text(input.formType, 20);
  const name = text(input.name, 80);
  const company = text(input.company, 120);
  const email = text(input.email, 254).toLowerCase();
  const phone = text(input.phone, 40);
  const country = text(input.country, 80);
  const service = text(input.service, 80);
  const problemType = text(input.problemType, 30);
  const summary = text(input.summary, 1200);
  const formContext = text(input.formContext, 120);
  const noticeVersion = text(input.noticeVersion, 80);
  const authorizationVersion = text(input.authorizationVersion, 80);
  const authorizationHash = text(input.authorizationHash, 128);
  const website = text(input.website, 120);
  const turnstileToken = text(input.turnstileToken || input["cf-turnstile-response"], 2048);

  if (!FORM_TYPES.has(formType)) throw new InputError("invalid_form_type");
  if (name.length < 2 || company.length < 2 || summary.length < 30) throw new InputError("required_field_missing");
  if (!isValidEmail(email)) throw new InputError("invalid_email");
  if (!isConsentGiven(input.consent)) throw new InputError("consent_required");
  if (website) throw new InputError("spam_detected");
  if (service && !SERVICE_OPTIONS.includes(service)) throw new InputError("invalid_service");
  if (problemType && !PROBLEM_TYPES.includes(problemType)) throw new InputError("invalid_problem_type");

  return Object.freeze({
    formType,
    formContext,
    name,
    company,
    email,
    phone,
    country,
    service,
    problemType,
    summary,
    noticeVersion,
    authorizationVersion,
    authorizationHash,
    consent: true,
    turnstileToken
  });
}

export async function parseRequestBody(request) {
  const contentType = (request.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (!["application/json", "application/x-www-form-urlencoded"].includes(contentType)) {
    throw new InputError("unsupported_content_type", 415);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)) {
    throw new InputError("payload_too_large", 413);
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) throw new InputError("payload_too_large", 413);

  if (contentType === "application/json") {
    try {
      return JSON.parse(body);
    } catch {
      throw new InputError("invalid_json");
    }
  }

  return Object.fromEntries(new URLSearchParams(body).entries());
}

export function parseAllowedOrigins(value = "") {
  return new Set(
    String(value)
      .split(",")
      .map((origin) => origin.trim())
      .filter((origin) => {
        if (!origin || origin === "*") return false;
        try {
          const url = new URL(origin);
          return ["http:", "https:"].includes(url.protocol) && url.origin === origin;
        } catch {
          return false;
        }
      })
  );
}

export function isAllowedOrigin(origin, allowedOrigins) {
  return Boolean(origin) && allowedOrigins.has(origin);
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function parseIdempotencyKey(value) {
  const key = typeof value === "string" ? value.trim() : "";
  if (!IDEMPOTENCY_KEY_PATTERN.test(key)) throw new InputError("idempotency_key_required");
  return key;
}

export { MAX_BODY_BYTES };
