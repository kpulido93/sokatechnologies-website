import type { AuditReport, SanitizedAuditRequest } from "./types";

export type AuditLeadProvider =
  | "none"
  | "resend-email"
  | "supabase"
  | "airtable"
  | "google-apps-script"
  | "cloudflare-d1"
  | "custom-api";

export type AuditLeadRecord = {
  request: SanitizedAuditRequest;
  report: Pick<AuditReport, "summary" | "scoreCard" | "recommendations" | "pagespeed">;
  submittedAt: string;
  sourcePath: "/auditoria";
  tags: string[];
};

export type LeadStorageConfig = {
  provider: AuditLeadProvider;
  rateLimitMax: number;
  rateLimitWindowSeconds: number;
  resendFromEmail?: string;
  leadsToEmail?: string;
  supabaseUrl?: string;
  supabaseTable?: string;
  airtableBaseId?: string;
  airtableTableName?: string;
  googleAppsScriptUrl?: string;
  cloudflareD1DatabaseId?: string;
  customApiUrl?: string;
};

export type LeadStorageResult =
  | {
      ok: true;
      provider: AuditLeadProvider;
      mode: "stub";
      message: string;
    }
  | {
      ok: false;
      provider: AuditLeadProvider;
      mode: "stub";
      message: string;
      retryable: boolean;
    };

export type LeadStorageAdapter = {
  config: LeadStorageConfig;
  storeLead: (lead: AuditLeadRecord) => Promise<LeadStorageResult>;
};

const toPositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const createLeadStorageConfig = (env: ImportMetaEnv = import.meta.env): LeadStorageConfig => ({
  provider: env.AUDIT_LEAD_PROVIDER ?? "none",
  rateLimitMax: toPositiveInteger(env.AUDIT_RATE_LIMIT_MAX, 5),
  rateLimitWindowSeconds: toPositiveInteger(env.AUDIT_RATE_LIMIT_WINDOW_SECONDS, 60),
  resendFromEmail: env.RESEND_FROM_EMAIL?.trim(),
  leadsToEmail: env.LEADS_TO_EMAIL?.trim(),
  supabaseUrl: env.SUPABASE_URL?.trim(),
  supabaseTable: env.SUPABASE_AUDIT_LEADS_TABLE?.trim() || "audit_leads",
  airtableBaseId: env.AIRTABLE_BASE_ID?.trim(),
  airtableTableName: env.AIRTABLE_TABLE_NAME?.trim() || "Audit Leads",
  googleAppsScriptUrl: env.GOOGLE_APPS_SCRIPT_AUDIT_WEBHOOK_URL?.trim(),
  cloudflareD1DatabaseId: env.CLOUDFLARE_D1_DATABASE_ID?.trim(),
  customApiUrl: env.CUSTOM_AUDIT_API_URL?.trim()
});

const buildStubMessage = (provider: AuditLeadProvider) => {
  switch (provider) {
    case "resend-email":
      return "La estrategia MVP recomienda notificar por email server-side con Resend antes de persistir en una base de datos.";
    case "supabase":
      return "Supabase es la opción recomendada para persistencia posterior, pero todavía no debe conectarse sin secretos y runtime aprobado.";
    case "airtable":
      return "Airtable es válido para operación liviana, pero no debe activarse desde el repo sin token server-side.";
    case "google-apps-script":
      return "Google Apps Script puede servir como puente simple, pero requiere webhook y controles server-side fuera del repo.";
    case "cloudflare-d1":
      return "Cloudflare D1 conviene solo si el despliegue final ya depende de Cloudflare Workers.";
    case "custom-api":
      return "Una API propia es la ruta más flexible a largo plazo, pero no debe cablearse todavía.";
    default:
      return "La captura de leads sigue en modo documental. Aun no se almacenan datos personales desde este repositorio.";
  }
};

export const createLeadStorageAdapter = (config: LeadStorageConfig = createLeadStorageConfig()): LeadStorageAdapter => ({
  config,
  async storeLead(_lead) {
    return {
      ok: false,
      provider: config.provider,
      mode: "stub",
      message: buildStubMessage(config.provider),
      retryable: false
    };
  }
});

