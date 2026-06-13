"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function TerminalCodeBlock({
  children,
  className,
  copyLabel,
  copiedLabel,
}: {
  children: string;
  className?: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") ?? "code";

  return (
    <div
      className={cn(
        "relative my-3 rounded-lg overflow-hidden",
        "ring-1 ring-inset ring-ailab-border transition-[box-shadow] duration-300 ease-out"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2",
          "bg-ailab-glass-05 border-b border-ailab-border-muted"
        )}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-ailab-text/50">{language}</span>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className={cn(
            "flex items-center gap-1.5 text-[10px]",
            "text-ailab-text/55 transition-[color,opacity] duration-300 ease-out",
            "hover:text-ailab-accent focus-visible:outline-none focus-visible:text-ailab-accent"
          )}
        >
          {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto ailab-scrollbar p-4 text-sm bg-ailab-code-bg text-ailab-text/88">
        <code>{children}</code>
      </pre>
    </div>
  );
}
