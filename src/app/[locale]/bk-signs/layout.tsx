import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BK · İşaretler",
  description: "Kişisel kozmik tefekkür sayfası",
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

export default function BkSignsLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}
