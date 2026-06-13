import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İşaretler",
  description: "Kişisel tefekkür",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function MucizeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
