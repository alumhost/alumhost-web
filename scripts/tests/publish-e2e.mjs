import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

// ---------- D1 sobre SQLite real (misma sintaxis SQL que D1)
const sql = new DatabaseSync(":memory:");
for (const f of ["migrations/0001_publish.sql", "migrations/0002_publish_hardening.sql", "migrations/0003_correos.sql"]) sql.exec(readFileSync(f, "utf8"));
const norm = (v) => (v instanceof ArrayBuffer ? new Uint8Array(v) : v);
class Stmt {
  constructor(q, a = []) { this.q = q; this.a = a; }
  bind(...a) { return new Stmt(this.q, a.map(norm)); }
  async first() { return sql.prepare(this.q).get(...this.a) ?? null; }
  async all() { return { results: sql.prepare(this.q).all(...this.a) }; }
  async run() { const r = sql.prepare(this.q).run(...this.a); return { meta: { changes: Number(r.changes) } }; }
}
const D1 = {
  prepare: (q) => new Stmt(q),
  async batch(list) {
    sql.exec("BEGIN");
    try { const out = []; for (const s of list) out.push(await s.run()); sql.exec("COMMIT"); return out; }
    catch (e) { sql.exec("ROLLBACK"); throw e; }
  },
};

// ---------- fetch externo simulado: Turnstile, Brevo, GitHub raw
const mails = [];
const gh = { ["o/r/" + "a".repeat(40) + "/index.html"]: "<h1>gh</h1>" };
globalThis.fetch = async (url, init = {}) => {
  url = String(url);
  if (url.includes("turnstile")) return new Response(JSON.stringify({ success: true }));
  if (url.includes("api.brevo.com")) { mails.push(JSON.parse(init.body)); return new Response("{}", { status: 201 }); }
  if (url.startsWith("https://raw.githubusercontent.com/")) {
    const k = url.slice("https://raw.githubusercontent.com/".length);
    return k in gh ? new Response(gh[k]) : new Response("no", { status: 404 });
  }
  throw new Error("fetch no esperado " + url);
};
// caché del edge simulada para el Worker de sitios
const store = new Map();
globalThis.caches = { default: { match: async (k) => store.get(k.url)?.clone() ?? undefined, put: async (k, r) => { store.set(k.url, r); } } };

const { handlePublish } = await import("./worker/publish.ts");
const sites = (await import("./sites/index.ts")).default;
const worker = (await import("./worker/index.ts")).default;
const { contentType, validName } = await import("./worker/publish-rules.ts");

const pending = [];
const ctx = { waitUntil: (p) => pending.push(p), passThroughOnException() {} };
const flush = async () => { while (pending.length) await pending.shift(); };
const env = { PUBLISH_DB: D1, PUBLISH_EMAIL_DOMAINS: "us.es,alum.us.es", TURNSTILE_SECRET: "x", BREVO_API_KEY: "k" };
const O = "https://alumhost.dev";
const call = async (method, path, { token, body, headers = {} } = {}) => {
  const h = { origin: O, ...headers };
  if (token) h.authorization = `Bearer ${token}`;
  if (typeof body === "string") h["content-type"] = "application/json";
  const r = await handlePublish(new Request(O + path, { method, headers: h, body, duplex: "half" }), env, ctx);
  await flush();
  return { status: r.status, j: await r.json() };
};
const askLink = async (name, email) => {
  const n = mails.length;
  const r = await call("POST", "/api/publish/request", { body: JSON.stringify({ name, email, accept: true, token: "t", lang: "es" }) });
  if (mails.length === n) return { r };
  const link = mails.at(-1).textContent.match(/https:\/\/\S+/)[0];
  return { r, link, token: link.split("#t=")[1] };
};
const deploy = async (token, files) => {
  const st = await call("POST", "/api/publish/deploy/start", { token, body: JSON.stringify({ source: "zip", files: Object.entries(files).map(([p, c]) => ({ p, s: c.length })) }) });
  if (st.status !== 200) return st;
  for (const [p, c] of Object.entries(files)) {
    const r = await call("PUT", `/api/publish/deploy/file?d=${st.j.d}&p=${encodeURIComponent(p)}&c=0`, { token, body: c, headers: { "content-length": String(Buffer.byteLength(c)) } });
    if (r.status !== 200) return r;
  }
  return call("POST", "/api/publish/deploy/finish", { token, body: JSON.stringify({ d: st.j.d }) });
};
const visit = async (name, path = "/", headers = {}) => {
  const r = await sites.fetch(new Request(`https://${name}.alumhost.dev${path}`, { headers }), {}, ctx); await flush();
  store.clear(); // sin caché entre pruebas
  return { status: r.status, text: await r.text(), type: r.headers.get("content-type") };
};
sites.fetch = ((f) => (req, _e, c) => f(req, { PUBLISH_DB: D1 }, c))(sites.fetch);
const blobCount = (site) => sql.prepare("SELECT COUNT(*) n FROM blobs WHERE site = ?").get(site).n;

