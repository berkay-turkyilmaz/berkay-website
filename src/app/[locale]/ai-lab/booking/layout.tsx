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
    path: "/ai-lab/booking",
    title: t("booking_title"),
    description: t("booking_description"),
  });
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
