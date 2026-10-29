import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createPublicRouteInventory } from "./public-route-inventory.mjs";

const dist = process.env.SEO_DIST || join(process.cwd(), "dist");
const expectedOrigin = (process.env.SEO_EXPECTED_ORIGIN || "https://sokatechnologies.com").replace(/\/+$/, "");
const expectIndexing = process.env.SEO_EXPECT_INDEXING?.trim().toLowerCase() === "true";
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const htmlPath = (route) => (route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html"));
const readHtml = (route) => readFileSync(htmlPath(route), "utf8");
const tags = (html, name, attributeName) => {
  const pattern = new RegExp(`<${name}\\b[^>]*${attributeName}=["'][^"']+["'][^>]*>`, "gi");
  return html.match(pattern) ?? [];
};
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] ?? null;
const linkByRel = (html, rel) =>
  tags(html, "link", "rel").filter((tag) => new RegExp(`\\b${rel}\\b`, "i").test(attribute(tag, "rel") ?? ""));
const metaByProperty = (html, property) =>
  tags(html, "meta", "property").filter((tag) => attribute(tag, "property") === property);
const metaByName = (html, name) =>
  tags(html, "meta", "name").filter((tag) => attribute(tag, "name") === name);
const urlFrom = (tag) => attribute(tag, "href") ?? attribute(tag, "content");
const expectedCanonical = (route) => `${expectedOrigin}${route === "/casos/" ? "/proyectos/" : route}`;
const canonicalFrom = (html) => linkByRel(html, "canonical").map((tag) => attribute(tag, "href"));

const jsonLdUrls = (value, path = "$") => {
  if (typeof value === "string") return /^https?:\/\//.test(value) ? [{ path, value }] : [];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => jsonLdUrls(child, `${path}.${key}`));
};

check(existsSync(dist), `dist no existe: ${dist}`);
const routeInventory = createPublicRouteInventory(dist);
check(routeInventory.generatedRoutes.length > 0, "no hay rutas HTML generadas");
check(routeInventory.missingRoutes.length === 0, `faltan rutas: ${routeInventory.missingRoutes.join(", ")}`);
check(routeInventory.unexpectedRoutes.length === 0, `sobran rutas sin clasificar: ${routeInventory.unexpectedRoutes.join(", ")}`);

const routeResults = [];
if (failures.length === 0) {
  for (const route of routeInventory.generatedRoutes) {
    const html = readHtml(route);
    const canonicalTags = canonicalFrom(html);
    const ogUrlTags = metaByProperty(html, "og:url");
    const socialImageTags = metaByProperty(html, "og:image");
    const robotsTags = metaByName(html, "robots");
    const expectedRobots = expectIndexing
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,nofollow";
    const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .map((match) => {
        try {
          return JSON.parse(match[1]);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const structuredUrls = jsonLd.flatMap((schema) => jsonLdUrls(schema));
    const identityUrls = structuredUrls.filter(({ path, value }) => path.endsWith(".worksFor.url") && value === "https://sokatechnologies.com");
    const contentUrls = structuredUrls.filter(({ path }) => !path.endsWith(".@context") && !path.endsWith(".worksFor.url"));
    const imageFormat = attribute(metaByProperty(html, "og:image:type")[0] ?? "", "content") === "image/svg+xml" ? "svg" : "png";
    const expectedSocialImage = `${expectedOrigin}/og/soka-demo-2026.${imageFormat}`;
    check(canonicalTags.length === 1, `${route}: canonical debe ser único`);
    check(canonicalTags[0] === expectedCanonical(route), `${route}: canonical incorrecto (${canonicalTags[0] ?? "ausente"})`);
    check(ogUrlTags.length === 1 && urlFrom(ogUrlTags[0]) === expectedCanonical(route), `${route}: og:url no coincide con canonical`);
    check(socialImageTags.length === 1 && urlFrom(socialImageTags[0]) === expectedSocialImage, `${route}: og:image incorrecta`);
    check(linkByRel(html, "sitemap").length === 1, `${route}: enlace sitemap ausente o duplicado`);
    check(robotsTags.length === 1 && attribute(robotsTags[0], "content") === expectedRobots, `${route}: robots inesperado`);
    check(contentUrls.length > 0, `${route}: JSON-LD sin URLs de contenido`);
    check(contentUrls.every(({ value }) => value === expectedOrigin || value.startsWith(`${expectedOrigin}/`)), `${route}: JSON-LD apunta a otro origen`);
    check(identityUrls.length === (route === "/nosotros/" ? 1 : 0), `${route}: worksFor.url no está separado como identidad organizacional`);
    for (const tag of socialImageTags) {
      const imagePath = new URL(urlFrom(tag)).pathname;
      check(existsSync(join(dist, imagePath.slice(1))), `${route}: imagen social no existe (${imagePath})`);
    }
    routeResults.push({
      route,
      canonical: canonicalTags[0],
      ogUrl: urlFrom(ogUrlTags[0]),
      robots: attribute(robotsTags[0], "content"),
      identityUrls: identityUrls.map(({ value }) => value)
    });
  }
}

const sitemapIndexPath = join(dist, "sitemap-index.xml");
const sitemapPath = join(dist, "sitemap-0.xml");
const robotsPath = join(dist, "robots.txt");
check(existsSync(sitemapIndexPath), "sitemap-index.xml ausente");
check(existsSync(sitemapPath), "sitemap-0.xml ausente");
check(existsSync(robotsPath), "robots.txt ausente");
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, "utf8");
  check(sitemap.includes(`${expectedOrigin}/soluciones/`), "sitemap no contiene /soluciones/");
  check(!sitemap.includes(`${expectedOrigin}/casos/`), "sitemap no debe publicar /casos/");
}
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, "utf8");
  check(
    expectIndexing
      ? robots.includes("Allow: /") && robots.includes(`${expectedOrigin}/sitemap-index.xml`)
      : robots.includes("Disallow: /") && !robots.includes("Allow: /"),
    "robots no coincide con la política del artefacto"
  );
}

const result = {
  dist,
  expectedOrigin,
  expectIndexing,
  routes: routeInventory.generatedRoutes.length,
  routeInventory,
  routeResults,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
