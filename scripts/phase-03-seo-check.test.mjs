import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { runSeoCheck, validateRobotsPolicy } from "./phase-03-seo-check.mjs";

const dist = process.env.SEO_STAGING_DIST || join(process.cwd(), "dist");
const expectedOrigin = "https://prueba.sokatechnologies.com";
const fixtureParent = process.env.SEO_FIXTURE_ROOT || join(process.cwd(), ".phase-03-seo-fixtures-");
const fixtureRoot = await mkdtemp(fixtureParent);

test.after(async () => {
  await rm(fixtureRoot, { recursive: true, force: true });
});

const fixture = async (name) => {
  const target = join(fixtureRoot, name);
  await cp(dist, target, { recursive: true });
  return target;
};

const runFixture = (target) => runSeoCheck({ dist: target, expectedOrigin, expectIndexing: false });
const assertFailure = (result, text) => assert.ok(result.failures.some((failure) => failure.includes(text)), result.failures.join("\n"));
const productionOrigin = "https://sokatechnologies.com";
const checkRobots = (robots, expectIndexing, origin = expectIndexing ? productionOrigin : expectedOrigin) =>
  validateRobotsPolicy({ robots, expectedOrigin: origin, expectIndexing });

test("acepta la política completa de staging para User-agent: *", async () => {
  const target = await fixture("robots-staging-valid");
  const result = runFixture(target);
  assert.deepEqual(result.robots.failures, []);
  assert.deepEqual(result.failures, []);
});

test("rechaza Disallow: /wp-admin/ aunque contenga el prefijo raíz", () => {
  const result = checkRobots("User-agent: *\nDisallow: /wp-admin/\n", false);
  assert.ok(result.failures.includes("robots no coincide con la política completa del artefacto"));
});

test("rechaza el bloqueo raíz limitado a un bot específico", () => {
  const result = checkRobots("User-agent: Googlebot\nDisallow: /\n", false);
  assert.ok(result.failures.includes("robots no coincide con la política completa del artefacto"));
});

test("acepta la política completa del candidato de producción", () => {
  const result = checkRobots(
    `User-agent: *\nAllow: /\nSitemap: ${productionOrigin}/sitemap-index.xml\n`,
    true
  );
  assert.deepEqual(result.failures, []);
});

test("rechaza una política de producción incompatible con su sitemap", () => {
  const result = checkRobots(
    "User-agent: *\nAllow: /\nSitemap: https://foreign.example.test/sitemap-index.xml\n",
    true
  );
  assert.ok(result.failures.includes("robots no coincide con la política completa del artefacto"));
});

test("rechaza una ruta con un JSON-LD roto aunque otro bloque sea válido", async () => {
  const target = await fixture("jsonld-malformed");
  const path = join(target, "index.html");
  const html = await readFile(path, "utf8");
  const block = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i)?.[0];
  assert.ok(block, "la fixture debe contener JSON-LD");
  await writeFile(path, html.replace(block, '<script type="application/ld+json">{"broken":</script>'));
  assertFailure(runFixture(target), "JSON-LD #1 malformado");
});

test("rechaza un índice XML vacío", async () => {
  const target = await fixture("sitemap-empty-index");
  await writeFile(join(target, "sitemap-index.xml"), "<?xml version=\"1.0\"?><sitemapindex></sitemapindex>");
  assertFailure(runFixture(target), "sitemap-index.xml no referencia sitemaps");
});

test("rechaza XML inválido en el índice", async () => {
  const target = await fixture("sitemap-invalid-xml");
  await writeFile(join(target, "sitemap-index.xml"), "<sitemapindex><sitemap>");
  assertFailure(runFixture(target), "sitemap-index.xml: XML inválido");
});

test("rechaza un hijo referenciado que no existe", async () => {
  const target = await fixture("sitemap-missing-child");
  await rm(join(target, "sitemap-0.xml"));
  assertFailure(runFixture(target), "sitemap-index.xml: hijo ausente");
});

test("rechaza una entrada de URL faltante y la diferencia del inventario", async () => {
  const target = await fixture("sitemap-missing-url");
  const path = join(target, "sitemap-0.xml");
  const xml = await readFile(path, "utf8");
  await writeFile(path, xml.replace(/<url>[\s\S]*?<\/url>/, ""));
  assertFailure(runFixture(target), "sitemap: faltan URLs canónicas");
});

test("rechaza una URL de sitemap con origen ajeno", async () => {
  const target = await fixture("sitemap-foreign-origin");
  const path = join(target, "sitemap-0.xml");
  const xml = await readFile(path, "utf8");
  await writeFile(path, xml.replace(expectedOrigin, "https://foreign.example.test"));
  assertFailure(runFixture(target), "URL de origen ajeno");
});
