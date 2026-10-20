import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    sitemap({
      // /casos/ is a temporary compatibility URL; /proyectos/ is canonical.
      filter: (page) => !["/casos", "/casos/"].includes(new URL(page).pathname)
    })
  ],
  output: "static",
  site: "https://sokatechnologies.com",
  server: {
    host: true
  }
});
