import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApiError } from "@/lib/api/error-messages";
import { forwardToWebhook } from "@/lib/api/forward-webhook";
import { checkRateLimit, RULES } from "@/lib/api/rate-limit";
import { getClientIp, getRequestLang } from "@/lib/api/request";
import { WEBHOOKS } from "@/lib/config/webhooks";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  subject: z.enum(["project", "ai", "consulting", "job", "other"]),
  message: z.string().trim().min(20).max(5_000),
  /** Honeypot: real users never fill this hidden field. */
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const lang = getRequestLang(req);
  const ip = getClientIp(req);

  if (!checkRateLimit(ip, RULES.contact)) {
    return NextResponse.json(
      { success: false, error: getApiError(lang, "rate_limited") },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: getApiError(lang, "invalid_json") },
      { status: 400 }
    );
  }

  // Bots that fill the honeypot get a fake success so they do not retry.
  if (
    typeof body === "object" &&
    body !== null &&
    typeof (body as { website?: unknown }).website === "string" &&
    (body as { website: string }).website.length > 0
  ) {
    return NextResponse.json({ success: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: getApiError(lang, "invalid_request") },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const delivered = await forwardToWebhook(WEBHOOKS.contact, {
    name,
    email,
    subject,
    message,
    source: "portfolio",
    receivedAt: new Date().toISOString(),
  });

  if (!delivered) {
    return NextResponse.json(
      { success: false, error: getApiError(lang, "api_error") },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
