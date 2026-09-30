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
    terms: { title: "Términos · {name}", description: "Condiciones de AlumHost: Publish gratis, planes de pago, desistimiento, reembolsos y suspensión." },
    aup: { title: "Uso aceptable · {name}", description: "Qué no se puede hacer en AlumHost y cómo avisar de un abuso." },
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
    proof: {
      label: "Lo que ya es verdad",
      items: [
        { title: "IVA incluido", body: "El precio que ves es el que pagas." },
        { title: "En euros", body: "Sin tarjeta internacional ni facturas en dólares." },
        { title: "Te responde una persona", body: "En español, sin bots ni colas de tickets." },
        { title: "Precio congelado", body: "Si entras en la beta, el primer año no sube." },
      ],
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
    updated: "Última actualización: 30 de septiembre de 2026.",
    sections: [
      {
        h: "Quién trata tus datos",
        p: "{controller}. Para cualquier cosa sobre tus datos, escríbenos a {email}.",
      },
      {
        h: "Qué datos recogemos",
        p: "Del formulario de contacto y de la beta: nombre, correo, motivo, plan y mensaje. De Publish: el nombre de tu web, tu correo de la universidad, los archivos que subes y, si publicas desde GitHub, el repositorio y el commit. Del enlace mágico guardamos solo una huella cifrada (hash), nunca el enlace. Por seguridad se procesa tu dirección IP para frenar el spam y limitar envíos, sin guardarla en nuestra base de datos.",
      },
      {
        h: "Para qué",
        p: "Para responderte, gestionar tu plaza en la beta y prestar Publish: enviarte el enlace para publicar, servir tu web y avisarte de lo que afecte a ella (por ejemplo, la confirmación anual de inactividad). La base legal es tu consentimiento al enviar el formulario y, en Publish y en los planes, la ejecución del servicio que pides.",
      },
      {
        h: "Con quién los compartimos",
        p: "Con los proveedores que hacen funcionar la web: Cloudflare (alojamiento, base de datos de Publish en la Unión Europea, verificación antispam y reenvío de correo), Brevo (envío del enlace de Publish y de nuestras respuestas), Google (nuestra bandeja de correo) y GitHub (solo si publicas desde un repositorio público). Pueden tratar datos fuera del Espacio Económico Europeo con las garantías que exige el RGPD. No vendemos tus datos ni los usamos para publicidad.",
      },
      {
        h: "Cuánto tiempo",
        p: "Consultas: hasta resolverlas y, como mucho, doce meses. Publish: mientras tengas la web; si la borras, la borramos con sus archivos al momento, y los enlaces caducan a las 24 horas. Si te haces cliente de pago, el tiempo que marque la ley para facturas y contratos.",
      },
      {
        h: "Tus derechos",
        p: "Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {email}. Si crees que no lo hemos hecho bien, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).",
      },
      {
        h: "Cookies",
        p: "No usamos cookies de analítica ni de publicidad. La página de Publish guarda el enlace en el almacenamiento de tu pestaña (sessionStorage), que se borra al cerrarla.",
      },
    ],
  },

  // Términos y política de uso aceptable. BORRADOR para revisar con el PAE o un abogado (tarea l-03).
  // TODO(legal): cuando haya alta, añadir NIF y domicilio del prestador (LSSI art. 10) y cerrar los días de gracia (d-08).
  terms: {
    title: "Términos.",
    updated: "Última actualización: 30 de septiembre de 2026. Borrador de la beta.",
    sections: [
      {
        h: "Quién presta el servicio",
        p: [
          "AlumHost lo prestan {controller}. Puedes escribirnos a {email} para cualquier cosa y a {abuse} para avisar de un abuso.",
          "Estamos en beta: el servicio funciona, pero puede cambiar y todavía no hay compromiso de disponibilidad (SLA). Hacemos lo posible por que todo vaya bien y te avisamos de cualquier incidencia.",
        ],
      },
      {
        h: "Publish gratis",
        p: [
          "Publish aloja webs estáticas (HTML, CSS, JavaScript, imágenes) en tunombre.alumhost.dev. Es gratis y sirve para aprender y enseñar tus proyectos.",
          "Solo pueden usarlo personas con correo de las universidades admitidas. Una web por persona, con los límites que indica la página de Publish (hoy 20 MB, 1.000 archivos y 5 MB por archivo).",
          "Lo que publicas es tuyo y eres responsable de ello: tienes que tener derecho a usar todo lo que subes (textos, imágenes, código) y cumplir la política de uso aceptable.",
          "Inactividad: una vez al año te enviamos un correo para confirmar que sigues usando la web. Si no lo confirmas en 30 días y no la has actualizado en los últimos 12 meses, la suspendemos, y si pasan otros 60 días sin noticias la borramos y el nombre queda libre.",
          "Puedes borrar tu web cuando quieras desde el enlace que te llega al correo.",
        ],
      },
      {
        h: "Planes de pago",
        p: [
          "Los precios que ves en la web incluyen el IVA. Se pagan por adelantado, por mes o por año, y se renuevan solos hasta que canceles.",
          "Puedes cancelar cuando quieras: el servicio sigue hasta el final del periodo pagado y no se renueva. No devolvemos la parte no usada de un periodo, salvo en el desistimiento y en los fallos graves nuestros que se explican abajo.",
          "Si un pago falla te avisamos por correo y tienes 7 días de margen para arreglarlo. Pasado ese plazo suspendemos el servidor; antes de borrarlo guardamos una copia durante 14 días más por si vuelves.",
        ],
      },
      {
        h: "Derecho de desistimiento (14 días)",
        p: [
          "Si eres consumidor en la Unión Europea, tienes 14 días desde la contratación para desistir sin dar explicaciones, escribiendo a {email}.",
          "Como el servidor se entrega al momento, al contratar te pedimos que aceptes expresamente que empiece antes de que acaben esos 14 días. Si desistes, te devolvemos lo pagado menos la parte proporcional a los días que lo hayas tenido en marcha, en un plazo máximo de 14 días y por el mismo medio de pago.",
        ],
      },
      {
        h: "Reembolsos por fallos nuestros",
        p: [
          "Si el servicio deja de funcionar por causa nuestra durante más de 72 horas seguidas en un mes, puedes pedirnos la devolución de ese mes. No cubre las caídas causadas por tu propio software, por un abuso ni por proveedores fuera de nuestro control.",
        ],
      },
      {
        h: "Copias de seguridad",
        p: [
          "Salvo que contrates el extra de copias, eres tú quien guarda copia de tus datos. En Publish, tu copia es tu propio repositorio o carpeta.",
        ],
      },
      {
        h: "Suspensión y retirada",
        p: [
          "Podemos suspender una web o un servidor sin aviso previo si hay un abuso grave (phishing, malware, ataques, contenido ilegal) o nos lo pide una autoridad. En los demás casos te avisamos antes y te damos un plazo para corregirlo.",
          "Mientras un servicio está suspendido por abuso conservamos su contenido el tiempo necesario para atender reclamaciones.",
        ],
      },
      {
        h: "Responsabilidad",
        p: [
          "Respondemos de los daños que causemos por dolo o negligencia grave. En lo demás, nuestra responsabilidad se limita a lo que nos hayas pagado en los últimos 12 meses (en Publish, que es gratis, no hay importe). Esto no limita ningún derecho que la ley te reconozca como consumidor.",
        ],
      },
      {
        h: "Cambios en estos términos",
        p: [
          "Si los cambiamos de forma importante te avisamos por correo con 30 días de antelación. Si no estás de acuerdo, puedes cancelar antes de que entren en vigor.",
        ],
      },
      {
        h: "Ley aplicable",
        p: [
          "Se aplica la ley española. Si eres consumidor, puedes reclamar ante los tribunales de tu domicilio.",
        ],
      },
    ],
  },

  aup: {
    title: "Uso aceptable.",
    updated: "Última actualización: 30 de septiembre de 2026. Borrador de la beta.",
    sections: [
      {
        h: "La idea",
        p: [
          "AlumHost es para aprender, construir y enseñar proyectos. Compartimos máquinas y dominio con otros estudiantes, así que lo que haga uno afecta a todos. Esta política dice lo que no se puede hacer en Publish ni en los servidores.",
        ],
      },
      {
        h: "No se permite",
        p: [
          "Nada ilegal, ni enlazar a ello: contenido que infrinja derechos de autor o marcas, material de abuso sexual infantil, apología del terrorismo, incitación al odio o acoso.",
          "Nada que engañe o suplante: phishing, páginas que imiten el acceso de una universidad, un banco u otro servicio, estafas o tiendas falsas.",
          "Nada que ataque: malware, escaneos de redes ajenas, ataques de denegación de servicio, fuerza bruta, proxies abiertos o reenviadores usados para abusar.",
          "Nada de correo masivo: spam, listas compradas ni envíos no solicitados. El puerto 25 de salida está cerrado y los puertos de envío se abren solo a petición en los planes que lo permiten.",
          "Nada que agote la máquina compartida: minado de criptomonedas o cargas que usen toda la CPU o el disco de forma continua.",
          "Nada que trate datos personales de otras personas sin base legal, como formularios que recojan contraseñas o datos de terceros.",
        ],
      },
      {
        h: "Qué hacemos si pasa",
        p: [
          "En los casos graves suspendemos al momento y, si toca, avisamos a las autoridades. En los demás, te escribimos, te damos un plazo para corregirlo y, si no se corrige, suspendemos o damos de baja el servicio.",
        ],
      },
      {
        h: "Avisar de un abuso",
        p: [
          "Si ves algo alojado en AlumHost que incumple esta política, escríbenos a {abuse} con la dirección exacta y lo que has visto. Lo revisamos lo antes posible.",
        ],
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
      acceptLinks: "Condiciones completas: {terms} y {aup}.",
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
        rate_limited: "Has pedido demasiadas acciones seguidas. Espera un minuto y vuelve a intentarlo.",
        suspended: "Esta web está suspendida por una revisión de abuso. Escríbenos a abuse@alumhost.dev.",
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
      message: "¿Qué quieres montar?",
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
    terms: "Términos",
    aup: "Uso aceptable",
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
