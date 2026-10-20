import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";

const SECTION_COUNT = 7;

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PrivacyPage" });

  const sections = Array.from({ length: SECTION_COUNT }, (_, i) => ({
    title: t(`section_${i + 1}_title`),
    body: t(`section_${i + 1}_body`),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      <main id="main">
        <PageHero eyebrow={t("badge")} title={t("title")} lead={t("intro")} />

        <section className="mx-auto w-full max-w-[1200px] px-5 pb-24 sm:px-8 md:pb-32">
          <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t("last_updated")}</p>
          <ol className="divide-y divide-border border-y border-border">
            {sections.map((section, i) => (
              <li key={section.title} className="grid gap-4 py-8 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4">
                  <span className="font-display text-2xl italic text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-2 font-display text-2xl leading-snug text-foreground">{section.title}</h2>
                </div>
                <p className="leading-relaxed text-muted-foreground md:col-span-8">{section.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  );
}
