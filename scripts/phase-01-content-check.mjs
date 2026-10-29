import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const expectedRoutes = [
  "/",
  "/servicios/",
  "/servicios/software-a-medida/",
  "/servicios/automatizaciones/",
  "/servicios/dashboards/",
  "/servicios/consultoria-ti-devops/",
  "/servicios/sitios-web-corporativos/",
  "/servicios/infraestructura-soporte/",
  "/servicios/mantenimiento-mejora-continua/",
  "/productos/",
  "/productos/portik/",
  "/productos/autoinventario/",
  "/productos/autowhatsapp/",
  "/contacto/",
  "/diagnostico/",
  "/auditoria/",
  "/casos/",
  "/demos/ecommerce/",
  "/nosotros/",
  "/politica-privacidad/",
  "/proyectos/",
  "/terminos/"
];

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const htmlPath = (route) => (route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html"));
const htmlFor = (route) => readFileSync(htmlPath(route), "utf8");
const expectedCanonical = (route) =>
  `https://prueba.sokatechnologies.com${route === "/casos/" ? "/proyectos/" : route}`;
const readCanonicalHref = (html) => {
  const canonicalLink = (html.match(/<link\b[^>]*>/gi) ?? []).find((tag) =>
    /\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(tag)
  );
  return canonicalLink?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
};

const canonicalFalsePositiveFixture =
  '<meta content="https://prueba.sokatechnologies.com/contacto/"><link rel="canonical" href="https://prueba.sokatechnologies.com/otra/">';
check(
  readCanonicalHref(canonicalFalsePositiveFixture) !== "https://prueba.sokatechnologies.com/contacto/",
  "el checker no detecta canonical incorrecto cuando la URL esperada aparece en otro elemento"
);
check(
  readCanonicalHref('<link rel="canonical" href="https://prueba.sokatechnologies.com/proyectos/">') ===
    "https://prueba.sokatechnologies.com/proyectos/",
  "el checker no puede leer un canonical válido"
);

check(existsSync(dist), "dist no existe; ejecuta el build antes de esta comprobación");
if (failures.length === 0) {
  for (const route of expectedRoutes) {
    check(existsSync(htmlPath(route)), `falta HTML para ${route}`);
    if (!existsSync(htmlPath(route))) continue;
    const html = htmlFor(route);
    check(html.includes('name="robots" content="noindex,nofollow'), `${route}: noindex ausente`);
    check(readCanonicalHref(html) === expectedCanonical(route), `${route}: canonical incorrecto o ausente`);
  }

  const generatedHtml = expectedRoutes.map(htmlFor).join("\n");
  const generatedFiles = readdirSync(join(dist, "_astro"), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
  const generatedBundles = generatedFiles
    .filter((file) => /\.(?:js|css|map)$/.test(file))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  const publicOutput = `${generatedHtml}\n${generatedBundles}`;
  const internalMarkers = /\[NOMBRE LEGAL COMPLETO\]|\[DOMICILIO[^\]]*\]|persona natural|sin revisión legal final|no publicar sin validar|NIT pendiente/i;
  check(!internalMarkers.test(publicOutput), "la salida pública contiene marcadores o condición legal interna");

  const home = htmlFor("/");
  const contact = htmlFor("/contacto/");
  const audit = htmlFor("/auditoria/");
  const ecommerce = htmlFor("/demos/ecommerce/");
  check(contact.includes("Colombia"), "contacto: ubicación ausente");
  check(contact.includes("+57 321 2554930") && contact.includes("tel:+573212554930"), "contacto: teléfono o tel ausente");
  check(contact.includes("mailto:info@sokatechnologies.com"), "contacto: mailto ausente");
  check(home.includes('"email":"info@sokatechnologies.com"') && home.includes('"telephone":"+57 321 2554930"'), "schema: contacto centralizado ausente");
  check(home.includes('"areaServed":["Colombia","Panamá","República Dominicana","Latinoamérica"]'), "schema: Colombia o mercados existentes ausentes");
  check(audit.includes("Simulación de diagnóstico web y operativo"), "auditoría: denominación demo ausente");
  check(audit.includes("no visita ni escanea") && audit.includes("Completar simulación"), "auditoría: límites o CTA demo ausentes");
  check(audit.includes("data-form-mode=\"demo\""), "auditoría: modo demo ausente");
  check(ecommerce.includes("sin backend real") && ecommerce.includes("sin datos de terceros"), "e-commerce: límites demo ausentes");
  const products = htmlFor("/productos/");
  check(products.includes("Herramientas para necesidades operativas concretas."), "productos: encabezado público ausente");
  check(products.includes("Qué puedes evaluar de cada producto."), "productos: sección orientada al visitante ausente");
  check(!products.includes("madurez y objetivos comerciales distintos") && !products.includes("promesas infladas"), "productos: lenguaje editorial obsoleto presente");
  check(!expectedRoutes.some((route) => htmlFor(route).includes("Para quién y hasta dónde llega")), "servicios: encabezado editorial anterior presente");
  check(!expectedRoutes.some((route) => htmlFor(route).includes("Agendar llamada")), "CTA obsoleto Agendar llamada todavía aparece");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${expectedRoutes.length} rutas, canonical exacto (incluida /casos/ → /proyectos/), noindex, identidad, schema, legal público y demos verificados.`);
}
