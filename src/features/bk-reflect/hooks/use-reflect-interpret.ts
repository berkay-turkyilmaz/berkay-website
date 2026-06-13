"use client";

import { useCallback, useRef, useState } from "react";

export type ReflectFormInput = {
  reference: string;
  verseText: string;
  question: string;
};

function parseStreamError(text: string): string | null {
  if (text.startsWith("__ERR_EXTRACT__:")) {
    return text.slice("__ERR_EXTRACT__:".length);
  }
  return null;
}

export function useReflectInterpret() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const interpret = useCallback(async (input: ReflectFormInput) => {
    const reference = input.reference.trim();
    const verseText = input.verseText.trim();

    if (!reference && !verseText) {
      setError("Lütfen sure:ayet referansı girin veya ayet metnini yazın.");
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/bk-reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference || undefined,
          verseText: verseText || undefined,
          question: input.question.trim() || undefined,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "İstek başarısız oldu");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Yanıt okunamadı");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const streamErr = parseStreamError(accumulated);
        if (streamErr) {
          throw new Error(streamErr);
        }
        setResult(accumulated);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const reset = useCallback(() => {
    setResult("");
    setError(null);
  }, []);

  return { result, isLoading, error, interpret, reset, stop };
}
