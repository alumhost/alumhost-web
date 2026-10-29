/**
 * English copy. Must mirror es.ts exactly (enforced by the Dict type). Same writing rules as es.ts.
 */
import type { Dict } from "./es";

const en: Dict = {
  meta: {
    home: {
      title: "{name} · Websites for businesses in Reina Mercedes, Seville",
      description:
        "Websites and systems for bars, hair salons, academies and shops in Reina Mercedes. In-person help, WhatsApp support and clear prices: a website for 849 € and maintenance for 30 €/month.",
    },
    plans: {
      title: "Plans and pricing · {name}",
      description: "Free Publish, VPS Mini, VPS Developer and VPS Pro. Round prices with VAT included and 2 months free when paying yearly.",
    },
    contact: {
      title: "Contact · {name}",
      description: "Tell us what business you run and we will arrange a visit. We reply ourselves.",
    },
    privacy: {
      title: "Privacy · {name}",
      description: "What data the contact form collects, why, and how to exercise your rights.",
    },
    publish: {
      title: "Publish your website for free · {name}",
      description: "Your static site at yourname.alumhost.dev, free and with HTTPS. No card, no account: just your university email.",
    },
    publishUpload: { title: "Upload your website · {name}", description: "Upload a .zip, a folder or a GitHub repository." },
    beta: {
      title: "Beta · {name}",
      description:
        "Join the beta for free: VPS and static sites for students, with one-to-one onboarding. Nothing to pay upfront.",
    },
    terms: { title: "Terms · {name}", description: "AlumHost terms: free Publish, paid plans, withdrawal, refunds and suspension." },
    aup: { title: "Acceptable use · {name}", description: "What is not allowed on AlumHost and how to report abuse." },
    enterprise: { title: "Enterprise · {name}", description: "Websites and servers for businesses and associations: we build, host and maintain them. No lock-in." },
    notFound: { title: "Page not found · {name}", description: "This page does not exist." },
  },

  nav: {
    plans: "Plans",
    enterprise: "Enterprise",
    contact: "Contact",
    services: "Services",
    prices: "Prices",
    about: "About us",
    ctaVisit: "Ask for a visit",
    cta: "Reserve a spot",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    switchTo: "ES",
    switchLabel: "Leer esta página en español",
    home: "Home",
  },

  common: {
    vatIncluded: "VAT included",
    perMonth: "/mo",
    perYear: "/yr",
    yearlySaving: "You save {amount} compared with paying {monthly} a month. VAT included.",
    monthlyNote: "Billed monthly, VAT included.",
    free: "Free",
    freeNote: "With a .alumhost.dev subdomain. Your own domain: {monthly}/mo or {yearly}/year.",
    from: "from {price}/mo",
  },

  home: {
    hero: {
      eyebrow: "Reina Mercedes, Seville",
      titleA: "Your business website,",
      titleEm: "made in the neighbourhood.",
      sub: "Websites and systems for bars, hair salons, academies and shops. We come to your place, explain it without jargon and, if something breaks, you message us on WhatsApp.",
      cta: "Ask for a visit",
      ctaSecondary: "See prices",
      plaque: { top: "Barrio de", name: "Reina Mercedes", bottom: "{name} · websites and systems" },
    },
    sectors: {
      title: "For the businesses around here.",
      items: [
        { name: "Bars and cafés", body: "Your menu on the phone with a QR code on the table, opening hours always up to date and how to get there." },
        { name: "Hair and beauty", body: "Your services and prices, photos of your work and a button to book." },
        { name: "Academies", body: "Timetables, groups and enrolment on one clear page, and notices for families in one place." },
        { name: "Shops", body: "What you sell, where you are and a direct WhatsApp so people can ask before they come." },
      ],
    },
    steps: {
      title: "How we work.",
      items: [
        { verb: "Visit", body: "We come to your business and look at how you work and what you need." },
        { verb: "Propose", body: "We tell you in writing what your website includes and what it costs. If it fits, you pay half and we start." },
        { verb: "Build", body: "We show it to you before it goes live and adjust it with you. On delivery, you pay the other half." },
        { verb: "Look after", body: "With maintenance, the site stays up to date and we make the small changes." },
      ],
    },
    prices: {
      title: "Clear prices.",
      sub: "You know what you pay before we start.",
      web: {
        name: "Your website",
        price: "849 €",
        note: "One payment: half when we start and half on delivery.",
        features: ["Made for your business, not a template", "Designed to look good on phones", "We show it to you before it goes live"],
      },
      care: {
        name: "Maintenance",
        price: "30 €",
        per: "/month",
        note: "So you never have to worry about anything technical.",
        features: ["Hosting and domain", "Backups", "Small changes every month, up to a limit", "Support on WhatsApp"],
        extra: "If one month you need more changes than are included, we tell you the price first.",
      },
      later: {
        name: "And later on",
        body: "Automating tasks you now do by hand, organising your business information and connecting the programs you already use. If that sounds like something you need, tell us.",
        cta: "Tell us",
      },
    },
    honest: {
      title: "What you will not get with us.",
      items: [
        { title: "A call centre.", body: "You message us on WhatsApp and we answer, not a ticket system." },
        { title: "A template you build yourself.", body: "With Wix and the like, you do the work. Here we do it and hand it over ready." },
        { title: "Words you do not understand.", body: "We explain it with examples from your business. If it is not clear, that is on us." },
        { title: "An agency that does not know your street.", body: "We meet at your place, in front of your counter, from day one." },
      ],
    },
    team: {
      title: "Who we are.",
      names: ["Alonso", "Blas"],
      and: "and",
      body: "We are computer science students in Seville. We started {name} so local businesses have someone to call when something online gets stuck: someone close by who speaks plainly.",
    },
    faq: {
      title: "Questions.",
      items: [
        {
          q: "What is a small change?",
          a: "Changing opening hours, a price, a photo or some text. They are included in maintenance up to a monthly limit. If you need more, we tell you the price first.",
        },
        {
          q: "How do I pay?",
          a: "The website in two halves: when we start and on delivery. Maintenance, every month. You pay by card from a link or a QR code, and maintenance can also be a direct debit.",
        },
        { q: "Do I need to know about computers?", a: "No. That is what we are here for. We explain just enough so you know what you have and how to ask for changes." },
        {
          q: "What if my business is not in Reina Mercedes?",
          a: "We start with the neighbourhood because it is close to us. If you are somewhere else, write to us and we will see.",
        },
      ],
    },
    closing: {
      title: "Shall we look at it at your place?",
      body: "Tell us what business you run and we will arrange a time to see it with you.",
      whatsapp: "Message us on WhatsApp",
    },
  },

  enterprise: {
    header: {
      title: "Your website built, hosted and looked after.",
      sub: "For businesses and associations. We build it, keep it up to date and you email us whenever you need a change. No lock-in, VAT invoice every month.",
    },
    recommended: "Most popular",
    per: "/month",
    setup: "Building the site: {price} once",
    setupCustom: "Setup: depends on the project",
    cta: "Ask for a quote",
    items: {
      presence: {
        name: "Presence",
        tagline: "So people find you on Google and on their phone.",
        features: ["One-page site: who you are, opening hours, map and contact", "Your own domain and HTTPS", "Backups", "1 small change per month"],
      },
      business: {
        name: "Business",
        tagline: "What almost any local business needs.",
        features: ["Up to 5 pages: services, menu or prices, gallery", "Contact or booking form", "Legal notice and privacy included", "Small changes whenever you need them", "Email support during business hours"],
      },
      managed: {
        name: "Managed server",
        tagline: "For an application, a shop or something custom.",
        features: ["Your own server for your application", "We set it up, update it and monitor it", "Daily backups", "Data processing agreement (GDPR)"],
      },
    },
    custom: {
      title: "Need something else?",
      body: "Online shop, intranet, moving a site you already have. Tell us and we will give you a fixed price.",
      cta: "Ask for a custom quote",
    },
    how: {
      title: "How it works",
      steps: [
        { h: "1. We talk", p: "You write to us or we have a 15 minute video call. You tell us what you need." },
        { h: "2. Quote", p: "A fixed price in writing. If it works for you, you accept it." },
        { h: "3. Site in 1 to 2 weeks", p: "We show it to you before publishing and adjust it with you." },
        { h: "4. We take care of it", p: "Every month the site stays up to date. You only write if you want a change." },
      ],
    },
    faq: {
      title: "Questions",
      items: [
        { q: "Is there a minimum term?", a: "No. Cancel whenever you want and take your site's files with you." },
        { q: "Is the domain mine?", a: "Yes, always in your name. We only manage it while you are with us." },
        { q: "Is there a contract and an invoice?", a: "A quote accepted in writing, one-page service terms and a VAT invoice every month." },
        { q: "What about data protection?", a: "If your site collects data (forms, bookings), we sign the data processing agreement required by the GDPR and the data stays in the European Union." },
        { q: "Who are you?", a: "Two engineers from the University of Seville. We run AlumHost, hosting for students, and apply the same infrastructure and security to businesses." },
      ],
    },
    final: {
      title: "Ask for your quote",
      body: "We reply within one working day. No commitment.",
      cta: "Write to us",
    },
  },

  plans: {
    picker: {
      legend: "What are you shipping?",
      options: { publish: "A static website", mini: "A small VPS", developer: "A VPS", pro: "A bigger VPS" },
      details: "See the full plan",
    },
    header: {
      title: "Clear plans, VAT included.",
      sub: "Beta prices, provisional until we measure real capacity. Pay yearly and the VPS plans come with 2 months free.",
    },
    billing: { label: "Billing period", yearly: "Yearly", monthly: "Monthly" },
    recommended: "Recommended to start",
    specs: {
      vcpu: "{n} vCPU",
      ramGb: "{n} GB RAM",
      ramMb: "{n} MB RAM",
      disk: "~{n} GB NVMe",
      ssh: "SSH with public key",
    },
    items: {
      publish: {
        name: "Publish",
        tagline: "For your portfolio or a project website.",
        features: ["Upload a .zip, a folder or your GitHub repo", "Automatic HTTPS", "Free on yourname.alumhost.dev", "Your own domain as an add-on (soon)", "No SSH access"],
      },
      mini: {
        name: "VPS Mini",
        tagline: "For a bot, a small API or learning Linux.",
        features: ["Shared IPv4 for web (80/443)"],
      },
      developer: {
        name: "VPS Developer",
        tagline: "For your thesis, an API or systems coursework.",
        features: ["Shared IPv4 for web (80/443)"],
      },
      pro: {
        name: "VPS Pro",
        tagline: "For heavier workloads or custom ports.",
        features: ["More CPU and disk (set during the beta)", "Optional dedicated IPv4 for any port"],
      },
    },
    custom: {
      title: "Need something else?",
      body: "More RAM, several services or something these plans do not cover. Tell us and we will email you a quote.",
      cta: "Ask for a quote",
    },
    addons: {
      title: "Add-ons",
      backup: {
        title: "Daily backup",
        line: "{plan}: {price}/mo, kept for {days} days.",
        note: "An automatic copy of your VPS every day.",
      },
      ipv4: {
        title: "Dedicated IPv4",
        body: "{price}/mo on VPS Pro. For games, VPNs or any port, with its own IP reputation.",
      },
    },
    faq: {
      title: "Questions",
      items: [
        { q: "Is VAT included?", a: "Yes. Every price on this page includes 21% Spanish VAT." },
        {
          q: "Why is yearly cheaper?",
          a: "Every card payment carries a fixed fee. Charging once a year makes it almost vanish, and we pass that on: 2 months free on the VPS plans.",
        },
        {
          q: "Do I get backups?",
          a: "Publish does not need them: your repository is the copy. On a VPS they are an add-on; without it, your data is your responsibility.",
        },
        {
          q: "What is not allowed?",
          a: "Crypto mining, network scanning, hosting phishing or sending spam. Outbound mail (25, 465 and 587) is closed by default.",
        },
        {
          q: "Do I get IPv6?",
          a: "Not yet. VPS plans ship with shared IPv4 for web (80/443). IPv6 comes once its isolation is tested.",
        },
        {
          q: "Is uptime guaranteed?",
          a: "There is no contractual SLA. It is a best-effort service, with no fine print.",
        },
        {
          q: "How do I pay?",
          a: "Nothing is charged through the website during the beta. When we open, payment goes through Stripe: we never see or store your card.",
        },
      ],
    },
  },

  contact: {
    header: {
      title: "Let's talk.",
      sub: "Tell us what business you run and what you would like. We reply ourselves and, if you want, we meet at your place.",
    },
    channels: {
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
      supportLabel: "Support",
      abuseLabel: "Report abuse",
      abuseNote: "We check it every day.",
    },
    form: {
      title: "Write to us",
      name: "Name",
      email: "Email",
      emailHelp: "The one you check every day. We will reply there.",
      referral: "Referral ID (optional)",
      referralHelp: "If someone gave you an ID, enter it here. If you do not have one, leave it empty.",
      reason: "Reason",
      reasons: {
        beta: "Reserve a beta spot",
        plans: "Question about plans",
        business: "I want a website for my business",
        custom: "Automate or organise something in my business",
        support: "I am a client and need a change",
        other: "Something else",
      },
      plan: "Plan you are interested in",
      planUnknown: "Not sure yet",
      message: "Message",
      messageHelp: "What business you run and what you would like. If you prefer a call, leave your phone number. At least 10 characters.",
      privacy: "We only use your details to reply to you.",
      privacyLink: "Privacy policy",
      submit: "Send",
      sending: "Sending",
      success: "Got it. We will write to {email} soon.",
      errors: {
        name: "Enter your name.",
        email: "Check your email: it should look like name@domain.com.",
        message: "Tell us a bit more (at least 10 characters).",
        turnstile: "Complete the verification before sending.",
        rateLimited: "Too many messages in a row. Wait a minute and try again.",
        server: "We could not send it. Try again or email us at {email}.",
      },
    },
  },

  privacy: {
    title: "Privacy.",
    updated: "Last updated: 30 September 2026.",
    sections: [
      {
        h: "Who processes your data",
        p: "{controller}. For anything about your data, write to {email}.",
      },
      {
        h: "What we collect",
        p: "From the contact and beta forms: name, email, reason, plan and message. From Publish: your site name, your university email, the files you upload and, if you publish from GitHub, the repository and commit. For the magic link we keep only an encrypted fingerprint (hash), never the link itself. For security your IP address is processed to stop spam and limit submissions, without storing it in our database.",
      },
      {
        h: "What for",
        p: "To reply to you, manage your beta place and run Publish: send you the publishing link, serve your site and tell you about anything that affects it (such as the yearly inactivity check). The legal basis is your consent when you send the form and, for Publish and paid plans, performing the service you ask for.",
      },
      {
        h: "Who we share it with",
        p: "With the providers that run the website: Cloudflare (hosting, the Publish database in the European Union, anti-spam checks and email forwarding), Brevo (sending the Publish link and our replies), Google (our inbox) and GitHub (only if you publish from a public repository). They may process data outside the European Economic Area with the safeguards required by the GDPR. We do not sell your data or use it for advertising.",
      },
      {
        h: "How long",
        p: "Enquiries: until resolved and at most twelve months. Publish: while you keep your site; if you delete it, we delete it and its files immediately, and links expire after 24 hours. If you become a paying customer, for as long as the law requires for invoices and contracts.",
      },
      {
        h: "Your rights",
        p: "You can ask for access, rectification, erasure, objection, restriction and portability by writing to {email}. If you think we got it wrong, you can complain to the Spanish Data Protection Agency (aepd.es).",
      },
      {
        h: "Cookies",
        p: "We use no analytics or advertising cookies. The Publish page keeps your link in your tab's storage (sessionStorage), which is cleared when you close it.",
      },
    ],
  },

  terms: {
    title: "Terms.",
    updated: "Last updated: 30 September 2026. Beta draft.",
    sections: [
      {
        h: "Who provides the service",
        p: [
          "AlumHost is run by {controller}. Write to {email} about anything and to {abuse} to report abuse.",
          "We are in beta: the service works, but it may change and there is no availability commitment (SLA) yet. We do our best to keep everything running and we tell you about any incident.",
        ],
      },
      {
        h: "Free Publish",
        p: [
          "Publish hosts static websites (HTML, CSS, JavaScript, images) at yourname.alumhost.dev. It is free and meant for learning and showing your projects.",
          "Only people with an email from the supported universities can use it. One site per person, within the limits shown on the Publish page (currently 20 MB, 1,000 files and 5 MB per file).",
          "What you publish is yours and you are responsible for it: you must have the right to use everything you upload (text, images, code) and follow the acceptable use policy.",
          "Inactivity: once a year we email you to confirm you still use the site. If you do not confirm within 30 days and have not updated it in the last 12 months, we suspend it, and after another 60 days without news we delete it and the name becomes free.",
          "You can delete your site at any time from the link we send to your email.",
        ],
      },
      {
        h: "Paid plans",
        p: [
          "Prices on the website include VAT. They are paid in advance, monthly or yearly, and renew automatically until you cancel.",
          "You can cancel at any time: the service runs until the end of the paid period and does not renew. We do not refund the unused part of a period, except for withdrawal and for serious failures on our side as explained below.",
          "If a payment fails we email you and you have 7 days to fix it. After that we suspend the server; before deleting it we keep a copy for 14 more days in case you come back.",
        ],
      },
      {
        h: "Right of withdrawal (14 days)",
        p: [
          "If you are a consumer in the European Union, you have 14 days from purchase to withdraw without giving reasons, by writing to {email}.",
          "Because the server is delivered immediately, when you buy we ask you to expressly agree that it starts before those 14 days end. If you withdraw, we refund what you paid minus the part proportional to the days it was running, within 14 days and using the same payment method.",
        ],
      },
      {
        h: "Refunds for our failures",
        p: [
          "If the service stops working because of us for more than 72 hours in a row in a month, you can ask for that month back. This does not cover outages caused by your own software, by abuse or by providers outside our control.",
        ],
      },
      {
        h: "Backups",
        p: [
          "Unless you buy the backup add-on, you are responsible for keeping copies of your data. For Publish, your copy is your own repository or folder.",
        ],
      },
      {
        h: "Suspension and removal",
        p: [
          "We may suspend a site or server without notice in cases of serious abuse (phishing, malware, attacks, illegal content) or when an authority asks us to. Otherwise we warn you first and give you time to fix it.",
          "While a service is suspended for abuse we keep its content for as long as needed to handle complaints.",
        ],
      },
      {
        h: "Liability",
        p: [
          "We are liable for damage we cause intentionally or through gross negligence. Otherwise our liability is limited to what you paid us in the last 12 months (Publish is free, so there is no amount). This does not limit any right you have as a consumer by law.",
        ],
      },
      {
        h: "Changes to these terms",
        p: [
          "If we change them in a significant way we email you 30 days in advance. If you disagree, you can cancel before they apply.",
        ],
      },
      {
        h: "Governing law",
        p: [
          "Spanish law applies. If you are a consumer, you can bring a claim before the courts where you live.",
        ],
      },
    ],
  },

  aup: {
    title: "Acceptable use.",
    updated: "Last updated: 30 September 2026. Beta draft.",
    sections: [
      {
        h: "The idea",
        p: [
          "AlumHost is for learning, building and showing projects. We share machines and a domain with other students, so what one person does affects everyone. This policy says what is not allowed on Publish or on the servers.",
        ],
      },
      {
        h: "Not allowed",
        p: [
          "Nothing illegal, and no links to it: content that infringes copyright or trademarks, child sexual abuse material, glorification of terrorism, incitement to hatred or harassment.",
          "Nothing that deceives or impersonates: phishing, pages that imitate the login of a university, a bank or another service, scams or fake shops.",
          "Nothing that attacks: malware, scanning other people's networks, denial of service attacks, brute force, open proxies or relays used for abuse.",
          "No bulk email: spam, bought lists or unsolicited mailings. Outbound port 25 is closed and submission ports are opened only on request on the plans that allow it.",
          "Nothing that exhausts the shared machine: cryptocurrency mining or workloads that use all the CPU or disk continuously.",
          "Nothing that processes other people's personal data without a legal basis, such as forms that collect passwords or third-party data.",
        ],
      },
      {
        h: "What we do if it happens",
        p: [
          "In serious cases we suspend immediately and, where appropriate, inform the authorities. Otherwise we write to you, give you time to fix it and, if it is not fixed, we suspend or close the service.",
        ],
      },
      {
        h: "Report abuse",
        p: [
          "If you see something hosted on AlumHost that breaks this policy, write to {abuse} with the exact address and what you saw. We review it as soon as possible.",
        ],
      },
    ],
  },

  publish: {
    cta: "Publish for free",
    title: "Publish your website for free",
    sub: "Your static site at yourname.alumhost.dev, with HTTPS, in a couple of minutes. No card and no account: we send a link to your university email.",
    steps: [
      "Pick your site name, your university and enter your email.",
      "Open the link we send you.",
      "Upload a .zip, a folder or your GitHub repository.",
    ],
    limits: "Up to 20 MB and 1,000 files per site, 5 MB per file. Static sites only: HTML, CSS, JavaScript and images. One site per person during the beta.",
    form: {
      title: "Start here",
      name: "Site name",
      nameHelp: "Lowercase letters, numbers and hyphens (2-30). It becomes yourname.alumhost.dev.",
      email: "Your university email",
      university: "Your university",
      universityPlaceholder: "Pick your university",
      emailHelp: "Enter just your username: the domain fills in once you pick your university.",
      acceptLinks: "Full conditions: {terms} and {aup}.",
      accept: "I won't publish anything illegal, misleading or impersonating anyone. I know AlumHost takes the site down if I do.",
      submit: "Send me the link",
      sending: "Sending…",
      success: "Done. We sent a link to {email}. Open it to upload your site; it works for 24 hours.",
    },
    errors: {
      name: "Use 2 to 30 characters: lowercase letters, numbers and hyphens, not starting or ending with a hyphen. Some names are reserved.",
      email: "Enter a valid email.",
      email_domain: "That email is not from one of the supported universities.",
      university: "Pick your university.",
      emailLocal: "Enter only the part of your email before the @.",
      accept: "You need to accept the conditions to publish.",
      turnstile: "Complete the anti-bot check.",
      name_taken: "Someone else already uses that name. Try another one.",
      one_site: "That email already has a site. Use the same name to update it.",
      rate_limited: "You asked for several links in a row. Wait a bit and try again.",
      suspended: "That site is suspended. Write to {email}.",
      server: "Something failed on our side. Try again in a minute or write to {email}.",
    },
    upload: {
      title: "Upload your website",
      loading: "Checking your link…",
      expired: "The link has expired or is not valid.",
      askNew: "Ask for a new link",
      current: "{url} now has {files} files ({size}), updated on {date}. Publishing again replaces it entirely.",
      empty: "{url} is still empty. Upload your site and it goes live right away.",
      tabs: { zip: ".zip file", folder: "Folder", github: "GitHub" },
      zipLabel: "Choose the .zip of your site",
      zipHelp: "It must contain an index.html, at the root or inside a single folder.",
      folderLabel: "Choose your site's folder",
      folderHelp: "The folder that holds index.html. Your browser will ask whether to upload its files.",
      githubRepo: "Repository",
      githubRepoHelp: "Public, as user/repository or its GitHub link.",
      githubBranch: "Branch",
      githubDir: "Folder inside the repository",
      githubDirHelp: "Empty if index.html is at the root. If you use a generator, its output folder (for example dist or public, already built and pushed).",
      publish: "Publish",
      reading: "Reading the files…",
      progress: "Uploading {done} of {total} files…",
      done: "Published. Your site is live at {url}",
      view: "View my site",
      delete: "Delete my site",
      deleteConfirm: "Sure? The site and all its files are deleted, and the name becomes free.",
      deleted: "Your site has been deleted.",
      update: "To update it later, ask for a new link with the same name and email, and publish again.",
      confirmLead: "Confirm that you still use your site and we will keep it online. If it was suspended, it goes back online right away.",
      confirmButton: "Keep my site",
      confirmed: "Done. {url} stays online. We will ask again in a year.",
      errors: {
        nothing: "First choose a file, a folder or a repository.",
        no_index: "index.html is missing.",
        too_many_files: "Too many files (the limit is 1,000).",
        site_too_big: "The site is larger than 20 MB.",
        file_too_big: "The file {path} is larger than 5 MB. Compress images and videos, or link them from elsewhere.",
        bad_path: "The name {path} is not allowed: use letters, numbers, hyphens and dots, with no hidden folders.",
        not_zip: "That file is not a valid .zip.",
        zip64: "That .zip is too big or uses a format we don't support.",
        encrypted: "The .zip is password protected.",
        method: "The .zip uses a compression we don't support. Create it again with your system's normal option.",
        github: "I can't find that repository, branch or folder. Is it public?",
        github_fetch: "GitHub didn't give us a file. Try again in a moment.",
        name_taken: "Someone else already published that name.",
        one_site: "Your email already has another site.",
        session: "The link has expired. Ask for a new one.",
        rate_limited: "Too many actions in a row. Wait a minute and try again.",
        suspended: "This site is suspended pending an abuse review. Write to abuse@alumhost.dev.",
        server: "Something failed on our side. Try again in a minute.",
      },
    },
  },

  beta: {
    status: "Beta open",
    titleA: "Become a beta",
    titleEm: "tester.",
    sub: "We have not launched yet. We start once a minimum number of people have signed up.",
    free: "Signing up is free and commits you to nothing.",
    cta: "Sign me up",
    gains: {
      title: "What you get.",
      items: [
        {
          title: "Price locked for a year.",
          body: "Your plan's price does not go up during your first year, even if we change prices after the beta.",
        },
        { title: "Backup included for a year.", body: "On VPS plans, the daily backup is included for the first year at no extra cost." },
        {
          title: "Your first deploy, with us.",
          body: "We set it up with you and help you claim the free domain from the GitHub Student Pack.",
        },
        {
          title: "You talk to us.",
          body: "No tickets, no bots. The same people who set up your server answer you.",
        },
      ],
    },
    steps: {
      title: "How it works.",
      items: [
        { verb: "Sign up", body: "Fill in the form below. It is free and you pay nothing upfront." },
        { verb: "Decide", body: "Once we reach the minimum we email you. Then you decide whether to go ahead." },
        { verb: "Start", body: "Your first month starts the day we give you access to your server, not before." },
      ],
    },
    referrals: {
      title: "If we gave you an ID, share it.",
      body: "We hand out the IDs ourselves. When someone signs up with yours, we check it and confirm it by hand.",
      items: [
        "1 confirmed referral: you appear on the beta wall (coming soon) and get priority if places are limited.",
        "2 or more confirmed referrals: one more month of frozen price for each referral, counting the first one too.",
      ],
    },
    signup: {
      title: "Sign up.",
      message: "What do you want to build?",
      body: "We will email you when there is a date. Until then, we send you nothing else.",
      messageHelp:
        "What you want to run and how much RAM you think you need. If you are not sure, tell us about the project and we will help. At least 10 characters.",
      submit: "Join the beta",
      success: "You are in. We will email {email} when there is a date.",
    },
    faq: {
      title: "Questions.",
      items: [
        {
          q: "When do I pay?",
          a: "Nothing now. Once we reach the minimum we email you with your plan's price. If you go ahead, you pay and your first month starts the day you get access to your server.",
        },
        { q: "What if you do not reach the minimum?", a: "Nobody is charged anything. We will still let you know what we do." },
        { q: "How do I leave the list?", a: "Reply to any of our emails asking to be removed and we take you off." },
        {
          q: "What data do you keep?",
          a: "What you enter in the form: name, email, plan and message, only to write to you about the beta. The rest is in our",
        },
      ],
      privacyLink: "privacy policy",
    },
  },

  footer: {
    tagline: "Websites and systems for businesses in Reina Mercedes, Seville.",
    status: "Service status",
    devlog: "Devlog",
    repo: "Open source",
    privacy: "Privacy",
    terms: "Terms",
    aup: "Acceptable use",
    beta: "Beta",
    rights: "© {year} {name}",
  },

  notFound: {
    title: "This page does not exist.",
    body: "The link may be wrong, or we moved the page.",
    back: "Back to home",
  },
};

export default en;
