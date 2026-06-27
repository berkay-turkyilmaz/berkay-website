"use client";

import { Download, Printer } from "lucide-react";

interface ResumeActionsProps {
  printLabel: string;
  downloadLabel: string;
  email: string;
}

export function ResumeActions({ printLabel, downloadLabel, email }: ResumeActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.print()}
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-muted-foreground bg-secondary/60 hover:bg-secondary border border-border/50 rounded-xl transition-all hover:text-foreground print:hidden"
      >
        <Printer className="w-4 h-4" />
        {printLabel}
      </button>
      <a
        href={`mailto:${email}?subject=CV Request`}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all hover:scale-105 shadow-sm shadow-primary/20 print:hidden"
      >
        <Download className="w-4 h-4" />
        {downloadLabel}
      </a>
    </div>
  );
}
