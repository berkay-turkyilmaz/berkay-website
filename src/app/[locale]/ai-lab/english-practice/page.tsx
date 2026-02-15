"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js modüllerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- TİP TANIMLAMALARI (TypeScript için) ---
type Flashcard = { front: string; back: string; pronunciation: string };
type GrammarRule = { unit: string; icon: string; color: string; rules: string[]; examples: string[] };
type PrepositionExercise = { sentence: string; options: string[]; correct: number; explanation: string };
type Question = { id: number; unit: string; topic: string; type: string; question: string; options: string[]; correct: number; explanation: string; hint: string };
type UserData = {
  level: number;
  xp: number;
  xpTarget: number;
  streak: number;
  lastStudyDate: string | null;
  totalExams: number;
  totalQuestions: number;
  correctAnswers: number;
  achievements: string[];
  stats: { flashcardsViewed: number; prepPracticed: number };
};
type Settings = {
  voiceAccent: string;
  speechSpeed: number;
  autoSpeak: boolean;
  showHints: boolean;
  darkMode: boolean;
};

// --- VERİ SETLERİ ---
const FLASHCARD_DATA: Record<string, Flashcard[]> = {
  family: [
    { front: "Mother", back: "Anne", pronunciation: "/ˈmʌðə(r)/" },
    { front: "Father", back: "Baba", pronunciation: "/ˈfɑːðə(r)/" },
    { front: "Sister", back: "Kız kardeş", pronunciation: "/ˈsɪstə(r)/" },
    { front: "Brother", back: "Erkek kardeş", pronunciation: "/ˈbrʌðə(r)/" },
    { front: "Aunt", back: "Teyze/Hala", pronunciation: "/ɑːnt/" },
    { front: "Uncle", back: "Amca/Dayı", pronunciation: "/ˈʌŋkl/" },
    { front: "Cousin", back: "Kuzen", pronunciation: "/ˈkʌzn/" },
    { front: "Grandmother", back: "Büyükanne", pronunciation: "/ˈɡrænmʌðə(r)/" },
    { front: "Grandfather", back: "Büyükbaba", pronunciation: "/ˈɡrænfɑːðə(r)/" },
    { front: "Parents", back: "Ebeveynler", pronunciation: "/ˈpeərənts/" },
    { front: "Children", back: "Çocuklar", pronunciation: "/ˈtʃɪldrən/" },
    { front: "Son", back: "Oğul", pronunciation: "/sʌn/" },
    { front: "Daughter", back: "Kız evlat", pronunciation: "/ˈdɔːtə(r)/" },
  ],
  food: [
    { front: "Bread", back: "Ekmek", pronunciation: "/bred/" },
    { front: "Water", back: "Su", pronunciation: "/ˈwɔːtə(r)/" },
    { front: "Coffee", back: "Kahve", pronunciation: "/ˈkɒfi/" },
    { front: "Tea", back: "Çay", pronunciation: "/tiː/" },
    { front: "Milk", back: "Süt", pronunciation: "/mɪlk/" },
    { front: "Apple", back: "Elma", pronunciation: "/ˈæpl/" },
    { front: "Banana", back: "Muz", pronunciation: "/bəˈnɑːnə/" },
    { front: "Orange", back: "Portakal", pronunciation: "/ˈɒrɪndʒ/" },
    { front: "Egg", back: "Yumurta", pronunciation: "/eɡ/" },
    { front: "Cheese", back: "Peynir", pronunciation: "/tʃiːz/" },
    { front: "Butter", back: "Tereyağı", pronunciation: "/ˈbʌtə(r)/" },
    { front: "Rice", back: "Pirinç", pronunciation: "/raɪs/" },
    { front: "Pasta", back: "Makarna", pronunciation: "/ˈpæstə/" },
    { front: "Chicken", back: "Tavuk", pronunciation: "/ˈtʃɪkɪn/" },
    { front: "Fish", back: "Balık", pronunciation: "/fɪʃ/" },
    { front: "Meat", back: "Et", pronunciation: "/miːt/" },
    { front: "Vegetables", back: "Sebzeler", pronunciation: "/ˈvedʒtəblz/" },
    { front: "Fruit", back: "Meyve", pronunciation: "/fruːt/" },
    { front: "Juice", back: "Meyve suyu", pronunciation: "/dʒuːs/" },
    { front: "Soup", back: "Çorba", pronunciation: "/suːp/" },
  ],
  daily: [
    { front: "Wake up", back: "Uyanmak", pronunciation: "/weɪk ʌp/" },
    { front: "Get up", back: "Kalkmak", pronunciation: "/ɡet ʌp/" },
    { front: "Brush teeth", back: "Diş fırçalamak", pronunciation: "/brʌʃ tiːθ/" },
    { front: "Have breakfast", back: "Kahvaltı yapmak", pronunciation: "/hæv ˈbrekfəst/" },
    { front: "Go to work", back: "İşe gitmek", pronunciation: "/ɡəʊ tə wɜːk/" },
    { front: "Have lunch", back: "Öğle yemeği yemek", pronunciation: "/hæv lʌntʃ/" },
    { front: "Go home", back: "Eve gitmek", pronunciation: "/ɡəʊ həʊm/" },
    { front: "Watch TV", back: "TV izlemek", pronunciation: "/wɒtʃ tiːˈviː/" },
    { front: "Do homework", back: "Ödev yapmak", pronunciation: "/duː ˈhəʊmwɜːk/" },
    { front: "Go to bed", back: "Yatmak", pronunciation: "/ɡəʊ tə bed/" },
    { front: "Take a shower", back: "Duş almak", pronunciation: "/teɪk ə ˈʃaʊə(r)/" },
    { front: "Get dressed", back: "Giyinmek", pronunciation: "/ɡet drest/" },
    { front: "Have dinner", back: "Akşam yemeği yemek", pronunciation: "/hæv ˈdɪnə(r)/" },
  ],
  adjectives: [
    { front: "Big", back: "Büyük", pronunciation: "/bɪɡ/" },
    { front: "Small", back: "Küçük", pronunciation: "/smɔːl/" },
    { front: "Happy", back: "Mutlu", pronunciation: "/ˈhæpi/" },
    { front: "Sad", back: "Üzgün", pronunciation: "/sæd/" },
    { front: "Hot", back: "Sıcak", pronunciation: "/hɒt/" },
    { front: "Cold", back: "Soğuk", pronunciation: "/kəʊld/" },
    { front: "Good", back: "İyi", pronunciation: "/ɡʊd/" },
    { front: "Bad", back: "Kötü", pronunciation: "/bæd/" },
    { front: "Beautiful", back: "Güzel", pronunciation: "/ˈbjuːtɪfl/" },
    { front: "Ugly", back: "Çirkin", pronunciation: "/ˈʌɡli/" },
    { front: "Old", back: "Yaşlı/Eski", pronunciation: "/əʊld/" },
    { front: "Young", back: "Genç", pronunciation: "/jʌŋ/" },
    { front: "New", back: "Yeni", pronunciation: "/njuː/" },
    { front: "Expensive", back: "Pahalı", pronunciation: "/ɪkˈspensɪv/" },
    { front: "Cheap", back: "Ucuz", pronunciation: "/tʃiːp/" },
    { front: "Fast", back: "Hızlı", pronunciation: "/fɑːst/" },
    { front: "Slow", back: "Yavaş", pronunciation: "/sləʊ/" },
    { front: "Easy", back: "Kolay", pronunciation: "/ˈiːzi/" },
    { front: "Difficult", back: "Zor", pronunciation: "/ˈdɪfɪkəlt/" },
    { front: "Interesting", back: "İlginç", pronunciation: "/ˈɪntrəstɪŋ/" },
    { front: "Boring", back: "Sıkıcı", pronunciation: "/ˈbɔːrɪŋ/" },
  ],
  verbs: [
    { front: "Go", back: "Gitmek", pronunciation: "/ɡəʊ/" },
    { front: "Come", back: "Gelmek", pronunciation: "/kʌm/" },
    { front: "See", back: "Görmek", pronunciation: "/siː/" },
    { front: "Eat", back: "Yemek", pronunciation: "/iːt/" },
    { front: "Drink", back: "İçmek", pronunciation: "/drɪŋk/" },
    { front: "Sleep", back: "Uyumak", pronunciation: "/sliːp/" },
    { front: "Work", back: "Çalışmak", pronunciation: "/wɜːk/" },
    { front: "Study", back: "Ders çalışmak", pronunciation: "/ˈstʌdi/" },
    { front: "Read", back: "Okumak", pronunciation: "/riːd/" },
    { front: "Write", back: "Yazmak", pronunciation: "/raɪt/" },
    { front: "Listen", back: "Dinlemek", pronunciation: "/ˈlɪsn/" },
    { front: "Speak", back: "Konuşmak", pronunciation: "/spiːk/" },
    { front: "Play", back: "Oynamak", pronunciation: "/pleɪ/" },
    { front: "Buy", back: "Satın almak", pronunciation: "/baɪ/" },
    { front: "Sell", back: "Satmak", pronunciation: "/sel/" },
    { front: "Open", back: "Açmak", pronunciation: "/ˈəʊpən/" },
    { front: "Close", back: "Kapatmak", pronunciation: "/kləʊz/" },
    { front: "Start", back: "Başlamak", pronunciation: "/stɑːt/" },
    { front: "Finish", back: "Bitirmek", pronunciation: "/ˈfɪnɪʃ/" },
    { front: "Help", back: "Yardım etmek", pronunciation: "/help/" },
  ],
  places: [
    { front: "School", back: "Okul", pronunciation: "/skuːl/" },
    { front: "Hospital", back: "Hastane", pronunciation: "/ˈhɒspɪtl/" },
    { front: "Bank", back: "Banka", pronunciation: "/bæŋk/" },
    { front: "Restaurant", back: "Restoran", pronunciation: "/ˈrestrɒnt/" },
    { front: "Hotel", back: "Otel", pronunciation: "/həʊˈtel/" },
    { front: "Airport", back: "Havalimanı", pronunciation: "/ˈeəpɔːt/" },
    { front: "Station", back: "İstasyon", pronunciation: "/ˈsteɪʃn/" },
    { front: "Museum", back: "Müze", pronunciation: "/mjuˈziːəm/" },
    { front: "Library", back: "Kütüphane", pronunciation: "/ˈlaɪbrəri/" },
    { front: "Park", back: "Park", pronunciation: "/pɑːk/" },
    { front: "Cinema", back: "Sinema", pronunciation: "/ˈsɪnəmə/" },
    { front: "Shop", back: "Mağaza", pronunciation: "/ʃɒp/" },
    { front: "Supermarket", back: "Süpermarket", pronunciation: "/ˈsuːpəmɑːkɪt/" },
    { front: "Pharmacy", back: "Eczane", pronunciation: "/ˈfɑːməsi/" },
    { front: "Post office", back: "Postane", pronunciation: "/ˈpəʊst ɒfɪs/" },
  ]
};

