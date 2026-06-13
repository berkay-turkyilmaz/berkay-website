import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

/** Eski URL → english-path */
export default async function EnglishPracticeRedirect() {
  const locale = await getLocale();
  redirect({ href: "/ai-lab/english-path", locale });
}
