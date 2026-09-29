/**
 * Configuración global de la marca y del modo de venta.
 * Es el primer sitio que hay que tocar para renombrar o pasar de beta a venta.
 * IA: los valores marcados con TODO son provisionales; no los muestres como definitivos en otros sitios.
 */

/**
 * Cómo convierte la web (plan de negocio §8 y §9.4):
 * - "waitlist": beta privada. Los CTAs llevan al formulario con motivo "beta". (ACTUAL)
 * - "deposit":  reserva con depósito de 5 € vía Stripe. Requiere endpoint /api/checkout (no existe aún).
 * - "checkout": venta abierta con Stripe Checkout. Requiere endpoint /api/checkout (no existe aún).
 */
export type SalesMode = "waitlist" | "deposit" | "checkout";

export const site = {
  name: "Patio", // TODO(marca): nombre provisional
  domain: "patio.example", // TODO(dominio)
  salesMode: "waitlist" as SalesMode,

  email: {
    hello: "hola@patio.example", // TODO(dominio)
    abuse: "abuse@patio.example", // TODO(dominio). Obligatorio publicarlo (plan §1.4 y §4.3)
  },

  /**
   * Enlaces externos. Si un valor es null, la web NO lo muestra (nada de enlaces a "#").
   * TODO: rellenar cuando existan (plan §5 página de estado, §12 devlog y scripts en abierto).
   */
  links: {
    status: null as string | null,
    devlog: null as string | null,
    repo: null as string | null,
  },

  /**
   * Cloudflare Turnstile (antibot del formulario). La sitekey es pública; el secret va en `wrangler secret`.
   * Este valor es la sitekey de PRUEBA oficial (siempre pasa). TODO: cambiar por la real antes de producción.
   */
  turnstileSiteKey: "1x00000000000000000000AA",
} as const;
