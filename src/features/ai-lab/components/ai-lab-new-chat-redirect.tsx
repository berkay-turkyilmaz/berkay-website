"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { chatPath } from "../config/sidebar-navigation";
import { newChatId, type ChatKind } from "../lib/chat-store";

/** `/ai-lab/chat` and `/ai-lab/documents` hand out a fresh id so every chat has its own URL. */
export function AiLabNewChatRedirect({ kind }: { kind: ChatKind }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(chatPath(kind, newChatId()) as Parameters<typeof router.replace>[0]);
  }, [kind, router]);

  return <div className="h-full bg-ailab-canvas" aria-hidden />;
}
