import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

/** Removed tool — redirect to AI Lab home */
export default async function YoutubeRedirectPage() {
  const locale = await getLocale();
  redirect({ href: "/ai-lab", locale });
}
