"use client";

import TerminalChat from "./terminal-chat";
import { AiLabNewChatRedirect } from "./ai-lab-new-chat-redirect";
import { useAiLabShell } from "./ai-lab-shell";
import { isValidChatId, type ChatKind } from "../lib/chat-store";

/** Chat surface for `/ai-lab/chat/[id]` and `/ai-lab/documents/[id]`. */
export function AiLabChatPanel({ kind, chatId }: { kind: ChatKind; chatId: string }) {
  const { settings, resolvedLanguage } = useAiLabShell();

  if (!isValidChatId(chatId)) return <AiLabNewChatRedirect kind={kind} />;

  return (
    <TerminalChat
      key={`${kind}-${chatId}`}
      settings={{
        ...settings,
        language: resolvedLanguage as (typeof settings)["language"],
      }}
      kind={kind}
      chatId={chatId}
    />
  );
}
