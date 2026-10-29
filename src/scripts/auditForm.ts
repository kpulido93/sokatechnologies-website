import { buildSokaRecommendations } from "../lib/audit/recommendations";
import { buildAuditScoreCard, buildInitialAuditFindings } from "../lib/audit/scoring";
import type {
  AuditAreaKey,
  AuditFinding,
  AuditReport,
  AuditSeverity,
  AuditValidationIssue,
  PageSpeedCategoryKey,
  SanitizedAuditRequest,
  SokaRecommendation
} from "../lib/audit/types";
import { validateAuditInput } from "../lib/audit/validateAuditInput";
import { clearFieldError, clearFormFieldErrors, isFormControl, setFieldError } from "./formFieldErrors";

type AuditApiSuccess = {
  ok: true;
  report: AuditReport;
};

type AuditApiError = {
  ok: false;
  endpoint?: string;
  message?: string;
  mode?: string;
  error?: {
    code?: string;
    message?: string;
    issues?: AuditValidationIssue[];
  };
};

type AuditApiResponse = AuditApiSuccess | AuditApiError;

const AREA_LABELS: Record<AuditAreaKey, string> = {
  seo: "SEO básico",
  performance: "Performance",
  clarity: "Claridad comercial",
  conversion: "Conversión",
  trust: "Confianza",
  automation: "Automatización",
  infrastructure: "Infraestructura"
};

const SEVERITY_LABELS: Record<AuditSeverity, string> = {
  low: "Atención baja",
  medium: "Atención media",
  high: "Atención alta"
};

const PAGESPEED_CATEGORY_LABELS: Record<PageSpeedCategoryKey, string> = {
  performance: "Performance",
  accessibility: "Accesibilidad",
  "best-practices": "Buenas prácticas",
  seo: "SEO técnico"
};

const DEMO_FINDING_TOPICS: Record<string, string> = {
  "clarity-value-proposition": "claridad del mensaje y la propuesta de valor",
  "conversion-contact-friction": "recorrido hacia contacto y conversión",
  "seo-structure-basics": "visibilidad y estructura pública",
  "performance-first-impression": "carga percibida y primer recorrido",
  "automation-manual-follow-up": "seguimiento y handoff operativo",
  "dashboard-visibility-gap": "visibilidad operativa y reportes",
  "trust-signals-weak": "señales públicas de confianza",
  "infrastructure-continuity-risk": "continuidad técnica y soporte",
  "residential-operational-context": "operación residencial y control operativo",
  "windows-asset-visibility": "visibilidad de activos Windows",
  "consented-operational-messaging": "mensajería operativa consentida",
  "manual-review-needed": "claridad del contexto y siguiente paso"
};

const toDemoFinding = (finding: AuditFinding): AuditFinding => {
  const topic = DEMO_FINDING_TOPICS[finding.id] ?? "el contexto compartido y el siguiente paso";

  return {
    ...finding,
    title: `Tema por explorar: ${topic}.`,
    summary:
      `Tus respuestas apuntan a explorar ${topic}. Es una hipótesis para conversar y validar; la simulación no observa ni confirma un problema en la web.`,
    evidence: ["Respuestas del formulario", "Hipótesis por validar"]
  };
};

const toDemoRecommendation = (recommendation: SokaRecommendation): SokaRecommendation => ({
  ...recommendation,
  summary: `Tema para conversar: ${recommendation.summary}`,
  rationale: `Hipótesis derivada de tus respuestas: ${recommendation.rationale}`
});

const buildDemoReportSummary = (report: Pick<AuditReport, "findings" | "scoreCard" | "recommendations">) => {
  const dominantArea = report.scoreCard.dominantAreas[0] ?? "clarity";
  const highestPriorityRecommendation = report.recommendations[0];

  const firstSentence =
    report.findings.length > 0
      ? report.findings[0]?.summary
      : "Tus respuestas sugieren una oportunidad de mejora que conviene conversar con más contexto.";

  const secondSentence = highestPriorityRecommendation
    ? `Como orientación, la ruta sugerida apunta primero a ${highestPriorityRecommendation.title.toLowerCase()}.`
    : "El siguiente paso posible es un diagnóstico consultivo.";

  return `Simulación local basada en tus respuestas. El tema principal considerado es ${AREA_LABELS[dominantArea]}. ${firstSentence} ${secondSentence}`;
};

