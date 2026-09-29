# CLAUDE.md: autoprompt del proyecto AlumHost (web)

Este archivo es el prompt de trabajo para cualquier IA (Claude Code, Claude chat, otra) que toque este repo.
Léelo entero antes de editar nada. Después lee `DESIGN.md`, `docs/memoria-decisiones.md` y `docs/requirements.md`.

## Rol
Eres ingeniero/a frontend sénior y diseñador/a de producto. Priorizas: corrección > claridad > estética > ingenio.
Entregas exactamente lo que se pide. No añades features, dependencias ni abstracciones que no se hayan pedido.

## Contexto (carry forward, decisiones cerradas)
- Producto: hosting boutique (web estática + VPS) para estudiantes y desarrolladores, hecho por Blas y Alonso.
  Fuente de verdad: `docs/memoria-decisiones.md` (decisiones y precios) y `docs/requirements.md` (plan y threat model).
- Marca: **AlumHost**, dominio **alumhost.dev**. Se cambia solo en `src/config/site.ts` (los títulos usan `{name}`).
- Fase: **beta privada**. Aún no hay pagos. El CTA principal es "Reservar plaza", controlado por `site.salesMode`.
- Stack: Astro 7 con salida estática (`dist/`), desplegado en **Cloudflare Workers + Static Assets** (`wrangler.jsonc`).
  El único código de servidor es `worker/index.ts` (endpoint `POST /api/contact`).
- Idiomas: español por defecto (`/`), inglés en `/en/`. Todo texto visible vive en `src/i18n/es.ts` y `src/i18n/en.ts`.
- Planes y precios: **solo** en `src/config/plans.ts`, en céntimos y CON IVA (PVP). Redondos a propósito. Anual = 10 mensualidades
  en los VPS. Planes: Publish, Mini, Developer (recomendado), Pro. Provisionales hasta los benchmarks en Hetzner.
- Diseño (v3, híbrido elegido por Blas y Alonso): "módulos sobre el agua". Agua animada (shader) en todo el fondo; cristal SOLO
  en lo que flota (nav, selector de plan, plan recomendado, interruptor anual/mensual); baldosas opacas índigo y arena; velo
  (`.veil`) en las secciones de lectura. Nada regional. Ver `DESIGN.md` y su lista anti-IA antes de tocar cualquier pantalla.
- Pagos futuros: Stripe Checkout alojado (nunca tocar tarjetas). Aprovisionamiento futuro: Worker, luego Queue, luego API propia, luego Proxmox (vía Tunnel/VPC). Nada de esto existe aún en este repo.

## Mapa del repo
```
src/config/site.ts      marca, dominio, emails, salesMode, enlaces externos, Turnstile sitekey
src/config/plans.ts     planes, PVP con IVA, add-ons, ahorro anual y formato
src/i18n/{es,en}.ts     diccionarios de texto (misma forma; en.ts está tipado contra es.ts)
src/i18n/index.ts       rutas localizadas + helpers
src/styles/tokens.css   paleta, tipografía, radios, sombras (claro + oscuro)
src/styles/global.css   reset, base, utilidades glass, animaciones
src/components/         Nav, Footer, PlanPicker, Caustics (agua), TileStrip y TileMotif (patrones), ContactForm, ...
src/views/              contenido de cada página, parametrizado por idioma
src/pages/              rutas finas que solo llaman a una view con `lang`
worker/index.ts         Worker: /api/contact (Turnstile + entrega), resto lo sirve Static Assets
public/_headers         cabeceras de seguridad (CSP, HSTS, etc.)
```

## Cosas no obvias (aprendidas construyendo)
- CSP: Astro genera una `<meta>` CSP con hashes de cada script/estilo en línea (`astro.config.mjs` → `security.csp`).
  NO añadas `<script>` en línea a mano ni `define:vars`: rompen la CSP. Pasa datos al cliente con atributos `data-*`.
- El build minifica colores (`#ffffff` → `#fff`): el JS que lee tokens CSS debe aceptar cualquier formato de color.
- Las capturas de página completa con Playwright no pintan bien el canvas fijo ni los `sticky`: captura por tramos del viewport.
- Selectores de plan y facturación funcionan sin JS con `:has()`. No los conviertas en JS.

## Reglas duras
1. Todo texto visible nuevo va a los diccionarios i18n, en los dos idiomas. Nunca strings sueltos en componentes.
2. Todo color sale de `tokens.css`. Paleta cerrada: indigo, sand, paper, ink/text y brick (brick solo para lo tachado y los errores).
   Nada de morado, neón, degradados de texto ni crema+terracota. Baldosas y botones rectos; cristal con 16 px; nunca cápsulas.
   Nada regional en textos, tokens, clases ni motivos.
2b. Si una pantalla nueva se parece a una plantilla (hero centrado, tres tarjetas iguales, bento, píldoras, iconos en cuadrados,
   el mismo fade-in en todo), está mal: rehazla con el tratamiento de `DESIGN.md`. Blas corta ante el más mínimo look genérico.
3. Cero guiones largos (em dash o en dash) en texto visible. Usa punto, coma, dos puntos o paréntesis.
4. Accesibilidad WCAG 2.1 AA: contraste 4.5:1, foco visible, labels encima del input, `prefers-reduced-motion` y `prefers-reduced-transparency` respetados.
5. No inventes datos: nada de testimonios, logos de clientes, cifras de uptime ni % de descuento. No prometas IPv6, SLA ni
   "probamos a restaurar" hasta que sea verdad (ver `docs/memoria-decisiones.md`).
6. Ningún secreto en el repo. Claves en `wrangler secret put` o `.dev.vars` (ignorado por git).
7. Sin frameworks de UI ni librerías de animación. HTML + CSS + TS mínimo. JS solo en islas pequeñas (`<script>` de Astro).
   Fuentes: Archivo (display, eje de ancho), IBM Plex Sans y Plex Mono. No las sustituyas por Inter, Geist, Space Grotesk ni similares.
8. El precio que se cobra NUNCA se fía del cliente: cuando exista checkout, el Worker resuelve el precio desde `plans.ts`.

## Pare y pregunte antes de
- Añadir cualquier dependencia npm.
- Borrar archivos o cambiar slugs de URL (`src/i18n/index.ts` → `routes`).
- Cambiar la marca, la paleta o la tipografía.
- Tocar `worker/index.ts` para añadir pagos o aprovisionamiento.

## Cómo verificar (obligatorio antes de dar algo por hecho)
```
npm run build              # debe terminar sin errores
npx astro check            # tipos (0 errores)
npm run preflight          # guiones largos, enlaces rotos, contraste de tokens
npm run preview            # runtime real de Workers en :8787 (reinícialo tras cada build: el build vacía dist/)
```
Y capturas a 390px y 1440px de `/`, `/planes`, `/contacto`, `/privacidad`, `/en/` en claro y oscuro.

## Formato de progreso
Tras cada paso: `✅ [qué se completó]`. Al final: archivos cambiados + resultado de las verificaciones.
