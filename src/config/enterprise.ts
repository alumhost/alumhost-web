/**
 * Plan Enterprise (/enterprise/): webs y servidores para negocios y asociaciones. Producto aparte de los planes de
 * estudiantes (config/plans.ts). Precios en CÉNTIMOS y CON IVA. PROVISIONALES: se ajustan tras las visitas a negocios.
 * Textos en src/i18n/*.ts bajo `enterprise.items[id]`.
 */
export type EnterpriseId = "presence" | "business" | "managed";

export interface EnterprisePlan {
  id: EnterpriseId;
  /** Cuota mensual con IVA, en céntimos. */
  monthly: number;
  /** Pago único por hacer la web, con IVA, en céntimos. null = según proyecto. */
  setup: number | null;
  featured: boolean;
}

export const enterprisePlans: EnterprisePlan[] = [
  { id: "presence", monthly: 2500, setup: 15000, featured: false },
  { id: "business", monthly: 3500, setup: 25000, featured: true },
  { id: "managed", monthly: 6000, setup: null, featured: false },
];
