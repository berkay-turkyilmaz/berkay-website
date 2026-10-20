"use client";

import { useEffect, useState } from "react";

export type ModelState = "loading" | "ok" | "no_key" | "unauthorized" | "no_models" | "unreachable";

/** Chat models the server's Groq key can actually use (from /api/models). */
export function useAvailableModels(): { state: ModelState; models: string[] } {
  const [status, setStatus] = useState<{ state: ModelState; models: string[] }>({ state: "loading", models: [] });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/models", { signal: controller.signal })
      .then((r) => r.json() as Promise<{ state: ModelState; models: string[] }>)
      .then((data) => setStatus({ state: data.state, models: data.models ?? [] }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setStatus({ state: "unreachable", models: [] });
      });
    return () => controller.abort();
  }, []);

  return status;
}
