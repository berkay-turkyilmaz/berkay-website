# Site İncelemesi — berkay-website (20 Ekim 2026)

Kapsam: kod okuma + `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm audit --omit=dev`.
Kod değiştirilmedi. `n8n_data/`, `node_modules`, `.next` incelenmedi.

**Yapılmayanlar (dürüst not):** Lighthouse çalıştırılmadı, 390 px'te tarayıcıda görsel test yapılmadı, canlı site açılmadı. Performans ve mobil maddeleri kod okumasından çıkarımdır; "doğrulanmalı" ibareli olanlar ölçümle teyit edilmeli. Dosyaların tamamı okunmadı; `src/features/*` içindeki oyun bileşenlerine yalnızca lint çıktısı üzerinden bakıldı.

## Özet sonuçlar

| Kontrol | Sonuç |
|---|---|
| `tsc --noEmit` | Temiz (0 hata) |
| `next build` | Başarılı (102 sayfa), 1 uyarı: `middleware` → `proxy` |
| `eslint` | **41 sorun: 22 hata, 19 uyarı** |
| `npm audit --omit=dev` | 14 açık: 1 kritik (`next`), 6 yüksek |

---

## 1. Hatalar

### 1.1 İletişim formu mesajları hiçbir yere gitmiyor — **Kritik**
- **Dosya:** `src/app/api/contact/route.ts`, `src/app/[locale]/contact/page.tsx:94`
- **Sorun:** Form `/api/contact`'a gönderiyor; route yalnızca `console.log` yapıp `success: true` dönüyor ("replace with email service in production" yorumu duruyor). Ziyaretçi "gönderildi" görüyor, ama mesaj yalnızca Vercel loglarında kalıyor (o da süresi dolunca kaybolur). Potansiyel işveren/müşteri mesajı kaybediliyor.
- **Çözüm:** Resend/Postmark ile e-posta gönder ya da mevcut n8n webhook'una sunucu tarafında ilet. Başarısızsa 5xx dön. Honeypot alanı ekle.
- **Efor:** S

### 1.2 ESLint: 22 hata — **Yüksek**
- **Dosyalar:** ağırlıkla `src/features/english-practice/**` (`passaparola-game-tab.tsx`, `taboo-game-tab.tsx`, `use-english-progress.ts` vb.)
- **Sorun:** 14× `react-hooks/set-state-in-effect`, 4× `react-hooks/refs` (render sırasında `ref.current` yazılıyor, `taboo-game-tab.tsx:106-107`), 2× `react/no-unescaped-entities`, 1× `prefer-const`, 1× `preserve-manual-memoization`. Bazıları gerçek davranış riski: render sırasında ref yazmak React 19 concurrent modda tutarsız durum üretebilir; effect içinde `setState` fazladan render demek (`use-english-progress.ts:69` localStorage okuması için `useSyncExternalStore` ya da lazy initializer uygun).
- **Çözüm:** Hataları tek tek düzelt; CI/pre-commit'e `npm run lint` ekle ki birikmesin.
- **Efor:** M

### 1.3 19 lint uyarısı: kullanılmayan import/değişken — **Düşük**
- **Dosya:** örn. `taboo-game-tab.tsx:9` (`ChevronRight`), `passaparola-engine.ts:5` (`PassaparolaRoundStats`)
- **Çözüm:** `eslint --fix` + elle temizlik.
- **Efor:** S

### 1.4 `middleware.ts` Next 16'da kullanımdan kalkmış — **Orta**
- **Dosya:** `src/middleware.ts` (build uyarısı: "use proxy instead")
- **Sorun:** Gelecek sürümde kırılabilir. Ayrıca `from 'src/i18n/routing'` mutlak yol takma adı yerine `@/i18n/routing` olmalı.
- **Çözüm:** Dosyayı `src/proxy.ts` yap, export adını `proxy` olarak güncelle (next-intl dokümanına bak).
- **Efor:** S

