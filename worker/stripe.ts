/**
 * Stripe Checkout + webhook (RAMA DE PRUEBA, modo sandbox). Sin librería `stripe`: la API es HTTP form-encoded y la
 * firma del webhook se verifica a mano con Web Crypto (método documentado por Stripe).
 *
 * Reglas:
 *  - El precio NUNCA viene del navegador: plan + periodo se validan contra src/config/plans.ts y el price_id sale de
 *    la variable STRIPE_PRICES (mapa "plan.periodo" → price_...).
 *  - El webhook lee el cuerpo con req.text() ANTES de parsear (cualquier cambio rompe la firma).
 *  - Doble deduplicación: por event.id (reintentos) y por clave de negocio (subscription id) para no crear dos VPS,
 *    porque el primer pago genera checkout.session.completed E invoice.paid.
 *  - En esta fase NO se provisiona nada: solo se registra "se crearía el VPS".
 */
import { json, verifyTurnstile } from "./turnstile";
import { verifyStripeSignature } from "./stripe-signature";
import { getPlan, isFree, type Billing, type PlanId, plans } from "../src/config/plans";

export interface StripeEnv {
  PUBLISH_DB?: D1Database;
  CONTACT_LIMITER?: RateLimit;
  TURNSTILE_SECRET?: string;
  STRIPE_SECRET_KEY?: string; // wrangler secret put STRIPE_SECRET_KEY (sk_test_... o rk_test_...)
  STRIPE_WEBHOOK_SECRET?: string; // wrangler secret put STRIPE_WEBHOOK_SECRET (whsec_...)
  STRIPE_PRICES?: string; // JSON {"mini.monthly":"price_...", ...} (no es secreto)
}

export { verifyStripeSignature };

// ---------------------------------------------------------------- C1: POST /api/checkout

const BILLINGS: Billing[] = ["monthly", "yearly"];

export async function handleCheckout(req: Request, env: StripeEnv): Promise<Response> {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ ok: false, error: "type" }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > 4096) return json({ ok: false, error: "size" }, 413);
  const origin = req.headers.get("origin");
  const self = new URL(req.url).origin;
  if (!origin || origin !== self) return json({ ok: false, error: "origin" }, 403);

  const ip = req.headers.get("cf-connecting-ip");
  if (env.CONTACT_LIMITER) {
    const { success } = await env.CONTACT_LIMITER.limit({ key: `checkout:${ip ?? "unknown"}` });
    if (!success) return json({ ok: false, error: "rate_limited" }, 429);
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "validation" }, 400);
  }
  const planId = String(raw.plan ?? "") as PlanId;
  const billing = String(raw.billing ?? "") as Billing;
  const lang = raw.lang === "en" ? "en" : "es";
  // El plan debe existir en plans.ts, no ser gratuito y el periodo ser válido. Nada de esto lo decide el navegador.
  if (!plans.some((p) => p.id === planId) || !BILLINGS.includes(billing) || isFree(getPlan(planId))) {
    return json({ ok: false, error: "plan" }, 400);
  }

  if (!env.TURNSTILE_SECRET || !env.STRIPE_SECRET_KEY || !env.STRIPE_PRICES) {
    console.error("[checkout] faltan TURNSTILE_SECRET, STRIPE_SECRET_KEY o STRIPE_PRICES");
    return json({ ok: false, error: "server" }, 500);
  }
  const verdict = await verifyTurnstile(typeof raw.token === "string" ? raw.token : "", env.TURNSTILE_SECRET, ip);
  if (verdict === "unavailable") return json({ ok: false, error: "server" }, 503);
  if (verdict === "bot") return json({ ok: false, error: "turnstile" }, 400);

  let prices: Record<string, string>;
  try {
    prices = JSON.parse(env.STRIPE_PRICES) as Record<string, string>;
  } catch {
    console.error("[checkout] STRIPE_PRICES no es JSON válido");
    return json({ ok: false, error: "server" }, 500);
  }
  const price = prices[`${planId}.${billing}`];
  if (!price || !/^price_[A-Za-z0-9]+$/.test(price)) {
    console.error(`[checkout] sin price_id para ${planId}.${billing}`);
    return json({ ok: false, error: "server" }, 500);
  }

  const back = lang === "en" ? "/en/plans/" : "/planes/";
  const body = new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: `${self}${back}?checkout=ok&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${self}${back}?checkout=cancel`,
    client_reference_id: crypto.randomUUID(),
    "metadata[plan_id]": planId,
    "metadata[billing]": billing,
    // Copia el dato a la suscripción: así invoice.* y customer.subscription.* saben a qué plan pertenecen.
    "subscription_data[metadata][plan_id]": planId,
    "subscription_data[metadata][billing]": billing,
    locale: lang,
  });

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { url?: string; error?: { message?: string } };
    if (!res.ok || !data.url) {
      console.error("[checkout] Stripe rechazó la sesión", res.status, data.error?.message);
      return json({ ok: false, error: "stripe" }, 502);
    }
    return json({ ok: true, url: data.url });
  } catch (err) {
    console.error("[checkout] Stripe no disponible", err);
    return json({ ok: false, error: "server" }, 502);
  }
}

