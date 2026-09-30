# Memoria de Decisiones: AlumHost

## Resumen Ejecutivo

**AlumHost** es hosting boutique para estudiantes y desarrolladores (alumhost.dev).
Combinación de web estática + VPS con servidor dedicado Hetzner + Proxmox + OPNsense.
Proyecto de Blas (Informática, Universidad de Sevilla) y Alonso.
Repositorio: `alumhost/alumhost-web` (GitHub, ambos owners).

## Infraestructura

### Producción (futuro)
- Servidor dedicado Hetzner con Proxmox e OPNsense.
- Lab actual en homelab de Alonso.

### Despliegue Web
- Cloudflare Workers + Static Assets (no GitHub Pages).
- Dominio: alumhost.dev con Cloudflare activo.
- Custom Domain vinculado en Cloudflare.

## Stack Web: Astro 7 + Cloudflare Workers

### Archivos clave
- **src/i18n/es.ts, en.ts**: Todos los textos (en.ts tipado contra es.ts).
- **src/config/plans.ts**: Precios.
- **src/config/site.ts**: Marca, emails, salesMode.
- **src/styles/tokens.css**: Colores (Indigo, Sand, Brick).
- **worker/index.ts**: Worker único con POST /api/contact.

### Rutas
- /, /planes/, /contacto/
- /en/, /en/plans/, /en/contact/

### Worker: POST /api/contact
- Validación de datos.
- Honeypot "website".
- Turnstile en servidor (sitekey y secret).
- Comprobación de origen.
- Rate limit: 5 solicitudes por 60 segundos por IP.
- Límite de payload: 16 KB.
- Entrega por binding `send_email` (Email Routing, comentado hasta existir).

### Seguridad
- CSP nativa de Astro (hashes de estilos inline).
- Sin scripts inline manuales.
- Prohibido define:vars en CSS.
- Datos al cliente solo por data-*.

### Modo de ventas
- `site.salesMode = waitlist`: deposit y checkout fallan a propósito en build.

## Historia de Diseño

### v1: Cristal Claro (rama design/originalConcept)
- Liquid glass, agua cáustica (shader WebGL propio).
- Rasgos de IA genérica: píldoras, bento, Bricolage/Geist, óvalos, flechas.

### v2: Antislop UI (rama design/antislop-ui)
- v1 con Archivo + IBM Plex.
- Sin óvalos.

### v3: Baldosas Sevillanas (rama design/sevillian-tile-ui)
- Rediseño: bandas indigo y albero.
- Titulares condensados, planes en filas.

### Decisión Final (29 de Septiembre de 2026)

**Versión HÍBRIDA "módulos sobre el agua"** (rama design/hybrid).

- Agua cáustica en todo el fondo.
- Nav de cristal flotante con reflejo que sigue al ratón (de v1).
- Estructura, tipografía y patrones de baldosa (de v3).
- Cristal solo en lo que flota: nav, selector de plan, plan recomendado.

### Principios de Diseño
- Sin referencias regionales (Sevilla, Andalucía).
- Sin motivos regionales.
- Patrones geométricos abstractos: cuartos de círculo, rombos.
- Tokens con nombres neutros: Indigo, Sand, Brick.
- Formas rectas en baldosas y botones.
- Cristal: radio 16 px.
- Nunca cápsulas.
- Rechaza cualquier look "IA genérica": sin negro+neón, crema+terracota, degradados morados, bento, tres tarjetas de precio con badge, píldora eyebrow, iconos en cuadrados redondeados, mismo fade-in en todo.

## Precios (con IVA incluido, PVP)

### Anual equivalente a 10 mensualidades

Precios de estudiante sobre OVH So you Start SYS-1 32 GB (decisión 29/09/2026).

- **Publish**: gratis con subdominio `.alumhost.dev` (decisión 30/09/2026, puerta de entrada). Dominio propio: 1,50 €/mes o 15 €/año (`addons.customDomain`). Límites y política de inactividad (confirmación anual; sin confirmar en 30 días y sin cambios en 12 meses → suspensión y borrado a los 60 días; ~100 MB) van en los Términos. La parte técnica (Caddy + despliegue) debe existir antes del lanzamiento.
- **Mini 512 MB**: 25 €/año o 2,50 €/mes.
- **Developer 1 vCPU 1 GB ~15 GB**: 40 €/año o 4 €/mes.
- **Pro 2 GB**: 60 €/año o 6 €/mes (4 GB solo con un servidor mayor; vCPU y disco sin definir hasta benchmarks).

### Add-ons
- **Backup Developer**: +1 €/mes (7 días).
- **Backup Pro**: +2 €/mes (14 días).
- **IPv4 dedicada (solo Pro)**: +3 €/mes (IP adicional de OVH, 1,50 €/mes sin IVA).

### Estrategia de precios
- Redondos a propósito (no .99).
- Reciente evidencia (meta-análisis Troll 2024; experimentos 2026) indica efecto casi nulo de terminación .99.
- Encaja con marca "sin letra pequeña".
- Descuento universitario: descartado (29/09/2026). El precio ya es de estudiante; anual = 2 meses gratis agota el margen del Developer.

### Beta pública en /beta (decisión 30/09/2026)
- /beta es pública (no oculta). Todo "Reservar plaza" (menú, portada, planes) lleva a /beta vía `primaryCta()`; `?plan=` preselecciona el plan.
- Enlaces cortos de los QR en `public/_redirects`: /t (tarjeta), /c (cartel), /w (whatsapp). El formulario añade "Origen: <utm_source>" al mensaje.
- Ventajas del beta tester: precio congelado el primer año, **backup diario incluido el primer año en los VPS** (decidido por Blas), ayuda con el primer despliegue y con el dominio del GitHub Student Pack, trato directo.
- Se arranca cuando haya "un mínimo" de personas apuntadas: **nunca publicar la cifra**. Sin fechas. "Beta tester", nunca "fundador".
- El formulario de /beta no pregunta por precio.

## Reglas de Contenido

- No prometer SLA (mejor esfuerzo).
- Puerto 25 cerrado.
- Puertos 465/587 cerrados por defecto, abiertos a petición.
- Sin IPv6 propia en MVP (solo IPv4 compartida por reverse proxy).
- No publicar "probamos a restaurar" hasta haberlo hecho.
- Emails: hola@, soporte@, abuse@, privacidad@ alumhost.dev.
- Respuesta abuse@ en el mismo día en Hetzner.
- Política de privacidad mínima enlazada al formulario (borrador, revisar por tercero).

## Pendiente Antes de Producción

- Email Routing de Cloudflare y binding send_email.
- Sitekey real de Turnstile y `wrangler secret put TURNSTILE_SECRET`.
- ToS, privacidad y DPA revisados.
- Forma jurídica (cita en el PAE; opción autónomo con cuota cero andaluza).
- Stripe Checkout: solo con webhook firmado, idempotencia, precio resuelto en servidor desde plans.ts.
- Página de estado.
- og:image.

## Proceso de Trabajo

### Blas
- Prefiere documentación en el repo (CLAUDE.md, DESIGN.md) para contexto.
- Revisa plugins/skills especializados antes de construir.
- Revisa capturas.
- Habla español.

### Limitación Conocida
- Claude en la nube puede leer el repo pero no hacer push hasta que admin instale GitHub App en la organización.