### 1.5 `/ai-lab/context-viz`, `thought-chain` sayfaları — **Düşük (doğrulanmalı)**
- **Dosya:** `src/app/[locale]/ai-lab/(workspace)/context-viz`, `thought-chain`
- **Sorun:** Build'de rota olarak var, ama sitemap'te ve sidebar özetinde yer almıyor. Yarım kalmış ya da gizli mi belli değil.
- **Çözüm:** Ya menüye/sitemap'e ekle ya da kaldır.
- **Efor:** S

---

## 2. Performans

### 2.1 Tüm sayfalar dinamik (ƒ) render ediliyor — **Yüksek**
- **Dosya:** `src/app/[locale]/**` (build çıktısında statik `○` yalnızca robots/sitemap/icon)
- **Sorun:** Blog ve proje detay sayfalarında `generateStaticParams` var, ama build'de hepsi `ƒ`. `next-intl`'de sayfa/layout'larda `setRequestLocale(locale)` çağrılmadığı için `headers()` kullanılıp dinamik render'a düşüyor. Ana sayfa, blog, proje, hakkında gibi içerik sayfaları her istekte sunucuda üretiliyor → daha yavaş TTFB, gereksiz function maliyeti.
- **Çözüm:** `[locale]/layout.tsx` ve içerik sayfalarında `generateStaticParams` (locale) + `setRequestLocale(locale)`; sonra build çıktısında `●`/`○` doğrula.
- **Efor:** M

### 2.2 Her sayfa geçişinde tam ekran açılış perdesi — **Yüksek**
- **Dosya:** `src/app/[locale]/template.tsx`
- **Sorun:** `template` her navigasyonda yeniden çalışır; 0.15 s gecikme + 0.55 s perde animasyonu, içerik 0.35 s gecikmeyle geliyor. Her tıklamada ~0.9 s yapay bekleme; ilk açılışta LCP'yi geciktirir (içerik opacity 0'dan başlıyor), `framer-motion` tüm sayfalara client JS olarak yükleniyor.
- **Çözüm:** Perdeyi yalnızca ilk ziyarette (sessionStorage) göster veya kaldır; içerik animasyonunu kısalt/CSS'e al.
- **Efor:** S

### 2.3 Gereksiz client component'ler ve `framer-motion` yaygınlığı — **Orta**
- **Dosya:** 84 `"use client"` dosyası (184 ts/tsx içinde); `framer-motion` 49 dosyada. `hero-section.tsx` tamamen client; `reduceMotion` için elle `matchMedia` yazılmış, oysa `useReducedMotion()` var.
- **Çözüm:** Hero metnini server component yap, yalnızca animasyonlu kısmı küçük client adaya ayır; `LazyMotion` + `m` ile paket küçült.
- **Efor:** M

### 2.4 Kullanılmayan büyük paketler — **Orta**
- **Dosya:** `package.json`
- **Sorun:** `src/` içinde hiç import edilmeyenler: `chart.js`, `react-chartjs-2`, `motion` (framer-motion ile çift), `pdfjs-dist`, `unpdf`, `groq-sdk`. `pdfjs-dist` ve `unpdf` özellikle ağır. `d3` yalnızca 1 dosyada.
- **Çözüm:** `npm uninstall chart.js react-chartjs-2 motion pdfjs-dist unpdf groq-sdk`; `d3` yerine yalnızca gereken alt paketleri (`d3-*`) kullanmayı değerlendir. Bundle analizi için `@next/bundle-analyzer`.
- **Efor:** S

### 2.5 Blog içeriği tek dev `.ts` dosyasında, HTML string — **Orta**
- **Dosya:** `src/lib/blog/content.ts` (~450 satır, 8 yazı × 2 dil HTML string), `[slug]/page.tsx:177` `dangerouslySetInnerHTML`
- **Sorun:** Yazı eklemek zor, listeleme sayfası da tüm içerikleri import ediyor olabilir. İçerik kendi elinde olduğu için XSS riski düşük ama bakımı kötü.
- **Çözüm:** MDX ya da `content/blog/<slug>.<locale>.md` dosyaları + `gray-matter`; ilerde.
- **Efor:** M

