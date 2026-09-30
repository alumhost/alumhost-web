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

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
