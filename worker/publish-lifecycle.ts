/**
 * Correos programados de Publish. Lo lanza el Cron Trigger del Worker una vez al día (wrangler.jsonc → triggers).
 *
 * Confirmación anual (Términos de Publish): si un sitio lleva un año sin confirmar ni actualizarse, se le escribe.
 *   día 0   aviso con enlace de confirmación      día 15 y 25   recordatorios
 *   día 30  sin noticias: se suspende ('inactive', deja de servirse) y se avisa
 *   +53     último aviso                           +60           se borra con sus archivos y se avisa
 * Confirmar (enlace del correo), abrir un enlace mágico o publicar lo saca del ciclo en cualquier momento.
 *
 * Graduación: en mayo, un correo al año a cada sitio para pedir otro correo antes de que caduque el de la universidad.
 *
 * Brevo gratis permite 300 correos al día para todo AlumHost: cada paso envía como mucho MAX_PER_STEP por pasada,
 * y lo que no quepa sale al día siguiente. Si un envío falla, no se avanza ese sitio: se reintenta mañana.
 */
import { sendMail, type MailEnv } from "./mail";
import * as T from "./mail-templates";
import { PUBLIC_ORIGIN, b64url, now, requestPage, sha256 } from "./publish";

export const LIFECYCLE = {
  yearDays: 365,
  confirmDays: 30, // plazo para confirmar desde el aviso
  remindAtDays: [15, 25], // recordatorios desde el aviso
  deleteDays: 60, // de suspendido a borrado
  lastWarningDays: 7, // último aviso antes de borrar
  graduationMonth: 5, // mayo (1-12)
} as const;
const MAX_PER_STEP = 40;
const DAY = 86_400;

type Env = MailEnv & { PUBLISH_DB: D1Database };
interface Row { name: string; email: string; lang: string; notice_at: number | null; inactive_at: number | null; reminders: number }
const lang = (r: Row) => (r.lang === "en" ? "en" : "es");

/** Crea un enlace de confirmación que vale hasta que el sitio se borraría (después ya no tiene sentido). */
async function confirmLink(env: Env, r: Row, validUntil: number): Promise<string> {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  await env.PUBLISH_DB.prepare("INSERT INTO confirms (hash, name, email, expires_at) VALUES (?, ?, ?, ?)")
    .bind(await sha256(token), r.name, r.email, validUntil)
    .run();
  return `${PUBLIC_ORIGIN}${lang(r) === "es" ? "/publicar/subir/" : "/en/publish/upload/"}#c=${token}`;
}

const select = (env: Env, where: string, ...args: unknown[]) =>
  env.PUBLISH_DB.prepare(`SELECT name, email, lang, notice_at, inactive_at, reminders FROM sites WHERE ${where} LIMIT ${MAX_PER_STEP}`)
    .bind(...args)
    .all<Row>()
    .then((r) => r.results);

