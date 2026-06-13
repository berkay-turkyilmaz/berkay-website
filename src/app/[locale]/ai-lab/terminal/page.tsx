import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

/** Legacy URL → Agent console */
export default async function AiLabTerminalRedirectPage() {
  const locale = await getLocale();
  redirect({ href: "/ai-lab", locale });
}
