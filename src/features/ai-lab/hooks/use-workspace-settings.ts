"use client";

import { useCallback, useEffect, useState } from "react";
import { GROQ_CHAT_MODEL_IDS } from "@/lib/ai/groq-models";
import { DEFAULT_SETTINGS } from "../constants";
import type { WorkspaceSettings } from "../types";

/**
 * Workspace preferences (model, language, etc.).
 * Site-wide light/dark is handled by `next-themes` on the root layout, not here —
 * AI Lab tokens are dark-first in CSS; we do not sync `theme` to `documentElement`.
 */
export function useWorkspaceSettings() {
  const [settings, setSettings] =
    useState<WorkspaceSettings>(DEFAULT_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("bex-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<WorkspaceSettings>;
        if (!(GROQ_CHAT_MODEL_IDS as readonly string[]).includes(parsed.model!)) {
          parsed.model = "llama-3.1-8b-instant";
        }
        delete (parsed as { streamingEnabled?: boolean }).streamingEnabled;
        const merged: WorkspaceSettings = { ...DEFAULT_SETTINGS, ...parsed };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
        setSettings(merged);
      } catch {
        /* ignore corrupt localStorage */
      }
    }
    setSettingsLoaded(true);
  }, []);

  const updateSettings = useCallback((partial: Partial<WorkspaceSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("bex-settings", JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings, settingsLoaded };
}
