import type { CaseStudyContent } from "./types";

export const caseStudies: CaseStudyContent[] = [
  {
    slug: "integracion-datos-crm",
    title: "De múltiples archivos a una plataforma empresarial integrada.",
    headline: "Integración de datos y CRM para centralizar información y procesos.",
    summary:
      "Plataforma web desarrollada desde cero para consolidar información de distintas fuentes y conectarla con un sistema CRM.",
    problem:
      "La operación dependía de múltiples archivos y procesos dispersos para consultar, actualizar y dar seguimiento a la información.",
    solution:
      "Se desarrolló una plataforma web propia, se integraron fuentes de información y se conectó la solución con un sistema CRM.",
    outcomes: [
      "menor dependencia de múltiples archivos de trabajo",
      "información más centralizada para la operación",
      "solución e integraciones en producción"
    ],
    tags: ["plataforma web", "integración de datos", "CRM", "software a medida"],
    servicesApplied: ["software a medida", "integraciones", "datos", "CRM"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "public",
    confidentialityNote:
      "Proyecto directo de SokaTechnologies. No se publican nombres, ubicaciones, datos operativos ni capturas del sistema.",
    region: "Proyecto directo"
  },
  {
    slug: "plataforma-empresarial-integral",
    title: "De una idea a una plataforma empresarial en producción.",
    headline: "Una solución integral para convertir requerimientos en operación digital.",
    summary:
      "Plataforma empresarial planificada y desarrollada desde cero con frontend, backend, base de datos, administración interna, roles y reportes.",
    problem:
      "Era necesario convertir requerimientos empresariales en una solución integral, controlable y preparada para evolucionar después de la entrega inicial.",
    solution:
      "Se realizó el levantamiento y análisis de requerimientos, la planificación y el desarrollo de frontend, backend, base de datos, controles internos y reportes.",
    outcomes: [
      "plataforma en producción",
      "operación interna con roles y controles definidos",
      "evolución funcional posterior a la entrega"
    ],
    tags: ["frontend", "backend", "base de datos", "roles y reportes"],
    servicesApplied: ["software a medida", "bases de datos", "roles", "reporting"],
    ctaLabel: "Solicitar diagnóstico",
    ctaHref: "/diagnostico/",
    visibility: "public",
    confidentialityNote:
      "Proyecto directo de SokaTechnologies. No se publican identidad, ubicación, sector regulado ni información sensible.",
    region: "Proyecto directo"
  }
];

export const featuredCaseStudies = caseStudies;
