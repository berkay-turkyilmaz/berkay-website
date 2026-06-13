"use client";

import { useState } from "react";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AyetResult } from "@/features/ayet/components/ayet-result";
import { useAyetInterpret } from "@/features/ayet/hooks/use-ayet-interpret";

const QUICK_REFERENCES = [
  { label: "Fatiha 1", value: "1:1" },
  { label: "Bakara 255", value: "2:255" },
  { label: "İhlas 1", value: "112:1" },
  { label: "Yasin 36:58", value: "36:58" },
] as const;

export function AyetLanding() {
  const { result, isLoading, error, interpret, reset } = useAyetInterpret();
  const [reference, setReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void interpret({ reference, verseText, question });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#060a08] text-amber-50">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgb(180_140_60/0.08),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#c9a962 0,#c9a962 1px,transparent 0,transparent 50%)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-3xl flex-col px-5 pb-20 pt-14 sm:px-6 sm:pt-20">
        {/* Hero */}
        <header className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-950/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-200/70">
            <BookOpen className="h-3.5 w-3.5" />
            Tefekkür
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-50 sm:text-4xl md:text-5xl">
            Ayet Yorumu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-amber-100/55 sm:text-base">
            Kur&apos;an ayetlerini bağlamıyla birlikte anlamaya yardımcı olan kişisel bir
            tefekkür aracı. Resmi fetva veya bağlayıcı dinî hüküm niteliği taşımaz.
          </p>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-amber-900/25 bg-[#0a0f0c]/90 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="reference" className="text-xs font-semibold uppercase tracking-wider text-amber-200/60">
                Sure : Ayet
              </label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Örn. 2:255"
                className="h-11 border-amber-900/30 bg-[#060a08] text-amber-50 placeholder:text-amber-100/25 focus-visible:border-amber-700/50 focus-visible:ring-amber-700/20"
                disabled={isLoading}
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REFERENCES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setReference(item.value);
                      reset();
                    }}
                    className="rounded-md border border-amber-900/25 bg-amber-950/20 px-2.5 py-1 text-xs text-amber-200/70 transition-colors hover:border-amber-700/40 hover:text-amber-100 disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="verseText" className="text-xs font-semibold uppercase tracking-wider text-amber-200/60">
                Ayet metni veya meal <span className="normal-case text-amber-100/30">(isteğe bağlı)</span>
              </label>
              <Textarea
                id="verseText"
                value={verseText}
                onChange={(e) => setVerseText(e.target.value)}
                placeholder="Arapça veya Türkçe meal yazabilirsiniz…"
                rows={4}
                className="resize-none border-amber-900/30 bg-[#060a08] text-amber-50 placeholder:text-amber-100/25 focus-visible:border-amber-700/50 focus-visible:ring-amber-700/20"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="question" className="text-xs font-semibold uppercase tracking-wider text-amber-200/60">
                Sorunuz <span className="normal-case text-amber-100/30">(isteğe bağlı)</span>
              </label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Bu ayetten ne öğrenebilirim?"
                className="h-11 border-amber-900/30 bg-[#060a08] text-amber-50 placeholder:text-amber-100/25 focus-visible:border-amber-700/50 focus-visible:ring-amber-700/20"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-300/90" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-6 h-12 w-full rounded-xl bg-amber-700/90 font-semibold text-amber-50 hover:bg-amber-600 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Yorumlanıyor…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Ayeti Yorumla
              </>
            )}
          </Button>
        </form>

        {/* Result */}
        <div className="mt-8">
          <AyetResult content={result} isLoading={isLoading} />
        </div>

        {/* Disclaimer */}
        <footer className="mt-16 border-t border-amber-900/20 pt-8 text-center text-xs leading-relaxed text-amber-100/35">
          <p>
            Bu sayfa yalnızca kişisel tefekkür amaçlıdır. Dinî konularda Diyanet İşleri
            Başkanlığı ve yetkili ilmihal kaynaklarına başvurunuz.
          </p>
        </footer>
      </div>
    </div>
  );
}
