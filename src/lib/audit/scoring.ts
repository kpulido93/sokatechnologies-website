import type {
  AuditAreaKey,
  AuditFinding,
  PageSpeedSummary,
  AuditRequest,
  AuditScoreCard,
  AuditSeverity,
  LeadFitLabel,
  SanitizedAuditRequest
} from "./types";

const AREA_BASE_SCORE = 100;

export const AREA_WEIGHTS: Record<AuditAreaKey, number> = {
  seo: 0.13,
  performance: 0.11,
  clarity: 0.2,
  conversion: 0.18,
  trust: 0.14,
  automation: 0.12,
  infrastructure: 0.12
};

const LOW_AREA_THRESHOLD = 70;
const HIGH_AREA_THRESHOLD = 85;

const KEYWORD_GROUPS = {
  corporateWebsite: [
    "web",
    "sitio",
    "landing",
    "pagina",
    "página",
    "claridad",
    "conversion",
    "conversión",
    "cta",
    "contacto",
    "formulario",
    "mensaje"
  ],
  conversion: ["cta", "contacto", "lead", "leads", "formulario", "cotizacion", "cotización", "agendar"],
  automation: ["manual", "automat", "seguimiento", "flujo", "repetitivo", "integracion", "integración", "formulario"],
  dashboard: ["dashboard", "reporte", "reportes", "kpi", "indicador", "indicadores", "metric", "datos"],
  infrastructure: [
    "infraestructura",
    "hosting",
    "servidor",
    "soporte",
    "caida",
    "caída",
    "ssl",
    "continuidad",
    "lento",
    "backup",
    "backups",
    "monitoreo"
  ],
  support: ["soporte", "mantenimiento", "incidencia", "incidencias", "backlog", "continuidad", "mejora continua"],
  portik: ["condominio", "residencial", "porteria", "portería", "visitantes", "vehiculos", "vehículos", "reservas"],
  autoinventario: [
    "windows",
    "activo ti",
    "activos ti",
    "inventario ti",
    "inventario de equipos",
    "parque tecnologico",
    "parque tecnológico",
    "itsm",
    "equipos windows"
  ],
  autowhatsapp: [
    "whatsapp",
    "mensajes",
    "mensajeria",
    "mensajería",
    "recordatorios",
    "confirmaciones",
    "contactos existentes",
    "opt-out",
    "consentimiento"
  ],
  autowhatsappBlocked: ["spam", "bases compradas", "campanas masivas", "campañas masivas", "apuestas", "loteria", "lotería"]
} as const;

const slugifyText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const includesKeyword = (haystack: string, keywords: readonly string[]) => {
  const normalized = slugifyText(haystack);
  return keywords.some((keyword) => normalized.includes(slugifyText(keyword)));
};

export const detectAuditSignals = (
  request: Pick<AuditRequest, "companyType" | "company" | "mainProblem">,
  findings: AuditFinding[] = []
) => {
  const combined = `${request.companyType} ${request.company} ${request.mainProblem}`;
  const findingTags = findings.flatMap((finding) => finding.tags);
  const findingText = findings.map((finding) => `${finding.title} ${finding.summary}`).join(" ");
  const searchable = `${combined} ${findingTags.join(" ")} ${findingText}`;

  return {
    websiteClarity: includesKeyword(searchable, KEYWORD_GROUPS.corporateWebsite),
    conversionFriction:
      includesKeyword(searchable, KEYWORD_GROUPS.conversion) ||
      findings.some((finding) => finding.area === "conversion"),
    automation:
      includesKeyword(searchable, KEYWORD_GROUPS.automation) ||
      findings.some((finding) => finding.area === "automation"),
    reporting:
      includesKeyword(searchable, KEYWORD_GROUPS.dashboard) ||
      findingTags.some((tag) => includesKeyword(tag, KEYWORD_GROUPS.dashboard)),
    infrastructure:
      includesKeyword(searchable, KEYWORD_GROUPS.infrastructure) ||
      findings.some((finding) => finding.area === "infrastructure"),
    support:
      includesKeyword(searchable, KEYWORD_GROUPS.support) ||
      findingTags.some((tag) => includesKeyword(tag, KEYWORD_GROUPS.support)),
    portik: includesKeyword(searchable, KEYWORD_GROUPS.portik),
    autoinventario: includesKeyword(searchable, KEYWORD_GROUPS.autoinventario),
    autowhatsapp:
      includesKeyword(searchable, KEYWORD_GROUPS.autowhatsapp) &&
      !includesKeyword(searchable, KEYWORD_GROUPS.autowhatsappBlocked),
    unsafeAutowhatsapp: includesKeyword(searchable, KEYWORD_GROUPS.autowhatsappBlocked)
  };
};

