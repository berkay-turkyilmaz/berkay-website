export type BlogPostMeta = {
  id: string;
  slug: string;
  category: "architecture" | "ai" | "automation";
  hasAudio: boolean;
};

/** Single source of truth for blog post metadata. Titles and excerpts live in content.ts. */
export const BLOG_POSTS: readonly BlogPostMeta[] = [
  { id: "1", slug: "english-path-spaced-repetition", category: "architecture", hasAudio: false },
  { id: "2", slug: "hide-n8n-webhooks", category: "automation", hasAudio: false },
  { id: "3", slug: "protecting-ai-endpoints", category: "ai", hasAudio: false },
  { id: "4", slug: "streaming-errors-ai-sdk", category: "ai", hasAudio: false },
  { id: "5", slug: "fewer-languages", category: "architecture", hasAudio: false },
  { id: "6", slug: "static-rendering-next-intl", category: "architecture", hasAudio: false },
] as const;

export function getBlogPostMetaBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
