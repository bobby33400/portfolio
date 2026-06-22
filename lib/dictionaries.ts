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
    availability: "Open to internships and working student roles",
    intro:
      "I'm a software engineering student in Heilbronn. I love building new things and figuring out real problems.",
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
          "Germany's first marketplace where people rent out their own EV chargers. Drivers find a free Wallbox nearby on a live map, filter by plug type, power and availability, and pay securely through Stripe. If you own a Wallbox, you list it and earn a bit on the side.",
        note: "I'm building ChargeStay from end to end, from the live map and booking flow to the Stripe payments and the host side. It taught me how much trust a real product has to earn when people put both their money and their charger on the line.",
      },
      lea: {
        description:
          "A little menu bar app that keeps Claude working while you sleep. Lea watches your usage limit and works through a queue of tasks on its own whenever you have capacity. When you hit the limit it pauses, then picks right back up the moment it resets. Line up tasks before bed and wake up to them done. It's open source (MIT) and runs safely sandboxed on Mac, Windows and Linux.",
        note: "Lea started as my own annoyance. I hated watching Claude sit idle after the limit reset at 3am. Building the logic that knows exactly when the limit comes back, and running everything safely in the background, taught me a lot about reliability and getting real work done while you're away.",
      },
      synqro: {
        description:
          "An app for groups and communities that plan events together. Synqro keeps everyone on the same page with shared deadlines for the things that need doing, attendance lists, a photo consent step (DSGVO) for events with students, and a place where people can note their allergies so no one gets left out.",
        note: "The idea hit me on a two day CERN trip with three of our professors. On day two we had to get to CERN on our own, but nobody in my group knew that, and the plan the professor gave us before the trip was already out of date, so we almost missed the second day of the excursion. On top of that, the professors wanted to put our photos on the HHN website, so they went around asking every student to sign for permission by hand. Synqro is my answer to both: one place that always has the current plan, and a built in way to collect photo consent.",
      },
      protrack: {
        description:
          "A simple app so you never miss a dose of your supplements. ProTrack reminds you to take your protein, creatine and whatever else you're on, so your routine keeps running without you having to think about it.",
        note: "My friend and I go to the gym together, and we used to remind each other over WhatsApp to take our supplements. Some days we both just forgot, so I built ProTrack to do the reminding for us. Now neither of us has to think about it.",
      },
    },
  },
  about: {
    eyebrow: "About",
    title: "A bit about me",
    location: "Heilbronn, Germany",
    paragraphs: [
      "I'm a software engineering student at Heilbronn University (HHN), and I'm naturally curious. I always want to build something new and solve real problems with clean, thoughtful code.",
      "I work mostly with Java, I love building and setting up PCs from scratch, and I know how to use AI as a tool that makes me faster and sharper. Right now I'm open to internships and working student roles.",
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
      "Open to internships and working student roles. Got something in mind, or just want to say hi? My inbox is always open.",
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
    role: "Software Engineering Student",
    availability: "Offen für Praktika und Werkstudentenstellen",
    intro:
      "Ich bin Software Engineering Student in Heilbronn. Ich baue gerne Neues und tüftle an echten Problemen.",
    viewWork: "Meine Projekte",
    getInTouch: "Kontakt aufnehmen",
    resume: "Lebenslauf",
  },
  projects: {
    eyebrow: "Ausgewählte Projekte",
    title: "Projekte",
    noteLabel: "Meine Sicht",
    liveLabel: "Website",
    codeLabel: "Quellcode",
    items: {
      chargestay: {
        description:
          "Deutschlands erster Marktplatz, auf dem Privatpersonen ihre eigene Wallbox zum Laden von Elektroautos vermieten. Fahrer finden eine freie Wallbox in der Nähe auf einer Karte in Echtzeit, filtern nach Steckertyp, Leistung und Verfügbarkeit und zahlen sicher über Stripe. Wer eine Wallbox hat, bietet sie an und verdient nebenbei etwas dazu.",
        note: "Ich baue ChargeStay von A bis Z, von der Karte und dem Buchungsablauf bis zu den Zahlungen über Stripe und der Seite für Gastgeber. Dabei habe ich gelernt, wie viel Vertrauen ein echtes Produkt verdienen muss, wenn Menschen ihm ihr Geld und ihre Ladestation anvertrauen.",
      },
      lea: {
        description:
          "Eine kleine App in der Menüleiste, die Claude für dich weiterarbeiten lässt, während du schläfst. Lea behält dein Nutzungslimit im Blick und arbeitet eine Liste von Aufgaben von allein ab, sobald wieder Kapazität frei ist. Beim Limit macht sie Pause und setzt genau dann fort, wenn es zurückgesetzt wird. Aufgaben vor dem Schlafen anlegen und am Morgen ist alles erledigt. Open Source (MIT) und sicher abgeschottet auf Mac, Windows und Linux.",
        note: "Lea ist aus meinem eigenen Ärger entstanden. Es hat mich gestört, dass Claude nachts um 3, kurz nachdem das Limit zurückgesetzt wurde, einfach ungenutzt blieb. Die Logik zu bauen, die genau weiß, wann es wieder losgeht, und alles sicher im Hintergrund laufen zu lassen, hat mir viel über Zuverlässigkeit beigebracht.",
      },
      synqro: {
        description:
          "Eine App, mit der Gruppen und Gemeinschaften gemeinsam Events planen. Synqro hält alle auf dem gleichen Stand: mit gemeinsamen Fristen für anstehende Aufgaben, Anwesenheitslisten, einer Einwilligung für Fotos (DSGVO) bei Veranstaltungen mit Schülern und einem Ort, an dem jeder seine Allergien hinterlegen kann, damit niemand außen vor bleibt.",
        note: "Die Idee kam mir auf einer zweitägigen CERN Exkursion mit drei unserer Professoren. Am zweiten Tag mussten wir auf eigene Faust zum CERN kommen, aber das wusste in meiner Gruppe niemand, und der Plan, den uns der Professor vor der Fahrt gegeben hatte, war schon nicht mehr aktuell, sodass wir den zweiten Tag der Exkursion fast verpasst hätten. Dazu kam, dass die Professoren unsere Fotos auf die HHN Webseite stellen wollten und dafür jeden Studenten einzeln um eine Unterschrift baten. Synqro ist meine Antwort auf beides: ein Ort, an dem der Plan immer aktuell ist, und eine eingebaute Möglichkeit, die Einwilligung für Fotos einzuholen.",
      },
      protrack: {
        description:
          "Eine einfache App, mit der du keine Einnahme deiner Supplements mehr vergisst. ProTrack erinnert dich an Protein, Kreatin und alles andere, was du nimmst, sodass deine Routine ganz nebenbei läuft.",
        note: "Mein Freund und ich gehen zusammen ins Fitnessstudio und haben uns früher per WhatsApp daran erinnert, unsere Supplements zu nehmen. An manchen Tagen haben wir es beide einfach vergessen, also habe ich ProTrack gebaut, das uns das Erinnern abnimmt. Jetzt muss keiner von uns mehr daran denken.",
      },
    },
  },
  about: {
    eyebrow: "Über mich",
    title: "Ein bisschen über mich",
    location: "Heilbronn, Deutschland",
    paragraphs: [
      "Ich bin Software Engineering Student an der Hochschule Heilbronn (HHN) und von Natur aus neugierig. Ich will immer etwas Neues bauen und echte Probleme mit sauberem, durchdachtem Code lösen.",
      "Ich arbeite hauptsächlich mit Java, baue und richte mit Begeisterung PCs von Grund auf ein und weiß, wie ich KI als Werkzeug nutze, das mich schneller und besser macht. Aktuell bin ich offen für Praktika und Werkstudentenstellen.",
    ],
    skillsTitle: "Tools & Technik",
    skills: [
      "Java",
      "Problemlösung",
      "KI Tools",
      "PC Zusammenbau & Einrichtung",
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
