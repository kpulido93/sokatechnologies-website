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
      const heroVisual = document.querySelector(".hero-visual");
      const heroFigure = document.querySelector(".hero-image-figure");
      const heroImage = heroFigure?.querySelector("img");
      const heroVisualRect = heroVisual?.getBoundingClientRect();
      const heroFigureRect = heroFigure?.getBoundingClientRect();
      const heroImageRect = heroImage?.getBoundingClientRect();
      const heroImageLoaded = heroImage instanceof HTMLImageElement && heroImage.complete && heroImage.naturalWidth > 0;
      const heroImageResponsive = Boolean(heroImage?.getAttribute("srcset") && heroImage?.getAttribute("sizes"));
      const heroImageLayout = Boolean(
        heroVisualRect && heroFigureRect && heroImageRect &&
        heroImageRect.width > 0 && heroImageRect.height > 0 &&
        heroImageRect.left >= heroVisualRect.left - 1 &&
        heroImageRect.right <= heroVisualRect.right + 1 &&
        heroFigureRect.left >= heroVisualRect.left - 1 &&
        heroFigureRect.right <= heroVisualRect.right + 1
      );
      const homeMap = currentRoute !== "/" || Boolean(
        heroImageLoaded && heroImageResponsive && heroImageLayout &&
        heroImage.alt.includes("datos")
      );
      const portraitImage = document.querySelector(".founder-portrait img");
      const founderPortrait = currentRoute !== "/nosotros/" || Boolean(
        portraitImage instanceof HTMLImageElement && portraitImage.alt.trim() &&
        portraitImage.getAttribute("srcset") && portraitImage.getAttribute("sizes")
      );
      let mobileHeader = { checked: false, failures: [] };
      if (["mobile-360", "mobile", "mobile-390", "tablet"].includes(currentViewport) && ["/contacto/", "/diagnostico/", "/auditoria/"].includes(currentRoute)) {
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
        heroImageLoaded,
        heroImageResponsive,
        heroImageLayout,
        founderPortrait,
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

const checkAuditDemoFlow = async (client, sessionId, scenario = "generic") =>
  evaluate(
    client,
    `(async () => {
      const form = document.querySelector(".audit-form");
      if (!(form instanceof HTMLFormElement)) return { found: false };
      const scenario = ${JSON.stringify(scenario)};
      const scenarios = {
        generic: {
          companyType: "Servicios B2B",
          mainProblem: "Descripción de prueba suficientemente larga para validar la simulación local.",
          expectedTopic: "claridad del contexto"
        },
        web: {
          companyType: "Servicios B2B",
          mainProblem: "La web no explica bien nuestra oferta y el formulario genera pocos contactos.",
          expectedTopic: "claridad del mensaje"
        },
        data: {
          companyType: "Tecnología o SaaS",
          mainProblem: "Necesitamos dashboards y reportes para ordenar datos e indicadores del negocio.",
          expectedTopic: "visibilidad operativa y reportes"
        },
        infrastructure: {
          companyType: "Tecnología o SaaS",
          mainProblem: "La infraestructura tiene caídas, soporte lento y dudas sobre backups y continuidad.",
          expectedTopic: "continuidad técnica y soporte"
        }
      };
      const selectedScenario = scenarios[scenario] || scenarios.generic;
      const values = {
        websiteUrl: "https://example.invalid",
        name: "Persona de prueba",
        company: "Empresa de prueba",
        email: "demo@example.invalid",
        country: "Colombia",
        companyType: selectedScenario.companyType,
        mainProblem: selectedScenario.mainProblem
      };
      Array.from(form.querySelectorAll("input[name], select[name], textarea[name]")).forEach((control) => {
        if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return;
        if (control.type === "checkbox") {
          control.checked = true;
        } else if (control.name === "companyType") {
          control.value = control.querySelector("option:not([value=''])")?.value || "Empresa";
        } else if (values[control.name]) {
          control.value = values[control.name];
        }
        control.dispatchEvent(new Event("input", { bubbles: true }));
        control.dispatchEvent(new Event("change", { bubbles: true }));
      });

      const originalFetch = window.fetch;
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalBeacon = navigator.sendBeacon;
      const originalSubmit = HTMLFormElement.prototype.submit;
      let fetchCalls = 0;
      let xhrCalls = 0;
      let beaconCalls = 0;
      let nativeSubmitCalls = 0;
      window.fetch = (...args) => {
        fetchCalls += 1;
        return originalFetch(...args);
      };
      XMLHttpRequest.prototype.open = function (...args) {
        xhrCalls += 1;
        return originalOpen.apply(this, args);
      };
      try {
        navigator.sendBeacon = (...args) => {
          beaconCalls += 1;
          return originalBeacon(...args);
        };
      } catch {}
      HTMLFormElement.prototype.submit = function (...args) {
        nativeSubmitCalls += 1;
        return originalSubmit.apply(this, args);
      };

      try {
        form.requestSubmit();
        await new Promise((resolve) => setTimeout(resolve, 0));
      } finally {
        window.fetch = originalFetch;
        XMLHttpRequest.prototype.open = originalOpen;
        try { navigator.sendBeacon = originalBeacon; } catch {}
        HTMLFormElement.prototype.submit = originalSubmit;
      }

      const successNode = document.getElementById(form.dataset.successId || "");
      const previewNode = document.getElementById(form.dataset.previewId || "");
      previewNode?.scrollIntoView({ block: "start", inline: "nearest" });
      await new Promise((resolve) => setTimeout(resolve, 0));
      const previewText = previewNode?.textContent || "";
      const reportHeader = previewNode?.querySelector(".audit-report-header");
      const findingsList = previewNode?.querySelector("[data-audit-findings]");
      const recommendationsList = previewNode?.querySelector("[data-audit-recommendations]");
      const reportColumns = previewNode?.querySelector(".audit-report-columns");
      const siteHeader = document.querySelector(".site-header");
      const previewRect = previewNode?.getBoundingClientRect();
      const headerRect = reportHeader?.getBoundingClientRect();
      const siteHeaderRect = siteHeader?.getBoundingClientRect();
      const internalOverflow = previewNode
        ? [previewNode, ...Array.from(previewNode.querySelectorAll("*"))].filter((node) => node.scrollWidth > node.clientWidth + 1)
        : [];
      const internalOverflowDetails = internalOverflow.map((node) => ({
        element: node.tagName.toLowerCase() + (node.id ? "#" + node.id : "") + (typeof node.className === "string" && node.className ? "." + node.className.split(" ").join(".") : ""),
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        text: node.textContent?.trim().slice(0, 120) || ""
      }));
      const contentBlocks = [reportHeader, findingsList, recommendationsList].filter(Boolean);
      const legible = contentBlocks.every((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return rect.width > 0 && rect.height > 0 && Number.parseFloat(style.fontSize) > 0;
      });
      const reportColumnCount = reportColumns
        ? getComputedStyle(reportColumns).gridTemplateColumns.split(" ").filter(Boolean).length
        : 0;
      return {
        scenario,
        found: true,
        fetchCalls,
        xhrCalls,
        beaconCalls,
        nativeSubmitCalls,
        demoMode: form.dataset.mode === "demo",
        success: Boolean(successNode && !successNode.hidden),
        previewVisible: Boolean(previewNode && !previewNode.hidden),
        simulationLabel: previewText.includes("Simulación local basada en tus respuestas"),
        noScanClaim: previewText.includes("No se evaluó ni escaneó la URL"),
        noUnavailableMessage: !previewText.toLowerCase().includes("indisponibilidad temporal"),
        noNumericMeasurement: !/\\b\\d{1,3}\\/100\\b|(?:score|puntuación)\\s*:\\s*\\d+/i.test(previewText),
        hypothesisLanguage: previewText.includes("Tema por explorar:") && !/\\b(?:se detectó|se observó|se encontró|problema confirmado|sitio evaluado)\\b/i.test(previewText),
        recommendationsHypothesisLanguage: previewText.includes("Hipótesis derivada de tus respuestas:"),
        expectedTopicVisible: previewText.includes(selectedScenario.expectedTopic),
        observationsVisible: Boolean(findingsList?.children.length && findingsList.getBoundingClientRect().height > 0),
        recommendationsVisible: Boolean(recommendationsList?.children.length && recommendationsList.getBoundingClientRect().height > 0),
        completeContent: Boolean(reportHeader && findingsList?.children.length && recommendationsList?.children.length),
        legible,
        noInternalOverflow: internalOverflow.length === 0,
        internalOverflowDetails,
        noHeaderOverlap: Boolean(!siteHeaderRect || !headerRect || headerRect.top >= siteHeaderRect.bottom - 1),
        reportFitsViewport: Boolean(previewRect && previewRect.left >= -1 && previewRect.right <= document.documentElement.clientWidth + 1),
        reportColumnCount,
        reportWidth: previewRect?.width || 0
      };
    })()` ,
    sessionId
  );

const checkMobileMenu = async (client, sessionId) =>
  evaluate(
    client,
    `(async () => {
      const header = document.querySelector(".site-header");
      const toggle = document.querySelector(".menu-toggle");
      const navigation = document.querySelector(".site-nav");
      if (!(header instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement) || !(navigation instanceof HTMLElement)) {
        return { found: false };
      }
      toggle.focus();
      toggle.click();
      await new Promise((resolve) => setTimeout(resolve, 0));
      const links = Array.from(navigation.querySelectorAll("a")).filter((link) => {
        const style = getComputedStyle(link);
        return style.display !== "none" && style.visibility !== "hidden";
      });
      const opened = toggle.getAttribute("aria-expanded") === "true";
      const firstLinkFocused = document.activeElement === links[0];
      const allNavigationLinksVisible = links.length >= 5;
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
      return {
        found: true,
        opened,
        firstLinkFocused,
        allNavigationLinksVisible,
        linkCount: links.length,
        escapeClosed: toggle.getAttribute("aria-expanded") === "false" && getComputedStyle(navigation).display === "none",
        focusReturned: document.activeElement === toggle,
        noOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= document.documentElement.clientWidth + 1
      };
    })()` ,
    sessionId
  );

const checkIdentityAndContact = async (client, sessionId, route, viewport) =>
  evaluate(
    client,
    `(() => {
      const brand = document.querySelector(".brand");
      const logo = brand?.querySelector(".brand-mark");
      const favicon = document.querySelector('link[rel="icon"]');
      const phone = document.querySelector('a[href="tel:+573212554930"]');
      const email = document.querySelector('a[href="mailto:info@sokatechnologies.com"]');
      const hasOfficialWhatsapp = Array.from(document.querySelectorAll("a[href]"))
        .some((link) => /(?:wa\.me|whatsapp)/i.test(link.getAttribute("href") || ""));
      return {
        route: ${JSON.stringify(route)},
        viewport: ${JSON.stringify(viewport)},
        logoLoaded: logo instanceof HTMLImageElement && logo.complete && logo.naturalWidth > 0,
        logoDimensions: logo instanceof HTMLImageElement && logo.getAttribute("width") === "40" && logo.getAttribute("height") === "40",
        logoAccessibleName: brand?.getAttribute("aria-label") === "SokaTechnologies",
        logoCircular: logo instanceof HTMLElement && getComputedStyle(logo).borderRadius === "50%",
        favicon: favicon?.getAttribute("href") === "/brand/sokatechnologies-logo.png" && favicon?.getAttribute("type") === "image/png",
        contactData: ${JSON.stringify(route)} !== "/contacto/" || Boolean(
          document.body.textContent?.includes("Colombia") &&
          phone?.textContent?.includes("+57 321 2554930") &&
          email?.textContent?.includes("info@sokatechnologies.com")
        ),
        noOfficialWhatsapp: !hasOfficialWhatsapp
      };
    })()` ,
    sessionId
  );

const auditDemoPasses = (result) => Boolean(
  result?.found &&
  result.demoMode &&
  result.success &&
  result.previewVisible &&
  result.simulationLabel &&
  result.noScanClaim &&
  result.noUnavailableMessage &&
  result.noNumericMeasurement &&
  result.hypothesisLanguage &&
  result.recommendationsHypothesisLanguage &&
  result.expectedTopicVisible &&
  result.observationsVisible &&
  result.recommendationsVisible &&
  result.completeContent &&
  result.legible &&
  result.noInternalOverflow &&
  result.noHeaderOverlap &&
  result.reportFitsViewport &&
  result.fetchCalls === 0 &&
  result.xhrCalls === 0 &&
  result.beaconCalls === 0 &&
  result.nativeSubmitCalls === 0
);

const checkProjects = async (client, sessionId) =>
  evaluate(
    client,
    `(async () => {
      const cards = Array.from(document.querySelectorAll(".case-card"));
      Array.from(document.querySelectorAll(".case-visual img")).forEach((image) => {
        image.removeAttribute("loading");
        const source = image.getAttribute("src");
        if (source) image.setAttribute("src", source);
        image.scrollIntoView({ block: "center", inline: "nearest" });
      });
      await Promise.all(Array.from(document.querySelectorAll(".case-visual img")).map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
          setTimeout(resolve, 5000);
        });
      }));
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
        noDoubleProjectDirect: directLabelCounts.every((count) => count === 1),
        projectImages: cards.map((card) => {
          const image = card.querySelector(".case-visual img");
          const caption = card.querySelector(".case-visual figcaption");
          const rect = image?.getBoundingClientRect();
          return {
            loaded: image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
            responsive: Boolean(image?.getAttribute("srcset") && image?.getAttribute("sizes")),
            visible: Boolean(rect && rect.width > 0 && rect.height > 0),
            caption: caption?.textContent.trim() === "Visualización conceptual · Datos ficticios"
          };
        })
      };
    })()` ,
    sessionId
  );

const checkFounderPortrait = async (client, sessionId) =>
  evaluate(
    client,
    `(async () => {
      const image = document.querySelector(".founder-portrait img");
      if (!(image instanceof HTMLImageElement)) return { found: false };
      image.removeAttribute("loading");
      const source = image.getAttribute("src");
      if (source) image.setAttribute("src", source);
      image.scrollIntoView({ block: "center", inline: "nearest" });
      if (!image.complete) {
        await new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
          setTimeout(resolve, 5000);
        });
      }
      return {
        found: true,
        loaded: image.complete && image.naturalWidth > 0,
        alt: Boolean(image.alt.trim()),
        responsive: Boolean(image.getAttribute("srcset") && image.getAttribute("sizes"))
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
  const capturePrimary = ["/", "/proyectos/", "/nosotros/", "/auditoria/"].includes(route) && ["desktop", "tablet", "mobile"].includes(viewport.name);
  const captureForm = ["/contacto/", "/diagnostico/", "/auditoria/"].includes(route) &&
    (viewport.name === "desktop" || (route === "/contacto/" && viewport.name === "mobile"));
  if (!capturePrimary && !captureForm) return;
  mkdirSync(screenshotDir, { recursive: true });
  const name = route === "/" ? "home" : route.slice(1, -1).replaceAll("/", "-");
  const fileName = `${name}-${viewport.name}.png`;
  await evaluate(client, 'document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: "instant" });', sessionId);
  const screenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
  writeFileSync(join(screenshotDir, fileName), Buffer.from(screenshot.data, "base64"));
  if (route === "/" && viewport.name === "mobile") {
    writeFileSync(join(screenshotDir, "header-mobile-375.png"), Buffer.from(screenshot.data, "base64"));
  }
  if (route === "/" && viewport.name === "desktop") {
    await evaluate(client, 'document.querySelector(".hero-image-figure")?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });', sessionId);
    await sleep(800);
    const mapScreenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(join(screenshotDir, "home-map-desktop.png"), Buffer.from(mapScreenshot.data, "base64"));
    await evaluate(client, "document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: \"instant\" });", sessionId);
  }
  if (["/contacto/", "/diagnostico/", "/auditoria/"].includes(route) && viewport.name === "desktop") {
    await evaluate(client, 'document.querySelector(".form-demo-notice")?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });', sessionId);
    await sleep(800);
    const formScreenshot = await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(join(screenshotDir, `${name}-form-${viewport.name}.png`), Buffer.from(formScreenshot.data, "base64"));
    await evaluate(client, "window.scrollTo({ top: 0, behavior: \"instant\" });", sessionId);
  }
  if (route === "/auditoria/" && ["desktop", "mobile"].includes(viewport.name)) {
    await checkAuditDemoFlow(client, sessionId);
    await evaluate(client, 'document.querySelector(".audit-report-preview")?.scrollIntoView({ behavior: "instant", block: "start", inline: "nearest" });', sessionId);
    await sleep(800);
    const reportBox = await evaluate(
      client,
      `(() => {
        const report = document.querySelector(".audit-report-preview");
        if (!(report instanceof HTMLElement)) return null;
        const rect = report.getBoundingClientRect();
        return {
          x: Math.max(0, rect.x),
          y: Math.max(0, rect.y + window.scrollY),
          width: rect.width,
          height: rect.height
        };
      })()`,
      sessionId
    );
    const resultScreenshot = reportBox
      ? await client.send(
          "Page.captureScreenshot",
          {
            format: "png",
            captureBeyondViewport: true,
            clip: {
              x: reportBox.x,
              y: reportBox.y,
              width: reportBox.width,
              height: reportBox.height,
              scale: 1
            }
          },
          sessionId
        )
      : await client.send("Page.captureScreenshot", { format: "png" }, sessionId);
    writeFileSync(join(screenshotDir, `auditoria-demo-result-${viewport.name}.png`), Buffer.from(resultScreenshot.data, "base64"));
  }
  if (route === "/proyectos/" && viewport.name === "desktop") {
    await evaluate(client, `(async () => {
      const images = Array.from(document.querySelectorAll(".case-visual img"));
      images.forEach((image) => {
        image.removeAttribute("loading");
        const source = image.getAttribute("src");
        if (source) image.setAttribute("src", source);
      });
      document.querySelector(".case-grid")?.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
      await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
    })()`, sessionId);
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
    let auditDemoFlowResult = null;
    const auditDemoFlowResults = [];
    for (const [route, selector] of [["/contacto/", ".contact-form"], ["/diagnostico/", ".contact-form"], ["/auditoria/", ".audit-form"]]) {
      await client.send("Page.navigate", { url: new URL(route, baseUrl).toString() }, sessionId);
      await sleep(350);
      await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
      const formResult = await checkFormErrors(client, sessionId, selector);
      const demoRequired = ["/contacto/", "/diagnostico/", "/auditoria/"].includes(route);
      if (strict && (!formResult.found || formResult.errorCount === 0 || formResult.invalidCount === 0 || !formResult.associated || !formResult.honeypotHidden || formResult.honeypotTabbable || !formResult.demoNoticeBeforeFields || !formResult.demoButtonLabel || (demoRequired && !formResult.demoEndpointEmpty))) {
        throw new Error(`Form error association failed for ${route}: ${JSON.stringify(formResult)}`);
      }
      if (route === "/auditoria/") {
        for (const scenario of ["generic", "web", "data", "infrastructure"]) {
          const result = await checkAuditDemoFlow(client, sessionId, scenario);
          auditDemoFlowResults.push(result);
          if (strict && (!auditDemoPasses(result) || result.reportColumnCount !== 1)) {
            throw new Error(`Audit demo network/content check failed: ${JSON.stringify(result)}`);
          }
        }
        auditDemoFlowResult = auditDemoFlowResults[0];
      } else if (demoRequired) {
        const flowResult = await checkFormFlow(client, sessionId, selector);
        formFlowResults.push({ route, ...flowResult });
        if (strict && (!flowResult.found || flowResult.invalidCount === 0 || !flowResult.associated || !flowResult.firstErrorFocused || !flowResult.transitionToSuccess || flowResult.remainingFieldErrors !== 0 || flowResult.fetchCalls !== 0 || !flowResult.demoMode)) {
          throw new Error(`FORM-02 demo flow failed for ${route}: ${JSON.stringify(flowResult)}`);
        }
      }
    }

    const responsiveViewports = [
      { name: "mobile-360", width: 360, height: 812 },
      { name: "mobile", width: 375, height: 812 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "tablet", width: 768, height: 1024 }
    ];
    const responsiveResults = [];
    const mobileMenuResults = [];
    for (const viewport of responsiveViewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width < 600
      }, sessionId);
      for (const route of ["/contacto/", "/diagnostico/", "/auditoria/"]) {
        await client.send("Page.navigate", { url: new URL(route, baseUrl).toString() }, sessionId);
        await sleep(350);
        await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
        responsiveResults.push(await pageChecks(client, sessionId, route, viewport));
      }
      await client.send("Page.navigate", { url: new URL("/", baseUrl).toString() }, sessionId);
      await sleep(350);
      await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
      mobileMenuResults.push({ viewport: viewport.name, ...(await checkMobileMenu(client, sessionId)) });
    }

    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    }, sessionId);
    await client.send("Page.navigate", { url: new URL("/auditoria/", baseUrl).toString() }, sessionId);
    await sleep(350);
    await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
    const desktopAuditDemoFlowResult = await checkAuditDemoFlow(client, sessionId, "generic");
    if (strict && (!auditDemoPasses(desktopAuditDemoFlowResult) || desktopAuditDemoFlowResult.reportColumnCount < 2)) {
      throw new Error(`Desktop audit demo layout check failed: ${JSON.stringify(desktopAuditDemoFlowResult)}`);
    }

    await client.send("Page.navigate", { url: new URL("/proyectos/", baseUrl).toString() }, sessionId);
    await sleep(350);
    await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
    const projectsResult = await checkProjects(client, sessionId);
    if (strict && (projectsResult.cards !== 2 || projectsResult.duplicateTags.length > 0 || !projectsResult.noDoubleProjectDirect || projectsResult.projectImages.length !== 2 || projectsResult.projectImages.some((image) => !image.loaded || !image.responsive || !image.visible || !image.caption))) {
      throw new Error(`Projects content check failed: ${JSON.stringify(projectsResult)}`);
    }

    await client.send("Page.navigate", { url: new URL("/nosotros/", baseUrl).toString() }, sessionId);
    await sleep(350);
    await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
    const founderPortraitResult = await checkFounderPortrait(client, sessionId);
    if (strict && (!founderPortraitResult.found || !founderPortraitResult.loaded || !founderPortraitResult.alt || !founderPortraitResult.responsive)) {
      throw new Error(`Founder portrait check failed: ${JSON.stringify(founderPortraitResult)}`);
    }

    await client.send("Page.navigate", { url: new URL("/", baseUrl).toString() }, sessionId);
    await sleep(350);
    const keyboardFocus = await checkKeyboard(client, sessionId);
    const identityResults = [];
    for (const [route, viewport] of [["/", "desktop"], ["/", "mobile"], ["/contacto/", "desktop"], ["/contacto/", "mobile"]]) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport === "mobile" ? 375 : 1440,
        height: viewport === "mobile" ? 812 : 900,
        deviceScaleFactor: 1,
        mobile: viewport === "mobile"
      }, sessionId);
      await client.send("Page.navigate", { url: new URL(route, baseUrl).toString() }, sessionId);
      await sleep(350);
      await waitFor(() => evaluate(client, "document.readyState === 'complete'", sessionId));
      identityResults.push(await checkIdentityAndContact(client, sessionId, route, viewport));
    }
    const allResults = [...results, ...responsiveResults];
    const overflowFailures = allResults.filter((result) =>
      result.rootOverflow || result.internalOverflow.length > 0 || result.nestedOverflow.length > 0
    );
    const focusFailures = allResults.filter((result) => !result.focusVisible);
    const homeMapFailures = allResults.filter((result) => result.route === "/" && !result.homeMap);
    const founderPortraitFailures = allResults.filter((result) => !result.founderPortrait);
    const mobileHeaderFailures = allResults.filter((result) => result.mobileHeader?.failures?.length > 0);
    const demoModeFailures = results.filter(({ route, formMode }) =>
      ["/contacto/", "/diagnostico/", "/auditoria/"].includes(route) && formMode !== "demo"
    );
    const mobileMenuFailures = mobileMenuResults.filter((result) => !result.found || !result.opened || !result.firstLinkFocused || !result.allNavigationLinksVisible || !result.escapeClosed || !result.focusReturned || !result.noOverflow);
    const identityFailures = identityResults.filter((result) => !result.logoLoaded || !result.logoDimensions || !result.logoAccessibleName || !result.logoCircular || !result.favicon || !result.contactData || !result.noOfficialWhatsapp);
    if (strict && (overflowFailures.length > 0 || focusFailures.length > 0 || demoModeFailures.length > 0 || homeMapFailures.length > 0 || founderPortraitFailures.length > 0 || mobileHeaderFailures.length > 0 || mobileMenuFailures.length > 0 || identityFailures.length > 0 || keyboardFocus === "BODY")) {
      throw new Error(`Visual/accessibility smoke failed: ${JSON.stringify({ overflowFailures, focusFailures, demoModeFailures, homeMapFailures, founderPortraitFailures, mobileHeaderFailures, mobileMenuFailures, identityFailures, keyboardFocus })}`);
    }

    console.log(JSON.stringify({
      baseUrl,
      strict,
      routes: routes.length,
      viewports: viewports.map(({ name, width, height }) => `${name}=${width}x${height}`),
      responsiveViewports: responsiveViewports.map(({ name, width, height }) => `${name}=${width}x${height}`),
      faqCount,
      keyboardFocus,
      overflowFailures: overflowFailures.length,
      overflowDetails: overflowFailures.slice(0, 5).map(({ route, viewport, internalOverflow, nestedOverflow }) => ({ route, viewport, internalOverflow, nestedOverflow })),
      focusFailures: focusFailures.length,
      demoModeFailures: demoModeFailures.length,
      homeMapFailures: homeMapFailures.length,
      founderPortraitFailures: founderPortraitFailures.length,
      mobileHeaderFailures: mobileHeaderFailures.length,
      formFlowResults,
      auditDemoFlowResult,
      auditDemoFlowResults,
      desktopAuditDemoFlowResult,
      founderPortraitResult,
      mobileMenuResults,
      identityResults,
      identityFailures: identityFailures.length,
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
