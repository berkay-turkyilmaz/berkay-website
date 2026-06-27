"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SKILL_CATEGORIES } from "@/data/skills";

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const tSkills = useTranslations("AboutPage.skills");

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans">
      <Header />

      <main className="pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6 mb-16"
          >
            <div className="inline-flex items-center gap-2 text-primary font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
              <User className="w-4 h-4" />
              {t("badge")}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-[1.08]">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t("description")}
            </p>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-7 text-sm font-bold text-background shadow-sm hover:bg-foreground/90 transition-all"
            >
              {t("cta")}
            </Link>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">{t("skills_title")}</h2>
              <p className="text-sm text-muted-foreground">{t("skills_subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SKILL_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className="rounded-xl border border-border/50 bg-card p-5 hover:border-primary/20 transition-colors"
                >
                  <h3 className="text-sm font-bold text-foreground mb-3">
                    {tSkills(category.labelKey)}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-secondary border border-border/50 text-muted-foreground font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
