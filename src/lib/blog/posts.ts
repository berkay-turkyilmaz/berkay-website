export type BlogPostMeta = {
  id: string;
  slug: string;
  category: "architecture" | "ai" | "automation";
  hasAudio: boolean;
};

/** Single source of truth for blog post metadata across hub, preview, and detail routes. */
export const BLOG_POSTS: readonly BlogPostMeta[] = [
  {
    id: "1",
    slug: "nextjs-portfolio-guide",
    category: "architecture",
    hasAudio: true,
  },
  {
    id: "2",
    slug: "ai-automation-guide",
    category: "ai",
    hasAudio: false,
  },
  {
    id: "3",
    slug: "n8n-workflow-automation",
    category: "automation",
    hasAudio: false,
  },
  {
    id: "4",
    slug: "supabase-fullstack-architecture",
    category: "architecture",
    hasAudio: false,
  },
  {
    id: "5",
    slug: "typescript-type-safe-api",
    category: "architecture",
    hasAudio: false,
  },
  {
    id: "6",
    slug: "groq-streaming-llm-integration",
    category: "ai",
    hasAudio: false,
  },
  {
    id: "7",
    slug: "vercel-edge-runtime-guide",
    category: "architecture",
    hasAudio: false,
  },
  {
    id: "8",
    slug: "nextjs-i18n-nextintl-guide",
    category: "architecture",
    hasAudio: false,
  },
] as const;

export function getBlogPostMetaBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
