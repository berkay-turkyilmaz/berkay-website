"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ============ TYPES ============
type Flashcard = {
  f: string; // front (English)
  b: string; // back (Turkish)
  p: string; // pronunciation
};

type Preposition = {
  s: string; // sentence
  o: string[]; // options
  c: number; // correct index
  e: string; // explanation
  cat: string; // category
  d: 'easy' | 'medium' | 'hard'; // difficulty
};

type Question = {
  id: number;
  u: string; // unit
  t: string; // topic
  q: string; // question
  o: string[]; // options
  c: number; // correct index
  e: string; // explanation
  h: string; // hint
  de: string; // detailed explanation
  cm: string[]; // common mistakes
  src: 'zip' | 'headway' | 'original';
};

type GrammarRule = {
  u: string; // unit
  i: string; // icon
  title: string; // user friendly title
  r: string[]; // rules
  e: string[]; // examples
  note?: string; // extra note
};

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
  stats: {
    flashcardsViewed: number;
    prepPracticed: number;
  };
};

type Settings = {
  voiceAccent: 'en-GB' | 'en-US';
  showHints: boolean;
  darkMode: boolean;
};

type ExamResults = {
  questions: Array<Question & { userAnswer: number; isCorrect: boolean }>;
  correct: number;
  total: number;
  timeSpent: number;
  units: Record<string, { correct: number; total: number }>;
  score: number;
};

// ============ DATA ============
const ZIP_QUESTIONS = [
  "1. Circle the correct alternative: My name is/are Susan.",
  "2. Mrs. Rose isn't/aren't my aunt.",
  "3. Complete with in, on, at: I get up ___ 7 o'clock.",
  "4. Fill CAN/CAN'T: I ___ speak three languages.",
  "5. Prepositions of time: I was born ___ July / ___ 2006.",
  "6. Daily Routines: Wake up → get up → brush teeth sequence.",
  "7. Vocabulary: Match family members (father, mother, sister).",
  "8. Present Simple: She _____ (go) to work by bus.",
  "9. There is/are: _____ a library near here?",
  "10. Past Simple: I _____ (finish) my homework yesterday."
];

const PREPOSITIONS: Preposition[] = [
  { s: "I get up ___ 7 o'clock.", o: ["in", "on", "at", "to"], c: 2, e: "Saatlerle 'at' kullanılır.", cat: "time", d: "easy" },
  { s: "My birthday is ___ July.", o: ["in", "on", "at", "to"], c: 0, e: "Aylarla 'in': in July", cat: "time", d: "easy" },
  { s: "We meet ___ Monday.", o: ["in", "on", "at", "to"], c: 1, e: "Günlerle 'on': on Monday", cat: "time", d: "easy" },
  { s: "She was born ___ 1995.", o: ["in", "on", "at", "for"], c: 0, e: "Yıllarla 'in': in 1995", cat: "time", d: "easy" },
  { s: "I study ___ the evening.", o: ["in", "on", "at", "to"], c: 0, e: "'In the evening' (but: at night)", cat: "time", d: "medium" },
  { s: "The movie starts ___ midnight.", o: ["in", "on", "at", "to"], c: 2, e: "'At midnight' sabit ifade", cat: "time", d: "medium" },
  { s: "I'll see you ___ Christmas.", o: ["in", "on", "at", "for"], c: 2, e: "Bayramlar: at Christmas", cat: "time", d: "medium" },
  { s: "The book is ___ the table.", o: ["in", "on", "at", "to"], c: 1, e: "Yüzey üzerinde 'on'", cat: "place", d: "easy" },
  { s: "I live ___ Istanbul.", o: ["in", "on", "at", "to"], c: 0, e: "Şehirler: in Istanbul", cat: "place", d: "easy" },
  { s: "She's waiting ___ the bus stop.", o: ["in", "on", "at", "to"], c: 2, e: "Belirli nokta: at the bus stop", cat: "place", d: "medium" },
  { s: "He works ___ a hospital.", o: ["in", "on", "at", "for"], c: 0, e: "Bina içinde 'in'", cat: "place", d: "easy" },
  { s: "There's a picture ___ the wall.", o: ["in", "on", "at", "to"], c: 1, e: "Duvarda asılı: on the wall", cat: "place", d: "easy" },
  { s: "She's ___ home now.", o: ["in", "on", "at", "to"], c: 2, e: "'At home' sabit ifade", cat: "place", d: "medium" },
  { s: "I'm going ___ school.", o: ["in", "on", "at", "to"], c: 3, e: "Hareket yönü: go to school", cat: "move", d: "easy" },
  { s: "She arrived ___ London.", o: ["in", "on", "at", "to"], c: 0, e: "Varış + şehir: arrive in", cat: "move", d: "hard" },
  { s: "This gift is ___ you.", o: ["for", "to", "at", "with"], c: 0, e: "'For' kime: for you", cat: "other", d: "easy" },
  { s: "I need this ___ tomorrow.", o: ["for", "to", "at", "by"], c: 0, e: "'For' zaman: for tomorrow", cat: "other", d: "medium" },
  { s: "Can I speak ___ you?", o: ["to", "with", "at", "for"], c: 0, e: "'Speak to' veya 'with'", cat: "other", d: "medium" },
  { s: "She came ___ her sister.", o: ["for", "to", "with", "by"], c: 2, e: "'With' birlikte", cat: "other", d: "easy" },
  { s: "I made this ___ my hands.", o: ["by", "with", "from", "in"], c: 1, e: "'With' araç: with my hands", cat: "other", d: "hard" },
  { s: "I go to work ___ bus.", o: ["by", "with", "in", "on"], c: 0, e: "'By' taşıma: by bus (artikelsiz)", cat: "other", d: "medium" },
  { s: "This book is ___ grammar.", o: ["about", "for", "of", "on"], c: 0, e: "'About' konu: about grammar", cat: "other", d: "medium" },
  { s: "I'm worried ___ the exam.", o: ["about", "for", "of", "with"], c: 0, e: "'Worried about' sabit ifade", cat: "other", d: "hard" },
  { s: "She's good ___ math.", o: ["at", "in", "on", "with"], c: 0, e: "'Good at' yetenek", cat: "other", d: "hard" },
  { s: "I'm interested ___ history.", o: ["in", "at", "on", "for"], c: 0, e: "'Interested in' sabit", cat: "other", d: "hard" },
  { s: "He's afraid ___ dogs.", o: ["of", "from", "with", "by"], c: 0, e: "'Afraid of' sabit", cat: "other", d: "medium" },
  { s: "The answer ___ your question.", o: ["to", "for", "of", "at"], c: 0, e: "'Answer to' the question", cat: "other", d: "hard" },
  { s: "I'm sorry ___ being late.", o: ["for", "about", "of", "to"], c: 0, e: "'Sorry for' özür", cat: "other", d: "medium" },
  { s: "This depends ___ weather.", o: ["on", "of", "from", "to"], c: 0, e: "'Depend on' bağlı olmak", cat: "other", d: "hard" },
  { s: "I agree ___ you.", o: ["with", "to", "on", "for"], c: 0, e: "'Agree with' someone", cat: "other", d: "hard" },
  { s: "She's famous ___ singing.", o: ["for", "in", "at", "with"], c: 0, e: "'Famous for' something", cat: "other", d: "hard" },
  { s: "I'm tired ___ waiting.", o: ["of", "from", "with", "for"], c: 0, e: "'Tired of' doing something", cat: "other", d: "medium" },
  { s: "He's proud ___ his son.", o: ["of", "for", "with", "about"], c: 0, e: "'Proud of' someone", cat: "other", d: "medium" },
  { s: "Different ___ the others.", o: ["from", "of", "to", "with"], c: 0, e: "'Different from' comparison", cat: "other", d: "hard" },
  { s: "Angry ___ the situation.", o: ["about", "with", "at", "for"], c: 0, e: "'Angry about' something", cat: "other", d: "hard" },
];

