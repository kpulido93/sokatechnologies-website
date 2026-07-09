import type { PortikModule, ProductContent } from "./types";

export const auditProductSlugs = {
  portik: "portik",
  autoinventario: "autoinventario",
  autowhatsapp: "autowhatsapp"
} as const;

export const portikModules: PortikModule[] = [
  { name: "Predios", summary: "Estructura del conjunto, torres, bloques y unidades." },
  { name: "Personas", summary: "Propietarios, residentes y contactos autorizados." },
  { name: "Vehículos", summary: "Asociación por predio, fichas y validación rápida." },
  { name: "Visitantes", summary: "Autorizaciones y consulta simple desde portería." },
  { name: "Ingresos y salidas", summary: "Registro manual con trazabilidad básica." },
  { name: "Parqueaderos", summary: "Control de ocupación y uso temporal." },
  { name: "Novedades", summary: "Registro de eventos y seguimiento operativo." },
  { name: "Reservas", summary: "Áreas comunes y calendario con reglas básicas." },
  { name: "Bitácora", summary: "Historial de acciones relevantes y consulta posterior." },
  { name: "Reportes simples", summary: "Consultas y exportaciones básicas para administración." }
];

export const products: ProductContent[] = [
  {
    slug: "portik",
    title: "Portik",
    headline: "Control operativo para portería y administración residencial.",
    summary:
      "Producto prioritario para validar un piloto comercial en conjuntos residenciales, con foco en visitantes, vehículos, reservas, novedades y bitácora.",
    problem:
      "Muchas porterías todavía operan entre llamadas, WhatsApp, cuadernos y hojas de cálculo, con trazabilidad mínima y demasiada dependencia de memoria.",
    solution:
      "Una plataforma web para ordenar visitantes, vehículos, reservas, bitácora e incidencias desde una sola base operativa.",
    outcomes: [
      "mejor trazabilidad en portería",
      "menos validaciones informales",
      "más claridad para administración",
      "base lista para un piloto controlado"
    ],
    tags: ["portik", "portería", "residencial", "piloto"],
    ctaLabel: "Ver Portik",
    ctaHref: "/productos/portik/",
    visibility: "public",
    confidentialityNote:
      "La demo solo muestra un alcance MVP: no promete hardware, OCR, pagos ni app móvil nativa.",
    metaTitle: "Portik | SokaTechnologies",
    metaDescription:
      "Portik es una plataforma web para control de acceso, portería y administración básica en conjuntos residenciales.",
    eyebrow: "Producto destacado",
    heroTitle: "Un producto serio para controlar visitantes, vehículos y bitácora operativa.",
    heroBody:
      "Portik está orientado a conjuntos residenciales y administradores que necesitan ordenar operación de portería, novedades, reservas y trazabilidad desde una plataforma web.",
    status: "MVP más cercano a piloto comercial.",
    detailRoute: "static",
    primaryCtaLabel: "Solicitar demo de Portik",
    primaryCtaHref: "/contacto/",
    secondaryCtaLabel: "Proponer piloto",
    secondaryCtaHref: "/diagnostico/",
    fitFor: [
      "administradores de condominios",
      "conjuntos residenciales con portería física",
      "operaciones que hoy trabajan con cuadernos y mensajería informal",
      "pilotos controlados de 30 a 60 días"
    ],
    includes: [
      "predios, personas y vehículos",
      "visitantes, ingresos y salidas",
      "reservas, novedades y bitácora",
      "reportes simples para administración"
    ],
    constraints: [
      "no promete OCR, hardware ni pagos",
      "no crea una app móvil nativa en esta etapa",
      "no sustituye reglas operativas del conjunto",
      "no debe venderse como suite cerrada sin piloto"
    ],
    pilotProposal: [
      "piloto controlado de 30 a 60 días",
      "alcance inicial con portería y administración básica",
      "carga inicial de datos y reglas operativas definidas",
      "revisión de adopción antes de ampliar módulos"
    ],
    finalCtaTitle: "La recomendación comercial es validar primero un piloto operativo controlado.",
    finalCtaBody:
      "Un piloto de 30 a 60 días ayuda a probar adopción, reglas operativas, carga inicial de datos y próximos módulos antes de ampliar el alcance.",
    modules: portikModules
  },
  {
    slug: "autoinventario",
    title: "AutoInventario",
    headline: "Inventario automático de activos Windows para equipos de TI.",
    summary:
      "Solución técnica en validación para inventario de infraestructura tecnológica y sincronización con herramientas ITSM.",
    problem:
      "Equipos de TI con inventarios manuales o incompletos, poca visibilidad del parque Windows y auditorías lentas.",
    solution:
      "Recolección automatizada de información técnica sobre activos Windows para mejorar soporte, auditoría e inventario interno.",
    outcomes: [
      "mejor visibilidad de activos Windows",
      "menos auditorías manuales",
      "mejor base para soporte e infraestructura",
      "alineación inicial con procesos ITSM"
    ],
    tags: ["autoinventario", "windows", "TI", "ITSM"],
    ctaLabel: "Ver AutoInventario",
    ctaHref: "/productos/autoinventario/",
    visibility: "controlled",
    confidentialityNote:
      "No debe venderse masivamente sin remediación técnica, validación de seguridad y revisión de alcance.",
    metaTitle: "AutoInventario | SokaTechnologies",
    metaDescription:
      "AutoInventario es una solución técnica en validación para inventario de activos Windows, soporte IT, auditoría, infraestructura e ITSM.",
    eyebrow: "Producto técnico",
    heroTitle: "Inventario automático de activos Windows para equipos de TI.",
    heroBody:
      "AutoInventario está orientado a empresas que necesitan mejorar visibilidad de sus equipos Windows, reducir auditorías manuales y mantener información de activos más actualizada.",
    status: "Solución técnica en validación; requiere remediación y validación antes de venta masiva.",
    detailRoute: "static",
    primaryCtaLabel: "Solicitar evaluación técnica",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver productos",
    secondaryCtaHref: "/productos/",
    fitFor: [
      "empresas con parque de equipos Windows",
      "áreas de soporte IT e infraestructura",
      "organizaciones con auditoría de activos tecnológicos",
      "equipos que usan o evalúan herramientas ITSM"
    ],
    includes: [
      "recolección de inventario técnico de activos Windows",
      "sincronización o intercambio con herramientas ITSM según diagnóstico",
      "revisión de seguridad y alcance de datos",
      "prueba controlada antes de cualquier piloto ampliado"
    ],
    constraints: [
      "no es inventario comercial de productos",
      "no es POS ni sistema de almacén",
      "no debe venderse sin remediación técnica y de seguridad",
      "no debe recolectar datos sensibles innecesarios"
    ],
    usageLimits: [
      "requiere validación técnica previa a cualquier despliegue amplio",
      "debe revisarse seguridad, build y alcance de recolección",
      "conviene probarse primero en entorno controlado",
      "no debe presentarse como producto listo para rollout masivo"
    ],
    finalCtaTitle: "Antes de hablar de piloto, conviene validar build, seguridad y alcance real.",
    finalCtaBody:
      "Si tu empresa necesita inventario de activos Windows o mejor trazabilidad de infraestructura, el siguiente paso correcto es una revisión técnica controlada."
  },
  {
    slug: "autowhatsapp",
    title: "AutoWhatsapp",
    headline: "Comunicaciones operativas consentidas de bajo volumen.",
    summary:
      "Herramienta Windows para programar mensajes por WhatsApp Web desde Excel, limitada a contactos con consentimiento y uso permitido.",
    problem:
      "Equipos que necesitan recordatorios o confirmaciones operativas puntuales y hoy dependen de envío manual repetitivo.",
    solution:
      "Una utilidad controlada para comunicaciones operativas consentidas, con límites claros y sin posicionarla como motor de campañas masivas.",
    outcomes: [
      "menos trabajo repetitivo en comunicaciones operativas",
      "mejor consistencia en mensajes puntuales",
      "uso controlado con criterio de consentimiento",
      "alcance más claro frente a cumplimiento y riesgo"
    ],
    tags: ["autowhatsapp", "mensajería", "consentimiento", "operación"],
    ctaLabel: "Ver AutoWhatsapp",
    ctaHref: "/productos/autowhatsapp/",
    visibility: "controlled",
    confidentialityNote:
      "No usar para spam, campañas masivas, loterías, apuestas ni bases compradas.",
    metaTitle: "AutoWhatsapp | SokaTechnologies",
    metaDescription:
      "Herramienta Windows para programar mensajes por WhatsApp Web desde Excel, limitada a comunicaciones operativas consentidas.",
    eyebrow: "Herramienta controlada",
    heroTitle: "Comunicaciones operativas consentidas, no campañas masivas.",
    heroBody:
      "AutoWhatsapp se presenta como una herramienta Windows para programar mensajes por WhatsApp Web desde Excel, solo para contactos con consentimiento verificable y usos permitidos.",
    status: "Utilidad operativa controlada; evaluar caso de uso antes de cualquier adopción.",
    detailRoute: "static",
    primaryCtaLabel: "Evaluar caso de uso",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver productos",
    secondaryCtaHref: "/productos/",
    fitFor: [
      "recordatorios operativos con consentimiento",
      "confirmaciones de citas o servicio",
      "notificaciones a contactos existentes",
      "comunicaciones internas o de bajo volumen"
    ],
    includes: [
      "carga de Excel con validación básica",
      "vista previa y programación de mensajes",
      "gestión local de líneas y fallback controlado",
      "reporte operativo y controles mínimos de cumplimiento"
    ],
    constraints: [
      "no usar para spam ni bases compradas",
      "no usar para loterías, apuestas o juegos de azar",
      "no usar para cobranzas agresivas sin revisión legal",
      "no reemplaza la API oficial de WhatsApp Business"
    ],
    usageRequirements: [
      "consentimiento verificable de cada contacto",
      "mensaje con propósito operativo claro",
      "mecanismo razonable de opt-out cuando aplique",
      "revisión previa del contexto legal y comercial de uso"
    ],
    usageLimits: [
      "uso de bajo volumen y contactos existentes",
      "no debe tratarse como plataforma de campañas masivas",
      "debe mantenerse dentro de casos operativos puntuales",
      "si el caso exige formalidad o escala, conviene evaluar proveedores autorizados"
    ],
    finalCtaTitle: "Si el caso requiere volumen alto o cumplimiento formal, esta no es la ruta correcta.",
    finalCtaBody:
      "Para usos operativos puntuales puede evaluarse bajo consentimiento, opt-out y límites claros. Para operación formal conviene revisar proveedores autorizados."
  }
];

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);
