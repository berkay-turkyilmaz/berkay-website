import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApiError } from "@/lib/api/error-messages";

// ─── Schema ───────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.enum(["project", "ai", "consulting", "job", "other"]),
  message: z.string().min(20),
});

// ─── In-memory rate limiter (per IP, 1 request per 5 min) ────────────────────

const rateMap = new Map<string, number>();
const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function checkRateLimit(ip: string): boolean {
  const last = rateMap.get(ip);
  const now = Date.now();
  if (last && now - last < RATE_WINDOW_MS) return false;
  rateMap.set(ip, now);
  // Cleanup old entries periodically
  if (rateMap.size > 500) {
    for (const [key, ts] of rateMap.entries()) {
      if (now - ts > RATE_WINDOW_MS) rateMap.delete(key);
    }
  }
  return true;
}

function getLang(req: NextRequest): string {
  const accept = req.headers.get("accept-language") ?? "";
  return accept.startsWith("tr") ? "tr" : "en";
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const lang = getLang(req);

  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: getApiError(lang, "rate_limited") },
      { status: 429 }
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: getApiError(lang, "invalid_json") },
      { status: 400 }
    );
  }

  // Validate
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: getApiError(lang, "invalid_request"),
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Log (replace with email service in production)
  console.log("[contact] New message", {
    name,
    email,
    subject,
    messagePreview: message.slice(0, 80),
    receivedAt: new Date().toISOString(),
    ip,
  });

  return NextResponse.json({ success: true, message: "received" });
}