const QUESTIONS: Question[] = [
  { id: 1, u: "Unit 1-2", t: "To Be", q: "My name _____ John and I _____ from England.", o: ["is/am", "are/is", "am/are", "is/is"], c: 0, e: "'My name' tekil → is. 'I' → am.", h: "Öznelere dikkat et: 'My name' (it) ve 'I'.", de: "'My name' tekil ve 3. şahıs → 'is'. 'I' her zaman 'am' alır. Bu temel to be konjugasyonudur.", cm: ["'I is' demek YANLIŞ", "'My name are' çoğul gibi düşünme"], src: "zip" },
  { id: 2, u: "Unit 1-2", t: "To Be", q: "_____ your sister a teacher?", o: ["Is", "Are", "Am", "Be"], c: 0, e: "'Your sister' tekil (she) → Is.", h: "'Your sister' zamiri 'She'ye karşılık gelir.", de: "Soru yapısında to be fiili öne gelir. 'Your sister' = she (tekil 3. şahıs) → 'Is she...?'", cm: ["'Are your sister' çoğul karışıklığı"], src: "headway" },
  { id: 3, u: "Unit 1-2", t: "To Be", q: "We _____ from Spain. We're from Italy.", o: ["isn't", "aren't", "am not", "not"], c: 1, e: "'We' çoğul → aren't (are not).", h: "'Biz' (We) çoğul olduğu için çoğul yardımcı fiili kullan.", de: "Çoğul özneler 'are' alır, olumsuz hali 'aren't' (kısaltma) veya 'are not' (tam hali).", cm: ["'We isn't' tekil/çoğul karışıklığı"], src: "zip" },
  { id: 4, u: "Unit 3-4", t: "Present Simple", q: "She _____ to work by bus every day.", o: ["go", "goes", "going", "is going"], c: 1, e: "He/she/it + verb+s → goes.", h: "'Every day' geniş zaman ipucudur. 'She' öznesine dikkat.", de: "Present Simple'da he/she/it özneleri fiil+s/es alır. 'Go' → 'goes' (o ile bittiği için -es).", cm: ["'She go' ek unutma", "'She going' yanlış zaman"], src: "headway" },
  { id: 5, u: "Unit 3-4", t: "Present Simple", q: "I _____ coffee. I prefer tea.", o: ["don't drink", "doesn't drink", "am not drink", "not drink"], c: 0, e: "I/you/we/they → don't + verb.", h: "Geniş zamanda 'I' ile olumsuzluk eki 'don't'dur.", de: "Present Simple olumsuz: yardımcı fiil 'do/does' + 'not'. I/you/we/they ile 'don't', ana fiil yalın kalır.", cm: ["'I doesn't drink' yanlış yardımcı", "'I am not drink' yanlış yapı"], src: "original" },
  { id: 6, u: "Unit 5", t: "There is/are", q: "_____ a library near your house?", o: ["There is", "Is there", "There are", "Are there"], c: 1, e: "Soru: Is there + tekil.", h: "Soru olduğu için yardımcı fiil başa gelmeli ve 'library' tekil.", de: "'There is' yapısında soru yapmak için fiile yer değiştirme: 'Is there...?'. Tekil isimler için 'Is there', çoğul için 'Are there'.", cm: ["'There is a library?' fiil öne alınmadan"], src: "zip" },
  { id: 7, u: "Unit 6", t: "Can", q: "I _____ swim very well. I learned when I was 5.", o: ["can", "could", "can't", "am"], c: 0, e: "Şimdiki yetenek: can.", h: "Yüzebildiğini (olumlu yetenek) belirtiyor.", de: "'Can' modal fiilidir, yetenek/izin/olasılık ifade eder. Sonra fiil yalın gelir (to yok). 'Could' geçmiş yetenek içindir.", cm: ["'I can to swim' to eklemek", "'I cans' -s eklemek"], src: "headway" },
  { id: 8, u: "Unit 7-8", t: "Present Continuous", q: "She _____ a book right now. Don't disturb her.", o: ["reads", "is reading", "read", "reading"], c: 1, e: "Şu anda: am/is/are + verb-ing.", h: "'Right now' şu an demektir, şimdiki zaman kullan.", de: "Present Continuous şu anda devam eden eylemleri anlatır. Yapısı: am/is/are + verb-ing. She → is reading.", cm: ["'She reading' to be unutma", "'She reads' yanlış zaman"], src: "zip" },
  { id: 9, u: "Unit 9-10", t: "Past Simple", q: "I _____ my homework yesterday evening.", o: ["finish", "finished", "finishing", "finishes"], c: 1, e: "Past Simple: verb + -ed.", h: "'Yesterday' geçmiş zamandır. Düzenli fiil 'ed' alır.", de: "Past Simple geçmişte biten eylemleri anlatır. Düzenli fiillere '-ed': finish → finished. 'Yesterday' geçmiş zaman belirteci.", cm: ["'I finish' zaman uyumsuz", "'I finisheded' gereksiz tekrar"], src: "original" },
  { id: 10, u: "Unit 11", t: "Comparatives", q: "This book is _____ than that one.", o: ["interesting", "more interesting", "most interesting", "interestinger"], c: 1, e: "2+ hece: more + adjective + than.", h: "'Interesting' uzun bir sıfattır, 'more' ile kullanılır.", de: "Karşılaştırma: Kısa sıfatlar '-er' (tall→taller), uzun sıfatlar 'more' (interesting→more interesting) alır.", cm: ["'Interestinger' yanlış ek", "'Most interesting' üstünlük derecesi"], src: "headway" },
  { id: 11, u: "Unit 12", t: "Prepositions", q: "I usually wake up ___ 6:30 in the morning.", o: ["in", "on", "at", "to"], c: 2, e: "Saatlerle 'at': at 6:30.", h: "Saatlerden önce her zaman 'at' gelir.", de: "Zaman edatları: AT (saatler), ON (günler), IN (aylar/yıllar). 'At 6:30' = Saat 6:30'da.", cm: ["'In 6:30' veya 'on 6:30'"], src: "zip" },
  { id: 12, u: "Unit 13-14", t: "Going to", q: "I _____ visit my grandparents next weekend.", o: ["will", "am going to", "going to", "go to"], c: 1, e: "Planlar: be going to.", h: "Planlanmış gelecek zaman: am/is/are + going to.", de: "'Going to' planlar ve niyetler için. 'Will' anlık kararlar için. Yapısı: am/is/are + going to + verb.", cm: ["'I going to' to be unutma", "'I go to visit' yanlış yapı"], src: "headway" },
  { id: 13, u: "Vocabulary", t: "Family", q: "My mother's sister is my _____.", o: ["aunt", "uncle", "cousin", "niece"], c: 0, e: "Annenin kız kardeşi: aunt.", h: "Annenin kız kardeşi senin teyzen olur.", de: "Aile bağları: aunt (teyze/hala), uncle (amca/dayı), cousin (kuzen), niece (yeğen-kız).", cm: ["Cousin ile karıştırma - cousin amcanın çocuğu"], src: "zip" },
  { id: 14, u: "Vocabulary", t: "Daily Routines", q: "I always _____ my teeth before bed.", o: ["wash", "brush", "clean", "make"], c: 1, e: "'Brush your teeth' sabit collocation.", h: "Dişler yıkanmaz (wash), fırçalanır.", de: "İngilizce'de bazı kelimeler sabit birlikte kullanılır. 'Brush teeth' bunlardan biri. 'Wash' eller için.", cm: ["'Wash teeth' yanlış collocation"], src: "original" },
  { id: 15, u: "Unit 3-4", t: "Present Simple", q: "_____ your brother play football on Saturdays?", o: ["Do", "Does", "Is", "Are"], c: 1, e: "He/she/it soru: Does.", h: "'Your brother' (He) olduğu için 'Does' ile soru sorulur.", de: "Present Simple soru: do/does kullanılır. He/she/it → does, ana fiil yalın kalır (plays değil play).", cm: ["'Do your brother' yanlış yardımcı", "'Is your brother play' yanlış yapı"], src: "headway" },
];

