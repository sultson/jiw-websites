export type Review = {
  name: string;
  date: string;
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    name: 'Sanie',
    date: 'Werkspot · Rotterdam',
    rating: 5,
    text: 'Kwalitatief erg goed, goede service en erg vriendelijk. Sezo Klussen Bedrijf kan ik echt aanraden.',
  },
  {
    name: 'Gail',
    date: 'Werkspot · Rotterdam',
    rating: 5,
    text: 'Mijn ervaring was top. Snelle reactie nadat ik mijn opdracht had geplaatst, stonden dezelfde dag voor de deur om de klus te bekijken en waren binnen 2 dagen al klaar. Ik bel ze in de toekomst zeker weer.',
  },
  {
    name: 'Loran',
    date: 'Werkspot · Rotterdam',
    rating: 5,
    text: 'Top vakmannen. Het begon met een fijn telefoongesprek en duidelijke afspraken. De mannen plakten eerst onze kamer uitgebreid af en begonnen pas toen alles ingepakt was. Twee dagen keihard gewerkt en alles netjes schoon achtergelaten. Wij zijn erg blij met de communicatie en de kwaliteit van het werk.',
  },
  {
    name: 'Ramazan',
    date: 'Werkspot · Bergschenhoek',
    rating: 5,
    text: 'Sezer is een top kerel. Hij staat voor je klaar, zit boven op de uitvoerders en waakt ervoor dat het werk goed en netjes wordt afgerond. Goed bereikbaar en denkt mee. Een fijne ervaring.',
  },
  {
    name: 'Burcin',
    date: 'Werkspot · Rotterdam',
    rating: 5,
    text: 'Vakwerk, uitstekende planning, vriendelijk personeel en snelle reacties bij vragen.',
  },
  {
    name: 'Goksel',
    date: 'Werkspot · Rotterdam',
    rating: 5,
    text: 'Via een kennis bij Sezo terechtgekomen. Hij heeft mijn woonkamer gestuct en mijn badkamer getegeld. Strak resultaat, communicatie was goed en hij houdt zich aan de afspraken. Tegen een nette prijs uitgevoerd. Zeker een aanrader.',
  },
];

export const ratingScore = 4.8;
export const reviewCount = 7;
