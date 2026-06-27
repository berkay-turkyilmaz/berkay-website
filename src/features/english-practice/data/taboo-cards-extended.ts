import type { TabooCard, TabooDifficulty } from "../types";

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

/** Celebrities, movies, pop culture — medium/hard classroom decks */
export const TABOO_CARDS_EXTENDED: TabooCard[] = [
  // INTERNATIONAL CELEBRITIES
  c("cel01", "Taylor Swift", ["singer", "music", "pop", "concert", "album"], "celebrities", "Şarkıcı", "medium"),
  c("cel02", "Leonardo DiCaprio", ["actor", "Titanic", "movie", "Hollywood", "Oscar"], "celebrities", "Oyuncu", "medium"),
  c("cel03", "Beyoncé", ["singer", "music", "Queen", "concert", "pop"], "celebrities", "Şarkıcı", "medium"),
  c("cel04", "Tom Holland", ["Spider-Man", "actor", "British", "Marvel", "young"], "celebrities", "Oyuncu", "medium"),
  c("cel05", "Rihanna", ["singer", "music", "pop", "Barbados", "beauty"], "celebrities", "Şarkıcı", "medium"),
  c("cel06", "Cristiano Ronaldo", ["football", "soccer", "Portugal", "goal", "sport"], "celebrities", "Futbolcu", "medium"),
  c("cel07", "Lionel Messi", ["football", "soccer", "Argentina", "Barcelona", "goal"], "celebrities", "Futbolcu", "medium"),
  c("cel08", "Elon Musk", ["Tesla", "Twitter", "billionaire", "SpaceX", "tech"], "celebrities", "İş insanı", "hard"),
  c("cel09", "Billie Eilish", ["singer", "young", "music", "green", "pop"], "celebrities", "Şarkıcı", "medium"),
  c("cel10", "Dwayne Johnson", ["actor", "wrestling", "Rock", "muscle", "movie"], "celebrities", "Oyuncu", "medium"),
  c("cel11", "Ariana Grande", ["singer", "pop", "music", "voice", "concert"], "celebrities", "Şarkıcı", "medium"),
  c("cel12", "Keanu Reeves", ["actor", "Matrix", "John Wick", "nice", "movie"], "celebrities", "Oyuncu", "medium"),
  c("cel13", "Zendaya", ["actress", "Spider-Man", "young", "Disney", "fashion"], "celebrities", "Oyuncu", "medium"),
  c("cel14", "Drake", ["rapper", "music", "Canada", "song", "hip-hop"], "celebrities", "Rapçi", "medium"),
  c("cel15", "Lady Gaga", ["singer", "pop", "music", "costume", "concert"], "celebrities", "Şarkıcı", "medium"),

  // TURKISH / REGIONAL CELEBRITIES (English names)
  c("trc01", "Tarkan", ["singer", "Turkish", "pop", "music", "Kiss"], "celebrities", "Türk şarkıcı", "medium"),
  c("trc02", "Hadise", ["singer", "Turkish", "Belgium", "Eurovision", "pop"], "celebrities", "Türk şarkıcı", "medium"),
  c("trc03", "Kenan İmirzalıoğlu", ["actor", "Turkish", "TV", "Ezel", "drama"], "celebrities", "Türk oyuncu", "hard"),
  c("trc04", "Cem Yılmaz", ["comedian", "Turkish", "funny", "stand-up", "movie"], "celebrities", "Komedyen", "medium"),
  c("trc05", "Şebnem Ferah", ["singer", "rock", "Turkish", "music", "voice"], "celebrities", "Rock şarkıcı", "hard"),
  c("trc06", "Arda Güler", ["football", "Real Madrid", "young", "Turkey", "midfielder"], "celebrities", "Futbolcu", "medium"),
  c("trc07", "Murat Boz", ["singer", "Turkish", "pop", "music", "dance"], "celebrities", "Türk şarkıcı", "medium"),
  c("trc08", "Bergüzar Korel", ["actress", "Turkish", "TV", "drama", "Halit"], "celebrities", "Türk oyuncu", "hard"),

  // MOVIES
  c("mov01", "Titanic", ["ship", "Leonardo", "iceberg", "love", "ocean"], "movies", "Film", "medium"),
  c("mov02", "Harry Potter", ["wizard", "magic", "Hogwarts", "book", "wand"], "movies", "Film serisi", "medium"),
  c("mov03", "Star Wars", ["space", "Jedi", "lightsaber", "Darth", "galaxy"], "movies", "Bilim kurgu", "medium"),
  c("mov04", "The Godfather", ["mafia", "Italy", "family", "crime", "classic"], "movies", "Klasik film", "hard"),
  c("mov05", "Inception", ["dream", "Leonardo", "Nolan", "sleep", "mind"], "movies", "Film", "hard"),
  c("mov06", "Avatar", ["blue", "Pandora", "James Cameron", "3D", "alien"], "movies", "Film", "medium"),
  c("mov07", "The Lion King", ["lion", "Disney", "Simba", "Africa", "animation"], "movies", "Animasyon", "medium"),
  c("mov08", "Frozen", ["Disney", "ice", "Elsa", "snow", "sister"], "movies", "Animasyon", "medium"),
  c("mov09", "Jurassic Park", ["dinosaur", "island", "T-Rex", "science", "theme park"], "movies", "Film", "medium"),
  c("mov10", "The Matrix", ["Neo", "computer", "pill", "reality", "Keanu"], "movies", "Film", "medium"),
  c("mov11", "Interstellar", ["space", "Nolan", "black hole", "time", "corn"], "movies", "Film", "hard"),
  c("mov12", "Barbie", ["doll", "pink", "Margot", "Ken", "plastic"], "movies", "Film", "medium"),
  c("mov13", "Oppenheimer", ["bomb", "atomic", "Nolan", "war", "scientist"], "movies", "Film", "hard"),
  c("mov14", "Spider-Man", ["Marvel", "web", "superhero", "Peter", "swing"], "movies", "Süper kahraman", "medium"),
  c("mov15", "Fast and Furious", ["car", "race", "Vin Diesel", "family", "speed"], "movies", "Aksiyon", "medium"),

  // TURKISH CINEMA
  c("trm01", "Recep İvedik", ["comedy", "Turkish", "funny", "Şahan", "mustache"], "movies", "Türk komedi", "medium"),
  c("trm02", "Ayla", ["war", "Korea", "Turkish", "daughter", "emotional"], "movies", "Türk filmi", "hard"),
  c("trm03", "Eşkıya", ["Turkish", "classic", "bandit", "Şener", "crime"], "movies", "Klasik Türk filmi", "hard"),
  c("trm04", "G.O.R.A.", ["comedy", "space", "Turkish", "Cem Yılmaz", "sci-fi"], "movies", "Türk komedi", "medium"),
  c("trm05", "Miracle in Cell No. 7", ["prison", "father", "daughter", "Turkish", "emotional"], "movies", "Türk filmi", "hard"),

  // TV & POP CULTURE
  c("tv01", "Netflix", ["stream", "watch", "series", "movie", "subscription"], "entertainment", "Platform", "medium"),
  c("tv02", "YouTube", ["video", "watch", "channel", "subscribe", "online"], "entertainment", "Platform", "medium"),
  c("tv03", "Instagram", ["photo", "social media", "story", "follow", "app"], "entertainment", "Sosyal medya", "medium"),
  c("tv04", "TikTok", ["video", "short", "dance", "app", "viral"], "entertainment", "Sosyal medya", "medium"),
  c("tv05", "Game of Thrones", ["dragon", "HBO", "throne", "winter", "fantasy"], "entertainment", "Dizi", "medium"),
  c("tv06", "Stranger Things", ["Netflix", "Upside Down", "kids", "80s", "monster"], "entertainment", "Dizi", "medium"),
  c("tv07", "Breaking Bad", ["chemistry", "meth", "Walter", "drug", "HBO"], "entertainment", "Dizi", "hard"),
  c("tv08", "Squid Game", ["Korea", "Netflix", "red", "green", "survival"], "entertainment", "Dizi", "medium"),

  // ADVANCED VOCABULARY
  c("adv01", "Artificial Intelligence", ["computer", "robot", "machine", "learn", "ChatGPT"], "technology", "Yapay zeka", "hard"),
  c("adv02", "Climate Change", ["global warming", "earth", "pollution", "temperature", "environment"], "technology", "İklim değişikliği", "hard"),
  c("adv03", "Entrepreneur", ["business", "startup", "founder", "company", "risk"], "worklife", "Girişimci", "hard"),
  c("adv04", "Sustainability", ["environment", "green", "future", "recycle", "planet"], "technology", "Sürdürülebilirlik", "hard"),
  c("adv05", "Cryptocurrency", ["Bitcoin", "digital", "blockchain", "money", "wallet"], "technology", "Kripto para", "hard"),
  c("adv06", "Remote Work", ["home", "office", "online", "Zoom", "laptop"], "worklife", "Uzaktan çalışma", "medium"),
  c("adv07", "Influencer", ["social media", "follower", "Instagram", "brand", "content"], "social", "Fenomen", "medium"),
  c("adv08", "Podcast", ["listen", "audio", "episode", "host", "Spotify"], "entertainment", "Podcast", "medium"),

  // B1/B2 classroom vocabulary
  c("adv09", "Negotiation",  ["deal", "agree", "business", "price", "contract"],          "worklife",    "Pazarlık",          "hard"),
  c("adv10", "Presentation", ["slides", "speak", "audience", "PowerPoint", "meeting"],    "worklife",    "Sunum",             "medium"),
  c("adv11", "Interview",    ["job", "questions", "employer", "CV", "hire"],              "worklife",    "Mülakat",           "medium"),
  c("adv12", "Neighbourhood",["area", "local", "street", "community", "near"],            "places",      "Mahalle",           "medium"),
  c("adv13", "Recycling",    ["waste", "bin", "plastic", "environment", "reuse"],         "places",      "Geri dönüşüm",      "medium"),
  c("adv14", "Volunteering", ["help", "charity", "free", "community", "work"],            "social",      "Gönüllülük",        "medium"),
  c("adv15", "Homework",     ["school", "study", "teacher", "assignment", "class"],       "social",      "Ödev",              "easy"),

  // ── TECHNOLOGY / AI — hard ────────────────────────────────────────────────
  c("tech01", "Machine Learning",  ["AI", "data", "algorithm", "train", "model"],              "technology", "Makine öğrenmesi",    "hard"),
  c("tech02", "Algorithm",         ["steps", "code", "computer", "solve", "program"],           "technology", "Algoritma",           "hard"),
  c("tech03", "Automation",        ["robot", "machine", "program", "task", "manual"],           "technology", "Otomasyon",           "hard"),
  c("tech04", "Cybersecurity",     ["hack", "data", "protect", "online", "password"],           "technology", "Siber güvenlik",      "hard"),
  c("tech05", "Cloud Computing",   ["internet", "server", "store", "remote", "data"],           "technology", "Bulut bilişim",       "hard"),
  c("tech06", "Data Privacy",      ["personal", "protect", "share", "law", "information"],      "technology", "Veri gizliliği",      "hard"),
  c("tech07", "Open Source",       ["code", "free", "public", "share", "GitHub"],               "technology", "Açık kaynak",         "hard"),
  c("tech08", "Virtual Reality",   ["headset", "game", "3D", "immersive", "simulation"],        "technology", "Sanal gerçeklik",     "hard"),
  c("tech09", "Streaming",         ["watch", "online", "Netflix", "live", "video"],             "technology", "Yayın akışı",         "medium"),
  c("tech10", "API",               ["connect", "software", "data", "request", "developer"],     "technology", "Uygulama programlama arayüzü", "hard"),
  c("tech11", "Blockchain",        ["Bitcoin", "chain", "secure", "crypto", "ledger"],          "technology", "Blok zinciri",        "hard"),
  c("tech12", "Augmented Reality", ["camera", "overlay", "real world", "phone", "virtual"],     "technology", "Artırılmış gerçeklik","hard"),

  // ── BUSINESS / FORMAL — hard ─────────────────────────────────────────────
  c("bz01", "Strategy",      ["plan", "goal", "business", "long-term", "achieve"],             "worklife", "Strateji",          "hard"),
  c("bz02", "Stakeholder",   ["company", "interest", "investor", "owner", "involved"],         "worklife", "Paydaş",            "hard"),
  c("bz03", "Revenue",       ["money", "income", "company", "earn", "sales"],                  "worklife", "Gelir / Hasılat",   "hard"),
  c("bz04", "Outsource",     ["hire", "external", "company", "task", "cheaper"],               "worklife", "Dış kaynak kullanmak","hard"),
  c("bz05", "Innovation",    ["new", "idea", "create", "change", "invent"],                    "worklife", "İnovasyon",         "hard"),
  c("bz06", "Methodology",   ["approach", "process", "way", "system", "plan"],                 "worklife", "Metodoloji",        "hard"),
  c("bz07", "Benchmark",     ["compare", "standard", "measure", "best", "performance"],        "worklife", "Kıyaslama ölçütü",  "hard"),
  c("bz08", "Facilitate",    ["help", "make easier", "lead", "organise", "support"],           "worklife", "Kolaylaştırmak",    "hard"),
  c("bz09", "Portfolio",     ["work", "projects", "samples", "career", "collection"],          "worklife", "Portföy",           "hard"),
  c("bz10", "Merger",        ["company", "join", "buy", "combine", "business"],                "worklife", "Birleşme",          "hard"),
  c("bz11", "Dividend",      ["money", "profit", "invest", "shares", "pay"],                   "worklife", "Temettü",           "hard"),
  c("bz12", "Scalability",   ["grow", "system", "bigger", "capacity", "tech"],                 "worklife", "Ölçeklenebilirlik", "hard"),

  // ── ENVIRONMENT / SUSTAINABILITY — hard ──────────────────────────────────
  c("eco01", "Carbon Footprint",   ["CO2", "environment", "travel", "reduce", "emissions"],    "places", "Karbon ayak izi",    "hard"),
  c("eco02", "Renewable Energy",   ["solar", "wind", "clean", "power", "sustainable"],         "places", "Yenilenebilir enerji","hard"),
  c("eco03", "Biodiversity",       ["species", "nature", "animals", "plants", "ecosystem"],    "places", "Biyoçeşitlilik",     "hard"),
  c("eco04", "Deforestation",      ["trees", "cut", "jungle", "Amazon", "forest"],             "places", "Ormansızlaşma",      "hard"),
  c("eco05", "Emissions",          ["CO2", "gas", "pollution", "factory", "climate"],          "places", "Emisyon / Atık",     "hard"),
  c("eco06", "Sustainable Development",["future", "economy", "environment", "balance", "green"],"places","Sürdürülebilir kalkınma","hard"),
  c("eco07", "Ecosystem",          ["nature", "animals", "plants", "environment", "balance"],  "places", "Ekosistem",          "hard"),
  c("eco08", "Conservation",       ["protect", "save", "nature", "wildlife", "national park"], "places", "Doğa koruma",        "hard"),

  // ── ABSTRACT / ACADEMIC — hard ────────────────────────────────────────────
  c("abs01", "Democracy",      ["vote", "election", "government", "people", "rights"],         "social", "Demokrasi",         "hard"),
  c("abs02", "Ideology",       ["belief", "politics", "ideas", "system", "group"],             "social", "İdeoloji",          "hard"),
  c("abs03", "Empathy",        ["feel", "understand", "others", "emotions", "care"],           "emotions","Empati",            "hard"),
  c("abs04", "Prejudice",      ["judge", "before", "bias", "unfair", "assume"],                "social", "Önyargı",           "hard"),
  c("abs05", "Hypothesis",     ["idea", "test", "science", "experiment", "theory"],            "technology","Hipotez",         "hard"),
  c("abs06", "Perspective",    ["view", "opinion", "angle", "point", "see"],                   "social", "Bakış açısı",       "hard"),
  c("abs07", "Consequence",    ["result", "happen", "effect", "after", "because"],             "social", "Sonuç / Etki",      "hard"),
  c("abs08", "Responsibility", ["duty", "must", "role", "obligation", "yours"],                "social", "Sorumluluk",        "hard"),
  c("abs09", "Equality",       ["same", "rights", "fair", "gender", "race"],                   "social", "Eşitlik",           "hard"),
  c("abs10", "Freedom",        ["choice", "right", "speak", "go", "liberty"],                  "social", "Özgürlük",          "hard"),
  c("abs11", "Compromise",     ["agree", "both", "middle", "give", "take"],                    "social", "Uzlaşma",           "hard"),
  c("abs12", "Bureaucracy",    ["forms", "government", "rules", "slow", "paperwork"],          "social", "Bürokrasi",         "hard"),
  c("abs13", "Stereotype",     ["judge", "group", "assume", "always", "type"],                 "social", "Kalıp yargı",       "hard"),
  c("abs14", "Procrastinate",  ["later", "delay", "avoid", "wait", "lazy"],                    "hobbies","Ertelemek",         "hard"),

  // ── HEALTH / MEDICAL — hard ──────────────────────────────────────────────
  c("med01", "Diagnosis",     ["doctor", "sick", "find", "disease", "test"],                   "people", "Teşhis",            "hard"),
  c("med02", "Symptom",       ["pain", "sick", "feel", "body", "sign"],                        "people", "Belirti",           "hard"),
  c("med03", "Prescription",  ["doctor", "medicine", "paper", "pharmacy", "drug"],             "people", "Reçete",            "hard"),
  c("med04", "Mental Health",  ["mind", "stress", "therapy", "emotion", "wellbeing"],           "emotions","Ruh sağlığı",      "hard"),
  c("med05", "Vaccination",   ["needle", "protect", "disease", "children", "immune"],          "people", "Aşılama",           "hard"),
  c("med06", "Pandemic",      ["virus", "world", "COVID", "spread", "lockdown"],               "places", "Pandemi",           "hard"),

  // ── EDUCATION / CAMPUS — hard ────────────────────────────────────────────
  c("edu01", "Scholarship",   ["money", "study", "university", "award", "free"],               "places", "Burs",              "hard"),
  c("edu02", "Dissertation",  ["write", "university", "research", "long", "thesis"],           "places", "Tez / Bitirme ödevi","hard"),
  c("edu03", "Plagiarism",    ["copy", "others", "work", "cheat", "publish"],                  "places", "İntihal",           "hard"),
  c("edu04", "Curriculum",    ["school", "subjects", "plan", "teach", "year"],                 "places", "Müfredat",          "hard"),
  c("edu05", "Tuition",       ["school", "money", "pay", "university", "cost"],                "places", "Öğrenim ücreti",    "hard"),

  // ── ECONOMICS / FINANCE — hard ───────────────────────────────────────────
  c("fin01", "Inflation",     ["prices", "money", "rise", "economy", "value"],                "worklife", "Enflasyon",         "hard"),
  c("fin02", "Investment",    ["money", "stocks", "return", "risk", "future"],                 "worklife", "Yatırım",           "hard"),
  c("fin03", "Recession",     ["economy", "slow", "jobs", "money", "crisis"],                  "worklife", "Durgunluk",         "hard"),
  c("fin04", "Cryptocurrency",["Bitcoin", "digital", "wallet", "blockchain", "invest"],        "technology","Kripto para",      "hard"),
  c("fin05", "Interest rate", ["bank", "loan", "money", "borrow", "percent"],                  "worklife", "Faiz oranı",        "hard"),

  // ── ARTS & CULTURE — hard ────────────────────────────────────────────────
  c("art01", "Renaissance",   ["Italy", "art", "history", "Leonardo", "period"],               "entertainment","Rönesans",       "hard"),
  c("art02", "Contemporary",  ["modern", "now", "current", "art", "recent"],                   "entertainment","Çağdaş",         "hard"),
  c("art03", "Exhibition",    ["museum", "art", "show", "display", "gallery"],                 "entertainment","Sergi",           "hard"),
  c("art04", "Choreography",  ["dance", "moves", "design", "stage", "steps"],                  "entertainment","Koreografi",     "hard"),
  c("art05", "Satire",        ["funny", "criticize", "politics", "humour", "mock"],            "entertainment","Hiciv / Satir",  "hard"),
];
