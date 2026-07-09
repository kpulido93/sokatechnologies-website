export type AuditCardContent = {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  ctaLabel?: string;
  ctaHref?: string;
};

export const auditHeroSignals = [
  "Sin accesos privados",
  "Hallazgos priorizados",
  "Ruta sugerida con Soka"
];

export const auditHeroFocus = [
  "mensaje principal y primer scroll",
  "CTA, formularios y puntos de contacto",
  "señales visibles de SEO y confianza",
  "fricción técnica básica y mobile"
];

export const auditHeroGuardrails = [
  "no pedimos contraseñas, tokens ni paneles",
  "no auditamos código privado ni entornos internos",
  "no prometemos rankings, ventas ni resultados garantizados",
  "si el caso requiere profundidad, el siguiente paso es diagnóstico"
];

export const auditAreas: AuditCardContent[] = [
  {
    eyebrow: "SEO básico",
    title: "Cómo se presenta tu sitio a buscadores.",
    body:
      "Revisamos señales visibles que afectan entendimiento básico de la página y descubrimiento orgánico inicial.",
    items: ["title, description y h1", "indexabilidad visible", "enlaces clave y estructura pública"]
  },
  {
    eyebrow: "Velocidad",
    title: "Carga aparente y peso visual del primer recorrido.",
    body:
      "Buscamos fricción visible por recursos pesados, jerarquía desordenada o experiencia poco fluida en mobile.",
    items: ["primer scroll", "peso visual del hero", "fricción aparente en navegación"]
  },
  {
    eyebrow: "Claridad comercial",
    title: "Qué entiende un visitante en pocos segundos.",
    body:
      "Analizamos si el sitio comunica la oferta, el perfil ideal de cliente y el siguiente paso con claridad suficiente.",
    items: ["propuesta de valor", "jerarquía editorial", "mensaje orientado a negocio"]
  },
  {
    eyebrow: "Conversión",
    title: "Qué tan fácil es abrir una conversación comercial.",
    body:
      "Revisamos llamadas a la acción, formularios y puntos de contacto visibles para detectar fricción o ambigüedad.",
    items: ["CTA principales", "formularios visibles", "recorrido hacia contacto o diagnóstico"]
  },
  {
    eyebrow: "Confianza",
    title: "Señales visibles de seriedad y continuidad.",
    body:
      "Revisamos si el sitio transmite credibilidad mediante estructura, contacto, consistencia y mensajes que reduzcan duda.",
    items: ["HTTPS y contacto", "consistencia visual", "legales y soporte visibles si aplican"]
  },
  {
    eyebrow: "Automatización",
    title: "Oportunidades alrededor del proceso digital.",
    body:
      "Identificamos si el sitio revela tareas manuales, handoff repetitivo o seguimiento comercial que podría automatizarse.",
    items: ["seguimiento manual", "formularios aislados", "flujo entre web y operación"]
  },
  {
    eyebrow: "Infraestructura básica",
    title: "Señales públicas de continuidad técnica.",
    body:
      "No hacemos pentesting, pero sí observamos errores visibles, rutas frágiles y síntomas de mantenimiento débil.",
    items: ["errores públicos", "enlaces obvios rotos", "sensación general de estabilidad"]
  }
];

export const auditDeliverables: AuditCardContent[] = [
  {
    eyebrow: "Qué recibirás",
    title: "Hallazgos priorizados y útiles para decidir.",
    body:
      "No entregamos una lista genérica. La salida del MVP se concentra en lo más visible y accionable.",
    items: ["3 a 5 hallazgos priorizados", "fricciones visibles del primer recorrido", "señales de riesgo o debilidad pública"]
  },
  {
    eyebrow: "Siguiente paso",
    title: "Una ruta sugerida, no una venta forzada.",
    body:
      "Si el problema es más profundo que la web, la auditoría debe orientar hacia la combinación correcta de servicios.",
    items: ["rediseño web", "automatización o reporting", "diagnóstico técnico o continuidad"]
  },
  {
    eyebrow: "Límites claros",
    title: "Una revisión inicial con alcance controlado.",
    body:
      "La auditoría gratuita sirve para abrir una conversación seria, no para reemplazar un proyecto completo ni una revisión de seguridad profunda.",
    items: ["sin acceso a paneles", "sin código privado", "sin promesas garantizadas"]
  }
];

export const auditRecommendations: AuditCardContent[] = [
  {
    eyebrow: "Ruta posible",
    title: "Sitio web corporativo más claro y confiable.",
    body:
      "Si el principal problema es mensaje, estructura o conversión, la recomendación puede ir hacia rediseño editorial y mejora técnica del sitio.",
    items: ["arquitectura de páginas", "CTA más claros", "base técnica más sólida"],
    ctaLabel: "Ver servicio",
    ctaHref: "/servicios/sitios-web-corporativos/"
  },
  {
    eyebrow: "Ruta posible",
    title: "Automatización del seguimiento o handoff comercial.",
    body:
      "Si el sitio revela seguimiento manual, fricción entre formulario y operación o tareas repetitivas, puede convenir automatizar.",
    items: ["confirmaciones", "handoff entre áreas", "menos pasos manuales"],
    ctaLabel: "Ver automatizaciones",
    ctaHref: "/servicios/automatizaciones/"
  },
  {
    eyebrow: "Ruta posible",
    title: "Dashboards o reporting para visibilidad real.",
    body:
      "Si la fricción viene de poca visibilidad sobre leads, solicitudes o desempeño operativo, puede hacer falta ordenar indicadores.",
    items: ["KPIs claros", "menos reportes manuales", "lectura más ejecutiva"],
    ctaLabel: "Ver dashboards",
    ctaHref: "/servicios/dashboards/"
  },
  {
    eyebrow: "Ruta posible",
    title: "Base técnica y continuidad después del lanzamiento.",
    body:
      "Si el sitio transmite fragilidad técnica o soporte débil, la conversación puede derivar a infraestructura, soporte y mejora continua.",
    items: ["continuidad básica", "riesgo técnico más bajo", "seguimiento posterior"],
    ctaLabel: "Ver continuidad",
    ctaHref: "/servicios/infraestructura-soporte/"
  }
];

export const auditCompanyTypes = [
  "Servicios B2B",
  "Industria o manufactura",
  "Salud o educación privada",
  "Tecnología o SaaS",
  "Inmobiliaria o administración",
  "Retail o comercio",
  "Otra"
];
