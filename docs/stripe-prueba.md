# Prueba de pagos con Stripe (sandbox)

Rama `feat/stripe-test`. Decisiones (30/09/2026): sin librería `stripe`, idempotencia en D1, Worker de prueba aparte en `*.workers.dev`.
No se provisiona nada: el webhook solo registra "SE CREARÍA EL VPS". Nunca desplegar esta rama sobre `alumhost.dev`.

## Piezas
- `worker/stripe.ts`: `POST /api/checkout` (C1) y `POST /api/stripe/webhook` (C2).
- `worker/stripe-signature.ts`: verificador de firma. `node --experimental-strip-types worker/stripe.test.mjs` (8 casos).
- `migrations/0002_stripe.sql`: `stripe_events` (event_id) y `stripe_provisions` (subscription_id, dedupe de negocio).
- `wrangler.test.jsonc`: Worker `alumhost-web-test` (sin dominio propio, D1 propia).

## Puesta en marcha
1. Stripe (sandbox): crea un Producto con dos Prices recurrentes (mensual y anual) por plan de pago (mini, developer, pro),
   con los importes de `src/config/plans.ts` y IVA incluido. Pega los `price_...` en `STRIPE_PRICES` de `wrangler.test.jsonc`.
2. `npx wrangler d1 create alumhost-test --location eeur` y pega el id en `wrangler.test.jsonc`.
3. `npx wrangler d1 migrations apply alumhost-test --remote -c wrangler.test.jsonc`
4. Secretos (nunca en el repo ni en el chat):
   `npx wrangler secret put STRIPE_SECRET_KEY -c wrangler.test.jsonc` (sk_test_ o rk_test_),
   `STRIPE_WEBHOOK_SECRET` y `TURNSTILE_SECRET` igual. Turnstile: añade el dominio `*.workers.dev` a la sitekey o usa las claves de prueba de Turnstile.
5. `npm run build && npx wrangler deploy -c wrangler.test.jsonc`
6. Panel de Stripe (sandbox) → Workbench → Webhooks → Create an event destination → Your account, eventos snapshot,
   solo: checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.async_payment_failed,
   invoice.paid, invoice.payment_failed, customer.subscription.updated, customer.subscription.deleted.
   URL: `https://alumhost-web-test.<cuenta>.workers.dev/api/stripe/webhook`. Copia el whsec_ con "Reveal secret" y guárdalo con `wrangler secret put`.

## Local
`.dev.vars` (ver `.dev.vars.example`) y `npx wrangler dev -c wrangler.test.jsonc`; `stripe listen --forward-to localhost:8787/api/stripe/webhook`
imprime otro `whsec_` distinto del del panel: ese va en `.dev.vars`. No uses `stripe trigger`.

## Probar sin botón en la web
Con un token de Turnstile válido en el navegador (o la sitekey de prueba), desde la consola de la página de la preview:
`fetch("/api/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({plan:"developer",billing:"monthly",lang:"es",token:"<turnstile>"})}).then(r=>r.json())`
y abre la `url` devuelta. (El botón de pago en la UI se añade después, cambiando `salesMode` solo en esta rama.)

## Matriz de casos (caducidad futura, CVC y CP cualquiera)
| Caso | Cómo | Esperado |
|---|---|---|
| Pago correcto | 4242 4242 4242 4242 | session.completed e invoice.paid llegan; el log dice "SE CREARÍA EL VPS" UNA sola vez |
| 3D Secure | 4000 0027 6000 3184 | diálogo de autenticación y luego el evento |
| Rechazo | 4000 0000 0000 0002 / 4000 0000 0000 9995 | error en Checkout, sin session.completed |
| Evento duplicado | Resend en el panel | 200 con `duplicate:true`, sin reprocesar |
| Firma falsa | curl con Stripe-Signature inventado | 400 |
| Cuerpo manipulado | mismo evento con un espacio | 400 |
| Plan inventado | POST /api/checkout con plan "xx" o "publish" | 400 sin llamar a Stripe |
| Sin Turnstile | sin token | 400 turnstile |
| Origen ajeno | cabecera Origin distinta | 403 |
| Renovación fallida (fase 2) | 4000 0000 0000 0341 + test clock | invoice.payment_failed |
Comprueba cada pago también en el panel de la sandbox (así local y preview apuntan a la misma).

## Fuera de alcance
Cuenta real y facturación, disputas y reembolsos, conectar `create-vps` (después del threat model).
