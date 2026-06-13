import { redirect } from "@/i18n/routing";

import { getLocale } from "next-intl/server";



/** Legacy route — merged into main BEX assistant. */

export default async function AiLabThoughtChainPage() {

  const locale = await getLocale();

  redirect({

    href: "/ai-lab",

    locale,

  });

}

