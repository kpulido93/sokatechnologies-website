export type AuditAreaKey =
  | "seo"
  | "performance"
  | "clarity"
  | "conversion"
  | "trust"
  | "automation"
  | "infrastructure";

export type AuditSeverity = "low" | "medium" | "high";

export type AuditCompanyType =
  | "Servicios B2B"
  | "Industria o manufactura"
  | "Salud o educación privada"
  | "Tecnología o SaaS"
  | "Inmobiliaria o administración"
  | "Retail o comercio"
  | "Otra";

export type SokaRecommendationType =
  | "corporate-website"
  | "web-optimization"
  | "basic-seo"
  | "automation"
  | "dashboard"
  | "infrastructure"
  | "support"
  | "portik"
  | "autoinventario"
  | "autowhatsapp"
  | "diagnostic";

export type AuditValidationField =
  | "websiteUrl"
  | "name"
  | "company"
  | "email"
  | "whatsapp"
  | "country"
  | "companyType"
  | "mainProblem"
  | "consent"
  | "form";

export type UrlSafetyCode =
  | "empty"
  | "invalid-url"
  | "unsupported-protocol"
  | "blocked-url-credentials"
  | "blocked-localhost"
  | "blocked-private-ip"
  | "blocked-metadata-ip"
  | "blocked-internal-host";

export type AuditRequest = {
  websiteUrl: string;
  name: string;
  company: string;
  email: string;
  whatsapp?: string;
  country: string;
  companyType: AuditCompanyType | string;
  mainProblem: string;
  consent: boolean;
};

export type SanitizedAuditRequest = AuditRequest & {
  normalizedWebsiteUrl: string;
  websiteHostname: string;
  websiteProtocol: "http:" | "https:";
};

export type AuditFinding = {
  id: string;
  area: AuditAreaKey;
  severity: AuditSeverity;
  title: string;
  summary: string;
  evidence?: string[];
  scoreImpact: number;
  publicOnly: boolean;
  tags: string[];
};

export type SokaRecommendation = {
  type: SokaRecommendationType;
  title: string;
  summary: string;
  rationale: string;
  priority: number;
  ctaLabel: string;
  ctaHref: string;
  relatedAreas: AuditAreaKey[];
  tags: string[];
};

export type LeadFitLabel = "low" | "medium" | "high";

export type AuditScoreCard = {
  overallScore: number;
  areaScores: Record<AuditAreaKey, number>;
  leadFitScore: number;
  leadFitLabel: LeadFitLabel;
  dominantAreas: AuditAreaKey[];
};

export type PageSpeedCategoryKey = "performance" | "accessibility" | "best-practices" | "seo";

export type PageSpeedMetricKey = "fcp" | "lcp" | "cls" | "inp" | "ttfb";

export type PageSpeedMetricRating = "good" | "needs-improvement" | "poor" | "unknown";

export type PageSpeedFieldSource = "page" | "origin" | "none";

export type PageSpeedMetricSummary = {
  key: PageSpeedMetricKey;
  label: string;
  percentile: number | null;
  displayValue: string | null;
  rating: PageSpeedMetricRating;
  unit: "ms" | "score";
  source: PageSpeedFieldSource;
};

export type PageSpeedSummary = {
  requestedUrl: string;
  finalUrl: string;
  strategy: "mobile" | "desktop";
  categories: Record<PageSpeedCategoryKey, number | null>;
  metrics: Record<PageSpeedMetricKey, PageSpeedMetricSummary>;
  fieldSource: PageSpeedFieldSource;
  coreWebVitalsAssessment: PageSpeedMetricRating;
  businessSummary: string;
  businessHighlights: string[];
};

export type PageSpeedErrorCode =
  | "not-public-url"
  | "timeout"
  | "rate-limited"
  | "google-api-error"
  | "invalid-response"
  | "network-error";

export type PageSpeedSuccess = {
  ok: true;
  source: "google-pagespeed";
  summary: PageSpeedSummary;
};

export type PageSpeedFailure = {
  ok: false;
  source: "google-pagespeed";
  error: {
    code: PageSpeedErrorCode;
    message: string;
    status?: number;
    retryable: boolean;
  };
};

export type PageSpeedAuditResult = PageSpeedSuccess | PageSpeedFailure;

export type AuditReport = {
  request: SanitizedAuditRequest;
  createdAt: string;
  summary: string;
  findings: AuditFinding[];
  scoreCard: AuditScoreCard;
  recommendations: SokaRecommendation[];
  pagespeed?: PageSpeedSummary | null;
};

export type AuditValidationIssue = {
  field: AuditValidationField;
  code: string;
  message: string;
};

export type AuditValidationSuccess = {
  ok: true;
  data: SanitizedAuditRequest;
  issues: [];
};

export type AuditValidationFailure = {
  ok: false;
  data?: undefined;
  issues: AuditValidationIssue[];
};

export type AuditValidationResult = AuditValidationSuccess | AuditValidationFailure;

export type UrlSafetyResult =
  | {
      safe: true;
      normalizedUrl: string;
      hostname: string;
      protocol: "http:" | "https:";
    }
  | {
      safe: false;
      code: UrlSafetyCode;
      reason: string;
    };

export type RecommendationContext = {
  request: SanitizedAuditRequest;
  findings?: AuditFinding[];
  areaScores?: Partial<Record<AuditAreaKey, number>>;
  leadFitScore?: number;
};
