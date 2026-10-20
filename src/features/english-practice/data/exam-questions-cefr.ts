import type { ExamQuestion, FlashcardLevel } from "../types";

const m = (
  level: FlashcardLevel,
  n: number,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string
): ExamQuestion => ({
  id: `cx-${level.toLowerCase()}-${n}`,
  type: "multiple",
  prompt,
  options,
  answer,
  explanation,
  level,
});

const f = (
  level: FlashcardLevel,
  n: number,
  prompt: string,
  answer: string,
  explanation: string,
  acceptableAnswers?: string[]
): ExamQuestion => ({
  id: `cx-${level.toLowerCase()}-${n}`,
  type: "fill",
  prompt,
  answer,
  acceptableAnswers: acceptableAnswers ?? [answer],
  explanation,
  level,
});

const tf = (level: FlashcardLevel, n: number, prompt: string, answer: "True" | "False", explanation: string): ExamQuestion => ({
  id: `cx-${level.toLowerCase()}-${n}`,
  type: "true_false",
  prompt,
  options: ["True", "False"],
  answer,
  explanation,
  level,
});

/** Level-tagged questions (A1–C1) added on top of the original pool. */
export const EXAM_QUESTIONS_CEFR: ExamQuestion[] = [
  // ── A1 ───────────────────────────────────────────────────────────────────
  m("A1", 1, "I ___ a student.", ["am", "is", "are", "be"], "am", "I → am."),
  m("A1", 2, "She ___ two brothers.", ["have", "has", "haves", "is"], "has", "She → has."),
  m("A1", 3, "___ is your name?", ["What", "Where", "Who is", "How"], "What", "What is your name?"),
  m("A1", 4, "There ___ a book on the table.", ["is", "are", "am", "be"], "is", "Singular noun → there is."),
  m("A1", 5, "They ___ from Turkey.", ["is", "am", "are", "be"], "are", "They → are."),
  m("A1", 6, "This is ___ apple.", ["a", "an", "the one", "some"], "an", "'an' before a vowel sound."),
  m("A1", 7, "I ___ coffee in the morning.", ["drinks", "drink", "drinking", "drank to"], "drink", "Present simple with I → base verb."),
  m("A1", 8, "What colour is the sky? It is ___.", ["blue", "bread", "big", "bag"], "blue", "The sky is blue."),
  m("A1", 9, "He ___ not like fish.", ["do", "does", "is", "are"], "does", "Negative with he → does not."),
  f("A1", 10, "Complete: My mother ___ (be) a doctor.", "is", "My mother → is."),
  f("A1", 11, "Complete: We ___ (go) to school by bus.", "go", "We → go (present simple)."),
  tf("A1", 12, "'Monday' comes after 'Sunday'.", "True", "Sunday → Monday."),
  tf("A1", 13, "'Ten' is smaller than 'five'.", "False", "Ten (10) is bigger than five (5)."),
  m("A1", 14, "Which word means 'su'?", ["water", "bread", "milk", "tea"], "water", "water = su."),

  // ── A2 ───────────────────────────────────────────────────────────────────
  m("A2", 1, "Yesterday I ___ to the cinema.", ["go", "went", "gone", "going"], "went", "Past simple of go → went."),
  m("A2", 2, "She is ___ than her sister.", ["tall", "taller", "tallest", "more tall"], "taller", "Comparative of a short adjective."),
  m("A2", 3, "I'm going ___ visit my grandparents tomorrow.", ["to", "for", "at", "in"], "to", "going to + base verb."),
  m("A2", 4, "How ___ water do you drink a day?", ["many", "much", "long", "often"], "much", "Uncountable noun → how much."),
  m("A2", 5, "We ___ dinner when the phone rang.", ["have", "had", "were having", "are having"], "were having", "Past continuous interrupted by past simple."),
  m("A2", 6, "You ___ smoke in the hospital.", ["mustn't", "needn't", "don't", "aren't"], "mustn't", "mustn't = it is forbidden."),
  m("A2", 7, "I haven't seen him ___ last week.", ["for", "since", "ago", "from"], "since", "since + point in time."),
  m("A2", 8, "The bank is ___ the supermarket and the post office.", ["between", "among", "behind of", "near of"], "between", "between two things."),
  m("A2", 9, "Would you like ___ tea?", ["any", "some", "a", "many"], "some", "Offers use 'some'."),
  f("A2", 10, "Complete: I ___ (not / have) any money today.", "don't have", "Present simple negative.", ["don't have", "do not have", "have no"]),
  f("A2", 11, "Complete: He is the ___ (tall) boy in the class.", "tallest", "Superlative of tall."),
  tf("A2", 12, "'I can to swim' is correct.", "False", "can + base verb: 'I can swim'."),
  tf("A2", 13, "'There aren't any eggs' is correct.", "True", "Negative plural: aren't any."),
  m("A2", 14, "Which word means 'bulutlu'?", ["cloudy", "sunny", "windy", "foggy"], "cloudy", "cloudy = bulutlu."),

  // ── B1 ───────────────────────────────────────────────────────────────────
  m("B1", 1, "If I ___ more time, I would learn Spanish.", ["have", "had", "will have", "would have"], "had", "Second conditional: if + past simple."),
  m("B1", 2, "The letter ___ yesterday.", ["sent", "was sent", "is sent", "has sent"], "was sent", "Passive, past simple."),
  m("B1", 3, "She asked me where ___.", ["do I live", "I live", "did I live", "I am living"], "I live", "Reported questions use statement word order."),
  m("B1", 4, "I used to ___ football when I was a child.", ["play", "playing", "played", "plays"], "play", "used to + base verb."),
  m("B1", 5, "He's the man ___ car was stolen.", ["who", "whose", "which", "whom"], "whose", "whose shows possession."),
  m("B1", 6, "I'm not sure ___ he will come.", ["if", "that", "what", "which"], "if", "if = whether in indirect speech."),
  m("B1", 7, "We have been waiting ___ two hours.", ["since", "for", "during", "from"], "for", "for + period of time."),
  m("B1", 8, "You ___ wear a seatbelt. It's the law.", ["have to", "may", "might", "would"], "have to", "have to = obligation."),
  m("B1", 9, "Which word is a synonym of 'big'?", ["huge", "tiny", "narrow", "thin"], "huge", "huge ≈ very big."),
  f("B1", 10, "Complete: She said she ___ (be) tired.", "was", "Reported speech: backshift is → was."),
  f("B1", 11, "Complete: By next year, I ___ (finish) my degree.", "will have finished", "Future perfect.", ["will have finished", "'ll have finished"]),
  tf("B1", 12, "'I look forward to hear from you' is correct.", "False", "look forward to + -ing: 'hearing'."),
  tf("B1", 13, "'Much people came to the party' is correct.", "False", "Use 'many' with countable nouns."),
  m("B1", 14, "Choose the correct word: He made a big ___ about the noise.", ["complaint", "complain", "complained", "complaining"], "complaint", "make a complaint (noun)."),

  // ── B2 ───────────────────────────────────────────────────────────────────
  m("B2", 1, "Had I known about the delay, I ___ earlier.", ["would leave", "would have left", "left", "will leave"], "would have left", "Third conditional with inversion."),
  m("B2", 2, "She denied ___ the money.", ["to take", "taking", "take", "to have take"], "taking", "deny + -ing."),
  m("B2", 3, "The new law is expected ___ into effect in March.", ["come", "to come", "coming", "came"], "to come", "be expected + to-infinitive."),
  m("B2", 4, "I'd rather you ___ me the truth.", ["tell", "told", "will tell", "telling"], "told", "would rather + subject + past simple."),
  m("B2", 5, "Not only ___ late, but he also forgot the documents.", ["he was", "was he", "he is", "is he"], "was he", "Inversion after 'Not only'."),
  m("B2", 6, "The company is thought ___ millions last year.", ["to lose", "to have lost", "losing", "lose"], "to have lost", "Perfect infinitive for a past event."),
  m("B2", 7, "Which word best completes it? The results were ___ — nobody expected them.", ["predictable", "surprising", "ordinary", "expected"], "surprising", "Context: nobody expected → surprising."),
  m("B2", 8, "He insisted ___ paying for dinner.", ["in", "on", "at", "for"], "on", "insist on + -ing."),
  m("B2", 9, "It's high time we ___ a decision.", ["make", "made", "will make", "are making"], "made", "It's high time + past simple."),
  f("B2", 10, "Complete: If only I ___ (know) the answer!", "knew", "If only + past simple for a present wish."),
  f("B2", 11, "Complete: She is said ___ (speak) six languages.", "to speak", "be said + to-infinitive.", ["to speak"]),
  tf("B2", 12, "'Hardly had he arrived when it started to rain' is correct.", "True", "Hardly had + subject + past participle ... when."),
  tf("B2", 13, "'She suggested me to go' is correct.", "False", "suggest (that) she go / suggest going — not 'suggest someone to'."),
  m("B2", 14, "The manager ___ the proposal because of the high cost.", ["turned down", "turned up", "turned on", "turned over"], "turned down", "turn down = reject."),

  // ── C1 ───────────────────────────────────────────────────────────────────
  m("C1", 1, "Rarely ___ such a talented musician.", ["I have met", "have I met", "I met", "did I met"], "have I met", "Negative adverb at the start triggers inversion."),
  m("C1", 2, "The CEO, ___ decision it was, took full responsibility.", ["whom", "whose", "which", "who"], "whose", "whose + noun."),
  m("C1", 3, "Choose the best word: The evidence was too ___ to convince the jury.", ["flimsy", "robust", "compelling", "conclusive"], "flimsy", "Too weak to convince → flimsy."),
  m("C1", 4, "She spoke so quietly that her words were barely ___.", ["audible", "audience", "auditory", "audited"], "audible", "audible = can be heard."),
  m("C1", 5, "___ the circumstances, the team performed remarkably well.", ["Given", "Giving", "Gave", "To give"], "Given", "Given + noun = considering."),
  m("C1", 6, "He's not ___ to admit that he was wrong.", ["inclined", "inclining", "inclination", "inclines"], "inclined", "be inclined to + infinitive."),
  m("C1", 7, "The policy was widely criticised, ___ it remained in force.", ["nonetheless", "moreover", "therefore", "because"], "nonetheless", "Contrast: nonetheless."),
  m("C1", 8, "Which sentence is the most formal?", ["Can you tell me the price?", "Could you possibly inform me of the cost?", "Tell me how much it is.", "What's the price?"], "Could you possibly inform me of the cost?", "Formal register uses indirect, polite phrasing."),
  m("C1", 9, "The two reports are not ___; each covers a different period.", ["comparable", "compared", "comparing", "comparison"], "comparable", "comparable = similar enough to compare."),
  f("C1", 10, "Complete: Were it not for your help, we ___ (fail).", "would fail", "'Were it not for' is an inverted second conditional.", ["would fail", "would be failing"]),
  f("C1", 11, "Complete: So absorbed ___ (be) she in the book that she missed her stop.", "was", "'So + adjective' at the start requires inversion: was she."),
  tf("C1", 12, "'Neither the manager nor the employees was informed' is grammatically correct.", "False", "The verb agrees with the nearer subject: 'were informed'."),
  tf("C1", 13, "'Notwithstanding the delay' means 'in spite of the delay'.", "True", "notwithstanding = in spite of."),
  m("C1", 14, "The minister's remarks ___ widespread criticism.", ["provoked", "provided", "provisioned", "proved"], "provoked", "provoke criticism = cause a strong reaction."),
];
