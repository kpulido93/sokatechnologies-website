import { auditProductSlugs, getProductBySlug } from "../../data/products";
import { auditServiceSlugs, getServiceBySlug } from "../../data/services";
import { buildAuditScoreCard, detectAuditSignals, isAreaUnderThreshold } from "./scoring";
import type { RecommendationContext, SokaRecommendation, SokaRecommendationType } from "./types";

const requireService = (slug: string) => {
  const service = getServiceBySlug(slug);

  if (!service) {
    throw new Error(`Missing service content for audit recommendation slug "${slug}".`);
  }

  return service;
};

const requireProduct = (slug: string) => {
  const product = getProductBySlug(slug);

  if (!product) {
    throw new Error(`Missing product content for audit recommendation slug "${slug}".`);
  }

  return product;
};

const websitesService = requireService(auditServiceSlugs.corporateWebsite);
const automationService = requireService(auditServiceSlugs.automation);
const dashboardService = requireService(auditServiceSlugs.dashboard);
const infrastructureService = requireService(auditServiceSlugs.infrastructure);
const supportService = requireService(auditServiceSlugs.support);
const portikProduct = requireProduct(auditProductSlugs.portik);
const autoInventarioProduct = requireProduct(auditProductSlugs.autoinventario);
const autoWhatsappProduct = requireProduct(auditProductSlugs.autowhatsapp);

const RECOMMENDATION_LIBRARY: Record<SokaRecommendationType, Omit<SokaRecommendation, "priority" | "rationale">> = {
  "corporate-website": {
    type: "corporate-website",
    title: websitesService.title,
    summary:
      "Conviene revisar estructura, propuesta de valor, señales de confianza y puntos de contacto cuando la presencia digital no ayuda a explicar bien la oferta.",
    ctaLabel: websitesService.ctaLabel,
    ctaHref: websitesService.ctaHref,
    relatedAreas: ["clarity", "conversion", "trust"],
    tags: ["web", "claridad", "confianza"]
  },
  "web-optimization": {
    type: "web-optimization",
    title: "Optimización web y recorrido de conversión",
    summary:
      "Si la experiencia inicial se siente pesada o el CTA no acompaña bien el recorrido, conviene priorizar optimización visible y rediseño del flujo comercial.",
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    relatedAreas: ["performance", "conversion", "trust"],
    tags: ["performance", "conversion", "ux"]
  },
  "basic-seo": {
    type: "basic-seo",
    title: "SEO básico y arquitectura pública más ordenada",
    summary:
      "Cuando la visibilidad orgánica depende de una base frágil, conviene ordenar semántica, jerarquía de páginas y entendimiento básico por parte de buscadores.",
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    relatedAreas: ["seo", "clarity"],
    tags: ["seo", "estructura", "contenido"]
  },
  automation: {
    type: "automation",
    title: automationService.title,
    summary:
      "Si el caso revela tareas repetitivas, handoff manual o confirmaciones fuera de sistema, puede convenir automatizar antes de seguir sumando pasos manuales.",
    ctaLabel: automationService.ctaLabel,
    ctaHref: automationService.ctaHref,
    relatedAreas: ["automation", "conversion"],
    tags: ["automatizacion", "flujo", "seguimiento"]
  },
  dashboard: {
    type: "dashboard",
    title: dashboardService.title,
    summary:
      "Cuando la conversación gira alrededor de reportes dispersos o baja visibilidad, lo útil suele ser definir indicadores y un panel más legible para decidir mejor.",
    ctaLabel: dashboardService.ctaLabel,
    ctaHref: dashboardService.ctaHref,
    relatedAreas: ["automation", "conversion"],
    tags: ["dashboard", "reporting", "kpi"]
  },
  infrastructure: {
    type: "infrastructure",
    title: infrastructureService.title,
    summary:
      "Si hay señales de lentitud, continuidad frágil, backups inciertos o base técnica poco clara, conviene revisar infraestructura y soporte antes de escalar el resto.",
    ctaLabel: infrastructureService.ctaLabel,
    ctaHref: infrastructureService.ctaHref,
    relatedAreas: ["infrastructure", "performance", "trust"],
    tags: ["infraestructura", "backups", "continuidad"]
  },
  support: {
    type: "support",
    title: supportService.title,
    summary:
      "Cuando el problema no es solo construir, sino sostener y evolucionar una base existente, puede tener más sentido una ruta de soporte y mejora continua.",
    ctaLabel: supportService.ctaLabel,
    ctaHref: supportService.ctaHref,
    relatedAreas: ["infrastructure", "trust"],
    tags: ["soporte", "mantenimiento", "continuidad"]
  },
  portik: {
    type: "portik",
    title: portikProduct.title,
    summary:
      "Si el contexto apunta a portería, visitantes, reservas o administración residencial, puede ser razonable evaluar un piloto controlado antes de pensar en un desarrollo más amplio.",
    ctaLabel: portikProduct.primaryCtaLabel,
    ctaHref: portikProduct.primaryCtaHref,
    relatedAreas: ["automation", "trust"],
    tags: ["portik", "residencial", "piloto"]
  },
  autoinventario: {
    type: "autoinventario",
    title: autoInventarioProduct.title,
    summary:
      "Cuando el foco está en equipos Windows, activos TI o visibilidad técnica para soporte, puede evaluarse una revisión controlada alrededor de AutoInventario.",
    ctaLabel: autoInventarioProduct.primaryCtaLabel,
    ctaHref: autoInventarioProduct.primaryCtaHref,
    relatedAreas: ["infrastructure", "automation"],
    tags: ["autoinventario", "windows", "itsm"]
  },
  autowhatsapp: {
    type: "autowhatsapp",
    title: autoWhatsappProduct.title,
    summary:
      "Si el caso habla de recordatorios o confirmaciones a contactos existentes, puede revisarse un uso operativo consentido y de bajo volumen, nunca campañas masivas.",
    ctaLabel: autoWhatsappProduct.primaryCtaLabel,
    ctaHref: autoWhatsappProduct.primaryCtaHref,
    relatedAreas: ["automation", "trust"],
    tags: ["autowhatsapp", "consentimiento", "operacion"]
  },
  diagnostic: {
    type: "diagnostic",
    title: "Diagnóstico consultivo",
    summary:
      "Cuando aparecen varias fricciones a la vez o la información todavía es ambigua, lo más prudente es priorizar un diagnóstico corto antes de definir solución.",
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    relatedAreas: ["clarity", "automation", "infrastructure"],
    tags: ["diagnostico", "priorizacion", "alcance"]
  }
};

