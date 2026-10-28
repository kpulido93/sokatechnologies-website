import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4323";
const chrome = process.env.CHROME_BIN || "/snap/bin/chromium";
const strict = process.env.UI_SMOKE_STRICT !== "false";
const screenshotDir = process.env.SCREENSHOT_DIR || join(tmpdir(), "soka-ui-screenshots");
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 }
];
const routes = [
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
const faqRoutes = [
  "/servicios/software-a-medida/",
  "/servicios/automatizaciones/",
  "/servicios/dashboards/",
  "/servicios/consultoria-ti-devops/",
  "/servicios/sitios-web-corporativos/",
  "/servicios/infraestructura-soporte/",
  "/servicios/mantenimiento-mejora-continua/"
];

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });

const waitFor = async (check, timeout = 10000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    try {
      const value = await check();
      if (value) return value;
    } catch {
      // The local browser is still starting.
    }
    await sleep(100);
  }
  throw new Error("Timed out waiting for the local browser or preview.");
};

class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 0;
    this.pending = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
}

const evaluate = async (client, expression, sessionId) => {
  const result = await client.send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId
  );
  if (result?.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || "Browser evaluation failed.");
  }
  return result?.result?.value;
};

const pageChecks = async (client, sessionId, route, viewport) =>
  evaluate(
    client,
    `(() => {
      const currentRoute = ${JSON.stringify(route)};
      const currentViewport = ${JSON.stringify(viewport.name)};
      const visible = (node) => {
        const style = getComputedStyle(node);
        return !node.hidden && !node.closest("[hidden]") && style.display !== "none" && style.visibility !== "hidden";
      };
      const overflowSelectors = ["main", ".page-shell", ".site-header", ".hero", ".contact-form", ".faq-stack", ".detail-grid", ".catalog-grid"];
      const internalOverflow = overflowSelectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector)).filter(visible).map((node) => ({
          selector,
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth
        })).filter(({ scrollWidth, clientWidth }) => scrollWidth > clientWidth + 1)
      );
      const nestedOverflow = Array.from(document.querySelectorAll("main *")).filter((node) => visible(node) && !node.closest(".form-trap")).map((node) => ({
        element: node.tagName.toLowerCase() + (node.id ? "#" + node.id : "") + (node.className && typeof node.className === "string" ? "." + node.className.split(" ").join(".") : ""),
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth
      })).filter(({ scrollWidth, clientWidth }) => scrollWidth > clientWidth + 1).slice(0, 8);
      const rootOverflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > document.documentElement.clientWidth + 1;
      const focusTarget = document.querySelector("a[href], button, input, select, textarea, summary");
      let focusVisible = false;
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus();
        const style = getComputedStyle(focusTarget);
        focusVisible = document.activeElement === focusTarget && (style.outlineStyle !== "none" || style.boxShadow !== "none");
      }
      const form = document.querySelector("form");
      const formMode = form?.dataset.formMode || "local";
      const supportCard = document.querySelector(".card-support");
      const supportLabel = supportCard?.querySelector("strong");
      const supportCardRect = supportCard?.getBoundingClientRect();
      const supportLabelRect = supportLabel?.getBoundingClientRect();
      const automationCard = document.querySelector(".card-integrations");
      const automationLabel = automationCard?.querySelector(".card-label");
      const automationCardRect = automationCard?.getBoundingClientRect();
      const automationLabelRect = automationLabel?.getBoundingClientRect();
      const automationLabelLines = automationLabel
        ? (() => {
            const range = document.createRange();
            range.selectNodeContents(automationLabel);
            return range.getClientRects().length;
          })()
        : 0;
      const homeMap = currentRoute !== "/" || Boolean(
        supportLabel && supportCardRect && supportLabelRect &&
        supportLabel.textContent.includes("Infraestructura preparada") &&
        supportLabelRect.left >= supportCardRect.left - 1 &&
        supportLabelRect.right <= supportCardRect.right + 1 &&
        supportLabelRect.top >= supportCardRect.top - 1 &&
        supportLabelRect.bottom <= supportCardRect.bottom + 1 &&
        supportCard.scrollWidth <= supportCard.clientWidth + 1 &&
        automationLabel && automationCardRect && automationLabelRect &&
        automationLabel.textContent.trim() === "Automatización" &&
        automationLabelLines === 1 &&
        automationLabelRect.left >= automationCardRect.left - 1 &&
        automationLabelRect.right <= automationCardRect.right + 1
      );
      let mobileHeader = { checked: false, failures: [] };
      if (currentViewport === "mobile" && ["/contacto/", "/diagnostico/"].includes(currentRoute)) {
        const header = document.querySelector(".site-header");
        const headerRect = header?.getBoundingClientRect();
        const failures = [];
        if (!(header instanceof HTMLElement) || !headerRect || headerRect.width > document.documentElement.clientWidth + 1) {
          failures.push("header-overflow");
        }
        Array.from(document.querySelectorAll("form input:not([type=hidden]):not([name=website]), form select, form textarea, form button"))
          .filter((control) => control instanceof HTMLElement)
          .forEach((control) => {
            control.focus();
            const rect = control.getBoundingClientRect();
            const style = getComputedStyle(control);
            if (headerRect && rect.top < headerRect.bottom - 1 && rect.bottom > headerRect.top + 1) {
              failures.push(String(control.id || control.tagName.toLowerCase()) + "-covered");
            }
            if (document.activeElement !== control || (style.outlineStyle === "none" && style.boxShadow === "none")) {
              failures.push(String(control.id || control.tagName.toLowerCase()) + "-focus");
            }
          });
        mobileHeader = { checked: true, failures };
      }
      return {
        route: ${JSON.stringify(route)},
        viewport: ${JSON.stringify(viewport.name)},
        rootOverflow,
        internalOverflow,
        nestedOverflow,
        focusVisible,
        homeMap,
        homeMapAutomationLines: automationLabelLines,
        mobileHeader,
        formMode,
        title: document.title
      };
    })()` ,
    sessionId
  );

