export type ProjectStatus = "live" | "completed" | "in-progress";

export interface Project {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tech: string[];
  status: ProjectStatus;
  link?: string;
  github?: string | null;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "bex-assistant",
    titleKey: "projects.bex.title",
    descriptionKey: "projects.bex.description",
    tech: ["Next.js 16", "Groq API", "TypeScript", "Tailwind CSS", "Streaming"],
    status: "live",
    link: "/ai-lab",
    github: null,
    featured: true,
  },
  {
    id: "portfolio-infra",
    titleKey: "projects.portfolio.title",
    descriptionKey: "projects.portfolio.description",
    tech: ["Next.js 16", "next-intl", "Supabase", "n8n", "Vercel", "TypeScript"],
    status: "live",
    link: "https://berkay-dev.vercel.app",
    github: null,
    featured: true,
  },
  {
    id: "booking-crm",
    titleKey: "projects.booking.title",
    descriptionKey: "projects.booking.description",
    tech: ["n8n", "Webhooks", "Google Calendar API", "Serverless", "Supabase"],
    status: "completed",
    link: "/ai-lab/booking",
    github: null,
    featured: true,
  },
  {
    id: "saas-starter",
    titleKey: "projects.saas.title",
    descriptionKey: "projects.saas.description",
    tech: ["Next.js 16", "Supabase", "Stripe", "TypeScript", "Tailwind CSS", "RBAC"],
    status: "in-progress",
    github: null,
    featured: false,
  },
  {
    id: "pdf-analyzer",
    titleKey: "projects.pdf.title",
    descriptionKey: "projects.pdf.description",
    tech: ["Groq API", "Next.js", "PDF.js", "Vector Search", "TypeScript"],
    status: "live",
    link: "/ai-lab",
    github: null,
    featured: false,
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
export const NON_FEATURED_PROJECTS = PROJECTS.filter((p) => !p.featured);