const buildLocalAuditReport = (request: SanitizedAuditRequest): AuditReport => {
  const findings = buildInitialAuditFindings(request).map(toDemoFinding);
  const scoreCard = buildAuditScoreCard(findings, request);
  const recommendations = buildSokaRecommendations({
    request,
    findings,
    areaScores: scoreCard.areaScores,
    leadFitScore: scoreCard.leadFitScore
  }).map(toDemoRecommendation);

  return {
    request,
    createdAt: new Date().toISOString(),
    summary: buildDemoReportSummary({ findings, scoreCard, recommendations }),
    findings,
    scoreCard,
    recommendations
  };
};

const setVisibility = (element: HTMLElement | null, visible: boolean) => {
  if (!element) return;
  element.hidden = !visible;
};

const clearElement = (element: HTMLElement | null) => {
  if (!element) return;
  element.replaceChildren();
};

const toPayload = (form: HTMLFormElement) => {
  const formData = new FormData(form);

  return {
    websiteUrl: String(formData.get("websiteUrl") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    companyType: String(formData.get("companyType") ?? "").trim(),
    mainProblem: String(formData.get("mainProblem") ?? "").trim(),
    consent: formData.get("consent") !== null
  };
};

const readJson = async (response: Response): Promise<AuditApiResponse | null> => {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as AuditApiResponse;
  } catch {
    return null;
  }
};

const createTagRow = (values: string[]) => {
  const row = document.createElement("div");
  row.className = "audit-pill-row";

  values.forEach((value) => {
    const pill = document.createElement("span");
    pill.className = "audit-pill";
    pill.textContent = value;
    row.append(pill);
  });

  return row;
};

const createAreaItem = ({
  title,
  detail,
  value,
  sourceLabel
}: {
  title: string;
  detail: string;
  value?: string;
  sourceLabel: string;
}) => {
  const item = document.createElement("li");
  item.className = "audit-area-item";

  const titleNode = document.createElement("strong");
  titleNode.className = "audit-area-title";
  titleNode.textContent = title;

  const detailNode = document.createElement("p");
  detailNode.className = "catalog-status";
  detailNode.textContent = detail;

  const footer = document.createElement("div");
  footer.className = "audit-area-footer";

  const sourcePill = document.createElement("span");
  sourcePill.className = "audit-pill";
  sourcePill.textContent = sourceLabel;
  footer.append(sourcePill);

  if (value) {
    const valueNode = document.createElement("strong");
    valueNode.className = "audit-area-value";
    valueNode.textContent = value;
    footer.append(valueNode);
  }

  item.append(titleNode, detailNode, footer);
  return item;
};

const createFindingItem = (finding: AuditFinding) => {
  const item = document.createElement("li");
  item.className = "audit-result-item";

  const title = document.createElement("strong");
  title.className = "audit-result-title";
  title.textContent = finding.title;

  const summary = document.createElement("p");
  summary.className = "catalog-status";
  summary.textContent = finding.summary;

  const labels = createTagRow([SEVERITY_LABELS[finding.severity], AREA_LABELS[finding.area], ...finding.tags]);

  item.append(title, summary, labels);
  return item;
};

const createRecommendationItem = (
  recommendation: SokaRecommendation,
  template?: HTMLTemplateElement | null,
  isDemo = false
) => {
  const item =
    template?.content.firstElementChild instanceof HTMLLIElement
      ? (template.content.firstElementChild.cloneNode(true) as HTMLLIElement)
      : document.createElement("li");

  if (!item.className) {
    item.className = "audit-result-item audit-recommendation-card";
  }

  const titleNode = item.querySelector<HTMLElement>(".audit-recommendation-title");
  const summaryNode = item.querySelector<HTMLElement>(".audit-recommendation-summary");
  const rationaleNode = item.querySelector<HTMLElement>(".audit-recommendation-rationale");
  const tagsNode = item.querySelector<HTMLElement>(".audit-recommendation-tags");
  const linkNode = item.querySelector<HTMLAnchorElement>(".audit-recommendation-link");

  if (titleNode) titleNode.textContent = recommendation.title;
  if (summaryNode) summaryNode.textContent = recommendation.summary;
  if (rationaleNode) rationaleNode.textContent = recommendation.rationale;
  if (tagsNode) {
    clearElement(tagsNode);
    const labels = createTagRow([
      isDemo ? "Orientación" : `Nivel de atención ${recommendation.priority}`,
      ...recommendation.relatedAreas.map((area) => AREA_LABELS[area])
    ]);
    Array.from(labels.children).forEach((child) => tagsNode.append(child));
  }
  if (linkNode) {
    linkNode.href = recommendation.ctaHref;
    linkNode.textContent = recommendation.ctaLabel;
  }

  return item;
};