const checkFormErrors = async (client, sessionId, selector) =>
  evaluate(
    client,
    `(() => {
      const form = document.querySelector(${JSON.stringify(selector)});
      if (!(form instanceof HTMLFormElement)) return { found: false };
      form.reportValidity();
      const errors = Array.from(form.querySelectorAll(".field-error:not([hidden])"));
      const invalidControls = Array.from(form.querySelectorAll("[aria-invalid=\\"true\\"]"));
      const honeypot = form.querySelector('[name="website"]');
      const trap = honeypot?.closest(".form-trap");
      const trapRect = trap?.getBoundingClientRect();
      const demoNotice = form.querySelector(".form-demo-notice");
      const firstVisibleField = form.querySelector(".field-grid input:not([type=hidden]), .field-grid select, .field-grid textarea, .field-block input, .field-block select, .field-block textarea");
      const demoButton = form.querySelector('button[type="submit"]');
      return {
        found: true,
        errorCount: errors.filter((node) => node.textContent.trim()).length,
        invalidCount: invalidControls.length,
        associated: invalidControls.every((control) => {
          const errorId = control.getAttribute("aria-errormessage");
          return Boolean(errorId && document.getElementById(errorId)?.textContent.trim());
        }),
        honeypotHidden: honeypot instanceof HTMLElement && trap?.getAttribute("aria-hidden") === "true" && honeypot.tabIndex < 0 && Boolean(trap?.hasAttribute("inert")) && Boolean(trapRect && trapRect.right < 0),
        honeypotTabbable: honeypot instanceof HTMLElement && honeypot.tabIndex >= 0,
        demoNoticeBeforeFields: Boolean(demoNotice && firstVisibleField && (demoNotice.compareDocumentPosition(firstVisibleField) & Node.DOCUMENT_POSITION_FOLLOWING)),
        demoButtonLabel: demoButton?.textContent?.toLowerCase().includes("prueba") || demoButton?.textContent?.toLowerCase().includes("validación") || false,
        demoEndpointEmpty: !form.dataset.submitEndpoint
      };
    })()` ,
    sessionId
  );

