export type Review = {
  author: string;
  stars: number;
  textNl: string;
  textEn: string;
  publishedAt: string;
  source: 'google';
};

export const reviews: Review[] = [
  {
    author: 'Gwen Breuer',
    stars: 5,
    textNl:
      'Ons huis is van binnen en buiten strak en mooi geschilderd door Kok Vastgoedonderhoud. Jesse werkt netjes en snel, denkt mee en levert echt vakwerk af. Erg blij met het resultaat!',
    textEn:
      'Our home was painted neatly inside and out by Kok Vastgoedonderhoud. Jesse works tidy and quickly, thinks along with you and delivers real craft. Very happy with the result!',
    publishedAt: '2026-05-07',
    source: 'google',
  },
];