const GRAMMAR_RULES: GrammarRule[] = [
  {
    unit: "Unit 1-2: To Be",
    icon: "📍",
    color: "blue",
    rules: [
      "✓ I am, You are, He/She/It is, We/You/They are",
      "✓ Negative: am not, isn't, aren't",
      "✓ Question: Am I? Is he? Are they?",
      "✓ Kullanım: İsim, meslek, yaş, yer bildirmek için"
    ],
    examples: ["I am a student.", "She isn't a teacher.", "Are you from Turkey?"]
  },
  {
    unit: "Unit 3-4: Present Simple",
    icon: "🔄",
    color: "green",
    rules: [
      "✓ Alışkanlıklar ve genel gerçekler",
      "✓ I/You/We/They + verb (go, work, like)",
      "✓ He/She/It + verb+s/es (goes, works, likes)",
      "✓ Negative: don't/doesn't + verb",
      "✓ Question: Do/Does + subject + verb?"
    ],
    examples: ["I work every day.", "She doesn't like coffee.", "Do you speak English?"]
  },
  {
    unit: "Unit 5: There is/are",
    icon: "🏠",
    color: "purple",
    rules: [
      "✓ Bir yerde bir şeyin varlığı",
      "✓ There is + tekil (a book, an apple)",
      "✓ There are + çoğul (books, apples)",
      "✓ Question: Is there? / Are there?",
      "✓ Short answer: Yes, there is. / No, there aren't."
    ],
    examples: ["There is a cat.", "There are two dogs.", "Is there a bank near here?"]
  },
  {
    unit: "Unit 6: Can/Can't",
    icon: "💪",
    color: "orange",
    rules: [
      "✓ Yetenek, izin, olasılık",
      "✓ can + verb (yalın hali)",
      "✓ can't = cannot (olumsuz)",
      "✓ Can you...? (soru)",
      "✓ Could: geçmiş yetenek veya kibar istek"
    ],
    examples: ["I can swim.", "She can't drive.", "Can you help me?"]
  },
  {
    unit: "Unit 7-8: Present Continuous",
    icon: "⏳",
    color: "pink",
    rules: [
      "✓ Şu anda devam eden eylemler",
      "✓ am/is/are + verb-ing",
      "✓ Zaman belirteçleri: now, at the moment, right now",
      "✓ Negative: am not/isn't/aren't + verb-ing",
      "✓ Question: Am/Is/Are + subject + verb-ing?"
    ],
    examples: ["I am studying now.", "She isn't working.", "Are you listening?"]
  },
  {
    unit: "Unit 9-10: Past Simple",
    icon: "📅",
    color: "red",
    rules: [
      "✓ Geçmişte biten eylemler",
      "✓ Regular verbs: verb + -ed (worked, played)",
      "✓ Irregular verbs: özel formlar (went, ate, saw)",
      "✓ Negative: didn't + verb (yalın hali)",
      "✓ Question: Did + subject + verb?",
      "✓ Zaman: yesterday, last week, ago, in 2020"
    ],
    examples: ["I worked yesterday.", "She didn't go.", "Did you see him?"]
  },
  {
    unit: "Unit 11: Comparatives & Superlatives",
    icon: "📊",
    color: "yellow",
    rules: [
      "✓ Comparative: -er / more... than",
      "✓ Kısa sıfatlar: tall → taller",
      "✓ Uzun sıfatlar: interesting → more interesting",
      "✓ Superlative: the -est / the most...",
      "✓ Düzensiz: good→better→best, bad→worse→worst"
    ],
    examples: ["She is taller than me.", "This is the most expensive car."]
  },
  {
    unit: "Unit 12: Prepositions (in, on, at)",
    icon: "📍",
    color: "indigo",
    rules: [
      "✓ AT: Saatler (at 7 o'clock), yerler (at home, at school)",
      "✓ ON: Günler (on Monday), tarihler (on July 4th), yüzeyler (on the table)",
      "✓ IN: Aylar (in July), yıllar (in 2024), şehirler (in London)",
      "✓ Özel: in the morning, at night, on the weekend"
    ],
    examples: ["I wake up at 6 AM.", "My birthday is on May 15th.", "She lives in Istanbul."]
  },
  {
    unit: "Unit 13-14: Going to (Future)",
    icon: "🔮",
    color: "teal",
    rules: [
      "✓ Planlar ve niyetler",
      "✓ am/is/are + going to + verb",
      "✓ Kanıta dayalı gelecek tahminleri",
      "✓ Negative: am not/isn't/aren't + going to",
      "✓ Question: Am/Is/Are + subject + going to?"
    ],
    examples: ["I'm going to visit Paris.", "It's going to rain.", "Are you going to study?"]
  }
];

