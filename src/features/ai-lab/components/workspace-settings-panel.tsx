"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { X, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MODEL_OPTIONS } from "../constants";
import type { WorkspaceSettings } from "../types";

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ailab-muted">
        {label}
      </p>
      <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-ailab-border-subtle divide-y divide-ailab-border-muted bg-ailab-glass-04">
        {children}
      </div>
    </div>
  );
}

function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-3.5 py-3 sm:px-4", className)}>{children}</div>;
}

export function WorkspaceSettingsPanel({
  settings,
  onUpdate,
  onClose,
  onClearHistory,
}: {
  settings: WorkspaceSettings;
  onUpdate: (s: Partial<WorkspaceSettings>) => void;
  onClose: () => void;
  onClearHistory: () => void;
}) {
  const t = useTranslations("AiLabPage.settings");
  const tSidebar = useTranslations("AiLabPage.sidebar");
  const guestName = tSidebar("guest_user");

  const [cleared, setCleared] = useState(false);
  const [nameValue, setNameValue] = useState(settings.displayName);

  const saveName = useCallback(() => {
    const trimmed = nameValue.trim();
    if (trimmed !== settings.displayName.trim()) {
      onUpdate({ displayName: trimmed });
    }
  }, [nameValue, settings.displayName, onUpdate]);

  useEffect(() => {
    setNameValue(settings.displayName);
  }, [settings.displayName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const lengthOptions = [
    { value: "short" as const, label: t("length_short") },
    { value: "medium" as const, label: t("length_medium") },
    { value: "detailed" as const, label: t("length_detailed") },
  ];

  const langOptions = [
    { value: "auto" as const, label: t("lang_auto") },
    { value: "tr" as const, label: "TR" },
    { value: "en" as const, label: "EN" },
    { value: "de" as const, label: "DE" },
    { value: "es" as const, label: "ES" },
    { value: "fr" as const, label: "FR" },
    { value: "ja" as const, label: "JA" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-ailab-scrim-60 sm:items-center sm:p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ailab-settings-title"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 420, damping: 38 }}
        className={cn(
          "flex w-full max-w-md flex-col overflow-hidden",
          "bg-ailab-elevated shadow-ailab-modal ring-1 ring-inset ring-ailab-border",
          "max-h-[min(90dvh,640px)] rounded-t-2xl sm:rounded-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 justify-center pt-2 sm:hidden" aria-hidden>
          <div className="h-1 w-9 rounded-full bg-ailab-border-muted" />
        </div>

        <header className="flex shrink-0 items-center justify-between gap-3 px-4 pb-3 pt-2 sm:px-5 sm:pt-4">
          <h2 id="ailab-settings-title" className="text-base font-semibold text-ailab-text">
            {t("title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-ailab-muted hover:bg-ailab-glass-06 hover:text-ailab-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto ailab-scrollbar px-4 pb-5 sm:px-5">
          <Group label={t("section_profile")}>
            <Row>
              <label htmlFor="ailab-name" className="mb-1.5 block text-xs text-ailab-muted">
                {t("display_name")}
              </label>
              <input
                id="ailab-name"
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), saveName())}
                placeholder={guestName}
                className={cn(
                  "w-full rounded-lg bg-ailab-glass-06 px-3 py-2.5 text-sm text-ailab-text placeholder:text-ailab-muted",
                  "ring-1 ring-inset ring-ailab-border-muted outline-none focus:ring-ailab-accent/40"
                )}
              />
            </Row>
          </Group>

          <Group label={t("model")}>
            {MODEL_OPTIONS.map((m) => {
              const sel = settings.model === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => onUpdate({ model: m.value })}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left sm:px-4",
                    "transition-colors hover:bg-ailab-glass-06",
                    sel && "bg-ailab-glass-06"
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ailab-text">{t(m.labelKey as never)}</p>
                    <p className="text-[11px] text-ailab-muted">{t(m.descKey as never)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[10px] text-ailab-muted">{t(m.speedKey as never)}</span>
                    {sel && <Check className="h-4 w-4 text-ailab-accent" strokeWidth={2.5} />}
                  </div>
                </button>
              );
            })}
          </Group>

          <Group label={t("section_response")}>
            <Row>
              <p className="mb-2 text-xs text-ailab-muted">{t("response_length")}</p>
              <div className="flex rounded-lg bg-ailab-glass-06 p-0.5 ring-1 ring-inset ring-ailab-border-muted">
                {lengthOptions.map((l) => {
                  const sel = settings.responseLength === l.value;
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => onUpdate({ responseLength: l.value })}
                      className={cn(
                        "flex-1 rounded-md py-2 text-xs font-medium transition-all",
                        sel
                          ? "bg-ailab-glass-10 text-ailab-text shadow-sm"
                          : "text-ailab-muted hover:text-ailab-text"
                      )}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </Row>
            <Row>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-ailab-muted">{t("creativity")}</span>
                <span className="font-mono text-ailab-text">{settings.temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={settings.temperature}
                onChange={(e) => onUpdate({ temperature: parseFloat(e.target.value) })}
                aria-label={t("creativity")}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
                style={{
                  background: `linear-gradient(to right, var(--color-ailab-accent-soft) ${settings.temperature * 100}%, var(--color-ailab-border-muted) ${settings.temperature * 100}%)`,
                }}
              />
              <div className="mt-1.5 flex justify-between text-[10px] text-ailab-muted">
                <span>{t("creativity_precise")}</span>
                <span>{t("creativity_creative")}</span>
              </div>
            </Row>
          </Group>

          <Group label={t("language")}>
            <Row>
              <p className="mb-2.5 text-[11px] leading-relaxed text-ailab-muted">{t("language_bex_hint")}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {langOptions.map((l) => {
                  const sel = settings.language === l.value;
                  return (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => onUpdate({ language: l.value as typeof settings.language })}
                      className={cn(
                        "rounded-lg py-2.5 text-xs font-semibold transition-all ring-1 ring-inset",
                        sel
                          ? "bg-ailab-accent/15 text-ailab-text ring-ailab-accent/40"
                          : "bg-ailab-glass-06 text-ailab-muted ring-ailab-border-muted hover:text-ailab-text"
                      )}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </Row>
          </Group>

          <Group label={t("section_shortcuts")}>
            <Row className="space-y-2">
              {[
                { label: t("shortcut_send"), keys: ["Enter"] },
                { label: t("shortcut_newline"), keys: ["Shift", "Enter"] },
                { label: t("shortcut_escape"), keys: ["Esc"] },
              ].map((shortcut) => (
                <div key={shortcut.label} className="flex items-center justify-between">
                  <span className="text-xs text-ailab-muted">{shortcut.label}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((k, i) => (
                      <span key={`${shortcut.label}-${k}`} className="flex items-center gap-1">
                        {i > 0 && <span className="text-[10px] text-ailab-muted/50">+</span>}
                        <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold text-ailab-muted bg-ailab-glass-08 ring-1 ring-inset ring-ailab-border-muted">
                          {k}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Row>
          </Group>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClearHistory();
                setCleared(true);
                window.setTimeout(() => setCleared(false), 2000);
              }}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors",
                "ring-1 ring-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-danger-border",
                cleared
                  ? "bg-ailab-glass-06 text-ailab-accent ring-ailab-accent/25"
                  : "text-ailab-danger-fg ring-ailab-danger-border/60 hover:bg-ailab-danger-bg"
              )}
            >
              {cleared ? <Check className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              {cleared ? t("cleared") : t("clear_chat")}
            </button>
            <p className="mt-2 text-center text-[10px] text-ailab-muted">{t("danger_clear_hint")}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