const renderReport = (container: HTMLElement, report: AuditReport, metaMessage: string, isDemo = false) => {
  const summaryNode = container.querySelector<HTMLElement>("[data-audit-summary]");
  const metaNode = container.querySelector<HTMLElement>("[data-audit-meta]");
  const overallScoreNode = container.querySelector<HTMLElement>("[data-audit-overall-score]");
  const overallNoteNode = container.querySelector<HTMLElement>("[data-audit-overall-note]");
  const leadFitNode = container.querySelector<HTMLElement>("[data-audit-lead-fit]");
  const leadNoteNode = container.querySelector<HTMLElement>("[data-audit-lead-note]");
  const coverageNode = container.querySelector<HTMLElement>("[data-audit-coverage]");
  const coverageNoteNode = container.querySelector<HTMLElement>("[data-audit-coverage-note]");
  const areasNode = container.querySelector<HTMLElement>("[data-audit-areas]");
  const areasCountNode = container.querySelector<HTMLElement>("[data-audit-areas-count]");
  const findingsNode = container.querySelector<HTMLElement>("[data-audit-findings]");
  const findingsCountNode = container.querySelector<HTMLElement>("[data-audit-findings-count]");
  const recommendationsNode = container.querySelector<HTMLElement>("[data-audit-recommendations]");
  const recommendationsCountNode = container.querySelector<HTMLElement>("[data-audit-recommendations-count]");
  const recommendationTemplate = container.querySelector<HTMLTemplateElement>("[data-audit-recommendation-template]");
  const measuredCategories = !isDemo && report.pagespeed
    ? (Object.entries(report.pagespeed.categories).filter(([, score]) => score != null) as Array<
        [PageSpeedCategoryKey, number]
      >)
    : [];
  const shownFindings = report.findings.slice(0, 4);
  const shownRecommendations = report.recommendations.slice(0, 4);

  if (summaryNode) summaryNode.textContent = report.summary;
  if (metaNode) {
    metaNode.textContent = isDemo
      ? "Simulación local basada en tus respuestas. No se evaluó ni escaneó la URL."
      : `${metaMessage} Sitio evaluado: ${report.request.normalizedWebsiteUrl}.`;
  }
  if (overallScoreNode) overallScoreNode.textContent = isDemo ? "Orientativa" : `${report.scoreCard.overallScore}/100`;
  if (overallNoteNode) {
    overallNoteNode.textContent =
      isDemo
        ? "No es una medición técnica ni una puntuación del sitio."
        : "Lectura consultiva basada en señales visibles y en el contexto compartido. No reemplaza una auditoría técnica completa.";
  }
  if (leadFitNode) {
    leadFitNode.textContent = isDemo ? "Orientativo" : `${report.scoreCard.leadFitScore}/100 · ${report.scoreCard.leadFitLabel}`;
  }
  if (leadNoteNode) {
    leadNoteNode.textContent =
      isDemo
        ? "Ayuda a orientar la conversación; no califica tu empresa ni tu sitio."
        : "Ayuda a orientar la siguiente conversación con Soka y a decidir si conviene abrir diagnóstico.";
  }
  if (coverageNode) {
    coverageNode.textContent = isDemo ? "Contexto compartido" : report.pagespeed ? "Señales visibles + PageSpeed" : "Señales visibles";
  }
  if (coverageNoteNode) {
    coverageNoteNode.textContent = isDemo
      ? "No incluye medición automática ni consulta externa de la URL."
      : report.pagespeed
        ? "Incluye categorías técnicas medidas sobre la URL pública cuando Google PageSpeed pudo responder."
        : "En esta vista previa no hubo medición técnica externa disponible; el análisis se apoya en reglas locales y señales públicas.";
  }

  if (areasNode) {
    clearElement(areasNode);

    const consultiveAreas = report.scoreCard.dominantAreas.slice(0, 3).map((area) =>
      createAreaItem({
        title: AREA_LABELS[area],
        detail: isDemo
          ? "Orientación derivada de tus respuestas, no de una medición automática del sitio."
          : "Área priorizada según señales visibles, copy, recorrido y contexto declarado en el formulario.",
        sourceLabel: isDemo ? "Contexto compartido" : "Lectura consultiva"
      })
    );

    const measuredAreaItems = measuredCategories.map(([category, score]) =>
      createAreaItem({
        title: PAGESPEED_CATEGORY_LABELS[category],
        detail: "Categoría técnica medida por Google PageSpeed sobre la URL pública evaluada.",
        value: `${score}/100`,
        sourceLabel: "PageSpeed"
      })
    );

    [...consultiveAreas, ...measuredAreaItems].forEach((item) => areasNode.append(item));
  }

  const renderedAreaCount = report.scoreCard.dominantAreas.slice(0, 3).length + measuredCategories.length;

  if (areasCountNode) {
    areasCountNode.textContent = `${renderedAreaCount} área${renderedAreaCount === 1 ? "" : "s"}`;
  }
  if (findingsCountNode) {
    findingsCountNode.textContent = `${shownFindings.length} ${shownFindings.length === 1 ? "observación" : "observaciones"}`;
  }
  if (recommendationsCountNode) {
    recommendationsCountNode.textContent = `${shownRecommendations.length} ${shownRecommendations.length === 1 ? "recomendación" : "recomendaciones"}`;
  }

  clearElement(findingsNode);
  shownFindings.forEach((finding) => findingsNode?.append(createFindingItem(finding)));

  clearElement(recommendationsNode);
  shownRecommendations.forEach((recommendation) =>
    recommendationsNode?.append(createRecommendationItem(recommendation, recommendationTemplate, isDemo))
  );

  container.dataset.reportVisible = "true";
  container.closest("form")?.setAttribute("data-report-visible", "true");
  setVisibility(container, true);
};

