import type { BexChatMessage } from "../types";

export type ChatKind = "chat" | "document";

/** A saved conversation. Document chunks are never persisted (size); only the file name is. */
export interface StoredChat {
  id: string;
  kind: ChatKind;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: BexChatMessage[];
  docName?: string;
  /** True once the user renamed the chat; auto-title no longer overwrites it. */
  titleLocked?: boolean;
}

export const CHATS_KEY = "bex-chats-v2";
const LEGACY_HISTORY_KEY = "bex-chat-history";
const LEGACY_SESSION_KEYS = ["bex-chat-terminal", "bex-chat-pdf", "bex-chat-engineer"] as const;
const MAX_CHATS = 100;
const CHANGE_EVENT = "bex-chats-changed";

export function newChatId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return rand;
}

export function makeTitle(messages: BexChatMessage[]): string {
  const first = messages.find((m) => m.role === "user")?.content.trim() ?? "";
  if (!first) return "";
  return first.length > 48 ? `${first.slice(0, 48)}…` : first;
}

function isStoredChat(v: unknown): v is StoredChat {
  if (!v || typeof v !== "object") return false;
  const c = v as Partial<StoredChat>;
  return (
    typeof c.id === "string" &&
    (c.kind === "chat" || c.kind === "document") &&
    typeof c.title === "string" &&
    Array.isArray(c.messages)
  );
}

export function parseChats(raw: string | null): StoredChat[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isStoredChat) : [];
  } catch {
    return [];
  }
}

export function readRaw(): string | null {
  try {
    return localStorage.getItem(CHATS_KEY);
  } catch {
    return null;
  }
}

function write(chats: StoredChat[]) {
  const sorted = [...chats].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CHATS);
  try {
    localStorage.setItem(CHATS_KEY, JSON.stringify(sorted));
  } catch {
    /* storage full or blocked: keep the in-memory chat working */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeChats(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getChat(id: string): StoredChat | undefined {
  return parseChats(readRaw()).find((c) => c.id === id);
}

export function saveChat(input: {
  id: string;
  kind: ChatKind;
  messages: BexChatMessage[];
  docName?: string;
}) {
  const { id, kind, messages, docName } = input;
  const clean = messages.filter((m) => m.content !== "");
  if (clean.length === 0) return;
  const chats = parseChats(readRaw());
  const existing = chats.find((c) => c.id === id);
  const now = Date.now();
  const next: StoredChat = {
    id,
    kind,
    title: existing?.titleLocked
      ? existing.title
      : makeTitle(clean) || existing?.title || "…",
    titleLocked: existing?.titleLocked,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    messages: clean,
    docName: docName ?? existing?.docName,
  };
  write([next, ...chats.filter((c) => c.id !== id)]);
}

export function renameChat(id: string, title: string) {
  const trimmed = title.trim().slice(0, 80);
  if (!trimmed) return;
  const chats = parseChats(readRaw()).map((c) =>
    c.id === id ? { ...c, title: trimmed, titleLocked: true } : c
  );
  write(chats);
}

export function deleteChat(id: string) {
  write(parseChats(readRaw()).filter((c) => c.id !== id));
}

export function deleteAllChats() {
  write([]);
}

/**
 * One-time move from the v1 layout (history array in `bex-chat-history` plus the
 * three per-mode session slots) to the id-addressed v2 list. Legacy keys are removed.
 */
export function migrateLegacyChats() {
  try {
    if (localStorage.getItem(CHATS_KEY) !== null) return;

    const migrated: StoredChat[] = [];
    const legacyRaw = localStorage.getItem(LEGACY_HISTORY_KEY);
    if (legacyRaw) {
      const items: unknown = JSON.parse(legacyRaw);
      if (Array.isArray(items)) {
        for (const it of items) {
          const v = it as {
            id?: unknown;
            mode?: unknown;
            title?: unknown;
            timestamp?: unknown;
            messages?: unknown;
          };
          if (typeof v.id !== "string" || !Array.isArray(v.messages) || v.messages.length === 0) continue;
          const ts = typeof v.timestamp === "number" ? v.timestamp : Date.now();
          migrated.push({
            id: v.id,
            kind: v.mode === "pdf" ? "document" : "chat",
            title: typeof v.title === "string" && v.title ? v.title : "…",
            createdAt: ts,
            updatedAt: ts,
            messages: v.messages as BexChatMessage[],
          });
        }
      }
    }

    // The conversation that was open at the time (per-tab session slots).
    for (const key of LEGACY_SESSION_KEYS) {
      const raw = sessionStorage.getItem(key);
      if (!raw) continue;
      const msgs: unknown = JSON.parse(raw);
      if (!Array.isArray(msgs) || msgs.length === 0) continue;
      const messages = msgs as BexChatMessage[];
      const already = migrated.some(
        (c) => c.messages.length === messages.length && c.messages[0]?.content === messages[0]?.content
      );
      if (already) continue;
      const now = Date.now();
      migrated.push({
        id: newChatId(),
        kind: key === "bex-chat-pdf" ? "document" : "chat",
        title: makeTitle(messages) || "…",
        createdAt: now,
        updatedAt: now,
        messages,
      });
    }

    localStorage.setItem(
      CHATS_KEY,
      JSON.stringify(migrated.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CHATS))
    );
    localStorage.removeItem(LEGACY_HISTORY_KEY);
    for (const key of LEGACY_SESSION_KEYS) sessionStorage.removeItem(key);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* corrupted legacy data: start clean */
    try {
      if (localStorage.getItem(CHATS_KEY) === null) localStorage.setItem(CHATS_KEY, "[]");
    } catch {
      /* storage unavailable */
    }
  }
}

export function isValidChatId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{6,40}$/.test(id);
}
