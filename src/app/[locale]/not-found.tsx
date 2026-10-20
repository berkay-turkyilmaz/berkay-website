import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />
      <main id="main" className="relative isolate overflow-hidden">
        <Image
          src="/images/istanbul-skyline.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-[0.28] dark:opacity-[0.16]"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/60 to-background" aria-hidden />

        <div className="mx-auto flex min-h-[85vh] w-full max-w-[1200px] flex-col justify-center px-5 py-32 sm:px-8">
          <p className="rise font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">404</p>
          <h1
            className="rise mt-6 max-w-3xl font-display text-[clamp(3rem,9vw,7.5rem)] leading-[1] tracking-[-0.03em] text-balance"
            style={{ "--d": 1 } as React.CSSProperties}
          >
            {t("title")}
          </h1>
          <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ "--d": 2 } as React.CSSProperties}>
            {t("description")}
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ "--d": 3 } as React.CSSProperties}>
            <Link
              href="/"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("back")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-border bg-background/70 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors duration-300 hover:border-foreground"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
