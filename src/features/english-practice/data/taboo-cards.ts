import type { TabooCard, TabooDifficulty } from "../types";
import { TABOO_CARDS_EXTENDED } from "./taboo-cards-extended";

const c = (
  id: string,
  word: string,
  forbidden: string[],
  category: TabooCard["category"],
  hint: string,
  difficulty: TabooDifficulty
): TabooCard => ({
  id,
  word,
  forbidden,
  category,
  hint,
  difficulty,
});

/**
 * CEFR-oriented deck: ~15% easy (A2), ~50% medium (B1), ~35% hard (B2).
 * Difficulty is explicit per card — never inferred from id.
 */
export const TABOO_CARDS_CORE: TabooCard[] = [
  // FOOD — easy basics for mixed mode only
  c("f01", "Apple", ["fruit", "red", "tree", "eat", "sweet"], "food", "Elma", "easy"),
  c("f02", "Bread", ["bake", "eat", "slice", "flour", "toast"], "food", "Ekmek", "easy"),
  c("f03", "Milk", ["drink", "white", "cow", "glass", "cold"], "food", "Süt", "easy"),
  c("f04", "Water", ["drink", "glass", "thirsty", "cold", "bottle"], "food", "Su", "easy"),
  c("f05", "Coffee", ["drink", "hot", "morning", "cup", "caffeine"], "food", "Kahve", "medium"),
  c("f06", "Tea", ["drink", "hot", "cup", "bag", "leaves"], "food", "Çay", "easy"),
  c("f07", "Pizza", ["cheese", "eat", "round", "slice", "Italy"], "food", "Pizza", "medium"),
  c("f08", "Egg", ["chicken", "breakfast", "white", "yellow", "boil"], "food", "Yumurta", "easy"),
  c("f09", "Rice", ["eat", "white", "bowl", "cook", "grain"], "food", "Pirinç", "medium"),
  c("f10", "Soup", ["hot", "bowl", "spoon", "eat", "liquid"], "food", "Çorba", "medium"),
  c("f11", "Chocolate", ["sweet", "brown", "candy", "eat", "bar"], "food", "Çikolata", "medium"),
  c("f12", "Banana", ["yellow", "fruit", "monkey", "peel", "eat"], "food", "Muz", "easy"),
  c("f13", "Breakfast", ["morning", "eat", "first", "meal", "eggs"], "food", "Kahvaltı", "medium"),
  c("f14", "Lunch", ["noon", "eat", "meal", "midday", "food"], "food", "Öğle yemeği", "medium"),
  c("f15", "Dinner", ["evening", "eat", "night", "meal", "home"], "food", "Akşam yemeği", "medium"),
  c("f16", "Vegetarian", ["meat", "plant", "diet", "eat", "healthy"], "food", "Vejetaryen", "hard"),
  c("f17", "Ingredient", ["recipe", "cook", "food", "mix", "kitchen"], "food", "Malzeme", "hard"),

  // PEOPLE
  c("pe01", "Mother", ["mom", "parent", "woman", "family", "child"], "people", "Anne", "easy"),
  c("pe02", "Father", ["dad", "parent", "man", "family", "child"], "people", "Baba", "easy"),
  c("pe03", "Baby", ["small", "cry", "young", "child", "milk"], "people", "Bebek", "easy"),
  c("pe04", "Friend", ["pal", "like", "know", "together", "help"], "people", "Arkadaş", "easy"),
  c("pe05", "Teacher", ["school", "class", "student", "lesson", "learn"], "people", "Öğretmen", "medium"),
  c("pe06", "Doctor", ["hospital", "sick", "help", "medicine", "patient"], "people", "Doktor", "medium"),
  c("pe07", "Brother", ["boy", "family", "sister", "sibling", "young"], "people", "Erkek kardeş", "easy"),
  c("pe08", "Sister", ["girl", "family", "brother", "sibling", "young"], "people", "Kız kardeş", "easy"),
  c("pe09", "Dog", ["pet", "bark", "animal", "walk", "tail"], "people", "Köpek", "easy"),
  c("pe10", "Cat", ["pet", "meow", "animal", "soft", "mouse"], "people", "Kedi", "easy"),
  c("pe11", "Colleague", ["work", "office", "job", "team", "coworker"], "people", "Meslektaş", "hard"),
  c("pe12", "Stranger", ["unknown", "person", "meet", "foreign", "never"], "people", "Yabancı", "hard"),

  // HOME
  c("h01", "Bed", ["sleep", "night", "pillow", "room", "tired"], "home", "Yatak", "easy"),
  c("h02", "Door", ["open", "close", "house", "enter", "knock"], "home", "Kapı", "easy"),
  c("h03", "Window", ["glass", "open", "look", "light", "room"], "home", "Pencere", "medium"),
  c("h04", "Chair", ["sit", "table", "legs", "seat", "wood"], "home", "Sandalye", "easy"),
  c("h05", "Table", ["eat", "wood", "legs", "flat", "dinner"], "home", "Masa", "easy"),
  c("h06", "Kitchen", ["cook", "food", "stove", "eat", "room"], "home", "Mutfak", "medium"),
  c("h07", "Bathroom", ["shower", "toilet", "wash", "water", "mirror"], "home", "Banyo", "medium"),
  c("h08", "Key", ["door", "open", "lock", "house", "metal"], "home", "Anahtar", "easy"),
  c("h09", "Phone", ["call", "talk", "mobile", "number", "text"], "home", "Telefon", "medium"),
  c("h10", "Television", ["watch", "screen", "show", "remote", "news"], "home", "Televizyon", "medium"),
  c("h11", "Electricity", ["power", "light", "energy", "bill", "socket"], "home", "Elektrik", "hard"),
  c("h12", "Furniture", ["chair", "table", "sofa", "room", "wood"], "home", "Mobilya", "hard"),

  // PLACES & TRANSPORT
  c("pl01", "Home", ["house", "live", "family", "room", "sleep"], "places", "Ev", "easy"),
  c("pl02", "School", ["learn", "teacher", "student", "class", "study"], "places", "Okul", "easy"),
  c("pl03", "Park", ["trees", "walk", "green", "play", "bench"], "places", "Park", "easy"),
  c("pl04", "Beach", ["sand", "sea", "swim", "sun", "water"], "places", "Plaj", "medium"),
  c("pl05", "Shop", ["buy", "money", "store", "sell", "market"], "places", "Dükkan", "medium"),
  c("pl06", "Hospital", ["doctor", "sick", "help", "nurse", "bed"], "places", "Hastane", "medium"),
  c("pl07", "Restaurant", ["eat", "food", "table", "menu", "waiter"], "places", "Restoran", "medium"),
  c("pl08", "Airport", ["plane", "fly", "travel", "flight", "luggage"], "places", "Havalimanı", "medium"),
  c("pl09", "Hotel", ["sleep", "room", "travel", "stay", "vacation"], "places", "Otel", "medium"),
  c("pl10", "Bus stop", ["wait", "bus", "road", "stand", "ticket"], "places", "Otobüs durağı", "medium"),
  c("pl11", "Museum", ["art", "history", "exhibit", "visit", "culture"], "places", "Müze", "hard"),
  c("pl12", "University", ["study", "degree", "campus", "student", "college"], "places", "Üniversite", "hard"),
  c("tr01", "Bus", ["road", "drive", "stop", "ticket", "public"], "places", "Otobüs", "medium"),
  c("tr02", "Car", ["drive", "road", "wheel", "fast", "seat"], "places", "Araba", "easy"),
  c("tr03", "Train", ["rail", "travel", "fast", "station", "ticket"], "places", "Tren", "medium"),
  c("tr04", "Plane", ["fly", "sky", "airport", "travel", "wing"], "places", "Uçak", "medium"),
  c("tr05", "Bicycle", ["ride", "wheel", "pedal", "two", "sport"], "places", "Bisiklet", "easy"),
  c("tr06", "Traffic jam", ["car", "road", "slow", "horn", "stuck"], "places", "Trafik sıkışıklığı", "hard"),

  // NATURE & WEATHER (fixed category — was wrongly under emotions)
  c("na01", "Sun", ["hot", "sky", "day", "light", "yellow"], "places", "Güneş", "easy"),
  c("na02", "Rain", ["wet", "water", "sky", "cloud", "umbrella"], "places", "Yağmur", "easy"),
  c("na03", "Snow", ["cold", "white", "winter", "ice", "fall"], "places", "Kar", "easy"),
  c("na04", "Tree", ["green", "leaves", "plant", "tall", "wood"], "places", "Ağaç", "easy"),
  c("na05", "Flower", ["plant", "color", "garden", "smell", "petal"], "places", "Çiçek", "easy"),
  c("na06", "Earthquake", ["shake", "ground", "disaster", "building", "fault"], "places", "Deprem", "hard"),
  c("na07", "Climate", ["weather", "change", "warm", "cold", "planet"], "places", "İklim", "hard"),

  // FEELINGS — basic = easy/medium, abstract = hard
  c("em01", "Happy", ["smile", "glad", "joy", "fun", "good"], "emotions", "Mutlu", "easy"),
  c("em02", "Sad", ["cry", "unhappy", "tears", "bad", "down"], "emotions", "Üzgün", "easy"),
  c("em03", "Angry", ["mad", "shout", "red", "fight", "upset"], "emotions", "Kızgın", "easy"),
  c("em04", "Tired", ["sleep", "yawn", "rest", "bed", "work"], "emotions", "Yorgun", "easy"),
  c("em05", "Hungry", ["eat", "food", "stomach", "meal", "want"], "emotions", "Aç", "easy"),
  c("em06", "Anxious", ["worry", "nervous", "stress", "fear", "exam"], "emotions", "Endişeli", "hard"),
  c("em07", "Jealous", ["envy", "want", "other", "green", "compare"], "emotions", "Kıskanç", "hard"),
  c("em08", "Grateful", ["thank", "appreciate", "blessed", "kind", "help"], "emotions", "Minnettar", "hard"),
  c("em09", "Confident", ["sure", "believe", "strong", "self", "proud"], "emotions", "Kendinden emin", "hard"),
  c("em10", "Embarrassed", ["shy", "red", "face", "awkward", "shame"], "emotions", "Utanmış", "hard"),

  // ENTERTAINMENT
  c("en01", "Movie", ["watch", "cinema", "film", "screen", "actor"], "entertainment", "Film", "medium"),
  c("en02", "Music", ["song", "listen", "sound", "sing", "radio"], "entertainment", "Müzik", "easy"),
  c("en03", "Book", ["read", "page", "story", "paper", "library"], "entertainment", "Kitap", "easy"),
  c("en04", "Party", ["fun", "friends", "music", "dance", "celebrate"], "entertainment", "Parti", "medium"),
  c("en05", "Football", ["ball", "kick", "team", "goal", "sport"], "entertainment", "Futbol", "medium"),
  c("en06", "Dance", ["music", "move", "party", "fun", "steps"], "entertainment", "Dans", "medium"),
  c("en07", "Birthday", ["cake", "party", "age", "gift", "year"], "entertainment", "Doğum günü", "medium"),
  c("en08", "Holiday", ["vacation", "travel", "rest", "beach", "free"], "entertainment", "Tatil", "medium"),
  c("en09", "Concert", ["music", "live", "stage", "band", "ticket"], "entertainment", "Konser", "hard"),
  c("en10", "Documentary", ["film", "real", "fact", "learn", "TV"], "entertainment", "Belgesel", "hard"),

  // SOCIAL
  c("so01", "Hello", ["hi", "greet", "meet", "say", "morning"], "social", "Merhaba", "easy"),
  c("so02", "Thank you", ["thanks", "grateful", "please", "kind", "say"], "social", "Teşekkür", "easy"),
  c("so03", "Sorry", ["apologize", "mistake", "sad", "excuse", "wrong"], "social", "Özür", "medium"),
  c("so04", "Gift", ["present", "give", "birthday", "box", "surprise"], "social", "Hediye", "medium"),
  c("so05", "Wedding", ["marry", "bride", "love", "party", "ring"], "social", "Düğün", "medium"),
  c("so06", "Negotiation", ["deal", "agree", "talk", "business", "price"], "social", "Müzakere", "hard"),
  c("so07", "Gossip", ["rumor", "talk", "secret", "friend", "story"], "social", "Dedikodu", "hard"),

  // ACTIONS / HOBBIES
  c("ac01", "Sleep", ["bed", "night", "tired", "dream", "rest"], "hobbies", "Uyumak", "easy"),
  c("ac02", "Run", ["fast", "legs", "sport", "move", "race"], "hobbies", "Koşmak", "easy"),
  c("ac03", "Walk", ["legs", "slow", "street", "move", "park"], "hobbies", "Yürümek", "easy"),
  c("ac04", "Eat", ["food", "mouth", "hungry", "meal", "taste"], "hobbies", "Yemek yemek", "easy"),
  c("ac05", "Cook", ["food", "kitchen", "make", "eat", "hot"], "hobbies", "Yemek yapmak", "medium"),
  c("ac06", "Swim", ["water", "pool", "sea", "sport", "wet"], "hobbies", "Yüzmek", "medium"),
  c("ac07", "Sing", ["song", "music", "voice", "mouth", "loud"], "hobbies", "Şarkı söylemek", "medium"),
  c("ac08", "Read", ["book", "eyes", "story", "page", "quiet"], "hobbies", "Okumak", "easy"),
  c("ac09", "Meditate", ["calm", "breathe", "quiet", "mind", "peace"], "hobbies", "Meditasyon", "hard"),
  c("ac10", "Volunteer", ["help", "free", "charity", "community", "work"], "hobbies", "Gönüllü olmak", "hard"),

  // WORK & LIFE
  c("w01", "Work", ["job", "office", "money", "day", "boss"], "worklife", "İş", "medium"),
  c("w02", "Meeting", ["talk", "office", "people", "room", "work"], "worklife", "Toplantı", "medium"),
  c("w03", "Vacation", ["holiday", "rest", "travel", "free", "beach"], "worklife", "Tatil", "medium"),
  c("w04", "Money", ["pay", "buy", "bank", "cash", "rich"], "worklife", "Para", "easy"),
  c("w05", "Deadline", ["late", "work", "date", "finish", "pressure"], "worklife", "Son teslim", "hard"),
  c("w06", "Promotion", ["job", "raise", "boss", "career", "higher"], "worklife", "Terfi", "hard"),
  c("w07", "Interview", ["job", "question", "hire", "nervous", "answer"], "worklife", "Mülakat", "hard"),
  c("w08", "Entrepreneur", ["business", "startup", "risk", "founder", "company"], "worklife", "Girişimci", "hard"),
];

export const TABOO_CARDS: TabooCard[] = [...TABOO_CARDS_CORE, ...TABOO_CARDS_EXTENDED];

export const TABOO_CATEGORY_LABELS: Record<string, string> = {
  food: "Food & Drink",
  people: "People & Animals",
  home: "Home",
  entertainment: "Fun & TV",
  places: "Places & Nature",
  emotions: "Feelings",
  social: "Social",
  hobbies: "Actions",
  worklife: "Work & Life",
  celebrities: "Celebrities",
  movies: "Movies & Cinema",
  technology: "Technology",
};

export const TABOO_DIFFICULTY_COUNTS = TABOO_CARDS.reduce(
  (acc, card) => {
    acc[card.difficulty] += 1;
    acc.all += 1;
    return acc;
  },
  { all: 0, easy: 0, medium: 0, hard: 0 } as Record<"all" | TabooDifficulty, number>
);