let fails = 0;
const ok = (name, cond, info = "") => { console.log(cond ? "OK   " : "FALLA", name, info); if (!cond) fails++; };

// 1. Enlace mágico con origen fijo
const A = await askLink("foo", "alice@us.es");
ok("enlace mágico apunta a https://alumhost.dev aunque la petición llegue por otro host", A.link.startsWith("https://alumhost.dev/publicar/subir/#t="), A.link.slice(0, 40));
const B = await askLink("foo", "bob@us.es");
ok("Bob también obtiene enlace para 'foo' (libre)", !!B.token);
// Alice publica
const pA = await deploy(A.token, { "index.html": "<h1>Alice</h1>" });
ok("Alice publica foo", pA.status === 200, JSON.stringify(pA.j));
ok("el sitio sirve lo de Alice", (await visit("foo")).text.includes("Alice"));
// 2. BUG ALTO: el token de Bob ya no vale
ok("Bob ya no puede ver el sitio de Alice (/session 401)", (await call("POST", "/api/publish/session", { token: B.token, body: "{}" })).status === 401);
ok("Bob ya no puede borrar el sitio de Alice (401)", (await call("POST", "/api/publish/delete", { token: B.token, body: "{}" })).status === 401);
ok("el sitio de Alice sigue ahí", (await visit("foo")).text.includes("Alice"));
// 3. Upsert atómico: un correo distinto no puede cambiar el sitio (guarda de la consulta)
const up = sql.prepare(`INSERT INTO sites (name, email, version, source, files, bytes, created_at, updated_at) VALUES ('foo','bob@us.es','vX','zip',1,1,0,0)
  ON CONFLICT(name) DO UPDATE SET version = excluded.version WHERE sites.email = excluded.email AND sites.status = 'active'`).run();
