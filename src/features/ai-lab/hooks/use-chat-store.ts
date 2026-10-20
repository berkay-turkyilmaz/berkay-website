"use client";

import { useSyncExternalStore } from "react";
import { parseChats, readRaw, subscribeChats, type StoredChat } from "../lib/chat-store";

const EMPTY: StoredChat[] = [];
let cachedRaw: string | null | undefined;
let cachedChats: StoredChat[] = EMPTY;

function getSnapshot(): StoredChat[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedChats = raw ? parseChats(raw) : EMPTY;
  }
  return cachedChats;
}

/** All saved chats, newest first. Empty on the server and during hydration. */
export function useChatStore(): StoredChat[] {
  return useSyncExternalStore(subscribeChats, getSnapshot, () => EMPTY);
}
