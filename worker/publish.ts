/**
 * Publish gratis: webs estáticas en <nombre>.alumhost.dev, sin cuentas ni contraseñas.
 *
 * Flujo (el navegador hace el trabajo pesado; el Worker solo autoriza y guarda, así cabe en el plan gratuito):
 *   1. POST /api/publish/request   {name, email, lang, token}  → Turnstile + correo con enlace mágico (24 h)
 *   2. POST /api/publish/session                               → datos del sitio del enlace (Authorization: Bearer <t>)
 *   3. POST /api/publish/deploy/start  {files:[{p,s}], source} → reserva una versión nueva y su lista de archivos
 *   4. PUT  /api/publish/deploy/file?d=&p=&c=  (cuerpo = trozo de 1 MB) → sube un trozo de un archivo (zip o carpeta)
 *      POST /api/publish/deploy/fetch {d, p}                   → o lo trae de GitHub (raw) en el servidor
 *   5. POST /api/publish/deploy/finish {d}                      → comprueba que está todo y activa la versión
 *      POST /api/publish/delete                                 → borra el sitio
 *      POST /api/publish/confirm {c}                            → confirmación anual (enlace del correo, sin sesión)
 *
 * Datos: todo en D1 (migrations/0001_publish.sql); los archivos, en la tabla blobs en trozos de 1 MB. Sin R2 (pide tarjeta).
 * Los sitios los sirve OTRO Worker (sites/), sin secretos ni acceso de escritura.
 * Seguridad: solo correos de universidades de la lista, un sitio por correo, del token solo se guarda su SHA-256,
 * rutas limpiadas (cleanPath), límites de tamaño, y nada del contenido del estudiante se ejecuta en servidor.
 */
import { LIMITS, chunksOf, cleanPath, validName } from "./publish-rules";
import { json, readJson, readLimited, verifyTurnstile } from "./turnstile";
import { universities } from "../src/config/universities";
import { sendMail, type MailEnv } from "./mail";
import * as T from "./mail-templates";

export interface PublishEnv extends MailEnv {
  PUBLISH_DB?: D1Database;
  PUBLISH_EMAIL_DOMAINS?: string; // opcional: anula src/config/universities.ts, p. ej. "a.es,b.es"
  TURNSTILE_SECRET?: string;
  CONTACT_LIMITER?: RateLimit;
  PUBLISH_LIMITER?: RateLimit; // binding ratelimits: peticiones autenticadas por sitio
  ALLOW_LOG_ONLY?: string;
}

/** Origen fijo de los enlaces mágicos: nunca se construye con el Host de la petición (salvo en local). */
export const PUBLIC_ORIGIN = "https://alumhost.dev";
/** Página donde se pide el enlace mágico (la enlazan los correos). */
export const requestPage = (lang: "es" | "en") => `${PUBLIC_ORIGIN}${lang === "es" ? "/publicar/" : "/en/publish/"}`;

type Env = PublishEnv & { PUBLISH_DB: D1Database };
interface Session { name: string; email: string; status: string | null; lang: "es" | "en" }
interface Manifest { files: Record<string, number>; github?: { repo: string; sha: string; dir: string } }

const EMAIL = /^[^\s@]+@([^\s@]+\.[^\s@]{2,})$/;
const REPO = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;
/** El nombre del repo no puede ser "." ni ".." (la regex los deja pasar). */
const repoOk = (r: string) => REPO.test(r) && !/^\.{1,2}$/.test(r.split("/")[1]);
const SHA = /^[0-9a-f]{40}$/;
export const now = () => Math.floor(Date.now() / 1000);

export const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export const sha256 = async (s: string) => {
  const d = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  return [...d].map((b) => b.toString(16).padStart(2, "0")).join("");
};
const newId = () => b64url(crypto.getRandomValues(new Uint8Array(12)));

// ---------------------------------------------------------------- correo

const sendMagicLink = (env: Env, to: string, name: string, link: string, lang: "es" | "en") =>
  sendMail(env, to, T.magicLink(lang, name, link), "publish-link");

// ---------------------------------------------------------------- sesión (enlace mágico)

