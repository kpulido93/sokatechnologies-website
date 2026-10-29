import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = process.env.CONTACT_CHECK_DIST?.trim() || join(process.cwd(), "dist");
const expectedMode = process.env.CONTACT_EXPECT_MODE?.trim() || "demo";
const expectedEndpoint = process.env.CONTACT_EXPECT_ENDPOINT?.trim() || "";
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const htmlPath = (route) => (route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html"));
const htmlFor = (route) => {
  const path = htmlPath(route);
  check(existsSync(path), `${route}: HTML ausente`);
  return existsSync(path) ? readFileSync(path, "utf8") : "";
};
const hasContactCta = (html) => /<a\b[^>]*href="\/contacto\/(?:#contacto-directo)?"[^>]*>[\s\S]*?Abrir conversación[\s\S]*?<\/a>/i.test(html);

check(existsSync(dist), `dist ausente: ${dist}`);
check(["demo", "live"].includes(expectedMode), `modo esperado no válido: ${expectedMode}`);

const pages = Object.fromEntries(["/", "/servicios/", "/soluciones/", "/diagnostico/", "/contacto/"].map((route) => [route, htmlFor(route)]));

for (const route of ["/", "/servicios/", "/soluciones/", "/diagnostico/"]) {
  check(hasContactCta(pages[route]), `${route}: CTA Abrir conversación no conduce a /contacto/`);
}

const contact = pages["/contacto/"];
check((contact.match(/class="contact-direct-action"/g) ?? []).length === 3, "contacto: no hay exactamente tres acciones directas");
check(contact.includes("Escribir por WhatsApp"), "contacto: acción de WhatsApp ausente");
check(contact.includes('href="mailto:info@sokatechnologies.com"') && contact.includes("Escribir por correo"), "contacto: acción de correo ausente");
check(contact.includes('href="tel:+573212554930"') && contact.includes("Llamar") && contact.includes("+57 321 2554930"), "contacto: acción de llamada ausente");
check(contact.includes('id="contacto-directo"'), "contacto: ancla de canales ausente");
check(contact.includes('class="button button-primary header-cta" href="/contacto/#contacto-directo"'), "contacto: CTA de cabecera no apunta a los canales");
check(contact.includes("Qué puedes compartir para comenzar"), "contacto: orientación de información ausente");
check(contact.includes("Qué proceso, servicio o área quieres mejorar"), "contacto: contexto operativo ausente");
check(contact.includes("No compartas contraseñas, tokens, llaves privadas, accesos ni datos sensibles"), "contacto: límite de datos ausente");
for (const [route, html] of [["/contacto/", contact], ["/diagnostico/", pages["/diagnostico/"]]]) {
  check(html.includes(`data-form-mode="${expectedMode}"`), `${route}: modo efectivo inesperado`);
  if (expectedMode === "demo") {
    check(html.includes('data-form-provider="demo"'), `${route}: proveedor demo ausente`);
    check(/\bdata-submit-endpoint(?:\s|>)/.test(html), `${route}: endpoint demo no está vacío`);
    check(!/<form\b[^>]*\b(?:action|method)=/i.test(html), `${route}: el formulario demo tiene envío HTML nativo`);
    check(html.includes("Simulación local"), `${route}: título demo ausente`);
    check(html.includes("Modo demo:"), `${route}: aviso demo ausente`);
    check(html.includes("Validar solicitud de prueba"), `${route}: botón demo no está rotulado como prueba`);
  } else {
    check(html.includes('data-form-provider="worker"'), `${route}: proveedor live ausente`);
    check(expectedEndpoint.length > 0 && html.includes(`data-submit-endpoint="${expectedEndpoint}"`), `${route}: endpoint live inesperado`);
    check(/<form\b[^>]*\bmethod="post"/i.test(html), `${route}: método live ausente`);
    check(!html.includes("Simulación local") && !html.includes("Modo demo:"), `${route}: copy demo visible en modo live`);
    check(!html.includes("Validar solicitud de prueba"), `${route}: botón demo visible en modo live`);
  }
}
for (const [route, html] of Object.entries(pages)) {
  const links = [...html.matchAll(/<a\b[^>]*\bdata-whatsapp-link\b[^>]*>/g)].map(([tag]) => tag);
  check(links.length >= 2, `${route}: faltan los accesos globales a WhatsApp`);
  check((html.match(/class="whatsapp-link whatsapp-float"/g) ?? []).length === 1, `${route}: debe existir un único botón flotante de WhatsApp`);
  for (const tag of links) {
    try {
      const url = new URL(tag.match(/\bhref="([^"]+)"/)?.[1] ?? "");
      check(url.origin === "https://wa.me" && url.pathname === "/573212554930", `${route}: destino WhatsApp incorrecto`);
      check(url.searchParams.get("text") === "Hola, quiero conversar con SokaTechnologies sobre un proyecto.", `${route}: mensaje WhatsApp inesperado`);
      check(tag.includes('target="_blank"') && tag.includes('rel="noopener noreferrer"'), `${route}: apertura externa insegura`);
      check(tag.includes("se abre en otra pestaña"), `${route}: apertura externa sin aviso accesible`);
    } catch {
      check(false, `${route}: URL WhatsApp inválida`);
    }
  }
}
check(!/(?:gratis|gratuito|te responderemos en|reserva tu agenda|agenda una cita)/i.test(Object.values(pages).join("\n")), "CTA: contiene una promesa comercial no aprobada");

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`PASS: recorrido de contacto directo, modo ${expectedMode}, contenido estático y límites comerciales verificados.`);
}
