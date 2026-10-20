import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ScopedIntl } from "@/lib/i18n/scoped-intl";
import { buildLanguageAlternates, isIndexedLocale, openGraphImagePath } from "@/lib/seo/page-metadata";
import { siteConfig } from "@/data/site-config";
import "./globals.css";

// --- FONT CONFIGURATION ---
const instrumentSerif = Instrument_Serif({
  variable: "--font-display-src",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2EA" },
    { media: "(prefers-color-scheme: dark)", color: "#161412" },
  ],
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// --- DYNAMIC METADATA (i18n SEO) ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  // Çeviri dosyasından Metadata isim alanını çekiyoruz
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: t("site_title"),
      template: `%s | ${t("site_name")}`,
    },
    description: t("description"),
    keywords: ["Frontend Developer", "React", "TypeScript", "Next.js", "Istanbul", "portfolio"],
    authors: [{ name: siteConfig.fullName, url: siteConfig.baseUrl }],
    creator: siteConfig.fullName,
    applicationName: siteConfig.fullName,
    formatDetection: { telephone: false, email: false, address: false },
    alternates: buildLanguageAlternates("/", locale),
    ...(isIndexedLocale(locale) ? {} : { robots: { index: false, follow: true } }),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180" }],
    },
    twitter: { card: "summary_large_image" },
    openGraph: {
      type: "website",
      locale:
        locale === "tr"
          ? "tr_TR"
          : locale === "de"
            ? "de_DE"
            : locale === "es"
              ? "es_ES"
              : locale === "fr"
                ? "fr_FR"
                : locale === "ja"
                  ? "ja_JP"
                  : locale === "ar"
                    ? "ar_SA"
                    : "en_US",
      url: siteConfig.baseUrl + "/",
      siteName: "BERKAY",
      images: [
        {
          url: openGraphImagePath(locale),
          width: 1200,
          height: 630,
          alt: t("og_alt"),
        },
      ],
    },
  };
}

// --- ROOT LAYOUT ---
export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body 
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${instrumentSerif.variable} 
          antialiased 
          min-h-screen 
          bg-background 
          text-foreground 
          selection:bg-primary/20 
          selection:text-primary
        `}
      >
        <ScopedIntl>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            
            {/* Premium Toast Bildirimleri */}
            <Toaster 
              position="bottom-right" 
              richColors 
              closeButton 
              duration={4000} 
              theme="system"
            /> 
          </ThemeProvider>
        </ScopedIntl>
      </body>
    </html>
  );
}