async function session(req: Request, env: Env): Promise<Session | null> {
  const auth = req.headers.get("authorization") ?? "";
  const t = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(t)) return null;
  const row = await env.PUBLISH_DB.prepare(
    "SELECT t.name, t.email, t.lang, t.expires_at, s.email AS owner, s.status FROM tokens t LEFT JOIN sites s ON s.name = t.name WHERE t.hash = ?",
  )
    .bind(await sha256(t))
    .first<{ name: string; email: string; lang: string; expires_at: number; owner: string | null; status: string | null }>();
  if (!row || row.expires_at < now()) return null;
  // Dos personas pueden pedir enlace para un nombre libre. En cuanto una publica, el token de la otra deja de valer
  // (antes podía borrar o ver el sitio ajeno durante 24 h).
  if (row.owner !== null && row.owner !== row.email) return null;
  return { name: row.name, email: row.email, status: row.status, lang: row.lang === "en" ? "en" : "es" };
}

// ---------------------------------------------------------------- 1. pedir enlace

async function request(req: Request, env: Env): Promise<Response> {
  const ip = req.headers.get("cf-connecting-ip");
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: `publish:${ip ?? "unknown"}` });
    if (!success) return json({ ok: false, error: "rate_limited" }, 429);
  }
  const raw = await readJson(req, 4096);
  if (raw === "too_big") return json({ ok: false, error: "size" }, 413);
  if (raw === "bad") return json({ ok: false, error: "validation" }, 400);
  if (typeof raw.website === "string" && raw.website.length > 0) return json({ ok: true }); // trampa para bots

  const name = String(raw.name ?? "").trim().toLowerCase();
  const email = String(raw.email ?? "").trim().toLowerCase();
  const lang = raw.lang === "en" ? "en" : "es";
  if (!validName(name)) return json({ ok: false, error: "name" }, 400);
  const m = EMAIL.exec(email);
  if (!m || email.length > 254 || email.split("@")[0].includes("+")) return json({ ok: false, error: "email" }, 400); // sin alias +: evita saltarse "un sitio por correo"
  // Lista en src/config/universities.ts. PUBLISH_EMAIL_DOMAINS ("a.es,b.es") la sustituye si se define (pruebas).
  // El dominio se comprueba más abajo, con el sitio a mano (un correo cambiado tras graduarse puede no ser de la lista).
  const allowed = env.PUBLISH_EMAIL_DOMAINS
    ? env.PUBLISH_EMAIL_DOMAINS.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean)
    : universities.map((u) => u.domain.toLowerCase());
  if (raw.accept !== true) return json({ ok: false, error: "accept" }, 400);

  if (!env.TURNSTILE_SECRET) return json({ ok: false, error: "server" }, 500);
  const verdict = await verifyTurnstile(typeof raw.token === "string" ? raw.token : "", env.TURNSTILE_SECRET, ip);
  if (verdict === "unavailable") return json({ ok: false, error: "server" }, 503);
  if (verdict === "bot") return json({ ok: false, error: "turnstile" }, 400);

  const db = env.PUBLISH_DB;
  const site = await db.prepare("SELECT email, status FROM sites WHERE name = ?").bind(name).first<{ email: string; status: string }>();
  // Correo de fuera de la lista: solo si ya es el de este sitio (el equipo lo cambió a mano al graduarse; ver docs/correos.md).
  if (!allowed.includes(m[1]) && site?.email !== email) return json({ ok: false, error: "email_domain" }, 400);
  if (site && site.email !== email) return json({ ok: false, error: "name_taken" }, 409);
  // Suspendido por abuso: no. Suspendido por inactividad ('inactive'): sí, abrir el enlace lo reactiva (ver info).
  if (site && site.status === "suspended") return json({ ok: false, error: "suspended" }, 403);
  if (!site) {
    const other = await db.prepare("SELECT name FROM sites WHERE email = ? LIMIT 1").bind(email).first<{ name: string }>();
    if (other) return json({ ok: false, error: "one_site" }, 409); // sin decir cuál: aquí el correo aún no está verificado
  }
  const recent = await db.prepare("SELECT COUNT(*) AS n FROM tokens WHERE email = ? AND created_at > ?")
    .bind(email, now() - 3600)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= LIMITS.requestsPerEmailPerHour) return json({ ok: false, error: "rate_limited" }, 429);

  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await db.batch([
    db.prepare("DELETE FROM tokens WHERE expires_at < ?").bind(now()),
    db.prepare("INSERT INTO tokens (hash, name, email, lang, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(await sha256(token), name, email, lang, now(), now() + LIMITS.tokenHours * 3600),
  ]);
  const origin = env.ALLOW_LOG_ONLY === "1" ? new URL(req.url).origin : PUBLIC_ORIGIN;
  const link = `${origin}${lang === "es" ? "/publicar/subir/" : "/en/publish/upload/"}#t=${token}`;
  const sent = await sendMagicLink(env, email, name, link, lang);
  return sent ? json({ ok: true }) : json({ ok: false, error: "server" }, 502);
}

