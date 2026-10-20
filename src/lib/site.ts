import { services } from "../data/services";

export type NavItem = {
  href: string;
  label: string;
};

export type MetricItem = {
  value: string;
  label: string;
  detail: string;
};

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

export type SectorItem = {
  title: string;
  body: string;
};

export const siteMeta = {
  name: "SokaTechnologies",
  shortName: "Soka",
  tagline: "Conectamos sistemas, optimizamos procesos y convertimos datos en decisiones.",
  email: "info@sokatechnologies.com",
  regions: "Panamá, República Dominicana y Latinoamérica",
  diagnosisHref: "/diagnostico/"
} as const;

export const navItems: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/servicios/", label: "Servicios" },
  { href: "/proyectos/", label: "Proyectos" },
  { href: "/nosotros/", label: "Nosotros" },
  { href: "/contacto/", label: "Contacto" }
];

export const metrics: MetricItem[] = [
  {
    value: "01",
    label: "diagnóstico antes que plantilla",
    detail: "Cada conversación parte del proceso, no de una lista cerrada de funcionalidades."
  },
  {
    value: "07",
    label: "frentes coordinados",
    detail: "Software, automatización, BI, consultoría TI/DevOps, web, infraestructura y soporte bajo una misma narrativa."
  },
  {
    value: "100%",
    label: "demo segura",
    detail: "La experiencia está construida con datos ficticios y mensajes aptos para una demo B2B."
  }
];

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Diagnóstico",
    body: "Entendemos el proceso actual, la fricción principal, las herramientas existentes y el impacto real del problema."
  },
  {
    index: "02",
    title: "Alcance y propuesta",
    body: "Definimos entregables, exclusiones, criterios de aceptación y una ruta de trabajo proporcional al objetivo."
  },
  {
    index: "03",
    title: "Diseño y desarrollo",
    body: "Construimos la solución con foco en claridad, mantenibilidad, seguridad básica y uso real por parte del cliente."
  },
  {
    index: "04",
    title: "Pruebas y despliegue",
    body: "Validamos con escenarios representativos, ajustamos detalles y reducimos riesgo antes de liberar el entregable."
  },
  {
    index: "05",
    title: "Soporte y mejora continua",
    body: "Acompañamos la solución para sostener continuidad operativa y permitir mejoras por fases."
  }
];

export const noiseProblems = [
  "Hojas de cálculo dispersas",
  "Reportes manuales",
  "Procesos sin trazabilidad",
  "Sistemas desconectados",
  "Soporte reactivo",
  "Datos difíciles de consultar"
];

export const noiseResults = [
  "Procesos medibles",
  "Automatización útil",
  "Reportes confiables",
  "Seguimiento por roles",
  "Continuidad técnica",
  "Mejor criterio operativo"
];

export const sectorItems: SectorItem[] = [
  {
    title: "Empresas de servicios",
    body: "Cuando la operación depende demasiado de seguimiento manual, reportes recurrentes y coordinación entre áreas."
  },
  {
    title: "Pymes B2B en crecimiento",
    body: "Cuando necesitan una base más profesional para procesos internos, soporte técnico y presencia digital."
  },
  {
    title: "Operaciones con auditoría o control",
    body: "Cuando la trazabilidad, los accesos y la continuidad operativa ya no pueden dejarse a la improvisación."
  },
  {
    title: "Administradores de condominios",
    body: "Cuando el flujo de visitantes, vehículos, reservas y novedades necesita una plataforma más clara y ordenada."
  }
];

export const contactServiceOptions = [
  ...services.map((service) => service.title)
];

export const footerGroups = [
  {
    title: "SokaTechnologies",
    links: [
      { href: "/", label: "Inicio" },
      { href: "/servicios/", label: "Servicios" },
      { href: "/proyectos/", label: "Proyectos" },
      { href: "/nosotros/", label: "Nosotros" }
    ]
  },
  {
    title: "Servicios",
    links: services.map((service) => ({
      href: service.ctaHref,
      label: service.title
    }))
  },
  {
    title: "Información",
    links: [
      { href: "/contacto/", label: "Contacto" },
      { href: "/nosotros/", label: "Nosotros" },
      { href: "/politica-privacidad/", label: "Política de privacidad" },
      { href: "/terminos/", label: "Términos" }
    ]
  },
  {
    title: "Contacto / Diagnóstico",
    links: [
      { href: "/contacto/", label: "Abrir conversación" },
      { href: "/diagnostico/", label: "Solicitar diagnóstico" },
      { href: "/proyectos/", label: "Ver proyectos" },
      { href: `mailto:${siteMeta.email}`, label: siteMeta.email }
    ]
  }
];
