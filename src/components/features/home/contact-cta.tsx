"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export function ContactCTA() {
  const t = useTranslations("HomePage.contact_cta");

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-32 mx-auto w-full max-w-3xl text-center py-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 px-8 py-14 shadow-sm">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]"
          aria-hidden
        />
        <div className="relative space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background shadow-sm hover:bg-foreground/90 hover:shadow-md transition-all duration-200 active:scale-[0.99]"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
