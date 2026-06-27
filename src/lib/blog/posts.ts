export type BlogPostMeta = {
  id: string;
  slug: string;
  category: "architecture" | "ai" | "automation";
  hasAudio: boolean;
  /** Tailwind gradient for the card cover visual */
  gradient: string;
};

/** Single source of truth for blog post metadata across hub, preview, and detail routes. */
export const BLOG_POSTS: readonly BlogPostMeta[] = [
  {
    id: "1",
    slug: "nextjs-portfolio-guide",
    category: "architecture",
    hasAudio: true,
    gradient: "from-indigo-950 via-blue-950 to-zinc-950",
  },
  {
    id: "2",
    slug: "ai-automation-guide",
    category: "ai",
    hasAudio: false,
    gradient: "from-violet-950 via-purple-950 to-zinc-950",
  },
  {
    id: "3",
    slug: "n8n-workflow-automation",
    category: "automation",
    hasAudio: false,
    gradient: "from-emerald-950 via-teal-950 to-zinc-950",
  },
  {
    id: "4",
    slug: "supabase-fullstack-architecture",
    category: "architecture",
    hasAudio: false,
    gradient: "from-green-950 via-emerald-950 to-zinc-950",
  },
  {
    id: "5",
    slug: "typescript-type-safe-api",
    category: "architecture",
    hasAudio: false,
    gradient: "from-sky-950 via-blue-950 to-zinc-950",
  },
  {
    id: "6",
    slug: "groq-streaming-llm-integration",
    category: "ai",
    hasAudio: false,
    gradient: "from-fuchsia-950 via-violet-950 to-zinc-950",
  },
  {
    id: "7",
    slug: "vercel-edge-runtime-guide",
    category: "architecture",
    hasAudio: false,
    gradient: "from-zinc-900 via-slate-950 to-zinc-950",
  },
  {
    id: "8",
    slug: "nextjs-i18n-nextintl-guide",
    category: "architecture",
    hasAudio: false,
    gradient: "from-cyan-950 via-teal-950 to-zinc-950",
  },
] as const;

export function getBlogPostMetaBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
