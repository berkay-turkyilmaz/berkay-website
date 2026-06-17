import type { CharadesCard, TabooDifficulty } from "../types";

const c = (
  id: string,
  word: string,
  category: CharadesCard["category"],
  hint: string,
  difficulty: TabooDifficulty = "medium"
): CharadesCard => ({ id, word, category, hint, difficulty });

/** Mime-only: physical actions, clear gestures — no abstract nouns like "Hospital". */
export const CHARADES_CARDS_CORE: CharadesCard[] = [
  // ACTIONS — highly mime-able
  c("a01", "Swimming", "actions", "Yüzmek", "easy"),
  c("a02", "Running", "actions", "Koşmak", "easy"),
  c("a03", "Walking", "actions", "Yürümek", "easy"),
  c("a04", "Sleeping", "actions", "Uyumak", "easy"),
  c("a05", "Eating", "actions", "Yemek yemek", "easy"),
  c("a06", "Drinking", "actions", "İçmek", "easy"),
  c("a07", "Dancing", "actions", "Dans etmek", "medium"),
  c("a08", "Singing", "actions", "Şarkı söylemek", "medium"),
  c("a09", "Cooking", "actions", "Yemek yapmak", "medium"),
  c("a10", "Driving", "actions", "Araba sürmek", "medium"),
  c("a11", "Reading", "actions", "Okumak", "easy"),
  c("a12", "Writing", "actions", "Yazmak", "medium"),
  c("a13", "Phone call", "actions", "Telefon etmek", "medium"),
  c("a14", "Brushing teeth", "actions", "Diş fırçalamak", "medium"),
  c("a15", "Taking a selfie", "actions", "Selfie çekmek", "easy"),
  c("a16", "Typing", "actions", "Klavyede yazmak", "medium"),
  c("a17", "Climbing stairs", "actions", "Merdiven çıkmak", "medium"),
  c("a18", "Opening a door", "actions", "Kapı açmak", "easy"),
  c("a19", "Cutting hair", "actions", "Saç kesmek", "hard"),
  c("a20", "Playing guitar", "actions", "Gitar çalmak", "medium"),

  // EMOTIONS — show on face/body
  c("e01", "Happy", "emotions", "Mutlu", "easy"),
  c("e02", "Sad", "emotions", "Üzgün", "easy"),
  c("e03", "Angry", "emotions", "Kızgın", "easy"),
  c("e04", "Tired", "emotions", "Yorgun", "easy"),
  c("e05", "Scared", "emotions", "Korkmuş", "easy"),
  c("e06", "Surprised", "emotions", "Şaşırmış", "easy"),
  c("e07", "Laughing", "emotions", "Gülmek", "easy"),
  c("e08", "Crying", "emotions", "Ağlamak", "easy"),
  c("e09", "Bored", "emotions", "Sıkılmış", "medium"),
  c("e10", "Nervous", "emotions", "Gergin", "medium"),

  // SPORTS — physical mime
  c("s01", "Playing football", "sports", "Futbol oynamak", "easy"),
  c("s02", "Playing basketball", "sports", "Basketbol oynamak", "medium"),
  c("s03", "Playing tennis", "sports", "Tenis oynamak", "medium"),
  c("s04", "Boxing", "sports", "Boks", "medium"),
  c("s05", "Doing yoga", "sports", "Yoga yapmak", "medium"),
  c("s06", "Skiing", "sports", "Kayak", "hard"),
  c("s07", "Weightlifting", "sports", "Ağırlık kaldırmak", "hard"),
  c("s08", "Surfing", "sports", "Sörf", "hard"),

  // ANIMALS — act like the animal
  c("n01", "Dog", "animals", "Köpek gibi", "easy"),
  c("n02", "Cat", "animals", "Kedi gibi", "easy"),
  c("n03", "Bird", "animals", "Kuş gibi", "easy"),
  c("n04", "Fish", "animals", "Balık gibi", "easy"),
  c("n05", "Monkey", "animals", "Maymun gibi", "easy"),
  c("n06", "Elephant", "animals", "Fil gibi", "medium"),
  c("n07", "Snake", "animals", "Yılan gibi", "medium"),
  c("n08", "Chicken", "animals", "Tavuk gibi", "easy"),

  // DAILY LIFE — mime objects/actions (not abstract places)
  c("o01", "Raining", "objects", "Yağmur yağıyor", "easy"),
  c("o02", "Sunny", "objects", "Güneşli", "easy"),
  c("o03", "Snowing", "objects", "Kar yağıyor", "easy"),
  c("o04", "Riding a bus", "objects", "Otobüse binmek", "medium"),
  c("o05", "Driving a car", "objects", "Araba kullanmak", "medium"),
  c("o06", "Flying a plane", "objects", "Uçak sürmek", "hard"),
  c("o07", "Eating pizza", "objects", "Pizza yemek", "easy"),
  c("o08", "Drinking coffee", "objects", "Kahve içmek", "easy"),
  c("o09", "Opening umbrella", "objects", "Şemsiye açmak", "medium"),
  c("o10", "Blowing candles", "objects", "Mum üflemek", "medium"),
  c("o11", "Putting on makeup", "objects", "Makyaj yapmak", "hard"),
  c("o12", "Waiting in line", "objects", "Sırada beklemek", "medium"),
];

import { CHARADES_CARDS_EXTENDED } from "./charades-cards-extended";

export const CHARADES_CARDS: CharadesCard[] = [
  ...CHARADES_CARDS_CORE,
  ...CHARADES_CARDS_EXTENDED,
];

export const CHARADES_CATEGORY_LABELS: Record<string, string> = {
  actions: "Actions",
  emotions: "Feelings",
  sports: "Sports",
  animals: "Animals",
  objects: "Daily Life",
  movies: "Movies",
  celebrities: "Showbiz",
};

export const CHARADES_DIFFICULTY_COUNTS = CHARADES_CARDS.reduce(
  (acc, card) => {
    const d = card.difficulty ?? "medium";
    acc[d] += 1;
    acc.all += 1;
    return acc;
  },
  { all: 0, easy: 0, medium: 0, hard: 0 } as Record<"all" | TabooDifficulty, number>
);
