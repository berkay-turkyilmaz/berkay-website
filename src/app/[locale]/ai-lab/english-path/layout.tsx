import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { ScopedIntl } from "@/lib/i18n/scoped-intl";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return createPageMetadata({
    locale,
    path: "/ai-lab/english-path",
    title: t("english_path_title"),
    description: t("english_path_description"),
  });
}

export default function EnglishPathLayout({ children }: { children: React.ReactNode }) {
  return <ScopedIntl namespaces={["EnglishPath"]}>{children}</ScopedIntl>;
}
