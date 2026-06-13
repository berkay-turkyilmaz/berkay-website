export type BexLanguage = "tr" | "en" | "de";

export function normalizeBexLanguage(
  language: "tr" | "en" | "de" | "auto"
): BexLanguage {
  if (language === "auto") return "tr";
  return language;
}
