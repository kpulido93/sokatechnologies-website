import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative, resolve } from "node:path";
import { SyntaxValidator } from "fast-xml-validator";
import { XMLParser } from "fast-xml-parser";
import { createPublicRouteInventory } from "./public-route-inventory.mjs";

const xmlParser = new XMLParser({
  ignoreAttributes: true,
  parseAttributeValue: false,
  parseTagValue: false,
  processEntities: false,
  trimValues: true
});

const asArray = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]);
const textValue = (value) => (typeof value === "string" ? value.trim() : "");
const normalizeOrigin = (value) => (value || "").replace(/\/+$/, "");

export const expectedCanonical = (origin, route) => `${normalizeOrigin(origin)}${route === "/casos/" ? "/proyectos/" : route}`;

const htmlPath = (dist, route) => (route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html"));
const readHtml = (dist, route) => readFileSync(htmlPath(dist, route), "utf8");
const tags = (html, name, attributeName) => {
  const pattern = new RegExp(`<${name}\\b[^>]*${attributeName}=["'][^"']+["'][^>]*>`, "gi");
  return html.match(pattern) ?? [];
};
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] ?? null;
const linkByRel = (html, rel) =>
  tags(html, "link", "rel").filter((tag) => new RegExp(`\\b${rel}\\b`, "i").test(attribute(tag, "rel") ?? ""));
const metaByProperty = (html, property) =>
  tags(html, "meta", "property").filter((tag) => attribute(tag, "property") === property);
const metaByName = (html, name) => tags(html, "meta", "name").filter((tag) => attribute(tag, "name") === name);
const urlFrom = (tag) => attribute(tag, "href") ?? attribute(tag, "content");
const canonicalFrom = (html) => linkByRel(html, "canonical").map((tag) => attribute(tag, "href"));

const jsonLdUrls = (value, path = "$") => {
  if (typeof value === "string") return /^https?:\/\//.test(value) ? [{ path, value }] : [];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => jsonLdUrls(child, `${path}.${key}`));
};

const parseJsonLdBlocks = (html, route, check) => {
  const blocks = [];
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  matches.forEach((match, index) => {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      check(false, `${route}: JSON-LD #${index + 1} malformado (${error.message})`);
    }
  });
  return blocks;
};

const parseXml = (xml, label, check) => {
  let validation;
  try {
    validation = SyntaxValidator.validate(xml);
  } catch (error) {
    check(false, `${label}: XML inválido (${error.message})`);
    return null;
  }
  if (validation !== true) {
    check(false, `${label}: XML inválido (error desconocido)`);
    return null;
  }
  try {
    return xmlParser.parse(xml);
  } catch (error) {
    check(false, `${label}: XML no se pudo analizar (${error.message})`);
    return null;
  }
};

const safeDistPath = (dist, pathname) => {
  const candidate = resolve(dist, `.${pathname}`);
  const root = resolve(dist);
  return candidate === root || relative(root, candidate).startsWith("..") ? null : candidate;
};

const validateSitemaps = ({ dist, expectedOrigin, routeInventory, check }) => {
  const expectedUrls = new Set(
    routeInventory.expectedRoutes
      .filter((route) => route !== "/casos/")
      .map((route) => expectedCanonical(expectedOrigin, route))
  );
  const indexPath = join(dist, "sitemap-index.xml");
  const indexResult = { expectedUrls: [...expectedUrls].sort(), childLocations: [], publishedUrls: [] };
  check(existsSync(indexPath), "sitemap-index.xml ausente");
  if (!existsSync(indexPath)) return indexResult;

  const index = parseXml(readFileSync(indexPath, "utf8"), "sitemap-index.xml", check);
  const sitemapEntries = asArray(index?.sitemapindex?.sitemap);
  check(Boolean(index?.sitemapindex), "sitemap-index.xml no tiene raíz sitemapindex");
  check(sitemapEntries.length > 0, "sitemap-index.xml no referencia sitemaps");

  const publishedUrls = [];
  const childLocations = sitemapEntries.map((entry, index) => {
    const location = textValue(entry?.loc);
    check(Boolean(location), `sitemap-index.xml: referencia #${index + 1} sin URL`);
    if (!location) return null;
    indexResult.childLocations.push(location);
    let childUrl;
    try {
      childUrl = new URL(location);
    } catch {
      check(false, `sitemap-index.xml: referencia #${index + 1} no es una URL válida`);
      return null;
    }
    check(childUrl.origin === expectedOrigin, `sitemap-index.xml: origen ajeno (${location})`);
    const childPath = childUrl.origin === expectedOrigin ? safeDistPath(dist, childUrl.pathname) : null;
    check(Boolean(childPath), `sitemap-index.xml: archivo referenciado inválido (${location})`);
    check(Boolean(childPath && existsSync(childPath)), `sitemap-index.xml: hijo ausente (${location})`);
    if (!childPath || !existsSync(childPath)) return null;

    const child = parseXml(readFileSync(childPath, "utf8"), location, check);
    check(Boolean(child?.urlset), `${location}: no tiene raíz urlset`);
    const urlEntries = asArray(child?.urlset?.url);
    check(urlEntries.length > 0, `${location}: no contiene URLs`);
    urlEntries.forEach((entry, urlIndex) => {
      const url = textValue(entry?.loc);
      check(Boolean(url), `${location}: URL #${urlIndex + 1} ausente`);
      if (!url) return;
      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        check(false, `${location}: URL #${urlIndex + 1} inválida (${url})`);
        return;
      }
      check(parsedUrl.origin === expectedOrigin, `${location}: URL de origen ajeno (${url})`);
      publishedUrls.push(url);
    });
    return location;
  }).filter(Boolean);

  check(new Set(childLocations).size === childLocations.length, "sitemap-index.xml contiene hijos duplicados");
  check(new Set(publishedUrls).size === publishedUrls.length, "sitemaps contienen URLs duplicadas");
  const publishedSet = new Set(publishedUrls);
  const missing = [...expectedUrls].filter((url) => !publishedSet.has(url));
  const unexpected = [...publishedSet].filter((url) => !expectedUrls.has(url));
  check(missing.length === 0, `sitemap: faltan URLs canónicas (${missing.join(", ")})`);
  check(unexpected.length === 0, `sitemap: URLs no esperadas (${unexpected.join(", ")})`);
  check(publishedSet.size === expectedUrls.size, "sitemap: cantidad de URLs canónicas no coincide");
  indexResult.childLocations = childLocations;
  indexResult.publishedUrls = [...publishedSet].sort();
  return indexResult;
};

