import type { CaseStudyContent } from "./types";

export const caseStudies: CaseStudyContent[] = [
  {
    slug: "empresa-regulada-panama",
    title: "Empresa regulada en Panamá",
    headline: "Trazabilidad, reportes internos y continuidad para una operación regulada.",
    summary:
      "Organización con procesos internos sensibles, necesidad de control documental y foco en continuidad operativa.",
    problem:
      "Había dificultad para auditar cambios, mantener evidencia operativa y coordinar reportes internos con suficiente orden.",
    solution:
      "Se propuso una combinación de back-office, reportes internos, revisión de infraestructura y lineamientos básicos de seguridad.",
    outcomes: [
      "mejor preparación para seguimiento interno",
      "reducción de dependencia de procesos informales",
      "más orden en evidencia operativa"
    ],
    tags: ["back-office", "reportes", "infraestructura", "cumplimiento"],
    servicesApplied: ["sistemas internos", "back-office", "reportes", "infraestructura", "seguridad básica"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "anonymized",
    confidentialityNote:
      "Caso anonimizado. El alcance público se limita a sistemas internos, auditoría operativa y soporte técnico.",
    region: "Panamá"
  },
  {
    slug: "empresa-servicios-rd",
    title: "Empresa de servicios en República Dominicana",
    headline: "Operación fragmentada entre correos, hojas de cálculo y seguimiento manual.",
    summary:
      "Equipo B2B con procesos administrativos y operativos repartidos entre correos, hojas de cálculo y seguimiento manual.",
    problem:
      "La información llegaba tarde, había doble digitación y la gerencia no contaba con una fuente clara para supervisar avances.",
    solution:
      "Se priorizó un sistema interno ligero, trazabilidad operativa, automatización de pasos repetitivos y tableros básicos para seguimiento.",
    outcomes: [
      "mejor visibilidad operativa",
      "menos fricción administrativa",
      "ruta clara para seguir mejorando por fases"
    ],
    tags: ["software a medida", "automatización", "dashboards", "operación"],
    servicesApplied: ["software a medida", "trazabilidad operativa", "reportes", "gestión operativa"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "anonymized",
    confidentialityNote: "Caso anonimizado. No se muestran nombres, cifras ni capturas reales.",
    region: "República Dominicana"
  },
  {
    slug: "automatizacion-ivr-centralita",
    title: "Automatización IVR y centralita",
    headline: "Enrutamiento y atención inicial más ordenados para una operación de servicios.",
    summary:
      "Caso orientado a automatizar atención inicial, clasificación de llamadas y transferencia de contexto dentro de un flujo operativo.",
    problem:
      "Las llamadas se repartían con demasiado criterio manual y había poca consistencia en la atención inicial.",
    solution:
      "Se definió una lógica de enrutamiento, reglas de prioridad y una base técnica para reducir desorden en la recepción de solicitudes.",
    outcomes: [
      "mejor clasificación de llamadas",
      "menos desvíos informales",
      "mayor claridad sobre puntos de atención"
    ],
    tags: ["IVR", "centralita", "automatización", "servicios"],
    servicesApplied: ["IVR", "centralita", "enrutamiento", "control operativo"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "anonymized",
    confidentialityNote: "Caso anonimizado. Se omiten empresas, números telefónicos y reglas internas de enrutamiento.",
    region: "República Dominicana"
  },
  {
    slug: "mensajeria-operativa-consentida",
    title: "Comunicaciones operativas consentidas",
    headline: "Mensajería puntual con criterio de consentimiento y límites de cumplimiento.",
    summary:
      "Escenario de uso controlado para notificaciones operativas a contactos existentes, sin posicionarlo como sistema de campañas.",
    problem:
      "El equipo necesitaba reducir envío manual repetitivo sin cruzar límites de spam o bases no autorizadas.",
    solution:
      "Se acotó el caso a comunicaciones operativas consentidas, bajo volumen y validación previa del contexto de uso.",
    outcomes: [
      "mejor consistencia en avisos puntuales",
      "menos trabajo repetitivo",
      "límites más claros frente a cumplimiento"
    ],
    tags: ["mensajería", "consentimiento", "automatización", "operación"],
    servicesApplied: ["recordatorios operativos", "confirmaciones", "mensajería autorizada", "automatización"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "anonymized",
    confidentialityNote: "Caso presentado sin contactos, números ni mensajes reales; no aplica a campañas masivas.",
    region: "Latinoamérica"
  },
  {
    slug: "inventario-activos-ti",
    title: "Inventario automático de activos TI",
    headline: "Visibilidad de activos Windows para soporte, infraestructura y auditoría interna.",
    summary:
      "Caso técnico enfocado en levantar inventario de equipos Windows y reducir revisiones manuales del área de TI.",
    problem:
      "El inventario dependía de consultas manuales, planillas separadas y validaciones lentas ante auditorías o soporte.",
    solution:
      "Se planteó una utilidad de inventario automatizado orientada a activos Windows, auditoría TI y revisión controlada de datos recolectados, sin tratarlo como inventario comercial de mercancía.",
    outcomes: [
      "mejor visibilidad del parque tecnológico",
      "menos auditorías manuales",
      "base más clara para soporte e infraestructura"
    ],
    tags: ["inventario", "Windows", "TI", "ITSM"],
    servicesApplied: ["inventario automático", "auditoría TI", "soporte", "infraestructura Windows"],
    ctaLabel: "Solicitar revisión técnica",
    ctaHref: "/diagnostico/",
    visibility: "anonymized",
    confidentialityNote: "Caso técnico sin activos reales, nombres de equipos, usuarios ni datos de red.",
    region: "Latinoamérica"
  },
  {
    slug: "portik",
    title: "Portik",
    headline: "Control operativo para portería, visitantes y trazabilidad residencial.",
    summary:
      "Producto propio orientado a conjuntos residenciales y administradores que necesitan ordenar visitantes, vehículos, reservas, novedades y reportes simples.",
    problem:
      "La operación diaria dependía de cuadernos, llamadas, mensajería informal y validaciones manuales difíciles de auditar.",
    solution:
      "Se planteó un producto web acotado para portería y administración básica, con módulos de visitantes, vehículos, reservas, novedades, bitácora y reportes simples.",
    outcomes: [
      "mejor trazabilidad operativa",
      "menos validaciones informales",
      "base más clara para un piloto controlado"
    ],
    tags: ["portik", "portería", "visitantes", "residencial"],
    servicesApplied: ["portería", "visitantes", "vehículos", "reservas", "novedades", "reportes simples"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "public",
    confidentialityNote:
      "Caso presentado como producto propio. No se muestran residentes, placas, accesos, reservas ni eventos reales.",
    region: "Producto propio"
  },
  {
    slug: "demo-ecommerce",
    title: "EcomDemo",
    headline: "Criterio visual y estructural para un catálogo B2B/B2C demostrativo.",
    summary:
      "Demo propia para mostrar estructura de catálogo, fichas y CTA sin fingir una marca real ni usar datos de terceros.",
    problem:
      "Era necesario enseñar capacidad de producto y arquitectura editorial sin exponer información de clientes ni montar una operación real.",
    solution:
      "Se preparó una demo controlada con narrativa comercial, jerarquía visual y puntos de conversión conceptuales.",
    outcomes: [
      "mejor material para conversaciones comerciales",
      "ejemplo reutilizable para demos futuras",
      "sin dependencia de catálogos ni pagos reales"
    ],
    tags: ["demo", "e-commerce", "UX", "estructura"],
    servicesApplied: ["demo técnica", "e-commerce", "UX", "experiencia digital"],
    ctaLabel: "Ver demo e-commerce",
    ctaHref: "/demos/ecommerce/",
    visibility: "public",
    confidentialityNote: "Demo propia. No usa backend real ni información de terceros.",
    region: "Demo interna"
  }
];

export const featuredCaseStudies = caseStudies.slice(0, 3);
