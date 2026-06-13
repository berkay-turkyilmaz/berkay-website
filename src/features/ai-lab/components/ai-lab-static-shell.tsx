"use client";

/**
 * Layout skeleton for AI Lab — kept as a tiny client island so it can be used inside `next/dynamic` loading fallbacks.
 */
export function AiLabStaticShell({ variant = "workspace" }: { variant?: "workspace" | "terminal" }) {
  if (variant === "terminal") {
    return (
      <div
        className="flex flex-col h-screen overflow-hidden bg-ailab-canvas text-ailab-text"
        aria-busy="true"
        aria-label="AI Lab loading"
      >
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="max-w-2xl mx-auto pt-8 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-ailab-glass-04 border border-ailab-border-subtle" />
            <div className="h-6 w-3/5 max-w-md rounded bg-ailab-glass-06" />
            <div className="h-4 w-full max-w-md rounded bg-ailab-glass-04" />
            <div className="h-4 w-4/5 max-w-sm rounded bg-ailab-glass-04" />
          </div>
        </div>
        <div className="flex-shrink-0 px-6 pb-6 pt-3 bg-ailab-canvas border-t border-ailab-border">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 p-2.5 rounded-2xl bg-ailab-glass-04 border border-ailab-border-soft">
              <div className="flex-1 h-10 rounded-lg bg-ailab-glass-03" />
              <div className="h-10 w-10 rounded-xl bg-ailab-glass-08 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-ailab-canvas text-ailab-text"
      aria-busy="true"
      aria-label="AI Lab loading"
    >
      <aside
        className="flex flex-col w-60 flex-shrink-0 overflow-hidden bg-ailab-panel border-r border-ailab-border"
        aria-hidden
      >
        <div className="flex items-center gap-2.5 px-3.5 py-3.5 border-b border-ailab-border min-h-[52px]">
          <div className="w-7 h-7 rounded-lg bg-ailab-glass-05 border border-ailab-border-subtle" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="h-3 w-12 rounded bg-ailab-glass-08" />
            <div className="h-2.5 w-20 rounded bg-ailab-glass-05" />
          </div>
        </div>
        <div className="px-2 py-2.5">
          <div className="h-8 w-full rounded-lg bg-ailab-glass-03 border border-ailab-border-subtle" />
        </div>
        <div className="flex-1 px-2 space-y-3 py-1">
          <div className="h-2.5 w-16 rounded bg-ailab-glass-06 mb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-full rounded-lg bg-ailab-glass-03" />
          ))}
          <div className="h-2.5 w-14 rounded bg-ailab-glass-06 mb-2 mt-4" />
          {[1, 2].map((i) => (
            <div key={i} className="h-9 w-full rounded-lg bg-ailab-glass-03" />
          ))}
        </div>
        <div className="p-2 border-t border-ailab-border">
          <div className="h-11 w-full rounded-xl bg-ailab-glass-04" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-11 flex-shrink-0 flex items-center px-3 justify-between bg-ailab-scrim-95 border-b border-ailab-border-faint backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ailab-glass-04" />
            <div className="h-3 w-24 rounded bg-ailab-glass-08" />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block h-7 w-28 rounded-lg bg-ailab-glass-03 border border-ailab-border-faint" />
            <div className="h-7 w-14 rounded-lg bg-ailab-glass-03 border border-ailab-border-faint" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col bg-ailab-canvas">
          <div className="flex-1 overflow-hidden px-6 py-4">
            <div className="max-w-2xl mx-auto pt-6 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-ailab-glass-04 border border-ailab-border-subtle" />
              <div className="h-6 w-2/3 rounded bg-ailab-glass-06" />
              <div className="h-4 w-full rounded bg-ailab-glass-04" />
              <div className="h-4 w-5/6 rounded bg-ailab-glass-04" />
            </div>
          </div>
          <div className="flex-shrink-0 px-6 pb-6 pt-3 bg-ailab-canvas">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-end gap-2 p-2.5 rounded-2xl bg-ailab-glass-04 border border-ailab-border-soft">
                <div className="flex-1 h-10 rounded-lg bg-ailab-glass-03" />
                <div className="h-10 w-10 rounded-xl bg-ailab-glass-08 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
