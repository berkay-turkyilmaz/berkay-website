import type { HeadsUpCard } from "../types";

const h = (
  id: string,
  word: string,
  category: HeadsUpCard["category"],
  hint: string,
  difficulty: HeadsUpCard["difficulty"] = "medium"
): HeadsUpCard => ({ id, word, category, hint, difficulty });

export const HEADS_UP_CARDS_EXTENDED: HeadsUpCard[] = [
  // CELEBRITIES — International
  h("hc01", "Taylor Swift", "celebrities", "Şarkıcı", "medium"),
  h("hc02", "Leonardo DiCaprio", "celebrities", "Oyuncu", "medium"),
  h("hc03", "Beyoncé", "celebrities", "Şarkıcı", "medium"),
  h("hc04", "Tom Holland", "celebrities", "Spider-Man oyuncusu", "medium"),
  h("hc05", "Cristiano Ronaldo", "celebrities", "Futbolcu", "medium"),
  h("hc06", "Lionel Messi", "celebrities", "Futbolcu", "medium"),
  h("hc07", "Rihanna", "celebrities", "Şarkıcı", "medium"),
  h("hc08", "Dwayne Johnson", "celebrities", "The Rock", "medium"),
  h("hc09", "Billie Eilish", "celebrities", "Şarkıcı", "medium"),
  h("hc10", "Keanu Reeves", "celebrities", "Matrix oyuncusu", "medium"),
  h("hc11", "Zendaya", "celebrities", "Oyuncu", "medium"),
  h("hc12", "Ariana Grande", "celebrities", "Şarkıcı", "medium"),
  h("hc13", "Drake", "celebrities", "Rapçi", "medium"),
  h("hc14", "Lady Gaga", "celebrities", "Şarkıcı", "medium"),
  h("hc15", "Elon Musk", "celebrities", "Tesla / SpaceX", "hard"),
  h("hc16", "Selena Gomez", "celebrities", "Şarkıcı / oyuncu", "medium"),
  h("hc17", "Justin Bieber", "celebrities", "Şarkıcı", "medium"),
  h("hc18", "Kylie Jenner", "celebrities", "Influencer", "medium"),
  h("hc19", "MrBeast", "celebrities", "YouTuber", "medium"),
  h("hc20", "PewDiePie", "celebrities", "YouTuber", "medium"),

  // CELEBRITIES — Turkish / regional
  h("htc01", "Tarkan", "celebrities", "Türk pop yıldızı", "medium"),
  h("htc02", "Hadise", "celebrities", "Türk-Belçikalı şarkıcı", "medium"),
  h("htc03", "Cem Yılmaz", "celebrities", "Komedyen", "medium"),
  h("htc04", "Arda Güler", "celebrities", "Futbolcu", "medium"),
  h("htc05", "Murat Boz", "celebrities", "Türk şarkıcı", "medium"),
  h("htc06", "Şebnem Ferah", "celebrities", "Rock şarkıcı", "hard"),
  h("htc07", "Kenan İmirzalıoğlu", "celebrities", "Türk oyuncu", "hard"),
  h("htc08", "Bergüzar Korel", "celebrities", "Türk oyuncu", "hard"),

  // MOVIES
  h("hm01", "Titanic", "movies", "Gemici aşk filmi", "medium"),
  h("hm02", "Harry Potter", "movies", "Büyücü çocuk", "medium"),
  h("hm03", "Star Wars", "movies", "Uzay destanı", "medium"),
  h("hm04", "Avatar", "movies", "Mavi insanlar", "medium"),
  h("hm05", "The Lion King", "movies", "Aslan Simba", "medium"),
  h("hm06", "Frozen", "movies", "Elsa ve Anna", "medium"),
  h("hm07", "Spider-Man", "movies", "Örümcek Adam", "medium"),
  h("hm08", "Barbie", "movies", "Pembe film", "medium"),
  h("hm09", "Inception", "movies", "Rüya filmi", "hard"),
  h("hm10", "The Matrix", "movies", "Kırmızı hap", "medium"),
  h("hm11", "Jurassic Park", "movies", "Dinozorlar", "medium"),
  h("hm12", "Fast and Furious", "movies", "Araba yarışı", "medium"),
  h("hm13", "Oppenheimer", "movies", "Atom bombası", "hard"),
  h("hm14", "Interstellar", "movies", "Uzay ve zaman", "hard"),
  h("hm15", "The Godfather", "movies", "Mafya klasiği", "hard"),

  // Turkish cinema
  h("htm01", "Recep İvedik", "movies", "Türk komedi", "medium"),
  h("htm02", "G.O.R.A.", "movies", "Uzay komedisi", "medium"),
  h("htm03", "Eşkıya", "movies", "Klasik Türk filmi", "hard"),

  // More everyday (medium)
  h("hmv01", "Smartphone", "everyday", "Akıllı telefon", "medium"),
  h("hmv02", "Laptop", "everyday", "Dizüstü bilgisayar", "medium"),
  h("hmv03", "Headphones", "everyday", "Kulaklık", "medium"),
  h("hmv04", "Backpack", "everyday", "Sırt çantası", "medium"),
  h("hmv05", "Umbrella", "everyday", "Şemsiye", "medium"),
  h("hmv06", "Wallet", "everyday", "Cüzdan", "medium"),
  h("hmv07", "Glasses", "everyday", "Gözlük", "medium"),
  h("hmv08", "Mirror", "everyday", "Ayna", "medium"),
  h("hmv09", "Toothbrush", "everyday", "Diş fırçası", "medium"),
  h("hmv10", "Remote control", "everyday", "Kumanda", "medium"),

  // B1 travel & school
  h("hmv11", "Passport", "places", "Pasaport", "medium"),
  h("hmv12", "Suitcase", "places", "Bavul", "easy"),
  h("hmv13", "Boarding pass", "transport", "Biniş kartı", "hard"),
  h("hmv14", "Dictionary", "everyday", "Sözlük", "easy"),
  h("hmv15", "Whiteboard", "everyday", "Tahta", "easy"),
  h("hmv16", "Calculator", "everyday", "Hesap makinesi", "easy"),
  h("hmv17", "Stadium", "places", "Stadyum", "medium"),
  h("hmv18", "Pharmacy", "places", "Eczane", "medium"),
];
