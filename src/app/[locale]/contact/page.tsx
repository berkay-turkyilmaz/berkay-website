"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowUpRight, CheckCircle2, Github, Linkedin, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/layout/page-hero";
import { CopyEmail } from "@/components/home/copy-email";
import { SubjectSelect } from "@/components/ui/subject-select";
import { siteConfig } from "@/data/site-config";

const makeSchema = (m: { name: string; email: string; subject: string; message: string }) =>
  z.object({
    name: z.string().trim().min(2, m.name),
    email: z.string().trim().email(m.email),
    subject: z.enum(["project", "ai", "consulting", "job", "other"], { message: m.subject }),
    message: z.string().trim().min(20, m.message),
    website: z.string().optional(),
  });

type ContactFormData = z.infer<ReturnType<typeof makeSchema>>;

const inputCls =
  "w-full h-12 rounded-[6px] border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors duration-200 focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary/40";
const labelCls = "mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground";

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {msg}
    </p>
  );
}

export default function ContactPage() {
  const t = useTranslations("ContactMe");
  const tf = useTranslations("ContactPage");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(
      makeSchema({ name: t("err_name"), email: t("err_email"), subject: t("err_subject"), message: t("err_message") })
    ),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": locale },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("server_error");
      setState("success");
      reset();
    } catch {
      setState("error");
    }
  };

  const subjectOptions = [
    { value: "project", label: tf("form_subject_project") },
    { value: "ai", label: tf("form_subject_ai") },
    { value: "consulting", label: tf("form_subject_consulting") },
    { value: "job", label: tf("form_subject_job") },
    { value: "other", label: tf("form_subject_other") },
  ];

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
          <div className="grid gap-14 md:grid-cols-12 md:gap-10">
            <aside className="space-y-10 md:col-span-5">
              <div className="reveal">
                <h2 className={labelCls}>{t("direct")}</h2>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group mt-1 inline-flex items-center gap-2 break-all font-display text-2xl text-foreground sm:text-3xl"
                >
                  <span className="link-draw">{siteConfig.email}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
                <div className="mt-5">
                  <CopyEmail email={siteConfig.email} copyLabel={t("copy")} copiedLabel={t("copied")} />
                </div>
              </div>

              <div className="reveal">
                <h2 className={labelCls}>{t("elsewhere")}</h2>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary">
                      <Github className="h-4 w-4" aria-hidden /> GitHub
                    </a>
                  </li>
                  <li>
                    <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary">
                      <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
                    </a>
                  </li>
                </ul>
              </div>

              <div className="reveal relative hidden aspect-[4/3] overflow-hidden rounded-[4px] bg-secondary md:block">
                <Image
                  src="/images/galata-ferry.jpg"
                  alt={t("photo_alt")}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-[50%_60%]"
                />
              </div>
            </aside>

            <div className="reveal md:col-span-7">
              <div className="rounded-[6px] border border-border bg-card p-6 sm:p-8">
                <h2 className="font-display text-3xl text-foreground">{t("form_title")}</h2>

                {state === "success" ? (
                  <div className="mt-8 space-y-5 py-6" role="status">
                    <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden />
                    <p className="text-base leading-relaxed text-foreground">{t("success")}</p>
                    <button
                      type="button"
                      onClick={() => setState("idle")}
                      className="text-sm font-medium text-foreground underline decoration-border underline-offset-[6px] transition-colors hover:decoration-primary"
                    >
                      {t("success_again")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
                    <input
                      {...register("website")}
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="c-name" className={labelCls}>{tf("form_name_label")}</label>
                        <input
                          id="c-name"
                          {...register("name")}
                          type="text"
                          placeholder={tf("form_name_placeholder")}
                          className={inputCls}
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "c-name-err" : undefined}
                        />
                        <FieldError id="c-name-err" msg={errors.name?.message} />
                      </div>
                      <div>
                        <label htmlFor="c-email" className={labelCls}>{tf("form_email_label")}</label>
                        <input
                          id="c-email"
                          {...register("email")}
                          type="email"
                          placeholder={tf("form_email_placeholder")}
                          className={inputCls}
                          autoComplete="email"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "c-email-err" : undefined}
                        />
                        <FieldError id="c-email-err" msg={errors.email?.message} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className={labelCls}>{tf("form_subject_label")}</label>
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
                      <FieldError id="c-subject-err" msg={errors.subject?.message} />
                    </div>

                    <div>
                      <label htmlFor="c-message" className={labelCls}>{tf("form_message_label")}</label>
                      <textarea
                        id="c-message"
                        {...register("message")}
                        placeholder={tf("form_message_placeholder")}
                        rows={6}
                        className={`${inputCls} h-auto resize-none py-3 leading-relaxed`}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "c-message-err" : undefined}
                      />
                      <FieldError id="c-message-err" msg={errors.message?.message} />
                    </div>

                    {state === "error" && (
                      <p role="alert" className="flex items-start gap-2.5 rounded-[6px] border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>
                          {t("error")}{" "}
                          <a href={`mailto:${siteConfig.email}`} className="underline">
                            {siteConfig.email}
                          </a>
                        </span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          {t("submitting")}
                        </>
                      ) : (
                        t("submit")
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
