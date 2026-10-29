export type SolutionNeed = {
  slug: string;
  title: string;
  body: string;
  services: Array<{ label: string; href: string }>;
};

export const solutionNeeds: SolutionNeed[] = [
  {
    slug: "trabajo-manual",
    title: "Trabajo manual",
    body: "Cuando el equipo repite tareas, copia información o depende de recordatorios para sostener la operación.",
    services: [
      { label: "Automatizaciones e integraciones", href: "/servicios/automatizaciones/" },
      { label: "Software a medida", href: "/servicios/software-a-medida/" }
    ]
  },
  {
    slug: "reportes",
    title: "Reportes",
    body: "Cuando los indicadores llegan tarde, cambian entre fuentes o no ofrecen una lectura común para decidir.",
    services: [
      { label: "Power BI y Business Intelligence", href: "/servicios/dashboards/" },
      { label: "Software a medida", href: "/servicios/software-a-medida/" }
    ]
  },
  {
    slug: "trazabilidad",
    title: "Trazabilidad",
    body: "Cuando cuesta saber quién hizo qué, en qué estado está una solicitud o dónde se detuvo un proceso.",
    services: [
      { label: "Software a medida", href: "/servicios/software-a-medida/" },
      { label: "Consultoría TI y DevOps", href: "/servicios/consultoria-ti-devops/" }
    ]
  },
  {
    slug: "integracion",
    title: "Integración",
    body: "Cuando varias herramientas necesitan compartir información sin duplicar trabajo ni perder controles.",
    services: [
      { label: "Automatizaciones e integraciones", href: "/servicios/automatizaciones/" },
      { label: "Software a medida", href: "/servicios/software-a-medida/" }
    ]
  },
  {
    slug: "infraestructura",
    title: "Infraestructura",
    body: "Cuando la continuidad, los releases, el monitoreo o el soporte técnico necesitan una ruta más clara.",
    services: [
      { label: "Infraestructura y soporte", href: "/servicios/infraestructura-soporte/" },
      { label: "Consultoría TI y DevOps", href: "/servicios/consultoria-ti-devops/" },
      { label: "Mantenimiento y mejora continua", href: "/servicios/mantenimiento-mejora-continua/" }
    ]
  },
  {
    slug: "presencia-web",
    title: "Presencia web",
    body: "Cuando el sitio no explica bien la oferta, no acompaña la conversación comercial o necesita una base más mantenible.",
    services: [{ label: "Sitios web corporativos", href: "/servicios/sitios-web-corporativos/" }]
  }
];
