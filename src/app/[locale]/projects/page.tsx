import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { ProjectCard } from "@/components/work/project-card";
import { ContactBand } from "@/components/home/contact-band";
import { WORK } from "@/data/work";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ProjectsIndex");

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      <main id="main">
        <PageHero
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (c) => <em className="italic text-primary">{c}</em> })}
          lead={t("lead")}
        />

        <section className="mx-auto w-full max-w-[1200px] px-5 pb-24 sm:px-8 md:pb-32">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {WORK.map((item, i) => (
              <ProjectCard key={item.id} item={item} index={i} headingLevel="h2" />
            ))}
          </div>
        </section>

        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
