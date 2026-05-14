export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  en: string;
  hy?: string;
  source: 'Google';
};

// Real Google reviews scraped 2026-05-13.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Thonia Weijens',
    rating: 5,
    nl: 'Liana is heel professioneel maar ook een heel lief persoon. Voor prachtige gelnagels moet je naar Liana. Ze heeft jarenlange ervaring en dat merk je. Liana is een topper.',
    en: 'Liana is very professional and also a really sweet person. For beautiful gel nails you have to go to Liana. She has years of experience and you can tell. Liana is a star.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Eline Boers',
    rating: 5,
    nl: 'Zij is de beste nagelstyliste die ik ooit heb gehad. Liana is vriendelijk, professioneel en neemt echt de tijd voor je. Ze werkt hygiënisch en levert altijd superstrakke resultaten.',
    en: "She is the best nail stylist I have ever had. Liana is friendly, professional and really takes time for you. She works hygienically and always delivers sharp results.",
    source: 'Google',
  },
  {
    id: 3,
    name: 'Susanna Baghramyan',
    rating: 5,
    nl: 'Ik kwam met nagels die helemaal verpest waren door een andere salon. Met zoveel geduld, zorg en professionele kennis heeft Liana mijn nagels weer tot leven gebracht. Echt mijn nagelredder.',
    en: 'I came in with nails that were completely ruined by another salon. With so much patience, care and expertise Liana brought my nails back to life. Truly my nail saviour.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Danielle Groot',
    rating: 5,
    nl: 'Iedere keer zeer tevreden. Manicure en pedicure tot in de puntjes verzorgd. Liana werkt professioneel, beschikt over veel kennis en de salon is schoon en sfeervol.',
    en: 'Always very satisfied. Manicure and pedicure done to perfection. Liana works professionally, knows her craft, and the salon is clean and warm.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Sevo',
    rating: 5,
    nl: 'Ik had last van een schimmelnagel en ben hier ontzettend goed geholpen. Ze legt alles duidelijk uit, geeft goede adviezen en behandelt alles netjes. Mijn nagel is volledig hersteld.',
    en: 'I had a nail fungus and got excellent help here. She explains everything clearly, gives good advice and treats everything carefully. My nail is fully recovered.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Karla Burgos',
    rating: 5,
    nl: 'Zo tevreden met alles. Mijn nagels en pedicure zijn fantastisch en met precisie gedaan. Je ziet dat Liana van haar vak houdt. De service is A+, ze behandelt iedereen met respect.',
    en: 'So satisfied with everything. My nails and pedicure are amazing and done with perfection. You can see Liana really loves what she does. The service is A+, she treats everyone with respect.',
    source: 'Google',
  },
  {
    id: 7,
    name: 'Denise Gruteke',
    rating: 5,
    nl: 'Liana werkt professioneel en snel, maar tegelijk met veel aandacht en precisie. Het resultaat is supermooi: strak, glanzend en precies zoals ik het wilde.',
    en: 'Liana works professionally and quickly, but with lots of attention and precision. The result is beautiful: sharp, glossy and exactly how I wanted it.',
    source: 'Google',
  },
  {
    id: 8,
    name: 'Yelena Baghdasaryan',
    rating: 5,
    nl: 'Uitstekende pedicure ervaring. De salon is schoon en modern, met een kalmerende sfeer. De producten zijn van hoge kwaliteit en de nagellak werd nauwkeurig en professioneel aangebracht.',
    en: 'Excellent pedicure experience. The salon is clean, modern and has a calm atmosphere. Products are high quality and the polish was applied precisely.',
    source: 'Google',
  },
];
