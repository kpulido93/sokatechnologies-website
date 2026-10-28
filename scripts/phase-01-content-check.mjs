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

check(existsSync(dist), "dist no existe; ejecuta el build antes de esta comprobación");
if (failures.length === 0) {
  for (const route of expectedRoutes) {
    check(existsSync(htmlPath(route)), `falta HTML para ${route}`);
    if (!existsSync(htmlPath(route))) continue;
    const html = htmlFor(route);
    check(html.includes('name="robots" content="noindex,nofollow'), `${route}: noindex ausente`);
    check(html.includes(`https://prueba.sokatechnologies.com${route}`), `${route}: canonical de staging ausente`);
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
  check(!expectedRoutes.some((route) => htmlFor(route).includes("Agendar llamada")), "CTA obsoleto Agendar llamada todavía aparece");
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${expectedRoutes.length} rutas, noindex/canonical, identidad, schema, legal público y demos verificados.`);
}
