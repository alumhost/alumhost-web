# Ruta a producción de AlumHost

Actualizado 29 de septiembre de 2026. Responsables: Alonso (infraestructura, legal, correo), Blas (web y despliegue), Claude (código y borradores). **Bloquea** = impide avanzar a otras fases. Las fases se solapan: se ordenan por dependencia, no por calendario.

## Lo siguiente

- Subir design/hybrid al repo de la org (instalar la app de Claude o aplicar el parche).
- Pedir cita en el PAE con las preguntas de la fase Legal.
- Desplegar la preview con wrangler y probar el formulario con Turnstile real.
- Cerrar el correo: reenvío al colega, DMARC y Enviar como.
- Que Claude redacte los borradores de Términos, AUP, DPA y Privacidad final.
- Confirmar precios y qué planes salen el día 1.

## 1. Decisiones que bloquean

Nada de lo demás se puede cerrar sin esto. Casi todo se decide en una conversación de una hora.

- [ ] **Alonso + Blas · BLOQUEA.** Confirmar precios finales de la web: Publish 2 €/mes o 18 €/año, Mini 3 € o 30 €, Developer 5 € o 50 €, Pro 8 € o 80 €, IPv4 dedicada 4,50 €/mes. _El doc de Alonso aún los lista como pendientes (Developer 4,50 € y Pro 9 €). La web usa 5 € y 8 €. Todo con IVA incluido._
- [ ] **Alonso + Blas.** Decidir qué se vende el día 1: solo Publish + Developer, o los cuatro planes. _Mini y Pro tienen vCPU y disco sin definir. Vender solo lo que ya se ha medido reduce riesgo._
- [ ] **Alonso · BLOQUEA.** Fijar vCPU, disco y IOPS de Mini y Pro (y de los demás) con los benchmarks en Hetzner. _La web muestra 'a definir' en Pro. Se cierra después de la fase de Hetzner._
- [ ] **Alonso + Blas · BLOQUEA.** Elegir forma jurídica: autónomo con cuota cero andaluza, asociación (mínimo 3 fundadores) o SL. _Recomendación del doc: autónomo (solo quien factura) y pasar a SL con más ingresos o riesgo. Confirmar en el PAE qué pasa siendo dos socios._
- [ ] **Alonso + Blas · BLOQUEA.** Decidir quién factura y abre la cuenta de Stripe y la cuenta bancaria del negocio. _Stripe pide identidad y datos legales de una persona o entidad concreta._
- [ ] **Alonso + Blas · BLOQUEA.** Confirmar en el PAE si cobrar la reserva de 5 € ya es actividad facturable. _Bloquea el modo 'deposit' de la web y la beta de pago._
- [ ] **Alonso + Blas.** Decidir a qué países se vende al abrir: solo España, o toda la UE. _Vender a consumidores de otros países UE implica IVA del país de destino (ventanilla única OSS). Solo España al principio simplifica mucho._
- [ ] **Alonso + Blas.** Cerrar la cifra y la verificación del descuento de estudiante. _La web no promete ningún porcentaje. Verificación por correo universitario._
- [ ] **Alonso + Blas.** Cerrar el ciclo de impago: días de gracia (3 a 7) → snapshot → borrado. _Se usa en Stripe (reintentos), backend, ToS y correos automáticos._
- [ ] **Alonso + Blas.** Cerrar política de cancelación y reembolso, incluido el desistimiento de 14 días de consumidores UE. _Un servicio digital que arranca al instante requiere consentimiento expreso y renuncia informada. Lo redacta Claude, lo valida el PAE._
- [ ] **Alonso + Blas.** Confirmar política de puertos 465/587: cerrados por defecto y abiertos a petición en Developer y Pro. _La web ya lo dice así._
- [ ] **Alonso + Blas.** Confirmar que el MVP sale sin IPv6. _La web ya dice 'todavía no'._
- [ ] **Alonso + Blas.** Definir el soporte de fase 1: canal, horario y tiempo de respuesta que se promete. _Sin SLA. Hay que decidir qué sí se promete._
- [ ] **Alonso + Blas.** Decidir qué hacer con las ramas antiguas (originalConcept, antislop-ui, sevillian-tile-ui): conservar o archivar. _No se borra nada sin decidirlo._

