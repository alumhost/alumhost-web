/**
 * i18n mínimo y explícito. Idiomas: "es" (por defecto, sin prefijo) y "en" (/en/).
 * Para añadir un idioma: crea xx.ts tipado con Dict, añádelo a `dicts`, a `routes` y crea src/pages/xx/*.
 * IA: los slugs de `routes` son URLs públicas. Cambiarlos rompe enlaces y SEO: pregunta antes.
 */
import es, { type Dict } from "./es";
import en from "./en";

export type Lang = "es" | "en";
export const langs: Lang[] = ["es", "en"];
export const defaultLang: Lang = "es";

const dicts: Record<Lang, Dict> = { es, en };

export type RouteKey = "home" | "plans" | "contact" | "privacy" | "publish" | "publishUpload";

export const routes: Record<RouteKey, Record<Lang, string>> = {
  home: { es: "/", en: "/en/" },
  plans: { es: "/planes/", en: "/en/plans/" },
  contact: { es: "/contacto/", en: "/en/contact/" },
  privacy: { es: "/privacidad/", en: "/en/privacy/" },
  publish: { es: "/publicar/", en: "/en/publish/" },
  publishUpload: { es: "/publicar/subir/", en: "/en/publish/upload/" },
};

export const useDict = (lang: Lang): Dict => dicts[lang];

export const path = (key: RouteKey, lang: Lang): string => routes[key][lang];

/** Rellena {placeholders}: fill("desde {price}", { price: "1,82 €" }) */
export const fill = (template: string, vars: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));

/** Enlace al formulario con motivo y plan preseleccionados (lo lee el script de ContactForm). */
export const contactHref = (lang: Lang, opts: { reason?: string; plan?: string } = {}): string => {
  const params = new URLSearchParams();
  if (opts.reason) params.set("motivo", opts.reason);
  if (opts.plan) params.set("plan", opts.plan);
  const qs = params.toString();
  return path("contact", lang) + (qs ? `?${qs}` : "") + "#form";
};
