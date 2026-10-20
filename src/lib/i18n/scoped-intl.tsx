import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

/** Namespaces every page needs on the client (header, footer, language switcher). */
const BASE_NAMESPACES = ["Navigation", "Footer", "LanguageSwitcher"] as const;

/**
 * Hands only the listed message namespaces to client components.
 * Shipping the whole message tree to every page added ~200 KB of HTML.
 * Server components are unaffected: they read messages on the server.
 */
export async function ScopedIntl({
  namespaces = [],
  children,
}: {
  namespaces?: readonly string[];
  children: React.ReactNode;
}) {
  const all = (await getMessages()) as Record<string, unknown>;
  const picked: Record<string, unknown> = {};
  for (const ns of [...BASE_NAMESPACES, ...namespaces]) {
    if (ns in all) picked[ns] = all[ns];
  }
  return <NextIntlClientProvider messages={picked}>{children}</NextIntlClientProvider>;
}
