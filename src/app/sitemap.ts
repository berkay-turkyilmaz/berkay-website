import type { MetadataRoute } from "next";
import { getBlogPostSlugs } from "@/lib/blog/posts";
import { getBlogPostContent } from "@/lib/blog/content";
import { getProjectSlugs } from "@/data/projects";
import { INDEXED_LOCALES, localePath } from "@/lib/seo/page-metadata";

const SITE_UPDATED = new Date("2026-10-20");

const STATIC_PATHS = [
  "",
  "/about",
  "/projects",
  "/resume",
  "/privacy",
  "/blog",
  "/contact",
  "/ai-lab/chat",
  "/ai-lab/documents",
  "/ai-lab/analyzer",
  "/ai-lab/english-path",
  "/ai-lab/english-path/games",
  "/ai-lab/english-path/exam",
  "/ai-lab/booking",
] as const;

function blogLastModified(slug: string): Date {
  const date = getBlogPostContent(slug, "en")?.date;
  return date ? new Date(date) : SITE_UPDATED;
}

/** Only fully translated locales are listed; other locales are noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of INDEXED_LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: localePath(locale, path),
        lastModified: SITE_UPDATED,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.startsWith("/ai-lab") ? 0.7 : 0.8,
      });
    }

    for (const slug of getBlogPostSlugs()) {
      entries.push({
        url: localePath(locale, `/blog/${slug}`),
        lastModified: blogLastModified(slug),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    for (const slug of getProjectSlugs()) {
      entries.push({
        url: localePath(locale, `/projects/${slug}`),
        lastModified: SITE_UPDATED,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  return entries;
}
