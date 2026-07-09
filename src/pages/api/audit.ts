import { runPageSpeedAudit } from "../../lib/audit/pagespeed";
import type { APIRoute } from "astro";
import { buildSokaRecommendations } from "../../lib/audit/recommendations";
import { buildInitialAuditFindings, buildAuditScoreCard, buildPageSpeedFindings } from "../../lib/audit/scoring";
import type { AuditReport } from "../../lib/audit/types";
import { validateAuditInput } from "../../lib/audit/validateAuditInput";

const MAX_BODY_BYTES = 20_000;

const json = (payload: unknown, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers
    }
  });

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const buildReportSummary = (report: Pick<AuditReport, "findings" | "scoreCard" | "recommendations">) => {
  const dominantArea = report.scoreCard.dominantAreas[0] ?? "clarity";
  const highestPriorityRecommendation = report.recommendations[0];

  const firstSentence =
    report.findings.length > 0
      ? report.findings[0]?.summary
      : "La solicitud sugiere oportunidad de mejora, pero requiere revisión manual del sitio para precisar prioridades.";

  const secondSentence = highestPriorityRecommendation
    ? `La ruta sugerida en esta simulación apunta primero a ${highestPriorityRecommendation.title.toLowerCase()}.`
    : "La siguiente recomendación razonable es avanzar a diagnóstico consultivo.";

  return `Área dominante detectada: ${dominantArea}. ${firstSentence} ${secondSentence}`;
};

const parseAuditRequestJson = async (request: Request) => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    return {
      ok: false as const,
      status: 415,
      body: {
        ok: false,
        error: {
          code: "unsupported_media_type",
          message: "El endpoint /api/audit solo acepta solicitudes JSON."
        }
      }
    };
  }

  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : Number.NaN;

  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return {
      ok: false as const,
      status: 413,
      body: {
        ok: false,
        error: {
          code: "payload_too_large",
          message: `La solicitud supera el límite de ${MAX_BODY_BYTES} bytes permitido para esta versión inicial.`
        }
      }
    };
  }

  const rawBody = await request.text();

  if (!rawBody.trim()) {
    return {
      ok: false as const,
      status: 400,
      body: {
        ok: false,
        error: {
          code: "empty_body",
          message: "La solicitud no contiene un cuerpo JSON válido."
        }
      }
    };
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return {
      ok: false as const,
      status: 413,
      body: {
        ok: false,
        error: {
          code: "payload_too_large",
          message: `La solicitud supera el límite de ${MAX_BODY_BYTES} bytes permitido para esta versión inicial.`
        }
      }
    };
  }

  let parsedBody: unknown;

  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return {
      ok: false as const,
      status: 400,
      body: {
        ok: false,
        error: {
          code: "invalid_json",
          message: "No fue posible interpretar el JSON enviado."
        }
      }
    };
  }

  if (!isPlainObject(parsedBody)) {
    return {
      ok: false as const,
      status: 400,
      body: {
        ok: false,
        error: {
          code: "invalid_payload_shape",
          message: "La solicitud debe ser un objeto JSON con los campos esperados."
        }
      }
    };
  }

  return {
    ok: true as const,
    data: parsedBody
  };
};

export const GET = (() =>
  json({
    ok: false,
    endpoint: "/api/audit",
    message:
      "Usa POST con application/json para validar una solicitud de auditoría. En esta app con output estático, la build puede prerenderizar esta nota, pero el procesamiento real de POST en despliegue requerirá on-demand rendering con adapter aprobado.",
    mode: "local-rules-only",
    persisted: false,
    emailed: false
  })) satisfies APIRoute;

export const POST = (async ({ request }) => {
  const parsedRequest = await parseAuditRequestJson(request);

  if (!parsedRequest.ok) {
    return json(parsedRequest.body, parsedRequest.status);
  }

  const validation = validateAuditInput(parsedRequest.data);

  if (!validation.ok) {
    return json(
      {
        ok: false,
        error: {
          code: "invalid_audit_request",
          message: "La solicitud de auditoría no pasó validación.",
          issues: validation.issues
        }
      },
      422
    );
  }

  const localFindings = buildInitialAuditFindings(validation.data);
  const pageSpeedResult = await runPageSpeedAudit(validation.data.normalizedWebsiteUrl, {
    apiKey: import.meta.env.PAGESPEED_API_KEY,
    strategy: "mobile",
    locale: "es-419"
  });
  const pageSpeedFindings = pageSpeedResult.ok ? buildPageSpeedFindings(pageSpeedResult.summary) : [];
  const findings = [...localFindings, ...pageSpeedFindings];
  const scoreCard = buildAuditScoreCard(findings, validation.data);
  const recommendations = buildSokaRecommendations({
    request: validation.data,
    findings,
    areaScores: scoreCard.areaScores,
    leadFitScore: scoreCard.leadFitScore
  });

  const report: AuditReport = {
    request: validation.data,
    createdAt: new Date().toISOString(),
    summary: buildReportSummary({ findings, scoreCard, recommendations }),
    findings,
    scoreCard,
    recommendations,
    pagespeed: pageSpeedResult.ok ? pageSpeedResult.summary : null
  };

  return json({
    ok: true,
    report,
    meta: {
      mode: pageSpeedResult.ok ? "local-plus-pagespeed" : "local-simulated",
      persisted: false,
      emailed: false,
      externalApis: pageSpeedResult.ok,
      pagespeed: pageSpeedResult.ok
        ? {
            attempted: true,
            ok: true,
            source: pageSpeedResult.source,
            strategy: pageSpeedResult.summary.strategy,
            withApiKey: Boolean(import.meta.env.PAGESPEED_API_KEY?.trim())
          }
        : {
            attempted: true,
            ok: false,
            source: pageSpeedResult.source,
            withApiKey: Boolean(import.meta.env.PAGESPEED_API_KEY?.trim()),
            error: pageSpeedResult.error
          }
    }
  });
}) satisfies APIRoute;

export const ALL = (() =>
  json(
    {
      ok: false,
      error: {
        code: "method_not_allowed",
        message: "Este endpoint solo procesa POST para crear reportes de auditoría."
      }
    },
    405,
    {
      Allow: "GET, POST"
    }
  )) satisfies APIRoute;