const FLASHCARDS: Record<string, Flashcard[]> = {
  family: [
    { f: "Mother", b: "Anne", p: "/ˈmʌðə/" },
    { f: "Father", b: "Baba", p: "/ˈfɑːðə/" },
    { f: "Sister", b: "Kız kardeş", p: "/ˈsɪstə/" },
    { f: "Brother", b: "Erkek kardeş", p: "/ˈbrʌðə/" },
    { f: "Aunt", b: "Teyze/Hala", p: "/ɑːnt/" },
    { f: "Uncle", b: "Amca/Dayı", p: "/ˈʌŋkl/" }
  ],
  food: [
    { f: "Bread", b: "Ekmek", p: "/bred/" },
    { f: "Water", b: "Su", p: "/ˈwɔːtə/" },
    { f: "Coffee", b: "Kahve", p: "/ˈkɒfi/" },
    { f: "Tea", b: "Çay", p: "/tiː/" },
    { f: "Milk", b: "Süt", p: "/mɪlk/" }
  ],
  daily: [
    { f: "Wake up", b: "Uyanmak", p: "/weɪk ʌp/" },
    { f: "Get up", b: "Kalkmak", p: "/ɡet ʌp/" },
    { f: "Brush teeth", b: "Diş fırçalamak", p: "/brʌʃ tiːθ/" },
    { f: "Have breakfast", b: "Kahvaltı yapmak", p: "/hæv ˈbrekfəst/" }
  ],
  verbs: [
    { f: "Go", b: "Gitmek", p: "/ɡəʊ/" },
    { f: "Come", b: "Gelmek", p: "/kʌm/" },
    { f: "Eat", b: "Yemek", p: "/iːt/" },
    { f: "Drink", b: "İçmek", p: "/drɪŋk/" }
  ],
  // Yeni eklenen kategoriler
  jobs: [
    { f: "Teacher", b: "Öğretmen", p: "/ˈtiːtʃə/" },
    { f: "Doctor", b: "Doktor", p: "/ˈdɒktə/" },
    { f: "Engineer", b: "Mühendis", p: "/ˌendʒɪˈnɪə/" },
    { f: "Nurse", b: "Hemşire", p: "/nɜːs/" },
    { f: "Police Officer", b: "Polis Memuru", p: "/pəˈliːs ˈɒfɪsə/" }
  ],
  adjectives: [
    { f: "Happy", b: "Mutlu", p: "/ˈhæpi/" },
    { f: "Sad", b: "Üzgün", p: "/sæd/" },
    { f: "Big", b: "Büyük", p: "/bɪɡ/" },
    { f: "Small", b: "Küçük", p: "/smɔːl/" },
    { f: "Beautiful", b: "Güzel", p: "/ˈbjuːtɪfl/" }
  ]
};

const GRAMMAR: GrammarRule[] = [
  { 
    u: "Unit 1-2", 
    i: "📍", 
    title: "Verb 'to be'",
    r: ["I am (I'm)", "You/We/They are (You're)", "He/She/It is (He's)", "Olumsuz: not (I am not, She isn't)", "Soru: Fiil başa gelir (Are you...?)"], 
    e: ["I am a student at university.", "She is not from England.", "Are they married?"],
    note: "En temel fiildir. Durum, konum ve kimlik belirtir."
  },
  { 
    u: "Unit 3-4", 
    i: "🔄", 
    title: "Present Simple",
    r: ["Rutinler ve genel gerçekler için kullanılır.", "He/She/It öznelerinde fiil -s takısı alır.", "Soru/Olumsuz için 'do/does' kullanılır."], 
    e: ["I wake up at 7:00 every day.", "He plays football on Sundays.", "They don't like pizza."],
    note: "Unutma: Does kullanıldığında ana fiil 's' takısını atar (Does he play?)."
  },
  { 
    u: "Unit 7-8", 
    i: "⏳", 
    title: "Present Continuous",
    r: ["Şu anda (konuşma anında) yapılan eylemler.", "Formül: Subject + am/is/are + Verb-ing", "Zaman zarfları: now, at the moment, right now."], 
    e: ["I am watching TV now.", "She is sleeping at the moment.", "We are not working today."],
    note: "-ing takısı Türkçedeki '-yor' ekine benzer."
  },
  { 
    u: "Unit 9-10", 
    i: "📅", 
    title: "Past Simple",
    r: ["Geçmişte tamamlanmış eylemler.", "Düzenli fiiller -ed alır (play -> played).", "Düzensiz fiiller değişir (go -> went).", "Yardımcı fiil: did / didn't."], 
    e: ["I watched a movie yesterday.", "She went to Paris last year.", "Did you see him?"],
    note: "Yesterday, last week, in 2010 gibi geçmiş zaman ifadeleriyle kullanılır."
  }
];

