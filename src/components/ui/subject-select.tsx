"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

type SubjectSelectProps = {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  id?: string;
};

export function SubjectSelect({
  options,
  value,
  onChange,
  placeholder = "—",
  error,
  id,
}: SubjectSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 bg-secondary/20 border border-border/50 rounded-xl px-4 text-sm text-left flex items-center justify-between transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
          error && "border-destructive/50 focus:ring-destructive/20",
          !selected && "text-muted-foreground/40"
        )}
      >
        <span className={selected ? "text-foreground" : undefined}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground/50 transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-border/60 bg-card shadow-xl py-1 overflow-hidden"
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={value === option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 text-sm text-left text-foreground hover:bg-secondary/70 transition-colors flex items-center justify-between gap-2",
                  value === option.value && "bg-primary/10 text-primary font-medium"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="w-4 h-4 shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
