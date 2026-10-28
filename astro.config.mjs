import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

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
