"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, FileText, Terminal, Settings, PanelLeft,
  User, GraduationCap, ExternalLink, Trash2, Sliders,
  Monitor, Moon, Sun, Check, Cpu, AlignLeft,
  SquarePen, ChevronRight, Search, X, Globe, ChevronDown, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import TerminalPage, { type ChatMode } from "@/app/[locale]/ai-lab/terminal/page";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkspaceSettings {
  model: "llama-3.1-8b-instant" | "mixtral-8x7b-32768" | "llama-3.3-70b-versatile";
  responseLength: "short" | "medium" | "detailed";
  theme: "dark" | "light" | "system";
  language: "tr" | "en" | "de" | "auto";
  temperature: number;
  displayName: string;
}

const DEFAULT_SETTINGS: WorkspaceSettings = {
  model: "llama-3.1-8b-instant",
  responseLength: "medium",
  theme: "system",
  language: "auto",
  temperature: 0.7,
  displayName: "",
};

const VALID_MODELS = ["llama-3.1-8b-instant", "mixtral-8x7b-32768", "llama-3.3-70b-versatile"];

interface ChatHistoryItem {
  id: string;
  mode: ChatMode;
  title: string;
  timestamp: number;
}

interface SidebarItem {
  id: string;
  labelKey: string;
  descKey: string;
  icon: React.ElementType;
  type: "tool" | "link";
  chatMode?: ChatMode;
  href?: string;
}

interface SidebarSection {
  categoryKey: string;
  items: SidebarItem[];
}

const MODEL_OPTIONS = [
  { value: "llama-3.1-8b-instant" as const, label: "Llama 3.1 8B", desc: "Hızlı & verimli", speed: "~200 t/s" },
  { value: "mixtral-8x7b-32768" as const, label: "Mixtral 8x7B", desc: "Dengeli & güçlü", speed: "~140 t/s" },
  { value: "llama-3.3-70b-versatile" as const, label: "Llama 3.3 70B", desc: "En yetenekli", speed: "~80 t/s" },
];

// Supported UI languages (3 active)
const LANGUAGES = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  // { code: "fr", label: "Français", flag: "🇫🇷" },
  // { code: "es", label: "Español", flag: "🇪🇸" },
  // { code: "ar", label: "العربية", flag: "🇸🇦" },
  // { code: "ja", label: "日本語", flag: "🇯🇵" },
];

const SESSION_KEYS: Record<ChatMode, string> = {
  terminal: "bex-chat-terminal",
  pdf: "bex-chat-pdf",
  engineer: "bex-chat-engineer",
};

const HISTORY_KEY = "bex-chat-history";
const borderColor = "rgba(255,255,255,0.05)";

// ─── Language Switcher ────────────────────────────────────────────────────────

function AiLabLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSwitch = (code: string) => {
    if (locale === code) { setIsOpen(false); return; }
    router.replace(pathname, { locale: code });
    setIsOpen(false);
  };

  const current = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{
          background: isOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isOpen ? "rgba(255,255,255,0.15)" : borderColor}`,
          color: "rgba(255,255,255,0.45)",
        }}
        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; } }}
        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; } }}
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block">{locale.toUpperCase()}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-44 rounded-xl overflow-hidden z-50 p-1"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 40px rgba(0,0,0,0.8)" }}
          >
            <div className="px-2.5 py-1.5 mb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                Arayüz Dili
              </span>
            </div>
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSwitch(lang.code)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all text-left"
                style={{
                  background: locale === lang.code ? "rgba(255,255,255,0.07)" : "transparent",
                  color: locale === lang.code ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)",
                }}
                onMouseEnter={e => { if (locale !== lang.code) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (locale !== lang.code) e.currentTarget.style.background = "transparent"; }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="text-xs font-medium">{lang.label}</span>
                </div>
                {locale === lang.code && (
                  <Check className="w-3 h-3" style={{ color: "rgba(255,255,255,0.5)" }} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, label, inline = false }: { icon: React.ReactNode; label: string; inline?: boolean }) {
  const cls = "text-[10px] font-bold uppercase tracking-widest";
  const color = "rgba(255,255,255,0.2)";
  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className={cls} style={{ color }}>{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span style={{ color }}>{icon}</span>
      <span className={cls} style={{ color }}>{label}</span>
    </div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────

function SettingsPanel({ settings, onUpdate, onClose, onClearHistory }: {
  settings: WorkspaceSettings;
  onUpdate: (s: Partial<WorkspaceSettings>) => void;
  onClose: () => void;
  onClearHistory: () => void;
}) {
  const t = useTranslations("AiLabPage.settings");
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [nameValue, setNameValue] = useState(settings.displayName);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setNameValue(settings.displayName); }, [settings.displayName]);

  const handleThemeChange = (theme: WorkspaceSettings["theme"]) => {
    onUpdate({ theme });
    setTheme(theme);
  };

  const lengthOptions = [
    { value: "short" as const, label: t("length_short"), desc: t("length_short_desc") },
    { value: "medium" as const, label: t("length_medium"), desc: t("length_medium_desc") },
    { value: "detailed" as const, label: t("length_detailed"), desc: t("length_detailed_desc") },
  ];

  const themeOptions = [
    { value: "dark" as const, label: t("theme_dark"), icon: Moon },
    { value: "light" as const, label: t("theme_light"), icon: Sun },
    { value: "system" as const, label: t("theme_system"), icon: Monitor },
  ];

  // BEX response language — separate from UI language
  const bexLangOptions = [
    { value: "auto" as const, label: "Auto", flag: "🌐", desc: "Sayfanın diline göre" },
    { value: "tr" as const, label: "Türkçe", flag: "🇹🇷", desc: "Her zaman Türkçe" },
    { value: "en" as const, label: "English", flag: "🇬🇧", desc: "Always English" },
    { value: "de" as const, label: "Deutsch", flag: "🇩🇪", desc: "Immer Deutsch" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 100px rgba(0,0,0,0.9)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
              <Sliders className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.35)" }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>{t("title")}</h2>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{t("subtitle")}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.2)" }}
            onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.06) transparent" }}>

          {/* Display Name */}
          <section>
            <SectionHeader icon={<User className="w-3.5 h-3.5" />} label={t("display_name")} />
            <div className="flex gap-2">
              <input
                type="text"
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onUpdate({ displayName: nameValue.trim() || "User" })}
                placeholder={t("display_name_placeholder")}
                className="flex-1 px-3 py-2.5 rounded-xl text-xs bg-transparent border outline-none transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                onClick={() => onUpdate({ displayName: nameValue.trim() || "User" })}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                {t("save")}
              </button>
            </div>
          </section>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          {/* AI Model */}
          <section>
            <SectionHeader icon={<Cpu className="w-3.5 h-3.5" />} label={t("model")} />
            <div className="space-y-1.5">
              {MODEL_OPTIONS.map((m) => (
                <button key={m.value} onClick={() => onUpdate({ model: m.value })}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all text-left"
                  style={{
                    background: settings.model === m.value ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                    border: settings.model === m.value ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={e => { if (settings.model !== m.value) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (settings.model !== m.value) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div>
                    <div className="text-xs font-semibold" style={{ color: settings.model === m.value ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }}>{m.label}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.22)" }}>{m.desc}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>{m.speed}</span>
                    {settings.model === m.value && <Check className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.55)" }} />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          {/* Response Length */}
          <section>
            <SectionHeader icon={<AlignLeft className="w-3.5 h-3.5" />} label={t("response_length")} />
            <div className="grid grid-cols-3 gap-1.5">
              {lengthOptions.map((l) => (
                <button key={l.value} onClick={() => onUpdate({ responseLength: l.value })}
                  className="flex flex-col items-center p-3 rounded-xl transition-all"
                  style={{
                    background: settings.responseLength === l.value ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                    border: settings.responseLength === l.value ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={e => { if (settings.responseLength !== l.value) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (settings.responseLength !== l.value) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <span className="text-xs font-semibold mb-0.5" style={{ color: settings.responseLength === l.value ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }}>{l.label}</span>
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{l.desc}</span>
                  {settings.responseLength === l.value && <Check className="w-3 h-3 mt-1" style={{ color: "rgba(255,255,255,0.45)" }} />}
                </button>
              ))}
            </div>
          </section>

          {/* Temperature */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <SectionHeader icon={<Sliders className="w-3.5 h-3.5" />} label={t("creativity")} inline />
              <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                {settings.temperature.toFixed(1)}
              </span>
            </div>
            <input type="range" min="0" max="1" step="0.1"
              value={settings.temperature}
              onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
              className="w-full cursor-pointer appearance-none rounded-full h-1"
              style={{ background: `linear-gradient(to right, rgba(255,255,255,0.5) ${settings.temperature * 100}%, rgba(255,255,255,0.08) ${settings.temperature * 100}%)` }}
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.18)" }}>{t("creativity_precise")}</span>
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.18)" }}>{t("creativity_creative")}</span>
            </div>
          </section>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          {/* Theme — mounted guard prevents SSR mismatch, setTheme actually applies */}
          <section>
            <SectionHeader icon={<Monitor className="w-3.5 h-3.5" />} label={t("theme")} />
            {mounted ? (
              <div className="grid grid-cols-3 gap-1.5">
                {themeOptions.map((th) => (
                  <button key={th.value} onClick={() => handleThemeChange(th.value)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                    style={{
                      background: settings.theme === th.value ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                      border: settings.theme === th.value ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={e => { if (settings.theme !== th.value) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (settings.theme !== th.value) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  >
                    <th.icon className="w-4 h-4" style={{ color: settings.theme === th.value ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }} />
                    <span className="text-xs" style={{ color: settings.theme === th.value ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>{th.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="h-14 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }} />
            )}
          </section>

          {/* BEX Response Language */}
          <section>
            <SectionHeader icon={<Globe className="w-3.5 h-3.5" />} label={t("language")} />
            <div className="space-y-1.5">
              {bexLangOptions.map((l) => (
                <button key={l.value} onClick={() => onUpdate({ language: l.value })}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: settings.language === l.value ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                    border: settings.language === l.value ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={e => { if (settings.language !== l.value) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (settings.language !== l.value) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{l.flag}</span>
                    <div>
                      <div className="text-xs font-medium text-left" style={{ color: settings.language === l.value ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }}>{l.label}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{l.desc}</div>
                    </div>
                  </div>
                  {settings.language === l.value && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)" }} />}
                </button>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

          {/* Danger Zone */}
          <section>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,80,80,0.4)" }}>
              {t("danger_zone")}
            </div>
            <button
              onClick={() => { onClearHistory(); setCleared(true); setTimeout(() => setCleared(false), 2000); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-xl transition-all"
              style={{
                background: cleared ? "rgba(255,255,255,0.03)" : "rgba(255,50,50,0.04)",
                border: cleared ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,50,50,0.12)",
                color: cleared ? "rgba(255,255,255,0.4)" : "rgba(255,120,120,0.6)",
              }}
              onMouseEnter={e => { if (!cleared) e.currentTarget.style.background = "rgba(255,50,50,0.08)"; }}
              onMouseLeave={e => { if (!cleared) e.currentTarget.style.background = "rgba(255,50,50,0.04)"; }}
            >
              {cleared
                ? <Check className="w-3.5 h-3.5" />
                : <Trash2 className="w-3.5 h-3.5" />
              }
              <span className="text-xs font-medium">{cleared ? t("cleared") : t("clear_chat")}</span>
            </button>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.12)" }}>{t("version")}</span>
          <button onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            {t("close")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Chat history item ────────────────────────────────────────────────────────

function HistoryItem({ item, isActive, onClick, onDelete }: {
  item: ChatHistoryItem;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const icons: Record<ChatMode, React.ElementType> = {
    terminal: MessageSquare, pdf: FileText, engineer: Terminal,
  };
  const Icon = icons[item.mode];

  const diff = Date.now() - item.timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const timeAgo = mins < 1 ? "az önce" : mins < 60 ? `${mins}d` : hours < 24 ? `${hours}s` : `${days}g`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      className="group relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all"
      style={{
        background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
        border: isActive ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}
      onClick={onClick}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }} />
      <span className="flex-1 text-[11px] truncate" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.38)" }}>
        {item.title}
      </span>
      <span className="text-[9px] flex-shrink-0 group-hover:hidden" style={{ color: "rgba(255,255,255,0.15)" }}>
        {timeAgo}
      </span>
      <button
        onClick={onDelete}
        className="hidden group-hover:flex p-0.5 rounded flex-shrink-0 transition-all"
        style={{ color: "rgba(255,255,255,0.2)" }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,100,100,0.7)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </motion.div>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────

function UserMenu({ settings, onOpenSettings, isSidebarOpen }: {
  settings: WorkspaceSettings;
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
}) {
  const t = useTranslations("AiLabPage.sidebar");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = settings.displayName
    ? settings.displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()
    : "";

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center rounded-xl p-2 transition-all"
        style={{
          gap: isSidebarOpen ? "8px" : "0",
          justifyContent: isSidebarOpen ? "flex-start" : "center",
          background: open ? "rgba(255,255,255,0.06)" : "transparent",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.13)" }}>
          {initials
            ? <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>{initials}</span>
            : <User className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.38)" }} />
          }
        </div>
        {isSidebarOpen && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold truncate" style={{ color: "rgba(255,255,255,0.52)" }}>
                {settings.displayName || "User"}
              </p>
              <p className="text-[9px] truncate" style={{ color: "rgba(255,255,255,0.2)" }}>
                {t("user_status")}
              </p>
            </div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }} className="flex-shrink-0">
              <ChevronDown className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} />
            </motion.div>
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-full left-0 right-0 mb-2 rounded-xl overflow-hidden z-50"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 -20px 50px rgba(0,0,0,0.85)" }}
          >
            {/* Profile info */}
            <div className="flex items-center gap-2.5 px-3.5 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.13)" }}>
                {initials
                  ? <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>{initials}</span>
                  : <User className="w-4 h-4" style={{ color: "rgba(255,255,255,0.38)" }} />
                }
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>
                  {settings.displayName || "User"}
                </p>
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.28)" }}>
                  {t("user_status")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-1">
              <button
                onClick={() => { setOpen(false); onOpenSettings(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left"
                style={{ color: "rgba(255,255,255,0.48)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.82)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.48)"; }}
              >
                <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs font-medium">{t("settings")}</span>
              </button>

              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all w-full"
                style={{ color: "rgba(255,255,255,0.48)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.82)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.48)"; }}
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs font-medium">Ana Sayfaya Dön</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Workspace ───────────────────────────────────────────────────────────

export default function AiLabWorkspace() {
  const router = useRouter();
  const t = useTranslations("AiLabPage");
  const { setTheme } = useTheme();
  const locale = useLocale();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMode, setActiveMode] = useState<ChatMode>("terminal");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("bex-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!VALID_MODELS.includes(parsed.model)) parsed.model = "llama-3.1-8b-instant";
        delete parsed.streamingEnabled;
        const merged = { ...DEFAULT_SETTINGS, ...parsed };
        setSettings(merged);
        if (merged.theme) setTheme(merged.theme);
      } catch {}
    }
    const history = localStorage.getItem(HISTORY_KEY);
    if (history) {
      try { setChatHistory(JSON.parse(history)); } catch {}
    }
    setSettingsLoaded(true);
  }, [setTheme]);

  const updateSettings = useCallback((partial: Partial<WorkspaceSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("bex-settings", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    const w = window as Window & { bexClear?: () => void };
    if (w.bexClear) w.bexClear();
    else sessionStorage.removeItem(SESSION_KEYS[activeMode]);
    setActiveChatId(null);
  }, [activeMode]);

  const startNewChat = useCallback(() => {
    // Save current to history before clearing
    const msgs = sessionStorage.getItem(SESSION_KEYS[activeMode]);
    if (msgs) {
      try {
        const parsed = JSON.parse(msgs);
        const firstUser = parsed.find((m: { role: string }) => m.role === "user");
        if (firstUser) {
          const item: ChatHistoryItem = {
            id: Date.now().toString(),
            mode: activeMode,
            title: firstUser.content.slice(0, 45) + (firstUser.content.length > 45 ? "…" : ""),
            timestamp: Date.now(),
          };
          setChatHistory(prev => {
            const next = [item, ...prev].slice(0, 50);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
            return next;
          });
        }
      } catch {}
    }
    clearHistory();
  }, [activeMode, clearHistory]);

  const deleteHistoryItem = useCallback((id: string) => {
    setChatHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Resolve BEX response language — uses next-intl locale (SSR safe, no document access)
  const resolvedLanguage = settings.language === "auto"
    ? (locale.startsWith("de") ? "de" : locale.startsWith("tr") ? "tr" : "en")
    : settings.language;

  const sidebarSections: SidebarSection[] = [
    {
      categoryKey: "sidebar.categories.tools",
      items: [
        { id: "terminal", labelKey: "sidebar.items.terminal", descKey: "sidebar.items.terminal_desc", icon: MessageSquare, type: "tool", chatMode: "terminal" },
        { id: "pdf", labelKey: "sidebar.items.pdf", descKey: "sidebar.items.pdf_desc", icon: FileText, type: "tool", chatMode: "pdf" },
        { id: "engineer", labelKey: "sidebar.items.engineer", descKey: "sidebar.items.engineer_desc", icon: Terminal, type: "tool", chatMode: "engineer" },
      ],
    },
    {
      categoryKey: "sidebar.categories.projects",
      items: [
        { id: "english", labelKey: "sidebar.items.english", descKey: "sidebar.items.english_desc", icon: GraduationCap, type: "link", href: "/ai-lab/english-practice" },
        { id: "booking", labelKey: "sidebar.items.booking", descKey: "sidebar.items.booking_desc", icon: ExternalLink, type: "link", href: "/ai-lab/booking" },
      ],
    },
  ];

  const activeSidebarId = sidebarSections.flatMap(s => s.items).find(i => i.chatMode === activeMode)?.id ?? "terminal";
  const activeLabel = sidebarSections.flatMap(s => s.items)
    .find(i => i.chatMode === activeMode)
    ?.labelKey ? t(sidebarSections.flatMap(s => s.items).find(i => i.chatMode === activeMode)!.labelKey as any)
    : "LLM Terminal";

  const handleItemClick = (item: SidebarItem) => {
    if (item.type === "link" && item.href) {
      router.push(item.href as Parameters<typeof router.push>[0]);
    } else if (item.type === "tool" && item.chatMode) {
      setActiveMode(item.chatMode);
      setShowHistory(false);
      if (isMobile) setIsSidebarOpen(false);
    }
  };

  const initials = settings.displayName
    ? settings.displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "";

  const filteredHistory = chatHistory.filter(h =>
    !historySearch || h.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#000", color: "#fff" }}>

      <AnimatePresence>
        {showSettings && (
          <SettingsPanel
            settings={settings}
            onUpdate={updateSettings}
            onClose={() => setShowSettings(false)}
            onClearHistory={clearHistory}
          />
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─────────────────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 240 : 48 }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className={cn(
          "flex flex-col overflow-hidden flex-shrink-0",
          isMobile && isSidebarOpen ? "fixed inset-y-0 left-0 z-40 shadow-2xl" : "relative"
        )}
        style={{ background: "#080808", borderRight: `1px solid ${borderColor}` }}
      >
        {/* Logo */}
        <div className="flex items-center overflow-hidden flex-shrink-0"
          style={{ borderBottom: `1px solid ${borderColor}`, minHeight: 52, padding: isSidebarOpen ? "0 14px" : "0 12px" }}>
          {isSidebarOpen ? (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>B</span>
              </div>
              <div>
                <p className="font-bold text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.12em" }}>BEX</p>
                <p className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.15)" }}>AI Lab · v2.0</p>
              </div>
            </Link>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)}
              className="mx-auto flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>B</span>
            </button>
          )}
        </div>

        {/* New Chat */}
        <div className="flex-shrink-0 px-2 py-2.5">
          {isSidebarOpen ? (
            <button onClick={startNewChat}
              className="w-full flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <SquarePen className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t("sidebar.new_chat")}</span>
            </button>
          ) : (
            <button onClick={startNewChat} title={t("sidebar.new_chat")}
              className="w-full flex items-center justify-center h-8 rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "transparent"; }}
            >
              <SquarePen className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 overflow-x-hidden"
          style={{ scrollbarWidth: "none" }}>

          {sidebarSections.map((section, idx) => (
            <div key={idx} className="mb-4">
              {isSidebarOpen && (
                <div className="px-2 mb-1 text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.12)" }}>
                  {t(section.categoryKey as any)}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.id === activeSidebarId;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      whileTap={{ scale: 0.97 }}
                      title={!isSidebarOpen ? t(item.labelKey as any) : undefined}
                      className="w-full flex items-center rounded-lg transition-all duration-150 relative"
                      style={{
                        padding: isSidebarOpen ? "7px 10px" : "8px",
                        justifyContent: isSidebarOpen ? "flex-start" : "center",
                        gap: isSidebarOpen ? "9px" : "0",
                        background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                        color: isActive ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.28)",
                        border: isActive ? "1px solid rgba(255,255,255,0.09)" : "1px solid transparent",
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.52)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "transparent"; } }}
                    >
                      {isActive && (
                        <motion.div layoutId="activeBar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                          style={{ background: "rgba(255,255,255,0.5)" }}
                        />
                      )}
                      <item.icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                      {isSidebarOpen && (
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-medium">{t(item.labelKey as any)}</span>
                            {item.type === "link" && <ExternalLink className="w-2.5 h-2.5 opacity-20 flex-shrink-0" />}
                          </div>
                          <div className="text-[9px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.14)" }}>
                            {t(item.descKey as any)}
                          </div>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Chat History */}
          {isSidebarOpen && chatHistory.length > 0 && (
            <div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: 8 }} />
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between px-2 py-1 rounded-lg transition-all mb-0.5"
                style={{ color: "rgba(255,255,255,0.15)" }}
                onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.15)"}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest">Geçmiş</span>
                <motion.div animate={{ rotate: showHistory ? 90 : 0 }} transition={{ duration: 0.15 }}>
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    {chatHistory.length > 5 && (
                      <div className="relative mb-1.5">
                        <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.18)" }} />
                        <input
                          value={historySearch}
                          onChange={e => setHistorySearch(e.target.value)}
                          placeholder="Ara..."
                          className="w-full pl-7 pr-2 py-1.5 rounded-lg text-[11px] bg-transparent border outline-none"
                          style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                        />
                      </div>
                    )}
                    <div className="space-y-0.5 max-h-44 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                      {filteredHistory.map(item => (
                        <HistoryItem
                          key={item.id}
                          item={item}
                          isActive={item.id === activeChatId}
                          onClick={() => { setActiveMode(item.mode); setActiveChatId(item.id); }}
                          onDelete={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom — UserMenu only. Settings/logout accessible from user dropdown. No separate Settings button. */}
        <div className="flex-shrink-0 p-2" style={{ borderTop: `1px solid ${borderColor}` }}>
          <UserMenu
            settings={settingsLoaded ? settings : DEFAULT_SETTINGS}
            onOpenSettings={() => setShowSettings(true)}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </motion.aside>

      {/* ─── MAIN ────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Header */}
        <header className="h-11 flex-shrink-0 flex items-center px-3 justify-between"
          style={{ background: "rgba(0,0,0,0.95)", borderBottom: `1px solid ${borderColor}`, backdropFilter: "blur(12px)" }}>

          {/* Left */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "rgba(255,255,255,0.2)" }}
              onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
            >
              <PanelLeft className="w-4 h-4" />
            </motion.button>

            <div className="h-3 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />

            <AnimatePresence mode="wait">
              <motion.span
                key={activeMode}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {activeLabel}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Right — Model pill + Language Switcher only. Settings via user menu. */}
          <div className="flex items-center gap-1.5">
            {/* Active model indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${borderColor}` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(80,255,140,0.55)" }} />
              <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.22)" }}>
                {MODEL_OPTIONS.find(m => m.value === settings.model)?.label ?? "Llama 3.1 8B"}
              </span>
            </div>

            {/* Language Switcher */}
            <AiLabLanguageSwitcher />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <TerminalPage
            settings={{ ...settings, language: resolvedLanguage as "tr" | "en" }}
            mode={activeMode}
          />
        </div>
      </main>
    </div>
  );
}