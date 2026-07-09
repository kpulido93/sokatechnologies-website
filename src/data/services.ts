import type { ServiceContent } from "./types";

export const auditServiceSlugs = {
  corporateWebsite: "sitios-web-corporativos",
  automation: "automatizaciones",
  dashboard: "dashboards",
  infrastructure: "infraestructura-soporte",
  support: "mantenimiento-mejora-continua"
} as const;

export const services: ServiceContent[] = [
  {
    slug: "software-a-medida",
    title: "Software a medida",
    headline: "Sistemas internos para operaciones que necesitan orden y trazabilidad.",
    summary:
      "Construimos portales, sistemas administrativos y herramientas de back-office cuando la empresa ya no puede depender de hojas de cálculo, correos o procesos informales.",
    problem:
      "Procesos críticos dispersos, datos difíciles de consultar y dependencia de una sola persona para sostener la operación.",
    solution:
      "Una base tecnológica mantenible con roles, datos estructurados, reportes básicos y más control sobre tareas clave.",
    outcomes: [
      "más control operativo",
      "menos errores manuales",
      "mejor trazabilidad de acciones y estados",
      "base mantenible para crecer por módulos"
    ],
    tags: ["software a medida", "back-office", "trazabilidad", "reportes"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/software-a-medida/",
    visibility: "public",
    confidentialityNote: "La demo no expone procesos ni datos reales de clientes.",
    metaTitle: "Software a medida | SokaTechnologies",
    metaDescription:
      "Software a medida para empresas que necesitan sistemas internos, captura ordenada de datos y más control operativo.",
    heroTitle: "Software a medida para controlar procesos operativos.",
    heroBody:
      "Creamos sistemas internos, portales administrativos y herramientas digitales para empresas que necesitan dejar atrás procesos manuales, hojas de cálculo dispersas y operación sin trazabilidad.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Volver a servicios",
    secondaryCtaHref: "/servicios/",
    painSignals: [
      "El proceso depende de hojas de cálculo, correos y seguimiento manual.",
      "No hay roles, estados o trazabilidad suficientes para operar con claridad.",
      "La información crítica termina concentrada en una o dos personas."
    ],
    deliverables: ["levantamiento del proceso", "alcance funcional", "roles y permisos", "reportes operativos"],
    includes: [
      "levantamiento del proceso actual",
      "roles, permisos y reglas de operación",
      "formularios, búsquedas y reportes básicos",
      "entrega por fases con criterio de aceptación"
    ],
    exclusions: [
      "apps móviles nativas",
      "cambios ilimitados fuera de alcance",
      "arquitectura avanzada no acordada",
      "cumplimiento especializado fuera del diagnóstico"
    ],
    relatedCaseSlugs: ["empresa-regulada-panama", "empresa-servicios-rd"],
    faqs: [
      {
        question: "¿Cuándo conviene software a medida frente a una automatización puntual?",
        answer:
          "Suele tener más sentido cuando el problema requiere roles, estados, trazabilidad, reglas de operación y una base propia para sostener el proceso en el tiempo."
      },
      {
        question: "¿Soka reemplaza por completo los sistemas actuales?",
        answer:
          "No necesariamente. En muchos casos conviene convivir con herramientas existentes, integrar partes críticas o construir por fases antes de reemplazar algo completo."
      },
      {
        question: "¿Cómo se define el alcance inicial?",
        answer:
          "A partir del diagnóstico: proceso actual, usuarios, datos, restricciones, riesgos y entregables mínimos que realmente mejoren la operación."
      }
    ],
    finalCtaTitle: "Si el proceso es crítico, conviene dejar de depender de archivos sueltos.",
    finalCtaBody:
      "Una conversación de diagnóstico ayuda a decidir si la mejor ruta es un sistema a medida, una automatización puntual o una combinación de ambos."
  },
  {
    slug: "automatizaciones",
    title: "Automatizaciones e integraciones",
    headline: "Menos tareas manuales. Más consistencia entre herramientas.",
    summary:
      "Automatizamos pasos repetitivos, validaciones, notificaciones y conexiones entre plataformas para reducir fricción operativa.",
    problem:
      "Doble digitación, seguimientos manuales y procesos lentos por falta de conexión entre sistemas.",
    solution:
      "Flujos más rápidos, menos errores y mejor control sobre tareas que antes dependían de memoria o copia manual.",
    outcomes: [
      "menos trabajo manual",
      "menos errores por repetición",
      "mejor seguimiento de tareas críticas",
      "datos más consistentes entre herramientas"
    ],
    tags: ["automatización", "integraciones", "flujos", "operación"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/automatizaciones/",
    visibility: "public",
    confidentialityNote:
      "No se presentan automatizaciones para spam, scraping ni usos sin autorización.",
    metaTitle: "Automatizaciones | SokaTechnologies",
    metaDescription:
      "Automatizaciones para reducir trabajo manual, errores operativos y seguimiento disperso entre herramientas.",
    heroTitle: "Automatizaciones para reducir trabajo manual y errores operativos.",
    heroBody:
      "Ayudamos a empresas a automatizar tareas repetitivas, conectar herramientas, generar reportes y dar seguimiento a procesos con reglas claras.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Hablar sobre un flujo",
    secondaryCtaHref: "/contacto/",
    painSignals: [
      "Hay tareas repetitivas que consumen tiempo todos los días.",
      "El equipo copia información entre sistemas o depende de recordatorios manuales.",
      "Los errores aparecen porque el flujo no tiene validaciones ni seguimiento claros."
    ],
    deliverables: ["diseño del flujo", "reglas operativas", "manejo de errores", "documentación del proceso"],
    includes: [
      "diagnóstico del flujo actual",
      "reglas de negocio y validaciones",
      "integraciones y procesamiento básico",
      "documentación de operación y errores"
    ],
    exclusions: [
      "scraping de contactos",
      "campañas masivas no solicitadas",
      "automatizaciones para loterías o apuestas",
      "integraciones sin acceso autorizado"
    ],
    relatedCaseSlugs: ["automatizacion-ivr-centralita", "mensajeria-operativa-consentida"],
    faqs: [
      {
        question: "¿Qué procesos conviene automatizar primero?",
        answer:
          "Los que son repetitivos, tienen reglas claras, generan errores manuales o afectan tiempos de respuesta entre áreas y herramientas."
      },
      {
        question: "¿Hace falta tener APIs para automatizar?",
        answer:
          "No siempre, pero sí hace falta revisar el contexto técnico y los límites permitidos. El diagnóstico define si conviene integrar, transformar datos o rediseñar parte del flujo."
      },
      {
        question: "¿Cómo se controlan errores y excepciones?",
        answer:
          "Diseñando reglas, validaciones, manejo de fallos y criterios de seguimiento antes de automatizar, no después."
      }
    ],
    finalCtaTitle: "Automatizar bien implica primero entender qué parte del proceso sí merece reglas.",
    finalCtaBody:
      "Si el flujo todavía es ambiguo, el siguiente paso correcto es aclarar responsables, excepciones y riesgos antes de automatizar."
  },
  {
    slug: "dashboards",
    title: "Dashboards y reportes",
    headline: "Visibilidad ejecutiva para procesos que hoy se revisan tarde o a mano.",
    summary:
      "Creamos paneles y reportes para transformar datos dispersos en indicadores útiles para gerencia, operaciones y seguimiento.",
    problem:
      "Reportes manuales, indicadores inconsistentes y poca visibilidad sobre el estado real de la operación.",
    solution:
      "Seguimiento más claro, menos tiempo consolidando información y decisiones mejor sustentadas.",
    outcomes: [
      "mejor visibilidad del negocio",
      "menos reportes manuales",
      "reglas de cálculo más claras",
      "decisiones mejor sustentadas"
    ],
    tags: ["dashboards", "reportes", "KPIs", "gerencia"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/dashboards/",
    visibility: "public",
    confidentialityNote: "Los indicadores mostrados en la demo son ficticios y de uso editorial.",
    metaTitle: "Dashboards | SokaTechnologies",
    metaDescription:
      "Dashboards y reportes para convertir datos dispersos en indicadores claros para gerencia y operación.",
    heroTitle: "Dashboards y reportes para tomar mejores decisiones.",
    heroBody:
      "Ayudamos a convertir datos dispersos en indicadores operativos y reportes claros, reduciendo reportes manuales y mejorando visibilidad del negocio.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Explorar servicios",
    secondaryCtaHref: "/servicios/",
    painSignals: [
      "La gerencia recibe reportes tarde o con criterios distintos según el área.",
      "Los KPIs cambian de una hoja a otra y nadie confía del todo en el número final.",
      "Se invierte demasiado tiempo consolidando datos antes de poder decidir."
    ],
    deliverables: ["definición de KPIs", "consolidación de fuentes", "dashboard gerencial", "guía de lectura"],
    includes: [
      "definición de indicadores clave",
      "revisión de fuentes disponibles",
      "consolidación básica de datos",
      "dashboard operativo o gerencial"
    ],
    exclusions: [
      "data warehouse complejo",
      "IA o ciencia de datos avanzada",
      "limpieza masiva no diagnosticada",
      "cambios ilimitados de KPIs"
    ],
    relatedCaseSlugs: ["empresa-servicios-rd", "empresa-regulada-panama"],
    faqs: [
      {
        question: "¿Un dashboard sirve si los datos actuales están desordenados?",
        answer:
          "Puede servir como objetivo, pero primero conviene revisar fuentes, criterios de cálculo y calidad del dato para no construir visibilidad sobre una base frágil."
      },
      {
        question: "¿Qué indicadores se priorizan al inicio?",
        answer:
          "Los que realmente ayudan a tomar decisiones operativas o gerenciales, no una lista extensa de métricas que nadie consulta."
      },
      {
        question: "¿Se puede construir por fases?",
        answer:
          "Sí. Suele ser más útil empezar con un grupo acotado de KPIs y ampliar el panel cuando ya existe claridad sobre lectura y uso."
      }
    ],
    finalCtaTitle: "Antes de construir un dashboard, conviene saber qué decisión quieres mejorar.",
    finalCtaBody:
      "El diagnóstico ayuda a priorizar indicadores, validar fuentes y decidir si hace falta ordenar datos antes de diseñar el panel."
  },
  {
    slug: "sitios-web-corporativos",
    title: "Sitios web corporativos",
    headline: "Presencia digital B2B con claridad comercial y mejor control técnico.",
    summary:
      "Diseñamos experiencias web corporativas para explicar servicios, convertir visitas en conversaciones y sostener una imagen seria ante clientes potenciales.",
    problem:
      "Sitios confusos, desactualizados o incapaces de explicar claramente qué hace la empresa.",
    solution:
      "Una base editorial más clara para ventas consultivas, SEO y futuros materiales comerciales.",
    outcomes: [
      "presencia digital más profesional",
      "mejor explicación de la oferta",
      "más facilidad para recibir oportunidades",
      "base mantenible para crecer por contenido"
    ],
    tags: ["web corporativa", "SEO técnico", "B2B", "conversión"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/sitios-web-corporativos/",
    visibility: "public",
    confidentialityNote: "La estructura editorial evita claims exagerados y no usa activos de terceros.",
    metaTitle: "Sitios web corporativos | SokaTechnologies",
    metaDescription:
      "Sitios web corporativos para explicar servicios B2B con claridad, credibilidad y mejores puntos de contacto.",
    heroTitle: "Sitios web corporativos para presentar tu empresa con claridad.",
    heroBody:
      "Ayudamos a construir presencia digital profesional, confiable y alineada con la oferta real de la empresa para ventas consultivas B2B.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver casos",
    secondaryCtaHref: "/casos/",
    painSignals: [
      "El sitio actual no explica con claridad qué hace la empresa ni para quién trabaja.",
      "La navegación no ayuda a generar conversaciones comerciales relevantes.",
      "La presencia digital quedó desactualizada frente al nivel real de la operación."
    ],
    deliverables: ["arquitectura de páginas", "copy base", "layout responsive", "SEO técnico inicial"],
    includes: [
      "arquitectura de páginas y navegación",
      "copy base para servicios y contacto",
      "responsive y SEO técnico inicial",
      "formularios y puntos de conversión"
    ],
    exclusions: [
      "branding completo desde cero",
      "e-commerce complejo",
      "campañas pagadas y social media",
      "posicionamiento SEO garantizado"
    ],
    relatedCaseSlugs: ["empresa-servicios-rd", "demo-ecommerce"],
    faqs: [
      {
        question: "¿Por qué no empezar solo por el diseño visual?",
        answer:
          "Porque en B2B la claridad comercial, la estructura de páginas y los puntos de contacto suelen influir más que una estética aislada sin mensaje."
      },
      {
        question: "¿La página incluye SEO?",
        answer:
          "Incluye base técnica y estructura semántica inicial. La captación por búsqueda requiere además contenido, mantenimiento y evolución editorial."
      },
      {
        question: "¿Puede convivir con una web o CMS existente?",
        answer:
          "Sí, siempre que se revise arquitectura, contenido, restricciones técnicas y la mejor forma de migrar o convivir por etapas."
      }
    ],
    finalCtaTitle: "Un sitio corporativo útil no solo se ve mejor: explica mejor.",
    finalCtaBody:
      "Si hoy tu presencia digital no ayuda a vender ni a generar confianza, conviene revisar primero estructura, mensaje y objetivos comerciales."
  },
  {
    slug: "infraestructura-soporte",
    title: "Infraestructura y soporte",
    headline: "Servidores, backups y continuidad con menos improvisación.",
    summary:
      "Ayudamos a revisar, ordenar y fortalecer entornos que necesitan estabilidad, recuperación y documentación proporcional al riesgo.",
    problem:
      "Backups no verificados, configuraciones frágiles y dependencias técnicas poco claras.",
    solution:
      "Mejor base de continuidad, monitoreo básico y menor exposición operativa ante fallos.",
    outcomes: [
      "mayor estabilidad operativa",
      "menor riesgo de pérdida de información",
      "mejor visibilidad técnica",
      "respuesta más ordenada ante incidencias"
    ],
    tags: ["infraestructura", "backups", "monitoreo", "soporte"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/infraestructura-soporte/",
    visibility: "public",
    confidentialityNote: "No se detallan accesos, proveedores ni configuraciones reales del cliente.",
    metaTitle: "Infraestructura y soporte | SokaTechnologies",
    metaDescription:
      "Infraestructura cloud/on-prem, backups, monitoreo, documentación y soporte técnico para continuidad operativa.",
    heroTitle: "Infraestructura y soporte para mantener tu operación funcionando.",
    heroBody:
      "Ayudamos a mejorar estabilidad, seguridad básica y continuidad de sistemas mediante servidores cloud/on-prem, hosting, backups, monitoreo y soporte técnico.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Hablar sobre continuidad",
    secondaryCtaHref: "/contacto/",
    painSignals: [
      "Nadie puede confirmar con seguridad si los backups funcionan o cuándo se probaron.",
      "La operación depende demasiado de configuraciones poco documentadas o de una sola persona.",
      "Las incidencias se atienden de forma reactiva y sin criterio claro de prioridad."
    ],
    deliverables: ["revisión inicial", "mejoras de configuración", "backups y monitoreo", "documentación técnica"],
    includes: [
      "inventario técnico básico",
      "revisión de accesos, backups y monitoreo",
      "documentación proporcional al riesgo",
      "soporte mensual y mejoras menores cuando aplica"
    ],
    exclusions: [
      "soporte 24/7 por defecto",
      "alta disponibilidad avanzada no acordada",
      "auditoría formal de seguridad",
      "recuperación de datos no respaldados"
    ],
    relatedCaseSlugs: ["empresa-regulada-panama", "inventario-activos-ti"],
    faqs: [
      {
        question: "¿Qué revisa Soka primero en infraestructura y soporte?",
        answer:
          "Accesos, backups, monitoreo, documentación básica, puntos de falla conocidos y dependencia operativa de servicios críticos."
      },
      {
        question: "¿Incluye soporte 24/7?",
        answer:
          "No por defecto. El nivel de soporte se define según criticidad, horarios, riesgos y el alcance realmente necesario para la operación."
      },
      {
        question: "¿Trabajan cloud y on-prem?",
        answer:
          "Sí, siempre que el diagnóstico permita entender restricciones, continuidad requerida, dependencia de proveedores y capacidad real de mantenimiento."
      }
    ],
    finalCtaTitle: "Si la operación ya depende de la tecnología, conviene dejar de mantenerla por intuición.",
    finalCtaBody:
      "Una revisión inicial ayuda a priorizar riesgos, backups, accesos y monitoreo antes de que el siguiente incidente decida por ti."
  },
  {
    slug: "mantenimiento-mejora-continua",
    title: "Mantenimiento y mejora continua",
    headline: "Acompañamiento para que la solución siga siendo útil después de publicar.",
    summary:
      "Damos soporte, mantenimiento y mejoras controladas cuando el negocio necesita continuidad, seguimiento y evolución por fases.",
    problem:
      "Sistemas abandonados, correcciones tardías y falta de una ruta de mejora posterior a la entrega.",
    solution:
      "Tecnología con seguimiento, menor riesgo operativo y espacio para iterar sin rehacer la base.",
    outcomes: [
      "continuidad técnica",
      "priorización más clara de incidencias",
      "mejoras menores sin rehacer el sistema",
      "seguimiento operativo periódico"
    ],
    tags: ["mantenimiento", "soporte continuo", "evolución", "incidencias"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/mantenimiento-mejora-continua/",
    visibility: "public",
    confidentialityNote: "La continuidad se plantea con backlog y prioridades, no con promesas ilimitadas.",
    metaTitle: "Mantenimiento y mejora continua | SokaTechnologies",
    metaDescription:
      "Mantenimiento y mejora continua para sistemas, automatizaciones y plataformas que necesitan seguimiento después de salir a producción.",
    heroTitle: "Mantenimiento y mejora continua para sostener la operación.",
    heroBody:
      "Acompañamos soluciones existentes con correcciones, mejoras menores y seguimiento operativo para evitar abandono técnico después de la entrega inicial.",
    primaryCtaLabel: "Solicitar continuidad",
    primaryCtaHref: "/contacto/",
    secondaryCtaLabel: "Solicitar diagnóstico",
    secondaryCtaHref: "/diagnostico/",
    painSignals: [
      "El sistema sigue vivo, pero nadie prioriza mejoras o incidencias con criterio consistente.",
      "Cada ajuste se vuelve urgente porque no existe seguimiento operativo posterior a la entrega.",
      "La solución funciona, pero la continuidad técnica depende de apagar incendios."
    ],
    deliverables: ["atención de incidencias", "mejoras menores", "revisión periódica", "seguimiento operativo"],
    includes: [
      "backlog priorizado de mejoras e incidencias",
      "ventanas de revisión y seguimiento operativo",
      "mejoras menores sobre la base existente",
      "criterio claro para nuevos alcances"
    ],
    exclusions: [
      "bolsa ilimitada de cambios",
      "rediseño completo no acordado",
      "soporte 24/7 por defecto",
      "incidencias fuera del alcance técnico pactado"
    ],
    relatedCaseSlugs: ["empresa-servicios-rd", "portik"],
    faqs: [
      {
        question: "¿En qué se diferencia soporte de mejora continua?",
        answer:
          "El soporte atiende incidencias y continuidad básica; la mejora continua añade criterio de backlog, priorización y evolución controlada sobre la solución existente."
      },
      {
        question: "¿Se puede trabajar sobre un sistema ya publicado?",
        answer:
          "Sí, siempre que primero se revise su estado, dependencias, riesgos y la forma correcta de intervenir sin romper la operación."
      },
      {
        question: "¿Qué tipo de cambios suelen entrar en esta etapa?",
        answer:
          "Ajustes menores, correcciones, mejoras operativas, seguimiento periódico y decisiones sobre qué sí conviene escalar a un nuevo alcance."
      }
    ],
    finalCtaTitle: "Publicar una solución no cierra el trabajo: abre la etapa de continuidad.",
    finalCtaBody:
      "Si ya tienes una base funcionando y necesitas sostenerla con orden, el siguiente paso es revisar backlog, riesgo operativo y expectativas de soporte."
  }
];

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);
