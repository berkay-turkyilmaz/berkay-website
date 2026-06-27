import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://berkay-dev.vercel.app";

const OG_LOCALE: Record<string, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  fr: "fr_FR",
  ja: "ja_JP",
  ar: "ar_SA",
};

export function openGraphImagePath(locale: string): string {
  if (locale === routing.defaultLocale) {
    return "/opengraph-image";
  }
  return `/${locale}/opengraph-image`;
}

export function localePath(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) {
    return `${BASE_URL}${normalized === "/" ? "" : normalized}`;
  }
  return `${BASE_URL}/${locale}${normalized === "/" ? "" : normalized}`;
}

export function buildLanguageAlternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localePath(locale, path);
  }
  languages["x-default"] = localePath(routing.defaultLocale, path);
  return { languages };
}

type PageMetadataOptions = {
  locale: string;
  path: string;
  title: string;
  description: string;
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetadataOptions): Metadata {
  const url = localePath(locale, path);

  return {
    title,
    description,
    alternates: buildLanguageAlternates(path),
    openGraph: {
      title,
      description,
      url,
      locale: OG_LOCALE[locale] ?? "en_US",
      type: "website",
      siteName: "BERKAY",
      images: [{ url: openGraphImagePath(locale), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
