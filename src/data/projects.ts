export type ProjectStatus = "live" | "completed" | "in-progress";

export interface Project {
  id: string;
  slug: string;
  titleKey: string;
  descriptionKey: string;
  taglineKey: string;
  tech: string[];
  status: ProjectStatus;
  link?: string;
  github?: string | null;
  featured: boolean;
  year: number;
  /** Tailwind gradient classes for visual card */
  gradient: string;
  accentClass: string;
}

export const PROJECTS: Project[] = [
  {
    id: "bex-assistant",
    slug: "bex-assistant",
    titleKey: "projects.bex.title",
    descriptionKey: "projects.bex.description",
    taglineKey: "projects.bex.tagline",
    tech: ["Next.js 16", "Groq API", "TypeScript", "Tailwind CSS", "Streaming"],
    status: "live",
    link: "/ai-lab",
    github: null,
    featured: true,
    year: 2025,
    gradient: "from-violet-950/80 via-indigo-950/60 to-background",
    accentClass: "text-violet-400",
  },
  {
    id: "portfolio-infra",
    slug: "portfolio-infra",
    titleKey: "projects.portfolio.title",
    descriptionKey: "projects.portfolio.description",
    taglineKey: "projects.portfolio.tagline",
    tech: ["Next.js 16", "next-intl", "Supabase", "n8n", "Vercel", "TypeScript"],
    status: "live",
    link: "https://berkay-dev.vercel.app",
    github: null,
    featured: true,
    year: 2025,
    gradient: "from-teal-950/80 via-cyan-950/60 to-background",
    accentClass: "text-teal-400",
  },
  {
    id: "booking-crm",
    slug: "booking-crm",
    titleKey: "projects.booking.title",
    descriptionKey: "projects.booking.description",
    taglineKey: "projects.booking.tagline",
    tech: ["n8n", "Webhooks", "Google Calendar API", "Serverless", "Supabase"],
    status: "completed",
    link: "/ai-lab/booking",
    github: null,
    featured: true,
    year: 2024,
    gradient: "from-emerald-950/80 via-green-950/60 to-background",
    accentClass: "text-emerald-400",
  },
  {
    id: "saas-starter",
    slug: "saas-starter",
    titleKey: "projects.saas.title",
    descriptionKey: "projects.saas.description",
    taglineKey: "projects.saas.tagline",
    tech: ["Next.js 16", "Supabase", "Stripe", "TypeScript", "Tailwind CSS", "RBAC"],
    status: "in-progress",
    github: null,
    featured: true,
    year: 2026,
    gradient: "from-orange-950/80 via-amber-950/60 to-background",
    accentClass: "text-orange-400",
  },
  {
    id: "pdf-analyzer",
    slug: "pdf-analyzer",
    titleKey: "projects.pdf.title",
    descriptionKey: "projects.pdf.description",
    taglineKey: "projects.pdf.tagline",
    tech: ["Groq API", "Next.js", "PDF.js", "Vector Search", "TypeScript"],
    status: "live",
    link: "/ai-lab",
    github: null,
    featured: false,
    year: 2025,
    gradient: "from-sky-950/80 via-blue-950/60 to-background",
    accentClass: "text-sky-400",
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const NON_FEATURED_PROJECTS = PROJECTS.filter((p) => !p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}
