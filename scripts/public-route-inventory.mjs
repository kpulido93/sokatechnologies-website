import { existsSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

export const expectedPublicRoutes = [
  { path: "/", category: "commercial" },
  { path: "/servicios/", category: "commercial" },
  { path: "/soluciones/", category: "commercial" },
  { path: "/servicios/software-a-medida/", category: "commercial" },
  { path: "/servicios/automatizaciones/", category: "commercial" },
  { path: "/servicios/dashboards/", category: "commercial" },
  { path: "/servicios/consultoria-ti-devops/", category: "commercial" },
  { path: "/servicios/sitios-web-corporativos/", category: "commercial" },
  { path: "/servicios/infraestructura-soporte/", category: "commercial" },
  { path: "/servicios/mantenimiento-mejora-continua/", category: "commercial" },
  { path: "/productos/", category: "commercial" },
  { path: "/productos/portik/", category: "commercial" },
  { path: "/productos/autoinventario/", category: "commercial" },
  { path: "/productos/autowhatsapp/", category: "commercial" },
  { path: "/contacto/", category: "commercial" },
  { path: "/diagnostico/", category: "commercial" },
  { path: "/auditoria/", category: "demo" },
  { path: "/casos/", category: "compatibility" },
  { path: "/demos/ecommerce/", category: "demo" },
  { path: "/nosotros/", category: "commercial" },
  { path: "/politica-privacidad/", category: "compatibility" },
  { path: "/proyectos/", category: "commercial" },
  { path: "/terminos/", category: "compatibility" }
];

const collectHtmlFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? collectHtmlFiles(file) : entry.isFile() && entry.name.endsWith(".html") ? [file] : [];
  });

const routeFromHtmlFile = (dist, file) => {
  const filePath = relative(dist, file).replaceAll("\\", "/");
  if (filePath === "index.html") return "/";
  if (!filePath.endsWith("/index.html")) return null;
  return `/${filePath.slice(0, -"index.html".length)}`;
};

export const discoverPublicRoutes = (dist) => {
  if (!existsSync(dist)) return [];
  return collectHtmlFiles(dist)
    .map((file) => routeFromHtmlFile(dist, file))
    .filter((route) => route && !route.startsWith("/api/"))
    .sort();
};

export const createPublicRouteInventory = (dist) => {
  const generatedRoutes = discoverPublicRoutes(dist);
  const expectedRoutes = expectedPublicRoutes.map(({ path }) => path);
  const categoryByRoute = new Map(expectedPublicRoutes.map(({ path, category }) => [path, category]));
  return {
    generatedRoutes,
    expectedRoutes,
    missingRoutes: expectedRoutes.filter((route) => !generatedRoutes.includes(route)),
    unexpectedRoutes: generatedRoutes.filter((route) => !expectedRoutes.includes(route)),
    classifications: Object.fromEntries(generatedRoutes.map((route) => [route, categoryByRoute.get(route) ?? "unexpected"]))
  };
};