// ---------------------------------------------------------------- 2. sesión

/** Abrir el enlace mágico cuenta como confirmación anual y saca al sitio de la suspensión por inactividad. */
const markConfirmed = (env: Env, name: string, email: string) =>
  env.PUBLISH_DB.batch([
    env.PUBLISH_DB.prepare(
      `UPDATE sites SET confirmed_at = ?, notice_at = NULL, reminders = 0, inactive_at = NULL, status = 'active'
       WHERE name = ? AND email = ? AND status IN ('active', 'inactive')`,
    ).bind(now(), name, email),
    env.PUBLISH_DB.prepare("DELETE FROM confirms WHERE name = ?").bind(name),
  ]);

async function info(s: Session, env: Env): Promise<Response> {
  if (s.status === "inactive") console.log("[publish] reactivado al abrir el enlace", s.name);
  if (s.status !== null) await markConfirmed(env, s.name, s.email);
  const site = await env.PUBLISH_DB.prepare("SELECT version, source, files, bytes, updated_at FROM sites WHERE name = ?")
    .bind(s.name)
    .first<{ version: string | null; source: string | null; files: number; bytes: number; updated_at: number }>();
  return json({
    ok: true,
    name: s.name,
    url: `https://${s.name}.alumhost.dev`,
    exists: Boolean(site?.version),
    source: site?.source ?? null,
    files: site?.files ?? 0,
    bytes: site?.bytes ?? 0,
    updatedAt: site?.updated_at ?? null,
    limits: LIMITS,
  });
}

// ---------------------------------------------------------------- 3-5. despliegue

async function loadDeploy(env: Env, s: Session, id: string | null) {
  if (!id || !/^[A-Za-z0-9_-]{8,40}$/.test(id)) return null;
  const row = await env.PUBLISH_DB.prepare("SELECT id, name, email, version, source, manifest FROM deploys WHERE id = ?")
    .bind(id)
    .first<{ id: string; name: string; email: string; version: string; source: string; manifest: string }>();
  if (!row || row.name !== s.name || row.email !== s.email) return null;
  return { ...row, manifest: JSON.parse(row.manifest) as Manifest };
}

