import type { FaqItem, ProductContent, ServiceContent } from "../data/types";
import { siteMeta } from "./site";

export type StructuredData = Record<string, unknown>;

const SITE_URL = import.meta.env.PUBLIC_SITE_URL?.trim() || "https://sokatechnologies.com";
const SITE_NAME = "SokaTechnologies";
const SITE_DESCRIPTION =
  "Software, automatización, Power BI e infraestructura para empresas que necesitan operar con más control.";
const AREA_SERVED = ["Colombia", "Panamá", "República Dominicana", "Latinoamérica"];

const SEGMENT_LABELS: Record<string, string> = {
  casos: "Proyectos",
  contacto: "Contacto",
  demos: "Demos",
  diagnostico: "Diagnóstico",
  ecommerce: "EcomDemo",
  "consultoria-ti-devops": "Consultoría TI y DevOps",
  "infraestructura-soporte": "Infraestructura cloud/on-prem",
  "politica-privacidad": "Política de privacidad",
  productos: "Productos",
  portik: "Portik",
  servicios: "Servicios",
  "sitios-web-corporativos": "Sitios web corporativos",
  "software-a-medida": "Software a medida",
  autoinventario: "AutoInventario",
  autowhatsapp: "AutoWhatsapp",
  automatizaciones: "Automatizaciones",
  dashboards: "Power BI y Business Intelligence",
  terminos: "Términos",
  "mantenimiento-mejora-continua": "Soporte, mantenimiento y mejora continua",
  proyectos: "Proyectos"
};

export const getSiteUrl = () => new URL(SITE_URL);

export const shouldIndexSite = import.meta.env.PUBLIC_SITE_INDEXING?.trim().toLowerCase() === "true";

export const absoluteUrl = (pathname: string, siteUrl: string = SITE_URL) =>
  new URL(pathname, siteUrl).toString();

const stripSiteSuffix = (title: string) => title.split("|")[0].trim();

const labelFromSegment = (segment: string) =>
  SEGMENT_LABELS[segment] ??
  segment
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

export const buildBreadcrumbItems = (
  pathname: string,
  title: string,
  siteUrl: string = SITE_URL
) => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "Inicio", item: absoluteUrl("/", siteUrl) }];

  if (segments.length === 0) {
    return breadcrumbs;
  }

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}/`;
    const isLast = index === segments.length - 1;
    breadcrumbs.push({
      name: isLast ? stripSiteSuffix(title) : labelFromSegment(segment),
      item: absoluteUrl(path, siteUrl)
    });
  });

  return breadcrumbs;
};

export const createOrganizationSchema = (): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  email: siteMeta.email,
  telephone: siteMeta.phone,
  areaServed: AREA_SERVED,
  knowsAbout: [
    "Software a medida",
    "Automatizaciones e integraciones",
    "Power BI y Business Intelligence",
    "Consultoría TI y DevOps",
    "Infraestructura cloud/on-prem",
    "Sitios web corporativos",
    "Soporte y mejora continua"
  ]
});

export const createWebsiteSchema = (): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "es"
});

export const createBreadcrumbSchema = (
  items: Array<{ name: string; item: string }>
): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((breadcrumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: breadcrumb.name,
    item: breadcrumb.item
  }))
});

export const createServiceSchema = (
  service: ServiceContent,
  url: string
): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  serviceType: service.title,
  description: service.metaDescription,
  url,
  areaServed: AREA_SERVED,
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Empresas B2B"
  }
});

const getApplicationCategory = (product: ProductContent) => {
  switch (product.slug) {
    case "portik":
      return "BusinessApplication";
    case "autoinventario":
      return "BusinessApplication";
    case "autowhatsapp":
      return "CommunicationsApplication";
    default:
      return "BusinessApplication";
  }
};

const getOperatingSystem = (product: ProductContent) => {
  switch (product.slug) {
    case "portik":
      return "Web browser";
    case "autoinventario":
    case "autowhatsapp":
      return "Windows";
    default:
      return "Web browser";
  }
};

export const createSoftwareApplicationSchema = (
  product: ProductContent,
  url: string
): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: product.title,
  description: product.metaDescription,
  url,
  applicationCategory: getApplicationCategory(product),
  operatingSystem: getOperatingSystem(product),
  featureList: product.includes,
  creator: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL
  },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Empresas B2B"
  }
});

export const createFaqSchema = (faqs: FaqItem[]): StructuredData => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});
