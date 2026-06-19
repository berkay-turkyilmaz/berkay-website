import type { CharadesCard, TabooDifficulty } from "../types";

const c = (
  id: string,
  word: string,
  category: CharadesCard["category"],
  hint: string,
  difficulty: TabooDifficulty = "medium"
): CharadesCard => ({ id, word, category, hint, difficulty });

/** Extended mime deck — movies & showbiz as actable scenes */
export const CHARADES_CARDS_EXTENDED: CharadesCard[] = [
  // MOVIES — mime a scene, not the title literally
  c("cm01", "Titanic", "movies", "Geminin pruvası, kollar açık", "medium"),
  c("cm02", "Harry Potter", "movies", "Asa sallamak, büyü", "medium"),
  c("cm03", "Spider-Man", "movies", "İp atlamak, örümcek", "easy"),
  c("cm04", "The Lion King", "movies", "Aslan kükremesi", "easy"),
  c("cm05", "Frozen", "movies", "Buz yapmak, kraliçe", "easy"),
  c("cm06", "Jurassic Park", "movies", "Dinozor kovalamaca", "medium"),
  c("cm07", "Fast and Furious", "movies", "Araba yarışı, hız", "medium"),
  c("cm08", "Batman", "movies", "Yarasa, pelerin", "easy"),
  c("cm09", "Superman", "movies", "Uçmak, pelerin", "easy"),
  c("cm10", "Jaws", "movies", "Köpekbalığı, yüzme", "medium"),
  c("cm11", "Rocky", "movies", "Boks, merdiven", "medium"),
  c("cm12", "Star Wars", "movies", "Işık kılıcı", "medium"),
  c("cm13", "Recep İvedik", "movies", "Komik yürüyüş, bıyık", "medium"),
  c("cm14", "Matrix", "movies", "Kurşun kaçırma", "hard"),

  // SHOWBIZ — actable concepts
  c("cc01", "Playing guitar", "celebrities", "Gitar çalmak", "easy"),
  c("cc02", "Singing on stage", "celebrities", "Sahne şarkısı", "easy"),
  c("cc03", "Scoring a goal", "celebrities", "Gol sevinci", "easy"),
  c("cc04", "Taking a selfie", "celebrities", "Selfie", "easy"),
  c("cc05", "Red carpet", "celebrities", "Kırmızı halı yürüyüşü", "medium"),
  c("cc06", "Winning an award", "celebrities", "Ödül kaldırmak", "medium"),
  c("cc07", "Paparazzi", "celebrities", "Fotoğraf çekmek", "hard"),
  c("cc08", "Movie premiere", "celebrities", "Flaşlar, poz", "medium"),

  // MORE MIME ACTIONS
  c("ca01", "Skateboarding", "actions", "Kaykay", "medium"),
  c("ca02", "Playing piano", "actions", "Piyano", "medium"),
  c("ca03", "Meditating", "actions", "Lotus pozisyonu", "medium"),
  c("ca04", "Texting", "actions", "Mesaj yazmak", "easy"),
  c("ca05", "Doing homework", "actions", "Ödev", "easy"),
  c("ca06", "Riding a bike", "actions", "Bisiklet", "easy"),
  c("ca07", "Playing video games", "actions", "Konsol oynamak", "easy"),
  c("ca08", "Shopping", "actions", "Alışveriş çantası", "easy"),
  c("ca09", "Giving a presentation", "actions", "Sunum, slayt", "hard"),
  c("ca10", "Taking a shower", "actions", "Duş almak", "medium"),
  c("ca11", "Fishing", "actions", "Olta atmak", "medium"),
  c("ca12", "Hammering", "actions", "Çivi çakmak", "hard"),
  c("ca13", "Painting", "actions", "Resim yapmak", "medium"),
  c("ca14", "Photographing", "actions", "Fotoğraf çekmek", "easy"),
  c("ca15", "Sneezing", "actions", "Hapşırık", "easy"),

  // MORE SPORTS
  c("cs01", "Swimming", "sports", "Yüzme", "easy"),
  c("cs02", "Volleyball", "sports", "Voleybol", "medium"),
  c("cs03", "Golf", "sports", "Golf sopası", "medium"),
  c("cs04", "Archery", "sports", "Ok atmak", "hard"),
  c("cs05", "Ice skating", "sports", "Buz pateni", "hard"),

  // MORE ANIMALS
  c("cn01", "Lion", "animals", "Kükreme", "easy"),
  c("cn02", "Snake", "animals", "Sürünmek", "easy"),
  c("cn03", "Butterfly", "animals", "Kanat çırpma", "easy"),
  c("cn04", "Kangaroo", "animals", "Zıplamak", "medium"),
  c("cn05", "Penguin", "animals", "Waddle yürüyüş", "easy"),
  c("cn06", "Shark", "animals", "Yüzgeç, diş", "medium"),
  c("cn07", "Horse", "animals", "At koşusu", "easy"),
  c("cn08", "Bee", "animals", "Vızıldamak", "easy"),

  // B1/B2 mime-friendly
  c("cn09", "Cooking", "actions", "Yemek pişirmek", "easy"),
  c("cn10", "Typing", "actions", "Klavye", "easy"),
  c("cn11", "Photography", "actions", "Fotoğraf çekmek", "medium"),
  c("cn12", "Rock climbing", "sports", "Tırmanış", "hard"),
  c("cn13", "Yawning", "actions", "Esneme", "easy"),
  c("cn14", "Whispering", "actions", "Fısıldamak", "easy"),
  c("cn15", "Applause", "actions", "Alkış", "easy"),
];
