import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-6">
      <h1 className="text-[10rem] font-black leading-none text-muted-foreground/20">404</h1>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Sayfa Kayboldu</h2>
        <p className="text-muted-foreground">Aradığın otonom sistem bu koordinatlarda bulunamadı.</p>
      </div>
      <Link href="/">
        <Button variant="outline" className="gap-2">
           <ArrowLeft className="w-4 h-4" /> Ana Üsse Dön
        </Button>
      </Link>
    </div>
  );
}