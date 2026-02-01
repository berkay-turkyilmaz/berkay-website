import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css"; // CSS dosyanın [locale] klasörü içinde olduğunu varsayıyoruz
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// ✅ Font Tanımları
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const markerFont = Permanent_Marker({ 
  weight: '400',
  subsets: ['latin'],
  variable: "--font-marker",
});

// ✅ Metadata (Şimdilik sabit kalabilir, ileride bunu da çevirebiliriz)
export const metadata: Metadata = {
  title: {
    default: "Berkay | Full-stack Developer & AI Architect",
    template: "%s | Berkay Portfolio"
  },
  description: "Modern web teknolojileri, otonom sistemler ve yapay zeka çözümleri üreten yazılım geliştiricisi.",
  keywords: ["Next.js", "AI", "n8n", "React", "Developer", "Portfolio"],
  authors: [{ name: "Berkay" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://berkayturkyilmaz.com",
    siteName: "Berkay Portfolio",
    images: [
      {
        url: "/og-image.jpg", // public klasörüne havalı bir görsel atarsın
        width: 1200,
        height: 630,
        alt: "Berkay Portfolio",
      },
    ],
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Next.js 15+ için params promise olarak gelir, await ile çözeriz
  const { locale } = await params;
  
  // Dil mesajlarını sunucudan çekiyoruz
  const messages = await getMessages();

  return (
    // 🌍 Dil (lang) artık dinamik: tr veya en
    <html lang={locale} suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${markerFont.variable} antialiased`}
      >
        {/* 🌍 Çeviri Sağlayıcısı */}
        <NextIntlClientProvider messages={messages}>
          
          {/* 🎨 Tema Sağlayıcısı */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            
            {/* 🔔 Bildirimler */}
            <Toaster 
              position="top-right" 
              richColors 
              closeButton 
              duration={3000} 
            /> 
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}