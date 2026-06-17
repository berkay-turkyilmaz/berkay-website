"use client";

import { Share2 } from "lucide-react";
import { useCallback } from "react";

type Props = {
  title: string;
  label: string;
  copiedLabel?: string;
};

export function ShareArticleButton({ title, label, copiedLabel = "Link copied!" }: Props) {
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      // eslint-disable-next-line no-alert
      alert(copiedLabel);
    } catch {
      /* user cancelled share */
    }
  }, [title, copiedLabel]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="p-2.5 rounded-full text-muted-foreground hover:bg-secondary hover:text-primary transition-all border border-transparent hover:border-border/50"
      title={label}
      aria-label={label}
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
