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
  "Observaciones orientativas",
  "Ruta sugerida con Soka"
];

export const auditHeroFocus = [
  "tus respuestas sobre mensaje y primer scroll",
  "tus respuestas sobre CTA y puntos de contacto",
  "preguntas sobre SEO básico y confianza",
  "contexto técnico básico y experiencia mobile"
];

export const auditHeroGuardrails = [
  "no pedimos contraseñas, tokens ni paneles",
  "no visitamos código privado ni entornos internos",
  "no prometemos rankings, ventas ni resultados garantizados",
  "si el caso requiere profundidad, el siguiente paso es diagnóstico"
];

export const auditAreas: AuditCardContent[] = [
  {
    eyebrow: "SEO básico",
    title: "Cómo se presenta tu sitio a buscadores.",
    body:
      "La simulación ordena preguntas sobre el entendimiento básico de la página y su descubrimiento orgánico inicial.",
    items: ["title, description y h1", "indexabilidad visible", "enlaces clave y estructura pública"]
  },
  {
    eyebrow: "Velocidad",
    title: "Carga aparente y peso visual del primer recorrido.",
    body:
      "Tus respuestas ayudan a conversar sobre recursos pesados, jerarquía de contenido y experiencia mobile.",
    items: ["primer scroll", "peso visual del hero", "fricción aparente en navegación"]
  },
  {
    eyebrow: "Claridad comercial",
    title: "Qué entiende un visitante en pocos segundos.",
    body:
      "La simulación considera cómo describes la oferta, el perfil ideal de cliente y el siguiente paso.",
    items: ["propuesta de valor", "jerarquía de contenido", "mensaje orientado a negocio"]
  },
  {
    eyebrow: "Conversión",
    title: "Qué tan fácil es abrir una conversación comercial.",
    body:
      "Las respuestas ayudan a ordenar preguntas sobre llamadas a la acción, formularios y puntos de contacto.",
    items: ["CTA principales", "formularios visibles", "recorrido hacia contacto o diagnóstico"]
  },
  {
    eyebrow: "Confianza",
    title: "Señales visibles de seriedad y continuidad.",
    body:
      "La simulación orienta una conversación sobre credibilidad, contacto, consistencia y mensajes que reduzcan dudas.",
    items: ["HTTPS y contacto", "consistencia visual", "legales y soporte visibles si aplican"]
  },
  {
    eyebrow: "Automatización",
    title: "Oportunidades alrededor del proceso digital.",
    body:
      "Tus respuestas pueden señalar tareas manuales, handoff repetitivo o seguimiento comercial que convenga ordenar.",
    items: ["seguimiento manual", "formularios aislados", "flujo entre web y operación"]
  },
  {
    eyebrow: "Infraestructura básica",
    title: "Señales públicas de continuidad técnica.",
    body:
      "La simulación no hace pentesting; sirve para conversar sobre errores visibles, rutas frágiles y mantenimiento.",
    items: ["errores públicos", "enlaces obvios rotos", "sensación general de estabilidad"]
  }
];

export const auditDeliverables: AuditCardContent[] = [
  {
    eyebrow: "Qué recibirás",
    title: "Observaciones orientativas y útiles para decidir.",
    body:
      "No entregamos una lista genérica. La simulación se concentra en lo que describiste y en próximos pasos posibles.",
    items: ["observaciones a partir de tus respuestas", "preguntas para el primer recorrido", "temas para conversar con más contexto"]
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
      "Si el principal problema es mensaje, estructura o conversión, la recomendación puede ir hacia rediseño de contenido y mejora técnica del sitio.",
    items: ["arquitectura de páginas", "CTA más claros", "base técnica más sólida"],
    ctaLabel: "Ver servicio",
    ctaHref: "/servicios/sitios-web-corporativos/"
  },
  {
    eyebrow: "Ruta posible",
    title: "Automatización del seguimiento o handoff comercial.",
    body:
      "Si tus respuestas describen seguimiento manual, fricción entre formulario y operación o tareas repetitivas, puede convenir automatizar.",
    items: ["confirmaciones", "handoff entre áreas", "menos pasos manuales"],
    ctaLabel: "Ver automatizaciones",
    ctaHref: "/servicios/automatizaciones/"
  },
  {
    eyebrow: "Ruta posible",
    title: "Power BI y reporting para visibilidad real.",
    body:
      "Si la fricción viene de poca visibilidad sobre leads, solicitudes o desempeño operativo, puede hacer falta ordenar indicadores.",
    items: ["KPIs claros", "menos reportes manuales", "lectura más ejecutiva"],
    ctaLabel: "Ver Power BI",
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
