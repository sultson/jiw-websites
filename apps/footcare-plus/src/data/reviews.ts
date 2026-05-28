// SOURCE: Google Maps (CID 5578551053405932658), scraped 2026-05-26 via
// apify compass/crawler-google-places. All 6 public reviews at the time of
// scraping. 5.0 average across 6 reviews. Verbatim Dutch.

export type Review = {
  id: number;
  name: string;
  rating: number;
  nl: string;
  source: 'Google' | 'Facebook' | 'Pedicure.nl';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'M.K. Deinum',
    rating: 5,
    nl: 'Een fijne ervaring gehad met de pedicure behandeling van Gerda. In haar prachtige, nieuwe praktijk aan huis ontvangt ze je enthousiast. Gerda werkt netjes en nauwkeurig en legt uit wat ze gaat doen.',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Henk Vander Meer',
    rating: 5,
    nl: 'Zeer aan te bevelen, gaat heel netjes en precies te werk. Mijn moeder had een slechte ervaring gehad met een andere pedicure, ze zag er tegenop maar was zo blij en geen pijn gehad. Gerda kan goed met ouderen omgaan dus wij bevelen haar aan.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Rianne Heikoop',
    rating: 5,
    nl: 'Ik raad FootCare+ zeker aan. Gerda is een lieve en gezellige vrouw die wel van een praatje houdt. Werkt erg hygiënisch en op een fijne manier. Ze weet precies waar ze het over heeft.',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Siepie de Vries',
    rating: 5,
    nl: 'Wij geven FootCare+ 5 sterren. Gerda is in haar werk secuur en neemt alle tijd voor de mens. Ook is het erg fijn dat ze aan huis komt.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Els Huijbers',
    rating: 5,
    nl: 'Heerlijke eeltreiniging gehad, en ook een super leuke vrouw is Gerda. Je voelt je gelijk bij haar thuis, dus van ons krijgt ze een dikke 10.',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Jan Nota',
    rating: 5,
    nl: 'Vakkundig en professioneel.',
    source: 'Google',
  },
];
