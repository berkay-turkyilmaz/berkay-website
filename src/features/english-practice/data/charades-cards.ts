import type { CharadesCard } from "../types";

const c = (
  id: string,
  word: string,
  category: CharadesCard["category"],
  hint: string
): CharadesCard => ({ id, word, category, hint });

/** Mime-friendly everyday words — no speaking allowed */
export const CHARADES_CARDS: CharadesCard[] = [
  c("a01", "Swim", "actions", "Yüzmek"),
  c("a02", "Run", "actions", "Koşmak"),
  c("a03", "Walk", "actions", "Yürümek"),
  c("a04", "Sleep", "actions", "Uyumak"),
  c("a05", "Eat", "actions", "Yemek yemek"),
  c("a06", "Drink", "actions", "İçmek"),
  c("a07", "Dance", "actions", "Dans etmek"),
  c("a08", "Sing", "actions", "Şarkı söylemek"),
  c("a09", "Cook", "actions", "Yemek yapmak"),
  c("a10", "Drive", "actions", "Araba sürmek"),
  c("a11", "Read", "actions", "Okumak"),
  c("a12", "Write", "actions", "Yazmak"),
  c("a13", "Phone call", "actions", "Telefon etmek"),
  c("a14", "Brush teeth", "actions", "Diş fırçalamak"),
  c("a15", "Take a photo", "actions", "Fotoğraf çekmek"),

  c("e01", "Happy", "emotions", "Mutlu"),
  c("e02", "Sad", "emotions", "Üzgün"),
  c("e03", "Angry", "emotions", "Kızgın"),
  c("e04", "Tired", "emotions", "Yorgun"),
  c("e05", "Scared", "emotions", "Korkmuş"),
  c("e06", "Surprised", "emotions", "Şaşırmış"),
  c("e07", "Love", "emotions", "Sevgi"),
  c("e08", "Laugh", "emotions", "Gülmek"),

  c("s01", "Football", "sports", "Futbol"),
  c("s02", "Basketball", "sports", "Basketbol"),
  c("s03", "Tennis", "sports", "Tenis"),
  c("s04", "Boxing", "sports", "Boks"),
  c("s05", "Yoga", "sports", "Yoga"),

  c("n01", "Dog", "animals", "Köpek"),
  c("n02", "Cat", "animals", "Kedi"),
  c("n03", "Bird", "animals", "Kuş"),
  c("n04", "Fish", "animals", "Balık"),
  c("n05", "Monkey", "animals", "Maymun"),
  c("n06", "Elephant", "animals", "Fil"),

  c("o01", "Rain", "objects", "Yağmur"),
  c("o02", "Sun", "objects", "Güneş"),
  c("o03", "Snow", "objects", "Kar"),
  c("o04", "Bus", "objects", "Otobüs"),
  c("o05", "Car", "objects", "Araba"),
  c("o06", "Plane", "objects", "Uçak"),
  c("o07", "Pizza", "objects", "Pizza"),
  c("o08", "Coffee", "objects", "Kahve"),
  c("o09", "Umbrella", "objects", "Şemsiye"),
  c("o10", "Birthday", "objects", "Doğum günü"),
  c("o11", "Wedding", "objects", "Düğün"),
  c("o12", "Hospital", "objects", "Hastane"),
];

export const CHARADES_CATEGORY_LABELS: Record<string, string> = {
  actions: "Actions",
  emotions: "Feelings",
  sports: "Sports",
  animals: "Animals",
  objects: "Daily Life",
};
