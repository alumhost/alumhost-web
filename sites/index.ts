/**
 * Worker "alumhost-sites": sirve las webs de Publish en <nombre>.alumhost.dev desde D1 (tabla blobs, trozos de 1 MB).
 * Solo LEE (qué versión está activa y sus archivos). No tiene secretos ni escribe nada:
 * el contenido de los estudiantes vive aislado del Worker de la web principal.
 *
 * Rutas: /a/ → a/index.html · /a → a.html o a/index.html · no existe → 404.html del sitio o una página nuestra.
 * Despliegue: npx wrangler deploy -c sites/wrangler.jsonc
 */
import { cleanPath, contentType, validName } from "../worker/publish-rules";

interface Env {
  PUBLISH_DB: D1Database;
}

const BASE = ".alumhost.dev";

const SECURITY = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000",
  "x-hosted-by": "AlumHost Publish (abuse@alumhost.dev)",
};

const page = (status: number, title: string, text: string) =>
  new Response(
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>` +
      `<body style="font:16px/1.5 system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 1rem;color:#0d1640">` +
      `<h1 style="font-size:1.6rem">${title}</h1><p>${text}</p><p><a href="https://alumhost.dev/publicar/">AlumHost Publish</a></p></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60", ...SECURITY } },
  );

/** Versión activa del sitio, con caché de 60 s en el edge para no consultar D1 en cada visita. */
async function activeVersion(env: Env, name: string, ctx: ExecutionContext): Promise<string | null> {
  const cache = caches.default;
  const key = new Request(`https://publish-cache.internal/v/${name}`);
  const hit = await cache.match(key);
  if (hit) return (await hit.text()) || null;
  const row = await env.PUBLISH_DB.prepare("SELECT version FROM sites WHERE name = ? AND status = 'active'")
    .bind(name)
    .first<{ version: string | null }>();
  const v = row?.version ?? "";
  ctx.waitUntil(cache.put(key, new Response(v, { headers: { "cache-control": "max-age=60" } })));
  return v || null;
}

/** Lee un archivo (todos sus trozos, en orden). null si no existe. */
async function readFile(env: Env, name: string, version: string, path: string): Promise<Uint8Array | null> {
  const { results } = await env.PUBLISH_DB.prepare("SELECT data FROM blobs WHERE site = ? AND version = ? AND path = ? ORDER BY chunk")
    .bind(name, version, path)
    .all<{ data: ArrayBuffer | number[] }>();
  if (!results.length) return null;
  const parts = results.map((r) => (Array.isArray(r.data) ? Uint8Array.from(r.data) : new Uint8Array(r.data)));
  if (parts.length === 1) return parts[0];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

export default {
  async fetch(req, env, ctx): Promise<Response> {
    const url = new URL(req.url);
    const host = url.hostname.toLowerCase();
    if (host === "www.alumhost.dev") return Response.redirect(`https://alumhost.dev${url.pathname}${url.search}`, 301);
    if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method Not Allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    if (!host.endsWith(BASE)) return page(404, "Sitio no encontrado", "Esta dirección no pertenece a AlumHost.");
    const name = host.slice(0, -BASE.length);
    if (!validName(name)) return page(404, "Sitio no encontrado", "Esta dirección no está en uso.");

    const version = await activeVersion(env, name, ctx);
    if (!version) return page(404, `${name}.alumhost.dev está libre`, "Todavía no hay ninguna web aquí. Puedes publicar la tuya gratis.");

    let path: string;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      return page(400, "Dirección no válida", "La dirección tiene caracteres que no se pueden leer.");
    }
    const wantsDir = path.endsWith("/");
    path = path.replace(/^\/+|\/+$/g, "");
    const candidates: string[] = [];
    if (path === "") candidates.push("index.html");
    else {
      const clean = cleanPath(path);
      if (clean) {
        if (wantsDir) candidates.push(`${clean}/index.html`);
        else candidates.push(clean, `${clean}.html`, `${clean}/index.html`);
      }
    }

    // Cada versión es inmutable: su id sirve de ETag y de clave de caché en el edge (así casi no se lee D1).
    const etag = `"${version}"`;
    if (req.headers.get("if-none-match") === etag) return new Response(null, { status: 304, headers: { ...SECURITY, etag } });
    const cacheKey = new Request(`https://publish-cache.internal/f/${name}/${version}${url.pathname}`);
    const cached = await caches.default.match(cacheKey);
    if (cached) return req.method === "HEAD" ? new Response(null, cached) : cached;

    for (const p of candidates) {
      const data = await readFile(env, name, version, p);
      if (!data) continue;
      // /carpeta (sin barra) que resuelve a carpeta/index.html: redirigimos para que las rutas relativas funcionen.
      if (p.endsWith("/index.html") && !wantsDir && p !== "index.html") {
        return Response.redirect(`${url.origin}/${p.slice(0, -"index.html".length)}${url.search}`, 301);
      }
      const res = new Response(data, { headers: { ...SECURITY, "content-type": contentType(p), "cache-control": "public, max-age=300", etag } });
      ctx.waitUntil(caches.default.put(cacheKey, res.clone()));
      return req.method === "HEAD" ? new Response(null, res) : res;
    }

    const custom = await readFile(env, name, version, "404.html");
    if (custom) {
      return new Response(custom, { status: 404, headers: { ...SECURITY, "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
    }
    return page(404, "Página no encontrada", "Esta página no existe en este sitio.");
  },
} satisfies ExportedHandler<Env>;
