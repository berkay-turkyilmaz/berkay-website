import Image from "next/image";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/data/site-config";
import { CopyEmail } from "./copy-email";

export async function ContactBand() {
  const t = await getTranslations("Home.contact");

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative scroll-mt-20 overflow-hidden border-t border-border">
      <Image
        src="/images/istanbul-skyline.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[50%_40%] opacity-[0.22] dark:opacity-[0.14]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" aria-hidden />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-28 sm:px-8 md:py-40">
        <p className="reveal font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t("eyebrow")}</p>
        <h2
          id="contact-title"
          className="reveal mt-6 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1.02] tracking-[-0.025em] text-foreground text-balance"
        >
          {t.rich("title", { em: (c) => <em className="italic text-primary">{c}</em> })}
        </h2>
        <p className="reveal mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t("lead")}</p>

        <div className="reveal mt-10 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${siteConfig.email}`}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
          >
            {siteConfig.email}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </a>
          <CopyEmail email={siteConfig.email} copyLabel={t("copy")} copiedLabel={t("copied")} />
        </div>

        <ul className="reveal mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <li>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
            >
              <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
            </a>
          </li>
          <li>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
            >
              <Github className="h-4 w-4" aria-hidden /> GitHub
            </a>
          </li>
          <li>
            <Link
              href="/resume"
              className="text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
            >
              {t("cv")}
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
            >
              {t("form")}
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
