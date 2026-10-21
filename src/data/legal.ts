import type { LegalPageContent } from "./types";

export const legalPages: Record<"privacy" | "terms", LegalPageContent> = {
  privacy: {
    title: "Política de privacidad | SokaTechnologies",
    description:
      "Borrador de política de privacidad de SokaTechnologies sobre formularios, proveedores tecnológicos y solicitudes comerciales, pendiente de revisión legal.",
    eyebrow: "Borrador legal",
    heroTitle: "Política de privacidad — borrador pendiente de revisión legal.",
    heroBody:
      "Este documento explica, de forma informativa, cómo podrían gestionarse las solicitudes de contacto y diagnóstico. No es una política legal definitiva ni debe publicarse como tal sin completar sus datos pendientes."
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
