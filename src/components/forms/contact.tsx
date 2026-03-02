"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const t = useTranslations("ContactForm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://n8n.138.197.186.170.sslip.io/webhook/contact-form", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          date: new Date().toISOString(),
          source: "Portfolio Website"
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast.success(t("success.title"), {
          description: t("success.description"),
        });
        setIsSuccess(true);
        reset();
      } else {
        throw new Error("Webhook Error");
      }
    } catch (error) {
      toast.error(t("error.title"), {
        description: t("error.description"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ORTAK INPUT STİLİ (Apple/Linear Style) ---
  // Kalın border yerine, yumuşak "ring" (hale) ve transparan geçişler
  const inputStyles = `
    bg-secondary/20 border-border/40 
    focus:bg-background focus:border-primary/20 
    focus:ring-4 focus:ring-primary/5 
    hover:border-primary/10 hover:bg-secondary/30
    transition-all duration-300 rounded-xl
    placeholder:text-muted-foreground/40
  `;

  const errorStyles = "border-red-500/30 focus:ring-red-500/10 focus:border-red-500/30 bg-red-500/5";

  return (
    <div className="bg-card/30 backdrop-blur-md border border-border/40 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* Dekoratif Işık (Daha soft) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 space-y-6"
          >
            <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner ring-1 ring-green-500/20">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">{t("success.title")}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {t("success.description")}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsSuccess(false)}
              className="rounded-full"
            >
              {t("success.reset")}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 relative z-10"
          >
            <div className="space-y-2">
              {/* DÜZELTİLDİ: Hardcoded text yerine t("tag") */}
              <div className="inline-flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> {t("tag")}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
              <p className="text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* İSİM */}
                <div className="space-y-2">
                  <Input
                    {...register("name", { required: true })}
                    placeholder={t("inputs.name")}
                    className={cn(
                      "h-12", 
                      inputStyles,
                      errors.name && errorStyles
                    )}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 pl-1">
                      <AlertCircle className="w-3 h-3" /> {t("inputs.errors.required")}
                    </span>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <Input
                    {...register("email", { 
                      required: t("inputs.errors.required"), // Boşsa bu hata
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Regex Kontrolü
                        message: "Geçersiz e-posta adresi" // Format yanlışsa bu hata (Bunu JSON'dan çekebilirsin)
                      }
                    })}
                    type="email"
                    placeholder={t("inputs.email")}
                    className={cn(
                      "h-12", 
                      inputStyles,
                      errors.email && errorStyles
                    )}
                  />
                   {errors.email && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 pl-1">
                      <AlertCircle className="w-3 h-3" /> 
                      {/* Hata mesajını dinamik göster */}
                      {errors.email.message || t("inputs.errors.required")}
                    </span>
                  )}
                </div>
              </div>

              {/* MESAJ */}
              <div className="space-y-2">
                <Textarea
                  {...register("message", { required: true })}
                  placeholder={t("inputs.message")}
                  className={cn(
                    "min-h-[150px] resize-none",
                    inputStyles,
                    errors.message && errorStyles
                  )}
                />
                 {errors.message && (
                    <span className="text-[10px] text-red-500 flex items-center gap-1 pl-1">
                      <AlertCircle className="w-3 h-3" /> {t("inputs.errors.required")}
                    </span>
                  )}
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("button.sending")}
                </>
              ) : (
                <>
                  {t("button.default")} 
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}