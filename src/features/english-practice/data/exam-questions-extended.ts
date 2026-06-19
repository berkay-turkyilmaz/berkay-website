import type { ExamQuestion } from "../types";

/** B1/B2 grammar, vocabulary & classroom English — extends core pool */
export const EXAM_QUESTIONS_EXTENDED: ExamQuestion[] = [
  { id: "ex26", type: "multiple", prompt: "By the time we arrived, the film ___ already started.", options: ["has", "had", "was", "have"], answer: "had", explanation: "Past perfect before another past action." },
  { id: "ex27", type: "multiple", prompt: "She suggested ___ a break.", options: ["take", "taking", "to take", "took"], answer: "taking", explanation: "suggest + -ing." },
  { id: "ex28", type: "fill", prompt: "Complete: I wish I ___ (speak) French fluently.", answer: "spoke", acceptableAnswers: ["spoke", "could speak"], explanation: "wish + past for present regret." },
  { id: "ex29", type: "translate", prompt: "Translate: 'Toplantıyı iptal etmek zorunda kaldık.'", answer: "We had to cancel the meeting", acceptableAnswers: ["we had to cancel the meeting", "we were forced to cancel the meeting"], explanation: "had to = zorunda kalmak." },
  { id: "ex30", type: "multiple", prompt: "The report must ___ by Friday.", options: ["finish", "be finished", "finishing", "finished"], answer: "be finished", explanation: "Passive modal: must be + past participle." },
  { id: "ex31", type: "multiple", prompt: "He's responsible ___ customer support.", options: ["for", "of", "to", "with"], answer: "for", explanation: "responsible for." },
  { id: "ex32", type: "fill", prompt: "Complete: Despite ___ (rain), we went out.", answer: "the rain", acceptableAnswers: ["the rain", "rain", "it raining"], explanation: "Despite + noun/-ing." },
  { id: "ex33", type: "translate", prompt: "Translate: 'Bu konuda sana katılıyorum.'", answer: "I agree with you on this", acceptableAnswers: ["i agree with you on this", "i agree with you about this"], explanation: "agree with someone." },
  { id: "ex34", type: "multiple", prompt: "I'd rather you ___ smoke here.", options: ["don't", "didn't", "not", "won't"], answer: "didn't", explanation: "would rather + subject + past." },
  { id: "ex35", type: "multiple", prompt: "The laptop belongs ___ my sister.", options: ["to", "for", "with", "at"], answer: "to", explanation: "belong to." },

  { id: "tf11", type: "true_false", prompt: "'I have been to London last year' is correct.", options: ["True", "False"], answer: "False", explanation: "Specific past time → past simple: I went to London." },
  { id: "tf12", type: "true_false", prompt: "'Advice' is an uncountable noun.", options: ["True", "False"], answer: "True", explanation: "a piece of advice, not advices." },
  { id: "tf13", type: "true_false", prompt: "'Despite of the rain' is correct.", options: ["True", "False"], answer: "False", explanation: "Despite the rain (no 'of')." },
  { id: "tf14", type: "true_false", prompt: "'Neither of them is ready' is grammatically correct.", options: ["True", "False"], answer: "True", explanation: "Neither takes singular verb in formal English." },
  { id: "tf15", type: "true_false", prompt: "'I'm used to wake up early' is correct.", options: ["True", "False"], answer: "False", explanation: "be used to + -ing." },

  { id: "tp9", type: "tap", prompt: "Tap the correct sentence:", options: ["I am used to get up early.", "I am used to getting up early."], answer: "I am used to getting up early.", explanation: "used to + -ing." },
  { id: "tp10", type: "tap", prompt: "Tap the correct collocation:", options: ["make a decision", "do a decision"], answer: "make a decision", explanation: "make a decision (not do)." },
  { id: "tp11", type: "tap", prompt: "Tap the correct word:", options: ["environmental", "enviromental"], answer: "environmental", explanation: "Spelling: environmental." },
  { id: "tp12", type: "tap", prompt: "Tap the correct sentence:", options: ["I look forward to hear from you.", "I look forward to hearing from you."], answer: "I look forward to hearing from you.", explanation: "look forward to + -ing." },

  { id: "ex36", type: "multiple", prompt: "We ran out ___ milk.", options: ["of", "from", "with", "off"], answer: "of", explanation: "run out of." },
  { id: "ex37", type: "fill", prompt: "Complete: The project was cancelled due ___ lack of funding.", answer: "to", explanation: "due to + noun." },
  { id: "ex38", type: "translate", prompt: "Translate: 'Yarın toplantıya katılabilir misin?'", answer: "Can you attend the meeting tomorrow", acceptableAnswers: ["can you attend the meeting tomorrow", "can you join the meeting tomorrow"], explanation: "attend/join a meeting." },
  { id: "ex39", type: "multiple", prompt: "She's the person ___ I told you about.", options: ["who", "which", "whose", "whom"], answer: "who", explanation: "Relative clause for people." },
  { id: "ex40", type: "multiple", prompt: "I can't afford ___ a new car right now.", options: ["buy", "buying", "to buy", "bought"], answer: "to buy", explanation: "afford + to-infinitive." },
  { id: "ex41", type: "fill", prompt: "Complete: Unless you ___ (hurry), we'll miss the bus.", answer: "hurry", explanation: "Unless + present for future warning." },
  { id: "ex42", type: "translate", prompt: "Translate: 'İş görüşmesi için hazırlanıyorum.'", answer: "I am preparing for the job interview", acceptableAnswers: ["i am preparing for the job interview", "i'm preparing for a job interview"], explanation: "prepare for." },
  { id: "ex43", type: "multiple", prompt: "The manager asked us ___ late again.", options: ["not to be", "to not be", "don't be", "not be"], answer: "not to be", explanation: "ask someone not to + verb." },
  { id: "ex44", type: "multiple", prompt: "This is the ___ interesting book I've ever read.", options: ["more", "most", "much", "very"], answer: "most", explanation: "Superlative: the most interesting." },
  { id: "ex45", type: "fill", prompt: "Complete: She succeeded ___ passing the exam.", answer: "in", explanation: "succeed in + -ing." },
];
