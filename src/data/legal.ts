import type { LegalPageContent } from "./types";

export const legalPages: Record<"privacy" | "terms", LegalPageContent> = {
  privacy: {
    title: "Política de privacidad | SokaTechnologies",
    description:
      "Borrador informativo de política de privacidad para la web pública de SokaTechnologies, sujeto a revisión legal antes de publicación.",
    eyebrow: "Borrador legal",
    heroTitle: "Política de privacidad en revisión antes de publicación final.",
    heroBody:
      "Este texto se presenta como borrador informativo. Debe validarse legalmente antes de usarse como política definitiva en producción."
  },
  terms: {
    title: "Términos | SokaTechnologies",
    description:
      "Borrador informativo de términos de uso para la web pública de SokaTechnologies, sujeto a revisión legal antes de publicación.",
    eyebrow: "Borrador legal",
    heroTitle: "Términos de uso en revisión antes de publicación final.",
    heroBody:
      "Este texto se presenta como borrador informativo. Debe validarse legalmente antes de usarse como documento contractual o legal definitivo."
  }
};
