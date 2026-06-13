import type { ElementType } from "react";
import type { GroqChatModelId } from "@/lib/ai/groq-models";

export type ChatMode = "terminal" | "pdf" | "engineer";

export interface WorkspaceSettings {
  model: GroqChatModelId;
  responseLength: "short" | "medium" | "detailed";
  theme: "dark" | "light" | "system";
  language: "tr" | "en" | "de" | "auto";
  temperature: number;
  displayName: string;
}

export interface ChatHistoryItem {
  id: string;
  mode: ChatMode;
  title: string;
  timestamp: number;
  messages: BexChatMessage[];
}

/** Sidebar rows that open workspace settings / future API screen (no route). */
export type SidebarNavAction = "settings" | "api_config";

export interface SidebarItem {
  id: string;
  labelKey: string;
  descKey: string;
  icon: ElementType;
  type: "tool" | "link" | "action";
  /** When true, show outbound / external glyph (portfolio apps). */
  isOutbound?: boolean;
  /** Tool only: run simulated chain-of-thought UI before stream. */
  agentWorkflow?: boolean;
  chatMode?: ChatMode;
  href?: string;
  action?: SidebarNavAction;
}

export interface SidebarSection {
  categoryKey: string;
  items: SidebarItem[];
}

export type AgentWorkflowStepStatus = "pending" | "active" | "done";

export interface AgentWorkflowStepState {
  id: string;
  labelKey: string;
  status: AgentWorkflowStepStatus;
}

/** Inline “thinking chain” UI before streamed markdown appears. */
export interface AgentWorkflowUiState {
  messageId: string;
  steps: AgentWorkflowStepState[];
  phase: "steps" | "exit";
}

export interface BexChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface UploadedDoc {
  name: string;
  chunks: string[];
  totalChunks: number;
  size: number;
}
