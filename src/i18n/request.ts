import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { mergeMessages } from "@/lib/i18n/merge-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const localeMessages = (await import(`../messages/${locale}.json`)).default;

  if (locale === "tr") {
    return { locale, messages: localeMessages };
  }

  const enMessages = (await import("../messages/en.json")).default;

  if (locale === "en") {
    return { locale, messages: localeMessages };
  }

  return {
    locale,
    messages: mergeMessages(localeMessages, enMessages),
  };
});