### 2.6 Görsel yok → `next/image` kullanılmıyor — **Düşük**
- `public/` yalnızca 52 KB, ağır görsel yok; sorun yok. Create-next-app artığı SVG'ler (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) silinebilir. `bk-signs` video varlıkları (`video-layer.tsx` HEAD isteği) ayrıca ölçülmeli.
- **Efor:** S

---

## 3. SEO ve paylaşım

### 3.1 7 dil ilan ediliyor, 5'i neredeyse çevrilmemiş — **Yüksek**
- **Dosya:** `src/messages/{de,es,fr,ar,ja}.json` (~19–20 KB) vs `en.json` 65 KB, `tr.json` 65 KB; `src/i18n/request.ts` eksikleri İngilizceyle dolduruyor; `sitemap.ts` ve `buildLanguageAlternates` her sayfa için 7 dili hreflang olarak bildiriyor. Blog içeriği (`content.ts`) yalnızca tr/en ayrımı yapıyor (`isTr`).
- **Sorun:** de/es/fr/ar/ja sayfalarının büyük kısmı İngilizce içerik → arama motoru için yinelenen/ince içerik, kullanıcı için karışık dil. Kullanıcıya göre bu da "yeni metin iki dilde" kuralıyla çelişiyor olabilir.
- **Çözüm:** Kısa vadede routing'i `tr` + `en`'e indir (diğerleri 404 değil, 301 → `en`); veya tam çevirisi olmayan dilleri sitemap/hreflang'dan çıkar. Uzun vadede gerçekten çevir.
- **Efor:** M

### 3.2 Sitemap `lastModified` değerleri sabit ve eskimiş — **Orta**
- **Dosya:** `src/app/sitemap.ts` (`siteUpdated = 2026-06-11`; yalnızca 2 yazının tarihi tanımlı, 8 yazı var)
- **Çözüm:** Tarihleri blog meta'sından türet; gerçek değişiklik tarihini kullan (ya da alanı çıkar — yanlış tarih vermekten iyidir).
- **Efor:** S

### 3.3 Yapılandırılmış veri (JSON-LD) yok — **Orta**
- **Dosya:** `src/app/[locale]/layout.tsx`, `blog/[slug]/page.tsx`
- **Çözüm:** Ana sayfaya `Person`, blog yazılarına `Article`/`BlogPosting` JSON-LD ekle.
- **Efor:** S

### 3.4 `canonical` yok, alt sayfalarda layout alternates ezilmiyor — **Orta**
- **Dosya:** `layout.tsx:45` her sayfada `alternates: buildLanguageAlternates("/")` (kök için). Sayfalar `createPageMetadata` ile kendi alternates'ini veriyor; ama hiçbirinde `alternates.canonical` yok. `blog/[slug]/page.tsx` dışında bazı sayfalarda (`ai-lab`, `projects`) metadata'nın gerçekten verildiği doğrulanmalı.
- **Çözüm:** `createPageMetadata` içine `canonical: url` ekle; tüm `page.tsx`/`layout.tsx` dosyalarında kullanıldığını tara.
- **Efor:** S

### 3.5 Alan adı 5 yerde sabit — **Düşük**
- **Dosya:** `layout.tsx:34,66`, `page-metadata.ts:4`, `site-config.ts:8`, `data/projects.ts`, `data/resume.ts`, `bex-chat.ts`
- **Sorun:** `berkay-dev.vercel.app` kopyalanmış; özel alan adına geçince 7 yerde değişir. `site-config.ts` zaten var ama kullanılmıyor.
- **Çözüm:** Tek kaynak `siteConfig.baseUrl` + `NEXT_PUBLIC_SITE_URL`.
- **Efor:** S

### 3.6 OG görseli ve robots — **Düşük**
- OG görseli dinamik (`opengraph-image.tsx`) — iyi. `robots.ts` `sitemap:` satırını içermiyor; ekle. `/bk-reflect` ve `/bk-signs` robots'ta kapalı ama sayfalarda `noindex` meta'sı da olmalı (robots tek başına indekslemeyi engellemez).
- **Efor:** S

