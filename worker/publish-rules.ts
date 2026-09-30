/**
 * Reglas compartidas de Publish (webs estáticas gratis en <nombre>.alumhost.dev).
 * Las usan el Worker principal (worker/publish.ts, altas y despliegues) y el Worker que sirve los sitios (sites/).
 * IA: si cambias un límite aquí, cambia el texto de i18n (publish.*) que lo explica.
 */

/** Nombre de sitio: 2-30 caracteres a-z, 0-9 y guiones, sin guion al principio ni al final. */
export const NAME_RE = /^[a-z0-9](?:[a-z0-9-]{0,28}[a-z0-9])$/;

/** Subdominios que nunca se dan: son nuestros o se prestan a suplantación. */
export const RESERVED = new Set([
  "www", "api", "app", "admin", "panel", "dashboard", "login", "auth", "account", "cuenta", "mail", "smtp", "imap",
  "pop", "webmail", "ssh", "vpn", "ftp", "ns1", "ns2", "dns", "cdn", "static", "assets", "status", "estado", "blog",
  "docs", "help", "ayuda", "soporte", "support", "hola", "abuse", "privacidad", "privacy", "postmaster", "security",
  "seguridad", "beta", "publish", "publicar", "billing", "pago", "pagos", "stripe", "alumhost", "test", "prueba",
  "demo", "universidad", "us", "secretaria", "campus", "moodle", "ev", "sso", "cas", "idp",
]);

export const LIMITS = {
  // Los archivos viven en D1 (sin tarjeta: 500 MB por base de datos en el plan gratuito), así que los límites son
  // modestos. Si se pasa a R2 (10 GB gratis, pide tarjeta), se pueden subir a 100 MB por sitio (decisión d-15).
  maxFiles: 1000,
  maxFileBytes: 5 * 1024 * 1024, // 5 MB por archivo
  maxSiteBytes: 20 * 1024 * 1024, // 20 MB por sitio
  chunkBytes: 1024 * 1024, // cada archivo se guarda en trozos de 1 MB (límite de fila de D1: 2 MB)
  tokenHours: 24, // validez del enlace mágico
  requestsPerEmailPerHour: 3,
};

export const validName = (name: string): boolean => NAME_RE.test(name) && !RESERVED.has(name);

/**
 * Normaliza la ruta de un archivo del sitio. Devuelve null si no es aceptable:
 * sin "..", sin rutas absolutas, sin segmentos ocultos (salvo .well-known), solo caracteres seguros.
 */
export const cleanPath = (raw: string): string | null => {
  if (typeof raw !== "string" || raw.length === 0 || raw.length > 200) return null;
  const parts = raw.replace(/\\/g, "/").split("/").filter((p) => p.length > 0 && p !== ".");
  if (parts.length === 0 || parts.length > 12) return null;
  for (const p of parts) {
    if (p === "..") return null;
    if (p.startsWith(".") && p !== ".well-known") return null;
    if (!/^[A-Za-z0-9._@+~-]{1,100}$/.test(p)) return null;
  }
  return parts.join("/");
};

const TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8", htm: "text/html; charset=utf-8", css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8", mjs: "text/javascript; charset=utf-8", json: "application/json",
  map: "application/json", txt: "text/plain; charset=utf-8", md: "text/plain; charset=utf-8", xml: "application/xml",
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp",
  avif: "image/avif", ico: "image/x-icon", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
  pdf: "application/pdf", mp4: "video/mp4", webm: "video/webm", mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav",
  wasm: "application/wasm", webmanifest: "application/manifest+json", csv: "text/csv; charset=utf-8",
};

export const contentType = (path: string): string => {
  const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
  return TYPES[ext] ?? "application/octet-stream";
};

/** Número de trozos de 1 MB de un archivo (un archivo vacío ocupa 1 trozo vacío). */
export const chunksOf = (size: number): number => Math.max(1, Math.ceil(size / LIMITS.chunkBytes));
