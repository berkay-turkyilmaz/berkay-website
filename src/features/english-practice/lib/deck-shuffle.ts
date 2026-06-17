function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readJsonArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeJsonArray(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(ids));
}

function dailyStorageKey(gameKey: string): string {
  return `ep-daily-${gameKey}-${todayKey()}`;
}

function sessionStorageKey(gameKey: string): string {
  return `ep-session-${gameKey}`;
}

const MAX_SESSION_RECENT = 80;

/** Mark a card as seen today + in current browser session. */
export function markCardSeen(gameKey: string, cardId: string) {
  if (!cardId || typeof window === "undefined") return;

  const daily = new Set(readJsonArray(dailyStorageKey(gameKey)));
  if (!daily.has(cardId)) {
    daily.add(cardId);
    writeJsonArray(dailyStorageKey(gameKey), [...daily]);
  }

  const session = [cardId, ...readJsonArray(sessionStorageKey(gameKey)).filter((id) => id !== cardId)].slice(
    0,
    MAX_SESSION_RECENT
  );
  writeJsonArray(sessionStorageKey(gameKey), session);
}

/**
 * Build a deck excluding cards already seen today (then session).
 * Falls back gracefully when the pool is exhausted.
 */
export function buildSmartDeck<T extends { id: string }>(
  pool: T[],
  count: number,
  gameKey: string
): T[] {
  if (pool.length === 0) return [];

  const target = Math.min(count, pool.length);
  const dailySeen = new Set(readJsonArray(dailyStorageKey(gameKey)));
  const sessionSeen = new Set(readJsonArray(sessionStorageKey(gameKey)));

  let available = pool.filter((c) => !dailySeen.has(c.id));
  if (available.length < target) {
    available = pool.filter((c) => !sessionSeen.has(c.id));
  }
  if (available.length < target) {
    available = [...pool];
  }

  return shuffle(available).slice(0, target);
}

export function clearRecentDeck(gameKey: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(sessionStorageKey(gameKey));
  localStorage.removeItem(dailyStorageKey(gameKey));
}

export function getDailySeenCount(gameKey: string, pool: { id: string }[]): number {
  const dailySeen = new Set(readJsonArray(dailyStorageKey(gameKey)));
  return pool.filter((c) => dailySeen.has(c.id)).length;
}
