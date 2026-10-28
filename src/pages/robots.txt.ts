import type { APIRoute } from "astro";
import { shouldIndexSite } from "../lib/seo";

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://sokatechnologies.com";
  const sitemapUrl = new URL("/sitemap-index.xml", siteUrl).toString();
  const body = (shouldIndexSite
    ? ["User-agent: *", "Allow: /", `Sitemap: ${sitemapUrl}`].join("\n")
    : ["User-agent: *", "Disallow: /"].join("\n")) + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