// ============ MAIN COMPONENT ============
export default function EnglishPathPage() {
  // State management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'grammar' | 'flashcards' | 'prepositions' | 'exam' | 'results'>('dashboard');
  const [userData, setUserData] = useState<UserData>({
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
  });
  const [settings, setSettings] = useState<Settings>({
    voiceAccent: 'en-GB',
    showHints: true,
    darkMode: false
  });
  const [wrongAnswers, setWrongAnswers] = useState<Record<number, { count: number; lastSeen: number }>>({});
  const [examHistory, setExamHistory] = useState<Array<{ date: number; score: number; questions: Array<{ id: number; topic: string; isCorrect: boolean }> }>>([]);
  const [currentExam, setCurrentExam] = useState<{ questions: Question[]; answers: Record<number, number>; startTime: number | null; active: boolean }>({
    questions: [],
    answers: {},
    startTime: null,
    active: false
  });
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [prepAnswers, setPrepAnswers] = useState<Set<number>>(new Set());
  const [prepScore, setPrepScore] = useState({ correct: 0, total: 0 });
  const [prepFeedback, setPrepFeedback] = useState<Record<number, { correct: boolean; msg: string; sel: number }>>({});
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [flashcardCategory, setFlashcardCategory] = useState<string>('all');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [inactivityWarning, setInactivityWarning] = useState<string | null>(null);
  
  // New State for Pop-up Hint
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const examTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('englishpath');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.userData) setUserData(data.userData);
        if (data.wrongAnswers) setWrongAnswers(data.wrongAnswers);
        if (data.examHistory) setExamHistory(data.examHistory);
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.darkMode) {
            document.documentElement.classList.add('dark');
          }
        }
      } catch (e) {
        console.error('Failed to load state:', e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('englishpath', JSON.stringify({
      userData,
      wrongAnswers,
      examHistory,
      settings
    }));
  }, [userData, wrongAnswers, examHistory, settings]);

  // Inactivity monitor
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    
    ['mousemove', 'keydown', 'click'].forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    inactivityTimerRef.current = setInterval(() => {
      if (currentExam.active) {
        const inactive = (Date.now() - lastActivity) / 1000;
        if (inactive > 600) { // 10 minutes
          // Use notification instead of harsh alert
          setInactivityWarning('⚠️ 10 dakika hareketsizlik. Sınav güvenlik gereği sonlandırıldı.');
          setTimeout(() => setInactivityWarning(null), 5000);
          submitExam();
        }
      }
    }, 30000); // Check every 30s

    return () => {
      ['mousemove', 'keydown', 'click'].forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
    };
  }, [currentExam.active, lastActivity]);

  // Tab change monitor
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && currentExam.active) {
        setInactivityWarning('⚠️ Sekme değişikliği tespit edildi! Lütfen sınava odaklanın.');
        setTimeout(() => setInactivityWarning(null), 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentExam.active]);

  // Notification handler
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Helper functions
  const addXP = useCallback((amount: number) => {
    setUserData(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpTarget = prev.xpTarget;

      while (newXp >= newXpTarget) {
        newXp -= newXpTarget;
        newLevel++;
        newXpTarget = Math.floor(newXpTarget * 1.5);
        setNotification(`🎉 Tebrikler! Seviye ${newLevel} oldun!`);
      }

      return { ...prev, xp: newXp, level: newLevel, xpTarget: newXpTarget };
    });
  }, []);

  const speakText = useCallback((text: string) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === settings.voiceAccent) || voices.find(v => v.lang.startsWith('en'));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.voiceAccent]);

  const toggleDarkMode = useCallback(() => {
    setSettings(prev => {
      const newDarkMode = !prev.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { ...prev, darkMode: newDarkMode };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    if (confirm('⚠️ Tüm verileri silmek istediğinize emin misiniz?')) {
      localStorage.removeItem('englishpath');
      window.location.reload();
    }
  }, []);

  // Flashcards handlers
  const flipCard = useCallback((index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
    setUserData(prev => ({
      ...prev,
      stats: { ...prev.stats, flashcardsViewed: prev.stats.flashcardsViewed + 1 }
    }));
  }, []);

  const displayedFlashcards = useMemo(() => {
    if (flashcardCategory === 'all') {
      return Object.values(FLASHCARDS).flat();
    }
    return FLASHCARDS[flashcardCategory] || [];
  }, [flashcardCategory]);

  // Prepositions handlers
  const checkPrep = useCallback((index: number, optionIndex: number) => {
    if (prepAnswers.has(index)) return;

    const prep = PREPOSITIONS[index];
    const correct = optionIndex === prep.c;

    setPrepAnswers(prev => new Set(prev).add(index));
    setPrepScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
    setPrepFeedback(prev => ({
      ...prev,
      [index]: {
        correct,
        msg: correct ? `✅ Doğru! ${prep.e}` : `❌ Yanlış. Doğru: "${prep.o[prep.c]}". ${prep.e}`,
        sel: optionIndex
      }
    }));

    if (correct) addXP(5);
    setUserData(prev => ({
      ...prev,
      stats: { ...prev.stats, prepPracticed: prev.stats.prepPracticed + 1 }
    }));
  }, [prepAnswers, addXP]);

  const resetPreps = useCallback(() => {
    setPrepAnswers(new Set());
    setPrepScore({ correct: 0, total: 0 });
    setPrepFeedback({});
  }, []);

  // Exam handlers
  const startExam = useCallback(() => {
    const wrongIds = Object.keys(wrongAnswers).map(Number);
    const wrongCount = Math.min(Math.floor(wrongIds.length * 0.3), 9);
    let selected: Question[] = [];

    if (wrongIds.length > 0) {
      const shuffled = wrongIds.sort(() => 0.5 - Math.random()).slice(0, wrongCount);
      shuffled.forEach(id => {
        const q = QUESTIONS.find(q => q.id === id);
        if (q) selected.push(q);
      });
    }

    const remaining = 15 - selected.length;
    const available = QUESTIONS.filter(q => !selected.includes(q));
    selected.push(...available.sort(() => 0.5 - Math.random()).slice(0, remaining));

    setCurrentExam({
      questions: selected.slice(0, 15),
      answers: {},
      startTime: Date.now(),
      active: true
    });
    setLastActivity(Date.now());
    setActiveTab('exam');
    setActiveHint(null); // Clear hints on new exam

    // Start timer
    examTimerRef.current = setInterval(() => {
      // Timer updates will be handled in the render
    }, 1000);
  }, [wrongAnswers]);

  const selectAnswer = useCallback((questionId: number, optionIndex: number) => {
    setCurrentExam(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: optionIndex }
    }));
    setLastActivity(Date.now());
  }, []);

  const submitExam = useCallback(() => {
    if (!currentExam.active) return;

    setCurrentExam(prev => ({ ...prev, active: false }));
    if (examTimerRef.current) clearInterval(examTimerRef.current);

    const results: ExamResults = {
      questions: [],
      correct: 0,
      total: currentExam.questions.length,
      timeSpent: Math.floor((Date.now() - (currentExam.startTime || Date.now())) / 1000),
      units: {},
      score: 0
    };

    const newWrongAnswers = { ...wrongAnswers };

    currentExam.questions.forEach(q => {
      const userAnswer = currentExam.answers[q.id] ?? -1;
      const isCorrect = userAnswer === q.c;

      if (isCorrect) {
        results.correct++;
        delete newWrongAnswers[q.id];
      } else {
        newWrongAnswers[q.id] = {
          count: (newWrongAnswers[q.id]?.count || 0) + 1,
          lastSeen: Date.now()
        };
      }

      results.questions.push({ ...q, userAnswer, isCorrect });

      if (!results.units[q.u]) results.units[q.u] = { correct: 0, total: 0 };
      results.units[q.u].total++;
      if (isCorrect) results.units[q.u].correct++;
    });

    results.score = parseFloat(((results.correct / results.total) * 100).toFixed(1));

    setExamResults(results);
    setWrongAnswers(newWrongAnswers);
    setExamHistory(prev => [...prev, {
      date: Date.now(),
      score: results.score,
      questions: results.questions.map(q => ({ id: q.id, topic: q.t, isCorrect: q.isCorrect }))
    }]);

    setUserData(prev => {
      const today = new Date().toDateString();
      let newStreak = prev.streak;

      if (prev.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (prev.lastStudyDate === yesterday.toDateString()) {
          newStreak++;
        } else {
          newStreak = 1;
        }
      }

      return {
        ...prev,
        totalExams: prev.totalExams + 1,
        totalQuestions: prev.totalQuestions + results.total,
        correctAnswers: prev.correctAnswers + results.correct,
        streak: newStreak,
        lastStudyDate: today
      };
    });

    addXP(results.correct * 10);
    setActiveTab('results');
  }, [currentExam, wrongAnswers, addXP]);

  const resetExam = useCallback(() => {
    setCurrentExam({ questions: [], answers: {}, startTime: null, active: false });
    setExamResults(null);
    if (examTimerRef.current) clearInterval(examTimerRef.current);
    setActiveTab('exam');
  }, []);

  // Chart data
  const chartData = useMemo(() => {
    const last10 = examHistory.slice(-10);
    return {
      labels: last10.map((_, i) => `S${i + 1}`),
      datasets: [{
        label: 'Başarı %',
        data: last10.map(e => e.score),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }, [examHistory]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: settings.darkMode ? '#9ca3af' : '#4b5563'
        }
      },
      x: {
        grid: {
          color: settings.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: settings.darkMode ? '#9ca3af' : '#4b5563'
        }
      }
    }
  };

  // Achievements
  const achievements = useMemo(() => [
    { id: 'first', n: '🎯 İlk Sınav', d: 'İlk sınavını tamamladın', u: userData.totalExams >= 1 },
    { id: 'streak3', n: '🔥 3 Gün', d: '3 gün üst üste', u: userData.streak >= 3 },
    { id: 'exam5', n: '💪 5 Sınav', d: '5 sınav tamamladın', u: userData.totalExams >= 5 },
    { id: 'level5', n: '⭐ Level 5', d: "Level 5'e ulaştın", u: userData.level >= 5 },
    { id: 'flash50', n: '🃏 50 Kart', d: '50 kart inceledi', u: userData.stats.flashcardsViewed >= 50 },
    { id: 'prep20', n: '🎯 20 Edat', d: '20 edat pratiği', u: userData.stats.prepPracticed >= 20 },
    { id: 'perfect', n: '💯 Mükemmel', d: '100% aldın', u: examHistory.some(e => e.score === 100) },
    { id: 'master', n: '👑 Usta', d: '20 sınav', u: userData.totalExams >= 20 }
  ], [userData, examHistory]);

  const avgScore = userData.totalQuestions > 0
    ? ((userData.correctAnswers / userData.totalQuestions) * 100).toFixed(1)
    : 0;

  // Timer display
  const examTimer = useMemo(() => {
    if (!currentExam.active || !currentExam.startTime) return '⏱️ 00:00';
    const elapsed = Math.floor((Date.now() - currentExam.startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `⏱️ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [currentExam]);

  // Re-render timer every second when exam is active
  useEffect(() => {
    if (currentExam.active) {
      const interval = setInterval(() => {
        // Force re-render to update timer
        setCurrentExam(prev => ({ ...prev }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentExam.active]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <style jsx global>{`
        * { font-family: 'Poppins', sans-serif; }
        
        .flashcard {
          perspective: 1000px;
          cursor: pointer;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          min-height: 200px;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flashcard.flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          padding: 1.5rem;
          min-height: 200px;
        }
        .flashcard-front {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }
        .flashcard-back {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
          color: white;
          transform: rotateY(180deg);
        }
        
        .fade-in {
          animation: fadeIn 0.4s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .xp-bar {
          height: 8px;
          background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%);
          transition: width 0.5s ease;
          border-radius: 9999px;
        }
        
        .achievement-glow {
          animation: glowPulse 2s infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.6); }
        }

        .pop-up-hint {
           animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn {
           0% { opacity: 0; transform: scale(0.8); }
           100% { opacity: 1; transform: scale(1); }
        }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .dark ::-webkit-scrollbar-thumb { background: #475569; }
      `}</style>

      {/* HEADER */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">E</div>
              <div>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">EnglishPath</h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">BEGINNER LEVEL</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                  ⭐ <span>{userData.level}</span>
                </div>
                <div className="flex flex-col gap-1 w-24">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                    <span>{userData.xp} XP</span>
                    <span>{userData.xpTarget}</span>
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div className="xp-bar" style={{ width: `${(userData.xp / userData.xpTarget * 100)}%` }}></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                  🔥 <span>{userData.streak}</span>
                </div>
              </div>

              <button onClick={() => setShowTeacherModal(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-lg text-blue-600 dark:text-blue-400 transition-colors" title="Öğretmen Görünümü">👨‍🏫</button>
              <button onClick={() => setShowSettingsModal(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-lg transition-colors">⚙️</button>
              <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-lg transition-colors">
                <span className="dark:hidden">🌙</span>
                <span className="hidden dark:inline">☀️</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* POP-UP HINT MODAL */}
      {activeHint && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveHint(null)}>
           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full pop-up-hint border border-amber-200 dark:border-amber-900/50 relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <div className="text-9xl transform rotate-12">💡</div>
              </div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-2xl mb-4 text-amber-500 border border-amber-200 dark:border-amber-800">
                    💡
                 </div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">İpucu</h3>
                 <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    {activeHint}
                 </p>
                 <button 
                   onClick={() => setActiveHint(null)}
                   className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition"
                 >
                    Tamamdır, anladım!
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MODALS */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 fade-in border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">⚙️ Ayarlar</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-2xl leading-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold dark:text-white mb-2 block">🎤 Ses Aksanı</label>
                <select
                  value={settings.voiceAccent}
                  onChange={(e) => setSettings(prev => ({ ...prev, voiceAccent: e.target.value as 'en-GB' | 'en-US' }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="en-GB">🇬🇧 British (İngiliz)</option>
                  <option value="en-US">🇺🇸 American (Amerikan)</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <span className="text-sm font-semibold dark:text-white">💡 İpuçlarını Göster</span>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                      type="checkbox" 
                      name="toggle" 
                      id="toggle" 
                      checked={settings.showHints}
                      onChange={(e) => setSettings(prev => ({ ...prev, showHints: e.target.checked }))}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      style={{ right: settings.showHints ? '0' : 'auto', left: settings.showHints ? 'auto' : '0', borderColor: settings.showHints ? '#3b82f6' : '#cbd5e1' }}
                    />
                    <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.showHints ? 'bg-blue-500' : 'bg-slate-300'}`}></label>
                </div>
              </div>
              <button onClick={resetAllProgress} className="w-full mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800 font-semibold rounded-xl transition-colors">
                🗑️ İlerlemeyi Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}

      {showTeacherModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full p-8 my-8 fade-in border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                 <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">👨‍🏫 Öğretmen Paneli</h2>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">ZIP dosyasından çıkarılan ham veriler</p>
              </div>
              <button onClick={() => setShowTeacherModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-500">&times;</button>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {ZIP_QUESTIONS.map((q, i) => (
                <div key={i} className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl border-l-4 border-blue-500 flex gap-4">
                  <span className="font-mono text-blue-500 font-bold">{i+1}</span>
                  <p className="text-sm font-medium dark:text-slate-200">{q}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center text-sm text-slate-500">
              <div className="inline-flex gap-6">
                 <span className="flex items-center gap-1.5"><span className="text-green-500">●</span> {ZIP_QUESTIONS.length} soru aktarıldı</span>
                 <span className="flex items-center gap-1.5"><span className="text-green-500">●</span> Etkileşimli mod aktif</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl animate-bounce flex items-center gap-3 font-bold border border-slate-700 dark:border-slate-200">
          <span>🎉</span> {notification}
        </div>
      )}

      {inactivityWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-8 py-4 rounded-2xl shadow-2xl fade-in font-bold flex items-center gap-3">
          <span className="text-2xl">⚠️</span> {inactivityWarning}
        </div>
      )}

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TABS */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-8 p-1.5 border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <div className="flex md:grid md:grid-cols-6 gap-1 min-w-max md:min-w-0">
            {(['dashboard', 'grammar', 'flashcards', 'prepositions', 'exam', 'results'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md transform scale-[1.02]'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab === 'dashboard' && '📊 Panel'}
                {tab === 'grammar' && '📖 Kurallar'}
                {tab === 'flashcards' && '🃏 Kelimeler'}
                {tab === 'prepositions' && '🎯 Edatlar'}
                {tab === 'exam' && '📝 Sınav'}
                {tab === 'results' && '🏆 Sonuçlar'}
              </button>
            ))}
          </div>
        </div>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
                   <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-2 rounded-lg">📈</span> 
                   İstatistikler
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Toplam Sınav</span>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">{userData.totalExams}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Doğru Cevap</span>
                    <span className="font-bold text-green-600 text-lg">{userData.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Başarı Oranı</span>
                    <span className="font-bold text-purple-600 text-lg">{avgScore}%</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
                   <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 p-2 rounded-lg">📊</span>
                   Gelişim Grafiği
                </h3>
                <div style={{ height: '220px' }} className="w-full">
                  {examHistory.length > 0 ? (
                    <Line ref={chartRef} data={chartData} options={chartOptions} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                      <div className="text-4xl mb-2">📉</div>
                      Henüz sınav verisi yok
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <button onClick={() => setActiveTab('grammar')} className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">📖</div>
                <div className="relative z-10">
                   <div className="text-3xl mb-2">Grammar</div>
                   <div className="text-blue-100 text-sm font-medium">Kuralları Öğren →</div>
                </div>
              </button>
              <button onClick={() => setActiveTab('flashcards')} className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🃏</div>
                <div className="relative z-10">
                   <div className="text-3xl mb-2">Kelimeler</div>
                   <div className="text-purple-100 text-sm font-medium">Kelime Ezberle →</div>
                </div>
              </button>
              <button onClick={() => setActiveTab('prepositions')} className="group bg-gradient-to-br from-rose-500 to-pink-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🎯</div>
                <div className="relative z-10">
                   <div className="text-3xl mb-2">Edatlar</div>
                   <div className="text-rose-100 text-sm font-medium">Pratik Yap →</div>
                </div>
              </button>
              <button onClick={startExam} className="group bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🚀</div>
                <div className="relative z-10">
                   <div className="text-3xl mb-2">Sınav</div>
                   <div className="text-emerald-100 text-sm font-medium">Kendini Dene →</div>
                </div>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
                 <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 p-2 rounded-lg">🏅</span>
                 Başarılar
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map(a => (
                  <div
                    key={a.id}
                    className={`${
                      a.u
                        ? 'achievement-glow bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-800 opacity-60 grayscale border border-transparent'
                    } p-4 rounded-2xl text-center transition hover:scale-105 cursor-pointer flex flex-col items-center justify-center min-h-[140px]`}
                    title={a.d}
                  >
                    <div className="text-4xl mb-3">{a.n.split(' ')[0]}</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{a.n.split(' ').slice(1).join(' ')}</div>
                    {a.u && <div className="text-[10px] uppercase tracking-wide text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">{a.d}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GRAMMAR - YENİ TASARIM */}
        {activeTab === 'grammar' && (
          <div className="space-y-6 fade-in max-w-5xl mx-auto">
            <div className="text-center mb-8">
               <h2 className="text-3xl font-bold dark:text-white">Dilbilgisi Kuralları</h2>
               <p className="text-slate-500 dark:text-slate-400">Headway Beginner konularına uygun özetler.</p>
            </div>
            
            <div className="grid gap-6">
              {GRAMMAR.map((g, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-0 shadow-sm hover:shadow-md transition border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row">
                   {/* Sol Taraf: Başlık ve İkon */}
                   <div className="bg-slate-50 dark:bg-slate-700/30 p-6 md:w-1/3 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                      <div className="text-5xl mb-4 bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center shadow-sm">{g.i}</div>
                      <h3 className="font-bold text-xl dark:text-white mb-1">{g.title}</h3>
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{g.u}</span>
                   </div>

                   {/* Sağ Taraf: İçerik */}
                   <div className="p-6 md:w-2/3 space-y-6">
                      <div>
                         <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Kurallar
                         </h4>
                         <ul className="space-y-2">
                           {g.r.map((r, j) => (
                             <li key={j} className="text-slate-700 dark:text-slate-300 text-sm flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span> {r}
                             </li>
                           ))}
                         </ul>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-slate-900/50 rounded-xl p-4 border border-amber-100 dark:border-slate-700">
                         <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-2">Örnekler</h4>
                         {g.e.map((ex, j) => (
                           <div key={j} className="text-sm text-slate-600 dark:text-slate-400 font-medium italic mb-1 last:mb-0">"{ex}"</div>
                         ))}
                      </div>

                      {g.note && (
                         <div className="text-xs text-slate-400 flex gap-1.5 items-center">
                            <span className="text-base">💡</span> <span className="italic">{g.note}</span>
                         </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <div>
                  <h2 className="text-2xl font-bold dark:text-white">Kelime Kartları</h2>
                  <p className="text-sm text-slate-500">Karta tıkla, anlamını gör.</p>
               </div>
               <div className="flex flex-wrap gap-2">
                 <button
                   onClick={() => setFlashcardCategory('all')}
                   className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                     flashcardCategory === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                   }`}
                 >
                   Tümü
                 </button>
                 {Object.keys(FLASHCARDS).map(cat => (
                   <button
                     key={cat}
                     onClick={() => setFlashcardCategory(cat)}
                     className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${
                       flashcardCategory === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedFlashcards.map((card, i) => (
                <div
                  key={i}
                  className={`flashcard ${flippedCards[i] ? 'flipped' : ''}`}
                  onClick={() => flipCard(i)}
                >
                  <div className="flashcard-inner shadow-lg rounded-2xl">
                    <div className="flashcard-front border border-white/20">
                      <div className="text-3xl font-bold mb-2 text-center">{card.f}</div>
                      <div className="text-sm opacity-80 font-mono bg-white/20 px-2 py-1 rounded">{card.p}</div>
                      <div className="absolute bottom-4 text-[10px] uppercase tracking-widest opacity-60">Çevirmek için Tıkla</div>
                    </div>
                    <div className="flashcard-back">
                      <div className="text-3xl font-bold mb-4 text-center">{card.b}</div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(card.f);
                        }}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors"
                      >
                        🔊 Telaffuz
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PREPOSITIONS */}
        {activeTab === 'prepositions' && (
          <div className="fade-in space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performans</span>
                <div className="flex items-baseline gap-2 mt-1">
                   <div className="text-4xl font-black text-slate-900 dark:text-white">
                     {prepScore.correct} <span className="text-xl text-slate-400 font-medium">/ {prepScore.total}</span>
                   </div>
                   {prepScore.total > 0 && (
                     <div className={`text-sm font-bold px-2 py-0.5 rounded ${((prepScore.correct / prepScore.total) * 100) > 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                       {((prepScore.correct / prepScore.total) * 100).toFixed(0)}%
                     </div>
                   )}
                </div>
              </div>
              <button onClick={resetPreps} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                🔄 Sıfırla
              </button>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
              <h4 className="font-bold text-amber-800 dark:text-amber-500 mb-3 flex items-center gap-2">
                 <span className="text-xl">💡</span> Hızlı İpuçları
              </h4>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-amber-900/80 dark:text-amber-200/80">
                 <li className="list-none">🕐 <strong>AT:</strong> Saatler (at 7 AM), kesin noktalar</li>
                 <li className="list-none">📅 <strong>ON:</strong> Günler (on Monday), yüzeyler</li>
                 <li className="list-none">📆 <strong>IN:</strong> Aylar, Yıllar, Şehirler</li>
                 <li className="list-none">➡️ <strong>TO:</strong> Hareket yönü (go to...)</li>
                 <li className="list-none">🤝 <strong>WITH:</strong> Birlikte (with friends)</li>
                 <li className="list-none">🚌 <strong>BY:</strong> Araç ile (by bus)</li>
              </div>
            </div>

            <div className="space-y-4">
              {PREPOSITIONS.map((prep, i) => {
                const answered = prepAnswers.has(i);
                const feedback = prepFeedback[i];

                return (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition hover:border-blue-300 dark:hover:border-slate-500">
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          prep.d === 'easy'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : prep.d === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}
                      >
                        {prep.d}
                      </div>
                      <div className="text-[10px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                        {prep.cat}
                      </div>
                    </div>
                    
                    <p className="text-xl font-medium dark:text-white mb-6 leading-relaxed">
                      {prep.s.split('___')[0]}
                      <span className="inline-block w-16 border-b-2 border-dashed border-slate-400 mx-2"></span>
                      {prep.s.split('___')[1]}
                    </p>
                    
                    <div className="grid grid-cols-4 gap-3">
                      {prep.o.map((opt, j) => {
                        let btnClass = 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600';
                        if (answered) {
                          if (j === prep.c) {
                            btnClass = 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30';
                          } else if (feedback && feedback.sel === j) {
                            btnClass = 'bg-rose-500 text-white border-rose-600 opacity-50';
                          } else {
                             btnClass += ' opacity-40';
                          }
                        }

                        return (
                          <button
                            key={j}
                            disabled={answered}
                            onClick={() => checkPrep(i, j)}
                            className={`${btnClass} py-3 rounded-xl font-bold transition-all active:scale-95 disabled:cursor-not-allowed`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    
                    {answered && feedback && (
                      <div className={`mt-4 text-sm p-4 rounded-xl flex items-center gap-3 font-medium ${
                        feedback.correct
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                      }`}>
                        <div className="text-xl">{feedback.correct ? '🎉' : '⚠️'}</div>
                        {feedback.msg}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXAM */}
        {activeTab === 'exam' && (
          <div className="max-w-3xl mx-auto">
            {!currentExam.active ? (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-xl shadow-blue-500/30">
                   📝
                </div>
                <h2 className="text-4xl font-black dark:text-white mb-4 tracking-tight">Sınava Hazır mısın?</h2>
                <div className="max-w-md mx-auto mb-10 text-slate-500 dark:text-slate-400">
                   <p className="mb-2">15 soru ile kendini dene.</p>
                   <p className="text-sm bg-slate-100 dark:bg-slate-700/50 py-2 rounded-lg">🧠 Akıllı Algoritma: Yanlış yaptığın konular daha sık karşına çıkar.</p>
                </div>
                <button
                  onClick={startExam}
                  className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xl font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform"
                >
                  🚀 Başla
                </button>
              </div>
            ) : (
              <div className="fade-in space-y-8">
                <div className="sticky top-20 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-900 rounded-2xl shadow-2xl p-4 z-40 flex justify-between items-center border border-white/10">
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-bold uppercase tracking-widest opacity-60">İlerleme</span>
                     <span className="font-mono font-bold text-lg">{Object.keys(currentExam.answers).length} / {currentExam.questions.length}</span>
                  </div>
                  <div className="font-mono font-bold text-xl tracking-widest bg-white/10 dark:bg-slate-900/10 px-3 py-1 rounded-lg">{examTimer}</div>
                  <button onClick={submitExam} className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-green-500/20">
                    Bitir
                  </button>
                </div>

                {currentExam.questions.map((q, i) => (
                  <div key={q.id} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    {/* Question Source Badge */}
                    <div className="absolute top-0 right-0 p-4">
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                          q.src === 'zip' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                          q.src === 'headway' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                       }`}>
                          {q.src === 'zip' ? 'ZIP' : q.src === 'headway' ? 'BOOK' : 'AI'}
                       </span>
                    </div>

                    <div className="mb-6">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{q.u}</span>
                       <div className="flex gap-4 items-start">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 text-sm mt-1">{i + 1}</span>
                          <h3 className="text-xl font-medium dark:text-white leading-relaxed">{q.q}</h3>
                       </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2 mb-6 ml-12">
                       <button onClick={() => speakText(q.q)} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="Dinle">🔊</button>
                       {settings.showHints && q.h && (
                          <button 
                             onClick={() => setActiveHint(q.h)} 
                             className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 text-amber-400 hover:text-amber-600 transition-colors animate-pulse" 
                             title="İpucu"
                          >
                             💡
                          </button>
                       )}
                    </div>

                    <div className="space-y-3 ml-12">
                      {q.o.map((opt, j) => (
                        <label
                          key={j}
                          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group-hover:border-slate-300 dark:group-hover:border-slate-600 ${
                            currentExam.answers[q.id] === j
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-1 ring-blue-500 !border-blue-500'
                              : 'border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                             currentExam.answers[q.id] === j ? 'border-blue-500' : 'border-slate-300 dark:border-slate-500'
                          }`}>
                             {currentExam.answers[q.id] === j && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                          </div>
                          <input
                            type="radio"
                            name={`q${q.id}`}
                            className="hidden"
                            checked={currentExam.answers[q.id] === j}
                            onChange={() => selectAnswer(q.id, j)}
                          />
                          <span className={`font-medium ${currentExam.answers[q.id] === j ? 'text-blue-900 dark:text-blue-100' : 'text-slate-600 dark:text-slate-300'}`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="h-32 flex items-center justify-center">
                  <button
                    onClick={submitExam}
                    className="px-16 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-lg font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                  >
                    Sınavı Tamamla
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {activeTab === 'results' && (
          <div className="max-w-4xl mx-auto">
            {!examResults ? (
              <div className="text-center py-24 fade-in">
                <div className="text-6xl mb-6 opacity-20">📊</div>
                <h2 className="text-2xl font-bold dark:text-white mb-4">Henüz Sonuç Yok</h2>
                <button onClick={() => setActiveTab('exam')} className="text-blue-500 hover:underline font-semibold bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-xl">
                  Sınava git →
                </button>
              </div>
            ) : (
              <div className="space-y-8 fade-in">
                <div
                  className={`text-center p-10 rounded-3xl text-white shadow-2xl bg-gradient-to-br ${
                    examResults.score >= 90
                      ? 'from-emerald-500 to-teal-600'
                      : examResults.score >= 70
                      ? 'from-blue-500 to-indigo-600'
                      : examResults.score >= 50
                      ? 'from-amber-400 to-orange-500'
                      : 'from-rose-500 to-pink-600'
                  }`}
                >
                  <div className="text-[8rem] font-black leading-none mb-2 tracking-tighter opacity-90">{examResults.score}%</div>
                  <div className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
                    {examResults.score >= 90 ? '🏆 Mükemmel!' : examResults.score >= 70 ? '👏 Çok İyi!' : examResults.score >= 50 ? '📚 İyi!' : '💪 Pes Etme!'}
                  </div>
                  <div className="flex justify-center gap-4">
                     <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-xl font-medium">
                        ✅ {examResults.correct} Doğru
                     </div>
                     <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-xl font-medium">
                        ⏱️ {Math.floor(examResults.timeSpent / 60)}dk {examResults.timeSpent % 60}sn
                     </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(examResults.units).map(([unit, data]) => {
                    const pct = ((data.correct / data.total) * 100).toFixed(0);
                    return (
                      <div key={unit} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{unit}</div>
                        <div className="flex justify-between items-end mb-2">
                           <div className={`text-2xl font-black ${Number(pct) >= 70 ? 'text-green-500' : 'text-slate-700 dark:text-slate-300'}`}>{pct}%</div>
                           <div className="text-sm text-slate-400">{data.correct}/{data.total}</div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                          <div className={`${Number(pct) >= 70 ? 'bg-green-500' : 'bg-rose-500'} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold dark:text-white px-2">Detaylı Analiz</h3>
                  {examResults.questions.map((q, i) => (
                    <div
                      key={q.id}
                      className={`bg-white dark:bg-slate-800 p-6 rounded-2xl border-l-[6px] shadow-sm ${
                        q.isCorrect ? 'border-green-500' : 'border-rose-500'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${
                           q.isCorrect ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                        }`}>
                           {q.isCorrect ? '✓' : '✕'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-lg dark:text-white leading-relaxed">
                              {q.q}
                            </p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                             {!q.isCorrect && (
                                <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">
                                   <div className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase mb-1">Senin Cevabın</div>
                                   <div className="font-medium text-rose-900 dark:text-rose-200">{q.userAnswer === -1 ? 'Boş' : q.o[q.userAnswer]}</div>
                                </div>
                             )}
                             <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                                <div className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1">Doğru Cevap</div>
                                <div className="font-medium text-green-900 dark:text-green-200">{q.o[q.c]}</div>
                             </div>
                          </div>

                          <div className="mt-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 text-sm space-y-3">
                             <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">💡 Açıklama:</span>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">{q.e}</p>
                             </div>
                             {q.de && (
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                                   <span className="font-bold text-slate-700 dark:text-slate-300">📖 Detay:</span>
                                   <p className="text-slate-600 dark:text-slate-400 mt-1">{q.de}</p>
                                </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="h-24 flex items-center justify-center">
                   <button onClick={resetExam} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                      <span>🔄</span> Yeni Sınav Başlat
                   </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            © 2026 <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">EnglishPath</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">Headway Beginner Uyumlu • ZIP Questions Integrated</p>
        </div>
      </footer>
    </div>
  );
}