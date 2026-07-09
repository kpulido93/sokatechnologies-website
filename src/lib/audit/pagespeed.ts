import type {
  PageSpeedAuditResult,
  PageSpeedCategoryKey,
  PageSpeedFieldSource,
  PageSpeedMetricKey,
  PageSpeedMetricRating,
  PageSpeedMetricSummary,
  PageSpeedSummary
} from "./types";
import { assessAuditUrlSafety } from "./urlSafety";

const PAGESPEED_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_STRATEGY = "mobile";
const CATEGORY_KEYS: PageSpeedCategoryKey[] = ["performance", "accessibility", "best-practices", "seo"];

type PageSpeedStrategy = "mobile" | "desktop";

type RunPageSpeedAuditOptions = {
  apiKey?: string;
  strategy?: PageSpeedStrategy;
  locale?: string;
  timeoutMs?: number;
};

type GooglePageSpeedMetric = {
  percentile?: number;
  category?: string;
};

type GooglePageSpeedResponse = {
  id?: string;
  loadingExperience?: {
    metrics?: Record<string, GooglePageSpeedMetric | undefined>;
  };
  originLoadingExperience?: {
    metrics?: Record<string, GooglePageSpeedMetric | undefined>;
  };
  lighthouseResult?: {
    finalDisplayedUrl?: string;
    categories?: Partial<Record<PageSpeedCategoryKey, { score?: number | null } | undefined>>;
    audits?: Record<string, { displayValue?: string | null } | undefined>;
  };
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

const METRIC_DEFINITIONS: Record<
  PageSpeedMetricKey,
  {
    metricId: string;
    auditId: string;
    label: string;
    unit: "ms" | "score";
  }
> = {
  fcp: {
    metricId: "FIRST_CONTENTFUL_PAINT_MS",
    auditId: "first-contentful-paint",
    label: "First Contentful Paint",
    unit: "ms"
  },
  lcp: {
    metricId: "LARGEST_CONTENTFUL_PAINT_MS",
    auditId: "largest-contentful-paint",
    label: "Largest Contentful Paint",
    unit: "ms"
  },
  cls: {
    metricId: "CUMULATIVE_LAYOUT_SHIFT_SCORE",
    auditId: "cumulative-layout-shift",
    label: "Cumulative Layout Shift",
    unit: "score"
  },
  inp: {
    metricId: "INTERACTION_TO_NEXT_PAINT",
    auditId: "interaction-to-next-paint",
    label: "Interaction to Next Paint",
    unit: "ms"
  },
  ttfb: {
    metricId: "EXPERIMENTAL_TIME_TO_FIRST_BYTE",
    auditId: "server-response-time",
    label: "Time to First Byte",
    unit: "ms"
  }
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeCategoryScore = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value * 100))) : null;

const mapFieldCategoryToRating = (value: string | undefined): PageSpeedMetricRating => {
  const normalized = value?.toUpperCase();

  if (normalized === "FAST") return "good";
  if (normalized === "AVERAGE") return "needs-improvement";
  if (normalized === "SLOW") return "poor";

  return "unknown";
};

const toFieldSource = (pageMetric?: GooglePageSpeedMetric, originMetric?: GooglePageSpeedMetric): PageSpeedFieldSource => {
  if (pageMetric?.percentile != null) return "page";
  if (originMetric?.percentile != null) return "origin";
  return "none";
};

const buildMetricSummary = (
  key: PageSpeedMetricKey,
  response: GooglePageSpeedResponse
): PageSpeedMetricSummary => {
  const definition = METRIC_DEFINITIONS[key];
  const pageMetric = response.loadingExperience?.metrics?.[definition.metricId];
  const originMetric = response.originLoadingExperience?.metrics?.[definition.metricId];
  const metric = pageMetric?.percentile != null ? pageMetric : originMetric;
  const displayValue = response.lighthouseResult?.audits?.[definition.auditId]?.displayValue ?? null;
  const source = toFieldSource(pageMetric, originMetric);

  return {
    key,
    label: definition.label,
    percentile: typeof metric?.percentile === "number" ? metric.percentile : null,
    displayValue,
    rating: mapFieldCategoryToRating(metric?.category),
    unit: definition.unit,
    source
  };
};

