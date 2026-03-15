import { Geist, Geist_Mono } from "next/font/google";
import { getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
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
    title: {
      default: "Berkay Türkyılmaz | Software Engineer & AI Architect",
      template: "%s | Berkay Türkyılmaz"
    },
    description: t("description"),
    keywords: ["Next.js", "AI Architecture", "n8n", "React", "Frontend", "Enterprise Web"],
    authors: [{ name: "Berkay Türkyılmaz" }],
    // 🎯 FAVICON VE APPLE IKON TANIMLAMALARI BURADA
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.svg", type: "image/svg+xml" } // SVG logo kullanırsan çok daha keskin durur
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180" }
      ]
    },
    openGraph: {
      type: "website",
      // Dile göre dinamik OpenGraph locale ayarı
      locale: locale === "tr" ? "tr_TR" : locale === "de" ? "de_DE" : "en_US",
      url: "https://berkay-dev.vercel.app/",
      siteName: "Berkay Türkyılmaz Workspace",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Berkay Türkyılmaz Portfolio Architecture",
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
    <html lang={locale} suppressHydrationWarning>
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