import type { UrlSafetyResult } from "./types";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const BLOCKED_INTERNAL_HOST_SUFFIXES = [".internal", ".local", ".localhost"];
const BLOCKED_METADATA_IPS = new Set([
  "169.254.169.254",
  "100.100.100.200",
  "192.0.0.192",
  "192.0.0.170"
]);

const hasExplicitScheme = (value: string) => /^[a-z][a-z0-9+.-]*:/i.test(value);

const stripIpv6Brackets = (hostname: string) =>
  hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;

const isIpv4 = (hostname: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

const parseIpv4 = (hostname: string) => {
  if (!isIpv4(hostname)) {
    return null;
  }

  const octets = hostname.split(".").map((part) => Number(part));

  if (octets.some((octet) => Number.isNaN(octet) || octet < 0 || octet > 255)) {
    return null;
  }

  return octets;
};

const isPrivateOrReservedIpv4 = (hostname: string) => {
  const octets = parseIpv4(hostname);

  if (!octets) {
    return false;
  }

  const [a, b] = octets;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && (b === 0 || b === 168)) ||
    (a === 198 && (b === 18 || b === 19))
  );
};

const isIpv6 = (hostname: string) => hostname.includes(":");

const isPrivateOrReservedIpv6 = (hostname: string) => {
  if (!isIpv6(hostname)) {
    return false;
  }

  const normalized = hostname.toLowerCase();

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  );
};

export const normalizeAuditUrl = (rawValue: string) => {
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return null;
  }

  const candidate = hasExplicitScheme(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;

  try {
    const url = new URL(candidate);
    url.hash = "";

    if (!url.pathname) {
      url.pathname = "/";
    }

    return url;
  } catch {
    return null;
  }
};

export const assessAuditUrlSafety = (rawValue: string): UrlSafetyResult => {
  if (!rawValue.trim()) {
    return {
      safe: false,
      code: "empty",
      reason: "La URL del sitio es obligatoria."
    };
  }

  const url = normalizeAuditUrl(rawValue);

  if (!url) {
    return {
      safe: false,
      code: "invalid-url",
      reason: "La URL no tiene un formato válido."
    };
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    return {
      safe: false,
      code: "unsupported-protocol",
      reason: "Solo se permiten URLs públicas con protocolo http o https."
    };
  }

  if (url.username || url.password) {
    return {
      safe: false,
      code: "blocked-url-credentials",
      reason: "No se permiten URLs con credenciales embebidas en la auditoría."
    };
  }

  const hostname = stripIpv6Brackets(url.hostname.toLowerCase());

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
    return {
      safe: false,
      code: "blocked-localhost",
      reason: "No se permiten entornos locales como localhost o loopback."
    };
  }

  if (BLOCKED_INTERNAL_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    return {
      safe: false,
      code: "blocked-internal-host",
      reason: "No se permiten dominios internos o locales para la auditoría."
    };
  }

  if (BLOCKED_METADATA_IPS.has(hostname)) {
    return {
      safe: false,
      code: "blocked-metadata-ip",
      reason: "No se permiten IPs de metadata cloud."
    };
  }

  if (isPrivateOrReservedIpv4(hostname) || isPrivateOrReservedIpv6(hostname)) {
    return {
      safe: false,
      code: "blocked-private-ip",
      reason: "No se permiten IPs privadas, reservadas o de red interna."
    };
  }

  return {
    safe: true,
    normalizedUrl: url.toString(),
    hostname,
    protocol: url.protocol as "http:" | "https:"
  };
};
