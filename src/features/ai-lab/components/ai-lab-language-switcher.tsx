"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LANGUAGES } from "../constants";

const DROPDOWN_WIDTH = 176;

export function AiLabLanguageSwitcher() {
  const t = useTranslations("AiLabPage.sidebar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setMenuPos(null);
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, rect.right - DROPDOWN_WIDTH),
      window.innerWidth - DROPDOWN_WIDTH - 8
    );
    setMenuPos({ top: rect.bottom + 6, left });
  }, [isOpen, locale]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      const menu = document.getElementById("ailab-locale-menu");
      if (menu?.contains(t)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const left = Math.min(
        Math.max(8, rect.right - DROPDOWN_WIDTH),
        window.innerWidth - DROPDOWN_WIDTH - 8
      );
      setMenuPos({ top: rect.bottom + 6, left });
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [isOpen]);

  const handleSwitch = (code: string) => {
    if (locale === code) {
      setIsOpen(false);
      return;
    }
    router.replace(pathname, { locale: code });
    setIsOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const dropdown =
    typeof document !== "undefined" && isOpen && menuPos
      ? createPortal(
          <motion.div
            id="ailab-locale-menu"
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: DROPDOWN_WIDTH,
              zIndex: 400,
            }}
            className={cn(
              "rounded-xl overflow-hidden p-1",
              "bg-ailab-elevated ring-1 ring-inset ring-ailab-border-strong shadow-ailab-dropdown"
            )}
          >
            <div className="mb-1 border-b border-ailab-border-muted px-2.5 py-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-ailab-text/50">
                {t("ui_language")}
              </span>
            </div>
            {LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang.code}
                role="option"
                aria-selected={locale === lang.code}
                onClick={() => handleSwitch(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-[background-color,color] duration-300 ease-out",
                  locale === lang.code
                    ? "bg-ailab-glass-10 text-ailab-text/92"
                    : "text-ailab-text/65 hover:bg-ailab-glass-06 hover:text-ailab-text/85"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="text-xs font-medium">{lang.label}</span>
                </div>
                {locale === lang.code && <Check className="h-3 w-3 text-ailab-accent" />}
              </button>
            ))}
          </motion.div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="relative" ref={triggerRef}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg",
            "text-ailab-text/60 bg-ailab-glass-04 ring-1 ring-inset transition-[background-color,box-shadow,color,ring-color] duration-300 ease-out",
            isOpen
              ? "bg-ailab-glass-10 ring-ailab-border-bright text-ailab-text/85 shadow-ailab-accent-sm"
              : "ring-ailab-border-muted hover:bg-ailab-glass-07 hover:text-ailab-text/80"
          )}
        >
          <span className="text-sm leading-none">{current.flag}</span>
          <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block">
            {locale.toUpperCase()}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </button>
      </div>
      {dropdown}
    </>
  );
}
