import type { LegalPageContent } from "./types";

export const legalPages: Record<"privacy" | "terms", LegalPageContent> = {
  privacy: {
    title: "Privacidad en modo demo | SokaTechnologies",
    description:
      "Información pública sobre el estado demo de formularios y auditoría de SokaTechnologies.",
    eyebrow: "Información de privacidad",
    heroTitle: "Información de privacidad en preparación.",
    heroBody:
      "El sitio está en modo demo. Esta información breve describe la experiencia visible mientras se prepara el contenido definitivo."
  },
  terms: {
    title: "Uso del sitio en modo demo | SokaTechnologies",
    description:
      "Información sobre el uso del sitio demo de SokaTechnologies y sus límites actuales.",
    eyebrow: "Información del sitio",
    heroTitle: "Uso del sitio en modo demo.",
    heroBody:
      "Estas notas describen el alcance informativo de la experiencia actual y sus límites técnicos conocidos."
  }
};