const normalizedText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const containsAny = (value: string, keywords: string[]) => {
  const normalized = normalizedText(value);
  return keywords.some((keyword) => normalized.includes(normalizedText(keyword)));
};

const addRecommendation = (
  map: Map<SokaRecommendationType, { priority: number; rationale: string }>,
  type: SokaRecommendationType,
  priority: number,
  rationale: string
) => {
  const existing = map.get(type);

  if (!existing || priority > existing.priority) {
    map.set(type, { priority, rationale });
  }
};

export const buildSokaRecommendations = ({
  request,
  findings = [],
  areaScores,
  leadFitScore
}: RecommendationContext): SokaRecommendation[] => {
  const scoreCard = buildAuditScoreCard(findings, request);
  const resolvedAreaScores = areaScores
    ? {
        seo: areaScores.seo ?? scoreCard.areaScores.seo,
        performance: areaScores.performance ?? scoreCard.areaScores.performance,
        clarity: areaScores.clarity ?? scoreCard.areaScores.clarity,
        conversion: areaScores.conversion ?? scoreCard.areaScores.conversion,
        trust: areaScores.trust ?? scoreCard.areaScores.trust,
        automation: areaScores.automation ?? scoreCard.areaScores.automation,
        infrastructure: areaScores.infrastructure ?? scoreCard.areaScores.infrastructure
      }
    : scoreCard.areaScores;
  const resolvedLeadFitScore = leadFitScore ?? scoreCard.leadFitScore;
  const lowAreaCount = Object.values(resolvedAreaScores).filter((score) => score < 78).length;
  const selected = new Map<SokaRecommendationType, { priority: number; rationale: string }>();
  const signals = detectAuditSignals(request, findings);
  const combinedText = `${request.companyType} ${request.company} ${request.mainProblem}`;

  if (
    isAreaUnderThreshold(resolvedAreaScores.performance, 80) ||
    (signals.conversionFriction && isAreaUnderThreshold(resolvedAreaScores.conversion, 80))
  ) {
    addRecommendation(
      selected,
      "web-optimization",
      94,
      "La experiencia inicial y el recorrido hacia el contacto sugieren revisar performance visible y claridad del CTA antes de pedir más tráfico."
    );
  }

  if (
    isAreaUnderThreshold(resolvedAreaScores.clarity) ||
    isAreaUnderThreshold(resolvedAreaScores.trust) ||
    (signals.websiteClarity && signals.conversionFriction)
  ) {
    addRecommendation(
      selected,
      "corporate-website",
      91,
      "La señal principal apunta a ordenar mensaje, estructura de páginas y puntos de contacto para que la oferta se entienda con más rapidez."
    );
  }

  if (
    isAreaUnderThreshold(resolvedAreaScores.seo) ||
    containsAny(combinedText, ["seo", "visibilidad", "google", "buscadores", "indexacion", "indexación"])
  ) {
    addRecommendation(
      selected,
      "basic-seo",
      86,
      "Hay indicios de que la estructura pública todavía no ayuda lo suficiente a visibilidad orgánica y entendimiento básico por parte de buscadores."
    );
  }

  if (signals.automation || isAreaUnderThreshold(resolvedAreaScores.automation)) {
    addRecommendation(
      selected,
      "automation",
      88,
      "El caso sugiere trabajo manual, confirmaciones aisladas o handoff operativo que podría simplificarse con reglas y automatización."
    );
  }

  if (
    signals.reporting ||
    containsAny(combinedText, ["dashboard", "reporte", "reportes", "kpi", "indicadores", "metricas", "métricas"]) ||
    (isAreaUnderThreshold(resolvedAreaScores.automation, 78) && isAreaUnderThreshold(resolvedAreaScores.conversion, 78))
  ) {
    addRecommendation(
      selected,
      "dashboard",
      82,
      "La conversación parece necesitar más visibilidad operativa o gerencial, no solo cambios estéticos en la web."
    );
  }

  if (
    signals.infrastructure ||
    isAreaUnderThreshold(resolvedAreaScores.infrastructure) ||
    isAreaUnderThreshold(resolvedAreaScores.performance, 72)
  ) {
    addRecommendation(
      selected,
      "infrastructure",
      87,
      "Hay señales de continuidad, rendimiento o base técnica que conviene revisar para reducir fragilidad visible y operativa."
    );
  }

  if (
    signals.support ||
    findings.some((finding) => finding.area === "trust" || finding.area === "infrastructure") ||
    containsAny(combinedText, ["soporte", "mantenimiento", "continuidad", "backlog", "incidencias"])
  ) {
    addRecommendation(
      selected,
      "support",
      74,
      "Además de cambios puntuales, el caso sugiere necesidad de seguimiento posterior y una ruta más estable de mantenimiento."
    );
  }

  if (signals.portik) {
    addRecommendation(
      selected,
      "portik",
      96,
      "El contexto se parece a un flujo residencial de portería o administración donde un piloto de Portik puede ser más útil que un desarrollo genérico."
    );
  }

  if (signals.autoinventario) {
    addRecommendation(
      selected,
      "autoinventario",
      89,
      "La necesidad parece técnica y ligada a activos Windows o visibilidad de infraestructura, por lo que conviene evaluar AutoInventario de forma controlada."
    );
    addRecommendation(
      selected,
      "infrastructure",
      84,
      "La conversación también apunta a inventario técnico, soporte e infraestructura, no solo a una herramienta aislada."
    );
  }

  if (signals.autowhatsapp) {
    addRecommendation(
      selected,
      "autowhatsapp",
      81,
      "Puede existir un caso de recordatorios o confirmaciones operativas, siempre bajo consentimiento verificable, contactos existentes y bajo volumen."
    );
  }

  if (signals.unsafeAutowhatsapp) {
    addRecommendation(
      selected,
      "diagnostic",
      90,
      "El uso descrito para mensajería requiere revisión comercial y de cumplimiento antes de proponer cualquier herramienta, especialmente si se acerca a spam o campañas masivas."
    );
  }

  if (selected.size === 0 || lowAreaCount >= 4 || resolvedLeadFitScore < 45) {
    addRecommendation(
      selected,
      "diagnostic",
      76,
      "La señal actual sugiere que conviene priorizar un diagnóstico corto para decidir si la ruta correcta es web, automatización, reporting o infraestructura."
    );
  }

  return Array.from(selected.entries())
    .sort((left, right) => right[1].priority - left[1].priority)
    .slice(0, 4)
    .map(([type, selection]) => ({
      ...RECOMMENDATION_LIBRARY[type],
      priority: selection.priority + Math.round(resolvedLeadFitScore / 25),
      rationale: selection.rationale
    }));
};
