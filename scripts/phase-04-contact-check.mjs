import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
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
const hasContactCta = (html) => /<a\b[^>]*href="\/contacto\/"[^>]*>[\s\S]*?Abrir conversación[\s\S]*?<\/a>/i.test(html);

check(existsSync(dist), `dist ausente: ${dist}`);

const pages = Object.fromEntries(["/", "/servicios/", "/soluciones/", "/diagnostico/", "/contacto/"].map((route) => [route, htmlFor(route)]));

for (const route of ["/", "/servicios/", "/soluciones/", "/diagnostico/"]) {
  check(hasContactCta(pages[route]), `${route}: CTA Abrir conversación no conduce a /contacto/`);
}

const contact = pages["/contacto/"];
check((contact.match(/class="contact-direct-action"/g) ?? []).length === 2, "contacto: no hay exactamente dos acciones directas");
check(contact.includes('href="mailto:info@sokatechnologies.com"') && contact.includes("Escribir por correo"), "contacto: acción de correo ausente");
check(contact.includes('href="tel:+573212554930"') && contact.includes("Llamar") && contact.includes("+57 321 2554930"), "contacto: acción de llamada ausente");
check(contact.includes("Qué puedes compartir para comenzar"), "contacto: orientación de información ausente");
check(contact.includes("Qué proceso, servicio o área quieres mejorar"), "contacto: contexto operativo ausente");
check(contact.includes("No compartas contraseñas, tokens, llaves privadas, accesos ni datos sensibles"), "contacto: límite de datos ausente");
check(contact.includes('data-form-mode="demo"'), "contacto: formulario no está en modo demo");
check(/\bdata-submit-endpoint(?:\s|>)/.test(contact), "contacto: endpoint demo no está vacío");
check(!/<form\b[^>]*\b(?:action|method)=/i.test(contact), "contacto: el formulario demo tiene envío HTML nativo");
check(contact.includes("Validar solicitud de prueba"), "contacto: botón demo no está rotulado como prueba");
check(!/(?:wa\.me|whatsapp)/i.test(Object.values(pages).join("\n")), "contacto: apareció un canal WhatsApp no autorizado");
check(!/(?:gratis|gratuito|te responderemos en|reserva tu agenda|agenda una cita)/i.test(Object.values(pages).join("\n")), "CTA: contiene una promesa comercial no aprobada");

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: recorrido de contacto directo, contenido estático, modo demo y límites comerciales verificados.");
}
