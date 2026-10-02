/**
 * Textos de los correos automáticos, en español e inglés. Cada uno es un bloque (worker/mail-layout.ts) del que salen
 * la versión HTML con la marca y la de texto plano.
 * Reglas: nada de guiones largos, ningún dato que no sea verdad (plazos, SLA) y, en los correos que puede provocar
 * cualquiera (acuse del formulario), ningún texto escrito por el usuario: así nadie los usa para mandar spam a terceros.
 * IA: si cambias un plazo aquí, cambia también LIFECYCLE en worker/publish-lifecycle.ts y los Términos (src/i18n).
 */
import type { Mail } from "./mail";
import { compose, type Lang } from "./mail-layout";
import { LIMITS } from "./publish-rules";

export type { Lang };

const mb = (b: number) => Math.round(b / 1024 / 1024);
const site = (name: string) => `${name}.alumhost.dev`;
const REASON_PUBLISH = {
  es: (name: string) => `Recibes este correo porque ${site(name)} está publicada en AlumHost Publish.`,
  en: (name: string) => `You are receiving this email because ${site(name)} is published on AlumHost Publish.`,
};

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
    ? compose(lang, {
        subject: "Hemos recibido tu mensaje",
        preheader: CONTACT_NEXT.es[reason],
        title: "Hemos recibido tu mensaje",
        body: [`Gracias por escribirnos. ${CONTACT_NEXT.es[reason]}`, "Si quieres añadir algo, responde a este correo."],
        reason: "Recibes este correo porque has escrito en el formulario de alumhost.dev.",
      })
    : compose(lang, {
        subject: "We got your message",
        preheader: CONTACT_NEXT.en[reason],
        title: "We got your message",
        body: [`Thanks for writing to us. ${CONTACT_NEXT.en[reason]}`, "If you want to add anything, just reply to this email."],
        reason: "You are receiving this email because you used the form on alumhost.dev.",
      });
}

// ---------------------------------------------------------------- Publish

export function magicLink(lang: Lang, name: string, link: string): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `Tu enlace para publicar ${site(name)}`,
        preheader: `Vale ${LIMITS.tokenHours} horas.`,
        title: "Tu enlace para publicar",
        body: [`Para subir o actualizar tu web ${site(name)}, pulsa el botón. El enlace vale ${LIMITS.tokenHours} horas.`],
        button: { label: "Subir mi web", url: link },
        after: ["Si no lo has pedido tú, ignora este correo: sin el enlace nadie puede tocar la web."],
        reason: `Recibes este correo porque alguien ha pedido un enlace para ${site(name)} con esta dirección.`,
      })
    : compose(lang, {
        subject: `Your link to publish ${site(name)}`,
        preheader: `Valid for ${LIMITS.tokenHours} hours.`,
        title: "Your link to publish",
        body: [`To upload or update your site ${site(name)}, press the button. The link is valid for ${LIMITS.tokenHours} hours.`],
        button: { label: "Upload my site", url: link },
        after: ["If you did not ask for it, ignore this email: without the link nobody can touch the site."],
        reason: `You are receiving this email because someone asked for a link for ${site(name)} with this address.`,
      });
}

