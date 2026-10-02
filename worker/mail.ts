/**
 * Correo a clientes: todo sale por la API de Brevo (300 al día en el plan gratuito).
 * El aviso interno del formulario sigue yendo por Email Routing (send_email), que solo entrega a direcciones verificadas.
 * Los textos están en worker/mail-templates.ts.
 */

export interface MailEnv {
  BREVO_API_KEY?: string; // wrangler secret put BREVO_API_KEY
  MAIL_FROM?: string; // remitente en alumhost.dev (dominio verificado en Brevo)
  MAIL_REPLY_TO?: string; // a dónde van las respuestas del cliente
  ALLOW_LOG_ONLY?: string; // "1" solo en local: no envía, registra en consola
}

export interface Mail { subject: string; text: string }

/**
 * Envía un correo de texto plano. `tag` aparece en Brevo → Transactional → Logs para filtrar por tipo de correo.
 * Devuelve false si no se pudo entregar a Brevo (nunca lanza).
 */
export async function sendMail(env: MailEnv, to: string, mail: Mail, tag: string): Promise<boolean> {
  if (!env.BREVO_API_KEY) {
    if (env.ALLOW_LOG_ONLY === "1") {
      console.log(`[mail] (solo log) ${tag} → ${to}\n${mail.subject}\n\n${mail.text}`);
      return true;
    }
    console.error("[mail] BREVO_API_KEY no configurado");
    return false;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "AlumHost", email: env.MAIL_FROM ?? "hola@alumhost.dev" },
        replyTo: { email: env.MAIL_REPLY_TO ?? "soporte@alumhost.dev" },
        to: [{ email: to }],
        subject: mail.subject,
        textContent: mail.text,
        tags: [tag],
      }),
    });
    if (!res.ok) {
      console.error("[mail] Brevo respondió", tag, res.status, (await res.text()).slice(0, 300));
      return false;
    }
    // Solo el dominio del destinatario: basta para cruzarlo con los Logs de Brevo por messageId.
    const { messageId } = (await res.json().catch(() => ({}))) as { messageId?: string };
    console.log("[mail] aceptado por Brevo", tag, to.split("@")[1], messageId ?? "");
    return true;
  } catch (err) {
    console.error("[mail] Brevo no disponible", tag, err);
    return false;
  }
}
