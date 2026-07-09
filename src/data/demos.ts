import type { DemoContent } from "./types";

export const demos: DemoContent[] = [
  {
    slug: "ecommerce",
    title: "EcomDemo",
    headline: "Una demo e-commerce útil para mostrar criterio de producto, no para fingir un cliente.",
    summary:
      "Demo conceptual de e-commerce para mostrar estructura, catálogo, conversión y back-office sin usar datos reales de clientes.",
    problem:
      "Se necesitaba una pieza demostrativa que mostrara criterio visual y estructura de producto sin depender de una marca real ni un backend activo.",
    solution:
      "Una demo controlada de experiencia de catálogo, fichas, checkout conceptual y operación visual, sin integraciones reales.",
    outcomes: [
      "material comercial reutilizable",
      "base visual para conversaciones B2B",
      "sin uso de datos ni catálogos de terceros"
    ],
    tags: ["demo", "e-commerce", "catálogo", "conversión"],
    ctaLabel: "Ver demo e-commerce",
    ctaHref: "/demos/ecommerce/",
    visibility: "public",
    confidentialityNote: "Demo propia, sin backend real ni datos de terceros.",
    metaTitle: "Demo e-commerce | SokaTechnologies",
    metaDescription:
      "Demo conceptual de e-commerce para mostrar estructura, catálogo, conversión y back-office sin usar datos reales de clientes.",
    eyebrow: "Demo propia",
    heroTitle: "Una demo e-commerce útil para mostrar criterio de producto, no para fingir un cliente.",
    heroBody:
      "EcomDemo se presenta como demostración controlada de experiencia de catálogo, fichas, checkout conceptual y operación visual, sin backend real ni datos de terceros.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver servicios",
    secondaryCtaHref: "/servicios/",
    includes: [
      "arquitectura editorial de catálogo y ficha",
      "señales de checkout conceptual sin backend",
      "mockups controlados para explicar conversión",
      "base apta para demos y presentaciones comerciales"
    ],
    exclusions: [
      "pasarela de pago real",
      "inventario transaccional en vivo",
      "datos de clientes o catálogos de terceros",
      "integraciones reales con ERP o logística"
    ],
    finalCtaTitle: "Si necesitas algo similar, el siguiente paso es definir alcance real y stack correcto.",
    finalCtaBody:
      "La demo sirve para mostrar criterio visual y estructural. Un proyecto real requiere revisar catálogo, operaciones, pagos, soporte, logística y mantenimiento.",
    routeImplemented: true
  },
  {
    slug: "portik-demo",
    title: "Portik demo",
    headline: "Panel demostrativo para portería, novedades y trazabilidad residencial.",
    summary:
      "Demo conceptual del producto Portik para explicar módulos MVP y narrativa comercial antes de un piloto.",
    problem:
      "Era necesario mostrar el producto sin depender de capturas reales, datos sensibles ni una instalación en vivo.",
    solution:
      "Se construyó un panel visual editorial con módulos ficticios y alcance comercial acotado.",
    outcomes: [
      "mejor soporte visual para pilotos",
      "narrativa comercial más clara",
      "sin exponer datos de residentes ni accesos"
    ],
    tags: ["portik", "demo", "residencial", "mvp"],
    ctaLabel: "Solicitar demo de Portik",
    ctaHref: "/contacto/",
    visibility: "controlled",
    confidentialityNote: "Demo visual sin residentes, placas, reservas ni eventos reales.",
    metaTitle: "Portik demo | SokaTechnologies",
    metaDescription:
      "Demo conceptual de Portik para explicar módulos MVP, panel operativo y propuesta comercial sin datos reales.",
    eyebrow: "Demo controlada",
    heroTitle: "Portik demo para explicar el producto antes de un piloto.",
    heroBody:
      "La demo muestra la lógica general del producto con módulos ficticios, paneles HTML/CSS y narrativa editorial apta para conversación comercial.",
    primaryCtaLabel: "Solicitar demo de Portik",
    primaryCtaHref: "/contacto/",
    secondaryCtaLabel: "Proponer piloto",
    secondaryCtaHref: "/diagnostico/",
    includes: [
      "módulos MVP simulados",
      "panel operativo ficticio",
      "mensajes aptos para piloto controlado"
    ],
    exclusions: ["backend real", "login operativo", "datos de residentes", "hardware o OCR"],
    finalCtaTitle: "La demo sirve para explicar el producto, no para reemplazar una prueba real.",
    finalCtaBody:
      "El siguiente paso correcto sigue siendo un piloto con alcance, reglas de operación y responsables definidos.",
    routeImplemented: false
  },
  {
    slug: "dashboard-demo",
    title: "Dashboard demo",
    headline: "Indicadores ficticios para explicar reporting operativo y gerencial.",
    summary:
      "Demo de paneles y reportes para mostrar estructura de KPIs, filtros y lectura ejecutiva sin usar datos de clientes.",
    problem:
      "No era viable mostrar dashboards reales por confidencialidad y porque la calidad del dato cambia en cada cliente.",
    solution:
      "Se preparó una demo con señales visuales genéricas y jerarquía editorial enfocada en la toma de decisiones.",
    outcomes: [
      "mejor conversación sobre KPIs",
      "demostración segura sin datos reales",
      "base útil para propuestas de reporting"
    ],
    tags: ["dashboard", "demo", "KPIs", "reportes"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "public",
    confidentialityNote: "Los indicadores de la demo son ficticios y no representan resultados reales.",
    metaTitle: "Dashboard demo | SokaTechnologies",
    metaDescription:
      "Demo de paneles y reportes con indicadores ficticios para conversaciones sobre reporting operativo y gerencial.",
    eyebrow: "Demo propia",
    heroTitle: "Dashboard demo para hablar de decisiones, no de cifras inventadas.",
    heroBody:
      "Esta pieza sirve para explicar cómo ordenar indicadores y lectura ejecutiva sin mostrar fuentes reales ni métricas de clientes.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver servicios",
    secondaryCtaHref: "/servicios/",
    includes: ["estructura de KPIs", "jerarquía visual", "narrativa gerencial"],
    exclusions: ["datos reales", "promesas de performance", "integraciones activas", "exportaciones en vivo"],
    finalCtaTitle: "El dashboard correcto depende del proceso y de la calidad del dato disponible.",
    finalCtaBody:
      "Antes de diseñar un panel real conviene revisar fuentes, criterios de cálculo y decisiones que se quieren mejorar.",
    routeImplemented: false
  },
  {
    slug: "automatizacion-demo",
    title: "Automatización demo",
    headline: "Flujos simulados para explicar reglas, validaciones y seguimiento sin tocar sistemas reales.",
    summary:
      "Demo orientada a mostrar criterio de automatización, estados y manejo de excepciones dentro de un flujo operativo ficticio.",
    problem:
      "Las automatizaciones reales suelen depender de accesos, reglas internas y datos sensibles que no deben exponerse públicamente.",
    solution:
      "Se presenta un flujo demostrativo con pasos, validaciones y estados para explicar enfoque técnico y operativo.",
    outcomes: [
      "mejor comprensión del alcance",
      "material seguro para ventas consultivas",
      "sin exponer credenciales ni integraciones"
    ],
    tags: ["automatización", "demo", "flujos", "integraciones"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "public",
    confidentialityNote: "La demo no toca credenciales, APIs ni información sensible de terceros.",
    metaTitle: "Automatización demo | SokaTechnologies",
    metaDescription:
      "Demo de automatización con flujos simulados para explicar reglas, validaciones y seguimiento sin usar sistemas reales.",
    eyebrow: "Demo propia",
    heroTitle: "Automatización demo para explicar criterio, no para exponer una integración real.",
    heroBody:
      "La pieza demuestra cómo ordenar reglas, estados y excepciones antes de hablar de conectores concretos o despliegues.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver servicios",
    secondaryCtaHref: "/servicios/",
    includes: ["flujo editorial", "estados simulados", "validaciones de ejemplo"],
    exclusions: ["integraciones reales", "credenciales", "accesos productivos", "datos sensibles"],
    finalCtaTitle: "Primero se define el flujo y luego se elige la automatización correcta.",
    finalCtaBody:
      "Si el proceso todavía cambia mucho, conviene aclarar responsables, excepciones y riesgos antes de construir la integración.",
    routeImplemented: false
  }
];

export const getDemoBySlug = (slug: string) => demos.find((demo) => demo.slug === slug);
