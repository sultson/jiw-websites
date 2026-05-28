export type Review = {
  id: string;
  name: string;
  rating: number;
  source: 'Google';
  date: string;
  nl?: string;
  en?: string;
};

export const reviews: Review[] = [
  {
    id: 'lordiana',
    name: 'Lordiana Rijzinga',
    rating: 5,
    source: 'Google',
    date: '2025',
    nl: 'Een hele leuke lieve meid. Heeft echt verstand van wat ze doet. Ik heb "probleem"-nagels, maar ze weet er raad mee. Ze neemt de tijd voor je. Lekker huiselijk sfeertje.',
    en: 'A really lovely woman who knows exactly what she\'s doing. I have problem nails and she has an answer for them. She takes her time. A homey, warm vibe.',
  },
  {
    id: 'syphra',
    name: 'Syphra Van Kemp',
    rating: 5,
    source: 'Google',
    date: '2025',
    nl: 'Super nette en goede service. Kom hier al 17+ jaar. Als je unieke handgeschilderde nail art wil is dit echt je adres. Super vriendelijk en altijd hygiënisch.',
    en: 'Super tidy and great service. I\'ve been coming here for 17+ years. For unique hand-painted nail art, this is the place. Super friendly and always hygienic.',
  },
  {
    id: 'janneke',
    name: 'Janneke Koetje',
    rating: 5,
    source: 'Google',
    date: '2025',
    nl: 'Deze salon is echt een aanrader. Het is er netjes, hygiënisch, gezellig en ze maakt prachtige nagels. Prachtige art op de nagels uit losse hand.',
    en: 'I really recommend this salon. It\'s tidy, hygienic and welcoming, and she makes beautiful nails. Stunning freehand art.',
  },
  {
    id: 'chantal',
    name: 'Chantal Boelens',
    rating: 5,
    source: 'Google',
    date: '2025',
    nl: 'Zo\'n goede salon, de beste die ik ken. Oprecht altijd zo blij met m\'n nagels. Super lieve vrouw. Zeker een aanrader.',
    en: 'Such a great salon, the best I know. I\'m always genuinely thrilled with my nails. A truly lovely woman. Highly recommended.',
  },
  {
    id: 'moniek',
    name: 'Moniek Drenth',
    rating: 5,
    source: 'Google',
    date: '2025',
    nl: 'Super goede salon, goede service, kwaliteit staat bovenaan. De producten zijn goed en het werk is super. Ik blijf met liefde hier komen.',
    en: 'Super good salon, great service, quality comes first. The products are good and the work is excellent. I\'ll keep coming back happily.',
  },
];
