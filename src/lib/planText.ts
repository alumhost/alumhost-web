/**
 * Convierte un plan (números en plans.ts) en texto localizado.
 * Las specs numéricas salen de plans.ts; los extras no numéricos, de i18n (plans.items[id].features).
 */
import { addons, formatEur, isFree, yearlySaving, type Billing, type Plan } from "../config/plans";
import { fill, useDict, type Lang } from "../i18n";

export const specLines = (plan: Plan, lang: Lang): string[] => {
  const t = useDict(lang).plans;
  const s = plan.specs;
  const lines: string[] = [];
  if (s.vcpu !== null) lines.push(fill(t.specs.vcpu, { n: s.vcpu }));
  if (s.ramMb !== null)
    lines.push(s.ramMb >= 1024 ? fill(t.specs.ramGb, { n: s.ramMb / 1024 }) : fill(t.specs.ramMb, { n: s.ramMb }));
  if (s.diskGb !== null) lines.push(fill(t.specs.disk, { n: s.diskGb }));
  if (s.ssh) lines.push(t.specs.ssh);
  return [...lines, ...t.items[plan.id].features];
};

export interface PriceView {
  amount: string; // "50 €"
  per: string; // "/año"
  note: string; // "Ahorras 10 € frente al pago mensual"
}

/** Anual: se muestra el importe del año (redondo) y el ahorro. Mensual: la cuota. Siempre IVA incluido. */
export const priceView = (plan: Plan, billing: Billing, lang: Lang): PriceView => {
  const c = useDict(lang).common;
  if (isFree(plan)) {
    return {
      amount: c.free,
      per: "",
      note: fill(c.freeNote, {
        monthly: formatEur(addons.customDomain.monthly, lang),
        yearly: formatEur(addons.customDomain.yearly, lang),
      }),
    };
  }
  if (billing === "yearly") {
    return {
      amount: formatEur(plan.price.yearly, lang),
      per: c.perYear,
      note: fill(c.yearlySaving, { amount: formatEur(yearlySaving(plan), lang), monthly: formatEur(plan.price.monthly, lang) }),
    };
  }
  return { amount: formatEur(plan.price.monthly, lang), per: c.perMonth, note: c.monthlyNote };
};