async function start(req: Request, s: Session, env: Env): Promise<Response> {
  const raw = await readJson(req, 400_000);
  if (raw === "too_big") return json({ ok: false, error: "size" }, 413);
  if (raw === "bad") return json({ ok: false, error: "validation" }, 400);
  const list = Array.isArray(raw.files) ? raw.files : [];
  if (list.length === 0 || list.length > LIMITS.maxFiles) return json({ ok: false, error: "too_many_files" }, 400);
  const files: Record<string, number> = {};
  let total = 0;
  for (const f of list as { p?: unknown; s?: unknown }[]) {
    const p = cleanPath(String(f?.p ?? ""));
    const size = Number(f?.s);
    if (!p || !Number.isInteger(size) || size < 0) return json({ ok: false, error: "bad_path", path: String(f?.p ?? "") }, 400);
    if (size > LIMITS.maxFileBytes) return json({ ok: false, error: "file_too_big", path: p }, 400);
    files[p] = size;
    total += size;
  }
  if (total > LIMITS.maxSiteBytes) return json({ ok: false, error: "site_too_big" }, 400);
  if (!("index.html" in files)) return json({ ok: false, error: "no_index" }, 400);

  // Dos personas pueden pedir enlace para el mismo nombre libre: gana quien publica primero.
  const owner = await env.PUBLISH_DB.prepare("SELECT name FROM sites WHERE name = ? AND email != ? UNION SELECT name FROM sites WHERE email = ? AND name != ?")
    .bind(s.name, s.email, s.email, s.name)
    .first<{ name: string }>();
  if (owner) return json({ ok: false, error: owner.name === s.name ? "name_taken" : "one_site" }, 409);
  // Un correo sin web no puede ir abriendo despliegues con nombres distintos (llenaría D1 con subidas abandonadas).
  const elsewhere = await env.PUBLISH_DB.prepare("SELECT name FROM deploys WHERE email = ? AND name != ? AND created_at > ? LIMIT 1")
    .bind(s.email, s.name, now() - 86_400)
    .first<{ name: string }>();
  if (elsewhere) return json({ ok: false, error: "one_site" }, 409);

  let source = raw.source === "folder" ? "folder" : "zip";
  const manifest: Manifest = { files };
  const gh = raw.github as { repo?: unknown; sha?: unknown; dir?: unknown } | undefined;
  if (raw.source === "github") {
    const repo = String(gh?.repo ?? "");
    const sha = String(gh?.sha ?? "");
    const dir = gh?.dir ? cleanPath(String(gh.dir)) : "";
    if (!repoOk(repo) || !SHA.test(sha) || dir === null) return json({ ok: false, error: "github" }, 400);
    manifest.github = { repo, sha, dir };
    source = `github:${repo}@${sha.slice(0, 12)}${dir ? `:${dir}` : ""}`;
  }

  const id = newId();
  const version = `${Date.now().toString(36)}-${newId().slice(0, 6)}`;
  const db = env.PUBLISH_DB;
  const stale = now() - 86_400;
  await db.batch([
    // Despliegues abandonados (los míos en este sitio y los de cualquiera con más de 24 h): se borran sus trozos
    // y luego el despliegue. Nunca se toca la versión activa de un sitio ni el despliegue en curso de otra persona.
    db.prepare(
      `DELETE FROM blobs WHERE (site, version) IN (SELECT name, version FROM deploys WHERE (name = ? AND email = ?) OR created_at < ?)
       AND version != COALESCE((SELECT version FROM sites WHERE sites.name = blobs.site), '')`,
    ).bind(s.name, s.email, stale),
    db.prepare("DELETE FROM deploys WHERE (name = ? AND email = ?) OR created_at < ?").bind(s.name, s.email, stale),
    db.prepare("INSERT INTO deploys (id, name, email, version, source, manifest, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, s.name, s.email, version, source, JSON.stringify(manifest), now()),
  ]);
  return json({ ok: true, d: id });
}

async function putFile(req: Request, s: Session, env: Env, url: URL): Promise<Response> {
  const dep = await loadDeploy(env, s, url.searchParams.get("d"));
  if (!dep) return json({ ok: false, error: "deploy" }, 404);
  const p = cleanPath(url.searchParams.get("p") ?? "");
  const size = p ? dep.manifest.files[p] : undefined;
  const c = Number(url.searchParams.get("c") ?? "0");
  if (!p || size === undefined) return json({ ok: false, error: "bad_path" }, 400);
  if (!Number.isInteger(c) || c < 0 || c >= chunksOf(size)) return json({ ok: false, error: "bad_chunk" }, 400);
  const expected = Math.min(LIMITS.chunkBytes, size - c * LIMITS.chunkBytes);
  if (Number(req.headers.get("content-length") ?? -1) !== expected) return json({ ok: false, error: "size_mismatch" }, 400);
  const data = await readLimited(req, expected);
  if (!data || data.byteLength !== expected) return json({ ok: false, error: "size_mismatch" }, 400);
  await saveChunk(env, s.name, dep.version, p, c, data);
  return json({ ok: true });
}

// INSERT OR IGNORE: repetir el mismo trozo (reintentos, o alguien en bucle) no vuelve a escribir en D1.
// Cada despliegue es una versión nueva, así que un trozo ya guardado nunca necesita cambiar.
const saveChunk = (env: Env, site: string, version: string, path: string, chunk: number, data: ArrayBuffer | Uint8Array) =>
  env.PUBLISH_DB.prepare("INSERT OR IGNORE INTO blobs (site, version, path, chunk, data) VALUES (?, ?, ?, ?, ?)")
    .bind(site, version, path, chunk, data)
    .run();

async function fetchFile(req: Request, s: Session, env: Env): Promise<Response> {
  const body = await readJson(req, 4096);
  if (typeof body === "string") return json({ ok: false, error: "validation" }, 400);
  const raw = body as { d?: string; p?: string };
  const dep = await loadDeploy(env, s, typeof raw.d === "string" ? raw.d : null);
  const gh = dep?.manifest.github;
  if (!dep || !gh) return json({ ok: false, error: "deploy" }, 404);
  const p = cleanPath(typeof raw.p === "string" ? raw.p : "");
  const expected = p ? dep.manifest.files[p] : undefined;
  if (!p || expected === undefined) return json({ ok: false, error: "bad_path" }, 400);
  // Ya traído entero (reintento): no se vuelve a pedir a GitHub ni a escribir.
  const have = await env.PUBLISH_DB.prepare("SELECT COUNT(*) AS n, SUM(length(data)) AS bytes FROM blobs WHERE site = ? AND version = ? AND path = ?")
    .bind(s.name, dep.version, p)
    .first<{ n: number; bytes: number | null }>();
  if (have && have.n === chunksOf(expected) && (have.bytes ?? 0) === expected) return json({ ok: true });
  const full = (gh.dir ? `${gh.dir}/${p}` : p).split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`https://raw.githubusercontent.com/${gh.repo}/${gh.sha}/${full}`, { redirect: "follow" });
  if (!res.ok) return json({ ok: false, error: "github_fetch", status: res.status }, 502);
  // Se lee como mucho el tamaño esperado: GitHub no puede hacernos leer más aunque no mande content-length.
  const file = await readLimited(res, expected);
  if (!file || file.byteLength !== expected) return json({ ok: false, error: "size_mismatch" }, 400);
  for (let c = 0; c < chunksOf(expected); c++) {
    await saveChunk(env, s.name, dep.version, p, c, file.slice(c * LIMITS.chunkBytes, (c + 1) * LIMITS.chunkBytes));
  }
  return json({ ok: true });
}

