export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Emmy Haner',
    rating: 5,
    nl: 'Nieuwe nagelsalon in Dukenburg! Ik was er weg van: goede prijzen, vriendelijk personeel en een prachtige nagelervaring. Echt een aanrader!',
    en: 'New nail salon in Dukenburg! I absolutely loved it — great prices, friendly staff, and such a beautiful nail experience. I really recommend it!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Tammie Osinga',
    rating: 5,
    nl: 'Uitstekende service, snel en hygiënisch. Mooie nagelvorm en kleur, met goed advies. Ik kom zeker terug!',
    en: 'Excellent service, fast and hygienic. Beautiful nail shape and color with good consultation. I will definitely be back!',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Tessa Jacobs',
    rating: 5,
    nl: 'Ik kom hier al een tijdje; ze is supersnel, heel netjes, en je kan op korte termijn een afspraak maken. Manicure met BIAB en pedicure met gellak laten doen vóór mijn vakantie — top!',
    en: "I've been coming here for a while — super fast, super neat, and appointments at short notice are possible. Got a BIAB manicure and gel pedicure before my vacation — great result!",
    source: 'Google',
  },
  {
    id: 4,
    name: 'Jill Van haren',
    rating: 5,
    nl: 'Direct geholpen om 10:00. Ze was zo lief en behulpzaam. Prachtige salon, vooral hygiënisch en schoon. Er wordt echt meegedacht over nagelverzorging!',
    en: 'Seen right away at 10:00. She was so sweet and helpful. A beautiful salon, especially hygienic and clean. They really think about nail care.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Helin Yakut',
    rating: 5,
    nl: 'Absoluut prachtige salon! Meteen bij binnenkomst valt op hoe schoon, stijlvol en verzorgd alles is. Geen sterke chemische geur — heerlijk.',
    en: 'Absolutely beautiful salon! Upon entering, you are struck by how clean, stylish, and well-maintained everything is. No strong chemical scent — very pleasant.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Nicole Perenboom',
    rating: 5,
    nl: 'Klant vanaf de opening. Altijd tevreden! Netjes, schoon en snel. Mijn acrylnagels zien er iedere vier weken perfect uit. Ze reageren snel op berichten.',
    en: 'A customer since opening. Always satisfied! Neat, clean, and fast. My acrylics look perfect every four weeks. They respond quickly to messages.',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Gina Gail',
    rating: 5,
    nl: 'Altijd de perfecte nagels! Ze doet precies wat ik wil en is heel zorgvuldig.',
    en: 'Always the most perfect nails! She does exactly what I want and is very caring.',
    source: 'Google',
  },
  {
    id: 8,
    name: 'Fabiën Do',
    rating: 5,
    nl: 'Wat een fijne plek en prachtige salon! Fantastische ervaring: top service en mooie nagels. MyKim luistert goed en maakt precies wat je voor ogen hebt.',
    en: 'What a great place and beautiful salon! Fantastic experience — excellent service and beautiful nails. MyKim listens carefully and creates exactly what you envision.',
    source: 'Google',
  },
];
