"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
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
      toast.success(copiedLabel);
    } catch {
      /* user cancelled share */
    }
  }, [title, copiedLabel]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground"
      title={label}
      aria-label={label}
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
