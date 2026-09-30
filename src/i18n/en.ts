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
    updated: "Last updated: 29 September 2026.",
    sections: [
      {
        h: "Who handles your data",
        p: "{controller}. For anything about your data, write to {email}.",
      },
      {
        h: "What we collect",
        p: "What you type into the contact form: name, email, reason, plan and message. Your IP address is also processed for security, only to stop spam and rate-limit messages.",
      },
      {
        h: "Why",
        p: "To reply to you and, if you ask, to manage your beta spot. The legal basis is your consent when you send the form and, if you are about to sign up, steps taken before a contract.",
      },
      {
        h: "Who we share it with",
        p: "With the providers that run the site: Cloudflare (hosting, anti-spam check and email forwarding), Google (our inbox) and Brevo (sending our replies). They may process it outside the European Economic Area under the safeguards the GDPR requires. We never sell your data or use it for advertising.",
      },
      {
        h: "How long",
        p: "Until your question is solved and for twelve months at most. If you become a customer, as long as the law requires.",
      },
      {
        h: "Your rights",
        p: "You can ask for access, correction, deletion, objection, restriction and portability by writing to {email}. If you think we got it wrong, you can complain to the Spanish Data Protection Agency (aepd.es).",
      },
      {
        h: "Cookies",
        p: "We use no analytics or advertising cookies.",
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
