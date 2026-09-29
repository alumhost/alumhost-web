# Patio · web

Web de la beta de Patio (hosting boutique para estudiantes): Home, Planes y Contacto, en español e inglés.
Astro estático + Cloudflare Workers (Static Assets). Nombre, dominio y precios son **provisionales**.

## Arrancar
```bash
npm install
npm run dev                 # http://localhost:4321  (sin /api: el formulario dará error, es normal)
cp .dev.vars.example .dev.vars
npm run preview             # build + runtime real de Workers en http://localhost:8787 (con /api/contact)
```

## Dónde se cambia cada cosa
| Quiero cambiar... | Archivo |
|---|---|
| Nombre, dominio, correos, modo beta/venta | `src/config/site.ts` |
| Precios, specs, extras | `src/config/plans.ts` |
| Cualquier texto (ES / EN) | `src/i18n/es.ts`, `src/i18n/en.ts` |
| Colores, tipografía, radios | `src/styles/tokens.css` |
| Formulario en servidor | `worker/index.ts` |

## Desplegar (Cloudflare)
1. `npx wrangler login`
2. `npx wrangler secret put TURNSTILE_SECRET` (crea el widget en el panel de Turnstile y pon la sitekey en `site.ts`)
3. Email Routing activo en el dominio + descomentar `send_email` en `wrangler.jsonc`
4. `npm run deploy`

## Antes de cobrar
ToS, Privacidad (RGPD) y DPA publicados y enlazados en el pie; Stripe Checkout con precio resuelto en servidor.
Ver `docs/requirements.md`. Para IAs: leer `CLAUDE.md` primero.