export async function runPublishLifecycle(env: Env, at = new Date()): Promise<Record<string, number>> {
  const db = env.PUBLISH_DB;
  const t = Math.floor(at.getTime() / 1000);
  const L = LIFECYCLE;
  const sent: Record<string, number> = {};
  const count = (k: string) => (sent[k] = (sent[k] ?? 0) + 1);
  // Como mucho un correo por sitio y pasada (si el cron no corrió unos días, los pasos atrasados salen en días seguidos).
  const touched = new Set<string>();
  const fresh = (rows: Row[]) => rows.filter((r) => !touched.has(r.name) && touched.add(r.name));
  // Hasta que se borraría si nunca contesta: aviso + plazo + días suspendido.
  const linkUntil = (from: number) => from + (L.confirmDays + L.deleteDays) * DAY;

  db.prepare("DELETE FROM confirms WHERE expires_at < ?").bind(t).run().catch(() => {});

  // 1. Aviso anual: activos, sin aviso en curso y con más de un año sin confirmar ni actualizar.
  for (const r of fresh(await select(env,
    "status = 'active' AND notice_at IS NULL AND max(COALESCE(confirmed_at, created_at), updated_at) < ?", t - L.yearDays * DAY))) {
    const link = await confirmLink(env, r, linkUntil(t));
    if (!(await sendMail(env, r.email, T.annualNotice(lang(r), r.name, link, L.confirmDays), "publish-annual"))) continue;
    await db.prepare("UPDATE sites SET notice_at = ?, reminders = 0 WHERE name = ? AND notice_at IS NULL").bind(t, r.name).run();
    count("annual");
  }

  // 2. Recordatorios (reminders = cuántos se han enviado ya).
  for (const [i, day] of L.remindAtDays.entries()) {
    for (const r of fresh(await select(env, "status = 'active' AND notice_at <= ? AND reminders = ?", t - day * DAY, i))) {
      const link = await confirmLink(env, r, linkUntil(r.notice_at!));
      const left = L.confirmDays - Math.floor((t - r.notice_at!) / DAY);
      if (!(await sendMail(env, r.email, T.annualReminder(lang(r), r.name, link, Math.max(1, left)), "publish-reminder"))) continue;
      await db.prepare("UPDATE sites SET reminders = ? WHERE name = ? AND reminders = ?").bind(i + 1, r.name, i).run();
      count("reminder");
    }
  }

  // 3. Plazo cumplido sin noticias: se suspende. Primero el cambio y luego el correo (el sitio deja de servirse igual).
  for (const r of fresh(await select(env, "status = 'active' AND notice_at <= ?", t - L.confirmDays * DAY))) {
    const up = await db.prepare("UPDATE sites SET status = 'inactive', inactive_at = ?, reminders = 0 WHERE name = ? AND status = 'active' AND notice_at IS NOT NULL")
      .bind(t, r.name).run();
    if ((up.meta.changes ?? 0) !== 1) continue;
    console.log("[lifecycle] suspendido por inactividad", r.name);
    const link = await confirmLink(env, r, t + L.deleteDays * DAY);
    if (await sendMail(env, r.email, T.inactive(lang(r), r.name, link, L.deleteDays), "publish-inactive")) count("inactive");
  }

  // 4. Último aviso antes de borrar.
  for (const r of fresh(await select(env, "status = 'inactive' AND reminders = 0 AND inactive_at <= ?", t - (L.deleteDays - L.lastWarningDays) * DAY))) {
    const link = await confirmLink(env, r, r.inactive_at! + L.deleteDays * DAY);
    if (!(await sendMail(env, r.email, T.deleteSoon(lang(r), r.name, link, L.lastWarningDays), "publish-delete-soon"))) continue;
    await db.prepare("UPDATE sites SET reminders = 1 WHERE name = ? AND status = 'inactive'").bind(r.name).run();
    count("deleteSoon");
  }

  // 5. Borrado. Se exige el último aviso enviado (reminders = 1): si Brevo falló, se espera a que salga.
  for (const r of fresh(await select(env, "status = 'inactive' AND reminders = 1 AND inactive_at <= ?", t - L.deleteDays * DAY))) {
    const [del] = await db.batch([
      db.prepare("DELETE FROM sites WHERE name = ? AND email = ? AND status = 'inactive'").bind(r.name, r.email),
      db.prepare("DELETE FROM blobs WHERE site = ? AND NOT EXISTS (SELECT 1 FROM sites WHERE name = ?)").bind(r.name, r.name),
      db.prepare("DELETE FROM deploys WHERE name = ?").bind(r.name),
      db.prepare("DELETE FROM tokens WHERE name = ?").bind(r.name),
      db.prepare("DELETE FROM confirms WHERE name = ?").bind(r.name),
    ]);
    if ((del.meta.changes ?? 0) !== 1) continue;
    console.log("[lifecycle] borrado por inactividad", r.name);
    if (await sendMail(env, r.email, T.deleted(lang(r), r.name, requestPage(lang(r))), "publish-deleted")) count("deleted");
  }

  // 6. Graduación: en mayo, una vez al año por correo. mail_log evita repetirlo.
  if (at.getUTCMonth() + 1 === L.graduationMonth) {
    const year = String(at.getUTCFullYear());
    for (const r of fresh(await select(env,
      "status = 'active' AND NOT EXISTS (SELECT 1 FROM mail_log m WHERE m.email = sites.email AND m.kind = 'graduation' AND m.ref = ?)", year))) {
      if (!(await sendMail(env, r.email, T.graduation(lang(r), r.name), "publish-graduation"))) continue;
      await db.prepare("INSERT OR IGNORE INTO mail_log (email, kind, ref, sent_at) VALUES (?, 'graduation', ?, ?)").bind(r.email, year, t).run();
      count("graduation");
    }
  }

  // Limpieza: los acuses del formulario solo se recuerdan un día.
  await db.prepare("DELETE FROM mail_log WHERE kind = 'contact-ack' AND sent_at < ?").bind(t - 2 * DAY).run();
  console.log("[lifecycle] correos", JSON.stringify(sent));
  return sent;
}