const checkFormFlow = async (client, sessionId, selector) =>
  evaluate(
    client,
    `(async () => {
      const form = document.querySelector(${JSON.stringify(selector)});
      if (!(form instanceof HTMLFormElement)) return { found: false };
      const firstInvalid = form.querySelector("input:invalid, select:invalid, textarea:invalid");
      form.reportValidity();
      await new Promise((resolve) => setTimeout(resolve, 0));
      const invalidControls = Array.from(form.querySelectorAll("input:invalid, select:invalid, textarea:invalid"));
      const associated = invalidControls.length > 0 && invalidControls.every((control) => {
        const errorId = control.getAttribute("aria-errormessage");
        const errorNode = errorId ? document.getElementById(errorId) : null;
        return Boolean(
          control.getAttribute("aria-invalid") === "true" &&
          errorNode?.textContent.trim() &&
          control.getAttribute("aria-describedby")?.split(/\\s+/).includes(errorId)
        );
      });
      const firstErrorFocused = Boolean(firstInvalid && document.activeElement === firstInvalid);
      const originalFetch = window.fetch;
      let fetchCalls = 0;
      window.fetch = (...args) => {
        fetchCalls += 1;
        return originalFetch(...args);
      };
      const values = {
        name: "Persona de prueba",
        company: "Empresa de prueba",
        email: "demo@example.invalid",
        summary: "Descripción de prueba suficientemente larga para validar el flujo demo."
      };
      Array.from(form.querySelectorAll("input[required], textarea[required], select[required]")).forEach((control) => {
        if (control instanceof HTMLInputElement && control.type === "checkbox") {
          control.checked = true;
        } else if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) {
          control.value = values[control.name] || control.value || "Opción de prueba";
        }
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
      });
      form.requestSubmit();
      await new Promise((resolve) => setTimeout(resolve, 0));
      window.fetch = originalFetch;
      const successNode = document.getElementById(form.dataset.successId || "");
      const errorNode = document.getElementById(form.dataset.errorId || "");
      return {
        found: true,
        invalidCount: invalidControls.length,
        associated,
        firstErrorFocused,
        transitionToSuccess: Boolean(successNode && !successNode.hidden && errorNode?.hidden),
        remainingFieldErrors: form.querySelectorAll('[aria-invalid="true"], .field-error:not([hidden])').length,
        fetchCalls,
        demoMode: form.dataset.formMode === "demo"
      };
    })()` ,
    sessionId
  );

const checkProjects = async (client, sessionId) =>
  evaluate(
    client,
    `(() => {
      const cards = Array.from(document.querySelectorAll(".case-card"));
      const duplicateTags = cards.flatMap((card) => {
        const tags = Array.from(card.querySelectorAll(".case-tags span")).map((tag) => tag.textContent.trim().toLowerCase());
        return [...new Set(tags.filter((tag, index) => tags.indexOf(tag) !== index))];
      });
      const directLabelCounts = cards.map((card) =>
        Array.from(card.querySelectorAll(".case-meta span"))
          .filter((label) => label.textContent.trim().toLowerCase() === "proyecto directo").length
      );
      return {
        cards: cards.length,
        duplicateTags,
        directLabelCounts,
        noDoubleProjectDirect: directLabelCounts.every((count) => count === 1)
      };
    })()` ,
    sessionId
  );

const checkFaqs = async (client, sessionId) =>
  evaluate(
    client,
    `(() => {
      const items = Array.from(document.querySelectorAll(".faq-item"));
      const first = items[0];
      if (first) first.querySelector("summary")?.click();
      return {
        count: items.length,
        linked: items.every((item) => {
          const summary = item.querySelector("summary");
          const answerId = summary?.getAttribute("aria-controls");
          return Boolean(answerId && item.querySelector("#" + CSS.escape(answerId)));
        }),
        firstOpened: Boolean(first?.open && first.querySelector("summary")?.getAttribute("aria-controls"))
      };
    })()` ,
    sessionId
  );

