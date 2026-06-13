import type { GrammarRule } from "../types";

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: "g1",
    title: "Present Simple",
    summary: "Alışkanlıklar, genel gerçekler ve rutinler.",
    formula: "Subject + V1 (+ s/es for he/she/it)",
    examples: [
      { en: "I usually have coffee before work.", tr: "İşten önce genelde kahve içerim." },
      { en: "She lives near the city center.", tr: "Şehir merkezine yakın yaşar." },
      { en: "They meet for lunch on Fridays.", tr: "Cuma günleri öğle yemeği için buluşurlar." },
    ],
    tip: "He/She/It ile fiile -s eklenir: works, goes, watches.",
  },
  {
    id: "g2",
    title: "Present Continuous",
    summary: "Şu anda olan veya geçici durumlar.",
    formula: "Subject + am/is/are + V-ing",
    examples: [
      { en: "I'm waiting for my friend outside.", tr: "Dışarıda arkadaşımı bekliyorum." },
      { en: "It's raining again.", tr: "Yine yağmur yağıyor." },
    ],
    tip: "know, love, believe gibi state fiilleri genelde continuous almaz.",
  },
  {
    id: "g3",
    title: "Past Simple",
    summary: "Geçmişte bitmiş eylemler.",
    formula: "Subject + V2 / regular verb + -ed",
    examples: [
      { en: "We had dinner at a new restaurant.", tr: "Yeni bir restoranda akşam yedik." },
      { en: "He forgot his umbrella yesterday.", tr: "Dün şemsiyesini unuttu." },
    ],
    tip: "yesterday, last week, ago, in 2020 ifadeleri past simple tetikler.",
  },
  {
    id: "g4",
    title: "Present Perfect",
    summary: "Geçmişte başlayıp şimdiye bağlanan deneyim.",
    formula: "Subject + have/has + past participle",
    examples: [
      { en: "I have never tried sushi.", tr: "Hiç suşi denemedim." },
      { en: "She has already left.", tr: "O çoktan ayrıldı." },
    ],
    tip: "for + süre, since + başlangıç noktası.",
  },
  {
    id: "g5",
    title: "Modal Verbs",
    summary: "Yetenek, izin, tavsiye ve zorunluluk.",
    formula: "Subject + modal + base verb",
    examples: [
      { en: "Can you help me carry this?", tr: "Bunu taşımama yardım eder misin?" },
      { en: "You should get more sleep.", tr: "Daha fazla uyumalısın." },
      { en: "We must leave now.", tr: "Şimdi gitmeliyiz." },
    ],
    tip: "Modal sonrası fiil yalın kalır: must go ✓",
  },
  {
    id: "g6",
    title: "First Conditional",
    summary: "Gerçekleşme ihtimali olan koşullar.",
    formula: "If + present simple, will + base verb",
    examples: [
      { en: "If the weather is nice, we'll have a picnic.", tr: "Hava güzelse piknik yaparız." },
      { en: "If you study, you will pass.", tr: "Çalışırsan geçersin." },
    ],
    tip: "If cümlesi gelecek zaman almaz.",
  },
  {
    id: "g7",
    title: "Comparatives & Superlatives",
    summary: "Karşılaştırma ve en üstünlük.",
    formula: "adj + -er / more + adj · the + -est / most + adj",
    examples: [
      { en: "This café is cheaper than that one.", tr: "Bu kafe şundan daha ucuz." },
      { en: "It's the best pizza in town.", tr: "Şehirdeki en iyi pizza." },
    ],
    tip: "Kısa sıfatlar: -er/-est. Uzun sıfatlar: more/most.",
  },
  {
    id: "g8",
    title: "Question Tags",
    summary: "Onay isteyen kısa soru ekleri.",
    formula: "Statement, + auxiliary + pronoun?",
    examples: [
      { en: "You're coming, aren't you?", tr: "Geliyorsun, değil mi?" },
      { en: "She doesn't drink coffee, does she?", tr: "Kahve içmez, öyle değil mi?" },
    ],
    tip: "Olumlu cümle → olumsuz tag; olumsuz cümle → olumlu tag.",
  },
];
