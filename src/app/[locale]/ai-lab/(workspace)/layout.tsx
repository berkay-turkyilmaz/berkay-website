import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AiLabShell } from "@/features/ai-lab/components/ai-lab-shell";
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
    path: "/ai-lab/chat",
    title: t("ai_lab_title"),
    description: t("ai_lab_description"),
  });
}

export default function AiLabWorkspaceLayout({ children }: { children: ReactNode }) {
  return <AiLabShell>{children}</AiLabShell>;
}
