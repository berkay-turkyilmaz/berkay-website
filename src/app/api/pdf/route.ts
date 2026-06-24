import { streamText } from "ai";
import { NextRequest } from "next/server";
import { getApiError } from "@/lib/api/error-messages";
import * as zlib from "zlib";
import { promisify } from "util";
import { GROQ_CHAT_MODEL_IDS } from "@/lib/ai/groq-models";
import { normalizeBexLanguage } from "@/lib/ai/bex-language";
import { createPlainTextStreamResponse } from "@/lib/ai/text-stream-response";
import { resolveLanguageModel } from "@/lib/ai/provider-registry";

const inflate = promisify(zlib.inflate);
const inflateRaw = promisify(zlib.inflateRaw);

export const maxDuration = 60;

type ResponseLength = "short" | "medium" | "detailed";
type Language = "tr" | "en" | "de";

// ─── Native PDF text extractor with zlib decompression ───────────────────────

function decodePdfString(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

function extractTextFromBlock(block: string): string[] {
  const texts: string[] = [];

  // Tj: (text)Tj
  const tjRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*Tj/g;
  let m;
  while ((m = tjRe.exec(block)) !== null) {
    const t = decodePdfString(m[1]).trim();
    if (t) texts.push(t);
  }

  // TJ: [(text)num(text)]TJ
  const tjArrRe = /\[([^\]]*)\]\s*TJ/g;
  while ((m = tjArrRe.exec(block)) !== null) {
    const inner = m[1];
    const strRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
    let s;
    while ((s = strRe.exec(inner)) !== null) {
      const t = decodePdfString(s[1]).trim();
      if (t) texts.push(t);
    }
  }

  // ' operator: (text)'
  const apostRe = /\(([^)\\]*(?:\\.[^)\\]*)*)\)'/g;
  while ((m = apostRe.exec(block)) !== null) {
    const t = decodePdfString(m[1]).trim();
    if (t) texts.push(t);
  }

  return texts;
}

async function extractTextFromPdfBuffer(data: Buffer): Promise<string> {
  const str = data.toString("binary");
  const allTexts: string[] = [];

  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;

  while ((match = streamRegex.exec(str)) !== null) {
    const rawStream = Buffer.from(match[1], "binary");
    let content = "";

    // Try zlib inflate (most common: FlateDecode)
    try {
      content = (await inflate(rawStream)).toString("latin1");
    } catch {
      try {
        content = (await inflateRaw(rawStream)).toString("latin1");
      } catch {
        // Not compressed — use raw
        content = match[1];
      }
    }

    // Extract from BT...ET blocks
    const btEtRe = /BT([\s\S]*?)ET/g;
    let bt;
    while ((bt = btEtRe.exec(content)) !== null) {
      const lineTexts = extractTextFromBlock(bt[1]);
      if (lineTexts.length > 0) {
        allTexts.push(lineTexts.join(" "));
      }
    }
  }

  if (allTexts.length === 0) return "";

  return allTexts
    .join("\n")
    .replace(/[ \t]{3,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00C0-\u017F]/g, " ")
    .trim();
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;
const TOP_K = 6;

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 50) chunks.push(chunk);
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

// ─── Keyword retrieval ────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "bir", "bu", "ve", "de", "da", "ile", "için", "olan", "gibi", "daha",
  "çok", "her", "ben", "sen", "biz", "siz", "var",
  "the", "and", "for", "that", "this", "with", "are", "was", "were",
  "have", "has", "had", "not", "but", "from", "they", "been", "its",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\wçğıöşüÇĞİÖŞÜ\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreChunk(chunk: string, keywords: string[]): number {
  if (!keywords.length) return 0;
  const tokens = tokenize(chunk);
  const tokenSet = new Set(tokens);
  let score = 0;
  for (const kw of keywords) {
    if (tokenSet.has(kw)) score += 3;
    else if (tokens.some(t => t.startsWith(kw) || kw.startsWith(t))) score += 1;
  }
  return score + (score / (tokens.length + 1)) * 5;
}

