"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronDown, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("HomePage");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const fn = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const scrollToContent = () => {
    document.getElementById("home-content")?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduceMotion ? 0 : i * 0.12,
        duration: reduceMotion ? 0.2 : 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative flex min-h-dvh w-full flex-col items-center justify-center px-5 pt-20 pb-24 sm:px-6">
      {/* Subtle edge vignette only — no center white blob */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.06),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-secondary/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground/80 ring-1 ring-border/40 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              {!reduceMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t("badge")}
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl font-extrabold leading-[1.06] tracking-tighter text-balance text-foreground sm:text-6xl md:text-7xl lg:text-[4.5rem]"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
        >
          {t("description")}
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Link href="/projects" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="h-12 w-full rounded-full px-8 font-bold shadow-md shadow-primary/10 transition-all hover:shadow-lg hover:shadow-primary/15 active:scale-[0.98] sm:w-auto"
            >
              {t("cta_projects")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/ai-lab" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-full border-border/40 bg-background/50 px-8 font-semibold backdrop-blur-sm transition-all hover:bg-secondary/50 sm:w-auto"
            >
              <Cpu className="mr-2 h-4 w-4 text-muted-foreground" />
              {t("cta_lab")}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.9, duration: 0.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full p-2"
        aria-label={t("hero.scroll_down")}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
          {t("hero.scroll_hint")}
        </span>
        <ChevronDown
          className={`h-5 w-5 ${reduceMotion ? "" : "animate-bounce"}`}
          strokeWidth={2}
        />
      </motion.button>
    </section>
  );
}
