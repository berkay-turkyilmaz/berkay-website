import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/bk-reflect", "/*/bk-reflect", "/bk-signs", "/*/bk-signs"],
    },
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
