import type { HeadsUpCard, TabooDifficulty } from "../types";

import { HEADS_UP_CARDS_EXTENDED } from "./heads-up-cards-extended";

const h = (
  id: string,
  word: string,
  category: HeadsUpCard["category"],
  hint: string,
  difficulty: TabooDifficulty = "medium"
): HeadsUpCard => ({ id, word, category, hint, difficulty });

/** B1/B2 ağırlıklı — az miktarda A2 (easy) */
export const HEADS_UP_CARDS_CORE: HeadsUpCard[] = [
  // EVERYDAY — çoğu B1
  h("ev01", "Phone", "everyday", "Telefon", "easy"),
  h("ev02", "Key", "everyday", "Anahtar", "easy"),
  h("ev03", "Bag", "everyday", "Çanta", "easy"),
  h("ev04", "Clock", "everyday", "Saat", "easy"),
  h("ev05", "Door", "everyday", "Kapı", "easy"),
  h("ev06", "Window", "everyday", "Pencere", "medium"),
  h("ev07", "Chair", "everyday", "Sandalye", "medium"),
  h("ev08", "Table", "everyday", "Masa", "medium"),
  h("ev09", "Bed", "everyday", "Yatak", "medium"),
  h("ev10", "Light", "everyday", "Işık", "medium"),
  h("ev11", "Pen", "everyday", "Kalem", "easy"),
  h("ev12", "Book", "everyday", "Kitap", "medium"),
  h("ev13", "Money", "everyday", "Para", "medium"),
  h("ev14", "Shoes", "everyday", "Ayakkabı", "medium"),
  h("ev15", "Shirt", "everyday", "Gömlek", "medium"),
  h("ev16", "Appointment", "everyday", "Randevu", "hard"),
  h("ev17", "Deadline", "everyday", "Son teslim tarihi", "hard"),
  h("ev18", "Receipt", "everyday", "Fiş / makbuz", "medium"),

  // FOOD
  h("fd01", "Apple", "food", "Elma", "easy"),
  h("fd02", "Bread", "food", "Ekmek", "easy"),
  h("fd03", "Milk", "food", "Süt", "easy"),
  h("fd04", "Water", "food", "Su", "easy"),
  h("fd05", "Coffee", "food", "Kahve", "medium"),
  h("fd06", "Tea", "food", "Çay", "medium"),
  h("fd07", "Pizza", "food", "Pizza", "easy"),
  h("fd08", "Egg", "food", "Yumurta", "medium"),
  h("fd09", "Rice", "food", "Pirinç", "medium"),
  h("fd10", "Soup", "food", "Çorba", "medium"),
  h("fd11", "Chocolate", "food", "Çikolata", "medium"),
  h("fd12", "Banana", "food", "Muz", "easy"),
  h("fd13", "Cheese", "food", "Peynir", "medium"),
  h("fd14", "Chicken", "food", "Tavuk", "medium"),
  h("fd15", "Ice cream", "food", "Dondurma", "easy"),
  h("fd16", "Vegetarian", "food", "Vejetaryen", "hard"),
  h("fd17", "Allergy", "food", "Alerji", "hard"),
  h("fd18", "Ingredient", "food", "Malzeme", "hard"),

  // PEOPLE & ANIMALS
  h("pe01", "Mother", "people", "Anne", "easy"),
  h("pe02", "Father", "people", "Baba", "easy"),
  h("pe03", "Baby", "people", "Bebek", "easy"),
  h("pe04", "Friend", "people", "Arkadaş", "medium"),
  h("pe05", "Teacher", "people", "Öğretmen", "medium"),
  h("pe06", "Doctor", "people", "Doktor", "medium"),
  h("pe07", "Dog", "people", "Köpek", "easy"),
  h("pe08", "Cat", "people", "Kedi", "easy"),
  h("pe09", "Brother", "people", "Erkek kardeş", "medium"),
  h("pe10", "Sister", "people", "Kız kardeş", "medium"),
  h("pe11", "Colleague", "people", "İş arkadaşı", "hard"),
  h("pe12", "Neighbor", "people", "Komşu", "medium"),

  // PLACES
  h("pl01", "Home", "places", "Ev", "easy"),
  h("pl02", "School", "places", "Okul", "easy"),
  h("pl03", "Park", "places", "Park", "medium"),
  h("pl04", "Beach", "places", "Plaj", "medium"),
  h("pl05", "Shop", "places", "Dükkan", "medium"),
  h("pl06", "Hospital", "places", "Hastane", "medium"),
  h("pl07", "Restaurant", "places", "Restoran", "medium"),
  h("pl08", "Cinema", "places", "Sinema", "medium"),
  h("pl09", "Airport", "places", "Havalimanı", "hard"),
  h("pl10", "Hotel", "places", "Otel", "medium"),
  h("pl11", "Museum", "places", "Müze", "hard"),
  h("pl12", "Pharmacy", "places", "Eczane", "hard"),

  // NATURE & WEATHER
  h("na01", "Sun", "nature", "Güneş", "easy"),
  h("na02", "Rain", "nature", "Yağmur", "medium"),
  h("na03", "Snow", "nature", "Kar", "medium"),
  h("na04", "Tree", "nature", "Ağaç", "medium"),
  h("na05", "Flower", "nature", "Çiçek", "medium"),
  h("na06", "Sea", "nature", "Deniz", "medium"),
  h("na07", "Mountain", "nature", "Dağ", "hard"),
  h("na08", "River", "nature", "Nehir", "hard"),
  h("na09", "Earthquake", "nature", "Deprem", "hard"),
  h("na10", "Pollution", "nature", "Kirlilik", "hard"),

  // FEELINGS & ACTIONS — B1+
  h("ac01", "Happy", "actions", "Mutlu", "easy"),
  h("ac02", "Sad", "actions", "Üzgün", "easy"),
  h("ac03", "Angry", "actions", "Kızgın", "easy"),
  h("ac04", "Sleep", "actions", "Uyumak", "medium"),
  h("ac05", "Run", "actions", "Koşmak", "medium"),
  h("ac06", "Walk", "actions", "Yürümek", "medium"),
  h("ac07", "Eat", "actions", "Yemek", "medium"),
  h("ac08", "Drink", "actions", "İçmek", "medium"),
  h("ac09", "Dance", "actions", "Dans", "medium"),
  h("ac10", "Sing", "actions", "Şarkı söylemek", "medium"),
  h("ac11", "Anxious", "actions", "Endişeli", "hard"),
  h("ac12", "Embarrassed", "actions", "Utanmış", "hard"),
  h("ac13", "Negotiate", "actions", "Pazarlık etmek", "hard"),
  h("ac14", "Apologize", "actions", "Özür dilemek", "hard"),

  // TRANSPORT
  h("tr01", "Bus", "transport", "Otobüs", "medium"),
  h("tr02", "Car", "transport", "Araba", "medium"),
  h("tr03", "Train", "transport", "Tren", "medium"),
  h("tr04", "Plane", "transport", "Uçak", "medium"),
  h("tr05", "Bicycle", "transport", "Bisiklet", "medium"),
  h("tr06", "Taxi", "transport", "Taksi", "medium"),
  h("tr07", "Subway", "transport", "Metro", "hard"),
  h("tr08", "Traffic jam", "transport", "Trafik sıkışıklığı", "hard"),
];

export const HEADS_UP_CARDS: HeadsUpCard[] = [
  ...HEADS_UP_CARDS_CORE,
  ...HEADS_UP_CARDS_EXTENDED,
];

export const HEADS_UP_CATEGORY_LABELS: Record<string, string> = {
  everyday: "Everyday",
  food: "Food",
  people: "People & Animals",
  places: "Places",
  nature: "Nature",
  actions: "Feelings & Actions",
  transport: "Transport",
  celebrities: "Celebrities",
  movies: "Movies & Cinema",
};
