import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { Experience } from "@/components/home/experience";
import { ContactBand } from "@/components/home/contact-band";

const PRINCIPLES = ["p1", "p2", "p3"] as const;
const NOTES = ["location", "mode", "lang"] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("AboutMe");
  const h = await getTranslations("Home.about");

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      <main id="main">
        <PageHero
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (c) => <em className="italic text-primary">{c}</em> })}
          lead={t("lead")}
          side={
            <figure className="photo-reveal relative aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-secondary">
              <div className="parallax absolute inset-0">
                <Image
                  src="/images/galata-tower.jpg"
                  alt={t("photo_alt")}
                  fill
                  priority
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="photo-drift object-cover object-[50%_40%]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
            </figure>
          }
        />

        <section aria-labelledby="story-title" className="border-t border-border">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-12 md:grid-cols-12 md:gap-8">
              <h2
                id="story-title"
                className="reveal font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:col-span-3 md:pt-2"
              >
                {t("story_title")}
              </h2>
              <div className="md:col-span-8">
                <div className="reveal space-y-6 text-lg leading-[1.7] text-foreground/90 sm:text-xl sm:leading-[1.65]">
                  <p>{h("p_1")}</p>
                  <p className="text-muted-foreground">{h("p_2")}</p>
                  <p className="text-muted-foreground">{h("p_3")}</p>
                </div>

                <dl className="reveal mt-12 divide-y divide-border border-y border-border text-sm">
                  {NOTES.map((key) => (
                    <div key={key} className="flex items-baseline justify-between gap-6 py-4">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {h(`notes.${key}.label`)}
                      </dt>
                      <dd className="text-right text-foreground">{h(`notes.${key}.value`)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="principles-title" className="border-t border-border">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-12 md:grid-cols-12 md:gap-8">
              <h2
                id="principles-title"
                className="reveal font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:col-span-3 md:pt-2"
              >
                {h("principles_title")}
              </h2>
              <ul className="divide-y divide-border border-y border-border md:col-span-8">
                {PRINCIPLES.map((key, i) => (
                  <li key={key} className="reveal grid grid-cols-[2.5rem_1fr] gap-4 py-7">
                    <span className="font-display text-3xl italic text-primary">{i + 1}</span>
                    <div>
                      <p className="font-display text-3xl leading-snug text-foreground">{h(`${key}.title`)}</p>
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{h(`${key}.desc`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Experience />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
