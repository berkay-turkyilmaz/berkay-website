export type BlogPostContent = {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: "architecture" | "ai" | "automation";
  hasAudio: boolean;
  views?: number;
};

export function getBlogPostContent(slug: string, locale: string): BlogPostContent | null {
  const isTr = locale === "tr";

  const posts: Record<string, BlogPostContent> = {
    "nextjs-portfolio-guide": {
      title: isTr
        ? "Next.js 16 ve Modern Portfolyo Mimarisi"
        : "Next.js 16 & Modern Portfolio Architecture",
      excerpt: isTr
        ? "Tailwind v4, i18n ve Server Actions kullanarak global standartlarda bir yazılım portfolyosu nasıl hazırlanır?"
        : "How to build a global standard software portfolio using Tailwind v4, i18n, and Server Actions?",
      content: isTr
        ? `
          <p class="lead">Modern web geliştirme dünyasında, bir portfolyo sadece projelerinizi listelediğiniz bir yer değildir; aynı zamanda yazdığınız kodun kalitesini sergilediğiniz yaşayan bir üründür.</p>
          
          <h2>Neden Next.js 16?</h2>
          <p>React ekosisteminin amiral gemisi olan Next.js, App Router yapısı ile sunucu ve istemci bileşenlerini hibrit bir şekilde kullanmamıza olanak tanır. Bu, SEO performansını maksimize eder ve kullanıcı deneyimini optimize eder.</p>
          
          <h3>Sesli Deneyim</h3>
          <p>Bu makaleyi okumak yerine dinleyebilirsiniz. Şu an tarayıcı tabanlı bir motor kullanıyoruz, yakında yerel yapay zeka motoruna geçiş yapacağız. Bu sayede daha doğal ve akıcı bir ses deneyimi sunabileceğiz.</p>
          
          <h2>Mimari Kararlar</h2>
          <p>İyi bir mimari sadece koddan ibaret değildir; aynı zamanda sürdürülebilirlik ve ölçeklenebilirlik demektir. TypeScript ile tip güvenliği, modüler yapı ile bakım kolaylığı sağlarız.</p>
          
          <blockquote>
            <p>"Kod yazmak kolaydır, iyi kod yazmak ise sanattır."</p>
          </blockquote>
          
          <p>Modern web uygulamaları için performans, erişilebilirlik ve kullanıcı deneyimi üçgeninde dengeli bir yaklaşım gereklidir.</p>
        `
        : `
          <p class="lead">In the world of modern web development, a portfolio is not just a place to list your projects; it is a living product where you showcase the quality of your code.</p>
          
          <h2>Why Next.js 16?</h2>
          <p>As the flagship of the React ecosystem, Next.js allows us to use server and client components in a hybrid way with its App Router structure. This maximizes SEO performance and optimizes user experience.</p>
          
          <h3>Audio Experience</h3>
          <p>You can listen to this article instead of reading it. We are currently using a browser-based engine, but we will soon switch to a local AI engine for a more natural audio experience.</p>
          
          <h2>Architectural Decisions</h2>
          <p>Good architecture is not just about code; it's about sustainability and scalability. We ensure type safety with TypeScript and maintainability with modular structure.</p>
          
          <blockquote>
            <p>"Writing code is easy, writing good code is an art."</p>
          </blockquote>
        `,
      date: "2026-01-31",
      readTime: isTr ? "8 Dakika" : "8 Min",
      category: "architecture",
      hasAudio: true,
      views: 1247,
    },
    "ai-automation-guide": {
      title: isTr
        ? "Yapay Zeka Destekli Otomasyonlar"
        : "AI-Powered Workflow Automation",
      excerpt: isTr
        ? "n8n ve webhook entegrasyonları kullanarak manuel iş süreçlerini otonom sistemlere dönüştürme rehberi."
        : "A practical guide to turning manual workflows into autonomous systems with n8n and webhooks.",
      content: isTr
        ? `
          <p class="lead">İş süreçlerinin büyük kısmı hâlâ manuel veri girişi, e-posta takibi ve tekrarlayan onay adımlarından oluşur. n8n gibi görsel otomasyon araçları bu döngüyü kırmak için güçlü bir başlangıç noktası sunar.</p>

          <h2>n8n Neden?</h2>
          <p>n8n, self-hosted çalışabilen açık kaynaklı bir iş akışı motorudur. Webhook tetikleyicileri, HTTP istekleri ve LLM düğümleri ile uçtan uca otomasyon kurmak mümkündür.</p>

          <h2>Tipik Mimari</h2>
          <p>Form gönderimi → n8n webhook → veri doğrulama → veritabanı kaydı → Slack/e-posta bildirimi akışı, portföy ve SaaS projelerinde sık kullanılan bir kalıptır.</p>

          <h3>LLM Entegrasyonu</h3>
          <p>Groq veya benzeri hızlı inference sağlayıcıları, gelen metni sınıflandırmak, özetlemek veya yönlendirmek için workflow ortasına eklenebilir. Kritik nokta: ham model çıktısını doğrudan üretim aksiyonuna bağlamamak.</p>

          <blockquote>
            <p>"Otomasyon, insan yerine geçmez; tekrarlayan işi insanın önünden alır."</p>
          </blockquote>

          <p>Webhook URL'lerini ortam değişkenlerinde tutmak, timeout ve fallback stratejileri tanımlamak üretim sistemleri için vazgeçilmezdir.</p>
        `
        : `
          <p class="lead">Most business workflows still rely on manual data entry, email follow-ups, and repetitive approval steps. Visual automation tools like n8n offer a strong starting point to break that cycle.</p>

          <h2>Why n8n?</h2>
          <p>n8n is an open-source workflow engine that can run self-hosted. With webhook triggers, HTTP nodes, and LLM integrations, you can build end-to-end automation pipelines.</p>

          <h2>Typical Architecture</h2>
          <p>Form submission → n8n webhook → validation → database write → Slack/email notification is a common pattern in portfolio and SaaS projects.</p>

          <h3>LLM Integration</h3>
          <p>Fast inference providers such as Groq can classify, summarize, or route incoming text inside a workflow. The key is not wiring raw model output directly to production actions without guardrails.</p>

          <blockquote>
            <p>"Automation does not replace people; it removes repetitive work from their path."</p>
          </blockquote>

          <p>Keep webhook URLs in environment variables and define timeouts plus fallback strategies for production systems.</p>
        `,
      date: "2026-01-28",
      readTime: isTr ? "5 Dakika" : "5 Min",
      category: "ai",
      hasAudio: false,
      views: 892,
    },
    "n8n-workflow-automation": {
      title: isTr
        ? "n8n ile İş Akışı Otomasyonu: Sıfırdan Production'a"
        : "n8n Workflow Automation: From Zero to Production",
      excerpt: isTr
        ? "n8n'i self-host etmekten Google Workspace, Supabase ve webhook entegrasyonlarına kadar gerçek dünya otomasyon senaryoları."
        : "From self-hosting n8n to real-world automation scenarios with Google Workspace, Supabase, and webhook integrations.",
      content: isTr
        ? `
          <p class="lead">İş süreçlerindeki tekrar eden adımlar, mühendis zamanının en büyük düşmanıdır. n8n bu düşmana karşı görsel, self-hosted ve ücretsiz bir cephe kurar.</p>

          <h2>n8n Nedir?</h2>
          <p>n8n, 400'den fazla entegrasyona sahip açık kaynaklı bir workflow otomasyon motorudur. Zapier'e benzer ancak kod yazabilir, kendi sunucunuzda çalıştırabilir ve sınırsız workflow kurabilirsiniz.</p>

          <h2>Neden Self-Host?</h2>
          <p>Cloud versiyonun aksine self-hosted n8n, hassas verileri kendi altyapınızda işlemenizi sağlar. Docker ile kurulum 5 dakika sürer; Vercel ya da Railway üzerinde de çalışır.</p>

          <h2>İlk Workflow: Webhook → Supabase</h2>
          <p>En basit pattern şudur: bir HTTP webhook tetikleyicisi, gelen JSON'u validate edip Supabase tablosuna yazar. n8n'in Set ve IF node'ları ile koşullu iş mantığı eklemek sadece sürükle-bırak işidir.</p>

          <h3>Webhook Tetikleyiciler</h3>
          <p>n8n webhook node'u hem GET hem POST destekler. URL'i bir form, Stripe event'i veya başka bir servis için endpoint olarak kullanabilirsiniz. Test modunda gerçek zamanlı payload görebilirsiniz.</p>

          <h2>Hata Yönetimi</h2>
          <p>Her kritik node'a Error Trigger workflow bağlayın. Bir node başarısız olduğunda Slack veya e-posta bildirimi göndermek için 2 node yeterlidir. Retry on Fail seçeneğini de ihmal etmeyin.</p>

          <h2>Production Checklist</h2>
          <ul>
            <li>Webhook URL'leri environment variable'da tutun</li>
            <li>Timeout değerlerini manuel ayarlayın (varsayılan çok düşük olabilir)</li>
            <li>Credentials şifrelenmiş olarak saklanır; yedekleme planı yapın</li>
            <li>Monitoring için execution log retention süresini artırın</li>
          </ul>
        `
        : `
          <p class="lead">Repetitive steps in business processes are the biggest enemy of engineering time. n8n builds a visual, self-hosted, and free frontline against this enemy.</p>

          <h2>What is n8n?</h2>
          <p>n8n is an open-source workflow automation engine with over 400 integrations. Similar to Zapier but you can write code, run it on your own server, and create unlimited workflows.</p>

          <h2>Why Self-Host?</h2>
          <p>Unlike the cloud version, self-hosted n8n lets you process sensitive data on your own infrastructure. Setup with Docker takes 5 minutes; it also runs on Vercel or Railway.</p>

          <h2>First Workflow: Webhook → Supabase</h2>
          <p>The simplest pattern: an HTTP webhook trigger validates incoming JSON and writes it to a Supabase table. Adding conditional business logic with n8n's Set and IF nodes is pure drag-and-drop.</p>

          <h3>Webhook Triggers</h3>
          <p>n8n webhook nodes support both GET and POST. Use the URL as an endpoint for a form, Stripe event, or any other service. In test mode you can see real-time payloads.</p>

          <h2>Error Handling</h2>
          <p>Attach an Error Trigger workflow to every critical node. Sending a Slack or email notification when a node fails requires just 2 nodes. Don't overlook the Retry on Fail option either.</p>

          <h2>Production Checklist</h2>
          <ul>
            <li>Store webhook URLs in environment variables</li>
            <li>Set timeout values manually — defaults can be too low</li>
            <li>Credentials are stored encrypted; make a backup plan</li>
            <li>Increase execution log retention for monitoring</li>
          </ul>
        `,
      date: "2026-02-05",
      readTime: isTr ? "7 Dakika" : "7 Min",
      category: "automation",
      hasAudio: false,
      views: 634,
    },
    "supabase-fullstack-architecture": {
      title: isTr
        ? "Supabase ile Full-Stack Mimari: Auth, RLS ve Realtime"
        : "Full-Stack Architecture with Supabase: Auth, RLS & Realtime",
      excerpt: isTr
        ? "Supabase'i sadece bir database olarak değil, tam bir backend altyapısı olarak kullanmak. Row Level Security, Edge Functions ve Realtime subscription'lar."
        : "Using Supabase not just as a database but as a complete backend infrastructure. Row Level Security, Edge Functions, and Realtime subscriptions.",
      content: isTr
        ? `
          <p class="lead">Supabase, Firebase'in açık kaynaklı alternatifi olarak başladı; ancak PostgreSQL tabanlı yapısı ve SQL-first yaklaşımıyla çok daha güçlü bir backend altyapısına dönüştü.</p>

          <h2>Supabase vs Firebase</h2>
          <p>Firebase NoSQL kullanır ve sizi vendor lock-in'e iter. Supabase PostgreSQL üzerinde çalışır; tam SQL gücüne, join'lere ve ACID transaction'lara sahipsiniz. Üstelik self-host edilebilir.</p>

          <h2>Row Level Security Pattern'leri</h2>
          <p>RLS, güvenliği veritabanı katmanına taşır. Her tablo için policy yazarsınız: <code>auth.uid() = user_id</code> gibi basit ifadeler, her kullanıcının yalnızca kendi verilerine erişmesini garanti eder. Uygulama katmanında unutulan guard'lar artık sorun olmaz.</p>

          <h2>Auth + RBAC</h2>
          <p>Supabase Auth JWT token'larında custom claim ekler. Bunu RLS policy'leriyle birleştirerek rol tabanlı erişim kontrolü kurabilirsiniz: admin, editor, viewer rolleri sadece SQL policy'leriyle yönetilir.</p>

          <h3>Edge Functions Use Case'leri</h3>
          <p>Stripe webhook'u işlemek, harici API çağrısı yapmak veya hassas iş mantığını istemciden gizlemek için Edge Functions mükemmeldir. Deno tabanlıdır ve cold start neredeyse sıfırdır.</p>

          <h2>Realtime Subscription'lar</h2>
          <p>Postgres'in logical replication özelliği üzerine inşa edilmiş Realtime sistemi, tablo değişikliklerini WebSocket üzerinden anlık iletir. Chat uygulamaları, canlı dashboard'lar ve işbirliği araçları için idealdir.</p>

          <blockquote><p>"Bir backend yazmak için önce storage, auth ve realtime'ı çözmeniz gerekir. Supabase bunu kutudan çıkar çıkmaz verir."</p></blockquote>
        `
        : `
          <p class="lead">Supabase started as an open-source Firebase alternative; but its PostgreSQL-based structure and SQL-first approach transformed it into a far more powerful backend infrastructure.</p>

          <h2>Supabase vs Firebase</h2>
          <p>Firebase uses NoSQL and pushes you toward vendor lock-in. Supabase runs on PostgreSQL; you have full SQL power, joins, and ACID transactions. Plus it's self-hostable.</p>

          <h2>Row Level Security Patterns</h2>
          <p>RLS moves security to the database layer. You write policies per table: simple expressions like <code>auth.uid() = user_id</code> guarantee each user only accesses their own data. Forgotten guards in the application layer are no longer a problem.</p>

          <h2>Auth + RBAC</h2>
          <p>Supabase Auth adds custom claims to JWT tokens. Combine this with RLS policies to build role-based access control: admin, editor, viewer roles managed purely with SQL policies.</p>

          <h3>Edge Functions Use Cases</h3>
          <p>Edge Functions are perfect for processing Stripe webhooks, making external API calls, or hiding sensitive business logic from the client. They're Deno-based with near-zero cold start.</p>

          <h2>Realtime Subscriptions</h2>
          <p>Built on PostgreSQL's logical replication, the Realtime system delivers table changes instantly over WebSockets. Ideal for chat applications, live dashboards, and collaboration tools.</p>

          <blockquote><p>"To build a backend you first need to solve storage, auth, and realtime. Supabase delivers all three out of the box."</p></blockquote>
        `,
      date: "2026-02-10",
      readTime: isTr ? "9 Dakika" : "9 Min",
      category: "architecture",
      hasAudio: false,
      views: 781,
    },
    "typescript-type-safe-api": {
      title: isTr
        ? "TypeScript ile Type-Safe API Tasarımı"
        : "Type-Safe API Design with TypeScript",
      excerpt: isTr
        ? "Zod ile runtime validation, tRPC alternatifi olarak API route tip güvenliği ve ortak hata yönetimi pattern'leri."
        : "Runtime validation with Zod, API route type safety as a tRPC alternative, and shared error handling patterns.",
      content: isTr
        ? `
          <p class="lead">TypeScript derleme zamanında tip güvenliği sağlar; ancak API sınırında runtime'da da aynı garantiyi vermek istersiniz. Zod bu köprüyü kurar.</p>

          <h2>Neden Type-Safe API?</h2>
          <p>Frontend ve backend ayrı compile edilir. Backend'in döndürdüğü shape'i frontend <code>as</code> ile varsayarsa, runtime'da patlayan özellikler kaçınılmazdır. Paylaşılan tip tanımları ve runtime validation bu riski ortadan kaldırır.</p>

          <h2>Zod Schema Tasarımı</h2>
          <p>Her API input ve output için Zod schema yazın. Schema'dan TypeScript tipi türetin: <code>z.infer&lt;typeof schema&gt;</code>. Artık tek gerçek kaynağınız vardır; tipi ayrıca yazmaya gerek yoktur.</p>

          <h2>API Route Wrapper</h2>
          <p>Next.js route handler'larını bir <code>createApiHandler</code> wrapper'a alın. Wrapper input'u parse eder, hataları standardize eder ve <code>ApiResponse&lt;T&gt;</code> döner. Boilerplate sıfıra iner.</p>

          <h2>Hata Tipleri</h2>
          <p>Union discriminated type ile hata modeli kurun: <code>{ success: true; data: T } | { success: false; error: ApiError }</code>. Frontend her durumu exhaustive olarak handle edebilir.</p>

          <h2>Pratik Örnek</h2>
          <pre><code>const bodySchema = z.object({ email: z.string().email(), message: z.string().min(10) });
type Body = z.infer&lt;typeof bodySchema&gt;;</code></pre>
          <p>Tek satır değişiklikle validation ve tip türetimi birleşir. Zod'un <code>.safeParse()</code> metodu hata fırlatmaz; sonucu kontrol edip işleyin.</p>
        `
        : `
          <p class="lead">TypeScript provides type safety at compile time; but you also want the same guarantees at runtime on the API boundary. Zod builds that bridge.</p>

          <h2>Why Type-Safe API?</h2>
          <p>Frontend and backend compile separately. If the frontend assumes the shape returned by the backend via <code>as</code>, exploding properties at runtime are inevitable. Shared type definitions and runtime validation eliminate this risk.</p>

          <h2>Zod Schema Design</h2>
          <p>Write a Zod schema for every API input and output. Derive the TypeScript type from the schema: <code>z.infer&lt;typeof schema&gt;</code>. Now you have a single source of truth — no need to write the type separately.</p>

          <h2>API Route Wrapper</h2>
          <p>Wrap Next.js route handlers in a <code>createApiHandler</code>. The wrapper parses input, standardizes errors, and returns <code>ApiResponse&lt;T&gt;</code>. Boilerplate drops to zero.</p>

          <h2>Error Types</h2>
          <p>Build your error model with a discriminated union: <code>{ success: true; data: T } | { success: false; error: ApiError }</code>. The frontend can exhaustively handle every case.</p>

          <h2>Practical Example</h2>
          <pre><code>const bodySchema = z.object({ email: z.string().email(), message: z.string().min(10) });
type Body = z.infer&lt;typeof bodySchema&gt;;</code></pre>
          <p>A single line combines validation and type derivation. Zod's <code>.safeParse()</code> method doesn't throw; check the result and process it.</p>
        `,
      date: "2026-02-15",
      readTime: isTr ? "6 Dakika" : "6 Min",
      category: "architecture",
      hasAudio: false,
      views: 512,
    },
    "groq-streaming-llm-integration": {
      title: isTr
        ? "Groq API ile Streaming LLM Entegrasyonu"
        : "Streaming LLM Integration with Groq API",
      excerpt: isTr
        ? "Groq'un ultra-düşük latency API'si ile Next.js'de token-by-token streaming, abort controller ve kullanıcı deneyimi optimizasyonu."
        : "Token-by-token streaming in Next.js with Groq's ultra-low latency API, abort controller, and UX optimization.",
      content: isTr
        ? `
          <p class="lead">GPT-4 beklerken ekranın başında donup kalmak zorunda değilsiniz. Groq, Llama 3.1 modellerini saniyede 800+ token ile sunar. Bu hızı streaming'le birleştirince kullanıcı deneyimi dramatik biçimde değişir.</p>

          <h2>Groq Neden Hızlı?</h2>
          <p>Groq, NVIDIA GPU yerine kendi LPU (Language Processing Unit) donanımını kullanır. Matrix çarpımlarını farklı mimaride paralelize eder; sonuç: GPT-4'ün 20-50 katı token üretim hızı.</p>

          <h2>Streaming API Kurulumu</h2>
          <p>Next.js App Router'da <code>ReadableStream</code> ile streaming response döndürürsünüz. Groq SDK'nın <code>stream: true</code> seçeneği async iterator üretir; her chunk'ı response'a yazarsınız.</p>

          <h2>Server-Sent Events</h2>
          <p>İstemci tarafında <code>fetch</code> ile stream okuyan bir hook yazın. <code>response.body.getReader()</code>, gelen chunk'ları decode edip state'e ekler. React'ın batching'i sayesinde gereksiz render olmaz.</p>

          <h3>Abort Controller</h3>
          <p>Kullanıcı "Durdur" butonuna bastığında <code>AbortController.abort()</code> hem fetch'i hem de Groq stream'ini keser. Server tarafında da <code>signal</code>'i Groq çağrısına iletmek sunucu kaynağını korur.</p>

          <h2>UX Loading State'leri</h2>
          <p>Streaming sırasında cursor animasyonu, token sayacı ve "yazıyor..." göstergesi kullanıcıya sistem çalışıyor hissi verir. İlk token gelene kadar geçen süre (TTFT) kullanıcı algısının anahtarıdır.</p>
        `
        : `
          <p class="lead">You don't have to freeze at your screen waiting for GPT-4. Groq serves Llama 3.1 models at 800+ tokens per second. Combine that speed with streaming and user experience changes dramatically.</p>

          <h2>Why is Groq Fast?</h2>
          <p>Groq uses its own LPU (Language Processing Unit) hardware instead of NVIDIA GPUs. It parallelizes matrix multiplications in a different architecture; result: 20-50x the token generation speed of GPT-4.</p>

          <h2>Streaming API Setup</h2>
          <p>In Next.js App Router you return a streaming response using <code>ReadableStream</code>. Groq SDK's <code>stream: true</code> option produces an async iterator; you write each chunk to the response.</p>

          <h2>Server-Sent Events</h2>
          <p>Write a hook on the client side that reads the stream with <code>fetch</code>. <code>response.body.getReader()</code> decodes incoming chunks and appends them to state. React's batching prevents unnecessary re-renders.</p>

          <h3>Abort Controller</h3>
          <p>When the user presses "Stop", <code>AbortController.abort()</code> cancels both the fetch and the Groq stream. Passing the <code>signal</code> to the Groq call on the server side also protects server resources.</p>

          <h2>UX Loading States</h2>
          <p>A cursor animation, token counter, and "typing..." indicator during streaming give users the feeling the system is working. Time to First Token (TTFT) is the key to user perception.</p>
        `,
      date: "2026-02-20",
      readTime: isTr ? "8 Dakika" : "8 Min",
      category: "ai",
      hasAudio: false,
      views: 943,
    },
    "vercel-edge-runtime-guide": {
      title: isTr
        ? "Vercel Edge Runtime: Ne Zaman, Neden, Nasıl"
        : "Vercel Edge Runtime: When, Why, and How",
      excerpt: isTr
        ? "Edge Runtime vs Node.js Runtime seçimi, cold start problemleri, Edge Middleware kullanım senaryoları ve gerçek benchmark'lar."
        : "Choosing Edge Runtime vs Node.js Runtime, cold start problems, Edge Middleware use cases, and real benchmarks.",
      content: isTr
        ? `
          <p class="lead">Edge Runtime, kodunuzu kullanıcıya en yakın sunucuda çalıştırır. Ama her şeyi Edge'e taşımak hata olur — kısıtlamaları ve avantajları anlamak kritik.</p>

          <h2>Edge Runtime Kısıtlamaları</h2>
          <p>Edge Runtime, tam Node.js API'sini çalıştırmaz. <code>fs</code>, <code>child_process</code> ve native modüller kullanılamaz. Bundle boyutu 4 MB ile sınırlı. Bu kısıtlamalar, hangi kodu Edge'e alabileceğinizi belirler.</p>

          <h2>Ne Zaman Kullan?</h2>
          <p>Edge Runtime şu durumlar için idealdir: auth token doğrulama, A/B test yönlendirmesi, geo-based redirect, rate limiting ve basit JSON transform'ları. Veritabanı bağlantısı gerektiren ağır işlemler için Node.js runtime kullanın.</p>

          <h2>Middleware Mimarisi</h2>
          <p>Next.js Middleware her request'ten önce Edge'de çalışır. Auth cookie'sini burada doğrulayarak korunan sayfaları server'a ulaşmadan redirect edebilirsiniz. Performans artışı önemlidir.</p>

          <h2>Benchmark Karşılaştırması</h2>
          <p>Basit auth middleware için Edge ~5ms, Node.js ~50ms yanıt süresi verir. Ancak cold start Edge için de mevcuttur — sık çağrılmayan endpoint'lerde fark kapanır. Üretim trafiğinde ölçün, tahmin etmeyin.</p>
        `
        : `
          <p class="lead">Edge Runtime runs your code on the server closest to the user. But moving everything to Edge is a mistake — understanding its constraints and advantages is critical.</p>

          <h2>Edge Runtime Constraints</h2>
          <p>Edge Runtime doesn't run the full Node.js API. <code>fs</code>, <code>child_process</code>, and native modules are unavailable. Bundle size is limited to 4 MB. These constraints determine which code you can move to Edge.</p>

          <h2>When to Use It?</h2>
          <p>Edge Runtime is ideal for: auth token verification, A/B test routing, geo-based redirects, rate limiting, and simple JSON transforms. Use Node.js runtime for heavy operations requiring database connections.</p>

          <h2>Middleware Architecture</h2>
          <p>Next.js Middleware runs at Edge before every request. Validating auth cookies here lets you redirect protected pages before they reach the server. The performance gain is significant.</p>

          <h2>Benchmark Comparison</h2>
          <p>For simple auth middleware: Edge ~5ms, Node.js ~50ms response time. However cold starts exist for Edge too — the gap closes for infrequently called endpoints. Measure in production traffic, don't guess.</p>
        `,
      date: "2026-02-25",
      readTime: isTr ? "5 Dakika" : "5 Min",
      category: "architecture",
      hasAudio: false,
      views: 467,
    },
    "nextjs-i18n-nextintl-guide": {
      title: isTr
        ? "Next.js App Router'da i18n: next-intl ile Prodüksiyon Rehberi"
        : "i18n in Next.js App Router: Production Guide with next-intl",
      excerpt: isTr
        ? "next-intl ile App Router i18n kurulumu, statik sayfa üretimi, locale-aware SEO metadata ve çeviri workflow'u."
        : "Setting up App Router i18n with next-intl, static page generation, locale-aware SEO metadata, and translation workflow.",
      content: isTr
        ? `
          <p class="lead">Çok dilli bir Next.js uygulaması yazmak, doğru araç ve mimari kararlar olmadan hızla karmaşıklaşır. next-intl, App Router ile uyumlu ve TypeScript-first yaklaşımıyla bu karmaşıklığı yönetir.</p>

          <h2>Neden next-intl?</h2>
          <p>next-intl, App Router'ın async/await yapısıyla tam uyumludur. Server Component'lerde <code>getTranslations()</code>, Client Component'lerde <code>useTranslations()</code> hook'u ile çalışır. ICU mesaj formatını destekler.</p>

          <h2>Dosya Yapısı</h2>
          <p><code>src/messages/</code> klasörü altında her dil için JSON: <code>tr.json</code>, <code>en.json</code>, <code>de.json</code> vb. Namespace'ler ile büyük projelerde organize tutun: <code>Navigation</code>, <code>HomePage</code>, <code>BlogHub</code> gibi.</p>

          <h2>Middleware Kurulumu</h2>
          <p><code>createMiddleware(routing)</code> ile locale tespiti ve yönlendirme otomatik yapılır. <code>routing.ts</code> dosyasında dilleri ve varsayılan dili tanımlarsınız. <code>[locale]</code> route grubu tüm sayfalara locale prefix ekler.</p>

          <h2>generateStaticParams ile SSG</h2>
          <p>Her sayfa için <code>generateStaticParams</code> fonksiyonu, tüm locale kombinasyonlarını üretir. Blog slugları ve locale'leri çapraz çarparak statik sayfalar build zamanında oluşturulur — sıfır runtime overhead.</p>

          <h2>Metadata Lokalizasyonu</h2>
          <p><code>generateMetadata</code> async fonksiyonunda <code>getTranslations()</code> ile locale'e göre title ve description üretin. hreflang link'leri için <code>alternates.languages</code>'ı tüm locale'ler için doldurun.</p>

          <h2>Çeviri Yönetimi İpuçları</h2>
          <ul>
            <li>Türkçe'yi kaynak dil olarak kullanıyorsanız, en.json'ı da eksiksiz tutun</li>
            <li>Eksik key'ler için fallback locale tanımlayın (<code>request.ts</code>'de merge)</li>
            <li>TypeScript ile key autocomplete için <code>createNavigation</code> type helper'larını kullanın</li>
            <li>CI'da <code>next build</code> ile eksik çeviri key'lerini yakalayın</li>
          </ul>
        `
        : `
          <p class="lead">Building a multilingual Next.js app without the right tools and architectural decisions quickly becomes complex. next-intl manages this complexity with a TypeScript-first approach compatible with App Router.</p>

          <h2>Why next-intl?</h2>
          <p>next-intl is fully compatible with App Router's async/await structure. It works with <code>getTranslations()</code> in Server Components and <code>useTranslations()</code> hook in Client Components. It supports ICU message format.</p>

          <h2>File Structure</h2>
          <p>JSON for each language under <code>src/messages/</code>: <code>tr.json</code>, <code>en.json</code>, <code>de.json</code>, etc. Keep large projects organized with namespaces: <code>Navigation</code>, <code>HomePage</code>, <code>BlogHub</code>, etc.</p>

          <h2>Middleware Setup</h2>
          <p><code>createMiddleware(routing)</code> handles locale detection and routing automatically. Define languages and the default language in <code>routing.ts</code>. The <code>[locale]</code> route group adds a locale prefix to all pages.</p>

          <h2>SSG with generateStaticParams</h2>
          <p>The <code>generateStaticParams</code> function for each page produces all locale combinations. Cross-multiplying blog slugs and locales builds static pages at build time — zero runtime overhead.</p>

          <h2>Metadata Localization</h2>
          <p>In the <code>generateMetadata</code> async function, use <code>getTranslations()</code> to generate locale-aware title and description. Fill <code>alternates.languages</code> for all locales for hreflang links.</p>

          <h2>Translation Management Tips</h2>
          <ul>
            <li>If Turkish is your source language, keep en.json complete too</li>
            <li>Define a fallback locale for missing keys (merge in <code>request.ts</code>)</li>
            <li>Use <code>createNavigation</code> type helpers for key autocomplete with TypeScript</li>
            <li>Catch missing translation keys with <code>next build</code> in CI</li>
          </ul>
        `,
      date: "2026-03-01",
      readTime: isTr ? "10 Dakika" : "10 Min",
      category: "architecture",
      hasAudio: false,
      views: 1089,
    },
  };

  return posts[slug] ?? null;
}
