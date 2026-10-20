"use client";

import { Download, Printer } from "lucide-react";

interface ResumeActionsProps {
  printLabel: string;
  downloadLabel: string;
  email: string;
}

export function ResumeActions({ printLabel, downloadLabel, email }: ResumeActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 print:hidden">
      <button
        onClick={() => window.print()}
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-foreground"
      >
        <Printer className="h-4 w-4" aria-hidden />
        {printLabel}
      </button>
      <a
        href={`mailto:${email}?subject=CV Request`}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform duration-300 hover:-translate-y-0.5"
      >
        <Download className="h-4 w-4" aria-hidden />
        {downloadLabel}
      </a>
    </div>
  );
}