// ---------------------------------------------------------------- C2: POST /api/stripe/webhook

interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, any> };
}

/** Clave de negocio para no crear dos VPS por la misma suscripción (session.completed + invoice.paid). */
async function provisionOnce(db: D1Database, subscriptionId: string, eventId: string): Promise<boolean> {
  const r = await db
    .prepare("INSERT OR IGNORE INTO stripe_provisions (subscription_id, first_event, created_at) VALUES (?, ?, ?)")
    .bind(subscriptionId, eventId, Math.floor(Date.now() / 1000))
    .run();
  return (r.meta.changes ?? 0) > 0;
}

async function processEvent(ev: StripeEvent, db: D1Database): Promise<void> {
  const o = ev.data.object;
  switch (ev.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      if (o.payment_status !== "paid" && o.payment_status !== "no_payment_required") {
        console.log(`[stripe] ${ev.type} ${o.id}: pago aún no confirmado (${o.payment_status}); se espera async_payment_succeeded`);
        return;
      }
      const sub = String(o.subscription ?? "");
      if (sub && (await provisionOnce(db, sub, ev.id))) {
        console.log(`[stripe] SE CREARÍA EL VPS · plan=${o.metadata?.plan_id} periodo=${o.metadata?.billing} sub=${sub} sesión=${o.id} vía ${ev.type}`);
      } else {
        console.log(`[stripe] ${ev.type}: suscripción ${sub} ya provisionada (dedupe de negocio)`);
      }
      return;
    }
    case "invoice.paid": {
      const sub = String(o.subscription ?? o.parent?.subscription_details?.subscription ?? "");
      if (o.billing_reason === "subscription_create") {
        if (sub && (await provisionOnce(db, sub, ev.id))) {
          console.log(`[stripe] SE CREARÍA EL VPS · sub=${sub} vía invoice.paid`);
        } else {
          console.log(`[stripe] invoice.paid: suscripción ${sub} ya provisionada (dedupe de negocio)`);
        }
      } else {
        console.log(`[stripe] invoice.paid renovación (${o.billing_reason}) sub=${sub}: se mantendría activo`);
      }
      return;
    }
    case "invoice.payment_failed":
      console.log(`[stripe] invoice.payment_failed sub=${o.subscription ?? o.parent?.subscription_details?.subscription}: se avisaría al cliente`);
      return;
    case "customer.subscription.updated":
      console.log(`[stripe] subscription.updated ${o.id} estado=${o.status} plan=${o.metadata?.plan_id}`);
      return;
    case "customer.subscription.deleted":
      console.log(`[stripe] subscription.deleted ${o.id}: se suspendería/borraría el VPS según política`);
      return;
    default:
      console.log(`[stripe] evento sin manejador: ${ev.type}`);
  }
}

export async function handleStripeWebhook(req: Request, env: StripeEnv): Promise<Response> {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  const db = env.PUBLISH_DB;
  if (!env.STRIPE_WEBHOOK_SECRET || !db) {
    console.error("[stripe] falta STRIPE_WEBHOOK_SECRET o la D1");
    return json({ ok: false, error: "server" }, 500);
  }
  const raw = await req.text(); // ANTES de parsear: la firma se calcula sobre el cuerpo exacto
  const sig = req.headers.get("stripe-signature") ?? "";
  if (!(await verifyStripeSignature(raw, sig, env.STRIPE_WEBHOOK_SECRET))) return json({ ok: false, error: "signature" }, 400);

  let ev: StripeEvent;
  try {
    ev = JSON.parse(raw) as StripeEvent;
  } catch {
    return json({ ok: false, error: "validation" }, 400);
  }
  if (!ev?.id || !ev?.type || !ev.data?.object) return json({ ok: false, error: "validation" }, 400);

  // Idempotencia por event.id: Stripe reintenta y a veces duplica.
  const ins = await db
    .prepare("INSERT OR IGNORE INTO stripe_events (event_id, type, created_at) VALUES (?, ?, ?)")
    .bind(ev.id, ev.type, Math.floor(Date.now() / 1000))
    .run();
  if ((ins.meta.changes ?? 0) === 0) return json({ ok: true, duplicate: true });

  try {
    await processEvent(ev, db);
  } catch (err) {
    // Si falla, liberamos el id para que el reintento de Stripe lo vuelva a procesar.
    console.error("[stripe] fallo procesando", ev.id, err);
    await db.prepare("DELETE FROM stripe_events WHERE event_id = ?").bind(ev.id).run();
    return json({ ok: false, error: "server" }, 500);
  }
  return json({ ok: true });
}
