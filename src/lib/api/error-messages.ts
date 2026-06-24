/**
 * Locale-aware API error messages.
 * Usage: getApiError(locale, "invalid_json")
 */

const MESSAGES: Record<string, Record<string, string>> = {
  tr: {
    invalid_json: "Geçersiz JSON gövdesi",
    invalid_request: "Geçersiz istek parametreleri",
    model_unavailable: "AI modeli şu anda kullanılamıyor",
    api_error: "Servis geçici olarak kullanılamıyor, lütfen tekrar deneyin",
    unauthorized: "Yetkisiz erişim",
    rate_limited: "Çok fazla istek gönderildi, lütfen bekleyin",
    file_too_large: "Dosya çok büyük (max 10 MB)",
    unsupported_type: "Desteklenmeyen dosya türü",
    internal: "Sunucu hatası oluştu",
  },
  en: {
    invalid_json: "Invalid JSON body",
    invalid_request: "Invalid request parameters",
    model_unavailable: "AI model is currently unavailable",
    api_error: "Service temporarily unavailable, please try again",
    unauthorized: "Unauthorized access",
    rate_limited: "Too many requests, please wait",
    file_too_large: "File too large (max 10 MB)",
    unsupported_type: "Unsupported file type",
    internal: "An internal server error occurred",
  },
};

type ErrorKey = keyof (typeof MESSAGES)["en"];

export function getApiError(locale: string, key: ErrorKey): string {
  const lang = locale in MESSAGES ? locale : "en";
  return MESSAGES[lang][key] ?? MESSAGES["en"][key] ?? key;
}
