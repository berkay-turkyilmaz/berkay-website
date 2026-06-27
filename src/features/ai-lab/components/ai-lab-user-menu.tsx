"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, ChevronDown, ArrowUpLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkspaceSettings } from "../types";

export function AiLabUserMenu({
  settings,
  onOpenSettings,
  isSidebarOpen,
}: {
  settings: WorkspaceSettings;
  onOpenSettings: () => void;
  isSidebarOpen: boolean;
}) {
  const t = useTranslations("AiLabPage.sidebar");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = settings.displayName
    ? settings.displayName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
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
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center rounded-xl p-2 transition-[background-color,box-shadow] duration-300 ease-out",
          isSidebarOpen ? "gap-2 justify-start" : "gap-0 justify-center",
          open ? "bg-ailab-glass-08" : "bg-transparent hover:bg-ailab-glass-05"
        )}
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-ailab-glass-09 ring-1 ring-inset ring-ailab-border-spinner">
          {initials ? (
            <span className="text-[10px] font-bold text-ailab-text/80">{initials}</span>
          ) : (
            <User className="w-3.5 h-3.5 text-ailab-text/55" />
          )}
        </div>
        {isSidebarOpen && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold truncate text-ailab-text/75">
                {settings.displayName || t("guest_user")}
              </p>
              <p className="text-[9px] truncate text-ailab-text/45">{t("user_status")}</p>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 text-ailab-text/50"
            >
              <ChevronDown className="w-3 h-3" />
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
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-full left-0 right-0 z-[380] mb-2 overflow-hidden rounded-xl bg-ailab-elevated shadow-ailab-dropdown-up ring-1 ring-inset ring-ailab-border-strong"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-ailab-border-muted">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-ailab-glass-09 ring-1 ring-inset ring-ailab-border-spinner">
                {initials ? (
                  <span className="text-xs font-bold text-ailab-text/80">{initials}</span>
                ) : (
                  <User className="w-4 h-4 text-ailab-text/55" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-ailab-text/92">
                  {settings.displayName || t("guest_user")}
                </p>
                <p className="text-[9px] text-ailab-text/50">{t("user_status")}</p>
              </div>
            </div>

            <div className="p-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-ailab-text/65 transition-[background-color,color] duration-300 ease-out hover:bg-ailab-glass-07 hover:text-ailab-text/92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
              >
                <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs font-medium">{t("settings")}</span>
              </button>
            </div>

            <div className="p-1 border-t border-ailab-border-muted mt-0.5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg w-full text-ailab-muted transition-[background-color,color] duration-300 ease-out hover:bg-ailab-glass-06 hover:text-ailab-text/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ailab-accent/45"
              >
                <ArrowUpLeft className="w-3.5 h-3.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-medium block">{t("back_home")}</span>
                  <span className="text-[9px] text-ailab-muted/60">berkay.dev</span>
                </div>
                <Home className="w-3 h-3 text-ailab-muted/40 flex-shrink-0" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
