/**
 * English copy. Must mirror es.ts exactly (enforced by the Dict type). Same writing rules as es.ts.
 */
import type { Dict } from "./es";

const en: Dict = {
  meta: {
    home: {
      title: "{name} · VPS and websites for students, with human support",
      description:
        "Boutique hosting for students and developers: static sites and SSH-ready VPS, VAT included, with a 1:1 onboarding call.",
    },
    plans: {
      title: "Plans and pricing · {name}",
      description: "Free Publish, VPS Mini, VPS Developer and VPS Pro. Round prices with VAT included and 2 months free when paying yearly.",
    },
    contact: {
      title: "Contact · {name}",
      description: "Reserve a spot in the private beta or ask us anything. A real person replies.",
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
    notFound: { title: "Page not found · {name}", description: "This page does not exist." },
  },

  nav: {
    plans: "Plans",
    contact: "Contact",
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
      eyebrow: "Private beta open",
      titleA: "Your server, set up",
      titleEm: "with you.",
      sub: "VPS and static sites for students and developers. We do your first setup together, 1:1.",
      ctaSecondary: "See plans",
      picker: {
        legend: "What are you shipping?",
        options: {
          publish: "A static website",
          mini: "A small VPS",
          developer: "A VPS",
          pro: "A bigger VPS",
        },
        details: "See the full plan",
      },
    },
    proof: {
      label: "Already true today",
      items: [
        { title: "VAT included", body: "The price you see is the price you pay." },
        { title: "In euros", body: "No international card, no invoices in dollars." },
        { title: "A person answers", body: "No bots, no ticket queue." },
        { title: "Price locked", body: "Join the beta and your first year does not go up." },
      ],
    },
    perks: {
      title: "How we work.",
      items: [
        {
          title: "A person, not a ticket.",
          body: "Your first setup happens with us on a video call or in person. After that, we keep answering ourselves.",
        },
        {
          title: "Built for university.",
          body: "Theses, coursework, systems labs and hackathons. Billed in euros, no international card needed.",
        },
        {
          title: "Student pricing, no coupons.",
          body: "No discounts to ask for and no small print: the price you see is the student price, for everyone.",
        },
        {
          title: "Automated, not improvised",
          body: "Creating, removing and isolating a server are concrete, repeatable commands, not manual steps that depend on someone's memory.",
        },
      ],
    },
    steps: {
      title: "How you start.",
      items: [
        { verb: "Choose", body: "A static site or a VPS, depending on what you are shipping." },
        { verb: "Reserve", body: "We are in private beta. Leave your details and we write back when a spot opens." },
        { verb: "Launch", body: "We onboard you together and hand over your SSH access or your HTTPS site." },
      ],
    },
    honest: {
      title: "What we will not promise you.",
      items: [
        { title: "An SLA.", body: "This is a best-effort service, and we say so before you pay." },
        { title: "The lowest price.", body: "Big clouds win on specs. We compete on help and being close by." },
        { title: "Backups you did not order.", body: "Without the backup add-on, the data on your VPS is your responsibility." },
        {
          title: "Outbound email.",
          body: "Port 25 is closed. So are 465 and 587, unless you ask us to open them for your project.",
        },
      ],
    },
    closing: {
      title: "The beta is small on purpose.",
      body: "Few spots, direct contact and beta conditions. Reserve yours and we will write back.",
    },
  },

  plans: {
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
      sub: "To reserve a beta spot, ask about a plan or get help. A real person replies.",
    },
    channels: {
      emailLabel: "Email",
      supportLabel: "Support",
      abuseLabel: "Report abuse",
      abuseNote: "We check it every day.",
    },
    form: {
      title: "Write to us",
      name: "Name",
      email: "Email",
      emailHelp: "The one you check every day. We will reply there.",
      reason: "Reason",
      reasons: {
        beta: "Reserve a beta spot",
        plans: "Question about plans",
        custom: "I need something custom",
        support: "Help with my service",
        other: "Something else",
      },
      plan: "Plan you are interested in",
      planUnknown: "Not sure yet",
      message: "Message",
      messageHelp: "Tell us what you want to build. At least 10 characters.",
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
      "Pick your site name and enter your US email.",
      "Open the link we send you.",
      "Upload a .zip, a folder or your GitHub repository.",
    ],
    limits: "Up to 20 MB and 1,000 files per site, 5 MB per file. Static sites only: HTML, CSS, JavaScript and images. One site per person during the beta.",
    form: {
      title: "Start here",
      name: "Site name",
      nameHelp: "Lowercase letters, numbers and hyphens (2-30). It becomes yourname.alumhost.dev.",
      email: "Your university email",
      emailHelp: "For now, only the University of Seville: @us.es or @alum.us.es.",
      acceptLinks: "Full conditions: {terms} and {aup}.",
      accept: "I won't publish anything illegal, misleading or impersonating anyone. I know AlumHost takes the site down if I do.",
      submit: "Send me the link",
      sending: "Sending…",
      success: "Done. We sent a link to {email}. Open it to upload your site; it works for 24 hours.",
    },
    errors: {
      name: "Use 2 to 30 characters: lowercase letters, numbers and hyphens, not starting or ending with a hyphen. Some names are reserved.",
      email: "Enter a valid email.",
      email_domain: "For now we only accept @us.es and @alum.us.es emails.",
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
    tagline: "Boutique hosting for students and developers.",
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