export function published(lang: Lang, name: string, requestPage: string): Mail {
  const url = `https://${site(name)}`;
  return lang === "es"
    ? compose(lang, {
        subject: `Tu web ya está publicada: ${site(name)}`,
        preheader: "Cómo actualizarla y qué límites tiene.",
        title: "Tu web ya está publicada",
        body: [`Ya puede verla cualquiera en ${site(name)}.`],
        button: { label: "Ver mi web", url },
        after: [
          `Para actualizarla, [pide un enlace nuevo](${requestPage}) con el mismo nombre y correo, y vuelve a publicar. Cada publicación sustituye a la anterior entera.`,
          `Límites: ${LIMITS.maxFiles} archivos, ${mb(LIMITS.maxFileBytes)} MB por archivo y ${mb(LIMITS.maxSiteBytes)} MB en total.`,
          "Una vez al año te escribiremos para confirmar que sigues usándola. Si terminas la carrera y tu correo de la universidad va a dejar de funcionar, responde a este correo con otro y lo cambiamos.",
        ],
        reason: REASON_PUBLISH.es(name),
      })
    : compose(lang, {
        subject: `Your site is live: ${site(name)}`,
        preheader: "How to update it and what its limits are.",
        title: "Your site is live",
        body: [`Anyone can now see it at ${site(name)}.`],
        button: { label: "View my site", url },
        after: [
          `To update it, [request a new link](${requestPage}) with the same name and email, and publish again. Each publish replaces the previous one entirely.`,
          `Limits: ${LIMITS.maxFiles} files, ${mb(LIMITS.maxFileBytes)} MB per file and ${mb(LIMITS.maxSiteBytes)} MB in total.`,
          "Once a year we will email you to confirm you still use it. If you graduate and your university email is going to stop working, reply to this email with another address and we will change it.",
        ],
        reason: REASON_PUBLISH.en(name),
      });
}

/** Primer aviso anual (día 0 de 30). */
export function annualNotice(lang: Lang, name: string, link: string, days: number): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `¿Sigues usando ${site(name)}?`,
        preheader: `Confírmalo en un clic para mantenerla publicada.`,
        title: "¿Sigues usando tu web?",
        body: [`Hace un año que no tenemos noticias de ${site(name)}. Para mantenerla publicada, confírmalo con el botón.`],
        button: { label: "Mantener mi web", url: link },
        after: [`Si no la confirmas ni la actualizas en ${days} días, la suspenderemos, como dicen los Términos de Publish.`],
        reason: REASON_PUBLISH.es(name),
      })
    : compose(lang, {
        subject: `Are you still using ${site(name)}?`,
        preheader: "Confirm in one click to keep it online.",
        title: "Are you still using your site?",
        body: [`We have not heard from ${site(name)} in a year. To keep it online, confirm with the button.`],
        button: { label: "Keep my site", url: link },
        after: [`If you do not confirm or update it within ${days} days, we will suspend it, as the Publish Terms say.`],
        reason: REASON_PUBLISH.en(name),
      });
}

/** Recordatorios del aviso anual. */
export function annualReminder(lang: Lang, name: string, link: string, daysLeft: number): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `Recordatorio: confirma ${site(name)} (quedan ${daysLeft} días)`,
        preheader: `Si no, en ${daysLeft} días la suspenderemos.`,
        title: `Quedan ${daysLeft} días para confirmar`,
        body: [`Todavía no has confirmado que sigues usando ${site(name)}. Si quieres mantenerla, pulsa el botón.`],
        button: { label: "Mantener mi web", url: link },
        after: [`Si no, en ${daysLeft} días la suspenderemos. No tienes que hacer nada más.`],
        reason: REASON_PUBLISH.es(name),
      })
    : compose(lang, {
        subject: `Reminder: confirm ${site(name)} (${daysLeft} days left)`,
        preheader: `Otherwise we will suspend it in ${daysLeft} days.`,
        title: `${daysLeft} days left to confirm`,
        body: [`You have not confirmed that you still use ${site(name)} yet. To keep it, press the button.`],
        button: { label: "Keep my site", url: link },
        after: [`Otherwise we will suspend it in ${daysLeft} days. You do not need to do anything else.`],
        reason: REASON_PUBLISH.en(name),
      });
}

