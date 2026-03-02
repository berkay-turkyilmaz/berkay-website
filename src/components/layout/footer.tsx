"use client";

import { Github, Linkedin, Mail, Twitter, Cpu, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing"; // i18n Link'ini kullanıyoruz
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  // Sosyal Medya Linkleri (Veri Yapısı)
  const socialLinks = [
    { icon: Github, href: "https://github.com/berkay-turkyilmaz", label: "Github" },
    { icon: Linkedin, href: "https://linkedin.com/in/berkay-turkyilmaz", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@berkaytrkylmzz@gmail.com", label: "Email" },
  ];

  // Site İçi Linkler
  const siteLinks = [
    { label: tNav("home"), href: "/" },
    { label: tNav("projects"), href: "/projects" }, // Artık ayrı sayfa
    { label: tNav("blog"), href: "/blog" },         // Artık ayrı sayfa
    { label: tNav("contact"), href: "/#contact" },
  ];

  return (
    <footer className="relative w-full border-t border-border/40 bg-background overflow-hidden">
      
      {/* Dekoratif Gradient Çizgi */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Sütun 1: Marka & Durum (4 birim) */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter group w-fit">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-md text-xl group-hover:rotate-12 transition-transform duration-300">B.</span>
              <span className="text-foreground">berkaytrkylmzz@gmail.com</span>
            </Link>
            
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              {t("description")}
            </p>
            
          </div>

          {/* Sütun 2: Linkler (3 birim) */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">{t("explore")}</h4>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
              {siteLinks.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="hover:text-primary hover:translate-x-1 transition-all flex items-center gap-1 group w-fit"
                >
                  {item.label} 
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Sütun 3: Sosyal & İletişim (4 birim) */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">{t("stay_connected")}</h4>
            
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label} // Erişilebilirlik için kritik
                >
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 transition-all shadow-sm border-border/50 bg-background">
                    <social.icon className="h-4 w-4" />
                  </Button>
                </a>
              ))}
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("project_idea")} <br />
              <a href="mailto:hello@berkaytrkylmzz@gmail.com" className="text-primary hover:underline font-semibold">
                hello@berkaytrkylmzz@gmail.com
              </a> {t("write_me")}.
            </p>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} BERKAY TURKYILMAZ.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default group">
              {t("powered_by")} <Cpu className="h-3 w-3 group-hover:animate-pulse text-primary" /> NEXT.JS 15
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}