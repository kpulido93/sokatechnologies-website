import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.env.PHASE04_MODE_ROOT?.trim() || join(process.cwd(), "artifacts/comparative-audit/phase-04/mode-builds");
const liveEndpoint = process.env.PHASE04_LIVE_ENDPOINT?.trim() || "https://forms.example.invalid/api/leads";
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const readPage = (caseName, route) => {
  const path = join(root, caseName, route.slice(1), "index.html");
  check(existsSync(path), `${caseName}${route}: HTML ausente`);
  return existsSync(path) ? readFileSync(path, "utf8") : "";
};
const formStart = (html) => html.match(/<form\b[^>]*>/i)?.[0] ?? "";

for (const testCase of [
  { name: "demo", mode: "demo" },
  { name: "worker-incomplete", mode: "demo" },
  { name: "worker-valid", mode: "live" }
]) {
  for (const route of ["/contacto/", "/diagnostico/"]) {
    const html = readPage(testCase.name, route);
    const form = formStart(html);
    check(form.includes(`data-form-mode="${testCase.mode}"`), `${testCase.name}${route}: modo no coincide`);

    if (testCase.mode === "demo") {
      check(form.includes('data-form-provider="demo"'), `${testCase.name}${route}: proveedor demo ausente`);
      check(/\bdata-submit-endpoint(?:\s|>)/.test(form), `${testCase.name}${route}: endpoint demo presente`);
      check(!/\b(?:action|method)=/i.test(form), `${testCase.name}${route}: envío HTML demo habilitado`);
      check(html.includes("Simulación local"), `${testCase.name}${route}: título demo ausente`);
      check(html.includes("Modo demo:"), `${testCase.name}${route}: aviso demo ausente`);
      check(html.includes("Validar solicitud de prueba"), `${testCase.name}${route}: botón demo ausente`);
      check(!html.includes("Envío seguro:"), `${testCase.name}${route}: copy live en demo`);
    } else {
      check(form.includes('data-form-provider="worker"'), `${testCase.name}${route}: proveedor live ausente`);
      check(form.includes(`data-submit-endpoint="${liveEndpoint}"`), `${testCase.name}${route}: endpoint live inesperado`);
      check(/\bmethod="post"/i.test(form), `${testCase.name}${route}: método live ausente`);
      check(html.includes("Envío seguro:"), `${testCase.name}${route}: aviso live ausente`);
      check(!html.includes("Simulación local") && !html.includes("Modo demo:"), `${testCase.name}${route}: copy demo en live`);
      check(!html.includes("Validar solicitud de prueba"), `${testCase.name}${route}: botón demo en live`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: demo explícito, worker incompleto en demo y worker válido en live mantienen copy y atributos coherentes.");
}
