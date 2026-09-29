/**
 * Textos en español (idioma por defecto). en.ts debe tener EXACTAMENTE la misma forma (lo comprueba TypeScript).
 * Reglas para editar (IA incluida):
 * - Nada de guiones largos. Frases cortas, voz activa, sin palabras de relleno ("potencia", "eleva", "sin fricción").
 * - No prometas nada que no esté en docs/requirements.md (SLA, cifras de uptime, % de descuento...).
 * - {placeholders} se rellenan con fill() de src/i18n/index.ts.
 */
const es = {
  meta: {
    home: {
      title: "Patio · VPS y webs para estudiantes, con soporte en español",
      description:
        "Hosting boutique para estudiantes y desarrolladores: webs estáticas y VPS con SSH, IVA incluido y onboarding 1:1 en español.",
    },
    plans: {
      title: "Planes y precios · Patio",
      description: "Publish, VPS Developer y VPS Pro. Precios claros con IVA incluido y pago anual por defecto.",
    },
    contact: {
      title: "Contacto · Patio",
      description: "Reserva tu plaza en la beta privada o pregúntanos lo que necesites. Respondemos personas.",
    },
    notFound: { title: "Página no encontrada · Patio", description: "Esta página no existe." },
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
    yearlyTotal: "{total} al año, IVA incluido",
    monthlyTotal: "Pago mensual, IVA incluido",
    from: "desde {price}/mes",
  },

  home: {
    hero: {
      eyebrow: "Beta privada abierta",
      titleA: "VPS y webs para estudiantes, con soporte",
      titleEm: "en español.",
      sub: "Para tu TFG, tus prácticas o tu primer proyecto. La primera puesta en marcha la hacemos contigo, 1:1.",
      ctaSecondary: "Ver planes",
      picker: {
        legend: "¿Qué quieres subir?",
        options: {
          publish: "Una web estática",
          developer: "Un servidor (VPS)",
          pro: "Algo más potente",
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
          title: "Precio de estudiante.",
          body: "Escríbenos desde el correo de tu universidad y te aplicamos el descuento.",
        },
        {
          title: "Construido en abierto.",
          body: "Publicamos cómo está montado: el aislamiento de red, los scripts y lo que aprendemos por el camino.",
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
        { title: "Correo saliente.", body: "El puerto 25 está cerrado para que nadie queme la IP que compartimos." },
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
      sub: "Precios de beta, provisionales hasta medir la capacidad real. El pago anual sale más barato: para ti y para nosotros.",
    },
    billing: { label: "Periodo de pago", yearly: "Anual", monthly: "Mensual" },
    recommended: "Recomendado para empezar",
    specs: {
      vcpu: "{n} vCPU",
      ram: "{n} GB de RAM",
      disk: "~{n} GB NVMe",
      ssh: "SSH con clave pública",
    },
    items: {
      publish: {
        name: "Publish",
        tagline: "Para tu portfolio o la web de un proyecto.",
        features: ["Deploy con git push", "HTTPS automático", "Subdominio o tu propio dominio", "Sin acceso SSH"],
      },
      developer: {
        name: "VPS Developer",
        tagline: "Para el TFG, una API o las prácticas de sistemas.",
        features: ["IPv6 propia", "IPv4 compartida para web (80/443)"],
      },
      pro: {
        name: "VPS Pro",
        tagline: "Para cargas más pesadas o puertos propios.",
        features: ["CPU y disco ampliados (a definir en la beta)", "IPv4 dedicada opcional para cualquier puerto"],
      },
    },
    addons: {
      title: "Extras",
      backup: {
        title: "Backup diario",
        line: "{plan}: {price}/mes, se guardan {days} días.",
        note: "Probamos a restaurar de verdad, no solo a guardar.",
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
          a: "Cada cobro con tarjeta tiene una comisión fija. Cobrando una vez al año casi desaparece, y te lo trasladamos.",
        },
        {
          q: "¿Tengo backups?",
          a: "Publish no los necesita: tu repositorio es la copia. En los VPS son un extra; sin él, los datos son tu responsabilidad.",
        },
        {
          q: "¿Qué no puedo hacer?",
          a: "Enviar correo por el puerto 25, minar criptomonedas, escanear redes o alojar phishing.",
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
      abuseLabel: "Denunciar un abuso",
      abuseNote: "Respondemos en 24-48 h laborables.",
    },
    form: {
      title: "Escríbenos",
      name: "Nombre",
      email: "Correo",
      emailHelp: "Si usas el de tu universidad, podemos aplicarte el precio de estudiante.",
      reason: "Motivo",
      reasons: {
        beta: "Reservar plaza en la beta",
        plans: "Pregunta sobre los planes",
        support: "Ayuda con mi servicio",
        other: "Otra cosa",
      },
      plan: "Plan que te interesa",
      planUnknown: "Aún no lo sé",
      message: "Mensaje",
      messageHelp: "Cuéntanos qué quieres montar. Mínimo 10 caracteres.",
      privacy: "Usamos tus datos solo para responderte.",
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

  footer: {
    tagline: "Hosting boutique para estudiantes y desarrolladores.",
    status: "Estado del servicio",
    devlog: "Devlog",
    repo: "Código abierto",
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