const getFieldSource = (metrics: Record<PageSpeedMetricKey, PageSpeedMetricSummary>): PageSpeedFieldSource => {
  const sources = new Set(Object.values(metrics).map((metric) => metric.source).filter((source) => source !== "none"));

  if (sources.has("page")) return "page";
  if (sources.has("origin")) return "origin";
  return "none";
};

const getWorstMetricRating = (ratings: PageSpeedMetricRating[]): PageSpeedMetricRating => {
  if (ratings.includes("poor")) return "poor";
  if (ratings.includes("needs-improvement")) return "needs-improvement";
  if (ratings.includes("good")) return "good";
  return "unknown";
};

const buildBusinessHighlights = (summary: Omit<PageSpeedSummary, "businessSummary" | "businessHighlights">) => {
  const highlights: string[] = [];
  const { categories, metrics, coreWebVitalsAssessment, fieldSource } = summary;

  if (categories.performance != null) {
    if (categories.performance < 50) {
      highlights.push("La primera impresión móvil puede sentirse lenta y afectar confianza, permanencia y generación de contacto.");
    } else if (categories.performance < 80) {
      highlights.push("Hay margen claro para acelerar la experiencia inicial y reducir fricción antes del CTA.");
    }
  }

  if (categories.accessibility != null && categories.accessibility < 90) {
    highlights.push("La accesibilidad pública puede estar introduciendo fricción en lectura, comprensión o completado de formularios.");
  }

  if (categories.seo != null && categories.seo < 90) {
    highlights.push("La visibilidad orgánica podría estar limitada por señales técnicas básicas que sí conviene ordenar.");
  }

  if (categories["best-practices"] != null && categories["best-practices"] < 90) {
    highlights.push("La base técnica pública muestra señales que conviene endurecer para reducir riesgo operativo y deuda visible.");
  }

  if (coreWebVitalsAssessment === "poor") {
    highlights.push("Las métricas de experiencia real disponibles sugieren una sensación de lentitud o inestabilidad difícil de justificar comercialmente.");
  } else if (coreWebVitalsAssessment === "needs-improvement") {
    highlights.push("Las métricas reales disponibles todavía dejan espacio para mejorar percepción y continuidad de uso.");
  }

  if (fieldSource === "origin") {
    highlights.push("La lectura de experiencia real proviene del dominio completo, no necesariamente de la URL exacta evaluada.");
  }

  if (metrics.ttfb.rating === "poor") {
    highlights.push("El tiempo de respuesta inicial sugiere revisar hosting, caché o configuración de infraestructura visible.");
  }

  return highlights;
};

const buildBusinessSummary = (summary: Omit<PageSpeedSummary, "businessSummary" | "businessHighlights">, highlights: string[]) => {
  const performanceScore = summary.categories.performance;
  const seoScore = summary.categories.seo;

  if (performanceScore != null && performanceScore < 50) {
    return "PageSpeed detecta una experiencia inicial débil que puede perjudicar percepción, confianza y tasa de contacto.";
  }

  if (summary.coreWebVitalsAssessment === "poor") {
    return "Las métricas reales disponibles apuntan a una experiencia inestable o lenta, con impacto probable en conversión y credibilidad.";
  }

  if (seoScore != null && seoScore < 90) {
    return "PageSpeed sugiere que la estructura pública todavía no ayuda lo suficiente a visibilidad, comprensión y recorrido comercial.";
  }

  return highlights[0] ?? "PageSpeed aporta una lectura técnica complementaria para priorizar mejor el siguiente frente de trabajo.";
};

