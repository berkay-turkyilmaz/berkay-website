import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground space-y-6">
      <h1 className="text-[10rem] font-black leading-none text-muted-foreground/20">404</h1>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Link href="/">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> {t("back")}
        </Button>
      </Link>
    </div>
  );
}