export const runSeoCheck = ({
  dist = join(process.cwd(), "dist"),
  expectedOrigin = "https://sokatechnologies.com",
  expectIndexing = false
} = {}) => {
  expectedOrigin = normalizeOrigin(expectedOrigin);
  const failures = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };
  check(existsSync(dist), `dist no existe: ${dist}`);
  const routeInventory = createPublicRouteInventory(dist);
  check(routeInventory.generatedRoutes.length > 0, "no hay rutas HTML generadas");
  check(routeInventory.missingRoutes.length === 0, `faltan rutas: ${routeInventory.missingRoutes.join(", ")}`);
  check(routeInventory.unexpectedRoutes.length === 0, `sobran rutas sin clasificar: ${routeInventory.unexpectedRoutes.join(", ")}`);

  const routeResults = [];
  if (failures.length === 0) {
    for (const route of routeInventory.generatedRoutes) {
      const html = readHtml(dist, route);
      const canonicalTags = canonicalFrom(html);
      const ogUrlTags = metaByProperty(html, "og:url");
      const socialImageTags = metaByProperty(html, "og:image");
      const robotsTags = metaByName(html, "robots");
      const expectedRobots = expectIndexing
        ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        : "noindex,nofollow";
      const jsonLd = parseJsonLdBlocks(html, route, check);
      const structuredUrls = jsonLd.flatMap((schema) => jsonLdUrls(schema));
      const identityUrls = structuredUrls.filter(({ path, value }) => path.endsWith(".worksFor.url") && value === "https://sokatechnologies.com");
      const contentUrls = structuredUrls.filter(({ path }) => !path.endsWith(".@context") && !path.endsWith(".worksFor.url"));
      const imageFormat = attribute(metaByProperty(html, "og:image:type")[0] ?? "", "content") === "image/svg+xml" ? "svg" : "png";
      const expectedSocialImage = `${expectedOrigin}/og/soka-demo-2026.${imageFormat}`;
      check(canonicalTags.length === 1, `${route}: canonical debe ser único`);
      check(canonicalTags[0] === expectedCanonical(expectedOrigin, route), `${route}: canonical incorrecto (${canonicalTags[0] ?? "ausente"})`);
      check(ogUrlTags.length === 1 && urlFrom(ogUrlTags[0]) === expectedCanonical(expectedOrigin, route), `${route}: og:url no coincide con canonical`);
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

  const robotsPath = join(dist, "robots.txt");
  check(existsSync(robotsPath), "robots.txt ausente");
  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, "utf8");
    check(
      expectIndexing
        ? robots.includes("Allow: /") && robots.includes(`${expectedOrigin}/sitemap-index.xml`)
        : robots.includes("Disallow: /") && !robots.includes("Allow: /"),
      "robots no coincide con la política del artefacto"
    );
  }

  const sitemap = validateSitemaps({ dist, expectedOrigin, routeInventory, check });
  return {
    dist,
    expectedOrigin,
    expectIndexing,
    routes: routeInventory.generatedRoutes.length,
    routeInventory,
    routeResults,
    sitemap,
    failures
  };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = runSeoCheck({
    dist: process.env.SEO_DIST || join(process.cwd(), "dist"),
    expectedOrigin: process.env.SEO_EXPECTED_ORIGIN || "https://sokatechnologies.com",
    expectIndexing: process.env.SEO_EXPECT_INDEXING?.trim().toLowerCase() === "true"
  });
  console.log(JSON.stringify(result, null, 2));
  if (result.failures.length > 0) process.exitCode = 1;
}
