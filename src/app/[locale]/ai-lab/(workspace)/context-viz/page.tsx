import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

/** Legacy path → `/ai-lab/deep-analyzer` */
export default async function AiLabContextVizPage() {
  const locale = await getLocale();
  redirect({
    href: "/ai-lab/deep-analyzer",
    locale,
  });
}