---

## 4. Erişilebilirlik ve mobil

> Tarayıcıda test edilmedi; aşağıdakiler koddan çıkarım.

### 4.1 Çok küçük metinler — **Orta**
- 102 yerde `text-[9px]`/`text-[10px]` gibi sabit küçük boyut (örn. `github-activity.tsx` başlığı `text-[10px]` + `text-muted-foreground/50`). Hem okunabilirlik hem WCAG kontrastı (opacity 50 ile düşer) sorunlu.
- **Çözüm:** Min. 12 px; `muted-foreground/50` yerine yeterli kontrastlı token (4.5:1). Lighthouse/axe ile ölçüm.
- **Efor:** M

### 4.2 `outline-none` kullanımı (35 yer) — **Orta**
- Klavye odak göstergesi kaybolabilir. `ui/input.tsx`, `textarea.tsx`, `subject-select.tsx` gibi form bileşenlerinde `focus-visible:ring` karşılığı var mı kontrol edilmeli.
- **Efor:** S

### 4.3 Sayfa geçiş perdesi ve hareket — **Düşük**
- `template.tsx` `useReducedMotion` ile doğru davranıyor (iyi); ama `hero-section.tsx` aynısını elle yazmış. Birleştir.

### 4.4 `lang`/`dir` ayarı doğru (`ar` için RTL) — iyi. RTL'de `ml-*/mr-*` ve `left-*` kullanımı mantıksal özelliklere (`ms-*`, `start-*`) çevrilmedi mi — Arapça sayfa taşma/ters kayma riski, doğrulanmalı.
- **Efor:** M

### 4.5 Booking sayfası 864 satır tek dosya — **Düşük**
- `ai-lab/booking/page.tsx`; mobil form ve takvim davranışı 390 px'te elle test edilmeli.

---

## 5. Güvenlik

### 5.1 Next.js sürümü kritik açıklı — **Kritik**
- **Dosya:** `package.json` → `next 16.1.3` (+ `eslint-config-next 16.1.3`)
- **Sorun:** `npm audit` bu sürüm için kritik seviye advisory veriyor; ayrıca `postcss` (doğrudan, yüksek), `sharp`, `form-data`, `nanoid`, `picomatch`, `source-map-js` yüksek.
- **Çözüm:** `next`'i son 16.x yamasına yükselt, `npm audit fix` çalıştır, build'i tekrar doğrula; Vercel'de yayına almadan önce preview'da dene.
- **Efor:** S

### 5.2 AI uç noktalarında rate limit / kota yok — **Kritik**
- **Dosya:** `src/app/api/chat/route.ts`, `api/pdf/route.ts`, `api/bk-reflect/route.ts`
- **Sorun:** Kimlik doğrulama ve hız sınırı yok. Herkes `/api/chat`'e istek atarak Groq kotanı/faturanı tüketebilir. `chat/schema.ts` mesaj başına 100 000 karakter × 80 mesaj kabul ediyor (≈ 8 MB prompt); `maxDuration` 60 sn. Yalnızca `/api/contact`'ta bellek içi limit var, o da serverless'ta örnekler arası paylaşılmadığı için zayıf.
- **Çözüm:** Upstash Redis `@upstash/ratelimit` (IP başına dakikada N + günde M); toplam karakter limiti (örn. 20–30k); `maxOutputTokens`; Groq panelinde harcama limiti; opsiyonel Turnstile.
- **Efor:** M

### 5.3 `/api/pdf` JSON dalı doğrulanmıyor — **Yüksek**
- **Dosya:** `src/app/api/pdf/route.ts` (JSON dalı, ~satır 250+)
- **Sorun:** `messages`, `chunks`, `temperature`, `fileName` zod ile doğrulanmıyor; `chunks` sınırsız dizi → bellek/CPU (skorlama `tokenize` her chunk için) ve prompt'a doğrudan `fileName` enjekte ediliyor. `temperature` herhangi bir sayı olabilir. 20 MB PDF'i regex ile `Buffer.toString("binary")` üzerinde tarıyor (ReDoS/CPU riski). `file.size` kontrolü var ama hata mesajı "max 10 MB" derken limit 20 MB (`error-messages.ts` ile uyumsuz).
- **Çözüm:** zod şeması ekle (chunks ≤ 200 × ≤ 2000 karakter, temperature 0–2, fileName ≤ 120), limiti 5–10 MB'a çek, metin çıkarmak için zaten bağımlılıkta olan `unpdf`'i kullan (2.4 ile birlikte çözülür).
- **Efor:** M

