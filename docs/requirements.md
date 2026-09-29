# Requisitos de la web

Resumen de los documentos de Blas y Alonso: "Plan Final" de negocio, revisión del plan y threat model.
Si algo de aquí cambia en el plan, se actualiza aquí primero y luego en `src/config/*`.

## Producto (plan §1.1, precios base sin IVA, provisionales hasta el Sprint 0)
| Tier | Anual | Mensual | Specs | Backup |
|---|---|---|---|---|
| Publish (web estática) | 18 € | 2,50 € | Deploy con git push, SSL automático, subdominio o dominio propio, sin SSH | El repo es el backup |
| VPS Developer | 40 € | 4,50 € (*) | 1 vCPU, 1 GB RAM, ~15 GB NVMe, SSH con clave, IPv6 + IPv4 compartida (80/443) | +1 €/mes, 7 días |
| VPS Pro | 80 € (*) | 9 € (*) | Recursos escalados (ej. 4 GB RAM) | +2 €/mes, 14 días |
Add-on: IPv4 dedicada +2 €/mes (TCP arbitrario, aislamiento de reputación).
(*) Cifras elegidas por la web siguiendo la regla del plan ("mensual algo más caro que el anual"; Pro en 6-10 €/mes). A confirmar.
IVA 21 % mostrado siempre incluido. Facturación anual por defecto (§1.2).

## Fase y conversión
- Beta privada (§8): 3-5 estudiantes, gratis o simbólico. CTA = "Reservar plaza" → formulario de contacto con motivo "beta".
- Siguiente paso (§9.4): depósito de 5 € vía Stripe, descontable del primer pago → `salesMode: "deposit"`.
- Después: checkout real → `salesMode: "checkout"`.

## Diferenciación (§11), lo que la web debe contar
- Soporte humano en español; onboarding 1:1 en la primera contratación.
- Pensado para TFG/TFM, prácticas y hackathons. Sin tarjeta internacional ni facturación en dólares.
- Descuento con correo universitario (importe sin definir: no se muestra una cifra).
- Transparencia: página de estado pública, devlog y scripts en abierto (URLs pendientes → `site.ts`).

## Honestidad obligatoria (§1.4, §3, §5)
- Servicio de mejor esfuerzo, sin SLA contractual.
- Puerto 25 saliente bloqueado. Prohibido minería, escaneo masivo y phishing.
- Sin backup contratado, la pérdida del VPS es responsabilidad del cliente.
- Abuso: `abuse@` con respuesta en 24-48 h laborables.

## Seguridad que aplica a la web (threat model)
- Formulario con Cloudflare Turnstile verificado en servidor; validación y límites de longitud en servidor.
- HTTPS + HSTS + CSP + cabeceras de seguridad (`public/_headers`).
- Ningún secreto en el repo (Turnstile secret en `wrangler secret`).
- Futuro checkout: precio y tier resueltos en servidor, nunca desde el cliente. Stripe Checkout alojado.

## Pendiente antes de cobrar (no bloquea la web de beta)
ToS, Política de Privacidad (RGPD) + DPA, proceso de abuso publicado. El footer tiene el hueco comentado.

## Fuera de alcance de este repo
Panel de cliente, aprovisionamiento (Queue, Proxmox), Stripe, página de estado.
