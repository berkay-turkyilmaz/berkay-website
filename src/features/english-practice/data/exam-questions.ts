import type { ExamMode, ExamQuestion, ExamQuestionType } from "../types";
import { fisherYatesShuffle } from "../lib/exam-scoring";
import { EXAM_QUESTIONS_EXTENDED } from "./exam-questions-extended";

export const EXAM_QUESTION_POOL: ExamQuestion[] = [
  { id: "e1", type: "multiple", prompt: "She ___ to the gym three times a week.", options: ["go", "goes", "going", "gone"], answer: "goes", explanation: "Present simple, 3rd person: goes." },
  { id: "e2", type: "multiple", prompt: "I ___ never been to Japan.", options: ["have", "has", "am", "was"], answer: "have", explanation: "Present perfect with I → have." },
  { id: "e3", type: "fill", prompt: "Complete: They ___ (watch) a movie right now.", answer: "are watching", acceptableAnswers: ["are watching", "they are watching"], explanation: "Present continuous for now." },
  { id: "e4", type: "translate", prompt: "Translate: 'Dün akşam erken yattım.'", answer: "I went to bed early last night", acceptableAnswers: ["i went to bed early last night", "last night i went to bed early"], explanation: "Past simple." },
  { id: "e5", type: "multiple", prompt: "We're looking forward ___ the holiday.", options: ["to", "for", "at", "on"], answer: "to", explanation: "look forward to + -ing/noun." },
  { id: "e6", type: "fill", prompt: "Complete: If it ___ (be) sunny, we will go to the beach.", answer: "is", explanation: "First conditional: if + present." },
  { id: "e7", type: "multiple", prompt: "This restaurant is ___ than the one we tried last week.", options: ["good", "better", "best", "more good"], answer: "better", explanation: "Comparative of good → better." },
  { id: "e8", type: "translate", prompt: "Translate: 'Kahve içmeyi çok seviyorum.'", answer: "I really love drinking coffee", acceptableAnswers: ["i really love drinking coffee", "i love drinking coffee"], explanation: "love + -ing." },
  { id: "e9", type: "multiple", prompt: "He doesn't enjoy ___ up early.", options: ["get", "getting", "to get", "got"], answer: "getting", explanation: "enjoy + -ing." },
  { id: "e10", type: "fill", prompt: "Complete: She has lived here ___ 2015.", answer: "since", explanation: "since + year." },
  { id: "e11", type: "multiple", prompt: "I'd rather ___ at home tonight.", options: ["stay", "to stay", "staying", "stayed"], answer: "stay", explanation: "would rather + base verb." },
  { id: "e12", type: "translate", prompt: "Translate: 'Arkadaşlarımı özledim.'", answer: "I missed my friends", acceptableAnswers: ["i missed my friends", "i miss my friends"], explanation: "Past simple." },
  { id: "e13", type: "multiple", prompt: "How long ___ you known each other?", options: ["have", "has", "did", "do"], answer: "have", explanation: "How long have you...?" },
  { id: "e14", type: "fill", prompt: "Complete: We need to leave ___ five minutes.", answer: "in", explanation: "in five minutes = five minutes from now." },
  { id: "e15", type: "multiple", prompt: "She's afraid ___ spiders.", options: ["of", "from", "about", "with"], answer: "of", explanation: "afraid of." },
  { id: "e16", type: "translate", prompt: "Translate: 'Bu hafta sonu ne yapıyorsun?'", answer: "What are you doing this weekend", acceptableAnswers: ["what are you doing this weekend", "what will you do this weekend"], explanation: "Present continuous for plans." },
  { id: "e17", type: "multiple", prompt: "I ran ___ my teacher at the supermarket.", options: ["into", "to", "at", "on"], answer: "into", explanation: "run into = meet by chance." },
  { id: "e18", type: "fill", prompt: "Complete: You ___ (should / not) eat so much sugar.", answer: "should not", acceptableAnswers: ["should not", "shouldn't"], explanation: "Advice: should not." },
  { id: "e19", type: "multiple", prompt: "The meeting was cancelled ___ the bad weather.", options: ["because of", "although", "despite", "unless"], answer: "because of", explanation: "because of + noun." },
  { id: "e20", type: "translate", prompt: "Translate: 'O çok nazik bir insan.'", answer: "He is a very kind person", acceptableAnswers: ["he is a very kind person", "she is a very kind person"], explanation: "Adjective order." },
  { id: "e21", type: "multiple", prompt: "Let's split the bill, ___ ?", options: ["shall we", "will we", "don't we", "are we"], answer: "shall we", explanation: "Let's → shall we tag." },
  { id: "e22", type: "fill", prompt: "Complete: I apologized ___ being rude.", answer: "for", explanation: "apologize for." },
  { id: "e23", type: "multiple", prompt: "She speaks English ___ than her brother.", options: ["more fluently", "fluent", "most fluently", "fluently"], answer: "more fluently", explanation: "Comparative adverb." },
  { id: "e24", type: "translate", prompt: "Translate: 'Yarın yağmur yağabilir.'", answer: "It might rain tomorrow", acceptableAnswers: ["it might rain tomorrow", "it may rain tomorrow"], explanation: "might for possibility." },
  { id: "e25", type: "multiple", prompt: "I'm tired ___ waiting.", options: ["of", "from", "about", "with"], answer: "of", explanation: "tired of + -ing." },

  // Doğru / Yanlış
  { id: "tf1", type: "true_false", prompt: "'He don't like pizza' is grammatically correct.", options: ["True", "False"], answer: "False", explanation: "3rd person negative: He doesn't like..." },
  { id: "tf2", type: "true_false", prompt: "'I have lived here for five years' uses present perfect correctly.", options: ["True", "False"], answer: "True", explanation: "for + period → present perfect." },
  { id: "tf3", type: "true_false", prompt: "'She is go to school' is correct for now.", options: ["True", "False"], answer: "False", explanation: "Present continuous: is going." },
  { id: "tf4", type: "true_false", prompt: "'Could you help me?' is a polite request.", options: ["True", "False"], answer: "True", explanation: "Could for polite requests." },
  { id: "tf5", type: "true_false", prompt: "'I am agree' is the correct way to agree.", options: ["True", "False"], answer: "False", explanation: "We say I agree (no 'am')." },
  { id: "tf6", type: "true_false", prompt: "'Children' is the plural of 'child'.", options: ["True", "False"], answer: "True", explanation: "Irregular plural." },
  { id: "tf7", type: "true_false", prompt: "'More better' is correct comparative form.", options: ["True", "False"], answer: "False", explanation: "Just 'better' — no 'more'." },
  { id: "tf8", type: "true_false", prompt: "'I'm looking forward to meeting you' is correct.", options: ["True", "False"], answer: "True", explanation: "look forward to + -ing." },
  { id: "tf9", type: "true_false", prompt: "In English, adjectives come after the noun by default.", options: ["True", "False"], answer: "False", explanation: "Adjective + noun: a big house." },
  { id: "tf10", type: "true_false", prompt: "'She works every day' is present simple.", options: ["True", "False"], answer: "True", explanation: "Habitual present → present simple." },

  // Hızlı işaretle (2 seçenek)
  { id: "tp1", type: "tap", prompt: "Tap the correct sentence:", options: ["She go to work.", "She goes to work."], answer: "She goes to work.", explanation: "3rd person -s." },
  { id: "tp2", type: "tap", prompt: "Tap the correct sentence:", options: ["I am agree.", "I agree."], answer: "I agree.", explanation: "Agree is a verb — no 'am'." },
  { id: "tp3", type: "tap", prompt: "Tap the correct sentence:", options: ["He don't know.", "He doesn't know."], answer: "He doesn't know.", explanation: "doesn't + base verb." },
  { id: "tp4", type: "tap", prompt: "Tap the correct word:", options: ["informations", "information"], answer: "information", explanation: "Uncountable — no -s." },
  { id: "tp5", type: "tap", prompt: "Tap the correct sentence:", options: ["I have 25 years old.", "I am 25 years old."], answer: "I am 25 years old.", explanation: "Age: I am X years old." },
  { id: "tp6", type: "tap", prompt: "Tap the correct preposition:", options: ["depend of", "depend on"], answer: "depend on", explanation: "depend on something." },
  { id: "tp7", type: "tap", prompt: "Tap the correct form:", options: ["more easier", "easier"], answer: "easier", explanation: "Comparative: easier." },
  { id: "tp8", type: "tap", prompt: "Tap the correct sentence:", options: ["I look forward to see you.", "I look forward to seeing you."], answer: "I look forward to seeing you.", explanation: "to + -ing after look forward." },
  ...EXAM_QUESTIONS_EXTENDED,
];

const MODE_TYPE_MAP: Record<ExamMode, ExamQuestionType[] | "all"> = {
  mixed: "all",
  multiple: ["multiple"],
  true_false: ["true_false"],
  fill: ["fill"],
  translate: ["translate"],
  tap: ["tap"],
};

export function pickExamQuestions(count: number, mode: ExamMode = "mixed"): ExamQuestion[] {
  const allowed = MODE_TYPE_MAP[mode];
  const pool =
    allowed === "all"
      ? EXAM_QUESTION_POOL
      : EXAM_QUESTION_POOL.filter((q) => allowed.includes(q.type));

  const shuffled = fisherYatesShuffle(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function countQuestionsForMode(mode: ExamMode): number {
  const allowed = MODE_TYPE_MAP[mode];
  if (allowed === "all") return EXAM_QUESTION_POOL.length;
  return EXAM_QUESTION_POOL.filter((q) => allowed.includes(q.type)).length;
}
