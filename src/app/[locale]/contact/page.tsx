"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github, Twitter, ArrowRight } from "lucide-react";

// --- BİLEŞENLER ---
// Form kodunu ayrı dosyaya aldığını varsayıyorum, almadıysan yukarıdaki kodunu buraya import et
import ContactForm from "@/components/forms/contact"; 
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Link } from "@/i18n/routing";

export default function ContactPage() {
  const t = useTranslations("ContactPage");

  // Sosyal Medya Linkleri (CV'ne uygun düzenle)
  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/berkay-turkyilmaz", label: "LinkedIn", color: "hover:text-blue-600" },
    { icon: Github, href: "https://github.com/berkay-turkyilmaz", label: "GitHub", color: "hover:text-zinc-900 dark:hover:text-white" },
    { icon: Twitter, href: "https://x.com", label: "X / Twitter", color: "hover:text-blue-400" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      
      {/* 1. HEADER (Menü Çubuğu) */}
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* ÜST BAŞLIK ALANI */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t("status_badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              {t("title_line1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                {t("title_highlight")}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t("description")}
            </p>
          </motion.div>

          {/* GRID YAPISI: SOL (BİLGİ) - SAĞ (FORM) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* SOL TARAF: İletişim Bilgileri */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-12"
            >
              {/* Mail Kutusu */}
              <div className="group p-8 rounded-3xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all hover:bg-secondary/50">
                <div className="h-12 w-12 bg-background rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-1">{t("email_label")}</h3>
                <a href="mailto:berkaytrkylmzz@gmail.com" className="text-2xl md:text-3xl font-bold hover:text-primary transition-colors tracking-tight">
                  berkaytrkylmzz@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {t("response_time")}
                </p>
              </div>

              {/* Diğer Bilgiler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-border/50 bg-background/50">
                   <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <span className="font-bold">{t("location_label")}</span>
                   </div>
                   <p className="text-lg">İstanbul, Türkiye</p>
                   <p className="text-xs text-muted-foreground mt-1">Remote & Hybrid</p>
                </div>
                
                {/* Sosyal Medya */}
                <div className="p-6 rounded-3xl border border-border/50 bg-background/50 flex flex-col justify-center">
                   <span className="font-bold mb-4 block">{t("social_label")}</span>
                   <div className="flex gap-4">
                      {socialLinks.map((social, idx) => (
                        <a 
                          key={idx} 
                          href={social.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg bg-secondary hover:bg-background transition-all hover:shadow-md ${social.color}`}
                          title={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                   </div>
                </div>
              </div>

            </motion.div>

            {/* SAĞ TARAF: FORM (Senin kodunu çağırıyoruz) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <ContactForm />
            </motion.div>

          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer />
      
    </div>
  );
}