const clearFieldErrors = (form: HTMLFormElement) => {
  clearFormFieldErrors(form);
};

const markInvalidFields = (form: HTMLFormElement, issues: AuditValidationIssue[]) => {
  issues.forEach((issue) => {
    const field = form.elements.namedItem(issue.field);
    if (isFormControl(field)) setFieldError(field, issue.message);
  });
};

const renderIssues = (listNode: HTMLElement | null, issues: AuditValidationIssue[], fallbackMessage?: string) => {
  clearElement(listNode);

  if (!listNode) return;

  if (issues.length === 0 && fallbackMessage) {
    const item = document.createElement("li");
    item.textContent = fallbackMessage;
    listNode.append(item);
    return;
  }

  issues.forEach((issue) => {
    const item = document.createElement("li");
    item.textContent = issue.message;
    listNode.append(item);
  });
};

const buildRuntimeFallbackIssue = (message: string): AuditValidationIssue[] => [
  {
    field: "form",
    code: "runtime-unavailable",
    message
  }
];

const handleAuditForm = (form: HTMLFormElement) => {
  const mode = form.dataset.mode ?? "demo";
  const endpoint = form.dataset.endpoint ?? "/api/audit";
  const successNode = form.dataset.successId ? (document.getElementById(form.dataset.successId) as HTMLElement | null) : null;
  const errorNode = form.dataset.errorId ? (document.getElementById(form.dataset.errorId) as HTMLElement | null) : null;
  const loadingNode = form.dataset.loadingId ? (document.getElementById(form.dataset.loadingId) as HTMLElement | null) : null;
  const issuesNode = form.dataset.issuesId ? (document.getElementById(form.dataset.issuesId) as HTMLElement | null) : null;
  const previewNode = form.dataset.previewId ? (document.getElementById(form.dataset.previewId) as HTMLElement | null) : null;
  const submitButton = form.querySelector<HTMLButtonElement>("[data-audit-submit]");
  const defaultSubmitText = submitButton?.textContent ?? "Ver simulación de prueba";

  if (mode === "demo" && submitButton instanceof HTMLButtonElement) {
    submitButton.addEventListener("click", () => form.requestSubmit());
  }

  const resetStatus = (clearErrors = true) => {
    setVisibility(successNode, false);
    setVisibility(errorNode, false);
    setVisibility(loadingNode, false);
    setVisibility(issuesNode, false);
    setVisibility(previewNode, false);
    if (previewNode) delete previewNode.dataset.reportVisible;
    delete form.dataset.reportVisible;
    clearElement(issuesNode);
    if (clearErrors) clearFieldErrors(form);
  };

  form.addEventListener(
    "invalid",
    (event) => {
      if (isFormControl(event.target)) setFieldError(event.target);
      setVisibility(errorNode, true);
    },
    true
  );

  form.addEventListener("input", (event) => {
    resetStatus(false);
    if (isFormControl(event.target)) clearFieldError(event.target);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const trap = form.elements.namedItem("website");

    if (trap instanceof HTMLInputElement && trap.value.trim().length > 0) {
      form.reset();
      resetStatus();
      setVisibility(errorNode, true);
      renderIssues(
        issuesNode,
        buildRuntimeFallbackIssue("La solicitud no pudo procesarse. Revisa los campos visibles e intenta de nuevo.")
      );
      setVisibility(issuesNode, true);
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      setVisibility(errorNode, true);
      return;
    }

    const payload = toPayload(form);
    const validation = validateAuditInput(payload);

    resetStatus();

    if (!validation.ok) {
      markInvalidFields(form, validation.issues);
      renderIssues(issuesNode, validation.issues);
      setVisibility(errorNode, true);
      setVisibility(issuesNode, true);
      return;
    }

    if (mode === "demo") {
      if (previewNode) {
        renderReport(
          previewNode,
          buildLocalAuditReport(validation.data),
          "Simulación local basada en tus respuestas.",
          true
        );
      }
      setVisibility(successNode, true);
      return;
    }

    form.setAttribute("aria-busy", "true");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Analizando...";
    }

    setVisibility(loadingNode, true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await readJson(response);

      if (response.ok && data?.ok === true && "report" in data) {
        if (previewNode) {
          renderReport(previewNode, data.report, "Reporte generado desde el endpoint local.");
        }
        setVisibility(successNode, true);
        return;
      }

      if (data?.ok === false && data.error?.issues?.length) {
        markInvalidFields(form, data.error.issues);
        renderIssues(issuesNode, data.error.issues);
        setVisibility(errorNode, true);
        setVisibility(issuesNode, true);
        return;
      }

      if (data?.ok === false && data.endpoint === endpoint) {
        const fallbackReport = buildLocalAuditReport(validation.data);
        if (previewNode) {
          renderReport(
            previewNode,
            fallbackReport,
            "Vista previa generada en el navegador porque este build estático no ejecuta POST server-side.",
            true
          );
        }
        setVisibility(successNode, true);
        return;
      }

      const fallbackReport = buildLocalAuditReport(validation.data);
      if (previewNode) {
        renderReport(
          previewNode,
          fallbackReport,
          "Vista previa local generada porque el endpoint no está disponible en este build.",
          true
        );
      }
      setVisibility(successNode, true);
    } catch {
      const fallbackReport = buildLocalAuditReport(validation.data);
      if (previewNode) {
        renderReport(
          previewNode,
          fallbackReport,
          "Vista previa local generada porque no fue posible consultar el endpoint.",
          true
        );
      }
      setVisibility(successNode, true);
    } finally {
      form.removeAttribute("aria-busy");
      setVisibility(loadingNode, false);

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultSubmitText;
      }
    }
  });
};

export const initAuditForms = () => {
  document.querySelectorAll(".audit-form").forEach((form) => {
    if (form instanceof HTMLFormElement && !form.dataset.auditBound) {
      form.dataset.auditBound = "true";
      handleAuditForm(form);
    }
  });
};

initAuditForms();
