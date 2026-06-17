import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getBlogPostSlugs } from "@/lib/blog/posts";

const BASE_URL = "https://berkay-dev.vercel.app";

const STATIC_PATHS = [
  "",
  "/projects",
  "/blog",
  "/contact",
  "/ai-lab",
  "/ai-lab/sandbox",
  "/ai-lab/deep-analyzer",
  "/ai-lab/english-path",
  "/ai-lab/booking",
] as const;

function localePath(locale: string, path: string): string {
  if (locale === routing.defaultLocale) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getBlogPostSlugs();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: localePath(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : path.startsWith("/ai-lab") ? 0.7 : 0.8,
      });
    }

    for (const slug of blogSlugs) {
      entries.push({
        url: localePath(locale, `/blog/${slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
