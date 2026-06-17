import type { CategoryBlitzCategory } from "../types";

const cat = (
  id: string,
  name: string,
  hintTr: string,
  difficulty: CategoryBlitzCategory["difficulty"],
  samples: string[]
): CategoryBlitzCategory => ({ id, name, hintTr, difficulty, samples });

export const CATEGORY_BLITZ_CATEGORIES: CategoryBlitzCategory[] = [
  cat("animals", "Animals", "Hayvanlar", "easy", [
    "Cat", "Dog", "Elephant", "Tiger", "Dolphin", "Penguin", "Eagle", "Shark",
    "Butterfly", "Kangaroo", "Giraffe", "Monkey", "Whale", "Rabbit", "Horse",
  ]),
  cat("food", "Food & Drinks", "Yiyecek ve içecek", "easy", [
    "Apple", "Pizza", "Coffee", "Chocolate", "Bread", "Rice", "Soup", "Banana",
    "Cheese", "Pasta", "Salad", "Burger", "Tea", "Ice cream", "Sandwich",
  ]),
  cat("countries", "Countries", "Ülkeler", "medium", [
    "Turkey", "Germany", "Japan", "Brazil", "Canada", "France", "Italy", "Spain",
    "Australia", "Egypt", "India", "Mexico", "Norway", "Greece", "Thailand",
  ]),
  cat("cities", "World Cities", "Şehirler", "medium", [
    "London", "Paris", "Tokyo", "Istanbul", "New York", "Berlin", "Rome", "Dubai",
    "Barcelona", "Sydney", "Amsterdam", "Vienna", "Prague", "Seoul", "Cairo",
  ]),
  cat("hollywood", "Hollywood Movies", "Hollywood filmleri", "medium", [
    "Titanic", "Avatar", "Inception", "Frozen", "Barbie", "Jaws", "Rocky", "Gladiator",
    "Matrix", "Interstellar", "Jurassic Park", "Star Wars", "Harry Potter", "Batman",
  ]),
  cat("turkish_cinema", "Turkish Movies", "Türk filmleri", "hard", [
    "Recep İvedik", "Eşkıya", "G.O.R.A.", "Ayla", "Organize İşler", "Vizontele",
    "Hababam", "Çakallarla Dans", "Kolpaçino", "Arog",
  ]),
  cat("celebrities", "International Celebrities", "Uluslararası ünlüler", "medium", [
    "Taylor Swift", "Beyoncé", "Ronaldo", "Messi", "Tom Holland", "Rihanna",
    "Leonardo DiCaprio", "Drake", "Zendaya", "Lady Gaga", "Justin Bieber", "MrBeast",
  ]),
  cat("turkish_celebs", "Turkish Celebrities", "Türk ünlüler", "medium", [
    "Tarkan", "Hadise", "Cem Yılmaz", "Arda Güler", "Murat Boz", "Şebnem Ferah",
    "Kenan İmirzalıoğlu", "Bergüzar Korel", "Demet Akalın", "Sıla",
  ]),
  cat("sports", "Sports", "Sporlar", "easy", [
    "Football", "Basketball", "Tennis", "Swimming", "Volleyball", "Boxing", "Golf",
    "Skiing", "Surfing", "Cycling", "Yoga", "Cricket", "Hockey", "Rugby",
  ]),
  cat("jobs", "Jobs & Professions", "Meslekler", "medium", [
    "Teacher", "Doctor", "Engineer", "Chef", "Pilot", "Lawyer", "Artist", "Nurse",
    "Architect", "Journalist", "Scientist", "Designer", "Mechanic", "Farmer",
  ]),
  cat("technology", "Technology", "Teknoloji", "medium", [
    "Smartphone", "Laptop", "Internet", "Robot", "App", "Camera", "Drone", "Tablet",
    "Bluetooth", "Wi-Fi", "Cloud", "Algorithm", "Blockchain", "Artificial Intelligence",
  ]),
  cat("school", "School & Education", "Okul", "easy", [
    "Homework", "Exam", "Teacher", "Classroom", "Library", "Dictionary", "Pencil",
    "Notebook", "University", "Student", "Science", "History", "Mathematics", "English",
  ]),
  cat("nature", "Nature", "Doğa", "easy", [
    "Mountain", "River", "Ocean", "Forest", "Desert", "Volcano", "Rainbow", "Waterfall",
    "Island", "Lake", "Storm", "Sunset", "Earthquake", "Glacier",
  ]),
  cat("emotions", "Feelings & Emotions", "Duygular", "medium", [
    "Happy", "Sad", "Angry", "Excited", "Nervous", "Proud", "Jealous", "Grateful",
    "Confused", "Bored", "Surprised", "Anxious", "Relaxed", "Lonely",
  ]),
  cat("transport", "Transport", "Ulaşım", "easy", [
    "Bus", "Train", "Plane", "Car", "Bicycle", "Taxi", "Subway", "Ship", "Helicopter",
    "Motorcycle", "Tram", "Ferry", "Scooter", "Rocket",
  ]),
  cat("music", "Music", "Müzik", "medium", [
    "Guitar", "Piano", "Drums", "Violin", "Concert", "Album", "Microphone", "Orchestra",
    "Jazz", "Rock", "Pop", "Hip-hop", "Singer", "Festival",
  ]),
  cat("clothing", "Clothing", "Giyim", "easy", [
    "Shirt", "Jeans", "Jacket", "Dress", "Shoes", "Hat", "Socks", "Scarf", "Gloves",
    "Sweater", "Skirt", "Belt", "Uniform", "Sneakers",
  ]),
  cat("household", "Things at Home", "Ev eşyaları", "easy", [
    "Chair", "Table", "Bed", "Sofa", "Fridge", "Mirror", "Lamp", "Carpet", "Curtain",
    "Pillow", "Blanket", "Shelf", "Drawer", "Washing machine",
  ]),
  cat("verbs", "Action Verbs", "Fiiller", "medium", [
    "Run", "Jump", "Swim", "Cook", "Dance", "Sing", "Read", "Write", "Drive", "Fly",
    "Sleep", "Eat", "Laugh", "Cry", "Think", "Build", "Travel", "Study",
  ]),
  cat("adjectives", "Descriptive Words", "Sıfatlar", "hard", [
    "Beautiful", "Dangerous", "Expensive", "Delicious", "Enormous", "Brilliant",
    "Creative", "Generous", "Mysterious", "Comfortable", "Unforgettable", "Ambitious",
  ]),
];

