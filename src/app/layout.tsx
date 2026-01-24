import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

// ✅ Font tanımları en üstte
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
  variable: "--font-marker", // 👈 CSS variable olarak kullanabilirsin
});

export const metadata: Metadata = {
  title: "Berkay Türkyılmaz - Full Stack Developer",
  description: "Modern web deneyimleri ve otomasyon çözümleri geliştiren full-stack developer",
  keywords: ["web development", "full-stack", "n8n", "automation", "react", "next.js"],
  authors: [{ name: "Berkay Türkyılmaz" }],
  openGraph: {
    title: "Berkay Türkyılmaz - Portfolio",
    description: "Full Stack Developer & Automation Specialist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${markerFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // 👈 Sistem temasını kullan (kullanıcı dostu)
          enableSystem
          disableTransitionOnChange // 👈 Tema değişirken flash önler
        >
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={3000} // 👈 3 saniye sonra otomatik kapansın
          /> 
        </ThemeProvider>
      </body>
    </html>
  );
}