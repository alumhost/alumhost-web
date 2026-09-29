// @ts-check
import { defineConfig } from "astro/config";

// Salida 100% estática en dist/. Cloudflare Workers Static Assets la sirve (ver wrangler.jsonc).
// Las rutas localizadas se gestionan a mano en src/i18n/index.ts (los slugs cambian por idioma).
export default defineConfig({
  // TODO(dominio): pon aquí el dominio definitivo; se usa para canonical, hreflang y sitemap.
  site: "https://alumhost.dev",
  trailingSlash: "ignore",
  build: { format: "directory", inlineStylesheets: "auto" },
  devToolbar: { enabled: false },

  // CSP nativa de Astro: añade <meta http-equiv="content-security-policy"> con hashes de cada script/estilo
  // en línea que genera el build. Lo que una <meta> no puede expresar (frame-ancestors) va en public/_headers.
  // IA: si añades un tercero (p. ej. Stripe.js), añádelo aquí, en scriptDirective y en directives.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-src https://challenges.cloudflare.com",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ],
      scriptDirective: { resources: ["'self'", "https://challenges.cloudflare.com"] },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: "element" },
          // style="--i:N" (retardos escalonados). Solo atributos de estilo, nunca <style> ni scripts.
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
    },
  },
});
