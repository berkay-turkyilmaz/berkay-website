import { GROQ_PREFERRED_MODELS, isChatModelId } from "./groq-models";

export type GroqState = "ok" | "no_key" | "unauthorized" | "no_models" | "unreachable";

export type GroqStatus = {
  state: GroqState;
  /** Chat models the configured key can use, preferred ones first. */
  models: string[];
};

const TTL_OK_MS = 10 * 60_000;
const TTL_BAD_MS = 60_000;
let cache: { at: number; value: GroqStatus } | null = null;

function orderModels(ids: string[]): string[] {
  const preferred = GROQ_PREFERRED_MODELS.filter((m) => ids.includes(m));
  const rest = ids.filter((m) => !(GROQ_PREFERRED_MODELS as readonly string[]).includes(m)).sort();
  return [...preferred, ...rest];
}

/** Asks Groq which models this key can use. Cached; never exposes the key or raw provider errors. */
export async function getGroqStatus(): Promise<GroqStatus> {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) return { state: "no_key", models: [] };

  const now = Date.now();
  if (cache && now - cache.at < (cache.value.state === "ok" ? TTL_OK_MS : TTL_BAD_MS)) return cache.value;

  let value: GroqStatus;
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(6_000),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) {
      value = { state: "unauthorized", models: [] };
    } else if (!res.ok) {
      value = { state: "unreachable", models: [] };
    } else {
      const data = (await res.json()) as { data?: { id: string; active?: boolean }[] };
      const ids = (data.data ?? []).filter((m) => m.active !== false).map((m) => m.id).filter(isChatModelId);
      value = ids.length ? { state: "ok", models: orderModels(ids) } : { state: "no_models", models: [] };
    }
  } catch {
    value = { state: "unreachable", models: [] };
  }

  cache = { at: now, value };
  return value;
}

/** Picks the requested model when the key can use it, otherwise the best available one. */
export async function resolveModel(
  requested?: string
): Promise<{ ok: true; model: string } | { ok: false; state: GroqState }> {
  const status = await getGroqStatus();
  if (status.state !== "ok") return { ok: false, state: status.state };
  const model = requested && status.models.includes(requested) ? requested : status.models[0];
  return { ok: true, model };
}
