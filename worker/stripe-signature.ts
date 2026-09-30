/** Verificador de Stripe-Signature (sin dependencias, probado en Node con stripe.test.mjs). */

const hexToBytes = (h: string) =>
  /^[0-9a-f]+$/i.test(h) && h.length % 2 === 0 ? Uint8Array.from(h.match(/../g)!, (b) => parseInt(b, 16)) : null;

/** Verifica la cabecera Stripe-Signature (t=…,v1=…[,v1=…][,v0=…]). Ignora esquemas distintos de v1. Tolerancia 5 min. */
export async function verifyStripeSignature(raw: string, header: string, secret: string, toleranceSec = 300): Promise<boolean> {
  const parts = header.split(",").map((p) => p.split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || sigs.length === 0) return false;
  if (!(Math.abs(Date.now() / 1000 - Number(t)) <= toleranceSec)) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const data = new TextEncoder().encode(`${t}.${raw}`);
  for (const hex of sigs) {
    const bytes = hexToBytes(hex);
    if (bytes && (await crypto.subtle.verify("HMAC", key, bytes, data))) return true;
  }
  return false;
}