const createBaseAreaScores = (): Record<AuditAreaKey, number> => ({
  seo: AREA_BASE_SCORE,
  performance: AREA_BASE_SCORE,
  clarity: AREA_BASE_SCORE,
  conversion: AREA_BASE_SCORE,
  trust: AREA_BASE_SCORE,
  automation: AREA_BASE_SCORE,
  infrastructure: AREA_BASE_SCORE
});

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const computeLeadFitLabel = (score: number): LeadFitLabel => {
  if (score >= 75) {
    return "high";
  }

  if (score >= 50) {
    return "medium";
  }

  return "low";
};

type FindingRule = {
  id: string;
  area: AuditAreaKey;
  severity: AuditSeverity;
  scoreImpact: number;
  title: string;
  summary: string;
  evidence: string[];
  tags: string[];
  keywords: string[];
};

const FINDING_RULES: FindingRule[] = [
  {
    id: "clarity-value-proposition",
    area: "clarity",
    severity: "high",
    scoreImpact: 22,
    title: "La propuesta de valor parece difícil de entender en el primer recorrido.",
    summary:
      "Cuando el mensaje principal no explica con rapidez qué hace la empresa o para quién trabaja, la fricción comercial suele aparecer antes del contacto.",
    evidence: ["hero confuso", "mensaje débil", "oferta poco clara"],
    tags: ["claridad", "mensaje", "web"],
    keywords: ["no explica", "confuso", "claridad", "mensaje", "oferta", "sitio", "web", "landing"]
  },
  {
    id: "conversion-contact-friction",
    area: "conversion",
    severity: "high",
    scoreImpact: 20,
    title: "El recorrido hacia contacto o conversión parece tener fricción visible.",
    summary:
      "Si el problema principal apunta a pocos leads, formularios débiles o CTA ambiguos, conviene revisar conversión antes de ampliar tráfico.",
    evidence: ["pocos contactos", "cta débil", "formulario frágil"],
    tags: ["conversion", "cta", "contacto"],
    keywords: ["conversion", "conversión", "contacto", "leads", "cta", "formulario", "pocos contactos"]
  },
  {
    id: "seo-structure-basics",
    area: "seo",
    severity: "medium",
    scoreImpact: 14,
    title: "Hay señales de SEO básico y estructura pública que conviene ordenar.",
    summary:
      "Cuando el sitio tiene problemas de visibilidad o jerarquía, suele hacer falta revisar títulos, estructura y entendimiento básico por parte de buscadores.",
    evidence: ["visibilidad débil", "seo básico", "estructura pública"],
    tags: ["seo", "indexabilidad", "estructura"],
    keywords: ["seo", "google", "visibilidad", "buscadores", "indexacion", "indexación"]
  },
  {
    id: "performance-first-impression",
    area: "performance",
    severity: "medium",
    scoreImpact: 15,
    title: "La carga aparente o el primer recorrido podrían estar afectando la percepción inicial.",
    summary:
      "Si el sitio se siente lento o pesado, la primera impresión comercial y la continuidad técnica visible suelen deteriorarse al mismo tiempo.",
    evidence: ["sitio lento", "primer scroll pesado", "carga aparente"],
    tags: ["velocidad", "performance", "ux"],
    keywords: ["lento", "velocidad", "carga", "performance", "pesado"]
  },
  {
    id: "automation-manual-follow-up",
    area: "automation",
    severity: "high",
    scoreImpact: 21,
    title: "El caso sugiere seguimiento o handoff demasiado manual alrededor del sitio.",
    summary:
      "Cuando el problema declarado habla de tareas repetitivas, confirmaciones manuales o procesos desconectados, conviene explorar automatización e integración.",
    evidence: ["seguimiento manual", "tareas repetitivas", "flujo desconectado"],
    tags: ["automatizacion", "flujo", "operacion"],
    keywords: ["manual", "automat", "seguimiento", "repetitivo", "flujo", "integracion", "integración"]
  },
  {
    id: "dashboard-visibility-gap",
    area: "automation",
    severity: "medium",
    scoreImpact: 12,
    title: "Falta visibilidad operativa clara sobre solicitudes o desempeño.",
    summary:
      "Si la conversación gira alrededor de reportes, KPIs o falta de visibilidad, la web puede ser solo un síntoma de una necesidad mayor de reporting.",
    evidence: ["reportes manuales", "sin KPIs", "datos dispersos"],
    tags: ["dashboard", "reporting", "kpi"],
    keywords: ["dashboard", "reporte", "reportes", "kpi", "indicadores", "metricas", "métricas", "datos"]
  },
  {
    id: "trust-signals-weak",
    area: "trust",
    severity: "medium",
    scoreImpact: 13,
    title: "El sitio podría no estar transmitiendo suficiente confianza visible.",
    summary:
      "Cuando el problema principal es percepción, credibilidad o desactualización, conviene reforzar señales públicas de confianza y continuidad.",
    evidence: ["sitio desactualizado", "confianza débil", "presencia poco sólida"],
    tags: ["trust", "credibilidad", "presencia"],
    keywords: ["confianza", "desactualizado", "credibilidad", "presencia", "poco confiable"]
  },
  {
    id: "infrastructure-continuity-risk",
    area: "infrastructure",
    severity: "high",
    scoreImpact: 19,
    title: "La base técnica o la continuidad visible parecen frágiles.",
    summary:
      "Si el caso menciona hosting, soporte, caídas o infraestructura, conviene revisar continuidad antes de ampliar cambios de contenido o campañas.",
    evidence: ["hosting inestable", "soporte débil", "continuidad técnica"],
    tags: ["infraestructura", "soporte", "continuidad"],
    keywords: ["infraestructura", "hosting", "servidor", "caida", "caída", "ssl", "soporte", "continuidad"]
  }
];