### 5.4 Hata mesajları istemciye sızıyor — **Orta**
- **Dosya:** `src/lib/ai/text-stream-response.ts` (`__ERR_EXTRACT__:${err.message}` ham sağlayıcı hatasını akışa yazıyor); `api/chat/route.ts` doğrulama hatasında `details: flatten()` döndürüyor.
- **Çözüm:** İstemciye genel kod/mesaj ver, ayrıntıyı yalnızca logla. API anahtarı istemciye sızmıyor (`GROQ_API_KEY` yalnızca sunucuda, `NEXT_PUBLIC_` değil) — **iyi**.
- **Efor:** S

### 5.5 n8n webhook adresleri istemci paketinde (IP içeriyor) — **Orta**
- **Dosya:** `src/lib/config/webhooks.ts`, `ai-lab/booking/page.tsx:452`
- **Sorun:** `n8n.138.197.186.170.sslip.io` gibi sunucu IP'si ve webhook yolları kaynak kodda ve tarayıcıdan çağrılıyor; herkes spam gönderebilir (rezervasyon "berber randevusu" demo'su gerçek bir n8n'e yazıyor, ayrıca telefon numarası topluyor). `NEXT_PUBLIC_*` env'ler de istemciye gömülür.
- **Çözüm:** Webhook'u sunucu route'u arkasına al (`/api/booking`), rate limit + doğrulama ekle, URL'yi `NEXT_PUBLIC_` olmayan env'e taşı; booking'in demo olduğunu kullanıcıya belirt, telefon verisi toplama/saklama bilgisini gizlilik sayfasına ekle.
- **Efor:** M

