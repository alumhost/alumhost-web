/**
 * Worker de AlumHost. Static Assets sirve la web; este código solo recibe /api/* (ver run_worker_first en wrangler.jsonc).
 *
 * Endpoints:
 *   POST /api/contact     formulario de contacto / reserva de beta
 *   /api/publish/*        Publish gratis: alta con enlace mágico y despliegue de webs estáticas (worker/publish.ts)
 *
 * Futuro (NO implementado, ver CLAUDE.md "pare y pregunte"):
 *   POST /api/checkout     crea una Stripe Checkout Session. Precio resuelto AQUÍ desde src/config/plans.ts.
 *   POST /api/stripe/hook  verifica la firma (Stripe-Signature), idempotencia por event_id, encola la creación
 *                          de la VM en Cloudflare Queues. Nunca llamar a Proxmox desde aquí directamente.
 */
import { EmailMessage } from "cloudflare:email";
import { json, verifyTurnstile } from "./turnstile";
import { handlePublish, type PublishEnv } from "./publish";
import { handleCheckout, handleStripeWebhook, type StripeEnv } from "./stripe";

export interface Env extends PublishEnv, StripeEnv {
  ASSETS: Fetcher;
  TURNSTILE_SECRET?: string; // wrangler secret put TURNSTILE_SECRET
  CONTACT_FROM: string;
  CONTACT_TO: string;
  CONTACT_MAILER?: SendEmail; // binding send_email (opcional hasta tener Email Routing)
  CONTACT_LIMITER?: RateLimit; // binding ratelimits
  ALLOW_LOG_ONLY?: string; // "1" solo en local (.dev.vars): acepta sin enviar, registra en consola
}

const REASONS = ["beta", "plans", "custom", "support", "other"] as const;
const PLANS = ["", "publish", "mini", "developer", "pro"] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ContactInput {
  name: string;
  email: string;
  reason: (typeof REASONS)[number];
  plan: (typeof PLANS)[number];
  message: string;
  lang: "es" | "en";
}

/** Misma validación que el cliente (ContactForm.astro), pero aquí es la que cuenta. */
function parseContact(raw: unknown): ContactInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(r.name);
  const email = str(r.email);
  const message = str(r.message);
  const reason = str(r.reason) as ContactInput["reason"];
  const plan = str(r.plan) as ContactInput["plan"];
  const lang = r.lang === "en" ? "en" : "es";
  if (name.length < 1 || name.length > 100) return null;
  if (!EMAIL.test(email) || email.length > 254) return null;
  if (message.length < 10 || message.length > 4000) return null;
  if (!REASONS.includes(reason) || !PLANS.includes(plan)) return null;
  return { name, email, reason, plan, message, lang };
}

/** Quita saltos de línea para que nada del usuario pueda inyectar cabeceras de correo. */
const headerSafe = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 200);

/**
 * Entrega del mensaje. Hoy: Email Routing (send_email). IA: si se cambia de canal (D1, Resend...),
 * cambia SOLO esta función y deja la validación como está.
 */
async function deliver(input: ContactInput, env: Env): Promise<boolean> {
  if (!env.CONTACT_MAILER) {
    if (env.ALLOW_LOG_ONLY === "1") {
      console.log("[contact] (solo log, sin email configurado)", JSON.stringify(input));
      return true;
    }
    console.error("[contact] CONTACT_MAILER no configurado");
    return false;
  }
  const subject = headerSafe(`[${input.reason}] ${input.name}${input.plan ? ` (${input.plan})` : ""}`);
  const bodyText = [
    `Nombre: ${input.name}`,
    `Correo: ${input.email}`,
    `Motivo: ${input.reason}`,
    `Plan: ${input.plan || "sin decidir"}`,
    `Idioma: ${input.lang}`,
    "",
    input.message,
  ].join("\r\n");
  // CONTACT_TO admite varias direcciones separadas por comas (secreto). Cada una debe estar VERIFICADA en
  // Email Routing → Destination addresses. Se envía una copia a cada una; basta con que llegue a una.
  const recipients = env.CONTACT_TO.split(",").map((s) => s.trim()).filter(Boolean);
  const results = await Promise.allSettled(
    recipients.map((to) => {
      const raw = [
        `From: ${env.CONTACT_FROM}`,
        `To: ${to}`,
        `Reply-To: ${headerSafe(input.email)}`,
        `Subject: ${subject}`,
        `Date: ${new Date().toUTCString()}`,
        `Message-ID: <${crypto.randomUUID()}@${env.CONTACT_FROM.split("@")[1] ?? "localhost"}>`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=utf-8",
        "Content-Transfer-Encoding: 8bit",
        "",
        bodyText,
      ].join("\r\n");
      return env.CONTACT_MAILER!.send(new EmailMessage(env.CONTACT_FROM, to, raw));
    }),
  );
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[contact] fallo al enviar a destino #${i + 1}:`, String(r.reason));
  });
  return results.some((r) => r.status === "fulfilled");
}

async function handleContact(req: Request, env: Env): Promise<Response> {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ ok: false, error: "type" }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > 16_384) return json({ ok: false, error: "size" }, 413);

  // Mismo origen: el formulario solo se envía desde nuestra propia web.
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return json({ ok: false, error: "origin" }, 403);

  const ip = req.headers.get("cf-connecting-ip");
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: ip ?? "unknown" });
    if (!success) return json({ ok: false, error: "rate_limited" }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "validation" }, 400);
  }

  // Trampa para bots: respondemos "ok" sin hacer nada.
  if (typeof raw.website === "string" && raw.website.length > 0) return json({ ok: true });

  const input = parseContact(raw);
  if (!input) return json({ ok: false, error: "validation" }, 400);

  if (!env.TURNSTILE_SECRET) {
    console.error("[contact] TURNSTILE_SECRET no configurado");
    return json({ ok: false, error: "server" }, 500);
  }
  const verdict = await verifyTurnstile(typeof raw.token === "string" ? raw.token : "", env.TURNSTILE_SECRET, ip);
  if (verdict === "unavailable") return json({ ok: false, error: "server" }, 503);
  if (verdict === "bot") return json({ ok: false, error: "turnstile" }, 400);

  try {
    const sent = await deliver(input, env);
    return sent ? json({ ok: true }) : json({ ok: false, error: "server" }, 503);
  } catch (err) {
    console.error("[contact] fallo al entregar", err);
    return json({ ok: false, error: "server" }, 502);
  }
}

export default {
  async fetch(req, env, ctx): Promise<Response> {
    const url = new URL(req.url);
    if (url.pathname === "/api/contact") return handleContact(req, env);
    if (url.pathname === "/api/checkout") return handleCheckout(req, env);
    if (url.pathname === "/api/stripe/webhook") return handleStripeWebhook(req, env);
    if (url.pathname.startsWith("/api/publish/")) return handlePublish(req, env, ctx);
    if (url.pathname.startsWith("/api/")) return json({ ok: false, error: "not_found" }, 404);
    return env.ASSETS.fetch(req);
  },
} satisfies ExportedHandler<Env>;
