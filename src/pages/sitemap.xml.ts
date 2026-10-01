/**
 * sitemap.xml generado desde `routes` (src/i18n/index.ts): una entrada por URL, con sus alternates hreflang.
 * Sin dependencias. Se excluyen las páginas que no deben indexarse (SKIP: el paso 2 de Publish solo se abre desde el enlace mágico). Al añadir una ruta a `routes` aparece sola. La 404 no está en `routes`, así que no entra.
 * IA: si cambias un slug, esto se actualiza solo; pregunta antes de cambiarlo (SEO).
 */
import type { APIRoute } from "astro";
import { langs, path, routes, type RouteKey } from "../i18n";

const origin = "https://alumhost.dev";
const SKIP: RouteKey[] = ["publishUpload"];

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(origin)).origin;
  const abs = (p: string) => new URL(p, base).href;
  const urls = (Object.keys(routes) as RouteKey[]).filter((key) => !SKIP.includes(key)).flatMap((key) =>
    langs.map((lang) => {
      const alternates = [
        ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(path(key, l))}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(path(key, "es"))}"/>`,
      ].join("\n");
      return `  <url>\n    <loc>${abs(path(key, lang))}</loc>\n${alternates}\n  </url>`;
    }),
  );
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.join("\n") +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