const buildSummary = (
  requestedUrl: string,
  strategy: PageSpeedStrategy,
  response: GooglePageSpeedResponse
): PageSpeedSummary => {
  const categories = {
    performance: normalizeCategoryScore(response.lighthouseResult?.categories?.performance?.score),
    accessibility: normalizeCategoryScore(response.lighthouseResult?.categories?.accessibility?.score),
    "best-practices": normalizeCategoryScore(response.lighthouseResult?.categories?.["best-practices"]?.score),
    seo: normalizeCategoryScore(response.lighthouseResult?.categories?.seo?.score)
  } satisfies Record<PageSpeedCategoryKey, number | null>;

  const metrics = {
    fcp: buildMetricSummary("fcp", response),
    lcp: buildMetricSummary("lcp", response),
    cls: buildMetricSummary("cls", response),
    inp: buildMetricSummary("inp", response),
    ttfb: buildMetricSummary("ttfb", response)
  } satisfies Record<PageSpeedMetricKey, PageSpeedMetricSummary>;

  const coreWebVitalsAssessment = getWorstMetricRating([metrics.lcp.rating, metrics.inp.rating, metrics.cls.rating]);
  const fieldSource = getFieldSource(metrics);

  const partialSummary = {
    requestedUrl,
    finalUrl: response.lighthouseResult?.finalDisplayedUrl || response.id || requestedUrl,
    strategy,
    categories,
    metrics,
    fieldSource,
    coreWebVitalsAssessment
  };

  const businessHighlights = buildBusinessHighlights(partialSummary);

  return {
    ...partialSummary,
    businessSummary: buildBusinessSummary(partialSummary, businessHighlights),
    businessHighlights
  };
};

export const runPageSpeedAudit = async (
  rawUrl: string,
  options: RunPageSpeedAuditOptions = {}
): Promise<PageSpeedAuditResult> => {
  const safeUrl = assessAuditUrlSafety(rawUrl);

  if (!safeUrl.safe) {
    return {
      ok: false,
      source: "google-pagespeed",
      error: {
        code: "not-public-url",
        message: "PageSpeed solo puede ejecutarse sobre URLs públicas accesibles por internet.",
        retryable: false
      }
    };
  }

  const strategy = options.strategy ?? DEFAULT_STRATEGY;
  const locale = options.locale ?? "es-419";
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const searchParams = new URLSearchParams({
    url: safeUrl.normalizedUrl,
    strategy,
    locale
  });

  CATEGORY_KEYS.forEach((category) => {
    searchParams.append("category", category);
  });

  if (options.apiKey?.trim()) {
    searchParams.set("key", options.apiKey.trim());
  }

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${PAGESPEED_ENDPOINT}?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    let payload: unknown = null;

    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    const apiPayload = isPlainObject(payload) ? (payload as GooglePageSpeedResponse) : null;

    if (!response.ok) {
      const apiMessage =
        apiPayload?.error?.message ??
        `Google PageSpeed respondió con estado ${response.status} y no entregó un cuerpo interpretable.`;

      if (response.status === 429) {
        return {
          ok: false,
          source: "google-pagespeed",
          error: {
            code: "rate-limited",
            message:
              "Google PageSpeed rechazó la consulta por límite de cuota o rate limit. El reporte continuará con reglas locales.",
            status: 429,
            retryable: true
          }
        };
      }

      return {
        ok: false,
        source: "google-pagespeed",
        error: {
          code: "google-api-error",
          message: `Google PageSpeed no pudo completar la auditoría: ${apiMessage}`,
          status: response.status,
          retryable: response.status >= 500
        }
      };
    }

    if (!apiPayload?.lighthouseResult?.categories) {
      return {
        ok: false,
        source: "google-pagespeed",
        error: {
          code: "invalid-response",
          message:
            "Google PageSpeed devolvió una respuesta incompleta y no fue posible extraer scores confiables.",
          retryable: true
        }
      };
    }

    const summary = buildSummary(safeUrl.normalizedUrl, strategy, apiPayload);

    return {
      ok: true,
      source: "google-pagespeed",
      summary
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        source: "google-pagespeed",
        error: {
          code: "timeout",
          message: "Google PageSpeed tardó demasiado en responder y la auditoría continuó con reglas locales.",
          retryable: true
        }
      };
    }

    return {
      ok: false,
      source: "google-pagespeed",
      error: {
        code: "network-error",
        message: "No fue posible contactar Google PageSpeed en este momento. El reporte continuará con reglas locales.",
        retryable: true
      }
    };
  } finally {
    clearTimeout(timeoutHandle);
  }
};
