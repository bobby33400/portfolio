/**
 * Stable, language-independent content: links, emails, tech tags.
 * Translated text (descriptions, about, labels) lives in lib/dictionaries.ts.
 */

export type SocialIcon = "github" | "linkedin" | "twitter" | "mail" | "globe";

export type Social = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export type ProjectId = "chargestay" | "lea" | "synqro" | "protrack";

export type ProjectMeta = {
  id: ProjectId;
  title: string;
  tech: string[];
  live?: string;
  github?: string;
  /** path under /public, e.g. "/projects/chargestay.png" */
  image?: string;
  featured?: boolean;
};

export const profile = {
  name: "Qasim Alarab",
  email: "qasimalarab03@gmail.com",
  github: "https://github.com/bobby33400",
  available: true,
  resumeUrl: "", // add e.g. "/cv.pdf" once you send your CV
  socials: [
    { label: "GitHub", href: "https://github.com/bobby33400", icon: "github" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/qasim-alarab-585157409/",
      icon: "linkedin",
    },
    { label: "Email", href: "mailto:qasimalarab03@gmail.com", icon: "mail" },
  ] as Social[],
};

export const projects: ProjectMeta[] = [
  {
    id: "chargestay",
    title: "ChargeStay",
    // Founder & full-stack: mobile app + backend + website (Next.js, Stripe).
    tech: ["Next.js", "React Native", "Supabase", "Stripe"],
    live: "https://chargestay.de",
  },
  {
    id: "lea",
    title: "Lea",
    tech: ["Electron", "TypeScript", "Node.js"],
    live: "https://bobby33400.github.io/lea-site/",
    github: "https://github.com/bobby33400/Lea",
  },
  {
    id: "synqro",
    title: "Synqro",
    // Per CV: cross-platform React Native/Expo app, Supabase/Postgres backend.
    tech: ["React Native", "Expo", "Supabase", "TypeScript"],
  },
  {
    id: "protrack",
    title: "ProTrack",
    // Assumed to match Qasim's usual stack — confirm if different.
    tech: ["React Native", "Expo", "Supabase"],
  },
];
