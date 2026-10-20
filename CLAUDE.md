# portfolio (berkay-website)

Kişisel web sitesi + yapay zekâ deneyleri. Next.js 16 (`dev` webpack ile), next-intl, Tailwind 4, Groq / Vercel AI SDK.
GitHub `berkay-turkyilmaz/berkay-website`, yayın Vercel.

## Nereye bak
- Sayfalar `src/app/[locale]`, API `src/app/api`
- Özellik modülleri `src/features/` (ai-lab, bk-reflect, bk-signs, english-practice)
- Bölümler `src/components/sections`, metinler `src/messages`
- AI çağrıları `src/lib/ai`, `src/lib/agents`

## Kurallar
- `n8n_data/` yerel n8n verisidir; okunmaz, değiştirilmez.
- Yeni metin iki dilde eklenir.
- API route'larında önce `src/lib/api/rate-limit.ts` ile hız sınırı, girdiler zod ile doğrulanır; n8n webhook adresleri yalnızca sunucuda (`src/lib/config/webhooks.ts`).
- SEO için dizine yalnızca `tr` ve `en` açılır (`INDEXED_LOCALES`); diğer diller `noindex`.
- Sayfalarda `setRequestLocale(locale)` çağrılır (statik üretim için).
