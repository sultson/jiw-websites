export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  source: 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Cherine H.',
    rating: 5,
    nl: 'Ik ben ontzettend tevreden over mijn behandelingen bij deze skin clinic. Ik had last van een onzuivere en doffe huid, maar al na twee gezichtsbehandelingen zie ik een enorm verschil. Mijn huid is veel egaler, frisser en straalt weer. Geen standaard behandeling, maar echt advies op maat en een persoonlijk plan dat past bij mijn huidtype en doelen.',
    en: "I'm extremely happy with my treatments at this skin clinic. I had a dull, blemished skin, but after just two facials I see a huge difference. My skin is much more even, fresher and glowing again. No standard treatment, but truly tailored advice and a personal plan that matches my skin type and goals.",
    source: 'Google',
  },
  {
    id: 2,
    name: 'Eméni Nefzi',
    rating: 5,
    nl: 'Na heel lang zoeken naar de juiste huidtherapeut heb ik eindelijk mijn plekje gevonden. Super schone salon. De resultaten waren veel sneller dan ik persoonlijk had verwacht.',
    en: 'After a long search for the right skin therapist, I finally found my spot. Super clean salon. The results came much faster than I had expected.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Tugce Atln',
    rating: 5,
    nl: 'Een hele fijne ervaring bij huidtherapeut Nadia. Ze is deskundig, professioneel en erg prettig in de omgang. De behandeling was duidelijk uitgelegd en perfect afgestemd op mijn huid. Ik ben erg blij met het resultaat en kom hier zeker terug.',
    en: 'A really lovely experience with skin therapist Nadia. She is knowledgeable, professional and very pleasant. The treatment was clearly explained and perfectly tuned to my skin. I am very happy with the result and will definitely return.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'F. C.',
    rating: 5,
    nl: 'Zo tevreden over mijn laserbehandelingen. Er wordt echt de tijd voor je genomen in plaats van zoals vele andere salons die afraffelen om snel door te gaan naar de volgende klant. Super lieve, kundige en ervaren eigenaar. Iemand die echt kwaliteit biedt voor wat je betaalt.',
    en: 'So happy with my laser treatments. The time is really taken for you, unlike many other salons that rush through to the next client. A very kind, skilled and experienced owner. Someone who genuinely delivers quality for what you pay.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Saar C.',
    rating: 5,
    nl: 'Nadia is heel professioneel en weet wat ze doet. Geeft goede adviezen wat betreft je huidtype. Altijd met een fijn gevoel bij haar langs geweest.',
    en: 'Nadia is very professional and knows what she does. Gives good advice about your skin type. I always leave with a nice feeling after a visit.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'B.A.',
    rating: 5,
    nl: 'Werd heel goed behandeld, heel positief met de resultaten. Lieve meid.',
    en: 'Was treated very well, very positive about the results. Lovely person.',
    source: 'Google',
  },
];

export const ratingMeta = {
  average: 5.0,
  count: 7,
};