/** Sitio suspendido por inactividad (deja de servirse; se borra pasados `days` días). */
export function inactive(lang: Lang, name: string, link: string, days: number): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `Hemos suspendido ${site(name)}`,
        preheader: "Sus archivos siguen guardados. Puedes recuperarla.",
        title: "Hemos suspendido tu web",
        body: [`Como no hemos tenido noticias tuyas, ${site(name)} ya no se muestra. Sus archivos siguen guardados y puedes recuperarla tal como estaba.`],
        button: { label: "Recuperar mi web", url: link },
        after: [`Si no, dentro de ${days} días la borraremos con todos sus archivos y el nombre quedará libre.`],
        reason: REASON_PUBLISH.es(name),
      })
    : compose(lang, {
        subject: `We have suspended ${site(name)}`,
        preheader: "Its files are still stored. You can bring it back.",
        title: "We have suspended your site",
        body: [`Since we have not heard from you, ${site(name)} is no longer online. Its files are still stored and you can bring it back as it was.`],
        button: { label: "Bring my site back", url: link },
        after: [`Otherwise, in ${days} days we will delete it with all its files and the name will be free again.`],
        reason: REASON_PUBLISH.en(name),
      });
}

/** Último aviso antes de borrar un sitio suspendido. */
export function deleteSoon(lang: Lang, name: string, link: string, daysLeft: number): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `${site(name)} se borrará en ${daysLeft} días`,
        preheader: "Último aviso antes de borrarla.",
        title: `Tu web se borrará en ${daysLeft} días`,
        body: [`Es el último aviso: en ${daysLeft} días borraremos ${site(name)} con todos sus archivos. Si quieres conservarla, pulsa el botón y volverá a publicarse.`],
        button: { label: "Recuperar mi web", url: link },
        reason: REASON_PUBLISH.es(name),
      })
    : compose(lang, {
        subject: `${site(name)} will be deleted in ${daysLeft} days`,
        preheader: "Last notice before we delete it.",
        title: `Your site will be deleted in ${daysLeft} days`,
        body: [`This is the last notice: in ${daysLeft} days we will delete ${site(name)} with all its files. If you want to keep it, press the button and it will go back online.`],
        button: { label: "Bring my site back", url: link },
        reason: REASON_PUBLISH.en(name),
      });
}

export function deleted(lang: Lang, name: string, requestPage: string): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `Hemos borrado ${site(name)}`,
        preheader: "Puedes volver a publicar cuando quieras.",
        title: "Hemos borrado tu web",
        body: [`Hemos borrado ${site(name)} y todos sus archivos por inactividad. El nombre ha quedado libre.`],
        button: { label: "Publicar otra web", url: requestPage },
        reason: "Recibes este correo porque tenías una web en AlumHost Publish.",
      })
    : compose(lang, {
        subject: `We have deleted ${site(name)}`,
        preheader: "You can publish again any time.",
        title: "We have deleted your site",
        body: [`We have deleted ${site(name)} and all its files because it was inactive. The name is free again.`],
        button: { label: "Publish another site", url: requestPage },
        reason: "You are receiving this email because you had a site on AlumHost Publish.",
      });
}

/** Antes de fin de curso: el correo de la universidad caduca al terminar la carrera. */
export function graduation(lang: Lang, name: string): Mail {
  return lang === "es"
    ? compose(lang, {
        subject: `¿Terminas la carrera? No pierdas ${site(name)}`,
        preheader: "Cambia tu correo antes de que caduque el de la universidad.",
        title: "¿Terminas la carrera este curso?",
        body: [
          `Tu web ${site(name)} está asociada a tu correo de la universidad, y ese correo deja de funcionar cuando terminas la carrera. Sin él no podrías actualizarla ni confirmar que sigues usándola.`,
          "Si terminas este curso, responde a este correo desde tu cuenta de la universidad con la dirección que quieras usar a partir de ahora y la cambiamos.",
          "Si sigues estudiando, no tienes que hacer nada.",
        ],
        reason: REASON_PUBLISH.es(name),
      })
    : compose(lang, {
        subject: `Graduating? Do not lose ${site(name)}`,
        preheader: "Change your email before your university one expires.",
        title: "Graduating this year?",
        body: [
          `Your site ${site(name)} is tied to your university email, and that address stops working when you graduate. Without it you could not update the site or confirm you still use it.`,
          "If you graduate this year, reply to this email from your university account with the address you want to use from now on and we will change it.",
          "If you are still studying, you do not need to do anything.",
        ],
        reason: REASON_PUBLISH.en(name),
      });
}
