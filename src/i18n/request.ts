import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { mergeMessages } from "@/lib/i18n/merge-messages";

type Tree = Record<string, unknown>;

/** Core messages plus the per-page namespaces kept in `messages/pages/<locale>.json`. */
async function loadLocale(locale: string): Promise<Tree> {
  const core = (await import(`../messages/${locale}.json`)).default as Tree;
  try {
    const pages = (await import(`../messages/pages/${locale}.json`)).default as Tree;
    return { ...core, ...pages };
  } catch {
    return core;
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const localeMessages = await loadLocale(locale);

  if (locale === "tr" || locale === "en") {
    return { locale, messages: localeMessages };
  }

  const enMessages = await loadLocale("en");

  return {
    locale,
    messages: mergeMessages(localeMessages, enMessages),
  };
});
