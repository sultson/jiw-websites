export type Review = {
  id: number;
  name: string;
  rating: number;
  dateNl: string;
  dateEn: string;
  nl: string;
  en: string;
  source: 'Google';
};

// Verbatim Google reviews (rating 5.0, all reviews as of June 2026).
// EN texts are translations of the Dutch originals.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Ingrid Rockx',
    rating: 5,
    dateNl: 'juni 2026',
    dateEn: 'June 2026',
    nl: 'Erg kundige en vriendelijke nagelstyliste. Altijd weer erg blij met mijn nieuwe nagels. Top!',
    en: 'A very skilled and friendly nail stylist. Always so happy with my new nails. Great!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Anja Heeren',
    rating: 5,
    dateNl: 'februari 2026',
    dateEn: 'February 2026',
    nl: 'Ben blij met mijn nagels. Had heel snel een afspraak en ze was heel secuur. Werd vriendelijk ontvangen en de prijs was redelijk. Een aanrader.',
    en: 'Happy with my nails. Got an appointment really quickly and she was very precise. I was welcomed warmly and the price was fair. Highly recommended.',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Nienke van den Akker',
    rating: 5,
    dateNl: 'december 2025',
    dateEn: 'December 2025',
    nl: 'Een professionele nagelstyliste, gezellig en kundig. Dankjewel Jennifer voor alle keren dat je mijn nagels zo mooi hebt gedaan!',
    en: "A professional nail stylist, fun and skilled. Thank you Jennifer for all the times you've made my nails look so beautiful!",
    source: 'Google',
  },
];
