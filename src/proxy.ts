import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(tr|en|de|es|fr|ar|ja)/:path*",
    "/((?!_next|_vercel|api|.*\..*).*)",
  ],
};
