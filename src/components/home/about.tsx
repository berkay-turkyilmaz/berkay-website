import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "./section-heading";

const PRINCIPLES = ["p1", "p2", "p3"] as const;
const NOTES = ["location", "mode", "lang"] as const;

export async function About() {
  const t = await getTranslations("Home.about");

  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
        <SectionHeading
          id="about-title"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em: (c) => <em className="italic text-primary">{c}</em> })}
        />

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
          <div className="reveal md:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-secondary md:aspect-[4/5]">
              <Image
                src="/images/desk-notes.jpg"
                alt={t("photo_alt")}
                fill
                sizes="(min-width: 768px) 38vw, 100vw"
                className="object-cover object-[35%_50%]"
              />
            </div>
            <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
              {NOTES.map((key) => (
                <div key={key} className="flex items-baseline justify-between gap-6 py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {t(`notes.${key}.label`)}
                  </dt>
                  <dd className="text-right text-foreground">{t(`notes.${key}.value`)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-7 md:pl-6 lg:pl-12">
            <div className="reveal space-y-6 text-lg leading-[1.7] text-foreground/90 sm:text-xl sm:leading-[1.65]">
              <p>{t("p_1")}</p>
              <p className="text-muted-foreground">{t("p_2")}</p>
              <p className="text-muted-foreground">{t("p_3")}</p>
            </div>

            <div className="reveal mt-14">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {t("principles_title")}
              </h3>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {PRINCIPLES.map((key, i) => (
                  <li key={key} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                    <span className="font-display text-2xl italic text-primary">{i + 1}</span>
                    <div>
                      <p className="font-display text-2xl leading-snug text-foreground">{t(`${key}.title`)}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {t(`${key}.desc`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
