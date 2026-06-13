import type { TabooCard, TabooDifficulty } from "../types";

/** Orta: birleşik kelimeler, yerler, fiiller. Zor: soyut / sosyal / iş kavramları. */
const MEDIUM_IDS = new Set([
  "f13", "f14", "f15",
  "h09", "h10",
  "pl04", "pl05", "pl06", "pl07", "pl08",
  "na01", "na02", "na03", "na04", "na05",
  "em02", "em04", "em05",
  "tr01", "tr02", "tr03", "tr04", "tr05",
  "en01", "en02", "en04", "en05", "en06",
  "so04",
  "ac01", "ac02", "ac03", "ac05", "ac06", "ac07", "ac08",
]);

const HARD_IDS = new Set([
  "em01", "em03",
  "pl09", "pl10",
  "en07", "en08",
  "so02", "so03", "so05",
  "w01", "w02", "w03", "w04",
]);

function resolveDifficulty(id: string): TabooDifficulty {
  if (HARD_IDS.has(id)) return "hard";
  if (MEDIUM_IDS.has(id)) return "medium";
  return "easy";
}

const c = (
  id: string,
  word: string,
  forbidden: string[],
  category: TabooCard["category"],
  hint: string
): TabooCard => ({
  id,
  word,
  forbidden,
  category,
  hint,
  difficulty: resolveDifficulty(id),
});

