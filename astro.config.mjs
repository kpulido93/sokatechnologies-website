import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Astro evaluates this file before Vite exposes import.meta.env. Read the
// explicit CLI mode first so --mode staging wins over NODE_ENV=production.
const modeArgument = process.argv.find((argument) => argument.startsWith("--mode="));
const modeIndex = process.argv.indexOf("--mode");
const modeValue = modeIndex >= 0 ? process.argv[modeIndex + 1] : undefined;
const mode = modeArgument?.slice("--mode=".length) || modeValue || process.env.NODE_ENV || "development";
const fileEnv = loadEnv(mode, process.cwd(), "PUBLIC_");
const processEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith("PUBLIC_")));
const env = { ...fileEnv, ...processEnv };
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
