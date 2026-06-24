import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBlogPostSlugs } from "@/lib/blog/posts";
import { localePath } from "@/lib/seo/page-metadata";

const BLOG_LAST_MODIFIED: Record<string, Date> = {
  "nextjs-portfolio-guide": new Date("2026-01-31"),
  "ai-automation-guide": new Date("2026-02-15"),
};

const STATIC_PATHS = [
  "",
  "/projects",
  "/blog",
  "/contact",
  "/ai-lab",
  "/ai-lab/sandbox",
  "/ai-lab/deep-analyzer",
  "/ai-lab/english-path",
  "/ai-lab/english-path/games",
  "/ai-lab/english-path/exam",
  "/ai-lab/booking",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getBlogPostSlugs();
  const entries: MetadataRoute.Sitemap = [];
  const siteUpdated = new Date("2026-06-11");

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: localePath(locale, path),
        lastModified: path === "" ? siteUpdated : siteUpdated,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.startsWith("/ai-lab") ? 0.7 : 0.8,
      });
    }

    for (const slug of blogSlugs) {
      entries.push({
        url: localePath(locale, `/blog/${slug}`),
        lastModified: BLOG_LAST_MODIFIED[slug] ?? siteUpdated,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
