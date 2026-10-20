import { NextRequest, NextResponse } from "next/server";
import { getGroqStatus } from "@/lib/ai/groq-status";
import { checkRateLimit, RULES } from "@/lib/api/rate-limit";
import { getClientIp } from "@/lib/api/request";

/** Which chat models the server's Groq key can use. Lets the UI hide dead models and explain outages. */
export async function GET(req: NextRequest) {
  if (!checkRateLimit(getClientIp(req), RULES.models)) {
    return NextResponse.json({ state: "unreachable", models: [] }, { status: 429 });
  }
  const status = await getGroqStatus();
  return NextResponse.json(status, { headers: { "Cache-Control": "public, max-age=60" } });
}