const PREPOSITION_EXERCISES: PrepositionExercise[] = [
  { sentence: "I get up ___ 7 o'clock every morning.", options: ["in", "on", "at", "to"], correct: 2, explanation: "Saatlerle 'at' kullanılır." },
  { sentence: "My birthday is ___ July.", options: ["in", "on", "at", "to"], correct: 0, explanation: "Aylarla 'in' kullanılır." },
  { sentence: "She was born ___ 1995.", options: ["in", "on", "at", "to"], correct: 0, explanation: "Yıllarla 'in' kullanılır." },
  { sentence: "We have a meeting ___ Monday.", options: ["in", "on", "at", "to"], correct: 1, explanation: "Günlerle 'on' kullanılır." },
  { sentence: "I don't work ___ the weekend.", options: ["in", "on", "at", "to"], correct: 2, explanation: "'At the weekend' (BE) sabit ifade." },
  { sentence: "The book is ___ the table.", options: ["in", "on", "at", "to"], correct: 1, explanation: "Yüzey üzerinde 'on' kullanılır." },
  { sentence: "I live ___ Istanbul.", options: ["in", "on", "at", "to"], correct: 0, explanation: "Şehirlerle 'in' kullanılır." },
  { sentence: "She's waiting ___ the bus stop.", options: ["in", "on", "at", "to"], correct: 2, explanation: "Belirli noktada 'at' kullanılır." },
  { sentence: "I usually study ___ the evening.", options: ["in", "on", "at", "to"], correct: 0, explanation: "'In the evening' sabit ifade." },
  { sentence: "Let's meet ___ 3:30 PM.", options: ["in", "on", "at", "to"], correct: 2, explanation: "Saatlerle 'at' kullanılır." },
  { sentence: "I'm going ___ school now.", options: ["in", "on", "at", "to"], correct: 3, explanation: "Hareket yönü için 'to' kullanılır." },
  { sentence: "He works ___ a hospital.", options: ["in", "on", "at", "for"], correct: 0, explanation: "Bina içinde 'in' kullanılır." },
  { sentence: "The movie starts ___ midnight.", options: ["in", "on", "at", "to"], correct: 2, explanation: "Gece yarısı = at midnight (sabit ifade)." },
  { sentence: "I'll see you ___ Christmas.", options: ["in", "on", "at", "to"], correct: 2, explanation: "Bayramlarla 'at' kullanılır (at Christmas, at Easter)." },
  { sentence: "She arrived ___ London yesterday.", options: ["in", "on", "at", "to"], correct: 0, explanation: "Ulaşma + şehir = in London." },
];