const createFinding = (rule: FindingRule): AuditFinding => ({
  id: rule.id,
  area: rule.area,
  severity: rule.severity,
  title: rule.title,
  summary: rule.summary,
  evidence: rule.evidence,
  scoreImpact: rule.scoreImpact,
  publicOnly: true,
  tags: rule.tags
});

export const buildInitialAuditFindings = (request: SanitizedAuditRequest): AuditFinding[] => {
  const combined = `${request.companyType} ${request.mainProblem} ${request.websiteHostname}`;
  const findings = FINDING_RULES.filter((rule) => includesKeyword(combined, rule.keywords)).map(createFinding);

  if (includesKeyword(combined, KEYWORD_GROUPS.portik)) {
    findings.push({
      id: "residential-operational-context",
      area: "automation",
      severity: "medium",
      title: "El contexto apunta a un flujo residencial con control operativo visible.",
      summary:
        "Cuando el caso menciona visitantes, portería, reservas o administración residencial, puede existir un encaje natural con una solución más acotada como Portik.",
      evidence: ["contexto residencial", "portería", "visitantes o reservas"],
      scoreImpact: 10,
      publicOnly: true,
      tags: ["portik", "residencial", "operacion"]
    });
  }

  if (includesKeyword(combined, KEYWORD_GROUPS.autoinventario)) {
    findings.push({
      id: "windows-asset-visibility",
      area: "infrastructure",
      severity: "medium",
      title: "El caso sugiere necesidad de visibilidad técnica sobre activos Windows.",
      summary:
        "Cuando la operación menciona inventario de equipos, activos TI o entornos Windows, puede convenir evaluar una ruta más técnica de soporte e inventario controlado.",
      evidence: ["activos TI", "equipos Windows", "inventario técnico"],
      scoreImpact: 11,
      publicOnly: true,
      tags: ["autoinventario", "windows", "infraestructura"]
    });
  }

  if (includesKeyword(combined, KEYWORD_GROUPS.autowhatsapp) && !includesKeyword(combined, KEYWORD_GROUPS.autowhatsappBlocked)) {
    findings.push({
      id: "consented-operational-messaging",
      area: "automation",
      severity: "medium",
      title: "El caso apunta a mensajería operativa que debería evaluarse con límites claros.",
      summary:
        "Si el flujo depende de recordatorios o confirmaciones a contactos existentes, conviene revisar automatización y cumplimiento antes de tratarlo como marketing masivo.",
      evidence: ["mensajes operativos", "consentimiento", "confirmaciones o recordatorios"],
      scoreImpact: 10,
      publicOnly: true,
      tags: ["autowhatsapp", "mensajeria", "consentimiento"]
    });
  }

  if (findings.length === 0) {
    findings.push({
      id: "manual-review-needed",
      area: "clarity",
      severity: "low",
      title: "Hace falta una lectura manual más fina del sitio para priorizar correctamente.",
      summary:
        "La información inicial sugiere oportunidad de mejora, pero no alcanza por sí sola para atribuir el problema a una sola área sin revisión visual directa.",
      evidence: ["brief inicial", "sitio público por revisar"],
      scoreImpact: 8,
      publicOnly: true,
      tags: ["revision-inicial", "claridad"]
    });
  }

  return findings.filter(
    (finding, index, allFindings) => allFindings.findIndex((candidate) => candidate.id === finding.id) === index
  );
};

