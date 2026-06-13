import { Amiri } from "next/font/google";
import type { Metadata } from "next";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "BK · Yansıma",
  description: "Kişisel tefekkür stüdyosu",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function BkReflectLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${amiri.variable} min-h-dvh`}>{children}</div>;
}
