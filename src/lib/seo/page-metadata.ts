import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/data/site-config";

const BASE_URL = siteConfig.baseUrl;

/** Locales with real, fully translated content. Others are served but kept out of search. */
export const INDEXED_LOCALES = ["tr", "en"] as const;

export function isIndexedLocale(locale: string): boolean {
  return (INDEXED_LOCALES as readonly string[]).includes(locale);
}

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

export function buildLanguageAlternates(
  path: string,
  locale?: string
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of INDEXED_LOCALES) {
    languages[l] = localePath(l, path);
  }
  languages["x-default"] = localePath(routing.defaultLocale, path);
  return {
    languages,
    ...(locale ? { canonical: localePath(locale, path) } : {}),
  };
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
    alternates: buildLanguageAlternates(path, locale),
    ...(isIndexedLocale(locale) ? {} : { robots: { index: false, follow: true } }),
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
