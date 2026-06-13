export type ChunkRole =
  | "subject"
  | "predicate"
  | "context"
  | "evidence"
  | "connector"
  | "conclusion";

export type ContextChunk = {
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

export type ContextAnalysisResult = {
  chunks: ContextChunk[];
  totalTokens: number;
  contextWindowSize: number;
  redundantChunks: number[];
  compressionPotential: number;
};

const CONTEXT_WINDOW_SIZE = 8192;

const STOP_WORDS = new Set([
  "ve", "bir", "bu", "için", "ile", "olan", "da", "de", "the", "a", "an", "is",
  "are", "was", "were", "to", "of", "in", "on", "at", "by", "for", "with", "as",
  "und", "der", "die", "das", "ist", "sind", "für", "mit", "auf",
]);

const ROLE_KEYWORDS: Record<ChunkRole, string[]> = {
  subject: ["react", "next.js", "nextjs", "typescript", "javascript", "ai", "yapay", "sistem", "architecture", "mimari"],
  predicate: ["kullanır", "sağlar", "geliştir", "uses", "provides", "enables", "supports", "allows", "bietet", "ermöglicht"],
  context: ["sayesinde", "için", "through", "via", "because", "due", "während", "durch"],
  evidence: ["örneğin", "örnek", "data", "veri", "study", "research", "benchmark", "test", "beispiel"],
  connector: ["ayrıca", "bununla", "however", "therefore", "außerdem", "jedoch", "also", "furthermore"],
  conclusion: ["sonuç", "özetle", "conclusion", "summary", "therefore", "zusammenfassend", "fazlasıyla"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function splitIntoChunks(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const sentences = normalized
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  const maxLen = 220;

  for (const sentence of sentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
      continue;
    }
    let start = 0;
    while (start < sentence.length) {
      const slice = sentence.slice(start, start + maxLen).trim();
      if (slice) chunks.push(slice);
      start += maxLen - 40;
    }
  }

  if (chunks.length === 0 && normalized.length > 0) {
    chunks.push(normalized.slice(0, maxLen));
  }

  return chunks;
}

function inferRole(text: string, index: number, total: number): ChunkRole {
  const lower = text.toLowerCase();
  let best: ChunkRole = "context";
  let bestScore = 0;

  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS) as [ChunkRole, string[]][]) {
    const score = keywords.reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = role;
    }
  }

  if (index === 0 && bestScore === 0) return "subject";
  if (index === total - 1 && bestScore === 0) return "conclusion";
  if (bestScore === 0) return index % 3 === 1 ? "predicate" : "context";
  return best;
}

function inferPos(text: string): string {
  const first = text.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (/^(ve|and|und|but|however|ayrıca|also)$/i.test(first)) return "CONJ";
  if (/^(the|bir|eine|der|die|das)$/i.test(first)) return "DET";
  if (/\?$/.test(text.trim())) return "INTJ";
  return "NOUN";
}

function calculateWeight(text: string, index: number, total: number): number {
  const words = tokenize(text);
  const uniqueRatio = new Set(words).size / Math.max(words.length, 1);
  const positionBoost = index === 0 ? 0.15 : index === total - 1 ? 0.1 : 0;
  const lengthFactor = Math.min(text.length / 180, 1) * 0.35;
  return Math.min(0.95, 0.25 + uniqueRatio * 0.35 + lengthFactor + positionBoost);
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((w) => setB.has(w)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function findRelated(index: number, chunkTexts: string[]): number[] {
  const tokens = chunkTexts.map(tokenize);
  const related: { id: number; score: number }[] = [];

  for (let i = 0; i < chunkTexts.length; i++) {
    if (i === index) continue;
    const score = jaccardSimilarity(tokens[index], tokens[i]);
    if (score >= 0.2) related.push({ id: i, score });
  }

  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.id);
}

function buildReasoning(role: ChunkRole, weight: number): string {
  const weightLabel = weight > 0.7 ? "yüksek" : weight > 0.4 ? "orta" : "düşük";
  const roleLabels: Record<ChunkRole, string> = {
    subject: "Ana konu veya merkezi kavram",
    predicate: "Eylem veya işlev bildiren ifade",
    context: "Destekleyici bağlam bilgisi",
    evidence: "Kanıt veya örnek içerik",
    connector: "Cümleler arası geçiş",
    conclusion: "Sonuç veya özet niteliğinde",
  };
  return `${roleLabels[role]} · ${weightLabel} önem ağırlığı`;
}

export function analyzeContextText(text: string): ContextAnalysisResult {
  const chunkTexts = splitIntoChunks(text);
  const total = chunkTexts.length;

  const chunks: ContextChunk[] = chunkTexts.map((chunkText, index) => {
    const role = inferRole(chunkText, index, total);
    const weight = calculateWeight(chunkText, index, total);
    return {
      id: index,
      text: chunkText,
      role,
      weight,
      pos_dominant: inferPos(chunkText),
      reasoning: buildReasoning(role, weight),
      related: [],
      token_count: Math.max(1, Math.ceil(chunkText.length / 4)),
      redundancy: 0,
    };
  });

  for (const chunk of chunks) {
    chunk.related = findRelated(chunk.id, chunkTexts);
  }

  const redundantChunks: number[] = [];
  const tokens = chunkTexts.map(tokenize);

  for (let i = 0; i < chunks.length; i++) {
    for (let j = i + 1; j < chunks.length; j++) {
      const sim = jaccardSimilarity(tokens[i], tokens[j]);
      if (sim >= 0.65) {
        const keep = chunks[i].weight >= chunks[j].weight ? j : i;
        const drop = keep === j ? i : j;
        if (!redundantChunks.includes(drop)) {
          redundantChunks.push(drop);
          chunks[drop].redundancy = sim;
        }
      }
    }
  }

  const totalTokens = chunks.reduce((sum, c) => sum + c.token_count, 0);
  const compressionPotential =
    chunks.length === 0 ? 0 : Math.round((redundantChunks.length / chunks.length) * 100) / 100;

  return {
    chunks,
    totalTokens,
    contextWindowSize: CONTEXT_WINDOW_SIZE,
    redundantChunks,
    compressionPotential,
  };
}
