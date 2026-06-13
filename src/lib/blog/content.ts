export type BlogPostContent = {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  hasAudio: boolean;
  views?: number;
};

export function getBlogPostContent(slug: string, locale: string): BlogPostContent | null {
  const isTr = locale === "tr";

  const posts: Record<string, BlogPostContent> = {
    "nextjs-portfolio-guide": {
      title: isTr
        ? "Next.js 15 ve Modern Portfolyo Mimarisi"
        : "Next.js 15 & Modern Portfolio Architecture",
      excerpt: isTr
        ? "Tailwind v4, i18n ve Server Actions kullanarak global standartlarda bir yazılım portfolyosu nasıl hazırlanır?"
        : "How to build a global standard software portfolio using Tailwind v4, i18n, and Server Actions?",
      content: isTr
        ? `
          <p class="lead">Modern web geliştirme dünyasında, bir portfolyo sadece projelerinizi listelediğiniz bir yer değildir; aynı zamanda yazdığınız kodun kalitesini sergilediğiniz yaşayan bir üründür.</p>
          
          <h2>Neden Next.js 15?</h2>
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
          
          <h2>Why Next.js 15?</h2>
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
      category: isTr ? "Yazılım Mimarisi" : "Architecture",
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
      category: isTr ? "Yapay Zeka" : "AI",
      hasAudio: false,
      views: 892,
    },
  };

  return posts[slug] ?? null;
}
