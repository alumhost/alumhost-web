/**
 * Textos en español (idioma por defecto). en.ts debe tener EXACTAMENTE la misma forma (lo comprueba TypeScript).
 * Reglas para editar (IA incluida):
 * - Nada de guiones largos. Frases cortas, voz activa, sin palabras de relleno ("potencia", "eleva", "sin fricción").
 * - No prometas nada que no esté en docs/memoria-decisiones.md (SLA, cifras de uptime, % de descuento...).
 * - Nada regional (ni Sevilla ni Andalucía): el público es internacional aunque el soporte sea en español.
 * - {placeholders} se rellenan con fill() de src/i18n/index.ts. El nombre de marca sale de site.ts ({name}).
 */
const es = {
  meta: {
    home: {
      title: "{name} · VPS y webs para estudiantes, con soporte en español",
      description:
        "Hosting boutique para estudiantes y desarrolladores: webs estáticas y VPS con SSH, IVA incluido y onboarding 1:1 en español.",
    },
    plans: {
      title: "Planes y precios · {name}",
      description: "Publish gratis, VPS Mini, VPS Developer y VPS Pro. Precios redondos con IVA incluido y 2 meses gratis pagando al año.",
    },
    contact: {
      title: "Contacto · {name}",
      description: "Reserva tu plaza en la beta privada o pregúntanos lo que necesites. Te responde una persona.",
    },
    privacy: {
      title: "Privacidad · {name}",
      description: "Qué datos recogemos en el formulario, para qué y cómo ejercer tus derechos.",
    },
    publish: {
      title: "Publica tu web gratis · {name}",
      description: "Tu web estática en tunombre.alumhost.dev, gratis y con HTTPS. Sin tarjeta ni cuenta: solo tu correo de la universidad.",
    },
    publishUpload: { title: "Sube tu web · {name}", description: "Sube un .zip, una carpeta o un repositorio de GitHub." },
    beta: {
      title: "Beta · {name}",
      description:
        "Apúntate gratis a la beta: VPS y webs estáticas para estudiantes, con soporte en español. No pagas nada por adelantado.",
    },
    notFound: { title: "Página no encontrada · {name}", description: "Esta página no existe." },
  },

  nav: {
    plans: "Planes",
    contact: "Contacto",
    cta: "Reservar plaza",
    menu: "Menú",
    close: "Cerrar",
    skip: "Saltar al contenido",
    switchTo: "EN",
    switchLabel: "Read this page in English",
    home: "Inicio",
  },

  common: {
    vatIncluded: "IVA incluido",
    perMonth: "/mes",
    perYear: "/año",
    yearlySaving: "Ahorras {amount} frente a pagar {monthly} al mes. IVA incluido.",
    monthlyNote: "Pago mensual, IVA incluido.",
    free: "Gratis",
    freeNote: "Con subdominio .alumhost.dev. Tu propio dominio: {monthly}/mes o {yearly}/año.",
    from: "desde {price}/mes",
  },

  home: {
    hero: {
      eyebrow: "Beta privada abierta",
      titleA: "Tu servidor, montado",
      titleEm: "contigo.",
      sub: "VPS y webs estáticas para estudiantes y desarrolladores. La primera puesta en marcha la hacemos contigo, 1:1 y en español.",
      ctaSecondary: "Ver planes",
      picker: {
        legend: "¿Qué quieres subir?",
        options: {
          publish: "Una web estática",
          mini: "Un VPS pequeño",
          developer: "Un VPS",
          pro: "Un VPS grande",
        },
        details: "Ver el plan completo",
      },
    },
    perks: {
      title: "Cómo trabajamos.",
      items: [
        {
          title: "Una persona, no un ticket.",
          body: "La primera vez lo montamos contigo por videollamada o en persona. Después, te seguimos respondiendo nosotros.",
        },
        {
          title: "Hecho para la uni.",
          body: "TFG, TFM, prácticas de sistemas y hackathons. Sin tarjeta internacional ni facturas en dólares.",
        },
        {
          title: "Precio de estudiante, sin cupones.",
          body: "No hay descuentos que pedir ni letra pequeña: el precio que ves es el de estudiante, para todo el mundo.",
        },
        {
          title: "Automatizado, no improvisado.",
          body: "Crear, retirar y aislar un servidor son comandos concretos y repetibles, no pasos a mano que dependen de la memoria de alguien.",
        },
      ],
    },
    steps: {
      title: "Así empiezas.",
      items: [
        { verb: "Elige", body: "Web estática o VPS, según lo que vayas a subir." },
        { verb: "Reserva", body: "Estamos en beta privada. Déjanos tus datos y te escribimos cuando haya plaza." },
        { verb: "Arranca", body: "Hacemos el onboarding contigo y te damos tu acceso SSH o tu web con HTTPS." },
      ],
    },
    honest: {
      title: "Lo que no te vamos a prometer.",
      items: [
        { title: "Un SLA.", body: "Es un servicio de mejor esfuerzo y te lo decimos antes de que pagues." },
        { title: "Ser los más baratos.", body: "Las grandes nubes ganan en specs. Nosotros competimos en ayuda y cercanía." },
        { title: "Backups que no has contratado.", body: "Sin el extra de backup, los datos de tu VPS son responsabilidad tuya." },
        {
          title: "Correo saliente.",
          body: "El puerto 25 está cerrado. El 465 y el 587 también, salvo que nos lo pidas para tu proyecto.",
        },
      ],
    },
    closing: {
      title: "La beta es pequeña a propósito.",
      body: "Pocas plazas, trato directo y condiciones de beta. Reserva la tuya y te escribimos.",
    },
  },

  plans: {
    header: {
      title: "Planes claros, IVA incluido.",
      sub: "Precios de beta, provisionales hasta medir la capacidad real. Pagando al año, los VPS te salen con 2 meses gratis.",
    },
    billing: { label: "Periodo de pago", yearly: "Anual", monthly: "Mensual" },
    recommended: "Recomendado para empezar",
    specs: {
      vcpu: "{n} vCPU",
      ramGb: "{n} GB de RAM",
      ramMb: "{n} MB de RAM",
      disk: "~{n} GB NVMe",
      ssh: "SSH con clave pública",
    },
    items: {
      publish: {
        name: "Publish",
        tagline: "Para tu portfolio o la web de un proyecto.",
        features: ["Sube un .zip, una carpeta o tu repo de GitHub", "HTTPS automático", "Gratis en tunombre.alumhost.dev", "Tu propio dominio como extra (pronto)", "Sin acceso SSH"],
      },
      mini: {
        name: "VPS Mini",
        tagline: "Para un bot, una API pequeña o aprender Linux.",
        features: ["IPv4 compartida para web (80/443)"],
      },
      developer: {
        name: "VPS Developer",
        tagline: "Para el TFG, una API o las prácticas de sistemas.",
        features: ["IPv4 compartida para web (80/443)"],
      },
      pro: {
        name: "VPS Pro",
        tagline: "Para cargas más pesadas o puertos propios.",
        features: ["CPU y disco ampliados (a definir en la beta)", "IPv4 dedicada opcional para cualquier puerto"],
      },
    },
    custom: {
      title: "¿Necesitas otra cosa?",
      body: "Más RAM, varios servicios o algo que no encaja en estos planes. Cuéntanoslo y te pasamos presupuesto por correo.",
      cta: "Pedir presupuesto",
    },
    addons: {
      title: "Extras",
      backup: {
        title: "Backup diario",
        line: "{plan}: {price}/mes, se guardan {days} días.",
        note: "Copia automática de tu VPS cada día.",
      },
      ipv4: {
        title: "IPv4 dedicada",
        body: "{price}/mes en VPS Pro. Para juegos, VPN o cualquier puerto, y con tu propia reputación de IP.",
      },
    },
    faq: {
      title: "Preguntas",
      items: [
        { q: "¿El IVA está incluido?", a: "Sí. Todos los precios de esta página incluyen el 21 % de IVA." },
        {
          q: "¿Por qué sale más barato al año?",
          a: "Cada cobro con tarjeta tiene una comisión fija. Cobrando una vez al año casi desaparece, y te lo trasladamos: en los VPS, 2 meses gratis.",
        },
        {
          q: "¿Tengo backups?",
          a: "Publish no los necesita: tu repositorio es la copia. En los VPS son un extra; sin él, los datos son tu responsabilidad.",
        },
        {
          q: "¿Qué no puedo hacer?",
          a: "Minar criptomonedas, escanear redes, alojar phishing o enviar spam. El correo saliente (25, 465 y 587) está cerrado por defecto.",
        },
        {
          q: "¿Tengo IPv6?",
          a: "Todavía no. Los VPS salen con IPv4 compartida para web (80/443). La IPv6 llegará cuando su aislamiento esté probado.",
        },
        {
          q: "¿Hay garantía de disponibilidad?",
          a: "No hay SLA contractual. Es un servicio de mejor esfuerzo, sin letra pequeña.",
        },
        {
          q: "¿Cómo se paga?",
          a: "Durante la beta no se cobra nada desde la web. Cuando abramos, el pago irá por Stripe: nunca vemos ni guardamos tu tarjeta.",
        },
      ],
    },
  },

  contact: {
    header: {
      title: "Hablemos.",
      sub: "Para reservar plaza en la beta, preguntar por un plan o pedir ayuda. Te responde una persona.",
    },
    channels: {
      emailLabel: "Correo",
      supportLabel: "Soporte",
      abuseLabel: "Denunciar un abuso",
      abuseNote: "Lo revisamos todos los días.",
    },
    form: {
      title: "Escríbenos",
      name: "Nombre",
      email: "Correo",
      emailHelp: "El que uses a diario. Te responderemos ahí.",
      reason: "Motivo",
      reasons: {
        beta: "Reservar plaza en la beta",
        plans: "Pregunta sobre los planes",
        custom: "Necesito algo a medida",
        support: "Ayuda con mi servicio",
        other: "Otra cosa",
      },
      plan: "Plan que te interesa",
      planUnknown: "Aún no lo sé",
      message: "Mensaje",
      messageHelp: "Cuéntanos qué quieres montar. Mínimo 10 caracteres.",
      privacy: "Usamos tus datos solo para responderte.",
      privacyLink: "Política de privacidad",
      submit: "Enviar",
      sending: "Enviando",
      success: "Recibido. Te escribimos pronto a {email}.",
      errors: {
        name: "Escribe tu nombre.",
        email: "Revisa el correo: debe parecerse a nombre@dominio.es.",
        message: "Cuéntanos un poco más (mínimo 10 caracteres).",
        turnstile: "Completa la verificación antes de enviar.",
        rateLimited: "Demasiados envíos seguidos. Espera un minuto y vuelve a probar.",
        server: "No se ha podido enviar. Prueba otra vez o escríbenos a {email}.",
      },
    },
  },

  // TODO(legal): borrador. Revisarlo con un tercero (PAE o abogado) antes de producción y completar el titular legal.
  privacy: {
    title: "Privacidad.",
    updated: "Última actualización: 29 de septiembre de 2026.",
    sections: [
      {
        h: "Quién trata tus datos",
        p: "{controller}. Para cualquier cosa sobre tus datos, escríbenos a {email}.",
      },
      {
        h: "Qué datos recogemos",
        p: "Los que escribes en el formulario de contacto: nombre, correo, motivo, plan y mensaje. Por seguridad también se procesa tu dirección IP, solo para frenar el spam y limitar envíos.",
      },
      {
        h: "Para qué",
        p: "Para responderte y, si lo pides, gestionar tu plaza en la beta. La base legal es tu consentimiento al enviar el formulario y, si vas a contratar, la aplicación de medidas precontractuales.",
      },
      {
        h: "Con quién los compartimos",
        p: "Con los proveedores que hacen funcionar la web: Cloudflare (alojamiento, verificación antispam y reenvío de correo), Google (nuestra bandeja de correo) y Brevo (el envío de nuestras respuestas). Pueden tratarlos fuera del Espacio Económico Europeo con las garantías que exige el RGPD. No vendemos tus datos ni los usamos para publicidad.",
      },
      {
        h: "Cuánto tiempo",
        p: "Hasta resolver tu consulta y, como mucho, doce meses. Si te haces cliente, el tiempo que marque la ley.",
      },
      {
        h: "Tus derechos",
        p: "Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {email}. Si crees que no lo hemos hecho bien, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).",
      },
      {
        h: "Cookies",
        p: "No usamos cookies de analítica ni de publicidad.",
      },
    ],
  },

  publish: {
    cta: "Publicar gratis",
    title: "Publica tu web gratis",
    sub: "Tu web estática en tunombre.alumhost.dev, con HTTPS, en un par de minutos. Sin tarjeta y sin crear cuenta: te enviamos un enlace a tu correo de la universidad.",
    steps: [
      "Elige el nombre de tu web y pon tu correo de la US.",
      "Abre el enlace que te llega al correo.",
      "Sube un .zip, una carpeta o tu repositorio de GitHub.",
    ],
    limits: "Hasta 20 MB y 1.000 archivos por web, 5 MB por archivo. Solo webs estáticas: HTML, CSS, JavaScript e imágenes. Una web por persona durante la beta.",
    form: {
      title: "Empieza aquí",
      name: "Nombre de tu web",
      nameHelp: "Minúsculas, números y guiones (2-30). Quedará como tunombre.alumhost.dev.",
      email: "Tu correo de la universidad",
      emailHelp: "Por ahora, solo Universidad de Sevilla: @us.es o @alum.us.es.",
      accept: "No voy a publicar nada ilegal, engañoso ni que suplante a nadie. Sé que si lo hago, AlumHost retira la web.",
      submit: "Enviarme el enlace",
      sending: "Enviando…",
      success: "Hecho. Te hemos enviado un enlace a {email}. Ábrelo para subir tu web; vale 24 horas.",
    },
    errors: {
      name: "Usa de 2 a 30 caracteres: minúsculas, números y guiones, sin guion al principio ni al final. Algunos nombres están reservados.",
      email: "Escribe un correo válido.",
      email_domain: "De momento solo admitimos correos @us.es y @alum.us.es.",
      accept: "Tienes que aceptar las condiciones para publicar.",
      turnstile: "Completa la verificación antibots.",
      name_taken: "Ese nombre ya lo usa otra persona. Prueba con otro.",
      one_site: "Ese correo ya tiene una web. Pon su mismo nombre para actualizarla.",
      rate_limited: "Has pedido muchos enlaces seguidos. Espera un poco e inténtalo de nuevo.",
      suspended: "Esa web está suspendida. Escríbenos a {email}.",
      server: "Algo ha fallado en nuestro lado. Inténtalo en un minuto o escríbenos a {email}.",
    },
    upload: {
      title: "Sube tu web",
      loading: "Comprobando tu enlace…",
      expired: "El enlace ha caducado o no es válido.",
      askNew: "Pedir un enlace nuevo",
      current: "{url} tiene ahora {files} archivos ({size}), actualizada el {date}. Si publicas otra vez, se sustituye entera.",
      empty: "{url} todavía está vacía. Sube tu web y quedará publicada al momento.",
      tabs: { zip: "Archivo .zip", folder: "Carpeta", github: "GitHub" },
      zipLabel: "Elige el .zip de tu web",
      zipHelp: "Tiene que tener un index.html, en la raíz o dentro de una única carpeta.",
      folderLabel: "Elige la carpeta de tu web",
      folderHelp: "La carpeta que tiene el index.html. El navegador te preguntará si quieres subir sus archivos.",
      githubRepo: "Repositorio",
      githubRepoHelp: "Público, con la forma usuario/repositorio o su enlace de GitHub.",
      githubBranch: "Rama",
      githubDir: "Carpeta dentro del repositorio",
      githubDirHelp: "Vacío si el index.html está en la raíz. Si usas un generador, la de salida (por ejemplo dist o public, ya generada y subida al repo).",
      publish: "Publicar",
      reading: "Leyendo los archivos…",
      progress: "Subiendo {done} de {total} archivos…",
      done: "Publicada. Tu web ya está en {url}",
      view: "Ver mi web",
      delete: "Borrar mi web",
      deleteConfirm: "¿Seguro? Se borra la web y todos sus archivos, y el nombre queda libre.",
      deleted: "Tu web se ha borrado.",
      update: "Para actualizarla más adelante, pide un enlace nuevo con el mismo nombre y correo, y vuelve a publicar.",
      errors: {
        nothing: "Elige primero un archivo, una carpeta o un repositorio.",
        no_index: "Falta el index.html.",
        too_many_files: "Hay demasiados archivos (el máximo es 1.000).",
        site_too_big: "La web ocupa más de 20 MB.",
        file_too_big: "El archivo {path} pasa de 5 MB. Comprime imágenes y vídeos, o enlázalos desde fuera.",
        bad_path: "El nombre {path} no se admite: usa letras, números, guiones y puntos, sin carpetas ocultas.",
        not_zip: "Ese archivo no es un .zip válido.",
        zip64: "Ese .zip es demasiado grande o usa un formato que no admitimos.",
        encrypted: "El .zip está protegido con contraseña.",
        method: "El .zip usa una compresión que no admitimos. Vuelve a crearlo con la opción normal de tu sistema.",
        github: "No encuentro ese repositorio, esa rama o esa carpeta. ¿Es público?",
        github_fetch: "GitHub no nos ha dado un archivo. Inténtalo de nuevo en un momento.",
        name_taken: "Ese nombre ya lo ha publicado otra persona.",
        one_site: "Tu correo ya tiene otra web.",
        session: "El enlace ha caducado. Pide uno nuevo.",
        server: "Algo ha fallado en nuestro lado. Inténtalo de nuevo en un minuto.",
      },
    },
  },

  // Página /beta. Nunca "fundador"; nunca una cifra del mínimo de personas; nunca fechas.
  beta: {
    status: "Beta abierta",
    titleA: "Hazte beta",
    titleEm: "tester.",
    sub: "Todavía no hemos lanzado. Arrancamos cuando haya un mínimo de personas apuntadas.",
    free: "Apuntarse es gratis y no te compromete a nada.",
    cta: "Apuntarme",
    gains: {
      title: "Qué te llevas.",
      items: [
        {
          title: "Precio congelado un año.",
          body: "El precio de tu plan no sube durante tu primer año, aunque cambiemos las tarifas después de la beta.",
        },
        { title: "Backup incluido un año.", body: "En los VPS, la copia diaria va incluida el primer año sin pagar el extra." },
        {
          title: "Tu primer despliegue, con nosotros.",
          body: "Lo montamos contigo y te ayudamos a conseguir el dominio gratis del GitHub Student Pack.",
        },
        {
          title: "Hablas con nosotros.",
          body: "Sin tickets ni bots. Te responden las mismas personas que montan tu servidor.",
        },
      ],
    },
    steps: {
      title: "Cómo funciona.",
      items: [
        { verb: "Apúntate", body: "Rellenas el formulario de abajo. Es gratis y no pagas nada por adelantado." },
        { verb: "Decide", body: "Cuando lleguemos al mínimo te avisamos por correo. Entonces decides si sigues." },
        { verb: "Arranca", body: "Tu primer mes empieza el día que te damos acceso a tu servidor, no antes." },
      ],
    },
    signup: {
      title: "Apúntate.",
      body: "Te escribimos cuando haya fecha. Hasta entonces no te mandamos nada más.",
      messageHelp:
        "Qué quieres montar y cuánta RAM crees que necesitas. Si no lo sabes, cuéntanos el proyecto y te orientamos. Mínimo 10 caracteres.",
      submit: "Apuntarme a la beta",
      success: "Apuntado. Te escribimos a {email} cuando haya fecha.",
    },
    faq: {
      title: "Preguntas.",
      items: [
        {
          q: "¿Cuándo pago?",
          a: "Ahora, nada. Cuando lleguemos al mínimo te escribimos con el precio de tu plan. Si decides seguir, pagas y tu primer mes empieza el día que tienes acceso a tu servidor.",
        },
        { q: "¿Y si no llegáis al mínimo?", a: "No se cobra nada a nadie. Te avisamos igualmente de lo que hacemos." },
        { q: "¿Cómo me borro de la lista?", a: "Responde a cualquier correo nuestro pidiéndolo y te quitamos." },
        {
          q: "¿Qué datos guardáis?",
          a: "Los del formulario: nombre, correo, plan y mensaje, solo para escribirte sobre la beta. El resto está en la",
        },
      ],
      privacyLink: "política de privacidad",
    },
  },

  footer: {
    tagline: "Hosting boutique para estudiantes y desarrolladores.",
    status: "Estado del servicio",
    devlog: "Devlog",
    repo: "Código abierto",
    privacy: "Privacidad",
    beta: "Beta",
    rights: "© {year} {name}",
  },

  notFound: {
    title: "Esta página no existe.",
    body: "Puede que el enlace esté mal o que la hayamos movido.",
    back: "Volver al inicio",
  },
};

export default es;

/** Forma del diccionario. en.ts se tipa contra esto. */
export type Dict = typeof es;
