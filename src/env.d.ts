/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly CONTACT_EMAIL?: string;
  readonly ANALYTICS_PROVIDER?: string;
  readonly ANALYTICS_ID?: string;
  readonly PUBLIC_FORM_PROVIDER?: "demo" | "formspree" | "netlify" | "worker" | "api";
  readonly PUBLIC_CONTACT_FORM_ENDPOINT?: string;
  readonly PUBLIC_CONTACT_FALLBACK_EMAIL?: string;
  readonly PUBLIC_CONTACT_WHATSAPP_URL?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM_EMAIL?: string;
  readonly LEADS_TO_EMAIL?: string;
  readonly AUDIT_LEAD_PROVIDER?:
    | "none"
    | "resend-email"
    | "supabase"
    | "airtable"
    | "google-apps-script"
    | "cloudflare-d1"
    | "custom-api";
  readonly AUDIT_RATE_LIMIT_MAX?: string;
  readonly AUDIT_RATE_LIMIT_WINDOW_SECONDS?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly SUPABASE_AUDIT_LEADS_TABLE?: string;
  readonly AIRTABLE_TOKEN?: string;
  readonly AIRTABLE_BASE_ID?: string;
  readonly AIRTABLE_TABLE_NAME?: string;
  readonly GOOGLE_APPS_SCRIPT_AUDIT_WEBHOOK_URL?: string;
  readonly CLOUDFLARE_D1_DATABASE_ID?: string;
  readonly CUSTOM_AUDIT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
