import type { Lang } from '../translations';

export type Review = {
  id: number;
  name: string;
  rating: number;
  origin: string;
  en: string;
  nl: string;
  ua: string;
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Anna Shevchenko',
    rating: 5,
    origin: 'Google',
    en: 'I rarely write reviews, but I had to here. It has been over three weeks since my manicure and it still looks perfect, as if I just got it done. Only you give such a flawless finish, so professionally and without any chips. And with my job, too. I am so glad I found you. You are simply the best.',
    nl: 'Ik schrijf zelden recensies, maar hier moest het. Het is al meer dan drie weken geleden dat ik mijn manicure liet zetten en hij ziet er nog perfect uit, alsof het net gedaan is. Alleen jij geeft zo een vlekkeloze afwerking, zo professioneel en zonder enige beschadiging. En dat met mijn werk. Ik ben zo blij dat ik je gevonden heb. Je bent simpelweg de beste.',
    ua: 'Я рідко пишу відгуки, але тут не могла не написати. Минуло вже понад три тижні після манікюру, а він і досі виглядає ідеально, ніби щойно зроблений. Лише ти робиш таке бездоганне покриття, так професійно і без жодного сколу. І це при моїй роботі. Я така рада, що знайшла тебе. Ти просто найкраща.',
  },
  {
    id: 2,
    name: 'Catherine Solange',
    rating: 5,
    origin: 'Google',
    en: 'I have been three times now and I am very satisfied. This young lady is highly skilled and every time I go home with beautiful hands and feet. Finally a great nail stylist in Breda who does both manicure and pedicure. Highly recommended.',
    nl: 'Ik ben al 3 keer geweest en zeer tevreden. Deze jonge dame is erg kundig en iedere keer ga ik met prachtige handjes en voetjes naar huis. Eindelijk een goede nagelstyliste in Breda die manicure en pedicure doet. Een echte aanrader.',
    ua: 'Я була вже тричі і дуже задоволена. Ця молода майстриня дуже вміла, і щоразу я йду додому з гарними руками й ніжками. Нарешті чудова майстриня в Бреді, яка робить і манікюр, і педикюр. Дуже раджу.',
  },
  {
    id: 3,
    name: 'Masha Shestakova',
    rating: 5,
    origin: 'Google',
    en: 'So happy with my visit to this salon. The artist is wonderful, not only a true professional but also a warm and open person. The atmosphere feels like home, just with a perfect finish and tea in hand. My nails turned out wow, perfect and neat, exactly how I wanted. I will definitely be back. Thank you for the service.',
    nl: 'Heel tevreden over mijn bezoek aan deze salon. De styliste is geweldig, niet alleen een echte professional maar ook een warme en open persoon. De sfeer voelt als thuis, alleen dan met een perfecte afwerking en thee in je hand. Mijn nagels werden gewoon wauw, perfect en netjes, precies zoals ik wilde. Ik kom zeker terug. Bedankt voor de service.',
    ua: 'Дуже задоволена візитом до цього салону. Майстриня просто чудова, не лише професіонал своєї справи, а й дуже приємна й відкрита людина. Атмосфера як удома, тільки з ідеальним покриттям і чаєм у руках. Нігтики вийшли просто вау, ідеальні та охайні, саме так, як я хотіла. Обов’язково повернусь ще. Дякую за сервіс.',
  },
  {
    id: 4,
    name: 'Simona Szaková',
    rating: 5,
    origin: 'Google',
    en: 'This girl can do the impossible. If you are looking for someone to do your nails right, she is the one. Satisfaction above all, and we even had a lovely chat about life abroad. Thank you again.',
    nl: 'Dit meisje kan het onmogelijke. Zoek je iemand die je nagels echt goed doet, dan is zij het. Tevredenheid boven alles, en we hadden zelfs een gezellig gesprek over het leven in het buitenland. Nogmaals bedankt.',
    ua: 'Ця дівчина творить неможливе. Якщо ви шукаєте майстра, який зробить нігті ідеально, то це вона. Задоволення понад усе, і ми навіть мило поспілкувалися про життя за кордоном. Ще раз дякую.',
  },
  {
    id: 5,
    name: 'Tetiana Obshcha',
    rating: 5,
    origin: 'Google',
    en: 'Great manicure and pedicure services.',
    nl: 'Geweldige manicure- en pedicurebehandelingen.',
    ua: 'Чудові послуги манікюру та педикюру.',
  },
  {
    id: 6,
    name: 'Jonas',
    rating: 5,
    origin: 'Google',
    en: 'Good price and lovely staff. Excellent service.',
    nl: 'Goede prijs en leuke meiden. Uitstekende service.',
    ua: 'Гарна ціна і приємні дівчата. Чудовий сервіс.',
  },
];

export function reviewText(r: Review, lang: Lang): string {
  return r[lang];
}
