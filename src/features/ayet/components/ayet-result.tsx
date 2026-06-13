"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type AyetResultProps = {
  content: string;
  isLoading: boolean;
  className?: string;
};

export function AyetResult({ content, isLoading, className }: AyetResultProps) {
  if (!content && !isLoading) return null;

  return (
    <article
      className={cn(
        "rounded-2xl border border-amber-900/20 bg-[#0d1210]/80 p-6 shadow-xl backdrop-blur-sm sm:p-8",
        className
      )}
    >
      {isLoading && !content && (
        <p className="text-sm text-amber-100/50 animate-pulse">Yorum hazırlanıyor…</p>
      )}
      {content && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="mb-3 mt-6 first:mt-0 text-sm font-bold uppercase tracking-[0.15em] text-amber-200/90">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 mt-4 text-base font-semibold text-amber-50">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 text-[15px] leading-relaxed text-amber-50/85 last:mb-0">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 ml-4 list-disc space-y-1 text-[15px] text-amber-50/85">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 ml-4 list-decimal space-y-1 text-[15px] text-amber-50/85">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className="my-4 border-l-2 border-amber-600/40 pl-4 text-xl leading-loose text-amber-50/90"
                style={{ fontFamily: "var(--font-amiri), serif" }}
              >
                {children}
              </blockquote>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-amber-100">{children}</strong>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
      {isLoading && content && (
        <span className="mt-2 inline-block h-4 w-0.5 animate-pulse bg-amber-400/70" />
      )}
    </article>
  );
}
