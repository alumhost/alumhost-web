/**
 * English copy. Must mirror es.ts exactly (enforced by the Dict type). Same writing rules as es.ts.
 */
import type { Dict } from "./es";

const en: Dict = {
  meta: {
    home: {
      title: "Patio · VPS and websites for students, with human support",
      description:
        "Boutique hosting for students and developers: static sites and SSH-ready VPS, VAT included, with a 1:1 onboarding call.",
    },
    plans: {
      title: "Plans and pricing · Patio",
      description: "Publish, VPS Developer and VPS Pro. Clear prices with VAT included, billed yearly by default.",
    },
    contact: {
      title: "Contact · Patio",
      description: "Reserve a spot in the private beta or ask us anything. A real person replies.",
    },
    notFound: { title: "Page not found · Patio", description: "This page does not exist." },
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
    yearlyTotal: "{total} per year, VAT included",
    monthlyTotal: "Billed monthly, VAT included",
    from: "from {price}/mo",
  },

  home: {
    hero: {
      eyebrow: "Private beta open",
      titleA: "VPS and websites for students, with support from",
      titleEm: "real people.",
      sub: "For your thesis, your coursework or your first project. We do your first setup with you, 1:1.",
      ctaSecondary: "See plans",
      picker: {
        legend: "What are you shipping?",
        options: {
          publish: "A static website",
          developer: "A server (VPS)",
          pro: "Something heavier",
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
        { title: "Outbound email.", body: "Port 25 stays closed so nobody burns the IP we all share." },
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
      sub: "Beta prices, provisional until we measure real capacity. Yearly billing is cheaper, for you and for us.",
    },
    billing: { label: "Billing period", yearly: "Yearly", monthly: "Monthly" },
    recommended: "Recommended to start",
    specs: {
      vcpu: "{n} vCPU",
      ram: "{n} GB RAM",
      disk: "~{n} GB NVMe",
      ssh: "SSH with public key",
    },
    items: {
      publish: {
        name: "Publish",
        tagline: "For your portfolio or a project website.",
        features: ["Deploy with git push", "Automatic HTTPS", "Subdomain or your own domain", "No SSH access"],
      },
      developer: {
        name: "VPS Developer",
        tagline: "For your thesis, an API or systems coursework.",
        features: ["Your own IPv6", "Shared IPv4 for web (80/443)"],
      },
      pro: {
        name: "VPS Pro",
        tagline: "For heavier workloads or custom ports.",
        features: ["More CPU and disk (set during the beta)", "Optional dedicated IPv4 for any port"],
      },
    },
    addons: {
      title: "Add-ons",
      backup: {
        title: "Daily backup",
        line: "{plan}: {price}/mo, kept for {days} days.",
        note: "We test real restores, not just backups.",
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
          a: "Every card payment carries a fixed fee. Charging once a year makes it almost vanish, and we pass that on.",
        },
        {
          q: "Do I get backups?",
          a: "Publish does not need them: your repository is the copy. On a VPS they are an add-on; without it, your data is your responsibility.",
        },
        {
          q: "What is not allowed?",
          a: "Sending mail over port 25, crypto mining, network scanning or hosting phishing.",
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
      abuseLabel: "Report abuse",
      abuseNote: "We reply within 24-48 business hours.",
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
        support: "Help with my service",
        other: "Something else",
      },
      plan: "Plan you are interested in",
      planUnknown: "Not sure yet",
      message: "Message",
      messageHelp: "Tell us what you want to build. At least 10 characters.",
      privacy: "We only use your details to reply to you.",
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

  footer: {
    tagline: "Boutique hosting for students and developers.",
    status: "Service status",
    devlog: "Devlog",
    repo: "Open source",
    rights: "© {year} {name}",
  },

  notFound: {
    title: "This page does not exist.",
    body: "The link may be wrong, or we moved the page.",
    back: "Back to home",
  },
};

export default en;
