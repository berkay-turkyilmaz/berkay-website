import { Geist, Geist_Mono } from "next/font/google";
import { getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { buildLanguageAlternates, openGraphImagePath } from "@/lib/seo/page-metadata";
import "./globals.css";

// --- FONT CONFIGURATION ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    metadataBase: new URL("https://berkay-dev.vercel.app"),
    title: {
      default: t("site_title"),
      template: `%s | ${t("site_name")}`,
    },
    description: t("description"),
    keywords: ["Next.js", "AI Architecture", "n8n", "React", "Frontend", "Enterprise Web"],
    authors: [{ name: "Berkay Türkyılmaz" }],
    alternates: buildLanguageAlternates("/"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180" }],
    },
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
      url: "https://berkay-dev.vercel.app/",
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
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <body 
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          min-h-screen 
          bg-background 
          text-foreground 
          selection:bg-primary/20 
          selection:text-primary
        `}
      >
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}