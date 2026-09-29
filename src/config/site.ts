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
  name: "AlumHost",
  domain: "alumhost.dev",
  salesMode: "waitlist" as SalesMode,

  email: {
    // Buzones con Email Routing de Cloudflare hacia Gmail (TODO: activarlo antes de producción).
    hello: "hola@alumhost.dev",
    support: "soporte@alumhost.dev",
    abuse: "abuse@alumhost.dev", // obligatorio publicarlo (plan §1.4 y §4.3)
    privacy: "privacidad@alumhost.dev",
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
  /** Responsable del tratamiento que sale en /privacidad. TODO(legal): nombre legal y NIF cuando haya alta. */
  legal: {
    // Beta sin actividad económica: nombres de los responsables. NIF/DNI NO se publica hasta el alta (aviso legal LSSI);
    // el repo es público y el historial de Git es permanente.
    controller: "Alonso Carballar Barrientos y Blas Cosano Molina, responsables de AlumHost",
  },

  turnstileSiteKey: "1x00000000000000000000AA",
} as const;
