/**
 * Convierte un plan (números en plans.ts) en líneas de texto localizadas.
 * Las specs numéricas salen de plans.ts; los extras no numéricos, de i18n (plans.items[id].features).
 */
import { formatEur, monthlyWithVat, periodTotalWithVat, type Billing, type Plan } from "../config/plans";
import { fill, useDict, type Lang } from "../i18n";

export const specLines = (plan: Plan, lang: Lang): string[] => {
  const t = useDict(lang).plans;
  const s = plan.specs;
  const lines: string[] = [];
  if (s.vcpu !== null) lines.push(fill(t.specs.vcpu, { n: s.vcpu }));
  if (s.ramGb !== null) lines.push(fill(t.specs.ram, { n: s.ramGb }));
  if (s.diskGb !== null) lines.push(fill(t.specs.disk, { n: s.diskGb }));
  if (s.ssh) lines.push(t.specs.ssh);
  return [...lines, ...t.items[plan.id].features];
};

export interface PriceView {
  monthly: string; // "1,82 €"
  note: string; // "21,78 € al año, IVA incluido"
}

export const priceView = (plan: Plan, billing: Billing, lang: Lang): PriceView => {
  const c = useDict(lang).common;
  return {
    monthly: formatEur(monthlyWithVat(plan, billing), lang),
    note:
      billing === "yearly"
        ? fill(c.yearlyTotal, { total: formatEur(periodTotalWithVat(plan, "yearly"), lang) })
        : c.monthlyTotal,
  };
};
