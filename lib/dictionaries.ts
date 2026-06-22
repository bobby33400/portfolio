import type { ProjectId } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

export type Dictionary = {
  nav: { work: string; about: string; contact: string };
  hero: {
    role: string;
    availability: string;
    intro: string;
    viewWork: string;
    getInTouch: string;
    resume: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    noteLabel: string;
    liveLabel: string;
    codeLabel: string;
    items: Record<ProjectId, { description: string; note: string }>;
  };
  about: {
    eyebrow: string;
    title: string;
    location: string;
    paragraphs: string[];
    skillsTitle: string;
    skills: string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    blurb: string;
    connect: string;
  };
  footer: { rights: string; builtWith: string };
  ui: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toLight: string;
    toDark: string;
    switchLanguage: string;
  };
};

const en: Dictionary = {
  nav: { work: "Work", about: "About", contact: "Contact" },
  hero: {
    role: "Software Engineering Student",
    availability: "Open to internships & working-student roles",
    intro:
      "I'm a software engineering student in Heilbronn who loves building innovative things and solving real problems.",
    viewWork: "View my work",
    getInTouch: "Get in touch",
    resume: "Résumé",
  },
  projects: {
    eyebrow: "Selected work",
    title: "Projects",
    noteLabel: "My take",
    liveLabel: "live site",
    codeLabel: "source code",
    items: {
      chargestay: {
        description:
          "Germany's first peer-to-peer marketplace for private EV charging. Drivers find and book a private Wallbox nearby on a live map — filtered by plug type, power and availability — and pay securely through Stripe, while hosts list their own Wallbox and earn passive income.",
        note: "I'm building ChargeStay end to end — from the live map and booking flow to the Stripe payments and the host side. It taught me how much trust a real product has to earn when people put both their money and their charger on the line.",
      },
      lea: {
        description:
          "A menu-bar app that turns Claude into an overnight worker. Lea watches your Claude usage limits and autonomously runs a queue of tasks whenever capacity is free — pausing when you hit a limit and resuming the exact moment it resets. Queue work before bed, wake up to it done. Open source (MIT), cross-platform with sandboxed execution.",
        note: "Lea scratched my own itch — I hated watching Claude sit idle after a 3am limit reset. Building the reset-aware retry logic and safe, sandboxed headless execution taught me a lot about reliability and doing real work while the user is away.",
      },
      synqro: {
        description:
          "A coordination app for groups and communities planning events together. Synqro keeps everyone in sync with shared deadlines for the tasks that need to get done, attendance lists, a photo-consent privacy policy (DSGVO) for events with students, and a place for people to record allergies so no one is left out.",
        note: "I designed Synqro around a frustration I kept running into: group events fall apart in the small details. My focus was making coordination — deadlines, attendance, dietary needs, data-protection consent — feel effortless and privacy-first.",
      },
      protrack: {
        description:
          "A supplement-tracking app that makes sure you never miss a dose. ProTrack sends timely notifications for your protein, creatine and other supplements, so your routine stays on track without you having to think about it.",
        note: "ProTrack started as a personal tool — I wanted a no-nonsense reminder for my own supplement routine. Building it sharpened my eye for notification timing and the kind of small, reliable UX that makes a habit actually stick.",
      },
    },
  },
  about: {
    eyebrow: "About",
    title: "A bit about me",
    location: "Heilbronn, Germany",
    paragraphs: [
      "I'm a software engineering student at Heilbronn University (HHN), driven by curiosity — I'm always looking to build something innovative and to solve real problems with clean, thoughtful engineering.",
      "I work mostly with Java, love building and setting up PCs from scratch, and I know how to put AI to work as a tool that makes me faster and sharper. Right now I'm open to internships and working-student roles.",
    ],
    skillsTitle: "Tools & tech",
    skills: [
      "Java",
      "Problem Solving",
      "AI Tools",
      "PC Building & Setup",
      "Git",
      "Software Engineering",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build something together",
    blurb:
      "Open to internships and working-student roles. Have something in mind or just want to connect? My inbox is always open.",
    connect: "Let's connect",
  },
  footer: {
    rights: "All rights reserved.",
    builtWith: "Built with Next.js & Tailwind CSS.",
  },
  ui: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    switchLanguage: "Switch language",
  },
};

