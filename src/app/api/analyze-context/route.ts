import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextRequest } from "next/server";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export const maxDuration = 30;

const SYSTEM_PROMPTS: Record<string, string> = {
  terminal: `Sen "ARIA" (Advanced Reasoning & Integration Assistant) adında üst düzey bir AI Mühendisi asistanısın. Berkay Türkyılmaz'ın portfolyo sitesinde çalışıyorsun.

Uzmanlık alanların:
- Next.js 15, React, TypeScript, Tailwind v4
- Supabase (Auth, PostgreSQL, pgvector, RLS)
- n8n workflow otomasyonu ve webhook entegrasyonları
- Groq, OpenAI, Anthropic API entegrasyonları
- RAG sistemleri ve vektör veritabanları
- Vercel deployment ve Edge Functions
- Docker, VPS yönetimi

Berkay hakkında: Frankfurt'ta n8n sunucusu (1GB+2GB VPS), Supabase ile auth/DB, AI destekli micro-SaaS ürünler, EnglishPath ve Universal Booking SaaS projeleri.

Kurallar: Türkçe/İngilizce kullanıcıya göre. Kod bloklarını dil belirterek yaz. Kısa ve net ol. Emin olmadığını söyle.`,

  pdf: `Sen gelişmiş bir Döküman Analiz motorusun. Belgeleri analiz eder, özetler ve bağlam koruyarak cevap verirsin. Her zaman belgeye dayalı cevap ver.`,

  engineer: `Sen bir Sistem Mühendisi ve DevOps uzmanısın. Mimari kararlar ve sistem entegrasyonları konusunda danışmanlık verirsin. Her zaman trade-off'ları açıkla.`,
};

export async function POST(req: NextRequest) {
  const { messages, mode = "terminal" } = await req.json();

  const systemPrompt =
    SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] ??
    SYSTEM_PROMPTS.terminal;

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}