const QUESTION_BANK: Question[] = [
  {id: 1, unit: "Unit 1-2", topic: "To Be", type: "multiple", question: "My name _____ John.", options: ["is", "are", "am", "be"], correct: 0, explanation: "'My name' tekil → is.", hint: "Tekil özne hangi formu alır?"},
  {id: 2, unit: "Unit 1-2", topic: "To Be", type: "multiple", question: "_____ your sister a teacher?", options: ["Is", "Are", "Am", "Be"], correct: 0, explanation: "'Your sister' (she) → Is.", hint: "She/he/it ile hangi form?"},
  {id: 3, unit: "Unit 1-2", topic: "To Be", type: "multiple", question: "We _____ from Spain.", options: ["isn't", "aren't", "am not", "not"], correct: 1, explanation: "'We' çoğul → aren't.", hint: "We/you/they ile olumsuz"},
  {id: 4, unit: "Unit 3-4", topic: "Present Simple", type: "multiple", question: "She _____ to work by bus.", options: ["go", "goes", "going", "is going"], correct: 1, explanation: "She/He/It + verb+s → goes.", hint: "Tekil 3. şahıs ekini unutma"},
  {id: 5, unit: "Unit 3-4", topic: "Present Simple", type: "multiple", question: "I _____ coffee.", options: ["don't drink", "doesn't drink", "am not drink", "not drink"], correct: 0, explanation: "I/You/We/They → don't + verb.", hint: "I ile olumsuz yapı"},
  {id: 6, unit: "Unit 5", topic: "There is/are", type: "multiple", question: "_____ a library near here?", options: ["There is", "Is there", "There are", "Are there"], correct: 1, explanation: "Soru: Is there + tekil?", hint: "Soru yapısında yer değiştirme"},
  {id: 7, unit: "Unit 6", topic: "Can", type: "multiple", question: "I _____ swim very well.", options: ["can", "could", "can't", "am"], correct: 0, explanation: "Yetenek: can + verb.", hint: "Şimdiki yetenek"},
  {id: 8, unit: "Unit 7-8", topic: "Present Continuous", type: "multiple", question: "She _____ a book now.", options: ["reads", "is reading", "read", "reading"], correct: 1, explanation: "Şu anda: am/is/are + verb-ing.", hint: "'now' şimdiki zaman işareti"},
  {id: 9, unit: "Unit 9-10", topic: "Past Simple", type: "multiple", question: "I _____ homework yesterday.", options: ["finish", "finished", "finishing", "finishes"], correct: 1, explanation: "Geçmiş: verb + -ed.", hint: "Yesterday = dün"},
  {id: 10, unit: "Unit 11", topic: "Comparatives", type: "multiple", question: "This is _____ than that.", options: ["interesting", "more interesting", "most interesting", "interestinger"], correct: 1, explanation: "Uzun sıfat: more + adj + than.", hint: "2+ hece için 'more'"},
  {id: 11, unit: "Unit 12", topic: "Prepositions", type: "multiple", question: "I wake up ___ 6 AM.", options: ["in", "on", "at", "to"], correct: 2, explanation: "Saatlerle 'at'.", hint: "Saat için hangi edat?"},
  {id: 12, unit: "Unit 13-14", topic: "Going to", type: "multiple", question: "I _____ visit London.", options: ["will", "am going to", "going to", "go"], correct: 1, explanation: "Plan: be going to + verb.", hint: "Gelecek plan ifadesi"},
  {id: 13, unit: "Vocabulary", topic: "Family", type: "multiple", question: "My mother's sister is my _____.", options: ["aunt", "uncle", "cousin", "niece"], correct: 0, explanation: "Anne'nin kız kardeşi = aunt.", hint: "Kadın akraba"},
  {id: 14, unit: "Vocabulary", topic: "Daily Routines", type: "multiple", question: "I _____ my teeth before bed.", options: ["wash", "brush", "clean", "make"], correct: 1, explanation: "'Brush your teeth' sabit ifade.", hint: "Diş için özel fiil"},
  {id: 15, unit: "Unit 3-4", topic: "Present Simple", type: "multiple", question: "_____ your brother play football?", options: ["Do", "Does", "Is", "Are"], correct: 1, explanation: "He/she/it → Does + verb?", hint: "Tekil 3. şahıs sorusu"},
  {id: 16, unit: "Unit 7-8", topic: "Present Continuous", type: "multiple", question: "What _____ you _____ now?", options: ["do / do", "are / doing", "do / doing", "are / do"], correct: 1, explanation: "Soru: What are you doing?", hint: "Şu anki eylem sorusu"},
  {id: 17, unit: "Unit 9-10", topic: "Past Simple", type: "multiple", question: "We _____ to Paris last year.", options: ["go", "went", "going", "goes"], correct: 1, explanation: "Go → went (düzensiz).", hint: "Go fiilinin 2. hali"},
  {id: 18, unit: "Unit 11", topic: "Superlatives", type: "multiple", question: "This is _____ book.", options: ["good", "better", "the best", "best"], correct: 2, explanation: "Superlative: the best.", hint: "En iyi = the..."},
  {id: 19, unit: "Vocabulary", topic: "Adjectives", type: "multiple", question: "Opposite of 'hot':", options: ["warm", "cool", "cold", "freezing"], correct: 2, explanation: "Hot ↔ Cold.", hint: "Sıcağın tam zıttı"},
  {id: 20, unit: "Unit 12", topic: "Prepositions", type: "multiple", question: "My birthday is ___ July.", options: ["in", "on", "at", "to"], correct: 0, explanation: "Aylar için 'in'.", hint: "Ay isimleri için"},
  {id: 21, unit: "Unit 6", topic: "Can", type: "multiple", question: "_____ you help me?", options: ["Can", "Do", "Are", "Is"], correct: 0, explanation: "İstek: Can you...?", hint: "Yardım isteme"},
  {id: 22, unit: "Unit 9-10", topic: "Past Simple", type: "multiple", question: "She _____ go yesterday.", options: ["doesn't", "didn't", "wasn't", "isn't"], correct: 1, explanation: "Geçmiş olumsuz: didn't.", hint: "Did + not"},
  {id: 23, unit: "Vocabulary", topic: "Food", type: "multiple", question: "I'd like a ___ of bread.", options: ["slice", "piece", "loaf", "bar"], correct: 2, explanation: "A loaf of bread = somun.", hint: "Somun ekmek"},
  {id: 24, unit: "Unit 5", topic: "There is/are", type: "multiple", question: "_____ many students here.", options: ["There is", "There are", "There", "It is"], correct: 1, explanation: "Çoğul → There are.", hint: "Many = çoğul"},
  {id: 25, unit: "Unit 13-14", topic: "Going to", type: "multiple", question: "It _____ rain soon.", options: ["will", "is going to", "going to", "goes"], correct: 1, explanation: "Kanıta dayalı tahmin.", hint: "Bulutlara bakıyoruz"},
  {id: 26, unit: "Unit 3-4", topic: "Present Simple", type: "multiple", question: "Water _____ at 100°C.", options: ["boil", "boils", "boiling", "is boiling"], correct: 1, explanation: "Bilimsel gerçek + it → boils.", hint: "Genel gerçek"},
  {id: 27, unit: "Unit 7-8", topic: "Present Continuous", type: "multiple", question: "Be quiet! The baby _____.", options: ["sleeps", "is sleeping", "sleep", "sleeping"], correct: 1, explanation: "Şu anda uyuyor.", hint: "Şimdiki durum"},
  {id: 28, unit: "Vocabulary", topic: "Verbs", type: "multiple", question: "Opposite of 'buy':", options: ["sell", "purchase", "get", "take"], correct: 0, explanation: "Buy ↔ Sell.", hint: "Satın alma ↔ Satma"},
  {id: 29, unit: "Unit 12", topic: "Prepositions", type: "multiple", question: "The book is ___ the table.", options: ["in", "on", "at", "to"], correct: 1, explanation: "Yüzey üzerinde: on.", hint: "Masa üstü"},
  {id: 30, unit: "Unit 11", topic: "Comparatives", type: "multiple", question: "My car is _____ than yours.", options: ["fast", "faster", "fastest", "more fast"], correct: 1, explanation: "Kısa sıfat: -er.", hint: "1 heceli sıfat"},
];