const de: Dictionary = {
  nav: { work: "Projekte", about: "Über mich", contact: "Kontakt" },
  hero: {
    role: "Software-Engineering-Student",
    availability: "Offen für Praktika & Werkstudentenstellen",
    intro:
      "Ich bin Software-Engineering-Student in Heilbronn und liebe es, Innovatives zu bauen und echte Probleme zu lösen.",
    viewWork: "Meine Projekte",
    getInTouch: "Kontakt aufnehmen",
    resume: "Lebenslauf",
  },
  projects: {
    eyebrow: "Ausgewählte Projekte",
    title: "Projekte",
    noteLabel: "Meine Sicht",
    liveLabel: "Live-Seite",
    codeLabel: "Quellcode",
    items: {
      chargestay: {
        description:
          "Deutschlands erster Peer-to-Peer-Marktplatz für privates E-Auto-Laden. Fahrer finden und buchen eine private Wallbox in der Nähe über eine Live-Karte – gefiltert nach Steckertyp, Leistung und Verfügbarkeit – und zahlen sicher über Stripe, während Hosts ihre eigene Wallbox vermieten und passives Einkommen verdienen.",
        note: "Ich baue ChargeStay von A bis Z – von der Live-Karte und dem Buchungsflow bis zu den Stripe-Zahlungen und der Host-Seite. Dabei habe ich gelernt, wie viel Vertrauen ein echtes Produkt verdienen muss, wenn Menschen ihr Geld und ihre Ladestation anvertrauen.",
      },
      lea: {
        description:
          "Eine Menüleisten-App, die Claude zum Nachtschicht-Arbeiter macht. Lea überwacht deine Claude-Nutzungslimits und arbeitet eine Aufgaben-Warteschlange autonom ab, sobald wieder Kapazität frei ist – sie pausiert beim Erreichen des Limits und macht genau zum Reset weiter. Aufgaben vor dem Schlafen einreihen, fertig aufwachen. Open Source (MIT), plattformübergreifend mit sandboxed Ausführung.",
        note: "Lea ist aus meinem eigenen Bedürfnis entstanden – ich fand es ärgerlich, wie Claude nach einem Limit-Reset um 3 Uhr nachts ungenutzt blieb. Das Entwickeln der reset-bewussten Retry-Logik und der sicheren, sandboxed Ausführung im Hintergrund hat mir viel über Zuverlässigkeit beigebracht.",
      },
      synqro: {
        description:
          "Eine Koordinations-App für Gruppen und Communities, die gemeinsam Events planen. Synqro hält alle auf dem gleichen Stand: mit gemeinsamen Deadlines für anstehende Aufgaben, Anwesenheitslisten, einer Datenschutzerklärung (DSGVO) für Fotos bei Veranstaltungen mit Schülern und einem Ort, an dem jeder seine Allergien hinterlegen kann, damit niemand außen vor bleibt.",
        note: "Synqro ist aus einem Frust entstanden, den ich immer wieder erlebt habe: Gruppen-Events scheitern an den kleinen Details. Mir war wichtig, Koordination – Deadlines, Anwesenheit, Allergien, Datenschutz-Einwilligung – mühelos und datenschutzfreundlich zu machen.",
      },
      protrack: {
        description:
          "Eine Supplement-Tracking-App, mit der du keine Einnahme mehr vergisst. ProTrack schickt dir rechtzeitige Benachrichtigungen für dein Protein, Kreatin und weitere Supplements, damit deine Routine ganz nebenbei läuft.",
        note: "ProTrack ist als persönliches Tool entstanden – ich wollte eine unkomplizierte Erinnerung für meine eigene Supplement-Routine. Beim Bauen habe ich ein Gespür für das richtige Timing von Benachrichtigungen und für kleine, verlässliche UX entwickelt, die eine Gewohnheit wirklich festigt.",
      },
    },
  },
  about: {
    eyebrow: "Über mich",
    title: "Ein bisschen über mich",
    location: "Heilbronn, Deutschland",
    paragraphs: [
      "Ich bin Software-Engineering-Student an der Hochschule Heilbronn (HHN) und von Neugier getrieben – ich möchte immer etwas Innovatives bauen und echte Probleme mit sauberem, durchdachtem Engineering lösen.",
      "Ich arbeite hauptsächlich mit Java, baue und richte mit Begeisterung PCs von Grund auf ein und weiß, wie ich KI als Werkzeug einsetze, das mich schneller und besser macht. Aktuell bin ich offen für Praktika und Werkstudententätigkeiten.",
    ],
    skillsTitle: "Tools & Technik",
    skills: [
      "Java",
      "Problemlösung",
      "KI-Tools",
      "PC-Zusammenbau & Einrichtung",
      "Git",
      "Software Engineering",
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Lass uns zusammen etwas bauen",
    blurb:
      "Offen für Praktika und Werkstudentenstellen. Du hast etwas im Kopf oder möchtest dich einfach vernetzen? Mein Postfach ist immer offen.",
    connect: "Lass uns vernetzen",
  },
  footer: {
    rights: "Alle Rechte vorbehalten.",
    builtWith: "Erstellt mit Next.js & Tailwind CSS.",
  },
  ui: {
    skipToContent: "Zum Inhalt springen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    toLight: "Zum hellen Modus wechseln",
    toDark: "Zum dunklen Modus wechseln",
    switchLanguage: "Sprache wechseln",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, de };