const createPageSpeedFinding = (
  id: string,
  area: AuditAreaKey,
  severity: AuditSeverity,
  title: string,
  summary: string,
  scoreImpact: number,
  tags: string[],
  evidence: string[]
): AuditFinding => ({
  id,
  area,
  severity,
  title,
  summary,
  evidence,
  scoreImpact,
  publicOnly: true,
  tags
});

export const buildPageSpeedFindings = (summary: PageSpeedSummary): AuditFinding[] => {
  const findings: AuditFinding[] = [];

  if (summary.categories.performance != null && summary.categories.performance < 80) {
    const severity: AuditSeverity = summary.categories.performance < 50 ? "high" : "medium";

    findings.push(
      createPageSpeedFinding(
        "psi-performance-score",
        "performance",
        severity,
        "PageSpeed sugiere fricción técnica visible en el primer recorrido.",
        "Una experiencia inicial lenta o pesada puede reducir confianza, lectura efectiva y probabilidad de contacto antes del CTA principal.",
        severity === "high" ? 18 : 11,
        ["pagespeed", "performance", "mobile"],
        [`score performance: ${summary.categories.performance}/100`, summary.businessSummary]
      )
    );
  }

  if (summary.categories.accessibility != null && summary.categories.accessibility < 90) {
    const severity: AuditSeverity = summary.categories.accessibility < 70 ? "high" : "medium";

    findings.push(
      createPageSpeedFinding(
        "psi-accessibility-score",
        "conversion",
        severity,
        "La accesibilidad pública puede estar frenando comprensión y avance del usuario.",
        "Barreras de contraste, foco, lectura o estructura suelen afectar formularios, claridad percibida y continuidad del recorrido comercial.",
        severity === "high" ? 16 : 9,
        ["pagespeed", "accessibility", "ux"],
        [`score accessibility: ${summary.categories.accessibility}/100`]
      )
    );
  }

  if (summary.categories.seo != null && summary.categories.seo < 90) {
    findings.push(
      createPageSpeedFinding(
        "psi-seo-score",
        "seo",
        summary.categories.seo < 70 ? "high" : "medium",
        "PageSpeed detecta señales técnicas de SEO que conviene ordenar.",
        "Cuando la estructura pública no ayuda lo suficiente a buscadores, el sitio pierde capacidad de ser entendido y encontrado con menos fricción.",
        summary.categories.seo < 70 ? 16 : 10,
        ["pagespeed", "seo", "indexabilidad"],
        [`score seo: ${summary.categories.seo}/100`]
      )
    );
  }

  if (summary.categories["best-practices"] != null && summary.categories["best-practices"] < 90) {
    findings.push(
      createPageSpeedFinding(
        "psi-best-practices-score",
        "infrastructure",
        summary.categories["best-practices"] < 70 ? "high" : "medium",
        "La base técnica pública muestra señales de endurecimiento pendiente.",
        "Buenas prácticas técnicas débiles suelen traducirse en deuda visible, riesgo operativo y menor confianza en la continuidad del sitio.",
        summary.categories["best-practices"] < 70 ? 16 : 10,
        ["pagespeed", "best-practices", "infraestructura"],
        [`score best-practices: ${summary.categories["best-practices"]}/100`]
      )
    );
  }

  if (summary.coreWebVitalsAssessment === "poor" || summary.coreWebVitalsAssessment === "needs-improvement") {
    const severity: AuditSeverity = summary.coreWebVitalsAssessment === "poor" ? "high" : "medium";

    findings.push(
      createPageSpeedFinding(
        "psi-core-web-vitals",
        "performance",
        severity,
        "Las señales reales disponibles no muestran una experiencia consistente.",
        "Cuando LCP, INP o CLS quedan por debajo de lo esperado, la sensación para el usuario suele ser de lentitud, inestabilidad o respuesta tardía.",
        severity === "high" ? 17 : 10,
        ["pagespeed", "core-web-vitals", summary.fieldSource],
        [
          `LCP: ${summary.metrics.lcp.displayValue ?? "sin dato"}`,
          `INP: ${summary.metrics.inp.displayValue ?? "sin dato"}`,
          `CLS: ${summary.metrics.cls.displayValue ?? "sin dato"}`
        ]
      )
    );
  }

  if (summary.metrics.ttfb.rating === "poor") {
    findings.push(
      createPageSpeedFinding(
        "psi-ttfb",
        "infrastructure",
        "medium",
        "El tiempo de respuesta inicial apunta a revisar infraestructura visible.",
        "Una respuesta inicial lenta suele trasladarse a percepción de sitio pesado y a menor margen para que el resto del recorrido compense.",
        9,
        ["pagespeed", "ttfb", "hosting"],
        [`TTFB: ${summary.metrics.ttfb.displayValue ?? "sin dato"}`]
      )
    );
  }

  return findings.filter(
    (finding, index, allFindings) => allFindings.findIndex((candidate) => candidate.id === finding.id) === index
  );
};

