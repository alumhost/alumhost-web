/**
 * ÚNICA fuente de verdad de planes y precios. La web y (en el futuro) el Worker de checkout leen de aquí.
 *
 * Origen: plan de negocio §1.1 y §2bis del documento de estado (29/09/2026), ver docs/memoria-decisiones.md.
 * - Precios en CÉNTIMOS y CON IVA incluido (PVP), que es lo que se publica. El neto se calcula con netOf().
 * - Anual = 10 mensualidades en los VPS ("2 meses gratis"). Publish: 18 €/año frente a 2 €/mes.
 * - Precios redondos a propósito: la evidencia reciente no encuentra efecto fiable de los ,99 en la compra
 *   y lo redondo encaja con la promesa de "sin letra pequeña". No los cambies a ,99 sin datos propios.
 * - PROVISIONALES hasta los benchmarks en Hetzner. Los textos están en src/i18n/*.ts bajo `plans.items[id]`.
 *
 * IA: si cambias un precio aquí, no toques nada más: toda la web se recalcula sola.
 * Seguridad: el día que haya checkout, el servidor resuelve el precio con `id` + `billing` desde este archivo;
 * nunca acepta un importe enviado por el navegador (threat model).
 */

export const VAT_RATE = 0.21; // IVA general España (consumidor final)

export type Billing = "yearly" | "monthly";
export type PlanId = "publish" | "mini" | "developer" | "pro";

export interface Plan {
  id: PlanId;
  /** PVP con IVA, en céntimos. yearly = importe del año completo. */
  price: Record<Billing, number>;
  /** Specs en formato máquina; el texto visible sale de i18n. null = no aplica o aún sin definir (no se muestra). */
  specs: { vcpu: number | null; ramMb: number | null; diskGb: number | null; ssh: boolean };
  /** Add-on de backup: PVP con IVA en céntimos/mes y días de retención. null = no se ofrece. */
  backup: { monthly: number; retentionDays: number } | null;
  /** Se destaca como recomendado en /planes y es la opción por defecto del selector. Solo uno. */
  featured: boolean;
}

export const plans: Plan[] = [
  {
    id: "publish",
    price: { yearly: 1800, monthly: 200 },
    specs: { vcpu: null, ramMb: null, diskGb: null, ssh: false },
    backup: null, // el repositorio del cliente es la copia
    featured: false,
  },
  {
    id: "mini",
    price: { yearly: 3000, monthly: 300 },
    // 512 MB (plan nuevo del §2bis). vCPU y disco sin fijar hasta los benchmarks: null = la web no inventa cifra.
    specs: { vcpu: null, ramMb: 512, diskGb: null, ssh: true },
    backup: null, // TODO(negocio): decidir si Mini tiene backup
    featured: false,
  },
  {
    id: "developer",
    price: { yearly: 5000, monthly: 500 }, // subido de 4 € a 5 €: a 4 € no cubre costes en un dedicado de 2026
    specs: { vcpu: 1, ramMb: 1024, diskGb: 15, ssh: true },
    backup: { monthly: 100, retentionDays: 7 },
    featured: true,
  },
  {
    id: "pro",
    price: { yearly: 8000, monthly: 800 },
    // 4 GB. vCPU y disco sin definir: null = la web no inventa cifra.
    specs: { vcpu: null, ramMb: 4096, diskGb: null, ssh: true },
    backup: { monthly: 200, retentionDays: 14 },
    featured: false,
  },
];

/** Add-ons independientes del backup (PVP con IVA). */
export const addons = {
  dedicatedIpv4: { monthly: 450, availableOn: ["pro"] as PlanId[] }, // coste real ~2,11 €/mes (§2bis)
};

export const getPlan = (id: PlanId): Plan => {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan desconocido: ${id}`);
  return plan;
};

/** Neto sin IVA de un PVP (para cuentas internas; la web siempre muestra PVP). */
export const netOf = (cents: number): number => Math.round(cents / (1 + VAT_RATE));

/** Lo que se ahorra al año pagando anual frente a 12 mensualidades. */
export const yearlySaving = (plan: Plan): number => plan.price.monthly * 12 - plan.price.yearly;

/** Plan más barato al mes (para "desde X €/mes"). */
export const cheapestMonthly = (): number => Math.min(...plans.map((p) => p.price.monthly));

/** 1800 -> "18 €", 450 -> "4,50 €" (es) / "€18", "€4.50" (en). Sin decimales si el importe es redondo. */
export const formatEur = (cents: number, lang: "es" | "en"): string =>
  new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