ok("upsert con correo ajeno no cambia nada (changes=0)", Number(up.changes) === 0);
// 4. Redespliegue de Alice y limpieza de la versión vieja
const v1 = sql.prepare("SELECT version FROM sites WHERE name='foo'").get().version;
const A2 = await askLink("foo", "alice@us.es");
const pA2 = await deploy(A2.token, { "index.html": "<h1>Alice v2</h1>", "a.css": "body{}" });
ok("redespliegue OK", pA2.status === 200);
ok("se sirve la v2", (await visit("foo")).text.includes("v2"));
ok("la versión vieja se borró de blobs", sql.prepare("SELECT COUNT(*) n FROM blobs WHERE site='foo' AND version=?").get(v1).n === 0);
// 5. Trozo repetido: INSERT OR IGNORE
const st = await call("POST", "/api/publish/deploy/start", { token: A2.token, body: JSON.stringify({ source: "zip", files: [{ p: "index.html", s: 3 }] }) });
const put = () => call("PUT", `/api/publish/deploy/file?d=${st.j.d}&p=index.html&c=0`, { token: A2.token, body: "abc", headers: { "content-length": "3" } });
const r1 = await put(), r2 = await put();
ok("subir dos veces el mismo trozo responde 200 sin duplicar", r1.status === 200 && r2.status === 200 && sql.prepare("SELECT COUNT(*) n FROM blobs WHERE site='foo' AND version=(SELECT version FROM deploys WHERE id=?)").get(st.j.d).n === 1);
// 6. Cuerpo chunked sin content-length por encima del límite
const big = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('{"files":[' + '"x",'.repeat(200_000) + '"x"]}')); c.close(); } });
const rBig = await handlePublish(new Request(O + "/api/publish/deploy/start", { method: "POST", headers: { origin: O, authorization: `Bearer ${A2.token}` }, body: big, duplex: "half" }), env, ctx);
ok("start con cuerpo chunked de 800 KB → 413", rBig.status === 413, String(rBig.status));
// 7. Un correo sin web no puede abrir despliegues con otro nombre
const C1 = await askLink("carla1", "carla@us.es");
await call("POST", "/api/publish/deploy/start", { token: C1.token, body: JSON.stringify({ source: "zip", files: [{ p: "index.html", s: 1 }] }) });
const C2 = await askLink("carla2", "carla@us.es");
const c2 = await call("POST", "/api/publish/deploy/start", { token: C2.token, body: JSON.stringify({ source: "zip", files: [{ p: "index.html", s: 1 }] }) });
ok("segundo nombre del mismo correo en paralelo → 409 one_site", c2.status === 409 && c2.j.error === "one_site", JSON.stringify(c2.j));
// 8. Despliegue ajeno: Dani no puede usar el despliegue de Carla aunque tenga token para carla1
const D = await askLink("carla1", "dani@us.es");
const dep = sql.prepare("SELECT id FROM deploys WHERE email='carla@us.es'").get();
const dput = await call("PUT", `/api/publish/deploy/file?d=${dep.id}&p=index.html&c=0`, { token: D.token, body: "x", headers: { "content-length": "1" } });
ok("otro correo no puede subir al despliegue de Carla (404 deploy)", dput.status === 404, JSON.stringify(dput.j));
await call("POST", "/api/publish/deploy/start", { token: D.token, body: JSON.stringify({ source: "zip", files: [{ p: "index.html", s: 1 }] }) });
ok("el despliegue de Carla sigue existiendo tras un start de Dani", !!sql.prepare("SELECT id FROM deploys WHERE id=?").get(dep.id));
// 9. Suspensión
sql.prepare("UPDATE sites SET status='suspended' WHERE name='foo'").run();
const A3 = { token: A2.token };
ok("sitio suspendido: /session sigue funcionando", (await call("POST", "/api/publish/session", { token: A3.token, body: "{}" })).status === 200);
ok("sitio suspendido: start → 403", (await call("POST", "/api/publish/deploy/start", { token: A3.token, body: JSON.stringify({ source: "zip", files: [{ p: "index.html", s: 1 }] }) })).status === 403);
ok("sitio suspendido: borrar → 403 (se conservan pruebas)", (await call("POST", "/api/publish/delete", { token: A3.token, body: "{}" })).status === 403 && blobCount("foo") > 0);
ok("sitio suspendido no se sirve", (await visit("foo")).status === 404);
sql.prepare("UPDATE sites SET status='active' WHERE name='foo'").run();
// 10. Borrado normal
ok("Alice borra su sitio", (await call("POST", "/api/publish/delete", { token: A2.token, body: "{}" })).status === 200 && blobCount("foo") === 0 && !sql.prepare("SELECT 1 FROM sites WHERE name='foo'").get());
// 11. GitHub con límite de lectura
const G = await askLink("ghsite", "gus@us.es");
const sha = "a".repeat(40);
const gst = await call("POST", "/api/publish/deploy/start", { token: G.token, body: JSON.stringify({ source: "github", github: { repo: "o/r", sha, dir: "" }, files: [{ p: "index.html", s: 11 }] }) });
const f1 = await call("POST", "/api/publish/deploy/fetch", { token: G.token, body: JSON.stringify({ d: gst.j.d, p: "index.html" }) });
const f2 = await call("POST", "/api/publish/deploy/fetch", { token: G.token, body: JSON.stringify({ d: gst.j.d, p: "index.html" }) });
const gfin = await call("POST", "/api/publish/deploy/finish", { token: G.token, body: JSON.stringify({ d: gst.j.d }) });
ok("GitHub: fetch, reintento sin volver a escribir y finish", f1.status === 200 && f2.status === 200 && gfin.status === 200, JSON.stringify([f1.j, f2.j, gfin.j]));
const gdot = await call("POST", "/api/publish/deploy/start", { token: G.token, body: JSON.stringify({ source: "github", github: { repo: "o/..", sha, dir: "" }, files: [{ p: "index.html", s: 1 }] }) });
ok("repo 'o/..' rechazado", gdot.status === 400);
gh["o/r/" + sha + "/big.html"] = "x".repeat(50);
const gst2 = await call("POST", "/api/publish/deploy/start", { token: G.token, body: JSON.stringify({ source: "github", github: { repo: "o/r", sha, dir: "" }, files: [{ p: "index.html", s: 11 }, { p: "big.html", s: 10 }] }) });
const fbig = await call("POST", "/api/publish/deploy/fetch", { token: G.token, body: JSON.stringify({ d: gst2.j.d, p: "big.html" }) });
ok("GitHub devuelve más bytes de los declarados → size_mismatch sin leerlo entero", fbig.status === 400 && fbig.j.error === "size_mismatch");
// 12. Alias +
ok("correo con alias + rechazado", (await askLink("zzz", "eve+1@us.es")).r.status === 400);
// 13. Sitios: service worker y tipos
const G2 = await askLink("ghsite", "gus@us.es");
await deploy(G2.token, { "index.html": "<p>hola</p>", "sw.js": "self.x=1", "html": "<script>alert(1)</script>" });
ok("registro de service worker bloqueado (403)", (await visit("ghsite", "/sw.js", { "service-worker": "script" })).status === 403);
ok("sw.js se puede leer como archivo normal", (await visit("ghsite", "/sw.js")).status === 200);
const noext = await visit("ghsite", "/html");
ok("archivo 'html' sin extensión no se sirve como HTML", !String(noext.type).includes("text/html"), String(noext.type));
ok("contentType('dir/html') = octet-stream", contentType("dir/html") === "application/octet-stream");
ok("nombres reservados nuevos", !validName("autoconfig") && !validName("openpgpkey") && !validName("mta-sts") && validName("mi-web"));

