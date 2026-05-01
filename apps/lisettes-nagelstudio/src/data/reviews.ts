export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  nl?: string;
  en?: string;
  source: string;
};

// Verbatim Google Maps reviews for Lisette's Nagelstudio, 5.0 / 12.
// Dutch review text is kept exactly as sourced where present.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Laura Laura',
    rating: 5,
    date: '18 jul 2024',
    nl: 'Super service en zeer klantvriendelijk. Met mooie voetjes de zomer in!',
    en: 'Great service and very customer friendly. Heading into summer with beautiful feet!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Wendy van Dam',
    rating: 5,
    date: '24 apr 2024',
    nl: 'Heel snel en makkelijk een afspraak kunnen maken. Lisette werkt netjes en maakt van mijn nagels kleine kunstwerkjes. Het gezellige praatje tussendoor zorgt ervoor dat  je ontspannen zit en de tijd vliegt. Ik blijf hier zeker komen!',
    en: 'It was very quick and easy to make an appointment. Lisette works neatly and turns my nails into little works of art. The friendly conversation in between helps you relax and time flies. I will definitely keep coming here!',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Cornelieke Wentzel',
    rating: 5,
    date: '7 nov 2023',
    nl: 'Ontzettend lieve nagelstyliste. Erg kundig. Werkt snel, nauwkeurig en hygiënisch en ondertussen ook nog gezellig kletsen. Aanrader!',
    en: 'A very kind nail stylist. Very skilled. Works quickly, accurately and hygienically while also having a friendly chat. Recommended!',
    source: 'Google',
  },
  {
    id: 4,
    name: 'Djamilla Meuldijk',
    rating: 5,
    date: '8 aug 2023',
    nl: 'Ik zocht snel iemand om mijn bruidsnagels te verwijderen. Ik kreeg snel contact met deze studio en het verliep erg fijn. Ook tijdens de afspraak heel fijn geholpen en gezellig kunnen kletsen. Echt een aanrader!',
    en: 'I urgently needed someone to remove my bridal nails. I got in touch with this studio quickly and everything went very smoothly. I was also helped very nicely during the appointment and had a friendly chat. Truly recommended!',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Michel Bouwman',
    rating: 5,
    date: '15 jan 2025',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Wilflesje',
    rating: 5,
    date: '21 nov 2023',
    source: 'Google',
  },
  {
    id: 7,
    name: 'yvonne visch',
    rating: 5,
    date: '15 jan 2023',
    source: 'Google',
  },
  {
    id: 8,
    name: 'HB Vierwind',
    rating: 5,
    date: '14 sep 2021',
    source: 'Google',
  },
  {
    id: 9,
    name: 'Sandra Van de ridder',
    rating: 5,
    date: '11 sep 2021',
    source: 'Google',
  },
  {
    id: 10,
    name: 'Marjolein Losenoord',
    rating: 5,
    date: '9 sep 2021',
    source: 'Google',
  },
  {
    id: 11,
    name: 'Ineke Tomassen',
    rating: 5,
    date: '6 sep 2021',
    source: 'Google',
  },
  {
    id: 12,
    name: 'Petra Dokter',
    rating: 5,
    date: '27 aug 2021',
    source: 'Google',
  },
];
