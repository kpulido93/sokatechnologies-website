export type Visibility = "public" | "anonymized" | "controlled";

export type FaqItem = {
  question: string;
  answer: string;
};

export type CatalogEntry = {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  problem: string;
  solution: string;
  outcomes: string[];
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  visibility: Visibility;
  confidentialityNote: string;
};

export type ServiceContent = CatalogEntry & {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroBody: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  painSignals: string[];
  deliverables: string[];
  includes: string[];
  exclusions?: string[];
  relatedCaseSlugs: string[];
  faqs: FaqItem[];
  finalCtaTitle: string;
  finalCtaBody: string;
};

export type PortikModule = {
  name: string;
  summary: string;
};

export type ProductContent = CatalogEntry & {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  status: string;
  detailRoute: "static" | "dynamic";
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  fitFor: string[];
  includes: string[];
  constraints: string[];
  usageRequirements?: string[];
  usageLimits?: string[];
  pilotProposal?: string[];
  finalCtaTitle: string;
  finalCtaBody: string;
  modules?: PortikModule[];
};

export type CaseStudyContent = CatalogEntry & {
  region: string;
  servicesApplied: string[];
};

export type DemoContent = CatalogEntry & {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  includes: string[];
  exclusions: string[];
  finalCtaTitle: string;
  finalCtaBody: string;
  routeImplemented: boolean;
};

export type LegalPageContent = {
  title: string;
  description: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
};
