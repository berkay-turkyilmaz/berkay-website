import type { EmojiPuzzle, EmojiPuzzleCategory } from "../types";

const p = (
  id: string,
  answer: string,
  hintTr: string,
  category: EmojiPuzzleCategory,
  picture: [string, string],
  combo: [string, string, string],
  chain: [string, string, string, string],
  wrong: [string, string, string]
): EmojiPuzzle => ({
  id,
  answer,
  hintTr,
  category,
  emojis: { picture, combo, chain },
  wrongOptions: wrong,
});

/** Curated puzzles — each mode has a clear, teachable emoji logic. */
export const EMOJI_PUZZLES: EmojiPuzzle[] = [
  p("ep01", "Dog", "Köpek", "animals", ["🐕", "🦴"], ["🐾", "🏠", "🎾"], ["🦴", "🐕", "🦮", "🏃"], ["Cat", "Bird", "Fish"]),
  p("ep02", "Cat", "Kedi", "animals", ["🐱", "😺"], ["🐭", "🥛", "🧶"], ["🐱", "🪴", "🌙", "😴"], ["Dog", "Rabbit", "Hamster"]),
  p("ep03", "Apple", "Elma", "food", ["🍎", "🌳"], ["🥧", "🍏", "🧃"], ["🍎", "🛒", "🌳", "🥧"], ["Banana", "Orange", "Grape"]),
  p("ep04", "Coffee", "Kahve", "food", ["☕", "🫘"], ["🌅", "⏰", "😪"], ["☕", "💻", "📧", "⏰"], ["Tea", "Breakfast", "Milk"]),
  p("ep05", "Bread", "Ekmek", "food", ["🍞", "🥖"], ["🧈", "🥐", "🧺"], ["🍞", "🧈", "🥪", "🥖"], ["Rice", "Cake", "Soup"]),
  p("ep06", "Breakfast", "Kahvaltı", "food", ["🥞", "🍳"], ["🥚", "🧈", "🌅"], ["🥞", "☕", "🍳", "🌅"], ["Lunch", "Coffee", "Dinner"]),
  p("ep07", "Pizza", "Pizza", "food", ["🍕", "🇮🇹"], ["🧀", "🍅", "🔥"], ["🍕", "😋", "🍽️", "🇮🇹"], ["Burger", "Pasta", "Bread"]),
  p("ep08", "Banana", "Muz", "food", ["🍌", "🐒"], ["🌴", "🥛", "🍹"], ["🍌", "🐒", "🌴", "🟡"], ["Apple", "Mango", "Orange"]),
  p("ep09", "Rain", "Yağmur", "nature", ["🌧️", "☂️"], ["💧", "🌩️", "🧥"], ["🌧️", "☂️", "🏃", "🪣"], ["Snow", "Sun", "Wind"]),
  p("ep10", "Summer", "Yaz", "nature", ["☀️", "🏖️"], ["🍦", "🕶️", "🌊"], ["☀️", "🏖️", "🍉", "🏊"], ["Winter", "Spring", "Vacation"]),
  p("ep11", "Snow", "Kar", "nature", ["❄️", "⛄"], ["🧣", "🎿", "🥶"], ["❄️", "⛄", "🏔️", "🧤"], ["Rain", "Ice", "Cold"]),
  p("ep12", "Flower", "Çiçek", "nature", ["🌸", "🌷"], ["🐝", "💐", "🌺"], ["🌸", "🌷", "💒", "🐝"], ["Tree", "Grass", "Plant"]),
  p("ep13", "Tree", "Ağaç", "nature", ["🌳", "🍃"], ["🐦", "🌲", "🍂"], ["🌳", "🍃", "🐦", "🪺"], ["Flower", "Plant", "Forest"]),
  p("ep14", "School", "Okul", "places", ["🏫", "🎓"], ["📚", "✏️", "🎒"], ["🏫", "📚", "🔔", "📝"], ["Office", "Teacher", "Home"]),
  p("ep15", "Home", "Ev", "places", ["🏠", "🔑"], ["🛋️", "❤️", "🪴"], ["🏠", "🔑", "👨‍👩‍👧", "🛏️"], ["School", "Hotel", "Apartment"]),
  p("ep16", "Bus", "Otobüs", "places", ["🚌", "🚏"], ["🎫", "👥", "🛣️"], ["🚌", "🚏", "🧳", "🎫"], ["Car", "Train", "Plane"]),
  p("ep17", "Car", "Araba", "places", ["🚗", "🛣️"], ["⛽", "🚦", "🔑"], ["🚗", "⛽", "🛣️", "🅿️"], ["Bus", "Bike", "Truck"]),
  p("ep18", "Doctor", "Doktor", "people", ["👨‍⚕️", "🏥"], ["💊", "🩺", "🚑"], ["🏥", "💉", "🤒", "🩺"], ["Teacher", "Nurse", "Patient"]),
  p("ep19", "Teacher", "Öğretmen", "people", ["👩‍🏫", "📖"], ["🏫", "✏️", "🍎"], ["👩‍🏫", "📚", "🎒", "📝"], ["Doctor", "Student", "Principal"]),
  p("ep20", "Phone", "Telefon", "daily", ["📱", "📞"], ["💬", "🔋", "📲"], ["📱", "💬", "📧", "🔔"], ["TV", "Computer", "Letter"]),
  p("ep21", "Book", "Kitap", "daily", ["📖", "📚"], ["🔖", "☕", "🤓"], ["📖", "📚", "🛋️", "☕"], ["Movie", "Magazine", "Newspaper"]),
  p("ep22", "Football", "Futbol", "daily", ["⚽", "🥅"], ["👟", "🏟️", "📣"], ["⚽", "🥅", "👟", "🏃"], ["Tennis", "Basketball", "Sport"]),
  p("ep23", "Music", "Müzik", "daily", ["🎵", "🎧"], ["🎸", "🎤", "💃"], ["🎵", "🎧", "🎸", "📻"], ["Movie", "Dance", "Song"]),
  p("ep24", "Movie", "Film", "daily", ["🎬", "🍿"], ["🎟️", "🛋️", "📽️"], ["🎬", "🍿", "🛋️", "🌃"], ["Book", "Show", "Music"]),
  p("ep25", "Happy", "Mutlu", "daily", ["😊", "😄"], ["🌞", "🤗", "✨"], ["😊", "🎉", "👋", "☀️"], ["Sad", "Angry", "Tired"]),
  p("ep26", "Sleep", "Uyumak", "daily", ["😴", "💤"], ["🌙", "🛏️", "🧸"], ["😴", "🌙", "🛏️", "💤"], ["Tired", "Rest", "Dream"]),
  p("ep27", "Angry", "Kızgın", "daily", ["😡", "🔥"], ["💢", "👊", "😤"], ["😡", "🔥", "📢", "🚫"], ["Happy", "Sad", "Calm"]),
  p("ep28", "Hungry", "Aç", "daily", ["😋", "🍽️"], ["🍕", "⏰", "🤤"], ["😋", "🍽️", "🍔", "⏰"], ["Thirsty", "Tired", "Full"]),
  p("ep29", "Run", "Koşmak", "daily", ["🏃", "💨"], ["👟", "💪", "🏅"], ["🏃", "💨", "👟", "🌳"], ["Walk", "Swim", "Jump"]),
  p("ep30", "Swim", "Yüzmek", "daily", ["🏊", "💦"], ["🩱", "🌊", "☀️"], ["🏊", "🌊", "🏖️", "☀️"], ["Run", "Dive", "Bath"]),
  p("ep31", "Work", "İş", "daily", ["💼", "🏢"], ["💻", "📊", "⏰"], ["💼", "🏢", "💻", "☕"], ["Play", "School", "Meeting"]),
  p("ep32", "Vacation", "Tatil", "daily", ["🧳", "✈️"], ["🏖️", "🌴", "📸"], ["✈️", "🧳", "🏖️", "🌴"], ["Work", "Summer", "Travel"]),
  p("ep33", "Money", "Para", "daily", ["💰", "💵"], ["🏦", "💳", "🪙"], ["💰", "🏦", "💳", "🛍️"], ["Gift", "Coin", "Salary"]),
  p("ep34", "Gift", "Hediye", "daily", ["🎁", "🎀"], ["💝", "🎈", "📦"], ["🎁", "🎊", "🎀", "💝"], ["Money", "Toy", "Card"]),
  p("ep35", "Birthday", "Doğum günü", "daily", ["🎂", "🎉"], ["🎈", "🎁", "🕯️"], ["🎂", "🎉", "🎈", "🥳"], ["Wedding", "Party", "Holiday"]),
  p("ep36", "Wedding", "Düğün", "daily", ["💍", "💒"], ["👰", "🥂", "💐"], ["💍", "💒", "👰", "🤵"], ["Birthday", "Party", "Love"]),
  p("ep37", "Hello", "Merhaba", "daily", ["👋", "😊"], ["🤝", "☀️", "🙂"], ["👋", "😊", "🤝", "📱"], ["Goodbye", "Thanks", "Sorry"]),
  p("ep38", "Thank you", "Teşekkür", "daily", ["🙏", "💚"], ["🤗", "🎁", "😊"], ["🙏", "💚", "🤗", "✨"], ["Sorry", "Please", "Hello"]),
  p("ep39", "Key", "Anahtar", "daily", ["🔑", "🚪"], ["🔐", "🏠", "🗝️"], ["🔑", "🚪", "🏠", "🚗"], ["Lock", "Door", "Gate"]),
  p("ep40", "Bed", "Yatak", "daily", ["🛏️", "🛌"], ["🌙", "💤", "🧸"], ["🛏️", "🌙", "😴", "💤"], ["Sleep", "Chair", "Sofa"]),
];

export const EMOJI_TUTORIAL_BY_MODE = {
  picture: { emojis: ["🐕", "🦴"] as const, answer: "Dog", hintTr: "Köpek" },
  combo: { emojis: ["☕", "🌅", "⏰"] as const, answer: "Coffee", hintTr: "Kahve" },
  chain: { emojis: ["✈️", "🧳", "🏖️", "🌴"] as const, answer: "Vacation", hintTr: "Tatil" },
} as const;