### 5.6 `docker-compose.yml` içinde sabit parola — **Orta**
- **Dosya:** `docker-compose.yml` (`N8N_BASIC_AUTH_PASSWORD=sifreniz123`, git'te izleniyor)
- **Çözüm:** `.env` değişkenine taşı; bu parola başka yerde kullanılıyorsa değiştir; `n8nio/n8n:latest` yerine sürüm sabitle.
- **Efor:** S

### 5.7 `analyze-context` ve genel uç noktalar — **Düşük**
- `api/analyze-context/route.ts` AI çağırmıyor (yerel analiz), ama 200k karakter sınırı + limitsiz istekle CPU yakılabilir; rate limit ekle. Hiçbir yerde güvenlik başlığı (CSP, X-Frame-Options, Referrer-Policy) tanımlı değil (`next.config.mjs`).
- **Efor:** S

### 5.8 `.env.example` git'e girmemiş — **Düşük**
- `.gitignore` içindeki `.env*` kuralı `.env.example`'ı da yutuyor; yeni makinede hangi değişkenlerin gerektiği belli olmuyor. `!.env.example` ekle.
- **Efor:** S

### 5.9 Dil seçimi `Accept-Language` ile `startsWith("tr")` — **Düşük**
- Üç route'ta kopya `getLang`; yalnızca ilk etiket kontrol ediliyor. Ortak yardımcıya taşı.

---

## 6. Kod düzeni

### 6.1 Tekrarlayan yardımcılar — **Düşük**
- `getLang(req)` 3 route'ta aynı (`chat`, `contact`, `pdf`); `locale → OG locale` eşlemesi hem `layout.tsx` (iç içe ternary) hem `page-metadata.ts`'te var; sidebar/oyun renk tema dosyaları benzer. Ortak modüle topla.
- **Efor:** S

### 6.2 `src/features/` tutarsız — **Orta**
- `english-practice` (tam: components/data/hooks/lib/types) ve `ai-lab` düzenli; `bk-reflect`, `bk-signs` küçük. Ama `booking` (864 satırlık sayfa), `blog`, `resume`, `contact` `features/` dışında `components/features/…` ya da doğrudan `app/` içinde. İki ayrı "features" kökü var: `src/features` ve `src/components/features`. `src/components/sections/projects-section.tsx` ile `components/features/home/projects-preview.tsx` benzer işi yapıyor olabilir.
- **Çözüm:** Tek kural: sayfaya özgü kod `src/features/<ad>`; `components/` yalnızca paylaşılan UI. `CLAUDE.md` listesi (`ayet`, `mucize`) ile gerçek klasörler uyuşmuyor (`ayet`/`mucize` yok; `bk-reflect`/`bk-signs` var) — güncelle.
- **Efor:** M

### 6.3 Dev veri dosyaları — **Düşük**
- `english-practice/data/*` ve `*-extended.ts` ikili yapı (taboo, flashcards, charades, heads-up, exam). Neden ayrıldığı belli değil; kart sayısı toplam ~2.4k satır, JSON'a çevirip lazy import edilebilir (oyun açılmadan paket şişmez).
- **Efor:** M

### 6.4 Eski rotalar ve artıklar — **Düşük**
- `ai-lab/youtube` ("Removed tool") ve `ai-lab/english-practice` yalnızca redirect: `next.config.mjs` `redirects()` içine taşınabilir. `postcss.config.js` ile `postcss.config.mjs` ikisi birden var (biri fazlalık). `README.md` hâlâ create-next-app şablonu. Birden çok dilde `src/messages` ama `CLAUDE.md` yalnızca iki dil diyor.
- **Efor:** S

### 6.5 Doğrudan tipli olmayan JSON gövdesi — **Düşük**
- `api/pdf` ve `analyze-context` zod/any karışımı; `chat`, `bk-reflect` doğru. Standardize et.

### 6.6 Test ve CI yok — **Orta**
- `package.json`'da test script'i yok; lint 22 hata ile yaşıyor. Minimum: GitHub Actions'ta `lint + tsc + build`; birkaç birim test (passaparola motoru, exam scoring, retrieveTopChunks).
- **Efor:** M

---

## 7. İçerik ve tasarım (işveren/müşteri gözüyle)

### 7.1 Uydurma blog "görüntülenme" sayıları — **Yüksek**
- **Dosya:** `src/lib/blog/content.ts` (`views: 1247, 892, 634 …`), `blog/[slug]/page.tsx` (`Eye` ikonu)
- **Sorun:** Sabit yazılmış sayılar gerçek istatistik gibi gösteriliyor. Fark edilirse güven kaybı yaratır.
- **Çözüm:** Kaldır ya da gerçek bir sayaçla (Vercel Analytics/Supabase) besle.
- **Efor:** S

### 7.2 Genel bakış: portföy sunumu — **Orta**
- Ana sayfa akışı (hero → şu an ne yapıyorum → GitHub aktivitesi → projeler → AI Lab → blog → iletişim) iyi bir iskelet. Zayıf noktalar:
  - Hero ve "Current focus" yeterince somut olmayabilir: "SaaS inşa ediyorum" yerine ne, kimin için, ölçülebilir sonuç.
  - Projelerin çoğunda canlı bağlantı yok, `github: null`; kod/demo kanıtı olmadan iddialar zayıf kalır. En az 2–3 projeye canlı demo + repo + kısa vaka çalışması (problem → çözüm → sonuç) ekle.
  - **Yeni mezun/junior** etkisi veren veya niş içerik (Passaparola, Taboo, bk-reflect/ayet yorumlama, bk-signs) ana portföy mesajını dağıtıyor; "AI Lab" altında kalması iyi, ama bk-reflect ve bk-signs'ın ne olduğu üst düzey ziyaretçiye açıklanmalı. Dini içerikli (ayet yorumlama) AI aracının işveren gözünde nasıl göründüğüne bilinçli karar ver.
  - Blog yazıları genel/jenerik konular ("Next.js portfolyo mimarisi", "Supabase mimarisi"); kişisel deneyim ve gerçek metrik içeren 2–3 yazı kıdemli profil gibi görünmeyi sağlar. Yazı içinde "yakında yerel yapay zeka motoruna geçeceğiz" gibi söz verilmiş ama olmayan özellik var (`content.ts`, Sesli Deneyim bölümü).
- **Efor:** M–L (içerik işi)

### 7.3 Berber randevu demosu portföyde — **Orta**
- `ai-lab/booking` bir müşteri projesi/demosu gibi duruyor, gerçek n8n'e yazıyor. Demo olduğu açık yazılmalı veya sahte bir uca bağlanmalı (bkz. 5.5).

### 7.4 İletişim sayfası ve mesaj güvencesi — **Orta**
- Sosyal bağlantılar var (GitHub, LinkedIn, e-posta) — iyi. Ama form çalışmıyor (1.1) ve yanıt süresi beklentisi belirtilmemiş.

### 7.5 Özgeçmiş — **Düşük**
- `resume` sayfası ve `resume-actions` mevcut; indirilebilir PDF'in güncel olduğu ve `public/` içinde durduğu doğrulanmalı (`public/` içinde PDF görünmüyor — buton neyi indiriyor kontrol et).

---

## İlk yapılacak 5 iş

1. **İletişim formunu gerçekten çalıştır (1.1)** — e-posta servisi ya da n8n webhook'u sunucu tarafında; en büyük iş kaybı riski. *(S)*
2. **`next` ve bağımlılıkları güncelle (5.1)** — kritik güvenlik açığı; `npm audit fix`, build doğrula, preview'da dene. *(S)*
3. **AI uç noktalarına rate limit + girdi limitleri koy ve `/api/pdf` JSON dalını doğrula (5.2, 5.3)** — Groq faturası/kötüye kullanım riskini kapat. *(M)*
4. **Sahte görüntülenme sayılarını kaldır ve çevirisiz dilleri sitemap/hreflang'dan çıkar veya çevir (7.1, 3.1)** — güvenilirlik ve SEO'yu birlikte düzeltir. *(S + M)*
5. **Render stratejisini düzelt: `setRequestLocale` + statik üretim, açılış perdesini kısalt, kullanılmayan paketleri sil (2.1, 2.2, 2.4)** — Lighthouse ve gerçek hız için en büyük kazanım; ardından lint hatalarını (1.2) temizle ve CI ekle. *(M)*

---

## Uygulama durumu (20 Ekim 2026)

Uygulandı: 1.1 (contact → sunucu tarafı n8n iletimi, honeypot, 502 hata), 1.2/1.3 (lint: 0 hata; kalan 17 `set-state-in-effect` uyarısı bilinçli, SSR-uyumlu localStorage/route senkronları), 1.4 (proxy.ts), 2.1 (statik üretim, `setRequestLocale`), 2.2 (tek seferlik CSS açılış perdesi), 2.4 (kullanılmayan paketler), 3.1 (yalnızca tr/en indekslenir, diğerleri noindex), 3.2–3.6 (sitemap tarihleri, JSON-LD, canonical, robots sitemap, tek baseUrl), 4.1 (11 px altı metin ve düşük kontrast), 5.1 (next 16.4.2, `npm audit --omit=dev`: 0 açık), 5.2–5.5 (rate limit, girdi sınırları, pdf zod, hata sızıntısı, booking/contact webhook sunucuda), 5.6–5.8 (docker parola, `.env.example`, güvenlik başlıkları), 7.1 (sahte görüntülenme sayıları kaldırıldı).

Yapılmadı / sonraki iş: blog içeriğinin MDX'e taşınması (2.5), `src/features` yeniden düzeni (6.2), test + CI (6.6), RTL mantıksal özellikler (4.4), içerik/vaka çalışması işleri (7.2), gerçek çeviriler (3.1 uzun vade). Rate limit bellek içidir; kalıcı koruma için Upstash Redis ve Groq harcama limiti önerilir.
