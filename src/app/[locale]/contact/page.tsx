"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Code2,
  Brain,
  Layers,
  Github,
  Linkedin,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SubjectSelect } from "@/components/ui/subject-select";
import { siteConfig } from "@/data/site-config";

// ─── Schema ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(["project", "ai", "consulting", "job", "other"]),
  message: z.string().min(20),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ─── Input primitives ─────────────────────────────────────────────────────────

const inputCls =
  "w-full h-11 bg-secondary/20 border border-border/50 rounded-xl px-4 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200";

const labelCls = "block text-xs font-semibold text-foreground/70 mb-1.5";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive font-medium">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

// ─── Service cards ────────────────────────────────────────────────────────────

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function ServiceCard({ icon, title, desc }: ServiceCardProps) {
  return (
    <div className="flex gap-3.5 p-4 rounded-xl border border-border/50 bg-card/60 hover:border-primary/25 hover:bg-card transition-all duration-200 group">
      <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary/12 transition-colors mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const locale = useLocale();
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("server_error");
      setSubmitState("success");
      reset();
    } catch {
      setSubmitState("error");
    }
  };

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: siteConfig.github,
      display: "github.com/berkay-turkyilmaz",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: siteConfig.linkedin,
      display: "linkedin.com/in/berkay-turkyilmaz",
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${siteConfig.email}`,
      display: siteConfig.email,
    },
  ];

  const services = [
    {
      icon: <Code2 className="w-4 h-4" />,
      title: t("service_1_title"),
      desc: t("service_1_desc"),
    },
    {
      icon: <Brain className="w-4 h-4" />,
      title: t("service_2_title"),
      desc: t("service_2_desc"),
    },
    {
      icon: <Layers className="w-4 h-4" />,
      title: t("service_3_title"),
      desc: t("service_3_desc"),
    },
  ];

  const subjectOptions = [
    { value: "project", label: t("form_subject_project") },
    { value: "ai", label: t("form_subject_ai") },
    { value: "consulting", label: t("form_subject_consulting") },
    { value: "job", label: t("form_subject_job") },
    { value: "other", label: t("form_subject_other") },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 font-sans">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-5 sm:px-6 lg:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

            {/* ── LEFT COLUMN (sticky) ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 lg:sticky lg:top-28 space-y-6"
            >
              {/* Hero text */}
              <div className="space-y-4">
                {/* Availability badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {t("availability_badge")}
                </div>

                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                  {t("hero_title")}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                  {t("hero_subtitle")}
                </p>

                {/* Meta info */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs text-muted-foreground/70 flex items-center gap-2">
                    <span className="text-primary">⚡</span>
                    {t("response_time")}
                  </p>
                  <p className="text-xs text-muted-foreground/70 flex items-center gap-2">
                    <span>📍</span>
                    {t("location")}
                  </p>
                </div>
              </div>

              {/* Service cards */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-3">
                  {t("services_title")}
                </p>
                {services.map((s) => (
                  <ServiceCard key={s.title} icon={s.icon} title={s.title} desc={s.desc} />
                ))}
              </div>

              {/* Social links */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group py-1"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      <span className="font-mono text-xs group-hover:text-primary transition-colors truncate">
                        {link.display}
                      </span>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* ── RIGHT COLUMN (form) ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-foreground mb-6">{t("form_title")}</h2>

                {submitState === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{t("form_success")}</p>
                    <button
                      type="button"
                      onClick={() => setSubmitState("idle")}
                      className="text-xs text-primary hover:text-primary/70 transition-colors font-medium"
                    >
                      {locale === "tr" ? "Yeni mesaj gönder" : "Send another message"}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>{t("form_name_label")}</label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder={t("form_name_placeholder")}
                          className={inputCls}
                          autoComplete="name"
                        />
                        <FieldError msg={errors.name?.message} />
                      </div>
                      <div>
                        <label className={labelCls}>{t("form_email_label")}</label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder={t("form_email_placeholder")}
                          className={inputCls}
                          autoComplete="email"
                        />
                        <FieldError msg={errors.email?.message} />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={labelCls} htmlFor="contact-subject">
                        {t("form_subject_label")}
                      </label>
                      <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                          <SubjectSelect
                            id="contact-subject"
                            options={subjectOptions}
                            value={field.value}
                            onChange={field.onChange}
                            error={!!errors.subject}
                          />
                        )}
                      />
                      <FieldError msg={errors.subject?.message} />
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelCls}>{t("form_message_label")}</label>
                      <textarea
                        {...register("message")}
                        placeholder={t("form_message_placeholder")}
                        rows={6}
                        className={`${inputCls} h-auto py-3 resize-none leading-relaxed`}
                      />
                      <FieldError msg={errors.message?.message} />
                    </div>

                    {/* Error state */}
                    {submitState === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 text-xs text-destructive font-medium"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          {t("form_error")}{" "}
                          <a
                            href={`mailto:${siteConfig.email}`}
                            className="underline hover:no-underline"
                          >
                            {siteConfig.email}
                          </a>
                        </span>
                      </motion.div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        isSubmitting
                          ? "bg-secondary/50 text-muted-foreground cursor-not-allowed"
                          : "bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md active:scale-[0.99]"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("form_submitting")}
                        </>
                      ) : (
                        t("form_submit")
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
