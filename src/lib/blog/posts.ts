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
] as const;

export function getBlogPostMetaBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
