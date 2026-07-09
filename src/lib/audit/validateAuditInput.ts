import { assessAuditUrlSafety } from "./urlSafety";
import type { AuditRequest, AuditValidationIssue, AuditValidationResult, SanitizedAuditRequest } from "./types";

type RawAuditInput = Partial<Record<keyof AuditRequest, unknown>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHATSAPP_PATTERN = /^[+()\-\s\d]{7,30}$/;
const MAX_WEBSITE_URL_LENGTH = 200;

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const toOptionalText = (value: unknown) => {
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : undefined;
};

const toConsentBoolean = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "si", "sí", "on"].includes(normalized);
  }

  return false;
};

const pushRequiredIssue = (issues: AuditValidationIssue[], field: AuditValidationIssue["field"], label: string) => {
  issues.push({
    field,
    code: "required",
    message: `${label} es obligatorio.`
  });
};

export const validateAuditInput = (rawInput: RawAuditInput): AuditValidationResult => {
  const issues: AuditValidationIssue[] = [];

  const websiteUrl = normalizeText(rawInput.websiteUrl);
  const name = normalizeText(rawInput.name);
  const company = normalizeText(rawInput.company);
  const email = normalizeText(rawInput.email);
  const whatsapp = toOptionalText(rawInput.whatsapp);
  const country = normalizeText(rawInput.country);
  const companyType = normalizeText(rawInput.companyType);
  const mainProblem = normalizeText(rawInput.mainProblem);
  const consent = toConsentBoolean(rawInput.consent);

  if (!websiteUrl) pushRequiredIssue(issues, "websiteUrl", "La URL del sitio");
  if (!name) pushRequiredIssue(issues, "name", "El nombre");
  if (!company) pushRequiredIssue(issues, "company", "La empresa");
  if (!email) pushRequiredIssue(issues, "email", "El email");
  if (!country) pushRequiredIssue(issues, "country", "El país");
  if (!companyType) pushRequiredIssue(issues, "companyType", "El tipo de empresa");
  if (!mainProblem) pushRequiredIssue(issues, "mainProblem", "El principal problema");

  if (websiteUrl && websiteUrl.length > MAX_WEBSITE_URL_LENGTH) {
    issues.push({
      field: "websiteUrl",
      code: "invalid-length",
      message: `La URL del sitio no debe superar ${MAX_WEBSITE_URL_LENGTH} caracteres.`
    });
  }

  if (name && (name.length < 2 || name.length > 80)) {
    issues.push({
      field: "name",
      code: "invalid-length",
      message: "El nombre debe tener entre 2 y 80 caracteres."
    });
  }

  if (company && (company.length < 2 || company.length > 120)) {
    issues.push({
      field: "company",
      code: "invalid-length",
      message: "La empresa debe tener entre 2 y 120 caracteres."
    });
  }

  if (email && (!EMAIL_PATTERN.test(email) || email.length > 120)) {
    issues.push({
      field: "email",
      code: "invalid-email",
      message: "El email no tiene un formato válido."
    });
  }

  if (whatsapp && !WHATSAPP_PATTERN.test(whatsapp)) {
    issues.push({
      field: "whatsapp",
      code: "invalid-whatsapp",
      message: "El WhatsApp opcional debe contener solo dígitos y caracteres telefónicos válidos."
    });
  }

  if (country && country.length > 80) {
    issues.push({
      field: "country",
      code: "invalid-length",
      message: "El país no debe superar 80 caracteres."
    });
  }

  if (companyType && companyType.length > 80) {
    issues.push({
      field: "companyType",
      code: "invalid-length",
      message: "El tipo de empresa no debe superar 80 caracteres."
    });
  }

  if (mainProblem && (mainProblem.length < 30 || mainProblem.length > 1200)) {
    issues.push({
      field: "mainProblem",
      code: "invalid-length",
      message: "El principal problema debe tener entre 30 y 1200 caracteres."
    });
  }

  if (!consent) {
    issues.push({
      field: "consent",
      code: "missing-consent",
      message: "Debes aceptar el consentimiento de contacto para continuar."
    });
  }

  const safeUrl = assessAuditUrlSafety(websiteUrl);

  if (!safeUrl.safe) {
    issues.push({
      field: "websiteUrl",
      code: safeUrl.code,
      message: safeUrl.reason
    });
  }

  if (issues.length > 0) {
    return {
      ok: false,
      issues
    };
  }

  if (!safeUrl.safe) {
    return {
      ok: false,
      issues: [
        {
          field: "websiteUrl",
          code: safeUrl.code,
          message: safeUrl.reason
        }
      ]
    };
  }

  const sanitized: SanitizedAuditRequest = {
    websiteUrl,
    name,
    company,
    email: email.toLowerCase(),
    whatsapp,
    country,
    companyType,
    mainProblem,
    consent,
    normalizedWebsiteUrl: safeUrl.normalizedUrl,
    websiteHostname: safeUrl.hostname,
    websiteProtocol: safeUrl.protocol
  };

  return {
    ok: true,
    data: sanitized,
    issues: []
  };
};