const checkKeyboard = async (client, sessionId) => {
  await evaluate(
    client,
    `(() => {
      const skip = document.querySelector(".skip-link");
      if (skip instanceof HTMLElement) skip.focus();
      return document.activeElement === skip;
    })()`,
    sessionId
  );
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }, sessionId);
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 }, sessionId);
  return evaluate(client, "document.activeElement?.tagName || null", sessionId);
};

const capture = async (client, sessionId, route, viewport) => {
  if (!(["/", "/contacto/", "/diagnostico/", "/proyectos/"].includes(route) && ["desktop", "mobile"].includes(viewport.name))) return;
  mkdirSync(screenshotDir, { recursive: true });
  const name = route === "/" ? "home" : route.slice(1, -1).replaceAll("/", "-");
  const fileName = `${name}-${viewport.name}.png`;
  const screenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
  writeFileSync(join(screenshotDir, fileName), Buffer.from(screenshot.data, "base64"));
  if (route === "/" && viewport.name === "desktop") {
    await evaluate(client, 'document.querySelector(".card-support")?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });', sessionId);
    await sleep(800);
    const mapScreenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(join(screenshotDir, "home-map-desktop.png"), Buffer.from(mapScreenshot.data, "base64"));
    await evaluate(client, "window.scrollTo({ top: 0, behavior: \"instant\" });", sessionId);
  }
  if (["/contacto/", "/diagnostico/"].includes(route) && viewport.name === "desktop") {
    await evaluate(client, 'document.querySelector(".form-demo-notice")?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });', sessionId);
    await sleep(800);
    const formScreenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(join(screenshotDir, `${name}-form-desktop.png`), Buffer.from(formScreenshot.data, "base64"));
    await evaluate(client, "window.scrollTo({ top: 0, behavior: \"instant\" });", sessionId);
  }
  if (route === "/proyectos/" && viewport.name === "desktop") {
    await evaluate(client, 'document.querySelector(".case-grid")?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });', sessionId);
    await sleep(800);
    const projectsScreenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(join(screenshotDir, "proyectos-cards-desktop.png"), Buffer.from(projectsScreenshot.data, "base64"));
    await evaluate(client, "window.scrollTo({ top: 0, behavior: \"instant\" });", sessionId);
  }
};

