import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <SiteLogo className="justify-center" />
        <div className="space-y-3">
          <p className="text-[8rem] sm:text-[10rem] font-black leading-none text-muted-foreground/15 select-none">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground leading-relaxed">{t("description")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              {t("back")}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              {t("contact")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
