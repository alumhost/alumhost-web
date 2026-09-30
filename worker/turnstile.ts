/**
 * Verificación de Cloudflare Turnstile en servidor (la usan /api/contact y /api/publish/request).
 * "human" = token válido · "bot" = token inválido/caducado · "unavailable" = no se pudo consultar a Cloudflare.
 * Separar "bot" de "unavailable" evita decirle a una persona real que no ha pasado la verificación por un fallo de red.
 */
export async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string | null,
): Promise<"human" | "bot" | "unavailable"> {
  if (!token || token.length > 2048) return "bot";
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    if (!res.ok) return "unavailable";
    const data = (await res.json()) as { success?: boolean };
    return data.success === true ? "human" : "bot";
  } catch (err) {
    console.error("[turnstile] siteverify no disponible", err);
    return "unavailable";
  }
}

/**
 * Lee el cuerpo como máximo `max` bytes, aunque venga sin content-length (chunked). null = demasiado grande.
 * Evita que un cliente se salte los límites de tamaño y obligue al Worker a leer cuerpos enormes.
 */
export async function readLimited(req: Request | Response, max: number): Promise<Uint8Array | null> {
  const declared = req.headers.get("content-length");
  if (declared !== null && Number(declared) > max) return null;
  if (!req.body) return new Uint8Array(0);
  const reader = req.body.getReader();
  const parts: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    parts.push(value);
  }
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.byteLength; }
  return out;
}

/** JSON con límite de tamaño. "too_big" → 413, "bad" → 400. */
export async function readJson(req: Request, max: number): Promise<Record<string, unknown> | "too_big" | "bad"> {
  const bytes = await readLimited(req, max);
  if (!bytes) return "too_big";
  try {
    const v = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : "bad";
  } catch {
    return "bad";
  }
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "cross-origin-resource-policy": "same-origin",
    },
  });