function retrieveTopChunks(chunks: string[], query: string): string[] {
  const keywords = tokenize(query);

  if (!keywords.length) {
    const head = chunks.slice(0, 3);
    const tail = chunks.slice(-3);
    return [...new Set([...head, ...tail])].slice(0, TOP_K);
  }

  const topScored = chunks
    .map((chunk, i) => ({ index: i, score: scoreChunk(chunk, keywords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K - 2)
    .sort((a, b) => a.index - b.index);

  // Always include last 2 chunks (references, conclusion)
  const lastTwo = [chunks.length - 2, chunks.length - 1]
    .filter(i => i >= 0)
    .filter(i => !topScored.find(s => s.index === i));

  return [...topScored.map(s => s.index), ...lastTwo]
    .sort((a, b) => a - b)
    .map(i => chunks[i]);
}

// ─── System prompt ────────────────────────────────────────────────────────────

const LENGTH_INSTRUCTIONS: Record<ResponseLength, string> = {
  short: "YANIT UZUNLUĞU: Kısa ve öz. Maksimum 3-5 cümle.",
  medium: "YANIT UZUNLUĞU: Dengeli. Konuyu açıkla ama özlü kal.",
  detailed: "YANIT UZUNLUĞU: Kapsamlı. Tüm detayları ele al.",
};

function getRealDateTime() {
  return new Intl.DateTimeFormat("tr-TR", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(new Date());
}

function buildSystemPrompt(
  relevantChunks: string[],
  totalChunks: number,
  fileName: string,
  responseLength: ResponseLength,
  language: Language
): string {
  const langInstr =
    language === "en"
      ? "LANGUAGE: Respond in English."
      : language === "de"
        ? "SPRACHE: Antworte auf Deutsch."
        : "DİL: Türkçe yanıt ver.";
  const docContext = relevantChunks.map((c, i) => `[Bölüm ${i + 1}]\n${c}`).join("\n\n---\n\n");

  return `Sen BEX'in Döküman Analiz modusundasın.

## DÖKÜMAN: ${fileName}
Toplam ${totalChunks} bölümden ${relevantChunks.length} ilgili bölüm gösteriliyor.

## İÇERİK
${docContext}

## KURALLAR
- Sadece bu bölümlerdeki bilgilere dayan
- Cevap bu bölümlerde yoksa: "Bu bilgi mevcut bölümlerde yer almıyor" de

## ÖZET FORMATI (istenirse)
1. **Genel Bakış**
2. **Ana Konular**
3. **Önemli Veri/Tarih/İsimler**
4. **Sonuç/Öneriler**

${langInstr}
${LENGTH_INSTRUCTIONS[responseLength] ?? LENGTH_INSTRUCTIONS.medium}
Tarih: ${getRealDateTime()}
Giriş cümlesi yazma.`.trim();
}

// ─── Route ────────────────────────────────────────────────────────────────────

function getPdfLang(req: NextRequest): string {
  const accept = req.headers.get("accept-language") ?? "";
  return accept.startsWith("tr") ? "tr" : "en";
}

export async function POST(req: NextRequest) {
  const lang = getPdfLang(req);
  try {
    const contentType = req.headers.get("content-type") ?? "";

    // ── Upload: extract + chunk ──────────────────────────────────────────────
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) return Response.json({ error: getApiError(lang, "invalid_request") }, { status: 400 });
      if (file.size > 20 * 1024 * 1024) return Response.json({ error: getApiError(lang, "file_too_large") }, { status: 400 });

      const arrayBuffer = await file.arrayBuffer();
      let fullText = "";

      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const buffer = Buffer.from(arrayBuffer);
        fullText = await extractTextFromPdfBuffer(buffer);

        if (!fullText || fullText.trim().length < 30) {
          return Response.json(
            { error: "PDF'den metin çıkarılamadı. Belge taranmış (görsel tabanlı) olabilir. Metin tabanlı PDF yükleyin." },
            { status: 422 }
          );
        }
      } else {
        fullText = new TextDecoder("utf-8").decode(arrayBuffer);
      }

      const clean = fullText
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]{2,}/g, " ")
        .trim();

      const chunks = chunkText(clean);

      return Response.json({
        ok: true,
        fileName: file.name,
        chunks,
        totalChunks: chunks.length,
        totalChars: clean.length,
      });
    }

    // ── Chat: retrieve + stream ──────────────────────────────────────────────
    if (contentType.includes("application/json")) {
      if (!process.env.GROQ_API_KEY?.trim()) {
        return Response.json(
          { error: "GROQ_API_KEY is not configured on the server." },
          { status: 503 }
        );
      }

      const {
        messages = [],
        chunks = [] as string[],
        fileName = "belge",
        model = "llama-3.1-8b-instant",
        responseLength = "medium",
        temperature = 0.4,
        language = "tr",
      } = await req.json();

      const lang = normalizeBexLanguage(
        language === "en" || language === "de" || language === "tr" ? language : "tr"
      );

      if (!chunks?.length) {
        return Response.json({ error: getApiError(lang, "invalid_request") }, { status: 400 });
      }

      const modelId = (GROQ_CHAT_MODEL_IDS as readonly string[]).includes(model)
        ? model
        : "llama-3.1-8b-instant";

      const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
      const relevant = retrieveTopChunks(chunks, lastUser?.content ?? "");
      const system = buildSystemPrompt(relevant, chunks.length, fileName, responseLength, lang);

      const result = streamText({
        model: resolveLanguageModel("groq", modelId as (typeof GROQ_CHAT_MODEL_IDS)[number]),
        system,
        messages,
        temperature,
      });

      return createPlainTextStreamResponse(result.textStream, { logLabel: "BEX PDF" });
    }

    return new Response("Unsupported content type", { status: 415 });
  } catch (err) {
    console.error("BEX /api/pdf error:", err);
    return new Response(getApiError(lang, "internal"), { status: 500 });
  }
}