// 14. Formulario de contacto: cabeceras RFC 2047, cuerpo base64 y regex de correo
const sent = [];
const cenv = { TURNSTILE_SECRET: "x", CONTACT_FROM: "web@alumhost.dev", CONTACT_TO: "a@b.es", CONTACT_MAILER: { send: async (m) => sent.push(m) } };
const contact = (body) => worker.fetch(new Request(O + "/api/contact", { method: "POST", headers: { origin: O, "content-type": "application/json" }, body: JSON.stringify(body) }), cenv, ctx);
const msg = "Hola, me llamo José y quiero una VPS. ".repeat(60);
const rc = await contact({ name: "José Peña", email: "jose@us.es", reason: "beta", plan: "", message: msg, token: "t", lang: "es" });
const raw = sent[0]?.raw ?? "";
const subj = raw.match(/^Subject: (.*)$/m)?.[1] ?? "";
const bodyB64 = raw.split("\r\n\r\n").slice(1).join("").replace(/\r\n/g, "");
ok("contacto: 200 y Subject codificado RFC 2047", rc.status === 200 && subj.startsWith("=?UTF-8?B?") && Buffer.from(subj.slice(10, -2), "base64").toString().includes("José Peña"), subj);
ok("contacto: ninguna línea pasa de 998 y el cuerpo decodifica bien", raw.split("\r\n").every((l) => l.length <= 998) && Buffer.from(bodyB64, "base64").toString().includes("José y quiero"));
const rc2 = await contact({ name: "x", email: "a@b.com,c@d.com", reason: "beta", plan: "", message: "hola hola hola", token: "t", lang: "es" });
ok("contacto: correo con coma rechazado (400)", rc2.status === 400);
const huge = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode("{" + " ".repeat(20000) + "}")); c.close(); } });
const rc3 = await worker.fetch(new Request(O + "/api/contact", { method: "POST", headers: { origin: O, "content-type": "application/json" }, body: huge, duplex: "half" }), cenv, ctx);
ok("contacto: cuerpo chunked de 20 KB → 413", rc3.status === 413, String(rc3.status));


