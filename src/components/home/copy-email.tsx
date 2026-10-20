"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the e-mail address; falls back to a visible address if the clipboard API is unavailable. */
export function CopyEmail({
  email,
  copyLabel,
  copiedLabel,
}: {
  email: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-border bg-background/70 px-5 text-sm font-medium text-foreground backdrop-blur transition-colors duration-300 hover:border-foreground"
    >
      {copied ? <Check className="h-4 w-4 text-primary" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span>{copied ? copiedLabel : copyLabel}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
