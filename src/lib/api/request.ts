import type { NextRequest } from "next/server";

/** Locale hint for API error messages (tr or en). */
export function getRequestLang(req: NextRequest): "tr" | "en" {
  const accept = req.headers.get("accept-language") ?? "";
  return accept.toLowerCase().startsWith("tr") ? "tr" : "en";
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