/** Günlük İngilizce — kolay / orta / zor dağılımlı */
export const TABOO_CARDS: TabooCard[] = [
  // FOOD
  c("f01", "Apple", ["fruit", "red", "tree", "eat", "sweet"], "food", "Elma"),
  c("f02", "Bread", ["bake", "eat", "slice", "flour", "toast"], "food", "Ekmek"),
  c("f03", "Milk", ["drink", "white", "cow", "glass", "cold"], "food", "Süt"),
  c("f04", "Water", ["drink", "glass", "thirsty", "cold", "bottle"], "food", "Su"),
  c("f05", "Coffee", ["drink", "hot", "morning", "cup", "caffeine"], "food", "Kahve"),
  c("f06", "Tea", ["drink", "hot", "cup", "bag", "leaves"], "food", "Çay"),
  c("f07", "Pizza", ["cheese", "eat", "round", "slice", "Italy"], "food", "Pizza"),
  c("f08", "Egg", ["chicken", "breakfast", "white", "yellow", "boil"], "food", "Yumurta"),
  c("f09", "Rice", ["eat", "white", "bowl", "cook", "grain"], "food", "Pirinç"),
  c("f10", "Soup", ["hot", "bowl", "spoon", "eat", "liquid"], "food", "Çorba"),
  c("f11", "Chocolate", ["sweet", "brown", "candy", "eat", "bar"], "food", "Çikolata"),
  c("f12", "Banana", ["yellow", "fruit", "monkey", "peel", "eat"], "food", "Muz"),
  c("f13", "Breakfast", ["morning", "eat", "first", "meal", "eggs"], "food", "Kahvaltı"),
  c("f14", "Lunch", ["noon", "eat", "meal", "midday", "food"], "food", "Öğle yemeği"),
  c("f15", "Dinner", ["evening", "eat", "night", "meal", "home"], "food", "Akşam yemeği"),

  // PEOPLE
  c("pe01", "Mother", ["mom", "parent", "woman", "family", "child"], "people", "Anne"),
  c("pe02", "Father", ["dad", "parent", "man", "family", "child"], "people", "Baba"),
  c("pe03", "Baby", ["small", "cry", "young", "child", "milk"], "people", "Bebek"),
  c("pe04", "Friend", ["pal", "like", "know", "together", "help"], "people", "Arkadaş"),
  c("pe05", "Teacher", ["school", "class", "student", "lesson", "learn"], "people", "Öğretmen"),
  c("pe06", "Doctor", ["hospital", "sick", "help", "medicine", "patient"], "people", "Doktor"),
  c("pe07", "Brother", ["boy", "family", "sister", "sibling", "young"], "people", "Erkek kardeş"),
  c("pe08", "Sister", ["girl", "family", "brother", "sibling", "young"], "people", "Kız kardeş"),
  c("pe09", "Dog", ["pet", "bark", "animal", "walk", "tail"], "people", "Köpek"),
  c("pe10", "Cat", ["pet", "meow", "animal", "soft", "mouse"], "people", "Kedi"),

  // HOME
  c("h01", "Bed", ["sleep", "night", "pillow", "room", "tired"], "home", "Yatak"),
  c("h02", "Door", ["open", "close", "house", "enter", "knock"], "home", "Kapı"),
  c("h03", "Window", ["glass", "open", "look", "light", "room"], "home", "Pencere"),
  c("h04", "Chair", ["sit", "table", "legs", "seat", "wood"], "home", "Sandalye"),
  c("h05", "Table", ["eat", "wood", "legs", "flat", "dinner"], "home", "Masa"),
  c("h06", "Kitchen", ["cook", "food", "stove", "eat", "room"], "home", "Mutfak"),
  c("h07", "Bathroom", ["shower", "toilet", "wash", "water", "mirror"], "home", "Banyo"),
  c("h08", "Key", ["door", "open", "lock", "house", "metal"], "home", "Anahtar"),
  c("h09", "Phone", ["call", "talk", "mobile", "number", "text"], "home", "Telefon"),
  c("h10", "Television", ["watch", "screen", "show", "remote", "news"], "home", "Televizyon"),

  // PLACES
  c("pl01", "Home", ["house", "live", "family", "room", "sleep"], "places", "Ev"),
  c("pl02", "School", ["learn", "teacher", "student", "class", "study"], "places", "Okul"),
  c("pl03", "Park", ["trees", "walk", "green", "play", "bench"], "places", "Park"),
  c("pl04", "Beach", ["sand", "sea", "swim", "sun", "water"], "places", "Plaj"),
  c("pl05", "Shop", ["buy", "money", "store", "sell", "market"], "places", "Dükkan"),
  c("pl06", "Hospital", ["doctor", "sick", "help", "nurse", "bed"], "places", "Hastane"),
  c("pl07", "Restaurant", ["eat", "food", "table", "menu", "waiter"], "places", "Restoran"),
  c("pl08", "Airport", ["plane", "fly", "travel", "flight", "luggage"], "places", "Havalimanı"),
  c("pl09", "Hotel", ["sleep", "room", "travel", "stay", "vacation"], "places", "Otel"),
  c("pl10", "Bus stop", ["wait", "bus", "road", "stand", "ticket"], "places", "Otobüs durağı"),

  // NATURE & WEATHER
  c("na01", "Sun", ["hot", "sky", "day", "light", "yellow"], "emotions", "Güneş"),
  c("na02", "Rain", ["wet", "water", "sky", "cloud", "umbrella"], "emotions", "Yağmur"),
  c("na03", "Snow", ["cold", "white", "winter", "ice", "fall"], "emotions", "Kar"),
  c("na04", "Tree", ["green", "leaves", "plant", "tall", "wood"], "emotions", "Ağaç"),
  c("na05", "Flower", ["plant", "color", "garden", "smell", "petal"], "emotions", "Çiçek"),

  // FEELINGS
  c("em01", "Happy", ["smile", "glad", "joy", "fun", "good"], "emotions", "Mutlu"),
  c("em02", "Sad", ["cry", "unhappy", "tears", "bad", "down"], "emotions", "Üzgün"),
  c("em03", "Angry", ["mad", "shout", "red", "fight", "upset"], "emotions", "Kızgın"),
  c("em04", "Tired", ["sleep", "yawn", "rest", "bed", "work"], "emotions", "Yorgun"),
  c("em05", "Hungry", ["eat", "food", "stomach", "meal", "want"], "emotions", "Aç"),

  // TRANSPORT
  c("tr01", "Bus", ["road", "drive", "stop", "ticket", "public"], "places", "Otobüs"),
  c("tr02", "Car", ["drive", "road", "wheel", "fast", "seat"], "places", "Araba"),
  c("tr03", "Train", ["rail", "travel", "fast", "station", "ticket"], "places", "Tren"),
  c("tr04", "Plane", ["fly", "sky", "airport", "travel", "wing"], "places", "Uçak"),
  c("tr05", "Bicycle", ["ride", "wheel", "pedal", "two", "sport"], "places", "Bisiklet"),

  // FUN
  c("en01", "Movie", ["watch", "cinema", "film", "screen", "actor"], "entertainment", "Film"),
  c("en02", "Music", ["song", "listen", "sound", "sing", "radio"], "entertainment", "Müzik"),
  c("en03", "Book", ["read", "page", "story", "paper", "library"], "entertainment", "Kitap"),
  c("en04", "Party", ["fun", "friends", "music", "dance", "celebrate"], "entertainment", "Parti"),
  c("en05", "Football", ["ball", "kick", "team", "goal", "sport"], "entertainment", "Futbol"),
  c("en06", "Dance", ["music", "move", "party", "fun", "steps"], "entertainment", "Dans"),
  c("en07", "Birthday", ["cake", "party", "age", "gift", "year"], "entertainment", "Doğum günü"),
  c("en08", "Holiday", ["vacation", "travel", "rest", "beach", "free"], "entertainment", "Tatil"),

  // SOCIAL
  c("so01", "Hello", ["hi", "greet", "meet", "say", "morning"], "social", "Merhaba"),
  c("so02", "Thank you", ["thanks", "grateful", "please", "kind", "say"], "social", "Teşekkür"),
  c("so03", "Sorry", ["apologize", "mistake", "sad", "excuse", "wrong"], "social", "Özür"),
  c("so04", "Gift", ["present", "give", "birthday", "box", "surprise"], "social", "Hediye"),
  c("so05", "Wedding", ["marry", "bride", "love", "party", "ring"], "social", "Düğün"),

  // ACTIONS
  c("ac01", "Sleep", ["bed", "night", "tired", "dream", "rest"], "hobbies", "Uyumak"),
  c("ac02", "Run", ["fast", "legs", "sport", "move", "race"], "hobbies", "Koşmak"),
  c("ac03", "Walk", ["legs", "slow", "street", "move", "park"], "hobbies", "Yürümek"),
  c("ac04", "Eat", ["food", "mouth", "hungry", "meal", "taste"], "hobbies", "Yemek yemek"),
  c("ac05", "Cook", ["food", "kitchen", "make", "eat", "hot"], "hobbies", "Yemek yapmak"),
  c("ac06", "Swim", ["water", "pool", "sea", "sport", "wet"], "hobbies", "Yüzmek"),
  c("ac07", "Sing", ["song", "music", "voice", "mouth", "loud"], "hobbies", "Şarkı söylemek"),
  c("ac08", "Read", ["book", "eyes", "story", "page", "quiet"], "hobbies", "Okumak"),

  // WORK (basit)
  c("w01", "Work", ["job", "office", "money", "day", "boss"], "worklife", "İş / çalışmak"),
  c("w02", "Meeting", ["talk", "office", "people", "room", "work"], "worklife", "Toplantı"),
  c("w03", "Vacation", ["holiday", "rest", "travel", "free", "beach"], "worklife", "Tatil"),
  c("w04", "Money", ["pay", "buy", "bank", "cash", "rich"], "worklife", "Para"),
];

export const TABOO_CATEGORY_LABELS: Record<string, string> = {
  food: "Food & Drink",
  people: "People & Animals",
  home: "Home",
  entertainment: "Fun",
  places: "Places & Transport",
  emotions: "Nature & Feelings",
  social: "Social",
  hobbies: "Actions",
  worklife: "Daily Life",
};

export const TABOO_DIFFICULTY_COUNTS = TABOO_CARDS.reduce(
  (acc, card) => {
    acc[card.difficulty] += 1;
    acc.all += 1;
    return acc;
  },
  { all: 0, easy: 0, medium: 0, hard: 0 } as Record<"all" | TabooDifficulty, number>
);
