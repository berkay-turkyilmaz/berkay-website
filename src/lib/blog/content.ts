export type BlogPostContent = {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: "architecture" | "ai" | "automation";
  hasAudio: boolean;
};

type Localized = { title: string; excerpt: string; content: string; readTime: string };

type PostSource = {
  date: string;
  category: BlogPostContent["category"];
  tr: Localized;
  en: Localized;
};

/**
 * First-person notes from building this site and its side projects.
 * Content is trusted HTML written here (not user input); it is rendered with the `.article` styles.
 */
const POSTS: Record<string, PostSource> = {
  "static-rendering-next-intl": {
    date: "2026-10-06",
    category: "architecture",
    tr: {
      title: "Tüm sayfalarım dinamik çıkıyordu: next-intl ile statik üretim",
      excerpt: "Build çıktısında her sayfanın dinamik görünmesinin nedeni ve setRequestLocale ile nasıl düzeldiği.",
      readTime: "5 dk",
      content: `
<p class="lead">Sitenin build çıktısına bakınca bir şey dikkatimi çekti: ana sayfa, blog, hakkımda, hepsi dinamik (ƒ) işaretliydi. İçerikleri değişmiyordu, yani her istekte boşuna sunucuda üretiliyorlardı.</p>

<h2>Neden dinamik oluyordu?</h2>
<p>next-intl, bir sayfanın hangi dilde render edileceğini anlamak için varsayılan olarak istek başlıklarını okur. Başlık okuyan bir sayfa Next.js için dinamiktir. Dil bilgisini sayfaya başka bir yoldan vermediğim sürece hiçbir sayfa statik olamıyordu.</p>

<h2>Çözüm iki parça</h2>
<p>Birincisi, hangi dillerin üretileceğini söylemek. İkincisi, her layout ve sayfada dili açıkça ayarlamak:</p>
<pre><code>// app/[locale]/layout.tsx
export function generateStaticParams() {
  return routing.locales.map((locale) =&gt; ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ...
}</code></pre>
<p>Sunucuda çeviri okuyan her sayfada da aynı <code>setRequestLocale(locale)</code> çağrısı gerekiyor. Layout'ta çağırmak tek başına yetmiyor, çünkü sayfalar ve layout'lar birbirinden bağımsız render olabilir.</p>

<h2>Sonuç</h2>
<p>Build çıktısı değişti: sayfalar yerine her dil için ayrı ayrı üretilmiş statik yollar listelenmeye başladı (toplam iki yüzün biraz üstünde sayfa). Sayfalar artık Vercel'in önbelleğinden hazır HTML olarak geliyor.</p>

<h2>Yolda bulduğum ikinci hata</h2>
<p>Next.js 16'da <code>middleware</code> dosyasının adı <code>proxy</code> oldu. Dosyayı taşırken eşleştirme kuralımı da gözden geçirdim ve eski kuralın aslında çalışmadığını gördüm: noktalı yolları dışlamak için yazdığım kaçış karakteri işlenirken kayboluyordu, kural da hiçbir yolu eşleştirmiyordu. Denemelerim sırasında yerelde önek almayan Türkçe alt sayfalar bir süre 404 verdi; eski kuralın amacıma hizmet etmediği kesindi. Yeni kural daha basit:</p>
<pre><code>matcher: [
  "/",
  "/(tr|en|de|es|fr|ar|ja)/:path*",
  "/((?!_next|_vercel|api|icon$|apple-icon$)[^.]*)",
]</code></pre>
<blockquote><p>Dersim: Build çıktısını okumak, performans testinden önce gelir. Tek bakışta çok şey söylüyor.</p></blockquote>
`,
    },
    en: {
      title: "All my pages were dynamic: static rendering with next-intl",
      excerpt: "Why every page showed up as dynamic in the build output, and how setRequestLocale fixed it.",
      readTime: "5 min",
      content: `
<p class="lead">Looking at this site's build output, something stood out: the home page, the blog, the about page, all of them were marked dynamic (ƒ). Their content never changes, so they were being rendered on the server for every request for no reason.</p>

<h2>Why were they dynamic?</h2>
<p>To know which language a page should render in, next-intl reads the request headers by default. A page that reads headers is dynamic as far as Next.js is concerned. Unless I handed the locale to the page some other way, no page could be static.</p>

<h2>The fix has two parts</h2>
<p>First, tell Next.js which locales to generate. Second, set the locale explicitly in every layout and page:</p>
<pre><code>// app/[locale]/layout.tsx
export function generateStaticParams() {
  return routing.locales.map((locale) =&gt; ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ...
}</code></pre>
<p>Every page that reads translations on the server needs the same <code>setRequestLocale(locale)</code> call. Calling it in the layout alone is not enough, because pages and layouts can render independently.</p>

<h2>The result</h2>
<p>The build output changed: instead of dynamic routes, it now lists statically generated paths for each locale (a little over two hundred pages in total). The pages are served from Vercel's cache as ready-made HTML.</p>

<h2>A second bug I found on the way</h2>
<p>In Next.js 16 the <code>middleware</code> file was renamed <code>proxy</code>. While moving it I reviewed my matcher and found the old rule never actually worked: the escape character I wrote to exclude dotted paths was lost during processing, so the rule matched nothing. While testing locally, Turkish pages (which have no locale prefix) returned 404 for a while; it was clear the old rule didn't serve my purpose. The new rule is simpler:</p>
<pre><code>matcher: [
  "/",
  "/(tr|en|de|es|fr|ar|ja)/:path*",
  "/((?!_next|_vercel|api|icon$|apple-icon$)[^.]*)",
]</code></pre>
<blockquote><p>My takeaway: reading the build output comes before performance testing. It tells you a lot at a glance.</p></blockquote>
`,
    },
  },

  "fewer-languages": {
    date: "2026-10-09",
    category: "architecture",
    tr: {
      title: "Yedi dil yerine iki dil: yarım çeviri bir özellik değil, borçtur",
      excerpt: "Sitenin yedi dili vardı ama beşi çoğunlukla İngilizce gösteriyordu. Neden ikiye indirdim?",
      readTime: "4 dk",
      content: `
<p class="lead">Sitem yedi dilde yayındaydı: Türkçe, İngilizce, Almanca, İspanyolca, Fransızca, Arapça ve Japonca. Kulağa etkileyici geliyor. Gerçek şu ki son beşinin çeviri dosyaları İngilizce dosyanın dörtte biri kadardı; geri kalanı İngilizce'ye düşüyordu.</p>

<h2>Ne vardı?</h2>
<p>Çeviri dosyalarının boyutuna bakmak yeterliydi: Türkçe ve İngilizce yaklaşık 65 KB, diğer beş dil yaklaşık 20 KB. Eksik anahtarlar İngilizce ile doldurulduğu için sayfalar açılıyordu, ama Almanca bir sayfanın büyük kısmı İngilizce'ydi.</p>

<h2>Neden sorun?</h2>
<ul>
<li><strong>Arama motoru için:</strong> Sitemap ve hreflang etiketleri yedi dili tam çeviri gibi ilan ediyordu. Aslında aynı İngilizce içeriğin yedi kopyasıydı.</li>
<li><strong>Ziyaretçi için:</strong> Almanca seçen biri yarı Almanca, yarı İngilizce bir site görüyordu. Bu, hiç çeviri olmamasından daha amatör görünüyor.</li>
<li><strong>Bana yük olarak:</strong> Her yeni metin için yedi dili hatırlamam gerekiyordu.</li>
</ul>

<h2>Ne yaptım?</h2>
<p>Dilleri silmedim, ama aramaya yalnızca iki dili açtım. Sitemap, hreflang ve canonical sadece Türkçe ve İngilizce için üretiliyor. Diğer diller çalışmaya devam ediyor ama <code>noindex</code> alıyor:</p>
<pre><code>export const INDEXED_LOCALES = ["tr", "en"] as const;

...(isIndexedLocale(locale)
  ? {}
  : { robots: { index: false, follow: true } })</code></pre>
<p>Bir dilin çevirisi tamamlandığında listeye eklemek yeterli olacak.</p>
<blockquote><p>Yarım çeviri bir özellik değil, borçtur. Ya bitir, ya da vaat etme.</p></blockquote>
`,
    },
    en: {
      title: "Two languages instead of seven: a half translation is debt, not a feature",
      excerpt: "My site had seven languages but five of them mostly showed English. Why I cut it down to two for search.",
      readTime: "4 min",
      content: `
<p class="lead">My site was live in seven languages: Turkish, English, German, Spanish, French, Arabic and Japanese. It sounds impressive. In truth the translation files for the last five were a quarter the size of the English one; the rest fell back to English.</p>

<h2>What was there?</h2>
<p>The file sizes told the story: Turkish and English were around 65 KB, the other five around 20 KB. Missing keys were filled from English, so pages opened fine, but most of a German page was English.</p>

<h2>Why is that a problem?</h2>
<ul>
<li><strong>For search engines:</strong> The sitemap and hreflang tags advertised seven languages as full translations. In reality they were seven copies of the same English content.</li>
<li><strong>For visitors:</strong> Someone picking German saw a half German, half English site. That looks more amateur than having no translation at all.</li>
<li><strong>For me:</strong> Every new piece of copy meant remembering seven languages.</li>
</ul>

<h2>What I did</h2>
<p>I didn't delete the languages, but I only opened two of them to search. The sitemap, hreflang and canonical are generated only for Turkish and English. The other locales keep working but get <code>noindex</code>:</p>
<pre><code>export const INDEXED_LOCALES = ["tr", "en"] as const;

...(isIndexedLocale(locale)
  ? {}
  : { robots: { index: false, follow: true } })</code></pre>
<p>When a language's translation is finished, adding it to the list is all it takes.</p>
<blockquote><p>A half translation is debt, not a feature. Either finish it or don't promise it.</p></blockquote>
`,
    },
  },

  "streaming-errors-ai-sdk": {
    date: "2026-10-12",
    category: "ai",
    tr: {
      title: "Sohbet kutusu boş kaldı: yapay zekâ akışında sessizce yutulan hatalar",
      excerpt: "Groq'tan gelen hata kullanıcıya hiç ulaşmıyordu; sohbette sadece boş bir balon kalıyordu.",
      readTime: "5 dk",
      content: `
<p class="lead">AI Lab'daki asistana mesaj yazdım, cevap boş geldi. Ağ isteği 200 dönüyordu, konsolda hata yoktu. Sunucu günlüğüne baktığımda asıl hata oradaydı: Groq, seçtiğim modele erişimimin olmadığını söylüyordu. Kullanıcı bunun hiçbirini görmüyordu.</p>

<h2>Neden görünmüyordu?</h2>
<p>Vercel AI SDK'nın <code>streamText</code> fonksiyonunda sağlayıcı hataları, metin akışı (<code>textStream</code>) üzerinden fırlatılmıyor. Akış sadece boş bitiyor ve hata ayrı bir yoldan, <code>onError</code> geri çağrısıyla bildiriliyor. Ben yalnızca akışı dinlediğim için hata benim için yoktu.</p>

<h2>Çözüm: hatayı bir kutuda topla</h2>
<p>Hatayı <code>onError</code> ile yakalayıp akışı yazan kodla paylaşıyorum. Akış hiç metin üretmeden biterse ve kutuda bir hata varsa, istemciye açık bir işaretçi gönderiyorum:</p>
<pre><code>const errorBox = { error: null as unknown };

const result = streamText({
  model,
  messages,
  onError: ({ error }) =&gt; {
    errorBox.error = error;
  },
});

// akış yazılırken:
if (!sentText &amp;&amp; errorBox.error) {
  controller.enqueue(encoder.encode("__ERR_EXTRACT__:Model kullanılamıyor"));
}</code></pre>
<p>İstemci bu işaretçiyi görünce baloncuğa gerçek bir hata mesajı yazıyor.</p>

<h2>Ham hatayı göstermedim</h2>
<p>İlk düşüncem sağlayıcının hata metnini olduğu gibi göstermekti. Vazgeçtim: bu metinler model adlarını, hesap bilgilerini ve iç ayrıntıları taşıyabiliyor. Kullanıcıya genel bir mesaj, ayrıntıyı sunucu günlüğüne bıraktım.</p>
<blockquote><p>Dersim: Akış tabanlı bir arayüzde "boş cevap" bir hata durumudur. Onu ayrıca tasarlamazsan kullanıcı için hiçbir şey söylemez.</p></blockquote>
`,
    },
    en: {
      title: "The chat bubble stayed empty: errors silently swallowed in AI streaming",
      excerpt: "The error from Groq never reached the user; the chat just showed an empty bubble.",
      readTime: "5 min",
      content: `
<p class="lead">I typed a message to the assistant in AI Lab and the reply came back empty. The network request returned 200 and the console had no errors. The real error was in the server log: Groq said I had no access to the model I'd picked. The user saw none of that.</p>

<h2>Why was it invisible?</h2>
<p>In the Vercel AI SDK's <code>streamText</code>, provider errors are not thrown through the text stream (<code>textStream</code>). The stream just ends empty and the error is reported separately through the <code>onError</code> callback. Since I only listened to the stream, the error didn't exist as far as my code was concerned.</p>

<h2>The fix: collect the error in a box</h2>
<p>I catch the error in <code>onError</code> and share it with the code that writes the stream. If the stream ends without producing any text and the box holds an error, I send the client an explicit marker:</p>
<pre><code>const errorBox = { error: null as unknown };

const result = streamText({
  model,
  messages,
  onError: ({ error }) =&gt; {
    errorBox.error = error;
  },
});

// while writing the stream:
if (!sentText &amp;&amp; errorBox.error) {
  controller.enqueue(encoder.encode("__ERR_EXTRACT__:Model unavailable"));
}</code></pre>
<p>When the client sees the marker, it writes a real error message into the bubble.</p>

<h2>I didn't show the raw error</h2>
<p>My first thought was to show the provider's error text as is. I dropped that: those messages can carry model names, account details and internals. The user gets a generic message and the details stay in the server log.</p>
<blockquote><p>My takeaway: in a streaming UI, an "empty answer" is an error state. If you don't design for it, it tells the user nothing.</p></blockquote>
`,
    },
  },

  "protecting-ai-endpoints": {
    date: "2026-10-15",
    category: "ai",
    tr: {
      title: "Herkese açık bir yapay zekâ uç noktasını nasıl korudum",
      excerpt: "Hız sınırı, girdi sınırı ve sunucuda duran anahtar: küçük bir sitede yapılabilecek makul önlemler.",
      readTime: "6 dk",
      content: `
<p class="lead">Sitemdeki asistan herkese açık ve her mesaj Groq'a giden bir istek demek. Giriş yok, hesap yok. Bu, birinin betikle istek yağdırıp kotamı tüketebileceği anlamına geliyordu. Bir inceleme sırasında bunu kendi kodumda fark ettim.</p>

<h2>Ne eksikti?</h2>
<ul>
<li>İstek sayısına sınır yoktu.</li>
<li>Mesaj boyutuna neredeyse sınır yoktu: mesaj başına yüz bin karakter, seksen mesaj.</li>
<li>PDF sohbetinin JSON dalı hiç doğrulanmıyordu.</li>
</ul>

<h2>Yaptıklarım</h2>
<h3>1. Hız sınırı</h3>
<p>Bellekte tutulan kayan pencere sınırlayıcısı, IP başına dakikada kaç istek yapılabileceğini belirliyor:</p>
<pre><code>const hits = (buckets.get(key) ?? []).filter(
  (t) =&gt; now - t &lt; windowMs
);
if (hits.length &gt;= limit) return false;
hits.push(now);</code></pre>
<p>Dürüst olmam gerekirse bunun sınırı var: sunucusuz ortamda her örnek kendi belleğine sahip, yani bu sınırlayıcı ilk savunma hattı. Kalıcı koruma için Redis gibi paylaşımlı bir depo gerekir.</p>

<h3>2. Girdi sınırları</h3>
<p>Mesaj başına on iki bin, konuşma başına kırk bin karakter ve en fazla kırk mesaj kabul ediyorum. Model çıktısına da üst sınır koydum. Zod şemaları fazlasını reddediyor.</p>

<h3>3. Anahtar yalnızca sunucuda</h3>
<p>Groq anahtarı hiçbir <code>NEXT_PUBLIC_</code> değişkeninde yok; istemci paketine girmesi mümkün değil.</p>

<h3>4. Sağlayıcı tarafında harcama sınırı</h3>
<p>Kod ne kadar iyi olursa olsun, son savunma hattı Groq panelindeki harcama limiti. Onu da ayarlamayı listeme yazdım.</p>
<blockquote><p>Küçük bir site için mükemmel koruma yok; amaç, kötüye kullanımı pahalı ve zahmetli hale getirmek.</p></blockquote>
`,
    },
    en: {
      title: "How I protected a public AI endpoint",
      excerpt: "Rate limits, input limits and a server-only key: reasonable measures for a small site.",
      readTime: "6 min",
      content: `
<p class="lead">The assistant on my site is public and every message is a request to Groq. There's no login and no account. That meant someone could hammer it with a script and burn through my quota. I noticed this in my own code during a review.</p>

<h2>What was missing?</h2>
<ul>
<li>No limit on the number of requests.</li>
<li>Almost no limit on message size: a hundred thousand characters per message, eighty messages.</li>
<li>The JSON branch of the PDF chat wasn't validated at all.</li>
</ul>

<h2>What I did</h2>
<h3>1. Rate limiting</h3>
<p>An in-memory sliding-window limiter decides how many requests an IP can make per minute:</p>
<pre><code>const hits = (buckets.get(key) ?? []).filter(
  (t) =&gt; now - t &lt; windowMs
);
if (hits.length &gt;= limit) return false;
hits.push(now);</code></pre>
<p>To be honest, it has limits: in a serverless environment every instance has its own memory, so this limiter is a first line of defence. Durable protection needs a shared store like Redis.</p>

<h3>2. Input limits</h3>
<p>I accept twelve thousand characters per message, forty thousand per conversation and at most forty messages. I also capped the model's output. Zod schemas reject anything beyond that.</p>

<h3>3. The key stays on the server</h3>
<p>The Groq key isn't in any <code>NEXT_PUBLIC_</code> variable, so it can't end up in the client bundle.</p>

<h3>4. A spending limit at the provider</h3>
<p>However good the code is, the last line of defence is the spending limit in the Groq dashboard. Setting that is on my list too.</p>
<blockquote><p>There is no perfect protection for a small site; the goal is to make abuse expensive and annoying.</p></blockquote>
`,
    },
  },

  "hide-n8n-webhooks": {
    date: "2026-10-18",
    category: "automation",
    tr: {
      title: "n8n webhook adresini tarayıcıdan saklamak",
      excerpt: "Formlar n8n'e doğrudan tarayıcıdan gidiyordu. Neden bir sunucu uç noktasının arkasına aldım?",
      readTime: "5 dk",
      content: `
<p class="lead">n8n ile yaptığım randevu ve iletişim akışlarının webhook adresi istemci kodunda duruyordu. Tarayıcı doğrudan oraya POST atıyordu. Çalışıyordu ama adres herkesin görebildiği bir yerdeydi.</p>

<h2>Sorun ne?</h2>
<p>Bir webhook adresi bir tür gizli anahtar gibidir: onu bilen herkes iş akışını tetikleyebilir. Adres sayfa kaynağında yazıyorsa, spam göndermek için sadece adresi kopyalamak yeterli. Üstelik adres bir sunucunun IP'sini de içeriyordu.</p>

<h2>Yeni akış</h2>
<p>Form artık kendi sitemdeki bir uç noktaya gidiyor. Uç nokta önce isteği doğrulayıp sonra n8n'e iletiyor:</p>
<pre><code>1. Tarayıcı  →  /api/contact
2. Sunucu: hız sınırı, zod doğrulaması, honeypot
3. Sunucu  →  n8n webhook (adres yalnızca sunucuda)
4. n8n başarısızsa istemciye 502 dön</code></pre>

<h3>Dikkat ettiğim ayrıntılar</h3>
<ul>
<li><strong>Honeypot:</strong> Formda insanların görmediği bir alan var. Doluysa bir bot olduğunu varsayıp sessizce "başarılı" dönüyorum; bot tekrar denemiyor.</li>
<li><strong>Zaman aşımı:</strong> n8n'e giden istek sekiz saniye sonra kesiliyor. Yoksa takılan bir webhook formu da kilitleyebilir.</li>
<li><strong>Dürüst hata:</strong> Eski sürüm mesajı sadece günlüğe yazıp kullanıcıya "gönderildi" diyordu. Yani iletişim formu aslında hiçbir şey göndermiyordu. Şimdi teslim edilemezse form hata gösteriyor.</li>
<li><strong>Adres ortam değişkeninde:</strong> Webhook adresleri <code>NEXT_PUBLIC_</code> olmayan değişkenlerde, yani tarayıcıya hiç gönderilmiyor.</li>
</ul>
<blockquote><p>En can sıkıcı hata, hiçbir şeyin ters gitmediğini söyleyen bir arayüzdü. Başarı mesajını sadece gerçek başarıdan sonra göstermek gerekiyor.</p></blockquote>
`,
    },
    en: {
      title: "Hiding the n8n webhook URL from the browser",
      excerpt: "The forms posted to n8n straight from the browser. Why I put a server endpoint in front of it.",
      readTime: "5 min",
      content: `
<p class="lead">The webhook address for my n8n booking and contact flows was sitting in client code. The browser posted straight to it. It worked, but the address was somewhere everyone could see.</p>

<h2>What's the problem?</h2>
<p>A webhook URL is a kind of secret key: anyone who knows it can trigger the workflow. If the address is in the page source, spamming it is as easy as copying it. It also contained a server's IP address.</p>

<h2>The new flow</h2>
<p>The form now goes to an endpoint on my own site. The endpoint validates the request first, then forwards it to n8n:</p>
<pre><code>1. Browser  →  /api/contact
2. Server: rate limit, zod validation, honeypot
3. Server  →  n8n webhook (address only on the server)
4. If n8n fails, return 502 to the client</code></pre>

<h3>Details I paid attention to</h3>
<ul>
<li><strong>Honeypot:</strong> The form has a field humans never see. If it's filled, I assume a bot and quietly return "success"; the bot doesn't retry.</li>
<li><strong>Timeout:</strong> The request to n8n is cut after eight seconds. Otherwise a hanging webhook could lock up the form too.</li>
<li><strong>Honest errors:</strong> The old version only wrote the message to a log and told the user "sent". So the contact form wasn't actually sending anything. Now if delivery fails, the form shows an error.</li>
<li><strong>Address in an environment variable:</strong> The webhook addresses live in non-<code>NEXT_PUBLIC_</code> variables, so they are never sent to the browser.</li>
</ul>
<blockquote><p>The most annoying bug was an interface telling me nothing was wrong. Show the success message only after real success.</p></blockquote>
`,
    },
  },

  "english-path-spaced-repetition": {
    date: "2026-10-20",
    category: "architecture",
    tr: {
      title: "İngilizce çalışma aracım: sunucusuz ilerleme ve aralıklı tekrar",
      excerpt: "EnglishPath'te hesap yok, veritabanı yok. İlerleme tarayıcıda, tekrar zamanları Leitner kutularıyla.",
      readTime: "6 dk",
      content: `
<p class="lead">İngilizce öğrenirken kendime bir çalışma aracı yaptım: kelime kartları, oyunlar ve sınav. Kural koydum: hesap olmayacak, sunucuda veri tutulmayacak. Her şey tarayıcıda kalıyor.</p>

<h2>İlerleme nerede duruyor?</h2>
<p>Tek bir nesne, tek bir <code>localStorage</code> anahtarı altında: puan, seri, bildiğin kelimeler, sınav sonuçları, her kartın tekrar durumu. Anahtarın içinde sürüm var (<code>englishpath-progress-v6</code>). Yapıyı her değiştirdiğimde eski sürümden okuyup yenisine çeviriyorum; kullanıcı hiçbir şey kaybetmiyor.</p>

<h2>Aralıklı tekrar</h2>
<p>Basit bir Leitner sistemi kullanıyorum. Her kart 1 ile 5 arasında bir kutuda duruyor. Doğru cevap bir üst kutuya taşıyor, yanlış cevap en başa döndürüyor. Kutuya göre bir sonraki tekrar günü hesaplanıyor:</p>
<pre><code>const SRS_INTERVAL_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };</code></pre>
<p>Yani bilmediğin kelime hemen geri geliyor, iyi bildiğin kelime iki haftadan fazla sonra. Oyunlar da bu sistemi besliyor: bir kelimeyi oyunda yanlış yapmak, onu tekrar kuyruğuna geri koyuyor.</p>

<h2>Kelime verisi</h2>
<p>Yaklaşık 680 kelimeyi A1'den C1'e seviyelendirdim, her birinde Türkçe karşılık, telaffuz ve örnek cümle var. Aynı kelime iki yerde geçerse, düşük seviyeli olan kazanıyor; birleştirme sırasında başlığa göre tekilleştiriyorum.</p>

<h3>Veriyi denetlemek</h3>
<p>Eski kart destelerini küçük bir betikle taradım ve gerçek hatalar buldum: Taboo'da dört, Charades'te altı yinelenen kart, Passaparola'da cevabı harfine uymayan bir soru. Elle yazılan verinin bakımı, kodun bakımından zor.</p>
<blockquote><p>Hesapsız bir araç tasarlamak, neyin gerçekten sunucuya ihtiyaç duyduğunu sorgulatıyor. Çoğu zaman cevap: hiçbir şeyin.</p></blockquote>
`,
    },
    en: {
      title: "My English study tool: serverless progress and spaced repetition",
      excerpt: "EnglishPath has no accounts and no database. Progress lives in the browser, review times in Leitner boxes.",
      readTime: "6 min",
      content: `
<p class="lead">While learning English I built myself a study tool: flashcards, games and an exam. I set a rule: no accounts, no data on a server. Everything stays in the browser.</p>

<h2>Where does progress live?</h2>
<p>One object under one <code>localStorage</code> key: points, streak, known words, exam results and each card's review state. The key carries a version (<code>englishpath-progress-v6</code>). Whenever I change the shape, I read from the old version and convert it, so users never lose anything.</p>

<h2>Spaced repetition</h2>
<p>I use a simple Leitner system. Each card sits in a box from 1 to 5. A correct answer moves it up a box, a wrong answer sends it back to the start. The next review day is computed from the box:</p>
<pre><code>const SRS_INTERVAL_DAYS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };</code></pre>
<p>So a word you don't know comes back immediately and a word you know well comes back after more than two weeks. The games feed this system too: getting a word wrong in a game puts it back in the review queue.</p>

<h2>The word data</h2>
<p>I levelled about 680 words from A1 to C1, each with a Turkish meaning, pronunciation and example sentence. If the same word appears twice, the lower level wins; I de-duplicate by headword while merging.</p>

<h3>Auditing the data</h3>
<p>I scanned the old card decks with a small script and found real mistakes: four duplicate cards in Taboo, six in Charades and a Passaparola question whose answer didn't match its letter. Hand-written data is harder to maintain than code.</p>
<blockquote><p>Designing a tool without accounts makes you question what really needs a server. Most of the time the answer is: nothing.</p></blockquote>
`,
    },
  },
};

export function getBlogPostContent(slug: string, locale: string): BlogPostContent | null {
  const source = POSTS[slug];
  if (!source) return null;
  const l = locale === "tr" ? source.tr : source.en;
  return {
    title: l.title,
    excerpt: l.excerpt,
    content: l.content.trim(),
    date: source.date,
    readTime: l.readTime,
    category: source.category,
    hasAudio: false,
  };
}
