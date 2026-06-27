import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Shield } from "lucide-react";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  const sections = [
    { title: t("section_1_title"), body: t("section_1_body") },
    { title: t("section_2_title"), body: t("section_2_body") },
    { title: t("section_3_title"), body: t("section_3_body") },
    { title: t("section_4_title"), body: t("section_4_body") },
    { title: t("section_5_title"), body: t("section_5_body") },
    { title: t("section_6_title"), body: t("section_6_body") },
    { title: t("section_7_title"), body: t("section_7_body") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-6 lg:px-12 pt-36 pb-24 max-w-3xl">
        {/* Header */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
            <Shield className="w-3.5 h-3.5" />
            {t("badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
            {t("title")}
          </h1>
          <p className="text-xs font-mono text-muted-foreground/60">
            {t("last_updated")}
          </p>
          <p className="text-muted-foreground leading-relaxed font-medium max-w-2xl">
            {t("intro")}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="space-y-3">
              <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
