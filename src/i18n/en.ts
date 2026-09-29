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
      description: "Publish, VPS Mini, VPS Developer and VPS Pro. Round prices with VAT included and 2 months free when paying yearly.",
    },
    contact: {
      title: "Contact · {name}",
      description: "Reserve a spot in the private beta or ask us anything. A real person replies.",
    },
    privacy: {
      title: "Privacy · {name}",
      description: "What data the contact form collects, why, and how to exercise your rights.",
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
          title: "Student pricing.",
          body: "Write to us from your university email and we apply the student discount.",
        },
        {
          title: "Built in the open.",
          body: "We publish how it works: network isolation, the scripts, and what we learn along the way.",
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
        features: ["Deploy with git push", "Automatic HTTPS", "Subdomain or your own domain", "No SSH access"],
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
      emailHelp: "Use your university email and we can apply student pricing.",
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
        p: "With the providers that run the site: Cloudflare (hosting, anti-spam check and email forwarding) and Google (our inbox). They may process it outside the European Economic Area under the safeguards the GDPR requires. We never sell your data or use it for advertising.",
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

  footer: {
    tagline: "Boutique hosting for students and developers.",
    status: "Service status",
    devlog: "Devlog",
    repo: "Open source",
    privacy: "Privacy",
    rights: "© {year} {name}",
  },

  notFound: {
    title: "This page does not exist.",
    body: "The link may be wrong, or we moved the page.",
    back: "Back to home",
  },
};

export default en;
