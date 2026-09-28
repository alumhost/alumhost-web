/**
 * CTA principal según site.salesMode. Todas las páginas lo usan: cambiar de beta a venta es tocar site.ts.
 * IA: "deposit" y "checkout" fallan a propósito en el build hasta que exista /api/checkout en worker/index.ts
 * (Stripe Checkout, precio resuelto en servidor desde plans.ts). No los "arregles" con un enlace a "#".
 */
import { site } from "./site";
import type { PlanId } from "./plans";
import { contactHref, useDict, type Lang } from "../i18n";

export interface Cta {
  href: string;
  label: string;
}

export const primaryCta = (lang: Lang, plan?: PlanId): Cta => {
  const t = useDict(lang);
  switch (site.salesMode) {
    case "waitlist":
      return { href: contactHref(lang, { reason: "beta", plan }), label: t.nav.cta };
    case "deposit":
    case "checkout":
      throw new Error(`salesMode "${site.salesMode}" requiere /api/checkout (no implementado).`);
  }
};
