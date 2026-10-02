/**
 * Textos de los correos automáticos, en español e inglés. Texto plano: llega mejor que el HTML y se lee en cualquier cliente.
 * Reglas: nada de guiones largos, ningún dato que no sea verdad (plazos, SLA) y, en los correos que puede provocar
 * cualquiera (acuse del formulario), ningún texto escrito por el usuario: así nadie los usa para mandar spam a terceros.
 * IA: si cambias un plazo aquí, cambia también LIFECYCLE en worker/publish-lifecycle.ts y los Términos (src/i18n).
 */
import type { Mail } from "./mail";
import { LIMITS } from "./publish-rules";

export type Lang = "es" | "en";

const SIGN = {
  es: "Un saludo,\nEl equipo de AlumHost\nhttps://alumhost.dev",
  en: "Best,\nThe AlumHost team\nhttps://alumhost.dev",
};
const mb = (b: number) => Math.round(b / 1024 / 1024);
const body = (lang: Lang, ...parts: string[]) => [...parts, SIGN[lang]].join("\n\n");

// ---------------------------------------------------------------- formulario de contacto

export type ContactReason = "beta" | "plans" | "business" | "custom" | "support" | "other";

const CONTACT_NEXT: Record<Lang, Record<ContactReason, string>> = {
  es: {
    beta: "Te hemos apuntado a la beta. Cuando abramos plazas te escribimos a este correo con los pasos para empezar.",
    plans: "Te contestamos personalmente con lo que nos preguntas sobre los planes.",
    business: "Te escribimos para conocer lo que necesitáis y, si encaja, proponeros una llamada.",
    custom: "Lo revisamos y te contestamos con una propuesta a medida.",
    support: "Lo revisamos y te contestamos con la solución o con lo que necesitemos saber.",
    other: "Te contestamos personalmente lo antes posible.",
  },
  en: {
    beta: "You are on the beta list. When we open spots we will email you here with the steps to get started.",
    plans: "We will reply personally with what you asked about the plans.",
    business: "We will write to learn what you need and, if it fits, suggest a call.",
    custom: "We will review it and reply with a tailored proposal.",
    support: "We will look into it and reply with the fix or with what we need to know.",
    other: "We will reply personally as soon as we can.",
  },
};

export function contactAck(lang: Lang, reason: ContactReason): Mail {
  return lang === "es"
    ? {
        subject: "Hemos recibido tu mensaje",
        text: body(lang, "Hola:", `Gracias por escribirnos. ${CONTACT_NEXT.es[reason]}`,
          "Si quieres añadir algo, responde a este correo."),
      }
    : {
        subject: "We got your message",
        text: body(lang, "Hi,", `Thanks for writing to us. ${CONTACT_NEXT.en[reason]}`,
          "If you want to add anything, just reply to this email."),
      };
}

// ---------------------------------------------------------------- Publish

export function magicLink(lang: Lang, name: string, link: string): Mail {
  return lang === "es"
    ? {
        subject: `Tu enlace para publicar ${name}.alumhost.dev`,
        text: body(lang, "Hola:", `Para subir o actualizar tu web ${name}.alumhost.dev, abre este enlace (vale ${LIMITS.tokenHours} horas):`,
          link, "Si no lo has pedido tú, ignora este correo."),
      }
    : {
        subject: `Your link to publish ${name}.alumhost.dev`,
        text: body(lang, "Hi,", `To upload or update your site ${name}.alumhost.dev, open this link (valid for ${LIMITS.tokenHours} hours):`,
          link, "If you did not ask for it, ignore this email."),
      };
}

export function published(lang: Lang, name: string, requestPage: string): Mail {
  const url = `https://${name}.alumhost.dev`;
  return lang === "es"
    ? {
        subject: `Tu web ya está publicada: ${name}.alumhost.dev`,
        text: body(lang, "Hola:", `Tu web ya está en ${url}`,
          `Para actualizarla, pide un enlace nuevo en ${requestPage} con el mismo nombre y correo, y vuelve a publicar. Cada publicación sustituye a la anterior entera.`,
          `Límites: ${LIMITS.maxFiles} archivos, ${mb(LIMITS.maxFileBytes)} MB por archivo y ${mb(LIMITS.maxSiteBytes)} MB en total.`,
          "Una vez al año te escribiremos para confirmar que sigues usándola. Si terminas la carrera y tu correo de la universidad va a dejar de funcionar, responde a este correo con otro y lo cambiamos.",
          "Si tienes cualquier duda, responde a este correo."),
      }
    : {
        subject: `Your site is live: ${name}.alumhost.dev`,
        text: body(lang, "Hi,", `Your site is now at ${url}`,
          `To update it, request a new link at ${requestPage} with the same name and email, and publish again. Each publish replaces the previous one entirely.`,
          `Limits: ${LIMITS.maxFiles} files, ${mb(LIMITS.maxFileBytes)} MB per file and ${mb(LIMITS.maxSiteBytes)} MB in total.`,
          "Once a year we will email you to confirm you still use it. If you graduate and your university email is going to stop working, reply to this email with another address and we will change it.",
          "If you have any questions, just reply to this email."),
      };
}

