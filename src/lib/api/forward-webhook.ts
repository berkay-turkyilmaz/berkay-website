/** POST JSON to an n8n webhook with a timeout. Returns true on a 2xx response. */
export async function forwardToWebhook(
  url: string,
  payload: unknown,
  timeoutMs = 8_000
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
    return res.ok;
  } catch (err) {
    console.error("[webhook] forward failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