async function finish(req: Request, s: Session, env: Env, ctx: ExecutionContext): Promise<Response> {
  const body = await readJson(req, 4096);
  if (typeof body === "string") return json({ ok: false, error: "validation" }, 400);
  const raw = body as { d?: string };
  const dep = await loadDeploy(env, s, typeof raw.d === "string" ? raw.d : null);
  if (!dep) return json({ ok: false, error: "deploy" }, 404);
  const { results } = await env.PUBLISH_DB.prepare(
    "SELECT path, COUNT(*) AS n, SUM(length(data)) AS bytes FROM blobs WHERE site = ? AND version = ? GROUP BY path",
  ).bind(s.name, dep.version).all<{ path: string; n: number; bytes: number }>();
  const found = new Map(results.map((r) => [r.path, r]));
  const missing = Object.entries(dep.manifest.files)
    .filter(([p, size]) => found.get(p)?.bytes !== size || found.get(p)?.n !== chunksOf(size))
    .map(([p]) => p);
  if (missing.length) return json({ ok: false, error: "missing", missing: missing.slice(0, 20) }, 400);

  const files = Object.keys(dep.manifest.files).length;
  const bytes = Object.values(dep.manifest.files).reduce((a, b) => a + b, 0);
  const db = env.PUBLISH_DB;
  const first = s.status === null; // aún no había sitio: es su primera publicación
  // Atómico: el upsert solo toca el sitio si es de este correo y está activo. Si otra persona ha publicado el nombre
  // entre medias (dos enlaces para un nombre libre), no cambia nada y respondemos 409.
  const [up] = await db.batch([
    db.prepare(
      `INSERT INTO sites (name, email, version, source, files, bytes, lang, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET version = excluded.version, source = excluded.source, files = excluded.files,
       bytes = excluded.bytes, lang = excluded.lang, updated_at = excluded.updated_at, notice_at = NULL, reminders = 0
       WHERE sites.email = excluded.email AND sites.status = 'active'`,
    ).bind(s.name, s.email, dep.version, dep.source, files, bytes, s.lang, now(), now()),
    db.prepare("DELETE FROM deploys WHERE id = ?").bind(dep.id),
  ]);
  if ((up.meta.changes ?? 0) !== 1) {
    ctx.waitUntil(db.prepare("DELETE FROM blobs WHERE site = ? AND version = ?").bind(s.name, dep.version).run().catch(() => {}));
    return json({ ok: false, error: "name_taken" }, 409);
  }
  // Las versiones anteriores se borran después de responder (el sitio ya sirve la nueva). Solo las que no son la
  // activa ni pertenecen a un despliegue todavía en curso (por ejemplo, otro despliegue lanzado justo después).
  ctx.waitUntil(
    db.prepare(
      `DELETE FROM blobs WHERE site = ? AND version NOT IN (SELECT version FROM sites WHERE name = ? AND version IS NOT NULL)
       AND version NOT IN (SELECT version FROM deploys WHERE name = ?)`,
    ).bind(s.name, s.name, s.name).run()
      .catch((e) => console.error("[publish] limpieza", e)),
  );
  console.log("[publish] publicado", s.name, dep.version, files, bytes, dep.source);
  if (first) ctx.waitUntil(sendMail(env, s.email, T.published(s.lang, s.name, requestPage(s.lang)), "publish-live"));
  return json({ ok: true, url: `https://${s.name}.alumhost.dev` });
}

