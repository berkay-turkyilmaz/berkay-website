export const siteConfig = {
  name: "BERKAY",
  fullName: "Berkay Türkyılmaz",
  email: "berkaytrkylmzz@gmail.com",
  github: "https://github.com/berkay-turkyilmaz",
  linkedin: "https://linkedin.com/in/berkay-turkyilmaz",
  twitter: null as string | null, // No X/Twitter profile
  baseUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://berkay-dev.vercel.app").replace(/\/$/, ""),
  location: "Istanbul, Turkey",
  locationMode: "Remote & Hybrid",
} as const;

export type SiteConfig = typeof siteConfig;
