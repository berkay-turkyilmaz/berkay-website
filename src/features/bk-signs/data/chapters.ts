export type SignsChapter = {
  id: string;
  title: string;
  reference: string;
  arabic?: string;
  meal: string;
  highlight: string;
  note?: string;
};

export const SIGNS_CHAPTERS: SignsChapter[] = [
  {
    id: "hadid",
    title: "Demirin İndirilmesi",
    reference: "Hadîd 25",
    meal:
      "Ve kendisinde çetin bir sertlik ve insanlar için faydalar bulunan demiri de indirdik.",
    highlight:
      "Astrofizikte demir, Dünya'da değil yıldız çekirdeklerinde ve süpernova patlamalarında oluşur; göktaşlarıyla gezegenimize ulaşır.",
    note: "Bilimsel köken iddiası akademik literatürde tartışılır; sayfa tefekkür amaçlıdır.",
  },
  {
    id: "yasin",
    title: "Güneşin Akışı",
    reference: "Yâsîn 38",
    meal: "Güneş de kendisi için belirlenmiş bir yere doğru akıp gitmektedir.",
    highlight:
      "Güneş ve gezegen sistemi Samanyolu merkezine doğru galaktik bir yörüngede hareket eder.",
  },
  {
    id: "nur",
    title: "Denizin İç Dalgaları",
    reference: "Nûr 40",
    meal: "Onu bir dalga kaplar, onun üstünden başka bir dalga…",
    highlight:
      "Okyanus biliminde yoğunluk katmanları arasında yüzeyden görünmeyen iç dalgalar vardır.",
  },
  {
    id: "nahl",
    title: "Arı ve Dilbilgisi",
    reference: "Nahl 68",
    meal: "Rabbin bal arısına şöyle ilham etti: … kendine evler edin.",
    highlight:
      "Ayet metninde fiil çekimi dişil formludur; kovanı işleyen arıların dişi işçiler olduğu zoolojide bilinir.",
  },
];
