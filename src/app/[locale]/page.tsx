import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { TechMarquee } from "@/components/home/tech-marquee";
import { CodeSection } from "@/components/home/code-section";
import { WorkIndex } from "@/components/home/work-index";
import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Writing } from "@/components/home/writing";
import { ContactBand } from "@/components/home/contact-band";
import { GitHubActivity } from "@/components/github-activity";
import { JsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <JsonLd data={personJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Header />
      <main id="main">
        <Hero />
        <TechMarquee />
        <WorkIndex />
        <CodeSection />
        <GitHubActivity />
        <About />
        <Experience />
        <Writing />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