/** Primer aviso anual (día 0 de 30). */
export function annualNotice(lang: Lang, name: string, link: string, days: number): Mail {
  return lang === "es"
    ? {
        subject: `¿Sigues usando ${name}.alumhost.dev?`,
        text: body(lang, "Hola:", `Hace un año que no tenemos noticias de tu web ${name}.alumhost.dev. Para mantenerla publicada, confírmalo con este enlace:`,
          link, `Si no la confirmas ni la actualizas en ${days} días, la suspenderemos, como dicen los Términos de Publish.`),
      }
    : {
        subject: `Are you still using ${name}.alumhost.dev?`,
        text: body(lang, "Hi,", `We have not heard from your site ${name}.alumhost.dev in a year. To keep it online, confirm with this link:`,
          link, `If you do not confirm or update it within ${days} days, we will suspend it, as the Publish Terms say.`),
      };
}

/** Recordatorios del aviso anual. */
export function annualReminder(lang: Lang, name: string, link: string, daysLeft: number): Mail {
  return lang === "es"
    ? {
        subject: `Recordatorio: confirma ${name}.alumhost.dev (quedan ${daysLeft} días)`,
        text: body(lang, "Hola:", `Todavía no has confirmado que sigues usando ${name}.alumhost.dev. Si quieres mantenerla, abre este enlace:`,
          link, `Si no, en ${daysLeft} días la suspenderemos. No tienes que hacer nada más.`),
      }
    : {
        subject: `Reminder: confirm ${name}.alumhost.dev (${daysLeft} days left)`,
        text: body(lang, "Hi,", `You have not confirmed that you still use ${name}.alumhost.dev yet. To keep it, open this link:`,
          link, `Otherwise we will suspend it in ${daysLeft} days. You do not need to do anything else.`),
      };
}

/** Sitio suspendido por inactividad (deja de servirse; se borra pasados `days` días). */
export function inactive(lang: Lang, name: string, link: string, days: number): Mail {
  return lang === "es"
    ? {
        subject: `Hemos suspendido ${name}.alumhost.dev`,
        text: body(lang, "Hola:", `Como no hemos tenido noticias tuyas, ${name}.alumhost.dev ya no se muestra. Sus archivos siguen guardados.`,
          "Para recuperarla tal como estaba, abre este enlace:", link,
          `Si no, dentro de ${days} días la borraremos con todos sus archivos y el nombre quedará libre.`),
      }
    : {
        subject: `We have suspended ${name}.alumhost.dev`,
        text: body(lang, "Hi,", `Since we have not heard from you, ${name}.alumhost.dev is no longer online. Its files are still stored.`,
          "To bring it back as it was, open this link:", link,
          `Otherwise, in ${days} days we will delete it with all its files and the name will be free again.`),
      };
}

/** Último aviso antes de borrar un sitio suspendido. */
export function deleteSoon(lang: Lang, name: string, link: string, daysLeft: number): Mail {
  return lang === "es"
    ? {
        subject: `${name}.alumhost.dev se borrará en ${daysLeft} días`,
        text: body(lang, "Hola:", `Es el último aviso: en ${daysLeft} días borraremos ${name}.alumhost.dev con todos sus archivos.`,
          "Si quieres conservarla, abre este enlace y volverá a publicarse:", link),
      }
    : {
        subject: `${name}.alumhost.dev will be deleted in ${daysLeft} days`,
        text: body(lang, "Hi,", `This is the last notice: in ${daysLeft} days we will delete ${name}.alumhost.dev with all its files.`,
          "If you want to keep it, open this link and it will go back online:", link),
      };
}

export function deleted(lang: Lang, name: string, requestPage: string): Mail {
  return lang === "es"
    ? {
        subject: `Hemos borrado ${name}.alumhost.dev`,
        text: body(lang, "Hola:", `Hemos borrado ${name}.alumhost.dev y todos sus archivos por inactividad. El nombre ha quedado libre.`,
          `Si quieres volver a publicar una web, puedes hacerlo cuando quieras en ${requestPage}`),
      }
    : {
        subject: `We have deleted ${name}.alumhost.dev`,
        text: body(lang, "Hi,", `We have deleted ${name}.alumhost.dev and all its files because it was inactive. The name is free again.`,
          `If you want to publish a site again, you can do it any time at ${requestPage}`),
      };
}

/** Antes de fin de curso: el correo de la universidad caduca al terminar la carrera. */
export function graduation(lang: Lang, name: string): Mail {
  return lang === "es"
    ? {
        subject: `¿Terminas la carrera? No pierdas ${name}.alumhost.dev`,
        text: body(lang, "Hola:", `Tu web ${name}.alumhost.dev está asociada a tu correo de la universidad, y ese correo deja de funcionar cuando terminas la carrera. Sin él no podrías actualizarla ni confirmar que sigues usándola.`,
          "Si terminas este curso, responde a este correo desde tu cuenta de la universidad con la dirección que quieras usar a partir de ahora y la cambiamos.",
          "Si sigues estudiando, no tienes que hacer nada."),
      }
    : {
        subject: `Graduating? Do not lose ${name}.alumhost.dev`,
        text: body(lang, "Hi,", `Your site ${name}.alumhost.dev is tied to your university email, and that address stops working when you graduate. Without it you could not update the site or confirm you still use it.`,
          "If you graduate this year, reply to this email from your university account with the address you want to use from now on and we will change it.",
          "If you are still studying, you do not need to do anything."),
      };
}
