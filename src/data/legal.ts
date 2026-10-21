import type { LegalPageContent } from "./types";

export const legalPages: Record<"privacy" | "terms", LegalPageContent> = {
  privacy: {
    title: "Política de privacidad | SokaTechnologies",
    description:
      "Borrador de política de privacidad para Colombia sobre tratamiento de datos, formularios y proveedores tecnológicos, pendiente de revisión legal.",
    eyebrow: "Borrador legal",
    heroTitle: "Política de privacidad — borrador pendiente de revisión legal.",
    heroBody:
      "Este borrador adapta el tratamiento previsto de datos personales al marco colombiano. No es una política legal definitiva ni debe publicarse como tal sin completar sus datos pendientes y obtener revisión jurídica."
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
