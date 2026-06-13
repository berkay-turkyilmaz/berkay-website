"use client";

import { useCallback, useState } from "react";

export type AyetFormInput = {
  reference: string;
  verseText: string;
  question: string;
};

export function useAyetInterpret() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interpret = useCallback(async (input: AyetFormInput) => {
    const reference = input.reference.trim();
    const verseText = input.verseText.trim();

    if (!reference && !verseText) {
      setError("Lütfen sure:ayet referansı girin veya ayet metnini yazın.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      const res = await fetch("/api/ayet-interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference || undefined,
          verseText: verseText || undefined,
          question: input.question.trim() || undefined,
        }),
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
        setResult(accumulated);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult("");
    setError(null);
  }, []);

  return { result, isLoading, error, interpret, reset };
}