const DEFAULT_USER_DATA: UserData = {
  level: 1,
  xp: 0,
  xpTarget: 100,
  streak: 0,
  lastStudyDate: null,
  totalExams: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  achievements: [],
  stats: { flashcardsViewed: 0, prepPracticed: 0 }
};

const DEFAULT_SETTINGS: Settings = {
  voiceAccent: 'en-GB',
  speechSpeed: 1.0,
  autoSpeak: false,
  showHints: true,
  darkMode: false
};

// --- ANA COMPONENT ---
export default function EnglishPathLab() {
  // --- STATE TANIMLAMALARI ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [wrongAnswers, setWrongAnswers] = useState<Record<number, { count: number; lastSeen: number }>>({});
  const [examHistory, setExamHistory] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Flashcards States
  const [flashcardCategory, setFlashcardCategory] = useState('all');
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Prepositions States
  const [prepScore, setPrepScore] = useState({ correct: 0, total: 0 });
  const [answeredPreps, setAnsweredPreps] = useState<Set<number>>(new Set());
  const [prepFeedback, setPrepFeedback] = useState<Record<number, { correct: boolean; message: string }>>({});

  // Exam States
  const [examActive, setExamActive] = useState(false);
  const [currentExam, setCurrentExam] = useState<{ questions: Question[]; answers: Record<number, number>; startTime: number | null }>({ questions: [], answers: {}, startTime: null });
  const [examTimer, setExamTimer] = useState('00:00');
  const [examResults, setExamResults] = useState<any>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('englishpath');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserData(data.userData || DEFAULT_USER_DATA);
        setWrongAnswers(data.wrongAnswers || {});
        setExamHistory(data.examHistory || []);
        setSettings(data.settings || DEFAULT_SETTINGS);
        if (data.settings?.darkMode) document.documentElement.classList.add('dark');
      } catch (e) {
        console.error('Error loading state:', e);
      }
    } else {
        // İlk açılışta dark mode kontrolü (opsiyonel)
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setSettings(prev => ({...prev, darkMode: true}));
            document.documentElement.classList.add('dark');
        }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    const data = { userData, wrongAnswers, examHistory, settings };
    localStorage.setItem('englishpath', JSON.stringify(data));
  }, [userData, wrongAnswers, examHistory, settings]);

  // --- HELPER FUNCTIONS ---
  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addXP = (amount: number) => {
    setUserData(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newTarget = prev.xpTarget;
      
      while (newXP >= newTarget) {
        newXP -= newTarget;
        newLevel++;
        newTarget = Math.floor(newTarget * 1.5);
        showNotif(`🎉 Level Up! Level ${newLevel}`);
      }
      
      return { ...prev, xp: newXP, level: newLevel, xpTarget: newTarget };
    });
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === settings.voiceAccent) || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;
    utterance.rate = settings.speechSpeed;
    window.speechSynthesis.speak(utterance);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    setUserData(prev => {
        if (prev.lastStudyDate === today) return prev;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak = prev.streak;
        if (prev.lastStudyDate === yesterday.toDateString()) {
            newStreak++;
        } else {
            newStreak = 1;
        }
        return { ...prev, streak: newStreak, lastStudyDate: today };
    });
  };

  // --- FLASHCARD LOGIC ---
  const getFilteredFlashcards = () => {
    if (flashcardCategory === 'all') {
      return Object.values(FLASHCARD_DATA).flat();
    }
    return FLASHCARD_DATA[flashcardCategory] || [];
  };

  const handleFlipCard = (index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
    setUserData(prev => ({
      ...prev,
      stats: { ...prev.stats, flashcardsViewed: prev.stats.flashcardsViewed + 1 }
    }));
  };

  // --- PREPOSITIONS LOGIC ---
  const checkPreposition = (exIdx: number, optIdx: number) => {
    if (answeredPreps.has(exIdx)) return;

    const ex = PREPOSITION_EXERCISES[exIdx];
    const isCorrect = optIdx === ex.correct;

    setAnsweredPreps(prev => new Set(prev).add(exIdx));
    setPrepScore(prev => ({ ...prev, total: prev.total + 1, correct: isCorrect ? prev.correct + 1 : prev.correct }));
    setPrepFeedback(prev => ({
      ...prev,
      [exIdx]: {
        correct: isCorrect,
        message: isCorrect ? `✅ Doğru! ${ex.explanation}` : `❌ Yanlış. Doğru: ${ex.options[ex.correct]}. ${ex.explanation}`
      }
    }));

    if (isCorrect) addXP(5);
    setUserData(prev => ({
      ...prev,
      stats: { ...prev.stats, prepPracticed: prev.stats.prepPracticed + 1 }
    }));
  };

  const resetPrepositions = () => {
    setPrepScore({ correct: 0, total: 0 });
    setAnsweredPreps(new Set());
    setPrepFeedback({});
  };

  // --- EXAM LOGIC ---
  const startExam = () => {
    const wrongIds = Object.keys(wrongAnswers).map(Number);
    const wrongCount = Math.min(Math.floor(wrongIds.length * 0.3), 9);
    
    let selected: Question[] = [];
    if (wrongIds.length > 0) {
        const shuffledWrong = wrongIds.sort(() => 0.5 - Math.random()).slice(0, wrongCount);
        shuffledWrong.forEach(id => {
            const q = QUESTION_BANK.find(q => q.id === id);
            if (q) selected.push(q);
        });
    }

    const remaining = 30 - selected.length;
    const available = QUESTION_BANK.filter(q => !selected.includes(q));
    selected.push(...available.sort(() => 0.5 - Math.random()).slice(0, remaining));

    setCurrentExam({
        questions: selected.slice(0, 30),
        answers: {},
        startTime: Date.now()
    });
    setExamActive(true);
    setExamResults(null);
    setActiveTab('exam');
    
    // Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
        if (currentExam.startTime) {
             const elapsed = Math.floor((Date.now() - currentExam.startTime) / 1000);
             // currentExam.startTime state içinde güncellenmediği için burada Date.now() farkı alıyoruz ama 
             // startExam içinde set ettiğimiz için state'in oturmasını beklememiz lazım.
             // Basit çözüm: timer state'ini güncellemek.
             // Ancak closure sorunu yaşamamak için functional update kullanalım veya startTime'ı ref yapalım.
             // Burada basitleştirilmiş bir timer görseli yapalım:
             setExamTimer(prev => {
                 // Gerçek süreyi hesaplamak daha sağlıklı ama UI için basit artış:
                 // (Not: Bu basit artış, duraklatma/resume yoksa çalışır)
                 // Daha doğru yöntem start time'ı ref'e atmaktır.
                 return prev; 
             });
        }
    }, 1000);
  };
  
  // Timer Effect
  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (examActive && currentExam.startTime) {
          const start = currentExam.startTime;
          interval = setInterval(() => {
              const elapsed = Math.floor((Date.now() - start) / 1000);
              const minutes = Math.floor(elapsed / 60);
              const seconds = elapsed % 60;
              setExamTimer(`⏱️ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [examActive, currentExam.startTime]);

  const submitExam = () => {
    setExamActive(false);
    if (currentExam.startTime === null) return;

    const results = {
        questions: [] as any[],
        correct: 0,
        total: currentExam.questions.length,
        timeSpent: Math.floor((Date.now() - currentExam.startTime) / 1000),
        units: {} as Record<string, { correct: number; total: number }>,
        score: 0
    };

    currentExam.questions.forEach(q => {
        const userAnswer = currentExam.answers[q.id] ?? -1;
        const isCorrect = userAnswer === q.correct;

        if (isCorrect) {
            results.correct++;
            // Remove from wrong answers
            setWrongAnswers(prev => {
                const copy = { ...prev };
                delete copy[q.id];
                return copy;
            });
        } else {
            // Add to wrong answers
            setWrongAnswers(prev => ({
                ...prev,
                [q.id]: { count: (prev[q.id]?.count || 0) + 1, lastSeen: Date.now() }
            }));
        }

        results.questions.push({ ...q, userAnswer, isCorrect });

        if (!results.units[q.unit]) results.units[q.unit] = { correct: 0, total: 0 };
        results.units[q.unit].total++;
        if (isCorrect) results.units[q.unit].correct++;
    });

    results.score = parseFloat(((results.correct / results.total) * 100).toFixed(1));

    setExamResults(results);
    setExamHistory(prev => [...prev, {
        date: Date.now(),
        score: results.score,
        questions: results.questions.map(q => ({ id: q.id, topic: q.topic, isCorrect: q.isCorrect }))
    }]);

    setUserData(prev => ({
        ...prev,
        totalExams: prev.totalExams + 1,
        totalQuestions: prev.totalQuestions + results.total,
        correctAnswers: prev.correctAnswers + results.correct
    }));

    addXP(results.correct * 10);
    updateStreak();
    setActiveTab('results');
  };

  // --- RENDER HELPERS ---
  const achievementsList = [
      { id: 'first', name: '🎯 İlk Sınav', unlocked: userData.totalExams >= 1 },
      { id: 'streak3', name: '🔥 3 Gün', unlocked: userData.streak >= 3 },
      { id: 'exam5', name: '💪 5 Sınav', unlocked: userData.totalExams >= 5 },
      { id: 'level5', name: '⭐ Level 5', unlocked: userData.level >= 5 },
      { id: 'flash50', name: '🃏 50 Kart', unlocked: userData.stats.flashcardsViewed >= 50 },
      { id: 'prep20', name: '🎯 20 Edat', unlocked: userData.stats.prepPracticed >= 20 },
      { id: 'perfect', name: '💯 Mükemmel', unlocked: examHistory.some(e => e.score == 100) },
      { id: 'master', name: '👑 Usta', unlocked: userData.totalExams >= 20 }
  ];

  const getChartData = () => {
      const last10 = examHistory.slice(-10);
      return {
          labels: last10.map((_, i) => `Sınav ${i + 1}`),
          datasets: [{
              label: 'Başarı %',
              data: last10.map(e => e.score),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true
          }]
      };
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ${settings.darkMode ? 'dark' : ''} pb-20`}>
        
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            E
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">EnglishPath</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Your Journey to Fluency</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3">
                            {/* LEVEL */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md">
                                <span className="text-lg">⭐</span>
                                <span className="font-bold text-sm">{userData.level}</span>
                            </div>
                            
                            {/* XP BAR */}
                            <div className="flex flex-col gap-1 min-w-[100px]">
                                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                                    <span>{userData.xp}</span>
                                    <span>{userData.xpTarget}</span>
                                </div>
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-full transition-all duration-500" style={{ width: `${(userData.xp / userData.xpTarget) * 100}%` }}></div>
                                </div>
                            </div>

                            {/* STREAK */}
                            <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-md">
                                <span className="text-lg">🔥</span>
                                <span className="font-bold text-sm">{userData.streak}</span>
                            </div>
                        </div>

                        {/* SETTINGS BTN */}
                        <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>
        </header>

        {/* SETTINGS MODAL */}
        {showSettings && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">⚙️ Ayarlar</h2>
                        <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🎤 Aksan</label>
                            <select 
                                value={settings.voiceAccent} 
                                onChange={(e) => setSettings({...settings, voiceAccent: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="en-GB">🇬🇧 British</option>
                                <option value="en-US">🇺🇸 American</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold dark:text-white">🌙 Dark Mode</label>
                            <input 
                                type="checkbox" 
                                checked={settings.darkMode} 
                                onChange={(e) => {
                                    setSettings({...settings, darkMode: e.target.checked});
                                    if(e.target.checked) document.documentElement.classList.add('dark');
                                    else document.documentElement.classList.remove('dark');
                                }} 
                                className="w-5 h-5"
                            />
                        </div>

                        <button 
                            onClick={() => {
                                if(confirm('Sıfırlamak istediğine emin misin?')) {
                                    localStorage.removeItem('englishpath');
                                    window.location.reload();
                                }
                            }} 
                            className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
                        >
                            🗑️ Tüm İlerlemeyi Sıfırla
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* ACHIEVEMENT NOTIFICATION */}
        {notification && (
             <div className="fixed top-24 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl animate-bounce">
                {notification}
            </div>
        )}

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* TABS */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 p-2 border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex md:grid md:grid-cols-6 gap-2 min-w-max md:min-w-0">
                    {[
                        {id: 'dashboard', icon: '📊', label: 'Dashboard'},
                        {id: 'grammar', icon: '📖', label: 'Kurallar'},
                        {id: 'flashcards', icon: '🃏', label: 'Kelimeler'},
                        {id: 'prepositions', icon: '🎯', label: 'Preps'},
                        {id: 'exam', icon: '📝', label: 'Sınav'},
                        {id: 'results', icon: '🏆', label: 'Sonuçlar'},
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2.5 rounded-xl font-semibold transition text-sm flex items-center justify-center gap-2 ${
                                activeTab === tab.id 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
                <div className="animate-in fade-in duration-300">
                    <div className="grid lg:grid-cols-3 gap-6 mb-6">
                        {/* Stats Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <span className="text-2xl mr-2">📈</span> İstatistikler
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Toplam Sınav:</span>
                                    <span className="font-bold text-blue-600">{userData.totalExams}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Doğru:</span>
                                    <span className="font-bold text-green-600">{userData.correctAnswers}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Ortalama:</span>
                                    <span className="font-bold text-purple-600">
                                        {userData.totalQuestions > 0 ? ((userData.correctAnswers / userData.totalQuestions) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Card */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                <span className="text-2xl mr-2">📊</span> İlerleme Grafiği
                            </h3>
                            <div className="h-64">
                                {examHistory.length > 0 ? (
                                    <Line options={{ responsive: true, maintainAspectRatio: false }} data={getChartData()} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">Henüz sınav verisi yok</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        <button onClick={() => setActiveTab('grammar')} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-left">
                            <div className="text-3xl mb-2">📖</div>
                            <div className="font-bold">Grammar</div>
                        </button>
                        <button onClick={() => setActiveTab('flashcards')} className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-left">
                            <div className="text-3xl mb-2">🃏</div>
                            <div className="font-bold">Flashcards</div>
                        </button>
                        <button onClick={() => { setActiveTab('exam'); startExam(); }} className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-left">
                            <div className="text-3xl mb-2">🚀</div>
                            <div className="font-bold">Hızlı Sınav</div>
                        </button>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">🏅 Başarılar</h3>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {achievementsList.map(ach => (
                                <div key={ach.id} className={`text-center p-2 rounded-lg transition ${ach.unlocked ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 scale-105' : 'bg-gray-100 dark:bg-gray-700 opacity-50 grayscale'}`}>
                                    <div className="text-2xl mb-1">{ach.name.split(' ')[0]}</div>
                                    <div className="text-xs font-semibold">{ach.name.split(' ').slice(1).join(' ')}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* GRAMMAR TAB */}
            {activeTab === 'grammar' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="grid md:grid-cols-2 gap-4">
                        {GRAMMAR_RULES.map((rule, idx) => (
                             <div key={idx} className={`bg-white dark:bg-gray-800 border-l-4 border-${rule.color}-500 rounded-xl p-5 shadow-sm hover:shadow-md transition`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">{rule.icon}</span>
                                    <h3 className="font-bold text-gray-800 dark:text-white">{rule.unit}</h3>
                                </div>
                                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300 mb-3">
                                    {rule.rules.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                    <div className="text-xs font-semibold mb-1 opacity-70">Örnekler:</div>
                                    {rule.examples.map((ex, i) => <div key={i} className="text-xs text-gray-600 dark:text-gray-400">• {ex}</div>)}
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FLASHCARDS TAB */}
            {activeTab === 'flashcards' && (
                <div className="animate-in fade-in duration-300">
                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {['all', 'family', 'food', 'daily', 'adjectives', 'verbs', 'places'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFlashcardCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                                    flashcardCategory === cat 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getFilteredFlashcards().map((card, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleFlipCard(idx)}
                                className={`relative h-52 cursor-pointer perspective-1000 group`}
                            >
                                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-xl ${flippedCards[idx] ? 'rotate-y-180' : ''}`}>
                                    {/* Front */}
                                    <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 flex flex-col items-center justify-center">
                                        <div className="text-3xl font-bold mb-2">{card.front}</div>
                                        <div className="text-sm opacity-80">{card.pronunciation}</div>
                                        <div className="absolute bottom-4 text-xs opacity-50">Çevir</div>
                                    </div>
                                    {/* Back */}
                                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 flex flex-col items-center justify-center">
                                        <div className="text-3xl font-bold mb-4">{card.back}</div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); speakText(card.front); }}
                                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                            🔊 Dinle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PREPOSITIONS TAB */}
            {activeTab === 'prepositions' && (
                <div className="animate-in fade-in duration-300 space-y-4">
                    <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <div>
                            <span className="text-sm text-gray-500">Skor</span>
                            <div className="text-2xl font-bold text-blue-600">{prepScore.correct} / {prepScore.total}</div>
                        </div>
                        <button onClick={resetPrepositions} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Yenile</button>
                    </div>

                    {PREPOSITION_EXERCISES.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <p className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                                {ex.sentence.replace('___', '_____')}
                            </p>
                            <div className="grid grid-cols-4 gap-2 mb-4">
                                {ex.options.map((opt, optIdx) => {
                                    const isAnswered = answeredPreps.has(exIdx);
                                    let btnClass = "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600";
                                    
                                    if (isAnswered) {
                                        if (optIdx === ex.correct) btnClass = "bg-green-500 text-white";
                                        else if (prepFeedback[exIdx] && !prepFeedback[exIdx].correct && ex.options.indexOf(opt) === -1) btnClass = "bg-red-500 text-white"; // Logic simplification for rendering
                                    }

                                    return (
                                        <button 
                                            key={optIdx}
                                            disabled={isAnswered}
                                            onClick={() => checkPreposition(exIdx, optIdx)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${btnClass}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {answeredPreps.has(exIdx) && (
                                <div className={`text-sm ${prepFeedback[exIdx].correct ? 'text-green-600' : 'text-red-600'}`}>
                                    {prepFeedback[exIdx].message}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* EXAM TAB */}
            {activeTab === 'exam' && (
                <div className="animate-in fade-in duration-300">
                    {!examActive ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Sınava Hazır mısın?</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                                30 rastgele soru. Yanlış yaptıkların tekrar karşına çıkabilir. Hazırsan başlayalım!
                            </p>
                            <button 
                                onClick={startExam}
                                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-bold rounded-xl shadow-lg transition transform hover:scale-105"
                            >
                                🚀 Başla
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Exam Header */}
                            <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 z-40 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                    Soru: {Object.keys(currentExam.answers).length} / 30
                                </div>
                                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                    {examTimer}
                                </div>
                                <button 
                                    onClick={submitExam}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
                                >
                                    Bitir
                                </button>
                            </div>

                            {/* Questions */}
                            <div className="space-y-6">
                                {currentExam.questions.map((q, idx) => (
                                    <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">{q.unit}</span>
                                                    <div className="flex gap-2">
                                                         <button onClick={() => speakText(q.question)} className="text-gray-400 hover:text-blue-500">🔊</button>
                                                         {settings.showHints && q.hint && (
                                                             <button onClick={() => alert(q.hint)} className="text-gray-400 hover:text-yellow-500">💡</button>
                                                         )}
                                                    </div>
                                                </div>
                                                <p className="text-lg font-medium text-gray-800 dark:text-white mb-4">{q.question}</p>
                                                
                                                <div className="space-y-2">
                                                    {q.options.map((opt, optIdx) => (
                                                        <label key={optIdx} className={`block p-3 rounded-lg border-2 cursor-pointer transition ${
                                                            currentExam.answers[q.id] === optIdx 
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}>
                                                            <input 
                                                                type="radio" 
                                                                name={`q-${q.id}`} 
                                                                className="hidden"
                                                                checked={currentExam.answers[q.id] === optIdx}
                                                                onChange={() => setCurrentExam(prev => ({ ...prev, answers: { ...prev.answers, [q.id]: optIdx } }))}
                                                            />
                                                            <span className="font-bold mr-2 text-gray-500">{String.fromCharCode(65 + optIdx)})</span>
                                                            <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center pt-6">
                                <button 
                                    onClick={submitExam}
                                    className="px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl shadow-lg transition"
                                >
                                    ✅ Sınavı Tamamla
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* RESULTS TAB */}
            {activeTab === 'results' && (
                <div className="animate-in fade-in duration-300">
                    {examResults ? (
                        <div className="max-w-3xl mx-auto">
                            <div className={`text-center p-8 rounded-2xl text-white mb-8 shadow-xl bg-gradient-to-r ${
                                examResults.score >= 80 ? 'from-green-500 to-emerald-600' :
                                examResults.score >= 60 ? 'from-blue-500 to-cyan-600' :
                                'from-red-500 to-orange-600'
                            }`}>
                                <div className="text-6xl font-black mb-2">{examResults.score}%</div>
                                <div className="text-2xl font-bold opacity-90">
                                    {examResults.score >= 80 ? 'Mükemmel! 🎉' : examResults.score >= 60 ? 'Güzel İş! 👍' : 'Tekrar Etmelisin 📚'}
                                </div>
                                <div className="mt-4 text-lg bg-white/20 inline-block px-4 py-1 rounded-full">
                                    {examResults.correct} / {examResults.total} Doğru
                                </div>
                            </div>

                            <div className="space-y-4">
                                {examResults.questions.map((q: any, idx: number) => (
                                    <div key={idx} className={`bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 shadow-sm ${
                                        q.isCorrect ? 'border-green-500' : 'border-red-500'
                                    }`}>
                                        <div className="flex gap-4">
                                            <div className="text-2xl">{q.isCorrect ? '✅' : '❌'}</div>
                                            <div className="flex-1">
                                                <p className="font-bold text-gray-800 dark:text-white mb-2">{q.question}</p>
                                                {!q.isCorrect && (
                                                    <div className="mb-3 text-sm">
                                                        <div className="text-red-600">Senin Cevabın: {q.options[q.userAnswer] || 'Boş'}</div>
                                                        <div className="text-green-600">Doğru Cevap: {q.options[q.correct]}</div>
                                                    </div>
                                                )}
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                                    <strong>Açıklama:</strong> {q.explanation}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center mt-8">
                                <button 
                                    onClick={() => { setActiveTab('exam'); setExamActive(false); }}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                                >
                                    🔄 Yeni Sınav
                                </button>
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-20 text-gray-500">
                             <div className="text-6xl mb-4">📊</div>
                             <h2 className="text-2xl font-bold mb-4">Henüz Sonuç Yok</h2>
                             <button onClick={() => setActiveTab('exam')} className="text-blue-500 hover:underline">Sınava Git</button>
                         </div>
                    )}
                </div>
            )}

        </main>
    </div>
  );
}