const main = async () => {
  await waitFor(async () => (await fetch(baseUrl)).ok);
  const port = await freePort();
  const profile = mkdtempSync(join(tmpdir(), "soka-chromium-"));
  const browser = spawn(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--noerrdialogs",
    "--no-first-run",
    "--ozone-platform=headless",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank"
  ], { stdio: "ignore" });

  try {
    const version = await waitFor(async () => {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      return response.ok ? response.json() : null;
    });
    const socket = new WebSocket(version.webSocketDebuggerUrl);
    await waitFor(() => socket.readyState === WebSocket.OPEN);
    const client = new CdpClient(socket);
    const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });
    await client.send("Page.enable", {}, sessionId);
    await client.send("Runtime.enable", {}, sessionId);

    const results = [];
    for (const route of routes) {
      for (const viewport of viewports) {
        await client.send("Emulation.setDeviceMetricsOverride", {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: viewport.width < 600
        }, sessionId);
        await client.send("Page.navigate", { url: new URL(route, baseUrl).toString() }, sessionId);
        await sleep(route === "/" ? 3000 : 350);
        await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
        results.push(await pageChecks(client, sessionId, route, viewport));
        await capture(client, sessionId, route, viewport);
      }
    }

    let faqCount = 0;
    for (const route of faqRoutes) {
      await client.send("Page.navigate", { url: new URL(route, baseUrl).toString() }, sessionId);
      await sleep(350);
      await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
      const faqResult = await checkFaqs(client, sessionId);
      faqCount += faqResult.count;
      if (strict && (faqResult.count !== 3 || !faqResult.linked || !faqResult.firstOpened)) {
        throw new Error(`FAQ check failed for ${route}: ${JSON.stringify(faqResult)}`);
      }
    }

    const formFlowResults = [];
    for (const [route, selector] of [["/contacto/", ".contact-form"], ["/diagnostico/", ".contact-form"], ["/auditoria/", ".audit-form"]]) {
      await client.send("Page.navigate", { url: new URL(route, baseUrl).toString() }, sessionId);
      await sleep(350);
      await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
      const formResult = await checkFormErrors(client, sessionId, selector);
      const demoRequired = ["/contacto/", "/diagnostico/"].includes(route);
      if (strict && (!formResult.found || formResult.errorCount === 0 || formResult.invalidCount === 0 || !formResult.associated || !formResult.honeypotHidden || formResult.honeypotTabbable || !formResult.demoNoticeBeforeFields || !formResult.demoButtonLabel || (demoRequired && !formResult.demoEndpointEmpty))) {
        throw new Error(`Form error association failed for ${route}: ${JSON.stringify(formResult)}`);
      }
      if (demoRequired) {
        const flowResult = await checkFormFlow(client, sessionId, selector);
        formFlowResults.push({ route, ...flowResult });
        if (strict && (!flowResult.found || flowResult.invalidCount === 0 || !flowResult.associated || !flowResult.firstErrorFocused || !flowResult.transitionToSuccess || flowResult.remainingFieldErrors !== 0 || flowResult.fetchCalls !== 0 || !flowResult.demoMode)) {
          throw new Error(`FORM-02 demo flow failed for ${route}: ${JSON.stringify(flowResult)}`);
        }
      }
    }

    await client.send("Page.navigate", { url: new URL("/proyectos/", baseUrl).toString() }, sessionId);
    await sleep(350);
    await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
    const projectsResult = await checkProjects(client, sessionId);
    if (strict && (projectsResult.cards !== 2 || projectsResult.duplicateTags.length > 0 || !projectsResult.noDoubleProjectDirect)) {
      throw new Error(`Projects content check failed: ${JSON.stringify(projectsResult)}`);
    }

    await client.send("Page.navigate", { url: new URL("/", baseUrl).toString() }, sessionId);
    await sleep(350);
    const keyboardFocus = await checkKeyboard(client, sessionId);
    const overflowFailures = results.filter((result) =>
      result.rootOverflow || result.internalOverflow.length > 0 || result.nestedOverflow.length > 0
    );
    const focusFailures = results.filter((result) => !result.focusVisible);
    const homeMapFailures = results.filter((result) => result.route === "/" && !result.homeMap);
    const mobileHeaderFailures = results.filter((result) => result.mobileHeader?.failures?.length > 0);
    const demoModeFailures = results.filter(({ route, formMode }) =>
      ["/contacto/", "/diagnostico/"].includes(route) && formMode !== "demo"
    );
    if (strict && (overflowFailures.length > 0 || focusFailures.length > 0 || demoModeFailures.length > 0 || homeMapFailures.length > 0 || mobileHeaderFailures.length > 0 || keyboardFocus === "BODY")) {
      throw new Error(`Visual/accessibility smoke failed: ${JSON.stringify({ overflowFailures, focusFailures, demoModeFailures, homeMapFailures, mobileHeaderFailures, keyboardFocus })}`);
    }

    console.log(JSON.stringify({
      baseUrl,
      strict,
      routes: routes.length,
      viewports: viewports.map(({ name, width, height }) => `${name}=${width}x${height}`),
      faqCount,
      keyboardFocus,
      overflowFailures: overflowFailures.length,
      overflowDetails: overflowFailures.slice(0, 5).map(({ route, viewport, internalOverflow, nestedOverflow }) => ({ route, viewport, internalOverflow, nestedOverflow })),
      focusFailures: focusFailures.length,
      demoModeFailures: demoModeFailures.length,
      homeMapFailures: homeMapFailures.length,
      mobileHeaderFailures: mobileHeaderFailures.length,
      formFlowResults,
      projectsResult,
      screenshots: screenshotDir
    }, null, 2));
  } finally {
    browser.kill("SIGTERM");
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
