import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getApiError } from "@/lib/api/error-messages";
import { forwardToWebhook } from "@/lib/api/forward-webhook";
import { checkRateLimit, RULES } from "@/lib/api/rate-limit";
import { getClientIp, getRequestLang } from "@/lib/api/request";
import { WEBHOOKS } from "@/lib/config/webhooks";

const bookingSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+905\d{9}$/),
  service: z.string().trim().min(1).max(60),
  barber: z.string().trim().min(1).max(60),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function POST(req: NextRequest) {
  const lang = getRequestLang(req);

  if (!checkRateLimit(getClientIp(req), RULES.booking)) {
    return NextResponse.json({ error: getApiError(lang, "rate_limited") }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: getApiError(lang, "invalid_json") }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: getApiError(lang, "invalid_request") }, { status: 400 });
  }

  const delivered = await forwardToWebhook(WEBHOOKS.booking, parsed.data);
  if (!delivered) {
    return NextResponse.json({ error: getApiError(lang, "api_error") }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