export const scoreAuditFindings = (findings: AuditFinding[] = []) => {
  const areaScores = createBaseAreaScores();

  findings.forEach((finding) => {
    const impact = Math.max(0, finding.scoreImpact);
    areaScores[finding.area] = clampScore(areaScores[finding.area] - impact);
  });

  return areaScores;
};

export const scoreSokaLeadFit = (request: Pick<AuditRequest, "companyType" | "mainProblem">) => {
  let score = 35;
  const combined = `${request.companyType} ${request.mainProblem}`;

  if (includesKeyword(combined, KEYWORD_GROUPS.corporateWebsite)) score += 12;
  if (includesKeyword(combined, KEYWORD_GROUPS.automation)) score += 14;
  if (includesKeyword(combined, KEYWORD_GROUPS.dashboard)) score += 12;
  if (includesKeyword(combined, KEYWORD_GROUPS.infrastructure)) score += 12;
  if (includesKeyword(combined, KEYWORD_GROUPS.portik)) score += 15;

  if (
    request.companyType === "Servicios B2B" ||
    request.companyType === "Tecnología o SaaS" ||
    request.companyType === "Inmobiliaria o administración"
  ) {
    score += 8;
  }

  const leadFitScore = clampScore(score);

  return {
    leadFitScore,
    leadFitLabel: computeLeadFitLabel(leadFitScore)
  };
};

export const buildAuditScoreCard = (
  findings: AuditFinding[] = [],
  request?: Pick<AuditRequest, "companyType" | "mainProblem">
): AuditScoreCard => {
  const areaScores = scoreAuditFindings(findings);
  const weightedTotal = (Object.keys(areaScores) as AuditAreaKey[]).reduce((total, area) => {
    return total + areaScores[area] * AREA_WEIGHTS[area];
  }, 0);

  const dominantAreas = (Object.keys(areaScores) as AuditAreaKey[])
    .sort((left, right) => areaScores[left] - areaScores[right])
    .filter((area, index) => index < 3 && areaScores[area] < HIGH_AREA_THRESHOLD);

  const leadFit = request
    ? scoreSokaLeadFit(request)
    : {
        leadFitScore: 50,
        leadFitLabel: "medium" as LeadFitLabel
      };

  return {
    overallScore: clampScore(weightedTotal),
    areaScores,
    leadFitScore: leadFit.leadFitScore,
    leadFitLabel: leadFit.leadFitLabel,
    dominantAreas: dominantAreas.length > 0 ? dominantAreas : ["clarity"]
  };
};

export const isAreaUnderThreshold = (score: number, threshold: number = LOW_AREA_THRESHOLD) => score < threshold;
