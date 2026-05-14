import type { Lang } from '../translations';

export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: Record<Lang, string>;
  source: 'Google';
};

export const reviews: Review[] = [
  {
    id: 1,
    name: 'Akane Chan',
    rating: 5,
    date: '2024-12-14',
    text: {
      pl: 'Wszystko sterylne i czyste, Pani stylistka przesympatyczna. Paznokcie od bardzo krótkich i obgryzionych wyprowadzone do pięknych zdrowych paznokci. Bardzo polecam.',
      en: 'Everything was sterile and clean, and the stylist was incredibly friendly. My nails went from very short and bitten to beautiful, healthy nails. I highly recommend it.',
      nl: 'Alles steriel en schoon, de styliste is heel sympathiek. Mijn nagels gingen van heel kort en afgebeten naar mooie, gezonde nagels. Echt aanrader.',
    },
    source: 'Google',
  },
  {
    id: 2,
    name: 'Agnieszka Dacewicz',
    rating: 5,
    date: '2024-04-06',
    text: {
      pl: 'Polecam z całego serduszka. Paznokcie są wykonane bardzo dokładnie, precyzyjnie i po prostu pięknie. Atmosfera jest wyjątkowo miła. To cudownie spędzony czas.',
      en: 'I wholeheartedly recommend it. The nails are done very carefully, precisely and simply beautifully. The atmosphere is exceptionally pleasant. A wonderful time.',
      nl: 'Van harte aanbevolen. De nagels worden zorgvuldig, precies en gewoon prachtig gedaan. De sfeer is bijzonder fijn. Heerlijk besteed uurtje.',
    },
    source: 'Google',
  },
  {
    id: 3,
    name: 'Zuzanka Zapiekanka',
    rating: 5,
    date: '2024-12-20',
    text: {
      pl: 'Bardzo polecam. Pełen profesjonalizm oraz przyjemna atmosfera podczas wykonywania stylizacji.',
      en: 'Highly recommended. Complete professionalism and a pleasant atmosphere during the appointment.',
      nl: 'Echt aan te bevelen. Volledig professioneel en een prettige sfeer tijdens de behandeling.',
    },
    source: 'Google',
  },
  {
    id: 4,
    name: 'Ewelina Konek',
    rating: 5,
    date: '2024-04-05',
    text: {
      pl: 'Usługa świetnie wykonana, zawsze wychodzę zadowolona i zbieram sporo pochwał na temat paznokci zrobionych przez Agatę.',
      en: 'The service is excellent. I always leave satisfied and receive lots of compliments on the nails Agata does for me.',
      nl: 'De service is uitstekend. Ik ga altijd tevreden weg en krijg veel complimenten over de nagels die Agata maakt.',
    },
    source: 'Google',
  },
  {
    id: 5,
    name: 'Katarzyna Czrpinska',
    rating: 5,
    date: '2024-04-05',
    text: {
      pl: 'Przesympatyczna dziewczyna, która zna się na swojej pracy. Polecam.',
      en: 'A very nice girl who knows her craft. Recommended.',
      nl: 'Een heel sympathieke dame die haar vak verstaat. Aanrader.',
    },
    source: 'Google',
  },
  {
    id: 6,
    name: 'Sylwia Winiarek',
    rating: 5,
    date: '2024-04-04',
    text: {
      pl: 'Pełen profesjonalizm, paznokcie wykonane starannie i na wysokim poziomie. Polecam serdecznie.',
      en: 'Completely professional, the nails were done carefully and to a high standard. I highly recommend.',
      nl: 'Volledig professioneel, de nagels zorgvuldig en op hoog niveau gedaan. Van harte aanbevolen.',
    },
    source: 'Google',
  },
  {
    id: 7,
    name: 'Kamila Julia Kluk',
    rating: 5,
    date: '2024-04-07',
    text: {
      pl: 'Polecam! Super paznokcie, długo się trzymają.',
      en: 'Recommended. Great nails that last for a long time.',
      nl: 'Aanrader. Mooie nagels die lang blijven zitten.',
    },
    source: 'Google',
  },
];
