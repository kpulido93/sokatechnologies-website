import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Astro evaluates this file before Vite exposes import.meta.env. Set NODE_ENV
// to the build mode when loading a mode-specific .env file.
const mode = process.env.NODE_ENV ?? "development";
const env = loadEnv(mode, process.cwd(), "PUBLIC_");
const siteUrl = env.PUBLIC_SITE_URL?.trim() || "https://sokatechnologies.com";

export default defineConfig({
  integrations: [
    sitemap({
      // /casos/ is a temporary compatibility URL; /proyectos/ is canonical.
      filter: (page) => !["/casos", "/casos/"].includes(new URL(page).pathname)
    })
  ],
  output: "static",
  site: siteUrl,
  server: {
    host: true
  }
});
