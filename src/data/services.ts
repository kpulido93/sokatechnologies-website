import type { ServiceContent } from "./types";

export const auditServiceSlugs = {
  corporateWebsite: "sitios-web-corporativos",
  automation: "automatizaciones",
  dashboard: "dashboards",
  consulting: "consultoria-ti-devops",
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
    audience:
      "Para gerencias, operaciones y equipos de TI que necesitan ordenar un proceso crítico sin perder control sobre usuarios, datos y estados.",
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
    audience:
      "Para operaciones, administración, ventas y TI cuando varias herramientas deben intercambiar información con reglas y permisos claros.",
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
    title: "Power BI y Business Intelligence",
    headline: "Indicadores confiables para decidir con una lectura común del negocio.",
    summary:
      "Consolidamos fuentes y construimos dashboards, reportes e indicadores para gerencia, operaciones y seguimiento.",
    problem:
      "Reportes manuales, fuentes dispersas, indicadores inconsistentes y poca visibilidad sobre el estado real de la operación.",
    solution:
      "Una capa de lectura común sobre los datos disponibles, con criterios de cálculo claros y acceso segmentado cuando aplica.",
    outcomes: [
      "mejor visibilidad del negocio",
      "menos reportes manuales",
      "reglas de cálculo más claras",
      "decisiones mejor sustentadas"
    ],
    tags: ["Power BI", "Business Intelligence", "KPIs", "reportes"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/dashboards/",
    visibility: "public",
    confidentialityNote: "Los indicadores mostrados en la demo son ficticios y de uso editorial.",
    metaTitle: "Power BI y Business Intelligence | SokaTechnologies",
    metaDescription:
      "Power BI, dashboards y reportes para consolidar datos y convertirlos en indicadores útiles para gerencia y operación.",
    heroTitle: "Power BI y Business Intelligence para decidir con mejores datos.",
    heroBody:
      "Ayudamos a consolidar fuentes, definir indicadores y construir dashboards de Power BI que mejoren la lectura operativa y gerencial.",
    audience:
      "Para dirección, gerencia y responsables de operación que necesitan una lectura común de indicadores, fuentes y criterios de cálculo.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Explorar servicios",
    secondaryCtaHref: "/servicios/",
    painSignals: [
      "La gerencia recibe reportes tarde o con criterios distintos según el área.",
      "Los KPIs cambian de una hoja a otra y nadie confía del todo en el número final.",
      "Se invierte demasiado tiempo consolidando datos antes de poder decidir."
    ],
    deliverables: ["modelo de indicadores", "consolidación de fuentes", "dashboard de Power BI", "guía de lectura"],
    includes: [
      "definición de indicadores clave",
      "revisión de fuentes disponibles",
      "consolidación y modelado inicial de datos",
      "dashboard operativo o gerencial en Power BI",
      "acceso segmentado cuando el contexto lo requiere"
    ],
    exclusions: [
      "data warehouse complejo no acordado",
      "IA o ciencia de datos avanzada",
      "limpieza masiva no diagnosticada",
      "cambios ilimitados de KPIs"
    ],
    relatedCaseSlugs: ["empresa-servicios-rd", "empresa-regulada-panama"],
    faqs: [
      {
        question: "¿Power BI sirve si los datos actuales están desordenados?",
        answer:
          "Puede servir como objetivo, pero primero conviene revisar fuentes, criterios de cálculo y calidad del dato para no construir visibilidad sobre una base frágil."
      },
      {
        question: "¿Qué indicadores y fuentes se priorizan al inicio?",
        answer:
          "Los que realmente ayudan a tomar decisiones operativas o gerenciales, no una lista extensa de métricas que nadie consulta."
      },
      {
        question: "¿Se puede construir por fases?",
        answer:
          "Sí. Suele ser más útil empezar con un grupo acotado de KPIs y ampliar el panel cuando ya existe claridad sobre lectura y uso."
      }
    ],
    finalCtaTitle: "Antes de construir un dashboard de Power BI, conviene saber qué decisión quieres mejorar.",
    finalCtaBody:
      "El diagnóstico ayuda a priorizar indicadores, validar fuentes y decidir si hace falta ordenar datos antes de diseñar el panel."
  },
  {
    slug: "consultoria-ti-devops",
    title: "Consultoría TI y DevOps",
    headline: "Procesos técnicos más claros para entregar, monitorear y mejorar.",
    summary:
      "Ayudamos a ordenar herramientas de monitoreo, gestión de servicios, pipelines y releases para reducir fricción técnica.",
    problem:
      "Operación técnica fragmentada, releases manuales y poca claridad sobre incidentes, responsables y prioridades.",
    solution:
      "Un diagnóstico de procesos y herramientas que permite priorizar mejoras técnicas proporcionales al contexto y al riesgo.",
    outcomes: [
      "mejor visibilidad de la operación técnica",
      "releases más consistentes",
      "prioridades más claras ante incidencias",
      "base para mejorar procesos por fases"
    ],
    tags: ["consultoría TI", "DevOps", "ITSM", "CI/CD"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/consultoria-ti-devops/",
    visibility: "public",
    confidentialityNote:
      "El alcance se define tras revisar herramientas, procesos y restricciones reales del entorno.",
    metaTitle: "Consultoría TI y DevOps | SokaTechnologies",
    metaDescription:
      "Consultoría TI y DevOps para ordenar monitoreo, ITSM, pipelines, CI/CD y releases con una ruta de mejora proporcional.",
    heroTitle: "Consultoría TI y DevOps para mejorar procesos técnicos.",
    heroBody:
      "Revisamos monitoreo, gestión de servicios, pipelines y releases para ayudar a equipos técnicos a trabajar con más visibilidad y control.",
    audience:
      "Para responsables de TI, operaciones y equipos de desarrollo que necesitan ordenar prácticas, herramientas y entregas sin adoptar complejidad innecesaria.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Hablar sobre tu operación TI",
    secondaryCtaHref: "/contacto/",
    painSignals: [
      "Los incidentes se gestionan con herramientas o criterios distintos según el equipo.",
      "Los despliegues dependen de pasos manuales difíciles de repetir o auditar.",
      "No hay una lectura compartida sobre prioridades, responsables y estado de los servicios."
    ],
    deliverables: [
      "mapa del proceso técnico",
      "prioridades de mejora",
      "flujo de release",
      "recomendaciones documentadas"
    ],
    includes: [
      "revisión de monitoreo y gestión de servicios",
      "análisis de pipelines, CI/CD y releases",
      "criterios de seguimiento y escalamiento",
      "plan de mejora por etapas"
    ],
    exclusions: [
      "operación 24/7 por defecto",
      "migraciones masivas no diagnosticadas",
      "certificaciones o cumplimiento especializado",
      "herramientas específicas impuestas sin evaluación"
    ],
    relatedCaseSlugs: [],
    faqs: [
      {
        question: "¿La consultoría TI incluye implementar todas las recomendaciones?",
        answer:
          "No necesariamente. Primero se define el diagnóstico y el alcance; algunas mejoras pueden ejecutarse por fases o requerir un proyecto separado."
      },
      {
        question: "¿Trabajan con las herramientas que ya tiene el equipo?",
        answer:
          "Sí, el punto de partida es revisar el contexto existente, sus restricciones y el uso real antes de proponer cambios."
      },
      {
        question: "¿DevOps significa migrar todo a la nube?",
        answer:
          "No. DevOps aquí se refiere a mejorar colaboración, automatización y entrega; la arquitectura cloud u on-prem depende del diagnóstico."
      }
    ],
    finalCtaTitle: "La mejora técnica empieza por hacer visible cómo se trabaja hoy.",
    finalCtaBody:
      "Revisemos herramientas, procesos y riesgos para definir una ruta de consultoría TI y DevOps que el equipo pueda sostener."
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
    audience:
      "Para empresas B2B, equipos comerciales y responsables de marketing que necesitan explicar mejor su oferta y facilitar conversaciones calificadas.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Ver proyectos",
    secondaryCtaHref: "/proyectos/",
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
    title: "Infraestructura cloud/on-prem",
    headline: "Una base técnica documentada para sostener la operación.",
    summary:
      "Revisamos y fortalecemos servidores, bases de datos, backups y monitoreo en entornos cloud u on-prem.",
    problem:
      "Backups no verificados, configuraciones frágiles y dependencias técnicas poco claras que aumentan el riesgo de interrupción.",
    solution:
      "Una base de infraestructura más visible y mantenible, con prioridades de continuidad y documentación proporcional al riesgo.",
    outcomes: [
      "mayor estabilidad operativa",
      "menor riesgo de pérdida de información",
      "mejor visibilidad técnica",
      "respuesta más ordenada ante incidencias"
    ],
    tags: ["cloud/on-prem", "servidores", "backups", "continuidad"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/infraestructura-soporte/",
    visibility: "public",
    confidentialityNote: "No se detallan accesos, proveedores ni configuraciones reales del cliente.",
    metaTitle: "Infraestructura cloud/on-prem | SokaTechnologies",
    metaDescription:
      "Infraestructura cloud/on-prem, servidores, bases de datos, backups y monitoreo para fortalecer la continuidad operativa.",
    heroTitle: "Infraestructura cloud/on-prem para mantener tu operación funcionando.",
    heroBody:
      "Ayudamos a mejorar estabilidad y continuidad mediante servidores, bases de datos, hosting, backups y monitoreo documentado.",
    audience:
      "Para responsables de TI y operaciones que necesitan una base documentada para servidores, bases de datos, respaldos, monitoreo y continuidad.",
    primaryCtaLabel: "Solicitar diagnóstico",
    primaryCtaHref: "/diagnostico/",
    secondaryCtaLabel: "Hablar sobre infraestructura",
    secondaryCtaHref: "/contacto/",
    painSignals: [
      "Nadie puede confirmar con seguridad si los backups funcionan o cuándo se probaron.",
      "La operación depende demasiado de configuraciones poco documentadas o de una sola persona.",
      "Las incidencias se atienden de forma reactiva y sin criterio claro de prioridad."
    ],
    deliverables: ["inventario técnico", "revisión de configuración", "backups y monitoreo", "documentación técnica"],
    includes: [
      "inventario técnico básico",
      "revisión de accesos, backups y monitoreo",
      "documentación proporcional al riesgo",
      "prioridades de continuidad y recuperación"
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
        question: "¿Qué revisa Soka primero en infraestructura?",
        answer:
          "Accesos, backups, monitoreo, documentación básica, puntos de falla conocidos y dependencia operativa de servicios críticos."
      },
      {
        question: "¿Incluye operación administrada 24/7?",
        answer:
          "No por defecto. La infraestructura se revisa y mejora según el contexto; cualquier soporte continuo se define como un alcance separado."
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
    title: "Soporte, mantenimiento y mejora continua",
    headline: "Continuidad para que la solución siga siendo útil después de publicar.",
    summary:
      "Acompañamos soluciones existentes con soporte, actualizaciones, monitoreo y mejoras controladas por fases.",
    problem:
      "Sistemas abandonados, correcciones tardías, respaldos desatendidos y falta de una ruta posterior a la entrega.",
    solution:
      "Tecnología con seguimiento, menor riesgo operativo y espacio para iterar sin rehacer la base.",
    outcomes: [
      "continuidad técnica",
      "priorización más clara de incidencias",
      "mejoras menores sin rehacer el sistema",
      "seguimiento operativo periódico"
    ],
    tags: ["soporte", "mantenimiento", "monitoreo", "evolución"],
    ctaLabel: "Ver detalle del servicio",
    ctaHref: "/servicios/mantenimiento-mejora-continua/",
    visibility: "public",
    confidentialityNote: "La continuidad se plantea con backlog y prioridades, no con promesas ilimitadas.",
    metaTitle: "Soporte y mejora continua | SokaTechnologies",
    metaDescription:
      "Soporte, mantenimiento y mejora continua para sistemas, automatizaciones y plataformas que necesitan seguimiento después de publicar.",
    heroTitle: "Soporte y mejora continua para sostener la operación.",
    heroBody:
      "Acompañamos soluciones existentes con correcciones, actualizaciones, monitoreo y mejoras menores para evitar abandono técnico.",
    audience:
      "Para equipos que ya tienen una solución funcionando y necesitan soporte, actualizaciones, seguimiento y una ruta ordenada de evolución.",
    primaryCtaLabel: "Solicitar continuidad",
    primaryCtaHref: "/contacto/",
    secondaryCtaLabel: "Solicitar diagnóstico",
    secondaryCtaHref: "/diagnostico/",
    painSignals: [
      "El sistema sigue vivo, pero nadie prioriza mejoras o incidencias con criterio consistente.",
      "Cada ajuste se vuelve urgente porque no existe seguimiento operativo posterior a la entrega.",
      "La solución funciona, pero la continuidad técnica depende de apagar incendios."
    ],
    deliverables: ["atención de incidencias", "actualizaciones", "revisión periódica", "seguimiento operativo"],
    includes: [
      "backlog priorizado de mejoras e incidencias",
      "ventanas de revisión, monitoreo y seguimiento operativo",
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
