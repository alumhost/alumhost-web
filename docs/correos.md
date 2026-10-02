# Correos automáticos

Todo correo a clientes sale por la API de Brevo (`worker/mail.ts`, 300 al día en el plan gratuito) desde `MAIL_FROM`
con respuesta a `MAIL_REPLY_TO` (`wrangler.jsonc`). Los textos, en español e inglés, están en `worker/mail-templates.ts`.
El aviso interno del formulario sigue saliendo por Email Routing (`send_email`), que solo entrega a direcciones verificadas.

| Correo | Cuándo | Etiqueta en Brevo | Código |
|---|---|---|---|
| Aviso al equipo del formulario | Al enviar el formulario | (Email Routing) | `worker/index.ts` → `deliver` |
| Acuse al usuario del formulario | Justo después, como mucho uno al día por correo | `contact-<motivo>` | `worker/index.ts` → `acknowledge` |
| Enlace mágico de Publish | Al pedir enlace | `publish-link` | `worker/publish.ts` → `request` |
| Tu web ya está publicada | Primera publicación de un sitio | `publish-live` | `worker/publish.ts` → `finish` |
| Aviso anual | Un año sin confirmar ni actualizar | `publish-annual` | `worker/publish-lifecycle.ts` |
| Recordatorios | Días 15 y 25 del aviso | `publish-reminder` | idem |
| Web suspendida | Día 30 sin noticias | `publish-inactive` | idem |
| Último aviso | 7 días antes del borrado | `publish-delete-soon` | idem |
| Web borrada | 60 días después de suspenderla | `publish-deleted` | idem |
| Graduación | En mayo, una vez al año por sitio | `publish-graduation` | idem |

Los correos programados los lanza el Cron Trigger del Worker cada día a las 8:00 UTC. Confirmar con el enlace del correo,
abrir un enlace mágico o publicar saca al sitio del ciclo anual en cualquier momento. Plazos en `LIFECYCLE`
(`worker/publish-lifecycle.ts`): si cambian, hay que cambiar también los Términos (`src/i18n`, "Inactividad").

El acuse del formulario no lleva nada de lo que escribió el usuario (ni su nombre): así nadie puede usar el formulario
para mandar texto a terceros desde nuestro dominio.

## Desplegar

El despliegue automático de `main` (`scripts/autodeploy/`) aplica la migración `0003_correos.sql` (solo añade) y
después despliega, así que no hay que hacer nada a mano. Si se despliega a mano, el orden es: primero la migración y
después el Worker (el código nuevo usa las columnas nuevas).

```bash
npx wrangler d1 migrations apply alumhost-publish --remote
npx wrangler secret put BREVO_API_KEY      # solo si no estaba
npm run deploy
```

`wrangler secret put` publica una versión nueva del Worker al momento, así que puede ir antes o después del deploy.

## Cambiar el correo de un sitio (graduación)

Cuando un estudiante responde al correo de graduación desde su cuenta de la universidad con su correo nuevo:

```bash
npx wrangler d1 execute alumhost-publish --remote --command \
  "UPDATE sites SET email = 'nuevo@gmail.com' WHERE name = 'su-web' AND email = 'viejo@alum.us.es'; DELETE FROM tokens WHERE name = 'su-web'; DELETE FROM confirms WHERE name = 'su-web';"
```

Desde entonces puede pedir enlaces con el correo nuevo aunque no sea de una universidad de la lista (solo para su sitio).

## Si un correo no llega

1. Brevo → Transactional → Logs, filtrando por la etiqueta de la tabla: Delivered, Deferred, Soft/Hard bounce o Blocked.
2. `npx wrangler tail` y buscar `[mail]`: "aceptado por Brevo" lleva el `messageId` para buscarlo en los Logs;
   "Brevo respondió" lleva el error (clave mal puesta, cuenta sin activar, IP no autorizada).
3. Correos de la universidad (Microsoft 365): mirar la cuarentena de Outlook, no solo el spam.
4. DNS: SPF de Brevo, DKIM (`brevo1`/`brevo2._domainkey`, DNS only) y DMARC (`_dmarc`) publicados.

## Probar en local

Con `ALLOW_LOG_ONLY=1` en `.dev.vars` y sin `BREVO_API_KEY`, los correos se imprimen en la consola de `npm run preview`.
Para lanzar el cron a mano: `npx wrangler dev --test-scheduled` y abrir `http://localhost:8787/__scheduled`.
Las pruebas de extremo a extremo (`scripts/tests/`) cubren el acuse, "publicada", el ciclo anual entero y la graduación.
