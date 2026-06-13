"use client";

import type { ReactNode } from "react";

export function WorkspaceSectionHeader({
  icon,
  label,
  inline = false,
}: {
  icon: ReactNode;
  label: string;
  inline?: boolean;
}) {
  const cls = "text-[10px] font-bold uppercase tracking-widest text-ailab-text/50";
  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-ailab-text/50 [&>svg]:text-ailab-text/50">{icon}</span>
        <span className={cls}>{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-ailab-text/50 [&>svg]:text-ailab-text/50">{icon}</span>
      <span className={cls}>{label}</span>
    </div>
  );
}
