/**
 * ÚNICA fuente de verdad de planes y precios. La web y (en el futuro) el Worker de checkout leen de aquí.
 *
 * Origen: plan de negocio §1.1 y §1.2 (ver docs/requirements.md).
 * - Precios en CÉNTIMOS y SIN IVA, como en el plan. La web los muestra con IVA (regla del plan §1.2).
 * - PROVISIONALES hasta tener los datos de capacidad del Sprint 0 (plan §10).
 * - Los textos (nombre comercial, descripciones) están en src/i18n/*.ts bajo `plans.items[id]`.
 *
 * IA: si cambias un precio aquí, no toques nada más: toda la web se recalcula sola.
 * Seguridad: el día que haya checkout, el servidor debe resolver el precio con `id` + `billing`
 * desde este archivo; nunca aceptar un importe enviado por el navegador (threat model).
 */

export const VAT_RATE = 0.21; // IVA general España (consumidor final)

export type Billing = "yearly" | "monthly";
export type PlanId = "publish" | "developer" | "pro";

export interface Plan {
  id: PlanId;
  /** Precio base sin IVA, en céntimos. yearly = importe del año completo. */
  price: Record<Billing, number>;
  /** Specs en formato máquina; el texto visible sale de i18n. null = no aplica. */
  specs: { vcpu: number | null; ramGb: number | null; diskGb: number | null; ssh: boolean };
  /** Add-on de backup en céntimos/mes sin IVA y días de retención. null = no se ofrece. */
  backup: { monthly: number; retentionDays: number } | null;
  /** Se muestra como recomendado en /planes. Solo uno a la vez. */
  featured: boolean;
}

export const plans: Plan[] = [
  {
    id: "publish",
    price: { yearly: 1800, monthly: 250 }, // plan §1.2: 18 €/año; mensual 2,50 €
    specs: { vcpu: null, ramGb: null, diskGb: null, ssh: false },
    backup: null, // el repo del cliente es el backup (plan §3)
    featured: false,
  },
  {
    id: "developer",
    price: { yearly: 4000, monthly: 450 }, // 40 €/año del plan; mensual 4,50 € elegido por la web (A CONFIRMAR)
    specs: { vcpu: 1, ramGb: 1, diskGb: 15, ssh: true },
    backup: { monthly: 100, retentionDays: 7 },
    featured: true,
  },
  {
    id: "pro",
    price: { yearly: 8000, monthly: 900 }, // plan: 6-10 €/mes; 80 €/año y 9 €/mes elegidos por la web (A CONFIRMAR)
    // plan: "recursos escalados (ej. 4 GB RAM)". vCPU y disco sin definir: null = la web no inventa cifra.
    specs: { vcpu: null, ramGb: 4, diskGb: null, ssh: true },
    backup: { monthly: 200, retentionDays: 14 },
    featured: false,
  },
];

/** Add-ons independientes del backup. */
export const addons = {
  dedicatedIpv4: { monthly: 200, availableOn: ["pro"] as PlanId[] }, // plan §1.1: +2 €/mes en Tier 3
};

export const getPlan = (id: PlanId): Plan => {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Plan desconocido: ${id}`);
  return plan;
};

/** Añade IVA y redondea al céntimo. */
export const withVat = (cents: number): number => Math.round(cents * (1 + VAT_RATE));

/** Precio mensual equivalente con IVA (para anual: total/12). */
export const monthlyWithVat = (plan: Plan, billing: Billing): number =>
  billing === "yearly" ? Math.round(withVat(plan.price.yearly) / 12) : withVat(plan.price.monthly);

/** Total del periodo facturado con IVA. */
export const periodTotalWithVat = (plan: Plan, billing: Billing): number => withVat(plan.price[billing]);

/** Plan más barato (para el "desde X €/mes"). */
export const cheapestMonthly = (): number => Math.min(...plans.map((p) => monthlyWithVat(p, "yearly")));

/** 1815 -> "18,15 €" (es) / "€18.15" (en). */
export const formatEur = (cents: number, lang: "es" | "en"): string =>
  new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(cents / 100);