## 2. Cerrar la web

Contenido y código listos para producción. Puede ir en paralelo con Legal y Cloudflare.

- [ ] **Alonso + Blas · BLOQUEA.** Subir la rama design/hybrid al repo de la organización. _Un owner de la org instala la app de Claude para GitHub (github.com/apps/claude) o se aplica el parche: git checkout -b design/hybrid origin/design/sevillian-tile-ui, git am design-hybrid.patch, git push -u origin design/hybrid._
- [ ] **Alonso + Blas.** Revisar el diseño juntos (móvil y escritorio, claro y oscuro) y anotar cambios. _Preguntas abiertas: ondas reactivas al puntero, tema forzado, más cristal._
- [ ] **Claude.** Aplicar los cambios de la revisión y pasar build, astro check, preflight y contraste.
- [ ] **Blas.** Abrir PR de design/hybrid a main, revisar y hacer merge. _Con protección de rama activada (ver Cloudflare y GitHub)._
- [ ] **Claude.** Actualizar comentarios de site.ts que dicen que el correo está por activar (ya está activo). _Solo comentarios._
- [ ] **Claude.** Completar plans.ts con vCPU y disco de Mini y Pro cuando se decidan, y mostrarlos en la web. _Depende de las decisiones y de los benchmarks._
- [ ] **Claude.** Escribir las páginas nuevas en ES y EN: Términos, Política de abuso (AUP), Aviso legal (datos del prestador según la LSSI) y Desistimiento y reembolso. _Textos en i18n, rutas nuevas, enlaces en el pie. Sin guiones largos._
- [ ] **Claude.** Publicar el DPA como anexo enlazado desde los Términos. _Somos encargado de tratamiento cuando alojamos datos de clientes._
- [ ] **Claude.** Ampliar Privacidad: responsable legal con NIF y domicilio, Brevo, Stripe, Hetzner y plazos, cuando cada uno esté activo. _Ahora lista Cloudflare y Google. No hay cookies de analítica ni publicidad._
- [ ] **Claude.** Añadir /.well-known/security.txt con contacto de seguridad. _Fichero en public/._
- [ ] **Claude.** Crear og:image de 1200x630 y añadirla al Base. _Hay un TODO en Base.astro._
- [ ] **Claude.** Añadir robots.txt y sitemap. _El sitemap oficial de Astro es una dependencia nueva: se pregunta antes de añadirla._
- [ ] **Claude.** Enlazar página de estado, devlog y repo en site.links cuando existan. _El pie oculta los enlaces que son null._
- [ ] **Claude.** Volver a pasar axe (WCAG AA) y capturas a 390 y 1440 px en claro y oscuro, en todas las páginas, incluidas las nuevas.
- [ ] **Blas.** Probar la web en un móvil real (rendimiento del canvas del agua, contraste al sol, navegación con teclado). _Comprobar también prefers-reduced-motion y prefers-reduced-transparency._
- [ ] **Claude.** Pasar la revisión de seguridad previa al lanzamiento sobre el repo (skill de ship-check) y corregir lo bloqueante.

## 3. Cloudflare y GitHub

Lleva la web a alumhost.dev con formulario funcionando. Es lo primero que puede estar en producción de verdad.

