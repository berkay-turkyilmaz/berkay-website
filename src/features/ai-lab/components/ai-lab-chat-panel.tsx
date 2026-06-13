"use client";

import TerminalChat from "./terminal-chat";
import { useAiLabShell } from "./ai-lab-shell";

export function AiLabChatPanel() {
  const { settings, resolvedLanguage, activeMode, enableAgentWorkflow, chatSessionKey } =
    useAiLabShell();

  return (
    <TerminalChat
      key={`${activeMode}-${chatSessionKey}`}
      settings={{
        ...settings,
        language: resolvedLanguage as (typeof settings)["language"],
      }}
      mode={activeMode}
      enableAgentWorkflow={enableAgentWorkflow}
    />
  );
}
