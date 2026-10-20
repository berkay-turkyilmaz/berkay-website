// ─── Types ────────────────────────────────────────────────────────────────────

export type ChunkRole =
  | "subject"
  | "predicate"
  | "context"
  | "evidence"
  | "connector"
  | "conclusion";

export type Chunk = {
  id: number;
  text: string;
  role: ChunkRole;
  weight: number;
  pos_dominant: string;
  reasoning: string;
  related: number[];
  token_count: number;
  redundancy: number;
};

export type AnalysisResult = {
  chunks: Chunk[];
  totalTokens: number;
  contextWindowSize: number;
  redundantChunks: number[];
  compressionPotential: number;
};

export type ViewMode = "heatmap" | "graph" | "split";

// ─── Constants ────────────────────────────────────────────────────────────────

export const ROLE_COLORS: Record<ChunkRole, string> = {
  subject: "#60a5fa",
  predicate: "#34d399",
  context: "#a78bfa",
  evidence: "#fbbf24",
  connector: "#94a3b8",
  conclusion: "#f472b6",
};

export const SAMPLE_TEXT_BODIES = {
  tr: {
    technical:
      "React, Facebook tarafından geliştirilen açık kaynaklı bir JavaScript kütüphanesidir. Kullanıcı arayüzleri oluşturmak için component tabanlı bir mimari kullanır. Virtual DOM sayesinde gerçek DOM manipülasyonunu minimize eder. Bu yaklaşım, büyük ölçekli uygulamalarda performans avantajı sağlar. State yönetimi için useState ve useReducer hook'ları kullanılabilir. Ayrıca useEffect ile side effect'ler yönetilebilir.",
    academic:
      "Yapay zeka, insan zekasını taklit eden bilgisayar sistemleri geliştirme bilimidir. Makine öğrenmesi, bu alanın en önemli alt dallarından birini oluşturmaktadır. Derin öğrenme algoritmaları, büyük veri setleri üzerinde örüntü tanıma konusunda üstün başarı sergilemiştir. Doğal dil işleme teknolojileri ise insan-bilgisayar etkileşimini köklü biçimde dönüştürmektedir.",
    blog: "Next.js ile modern web uygulamaları geliştirmek hiç bu kadar kolay olmamıştı. App Router ile birlikte server components devreye girdi. Bu değişiklik, hem performansı hem de geliştirici deneyimini iyileştirdi. Streaming ve Suspense desteği ile kullanıcılar içeriği daha hızlı görüyor. Vercel deployment entegrasyonu da işleri son derece basitleştiriyor.",
  },
  en: {
    technical:
      "React is an open-source JavaScript library developed by Facebook. It uses a component-based architecture to build user interfaces. The Virtual DOM minimizes direct DOM manipulation. This approach delivers performance benefits in large-scale applications. useState and useReducer hooks can manage state, and useEffect handles side effects.",
    academic:
      "Artificial intelligence is the science of building computer systems that mimic human intelligence. Machine learning is one of its most important subfields. Deep learning algorithms have excelled at pattern recognition on large datasets. Natural language processing is fundamentally transforming human-computer interaction.",
    blog: "Building modern web apps with Next.js has never been easier. The App Router introduced server components. This change improved both performance and developer experience. Streaming and Suspense let users see content faster. Vercel deployment integration simplifies operations even further.",
  },
} as const;

// ─── Weight → Color helper ────────────────────────────────────────────────────

export function weightToColor(weight: number, opacity = 1): string {
  if (weight > 0.75) return `rgba(239,68,68,${opacity})`;
  if (weight > 0.5) return `rgba(249,115,22,${opacity})`;
  if (weight > 0.25) return `rgba(234,179,8,${opacity})`;
  return `rgba(100,116,139,${opacity})`;
}