async function remove(s: Session, env: Env): Promise<Response> {
  const db = env.PUBLISH_DB;
  await db.batch([
    db.prepare("DELETE FROM sites WHERE name = ? AND email = ? AND status = 'active'").bind(s.name, s.email),
    // Los archivos solo se borran si ya no queda ningún sitio con ese nombre (si otra persona lo publicó, no se tocan).
    db.prepare("DELETE FROM blobs WHERE site = ? AND NOT EXISTS (SELECT 1 FROM sites WHERE name = ?)").bind(s.name, s.name),
    db.prepare("DELETE FROM deploys WHERE name = ? AND email = ?").bind(s.name, s.email),
    db.prepare("DELETE FROM tokens WHERE name = ? AND email = ?").bind(s.name, s.email),
    db.prepare("DELETE FROM confirms WHERE name = ? AND email = ?").bind(s.name, s.email),
  ]);
  console.log("[publish] borrado", s.name);
  return json({ ok: true });
}

// ---------------------------------------------------------------- confirmación anual

/** El enlace de los avisos anuales: solo confirma (no da acceso al sitio). Se pulsa en la página, nunca con un GET. */
async function confirm(req: Request, env: Env): Promise<Response> {
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: `confirm:${req.headers.get("cf-connecting-ip") ?? "unknown"}` });
    if (!success) return json({ ok: false, error: "rate_limited" }, 429);
  }
  const raw = await readJson(req, 1024);
  if (typeof raw === "string") return json({ ok: false, error: "validation" }, 400);
  const c = typeof raw.c === "string" ? raw.c : "";
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(c)) return json({ ok: false, error: "session" }, 401);
  const row = await env.PUBLISH_DB.prepare("SELECT name, email, expires_at FROM confirms WHERE hash = ?")
    .bind(await sha256(c))
    .first<{ name: string; email: string; expires_at: number }>();
  if (!row || row.expires_at < now()) return json({ ok: false, error: "session" }, 401);
  const [up] = await markConfirmed(env, row.name, row.email);
  if ((up.meta.changes ?? 0) !== 1) return json({ ok: false, error: "session" }, 401);
  console.log("[publish] confirmado", row.name);
  return json({ ok: true, name: row.name, url: `https://${row.name}.alumhost.dev` });
}

// ---------------------------------------------------------------- router

export async function handlePublish(req: Request, penv: PublishEnv, ctx: ExecutionContext): Promise<Response> {
  if (!penv.PUBLISH_DB) return json({ ok: false, error: "not_configured" }, 503);
  const env = penv as Env;
  const url = new URL(req.url);
  const origin = req.headers.get("origin");
  if (origin && origin !== url.origin) return json({ ok: false, error: "origin" }, 403);
  const route = `${req.method} ${url.pathname.replace(/\/+$/, "")}`;

  try {
    if (route === "POST /api/publish/request") return await request(req, env);
    if (route === "POST /api/publish/confirm") return await confirm(req, env);
    const s = await session(req, env);
    if (!s) return json({ ok: false, error: "session" }, 401);
    // Un sitio suspendido (abuso) no puede desplegar ni borrarse: se conservan las pruebas. Ver su estado sí.
    // Uno inactivo se reactiva al ver su estado (POST /session, lo primero que hace la página del enlace).
    if (s.status !== null && s.status !== "active" && route !== "POST /api/publish/session") {
      return json({ ok: false, error: "suspended" }, 403);
    }
    // Límite por sitio en las rutas autenticadas: un token válido en bucle no puede agotar la cuota de D1.
    if (env.PUBLISH_LIMITER) {
      const { success } = await env.PUBLISH_LIMITER.limit({ key: `site:${s.name}` });
      if (!success) return json({ ok: false, error: "rate_limited" }, 429);
    }
    switch (route) {
      case "POST /api/publish/session": return await info(s, env);
      case "POST /api/publish/deploy/start": return await start(req, s, env);
      case "PUT /api/publish/deploy/file": return await putFile(req, s, env, url);
      case "POST /api/publish/deploy/fetch": return await fetchFile(req, s, env);
      case "POST /api/publish/deploy/finish": return await finish(req, s, env, ctx);
      case "POST /api/publish/delete": return await remove(s, env);
    }
    return json({ ok: false, error: "not_found" }, 404);
  } catch (err) {
    console.error("[publish] error", route, err);
    return json({ ok: false, error: "server" }, 500);
  }
}
