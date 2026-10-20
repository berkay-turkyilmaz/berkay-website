/**
 * Best-effort in-memory sliding-window rate limiter.
 * Serverless instances do not share memory, so this is a first line of defence;
 * pair it with a spend cap on the provider side.
 */
type Bucket = number[];

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5_000;

export type RateLimitRule = { name: string; limit: number; windowMs: number };

export function checkRateLimit(ip: string, rule: RateLimitRule): boolean {
  const now = Date.now();
  const key = `${rule.name}:${ip}`;
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < rule.windowMs);

  if (hits.length >= rule.limit) {
    buckets.set(key, hits);
    return false;
  }

  hits.push(now);
  buckets.set(key, hits);

  if (buckets.size > MAX_KEYS) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= rule.windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export const RULES = {
  chat: { name: "chat", limit: 20, windowMs: 60_000 },
  pdf: { name: "pdf", limit: 15, windowMs: 60_000 },
  reflect: { name: "reflect", limit: 8, windowMs: 60_000 },
  analyze: { name: "analyze", limit: 20, windowMs: 60_000 },
  contact: { name: "contact", limit: 1, windowMs: 5 * 60_000 },
  booking: { name: "booking", limit: 3, windowMs: 10 * 60_000 },
  models: { name: "models", limit: 30, windowMs: 60_000 },
} as const satisfies Record<string, RateLimitRule>;