// 15. Correos automáticos
const { runPublishLifecycle } = await import("./worker/publish-lifecycle.ts");
const mailsTo = (to, tag) => mails.filter((m) => m.to[0].email === to && (!tag || m.tags?.[0] === tag));
// 15a. Acuse del formulario: al usuario, sin su texto, uno al día
const aenv = { ...cenv, PUBLISH_DB: D1, BREVO_API_KEY: "k" };
const ack = (email, name = "Spam http://malo.example") => worker.fetch(new Request(O + "/api/contact", { method: "POST", headers: { origin: O, "content-type": "application/json" }, body: JSON.stringify({ name, email, reason: "beta", plan: "", message: "compra ya en http://malo.example", token: "t", lang: "es" }) }), aenv, ctx).then(async (r) => { await flush(); return r; });
await ack("eva@gmail.com");
const ackMail = mailsTo("eva@gmail.com", "contact-beta");
ok("acuse: llega al usuario por Brevo con Reply-To soporte", ackMail.length === 1 && ackMail[0].replyTo.email === "soporte@alumhost.dev");
ok("acuse: no incluye nada de lo que escribió", ackMail.length === 1 && !JSON.stringify(ackMail[0]).includes("malo.example"));
await ack("EVA@gmail.com");
ok("acuse: como mucho uno al día por correo", mailsTo("eva@gmail.com").length === 1);
// 15b. "Tu web ya está publicada" solo la primera vez
const Gi = await askLink("gina", "gina@us.es");
await deploy(Gi.token, { "index.html": "<h1>Gina</h1>" });
ok("publicada: correo al primer despliegue", mailsTo("gina@us.es", "publish-live").length === 1);
await deploy(Gi.token, { "index.html": "<h1>Gina 2</h1>" });
ok("publicada: no se repite al actualizar", mailsTo("gina@us.es", "publish-live").length === 1);
ok("publicada: guarda el idioma del enlace", sql.prepare("SELECT lang FROM sites WHERE name='gina'").get().lang === "es");
// 15c. Ciclo anual
const DAY = 86400, T0 = Math.floor(Date.now() / 1000);
const runAt = (days) => runPublishLifecycle({ PUBLISH_DB: D1, BREVO_API_KEY: "k" }, new Date((T0 + days * DAY) * 1000));
const st8 = () => sql.prepare("SELECT status, notice_at, reminders FROM sites WHERE name='gina'").get();
await runAt(300);
ok("anual: nada antes de un año", mailsTo("gina@us.es", "publish-annual").length === 0);
await runAt(366);
const annual = mailsTo("gina@us.es", "publish-annual");
ok("anual: aviso al pasar un año sin noticias", annual.length === 1 && st8().notice_at !== null);
await runAt(367);
ok("anual: no se repite al día siguiente", mailsTo("gina@us.es", "publish-annual").length === 1 && mailsTo("gina@us.es").length === 3);
await runAt(366 + 15); await runAt(366 + 25);
ok("anual: dos recordatorios (días 15 y 25)", mailsTo("gina@us.es", "publish-reminder").length === 2);
await runAt(366 + 31);
ok("anual: suspendida a los 30 días sin confirmar", st8().status === "inactive" && mailsTo("gina@us.es", "publish-inactive").length === 1);
ok("anual: la suspendida no se sirve", (await visit("gina")).status === 404);
// confirmar con el enlace del primer aviso (vale hasta el borrado)
const cTok = annual[0].textContent.match(/#c=([A-Za-z0-9_-]+)/)[1];
ok("anual: el enlace de confirmación no abre sesión", (await call("POST", "/api/publish/session", { token: cTok, body: "{}" })).status === 401);
const cf = await call("POST", "/api/publish/confirm", { body: JSON.stringify({ c: cTok }) });
ok("anual: confirmar reactiva la web", cf.status === 200 && st8().status === "active" && st8().notice_at === null && (await visit("gina")).text.includes("Gina 2"));
ok("anual: el enlace ya usado no vale otra vez", (await call("POST", "/api/publish/confirm", { body: JSON.stringify({ c: cTok }) })).status === 401);
// sin confirmar nunca: suspensión, último aviso y borrado
sql.prepare("UPDATE sites SET confirmed_at = ?, updated_at = ? WHERE name='gina'").run(T0 - 400 * DAY, T0 - 400 * DAY);
for (const d of [0, 15, 25, 30]) await runAt(d);
ok("borrado: suspendida otra vez", st8().status === "inactive");
await runAt(30 + 53);
ok("borrado: último aviso 7 días antes", mailsTo("gina@us.es", "publish-delete-soon").length === 1);
await runAt(30 + 60);
ok("borrado: a los 60 días se borra con sus archivos", !sql.prepare("SELECT 1 FROM sites WHERE name='gina'").get() && blobCount("gina") === 0 && mailsTo("gina@us.es", "publish-deleted").length === 1);
// abrir un enlace mágico también reactiva una suspendida
const Hu = await askLink("hugo", "hugo@us.es");
await deploy(Hu.token, { "index.html": "<h1>Hugo</h1>" });
sql.prepare("UPDATE sites SET status='inactive', inactive_at=? WHERE name='hugo'").run(T0);
const H2 = await askLink("hugo", "hugo@us.es");
ok("inactiva: se puede pedir enlace", !!H2.token);
await call("POST", "/api/publish/session", { token: H2.token, body: "{}" });
ok("inactiva: abrir el enlace la reactiva", sql.prepare("SELECT status FROM sites WHERE name='hugo'").get().status === "active");
sql.prepare("UPDATE sites SET status='suspended' WHERE name='hugo'").run();
ok("abuso: una suspendida por abuso sigue sin poder pedir enlace", (await askLink("hugo", "hugo@us.es")).r.status === 403);
sql.prepare("UPDATE sites SET status='active' WHERE name='hugo'").run();
// 15d. Graduación y correo cambiado a mano
const may = new Date(Date.UTC(new Date().getUTCFullYear() + 1, 4, 10));
await runPublishLifecycle({ PUBLISH_DB: D1, BREVO_API_KEY: "k" }, may);
await runPublishLifecycle({ PUBLISH_DB: D1, BREVO_API_KEY: "k" }, new Date(may.getTime() + DAY * 1000));
ok("graduación: una vez al año en mayo", mailsTo("hugo@us.es", "publish-graduation").length === 1);
ok("fuera de la lista: un correo cualquiera no puede pedir enlace", (await askLink("nuevo", "hugo@gmail.com")).r.status === 400);
sql.prepare("UPDATE sites SET email='hugo@gmail.com' WHERE name='hugo'").run();
ok("fuera de la lista: sí puede si el equipo lo puso en su sitio", !!(await askLink("hugo", "hugo@gmail.com")).token);

console.log(fails ? `\n${fails} FALLOS` : "\nTodo OK");
process.exit(fails ? 1 : 0);
