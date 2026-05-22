export type Review = {
  name: string;
  text: string;
  stars: number;
  date: string;
  context?: string;
};

// Pulled from Google Maps reviews for placeId ChIJ9VXNPm9Xz0cRmbm8UaLW-Qk
export const reviews: Review[] = [
  {
    name: 'Sonja',
    text: 'Super fijne salon. Mijn nagels zijn altijd tot in de puntjes verzorgd! Daniëlle is ontzettend vakkundig en een topper in BIAB zetten. Altijd weer een uitje om naar uit te kijken.',
    stars: 5,
    date: '2024-06-27',
    context: 'Gelmanicures, nagelontwerpen',
  },
  {
    name: 'Marianne Terlien',
    text: 'Al jaren ben ik een meer dan tevreden klant. De nagels waarmee ik een paar jaar geleden kwam, waren in erbarmelijke staat. Nu krijg ik random complimenten van mensen over mijn prachtige nagels.',
    stars: 5,
    date: '2024-07-04',
  },
  {
    name: 'Sandra Pastoor',
    text: 'Een hele goeie en een hele leuke sfeer! Van helemaal geen nagels naar mooi verzorgde nagels. Daniëlle is een topper, ik ga er met heel veel plezier naar toe.',
    stars: 5,
    date: '2024-06-27',
    context: 'Acrylnagels',
  },
  {
    name: 'Majka van Eck',
    text: 'Leuke dame, lekker huiselijk gevoel! Maakt mooie resultaten en heeft ontzettend veel opties. En dat voor een leuke prijs!',
    stars: 5,
    date: '2024-07-01',
    context: 'Kunstnagels, gelmanicures',
  },
  {
    name: 'Naom (via Jan Buitenhuis)',
    text: 'Al jaren prachtige nagels! Zo ontzettend blij met jou, je service is top en je levert altijd kwaliteit!',
    stars: 5,
    date: '2024-06-24',
    context: 'Kunstnagels, nagelverlengingen',
  },
];