/** Letters used in classroom play (skip rare letters). */
export const CATEGORY_BLITZ_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "R", "S", "T", "U", "V", "W", "Y", "Z",
] as const;

export function getSamplesForLetter(
  category: CategoryBlitzCategory,
  letter: string
): string[] {
  const upper = letter.toUpperCase();
  return category.samples.filter((w) => w.toUpperCase().startsWith(upper));
}

/** Pick a letter that has at least one sample answer for this category. */
export function pickLetterForCategory(category: CategoryBlitzCategory): string {
  const viable = CATEGORY_BLITZ_LETTERS.filter(
    (l) => getSamplesForLetter(category, l).length > 0
  );
  const pool = viable.length > 0 ? viable : [...CATEGORY_BLITZ_LETTERS];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Letter-matched samples, or general category samples when none match. */
export function getHintSamples(
  category: CategoryBlitzCategory,
  letter: string
): { samples: string[]; matchesLetter: boolean } {
  const matched = getSamplesForLetter(category, letter);
  if (matched.length > 0) {
    return { samples: matched, matchesLetter: true };
  }
  return { samples: category.samples.slice(0, 8), matchesLetter: false };
}

export const CATEGORY_BLITZ_DIFFICULTY_COUNTS = CATEGORY_BLITZ_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.difficulty] += 1;
    acc.all += 1;
    return acc;
  },
  { all: 0, easy: 0, medium: 0, hard: 0 } as Record<"all" | CategoryBlitzCategory["difficulty"], number>
);
