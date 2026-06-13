import type { HeadsUpCard } from "../types";

const h = (
  id: string,
  word: string,
  category: HeadsUpCard["category"],
  hint?: string
): HeadsUpCard => ({ id, word, category, hint });

/** Basit günlük kelimeler — sınıf oyunu için */
export const HEADS_UP_CARDS: HeadsUpCard[] = [
  // EVERYDAY
  h("ev01", "Phone", "everyday", "Telefon"),
  h("ev02", "Key", "everyday", "Anahtar"),
  h("ev03", "Bag", "everyday", "Çanta"),
  h("ev04", "Clock", "everyday", "Saat"),
  h("ev05", "Door", "everyday", "Kapı"),
  h("ev06", "Window", "everyday", "Pencere"),
  h("ev07", "Chair", "everyday", "Sandalye"),
  h("ev08", "Table", "everyday", "Masa"),
  h("ev09", "Bed", "everyday", "Yatak"),
  h("ev10", "Light", "everyday", "Işık"),
  h("ev11", "Pen", "everyday", "Kalem"),
  h("ev12", "Book", "everyday", "Kitap"),
  h("ev13", "Money", "everyday", "Para"),
  h("ev14", "Shoes", "everyday", "Ayakkabı"),
  h("ev15", "Shirt", "everyday", "Gömlek"),

  // FOOD
  h("fd01", "Apple", "food", "Elma"),
  h("fd02", "Bread", "food", "Ekmek"),
  h("fd03", "Milk", "food", "Süt"),
  h("fd04", "Water", "food", "Su"),
  h("fd05", "Coffee", "food", "Kahve"),
  h("fd06", "Tea", "food", "Çay"),
  h("fd07", "Pizza", "food", "Pizza"),
  h("fd08", "Egg", "food", "Yumurta"),
  h("fd09", "Rice", "food", "Pirinç"),
  h("fd10", "Soup", "food", "Çorba"),
  h("fd11", "Chocolate", "food", "Çikolata"),
  h("fd12", "Banana", "food", "Muz"),
  h("fd13", "Cheese", "food", "Peynir"),
  h("fd14", "Chicken", "food", "Tavuk"),
  h("fd15", "Ice cream", "food", "Dondurma"),

  // PEOPLE & ANIMALS
  h("pe01", "Mother", "people", "Anne"),
  h("pe02", "Father", "people", "Baba"),
  h("pe03", "Baby", "people", "Bebek"),
  h("pe04", "Friend", "people", "Arkadaş"),
  h("pe05", "Teacher", "people", "Öğretmen"),
  h("pe06", "Doctor", "people", "Doktor"),
  h("pe07", "Dog", "people", "Köpek"),
  h("pe08", "Cat", "people", "Kedi"),
  h("pe09", "Brother", "people", "Erkek kardeş"),
  h("pe10", "Sister", "people", "Kız kardeş"),

  // PLACES
  h("pl01", "Home", "places", "Ev"),
  h("pl02", "School", "places", "Okul"),
  h("pl03", "Park", "places", "Park"),
  h("pl04", "Beach", "places", "Plaj"),
  h("pl05", "Shop", "places", "Dükkan"),
  h("pl06", "Hospital", "places", "Hastane"),
  h("pl07", "Restaurant", "places", "Restoran"),
  h("pl08", "Cinema", "places", "Sinema"),
  h("pl09", "Airport", "places", "Havalimanı"),
  h("pl10", "Hotel", "places", "Otel"),

  // NATURE & WEATHER
  h("na01", "Sun", "nature", "Güneş"),
  h("na02", "Rain", "nature", "Yağmur"),
  h("na03", "Snow", "nature", "Kar"),
  h("na04", "Tree", "nature", "Ağaç"),
  h("na05", "Flower", "nature", "Çiçek"),
  h("na06", "Sea", "nature", "Deniz"),
  h("na07", "Mountain", "nature", "Dağ"),
  h("na08", "River", "nature", "Nehir"),

  // FEELINGS & ACTIONS
  h("ac01", "Happy", "actions", "Mutlu"),
  h("ac02", "Sad", "actions", "Üzgün"),
  h("ac03", "Angry", "actions", "Kızgın"),
  h("ac04", "Sleep", "actions", "Uyumak"),
  h("ac05", "Run", "actions", "Koşmak"),
  h("ac06", "Walk", "actions", "Yürümek"),
  h("ac07", "Eat", "actions", "Yemek"),
  h("ac08", "Drink", "actions", "İçmek"),
  h("ac09", "Dance", "actions", "Dans"),
  h("ac10", "Sing", "actions", "Şarkı söylemek"),

  // TRANSPORT
  h("tr01", "Bus", "transport", "Otobüs"),
  h("tr02", "Car", "transport", "Araba"),
  h("tr03", "Train", "transport", "Tren"),
  h("tr04", "Plane", "transport", "Uçak"),
  h("tr05", "Bicycle", "transport", "Bisiklet"),
  h("tr06", "Taxi", "transport", "Taksi"),
];

export const HEADS_UP_CATEGORY_LABELS: Record<string, string> = {
  everyday: "Everyday",
  food: "Food",
  people: "People & Animals",
  places: "Places",
  nature: "Nature",
  actions: "Feelings & Actions",
  transport: "Transport",
};
