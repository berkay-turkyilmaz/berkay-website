import type { Flashcard } from "../types";
import { FLASHCARDS_EXTENDED } from "./flashcards-extended";

/** Core A1–A2 flashcards — daily basics */
export const FLASHCARDS: Flashcard[] = [
  // ── Daily Actions (A1) ──────────────────────────────────────────────────
  { id: "d1",  front: "Wake up",    back: "Uyanmak",          phonetic: "/weɪk ʌp/",       category: "daily",    example: "I wake up at seven.",               level: "A1" },
  { id: "d2",  front: "Go to bed",  back: "Yatmak",           phonetic: "/ɡəʊ tə bed/",    category: "daily",    example: "I go to bed at eleven.",            level: "A1" },
  { id: "d3",  front: "Eat",        back: "Yemek yemek",      phonetic: "/iːt/",            category: "daily",    example: "Let's eat lunch together.",         level: "A1" },
  { id: "d4",  front: "Drink",      back: "İçmek",            phonetic: "/drɪŋk/",          category: "daily",    example: "I drink water every day.",          level: "A1" },
  { id: "d5",  front: "Walk",       back: "Yürümek",          phonetic: "/wɔːk/",           category: "daily",    example: "We walk to the park.",              level: "A1" },
  { id: "d6",  front: "Run",        back: "Koşmak",           phonetic: "/rʌn/",            category: "daily",    example: "He runs in the morning.",           level: "A1" },
  { id: "d7",  front: "Work",       back: "Çalışmak",         phonetic: "/wɜːk/",           category: "daily",    example: "I work from nine to five.",         level: "A1" },
  { id: "d8",  front: "Study",      back: "Ders çalışmak",    phonetic: "/ˈstʌdi/",         category: "daily",    example: "She studies English every night.",  level: "A1" },
  { id: "d9",  front: "Cook",       back: "Yemek yapmak",     phonetic: "/kʊk/",            category: "daily",    example: "My mom cooks dinner.",              level: "A1" },
  { id: "d10", front: "Clean",      back: "Temizlemek",       phonetic: "/kliːn/",          category: "daily",    example: "I clean my room on Sundays.",       level: "A1" },

  // ── Food & Drink (A1) ──────────────────────────────────────────────────
  { id: "f1",  front: "Breakfast",  back: "Kahvaltı",         phonetic: "/ˈbrekfəst/",      category: "food",     example: "I have eggs for breakfast.",        level: "A1" },
  { id: "f2",  front: "Lunch",      back: "Öğle yemeği",      phonetic: "/lʌntʃ/",          category: "food",     example: "Lunch is at one o'clock.",          level: "A1" },
  { id: "f3",  front: "Dinner",     back: "Akşam yemeği",     phonetic: "/ˈdɪnə/",          category: "food",     example: "We eat dinner at home.",            level: "A1" },
  { id: "f4",  front: "Water",      back: "Su",               phonetic: "/ˈwɔːtə/",         category: "food",     example: "Can I have some water?",            level: "A1" },
  { id: "f5",  front: "Bread",      back: "Ekmek",            phonetic: "/bred/",           category: "food",     example: "I buy fresh bread.",                level: "A1" },
  { id: "f6",  front: "Milk",       back: "Süt",              phonetic: "/mɪlk/",           category: "food",     example: "The milk is in the fridge.",        level: "A1" },
  { id: "f7",  front: "Coffee",     back: "Kahve",            phonetic: "/ˈkɒfi/",          category: "food",     example: "I drink coffee in the morning.",    level: "A1" },
  { id: "f8",  front: "Tea",        back: "Çay",              phonetic: "/tiː/",            category: "food",     example: "Would you like some tea?",          level: "A1" },
  { id: "f9",  front: "Apple",      back: "Elma",             phonetic: "/ˈæpl/",           category: "food",     example: "An apple a day is healthy.",        level: "A1" },
  { id: "f10", front: "Pizza",      back: "Pizza",            phonetic: "/ˈpiːtsə/",        category: "food",     example: "We ordered pizza last night.",      level: "A1" },

  // ── People & Family (A1) ──────────────────────────────────────────────
  { id: "p1",  front: "Mother",     back: "Anne",             phonetic: "/ˈmʌðə/",          category: "people",   example: "My mother lives in Ankara.",        level: "A1" },
  { id: "p2",  front: "Father",     back: "Baba",             phonetic: "/ˈfɑːðə/",         category: "people",   example: "His father is a teacher.",          level: "A1" },
  { id: "p3",  front: "Friend",     back: "Arkadaş",          phonetic: "/frend/",          category: "people",   example: "She is my best friend.",            level: "A1" },
  { id: "p4",  front: "Brother",    back: "Erkek kardeş",     phonetic: "/ˈbrʌðə/",         category: "people",   example: "My brother is younger than me.",    level: "A1" },
  { id: "p5",  front: "Sister",     back: "Kız kardeş",       phonetic: "/ˈsɪstə/",         category: "people",   example: "I have one sister.",                level: "A1" },
  { id: "p6",  front: "Baby",       back: "Bebek",            phonetic: "/ˈbeɪbi/",         category: "people",   example: "The baby is sleeping.",             level: "A1" },
  { id: "p7",  front: "Teacher",    back: "Öğretmen",         phonetic: "/ˈtiːtʃə/",        category: "people",   example: "Our teacher is very kind.",         level: "A1" },

  // ── Travel & Transport (A1-A2) ─────────────────────────────────────────
  { id: "t1",  front: "Bus",        back: "Otobüs",           phonetic: "/bʌs/",            category: "travel",   example: "I take the bus to school.",         level: "A1" },
  { id: "t2",  front: "Car",        back: "Araba",            phonetic: "/kɑː/",            category: "travel",   example: "We go by car.",                     level: "A1" },
  { id: "t3",  front: "Train",      back: "Tren",             phonetic: "/treɪn/",          category: "travel",   example: "The train leaves at six.",          level: "A1" },
  { id: "t4",  front: "Airport",    back: "Havalimanı",       phonetic: "/ˈeəpɔːt/",        category: "travel",   example: "We arrived at the airport early.",  level: "A2" },
  { id: "t5",  front: "Hotel",      back: "Otel",             phonetic: "/həʊˈtel/",        category: "travel",   example: "We stayed at a small hotel.",       level: "A2" },

  // ── Emotions & Feelings (A1) ───────────────────────────────────────────
  { id: "e1",  front: "Happy",      back: "Mutlu",            phonetic: "/ˈhæpi/",          category: "emotions", example: "I am happy today.",                 level: "A1" },
  { id: "e2",  front: "Sad",        back: "Üzgün",            phonetic: "/sæd/",            category: "emotions", example: "He looks sad.",                     level: "A1" },
  { id: "e3",  front: "Angry",      back: "Kızgın",           phonetic: "/ˈæŋɡri/",         category: "emotions", example: "Don't be angry.",                   level: "A1" },
  { id: "e4",  front: "Tired",      back: "Yorgun",           phonetic: "/ˈtaɪəd/",         category: "emotions", example: "I am very tired.",                  level: "A1" },
  { id: "e5",  front: "Hungry",     back: "Aç",               phonetic: "/ˈhʌŋɡri/",        category: "emotions", example: "I'm hungry. Let's eat.",            level: "A1" },

  // ── Social & Greetings (A1) ────────────────────────────────────────────
  { id: "s1",  front: "Hello",      back: "Merhaba",          phonetic: "/həˈləʊ/",         category: "social",   example: "Hello! How are you?",               level: "A1" },
  { id: "s2",  front: "Thank you",  back: "Teşekkür ederim",  phonetic: "/θæŋk juː/",       category: "social",   example: "Thank you for your help.",          level: "A1" },
  { id: "s3",  front: "Sorry",      back: "Özür dilerim",     phonetic: "/ˈsɒri/",          category: "social",   example: "Sorry, I'm late.",                  level: "A1" },
  { id: "s4",  front: "Please",     back: "Lütfen",           phonetic: "/pliːz/",          category: "social",   example: "Please sit down.",                  level: "A1" },
  { id: "s5",  front: "Goodbye",    back: "Hoşça kal",        phonetic: "/ɡʊdˈbaɪ/",        category: "social",   example: "Goodbye! See you tomorrow.",        level: "A1" },

  // ── Hobbies (A1-A2) ───────────────────────────────────────────────────
  { id: "h1",  front: "Football",   back: "Futbol",           phonetic: "/ˈfʊtbɔːl/",       category: "hobbies",  example: "We play football on weekends.",     level: "A1" },
  { id: "h2",  front: "Music",      back: "Müzik",            phonetic: "/ˈmjuːzɪk/",       category: "hobbies",  example: "I love listening to music.",        level: "A1" },
  { id: "h3",  front: "Movie",      back: "Film",             phonetic: "/ˈmuːvi/",         category: "hobbies",  example: "Let's watch a movie tonight.",      level: "A1" },
  { id: "h4",  front: "Book",       back: "Kitap",            phonetic: "/bʊk/",            category: "hobbies",  example: "I'm reading a good book.",          level: "A1" },
  { id: "h5",  front: "Dance",      back: "Dans etmek",       phonetic: "/dɑːns/",          category: "hobbies",  example: "They like to dance.",               level: "A1" },

  ...FLASHCARDS_EXTENDED,
];

export const FLASHCARD_CATEGORY_LABELS: Record<string, string> = {
  daily: "Daily Life",
  food: "Food & Drink",
  people: "People",
  travel: "Travel",
  emotions: "Feelings",
  social: "Social Life",
  hobbies: "Hobbies",
  body: "Body & Health",
  colors: "Colors",
  clothes: "Clothes",
  weather: "Weather",
  work: "Work & Career",
  technology: "Technology",
  health: "Health",
  environment: "Environment",
  business: "Business",
  academic: "Academic",
};
