# portfolio (berkay-website)

Kişisel web sitesi + yapay zekâ deneyleri. Next.js 16 (`dev` webpack ile), next-intl, Tailwind 4, Groq / Vercel AI SDK.
GitHub `berkay-turkyilmaz/berkay-website`, yayın Vercel.

## Nereye bak
- Sayfalar `src/app/[locale]`, API `src/app/api`
- Özellik modülleri `src/features/` (ai-lab, ayet, bk-reflect, bk-signs, english-practice, mucize)
- Bölümler `src/components/sections`, metinler `src/messages`
- AI çağrıları `src/lib/ai`, `src/lib/agents`

## Kurallar
- `n8n_data/` yerel n8n verisidir; okunmaz, değiştirilmez.
- Yeni metin iki dilde eklenir.
