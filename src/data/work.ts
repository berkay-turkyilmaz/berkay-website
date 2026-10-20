export type WorkKind = "live" | "experiment" | "tool" | "demo" | "private" | "ongoing";

export interface WorkItem {
  id: string;
  /** URL slug under /projects. */
  slug: string;
  kind: WorkKind;
  year: string;
  tags: string[];
  /** Screenshot in /public/images/work (optional). */
  image?: string;
  /** Where "open project" goes. External URLs open in a new tab. */
  href?: string;
  external?: boolean;
  /** Whether the card shows on the home page. */
  featured: boolean;
}

export const WORK: WorkItem[] = [
  { id: "meetora", slug: "meetora", kind: "live", year: "2025", tags: ["Web", "Product"], image: "/images/work/meetora.jpg", href: "https://getmeetora.com/", external: true, featured: true },
  { id: "ai-lab", slug: "ai-lab", kind: "experiment", year: "2025", tags: ["Next.js", "Groq", "AI SDK"], image: "/images/work/ai-lab.jpg", href: "/ai-lab/chat", featured: true },
  { id: "english-path", slug: "english-path", kind: "tool", year: "2026", tags: ["React", "TypeScript", "CEFR"], image: "/images/work/english-path.jpg", href: "/ai-lab/english-path", featured: true },
  { id: "this-site", slug: "this-site", kind: "ongoing", year: "2026", tags: ["Next.js 16", "next-intl", "Tailwind 4"], image: "/images/work/site.jpg", href: "https://github.com/berkay-turkyilmaz/berkay-website", external: true, featured: true },
  { id: "booking-demo", slug: "booking-demo", kind: "demo", year: "2025", tags: ["n8n", "Webhooks", "Next.js"], href: "/ai-lab/booking", featured: false },
  { id: "finance-bot", slug: "finance-bot", kind: "private", year: "2025", tags: ["n8n", "REST APIs"], featured: false },
];

export function getWorkBySlug(slug: string): WorkItem | undefined {
  return WORK.find((w) => w.slug === slug);
}

export function getWorkSlugs(): string[] {
  return WORK.map((w) => w.slug);
}