- [ ] **Alonso + Blas.** Cloudflare: invitar al colega como Administrator con 2FA. _Pendiente según el doc._
- [ ] **Alonso + Blas.** GitHub org: exigir 2FA a todos los miembros y poner permisos base en Read. _Pendiente si no está hecho._
- [ ] **Blas.** GitHub: proteger main (PR obligatoria, checks de build, sin push directo). _Activar Dependabot para avisos de seguridad._
- [ ] **Blas.** npx wrangler login y primer wrangler deploy a la URL *.workers.dev. _Es la preview. El build tiene que estar hecho antes: npm run build._
- [ ] **Blas.** Probar en la preview: todas las páginas en ES y EN, 404, cabeceras de seguridad y consola sin errores de CSP. _public/_headers y la CSP de Astro._
- [ ] **Alonso + Blas.** Elegir despliegue automático: Workers Builds (app de Cloudflare instalada solo en este repo) o GitHub Actions con token de API. _Cualquiera de las dos exige que un owner de la org autorice la app o cree el secreto._
- [ ] **Blas.** Configurar el despliegue automático: build npm run build, deploy wrangler deploy, en cada merge a main. _Los secretos nunca en el repo._
- [ ] **Blas · BLOQUEA.** Turnstile: crear el widget real para alumhost.dev, poner la sitekey en site.ts y quitar la de prueba. _La sitekey de prueba siempre pasa: no debe llegar a producción._
- [ ] **Blas · BLOQUEA.** npx wrangler secret put TURNSTILE_SECRET. _El secreto va por wrangler o .dev.vars, nunca en git._
- [ ] **Blas.** Añadir el Custom Domain alumhost.dev al Worker y redirigir www al dominio raíz. _No hace falta poner registros A de GitHub._
- [ ] **Blas.** SSL/TLS en Full (strict), Always Use HTTPS, TLS mínimo 1.2 y comprobar HSTS. _HSTS ya está en _headers._
- [ ] **Alonso + Blas.** Activar DNSSEC en Cloudflare y pegar el registro DS en Name.com. _Se hace en los dos paneles._
- [ ] **Alonso.** Añadir registro CAA para limitar quién puede emitir certificados. _Permitir Let's Encrypt (para *.alumhost.dev) y los de Cloudflare._
- [ ] **Blas · BLOQUEA.** Activar send_email en wrangler.jsonc con CONTACT_FROM web@alumhost.dev y CONTACT_TO válido. _Comprobar en la documentación de Cloudflare si el destino debe ser una dirección verificada en Email Routing. Si hola@ no lo admite, usar un destino verificado o enviar por la API de Brevo._
- [ ] **Alonso + Blas.** Probar el formulario en producción de extremo a extremo: envío real, llega a hola@ y a las dos personas, Turnstile fallido, límite de 5 por minuto, campo trampa y mensaje demasiado largo.
- [ ] **Blas.** Añadir reglas básicas en Cloudflare: WAF gestionado, Bot Fight Mode y límite de peticiones sobre /api/*. _El Worker ya limita 5 por minuto por IP._
- [ ] **Alonso + Blas.** Decidir si se activa Cloudflare Web Analytics (sin cookies). _Si sí, se menciona en Privacidad._
- [ ] **Blas.** Activar avisos de Cloudflare (errores del Worker, caducidad de certificados). _Los logs de Workers ya están activados._
- [ ] **Alonso.** Recordatorio en el calendario para renovar alumhost.dev a mano un mes antes del año. _Auto-renew de Name.com está desactivado. Coste aproximado 13,6 €/año._

## 4. Correo del dominio

Recibir y enviar como hola@ y soporte@ sin que el cliente vea el Gmail personal. Casi todo está montado.

- [ ] **Alonso · BLOQUEA.** Arreglar el reenvío al colega: mirar los logs en tiempo real del Worker reenvio-equipo y probar desde una tercera cuenta. _Plan B: filtro de Gmail to:(@alumhost.dev) que reenvíe al colega. Probar desde el Gmail del colega no sirve._
- [ ] **Alonso.** Crear el DMARC: registro TXT _dmarc con v=DMARC1; p=none; rua=mailto:postmaster@alumhost.dev. _Solo si Brevo no lo ha creado ya._
- [ ] **Alonso.** Comprobar que hay un único registro SPF y que incluye a Cloudflare y a Brevo. _Dos registros SPF hacen que ambos fallen._
- [ ] **Alonso + Blas.** Brevo: activar 2FA y crear una clave SMTP por persona (gmail-alonso, gmail-colega) guardada en el gestor de contraseñas. _No activar el bloqueo por IP: Gmail envía desde IPs variables de Google._
- [ ] **Alonso + Blas.** Gmail: configurar Enviar como hola@ y soporte@ (smtp-relay.brevo.com, puerto 587, TLS). _Sin marcar Tratar como alias. Activar Responder desde la misma dirección a la que se envió._
- [ ] **Claude.** Revisar las cabeceras de un correo de prueba: spf=pass, dkim=pass (alumhost.dev), dmarc=pass y ningún rastro del Gmail personal. _Alonso pega las cabeceras originales._
- [ ] **Alonso + Blas.** Probar hola@, soporte@, abuse@, privacidad@ y postmaster@: enviar a cada una y recibir en las dos personas.
- [ ] **Alonso.** Crear el subdominio notificaciones.alumhost.dev en Brevo con su DKIM y una clave propia para el correo automático de la plataforma. _Para bienvenida, avisos de impago y suspensión._
- [ ] **Claude.** Redactar las plantillas de correo automático en ES y EN: bienvenida con accesos, recibo, aviso de fallo de pago, suspensión, cancelación. _Sin prometer nada que no esté en los Términos._
- [ ] **Alonso.** Tras 2 o 3 semanas limpias, pasar DMARC a p=quarantine. _Mirar antes los informes rua._

## 5. Legal y fiscal

Bloquea abrir Stripe en producción y la primera factura. Claude escribe borradores; el PAE y un tercero los validan.

- [ ] **Claude · BLOQUEA.** Redactar los borradores de Términos, AUP, DPA, desistimiento y reembolso, y dejar la Privacidad final en ES y EN. _Best effort, sin SLA, suspensión inmediata por abuso, puerto 25 cerrado, backups solo si se contratan._
- [ ] **Alonso · BLOQUEA.** Pedir cita en el PAE (Universidad de Sevilla) y llevar borradores y preguntas. _Preguntas: forma jurídica siendo dos, epígrafe del IAE, reserva de 5 €, IVA a otros países UE, facturación electrónica obligatoria, cuota cero._
- [ ] **Alonso.** Escoger forma jurídica y anotar la decisión en docs/memoria-decisiones.md. _Bloquea el alta y Stripe._
- [ ] **Alonso + Blas · BLOQUEA.** Revisión de los Términos, la Privacidad y el DPA por un tercero (PAE o abogado). _Incluye el texto de desistimiento y el de la AUP._
- [ ] **Alonso.** Leer los términos de Hetzner sobre reventa y alojamiento de terceros y su proceso de abuso. _Un solo cliente con abuso puede bloquear todo el servidor._
- [ ] **Alonso.** Comprobar que la marca AlumHost no choca con otra registrada (OEPM, clases 35 y 42) y decidir si se registra.
- [ ] **Alonso.** Contratar o consultar una gestoría para el arranque (alta, IVA, facturas). _Una consulta puntual puede bastar._
- [ ] **Alonso.** Abrir cuenta bancaria del negocio (o decidir cuál se usa) para los pagos de Stripe.
- [ ] **Alonso · BLOQUEA.** Alta en Hacienda (modelo 036/037) con el epígrafe del IAE, y en la Seguridad Social (RETA) con tarifa plana. _Se hace justo antes de la primera factura real, no antes. Cuota aproximada 88,6 €/mes._
- [ ] **Alonso.** Solicitar la ayuda de cuota cero andaluza en los 3 meses siguientes a cumplir el año. _Se paga y luego se reembolsa. Poner recordatorio._
- [ ] **Alonso.** Certificado digital o Cl@ve para tramitar todo online.
- [ ] **Alonso + Blas.** Decidir cómo se factura: facturas de Stripe o sistema propio, numeración correlativa y datos obligatorios. Preguntar si aplica Verifactu y desde cuándo. _Confirmarlo con la gestoría, no asumirlo._
- [ ] **Alonso + Blas.** Fijar el IVA: 21 % España, y qué se hace con clientes de otros países o con NIF-IVA (empresas). _Depende de la decisión de países de venta._
- [ ] **Alonso.** Calendario fiscal: modelos 130 y 303 trimestrales, 390 y 100 anuales (y 349 si se factura a la UE). _Recordatorios con antelación._
- [ ] **Alonso + Blas.** Valorar seguro de responsabilidad civil profesional antes del lanzamiento público. _Más relevante si se alojan TFG y TFM de otros._
- [ ] **Claude.** Crear el registro interno de tratamientos, la lista de subencargados (Cloudflare, Stripe, Brevo, Google, Hetzner) y el procedimiento de derechos y de brecha (aviso a la AEPD en 72 h).
- [ ] **Alonso.** Revisión legal formal (RGPD y PCI-DSS) cuando haya tracción. _Con Stripe Checkout alojado no se tocan tarjetas._

## 6. Stripe

Se construye entero en modo de prueba sin necesidad de estar dado de alta. Para activar el modo real hace falta el alta y el banco.

- [ ] **Alonso + Blas.** Crear la cuenta de Stripe con un correo del proyecto y 2FA, en modo de prueba. _No activar todavía: pide identidad, IBAN y datos legales._
- [ ] **Alonso.** Configurar el perfil público: nombre AlumHost, descriptor del cargo, correo de soporte, logo y colores, país España y moneda EUR.
- [ ] **Alonso.** Configurar impuestos: precios con IVA incluido (tax_behavior inclusive) y decidir si se usa Stripe Tax. _Los precios de plans.ts ya son PVP con IVA._
- [ ] **Alonso.** Crear productos y precios en modo prueba: Publish, Mini, Developer, Pro (mensual y anual) y extras de backup e IPv4, con metadata plan_id igual al id de plans.ts. _El precio que se cobra sale de plans.ts en el Worker, no del navegador._
- [ ] **Alonso.** Elegir métodos de pago: tarjeta, Apple Pay y Google Pay, y valorar SEPA. _3D Secure activo. Revisar reglas básicas de Radar._
- [ ] **Alonso.** Configurar el portal de cliente: cancelar, cambiar método de pago y descargar facturas.
- [ ] **Alonso + Blas · BLOQUEA.** Aprobar antes de escribir código: tocar worker/index.ts para pagos y añadir (o no) la librería de stripe. _Reglas del repo: se pregunta antes de ambas cosas. Alternativa sin dependencia: llamadas fetch a la API._
- [ ] **Claude.** Crear POST /api/checkout: recibe plan y periodo, valida contra plans.ts, comprueba Turnstile y devuelve la URL de Stripe Checkout alojado. _Nunca fiarse del precio del cliente._
- [ ] **Claude.** Definir el depósito de reserva de 5 € y cómo se descuenta del primer mes. _Solo si el PAE lo permite._
- [ ] **Claude.** Crear las páginas de éxito y de cancelación en ES y EN. _Textos en i18n._
- [ ] **Claude.** Cambiar el salesMode de waitlist a deposit y luego a checkout, y quitar el aviso de build que hoy lo bloquea. _El botón principal cambia solo con primaryCta()._
- [ ] **Claude · BLOQUEA.** Crear POST /api/stripe/webhook: leer el cuerpo en bruto, verificar la firma con ventana de 5 min y responder 2xx rápido. _Bloqueante._
- [ ] **Claude · BLOQUEA.** Idempotencia por event.id con transacción: un pago produce un solo CREATE de VPS. _Sin esto, un reintento de Stripe puede crear dos VPS._
- [ ] **Claude.** Gestionar eventos: checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.updated y deleted, charge.dispute.created, charge.refunded.
- [ ] **Claude.** Suspender la VM automáticamente si un pago entra en disputa.
- [ ] **Blas.** Guardar STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET con wrangler secret (uno para prueba y otro para producción).
- [ ] **Claude.** Probar con Stripe CLI (stripe listen): tarjeta correcta, 3D Secure, rechazo, disputa, reembolso, evento duplicado y firma falsa.
- [ ] **Claude.** Activar reintentos inteligentes y los correos de fallo de pago según el ciclo de impago decidido.
- [ ] **Alonso · BLOQUEA.** Cuando esté el alta y el banco: activar la cuenta de Stripe, verificar identidad y añadir la cuenta bancaria. _Bloquea el paso a producción._
- [ ] **Alonso.** Recrear o copiar productos y precios en modo real y crear el webhook real apuntando a alumhost.dev.
- [ ] **Blas.** Poner las claves reales como secretos del Worker y desplegar.
- [ ] **Alonso + Blas.** Pago real de prueba de 1 € o del plan más barato, comprobar factura y recibo con los datos legales, reembolsarlo y ver el pago en el banco.
- [ ] **Alonso.** Activar avisos de Stripe: disputas, fallos de webhook, pagos fallidos y payout.

## 7. Plataforma y aprovisionamiento

Del pago al servidor entregado. Ruta prevista: Worker, luego Cola, luego API propia, luego Proxmox por Tunnel.

- [ ] **Alonso + Blas · BLOQUEA.** Confirmar la arquitectura: Worker, Cloudflare Queue, API en Spring Boot con PostgreSQL y Proxmox por Cloudflare Tunnel. _Decidir si D1 basta para el MVP y dónde vive PostgreSQL._
- [ ] **Alonso.** Crear la VM de servicio del backend detrás de OPNsense.
- [ ] **Alonso.** Instalar cloudflared en esa VM y proteger la API con un service token de Cloudflare Access. _La API nunca expuesta a Internet._
- [ ] **Claude.** Crear la cola y el consumidor que llama a la API con reintentos y una cola de mensajes fallidos.
- [ ] **Claude.** Diseñar el modelo de datos: clientes, pedidos, suscripciones, VPS, eventos y registro de auditoría.
- [ ] **Claude · BLOQUEA.** Programar la creación idempotente de VPS: un pago, un CREATE, en una sola transacción. _Bloqueante._
- [ ] **Alonso · BLOQUEA.** Crear el usuario de la API de Proxmox con rol limitado a un pool y token propio, nunca root. _La API de Proxmox solo en red interna._
- [ ] **Alonso + Blas.** Elegir cómo se crea la VM: llamar a los scripts create-vps y destroy-vps o a la API de Proxmox directamente.
- [ ] **Claude.** Asignar IP del rango 10.10.0.20 a .99, subdominio en *.alumhost.dev y entrada en Caddy.
- [ ] **Claude.** Pedir la clave SSH pública en el checkout, validarla e inyectarla con cloud-init.
- [ ] **Claude.** Comprobar la salud de la VM (SSH y red) antes de marcar el pedido como completado.
- [ ] **Claude.** Enviar el correo de bienvenida con accesos por Brevo.
- [ ] **Claude.** Suspender y reactivar VPS por impago, disputa o abuso, y borrar tras la gracia con snapshot previo.
- [ ] **Claude.** Límite de peticiones por IP y por método de pago, y Turnstile en el checkout.
- [ ] **Alonso + Blas.** Decidir el alcance del panel del cliente en el MVP: estado, IP o subdominio, renovación, reinicio y extra de backup. _El plan dice fase 1 sin soporte técnico: reinicio desde el panel._
- [ ] **Claude.** Construir el panel con acceso por enlace mágico por correo y enlace al portal de Stripe.
- [ ] **Claude.** Logs estructurados en otro servidor y alertas como 'VM sin pago válido'.
- [ ] **Alonso.** Guardar los secretos fuera de git (.env o gestor) y activar 2FA en cada servicio.
- [ ] **Claude.** Convertir el pentest en un test automático (test-vps) y añadir tests de la API.
- [ ] **Claude.** Publish: recibir webhook de GitHub con HMAC, encolar, construir en un worker sin privilegios, copiar con rsync a un volumen de solo lectura y servir con Caddy. _La web promete deploy con git push._
- [ ] **Alonso.** Plantilla n8n con credenciales aleatorias en el primer arranque y autenticación obligatoria.
- [ ] **Alonso.** Reconstruir las plantillas cada mes y escanearlas con Trivy.

## 8. Servidor en Hetzner

Producción real. Repetir el pentest antes de tocar ningún dato de cliente.

- [ ] **Alonso · BLOQUEA.** Consultar precios de Hetzner el día de contratar y decidir servidor: subasta i7 (~64 €) o AX42 (~97 € + 49 € de alta). _El doc apunta que la subasta queda corta de CPU con 45 VMs. Los precios han subido varias veces en 2026._
- [ ] **Alonso.** Contratar el servidor y una IP adicional con MAC virtual para la WAN de OPNsense.
- [ ] **Alonso.** Instalar con installimage en RAID1 o ZFS mirror y poner Proxmox encima.
- [ ] **Alonso.** Endurecer: solo claves SSH, Tailscale o WireGuard para gestión, cerrar 22 y 8006 a Internet en el firewall de Robot y de Proxmox, cluster.fw con policy_in en DROP, 2FA en Proxmox.
- [ ] **Alonso.** Crear vmbr0 con la NIC y vmbr1 aislado sin IPv6.
- [ ] **Alonso.** OPNsense: importar config.xml y cambiar solo la WAN.
- [ ] **Alonso · BLOQUEA.** Reactivar Block private y Block bogons en la WAN y añadir regla de salida que bloquee RFC1918, 100.64.0.0/10 y bogons. _Es lo que Hetzner usa para detectar escaneos._
- [ ] **Alonso.** Añadir límite de conexiones nuevas por cliente y, si se quiere, Suricata.
- [ ] **Alonso.** Ajustar el shaper a 1 Gbit según lo que midan los benchmarks y mantener DoT en Unbound.
- [ ] **Alonso.** Preparar una subred enrutada para las IPs dedicadas de Pro con 1:1 NAT. _Nunca un bridge con MAC del cliente._
- [ ] **Alonso.** Restaurar plantilla 9000, scripts y Caddy desde Git.
- [ ] **Alonso.** Crear la VM de Caddy con TLS wildcard para *.alumhost.dev (validación DNS con un token de Cloudflare solo para la zona), límite por dominio y port-forward de 80 y 443.
- [ ] **Alonso.** Comprobar que el puerto 25 sigue cerrado y que 465 y 587 solo se abren a petición.
- [ ] **Alonso · BLOQUEA.** Repetir el pentest completo en producción: LAN, Proxmox, OPNsense, cliente contra cliente, suplantación de IP y ARP, SMTP e IPv6. _Bloqueante antes de aceptar clientes._
- [ ] **Alonso.** Probar la cuarentena (quarantine-vps) y el temporizador audit-fw en producción. _Tiene que existir antes del primer cliente._
- [ ] **Alonso.** Monitorizar tráfico saliente anómalo y CPU sostenida con suspensión automática desde el primer día. _En Hetzner es fase 1: un cliente que escanee puede bloquear todo el servidor._
- [ ] **Alonso.** Montar InfluxDB y Grafana en la red de administración con alertas: espera de IO mayor del 15 %, steal mayor del 10 % y swap. Enviar las alertas al móvil.
- [ ] **Alonso.** Vigilar listas negras de la IPv4 compartida (Spamhaus, Safe Browsing).
- [ ] **Alonso.** Configurar backups: Proxmox Backup Server hacia Storage Box, copia externa fuera de Hetzner (Backblaze B2 u otro), y exportar config.xml de OPNsense de forma periódica. _La Storage Box está dentro de Hetzner, no cuenta como copia externa._
- [ ] **Alonso · BLOQUEA.** Escribir el runbook de recuperación y probar una restauración real en producción. _Hasta que se haga, no se publica 'probamos a restaurar'._
- [ ] **Alonso · BLOQUEA.** Ejecutar 14 días de benchmarks (stress-ng y fio) con la máquina vacía, fijar límites definitivos y recalcular precios. _Los precios de la web son provisionales hasta esto._
- [ ] **Alonso.** Crear la página de estado pública alojada fuera del servidor de Hetzner y enlazarla en site.links. _Decidir dónde vive._
- [ ] **Alonso.** Bajar el TTL del DNS 24 a 48 horas antes de cualquier cambio de dirección.
- [ ] **Alonso.** Mantener el homelab unos días como vuelta atrás (rollback). _Nunca alojar clientes reales en el homelab._

## 9. Contenido y captación

Puede ir en paralelo desde ya. Lo que enlaza a estado o devlog espera a que existan.

- [ ] **Alonso.** Publicar el repo del proyecto y abrir el devlog. _Ya hay repo público de la web._
- [ ] **Claude.** Escribir posts del devlog: objetivos y arquitectura, por qué aislar la red, pentest con hallazgos reales y cierre con números. _Hallazgos: anti-lockout de OPNsense, fe80:: en vmbr1, tráfico en capa 2 entre clientes, DNS interceptado._
- [ ] **Alonso.** Publicar los scripts con licencia permisiva.
- [ ] **Claude.** Escribir documentación para el cliente: cómo usar tu VPS y por qué está construido así.
- [ ] **Alonso + Blas.** Preparar guion de onboarding 1:1 (videollamada o en persona) para el primer cliente.
- [ ] **Blas.** Diseñar flyers con QR y UTM para facultades. _Los UTM se leen sin cookies._
- [ ] **Alonso + Blas.** Buscar y contactar asociaciones de informática y hackerspaces para charlas o talleres.
- [ ] **Alonso + Blas.** Participar en foros de homelab y comunidades universitarias antes de vender.
- [ ] **Alonso + Blas.** Reservar los nombres de AlumHost en redes que se vayan a usar. _Opcional._
- [ ] **Alonso + Blas.** Decidir cómo se guarda la lista de espera: hoja privada con acceso restringido. _Los datos del formulario se usan solo para responder._

## 10. Beta privada

3 a 5 personas, gratis o simbólica, en un VPS mensual o en el primer mes de Hetzner. No en el homelab.

- [ ] **Alonso + Blas.** Elegir 3 a 5 estudiantes para la beta. _Un candidato: asistente personal de IA con vault de Obsidian y API de LLM, plan Developer más backups (~6 a 7 €/mes)._
- [ ] **Claude.** Redactar condiciones de beta cortas en ES para que las acepten por escrito.
- [ ] **Alonso + Blas.** Hacer el onboarding 1:1 con cada persona y anotar fricciones.
- [ ] **Alonso + Blas.** Medir consumo real de cada VPS y compararlo con los umbrales de la monitorización.
- [ ] **Alonso.** Simular un caso de abuso y probar la cuarentena con un cliente real de la beta.
- [ ] **Alonso + Blas.** Probar un pago real de reserva de 5 € con alguien de la beta, si el PAE lo permite.
- [ ] **Alonso.** Restaurar un backup de un cliente beta en el entorno nuevo antes de mover más tráfico.
- [ ] **Alonso + Blas.** Recoger señales de pago (reservas) para decidir si se abre al público. _Condición de entrada del plan._
- [ ] **Claude.** Corregir lo que salga de la beta: web, checkout, textos y documentación.

## 11. Lanzamiento

Se abre al público solo cuando lo anterior esté hecho y marcado.

- [ ] **Alonso + Blas · BLOQUEA.** Comprobar las condiciones de entrada: reservas reales, capacidad medida y documentos legales publicados.
- [ ] **Claude · BLOQUEA.** Pasar la lista final de despliegue y la revisión de seguridad previa al lanzamiento. _Sin nada bloqueante abierto._
- [ ] **Alonso · BLOQUEA.** Dar el alta de autónomo justo antes de emitir la primera factura. _Ver fase Legal y fiscal._
- [ ] **Alonso · BLOQUEA.** Confirmar Stripe en producción con el pago real de prueba hecho.
- [ ] **Alonso + Blas.** Confirmar que Términos, Privacidad, AUP, DPA y Aviso legal están publicados y enlazados en la web.
- [ ] **Alonso.** Comprobar que la página de estado apunta a producción.
- [ ] **Claude.** Cambiar salesMode a checkout, compilar y comprobar el botón principal en ES y EN.
- [ ] **Blas.** Desplegar a producción y revisar la home, los planes y el pago completo desde un móvil.
- [ ] **Alonso + Blas.** Abrir plazas públicas con facturación anual o trimestral por defecto y la mensual más cara.
- [ ] **Alonso + Blas.** Seguir de cerca los primeros clientes reales, uno a uno, durante las primeras semanas.
- [ ] **Alonso + Blas.** Anunciar en los canales preparados (asociaciones, foros, flyers).

## 12. Operación continua

Lo que hay que repetir mientras el servicio esté abierto.

- [ ] **Alonso + Blas.** Revisar abuse@ y los avisos de Hetzner cada día.
- [ ] **Alonso.** Mantener Proxmox al día (parches de escape del hipervisor).
- [ ] **Alonso.** Reconstruir plantillas cada mes y pasar Trivy.
- [ ] **Alonso.** Probar una restauración cada trimestre y recordar a los clientes sin backup su riesgo.
- [ ] **Alonso.** Presentar los modelos 130 y 303 cada trimestre y los anuales.
- [ ] **Alonso.** Renovar alumhost.dev a mano cada año.
- [ ] **Alonso.** Revisar los precios de Hetzner y el margen cada vez que suban.
- [ ] **Alonso + Blas.** Rotar claves y secretos y comprobar que el 2FA sigue activo en Cloudflare, GitHub, Stripe, Brevo y Proxmox.
- [ ] **Alonso + Blas.** Evaluar la tracción tras unos meses (clientes, lectores del devlog, contactos) y decidir si se escala.
- [ ] **Alonso + Blas.** Cuando haya tracción: despliegue desde repositorio de GitHub con escaneo, vault de secretos y valorar un segundo servidor.
