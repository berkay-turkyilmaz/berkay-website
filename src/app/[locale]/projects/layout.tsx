import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return createPageMetadata({
    locale,
    path: "/projects",
    title: t("projects_title"),
    description: t("projects_description"),
  });
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
