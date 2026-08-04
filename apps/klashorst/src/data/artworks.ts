export type Artwork = {
  slug: string;
  title: string;
  /** Ratio of the source photograph, used to reserve layout space and size the 3D canvas. */
  ratio: number;
  medium: { nl: string; en: string };
  size: string;
  /** Short wall label. Only facts that come from the estate's own catalogue. */
  note?: { nl: string; en: string };
  series?: 's21';
};

/**
 * Catalogue data mirrors the estate shop at peterklashorst.com: medium and
 * dimensions are quoted from there. Years are only stated where the estate
 * states them, so most works carry none.
 */
export const artworks: Artwork[] = [
  {
    slug: 's21-i',
    title: 'S21 Portrait I',
    ratio: 0.743,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '180 × 135 cm',
    series: 's21',
  },
  {
    slug: 's21-ii',
    title: 'S21 Portrait II',
    ratio: 0.765,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '180 × 135 cm',
    series: 's21',
  },
  {
    slug: 's21-iii',
    title: 'S21 Portrait III',
    ratio: 0.756,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '180 × 135 cm',
    series: 's21',
  },
  {
    slug: 's21-cambodian-man',
    title: 'S21 Portrait Cambodian Man',
    ratio: 0.742,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '180 × 135 cm',
    series: 's21',
  },
  {
    slug: 'pearl-earring',
    title: 'Pearl With A Pearl Earring',
    ratio: 0.76,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '180 × 150 cm',
    note: {
      nl: 'Klashorst nam de westerse kunstgeschiedenis herhaaldelijk onder handen. Hier is het Meisje met de parel de aanleiding.',
      en: 'Klashorst repeatedly took western art history apart. Here the Girl with a Pearl Earring is the starting point.',
    },
  },
  {
    slug: 'two-ladies-1984',
    title: 'Two Ladies 1984',
    ratio: 0.87,
    medium: { nl: 'Olieverf op doek', en: 'Oil on canvas' },
    size: '160 × 180 cm',
    note: {
      nl: 'Vroeg werk uit 1984, de jaren van de Nieuwe Wilden.',
      en: 'Early work from 1984, the years of the Nieuwe Wilden.',
    },
  },
  {
    slug: 'marlboro-man-rob',
    title: 'Marlboro Man Rob',
    ratio: 0.757,
    medium: { nl: 'Acrylverf op pvc', en: 'Acrylic on PVC' },
    size: '180 × 160 cm',
  },
  {
    slug: 'piclasso-gambia',
    title: 'Piclasso Gambia',
    ratio: 0.691,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '135 × 90 cm',
    note: {
      nl: 'Gemaakt in Gambia, 2022.',
      en: 'Made in Gambia, 2022.',
    },
  },
  {
    slug: 'selfie-big',
    title: 'Selfie BIG',
    ratio: 0.75,
    medium: { nl: 'Acrylverf op pvc', en: 'Acrylic on PVC' },
    size: '130 × 90 cm',
  },
  {
    slug: 'almost-christmas',
    title: 'Almost Christmas',
    ratio: 0.697,
    medium: { nl: 'Olie- en acrylverf op pvc', en: 'Oil and acrylic on PVC' },
    size: '180 × 130 cm',
  },
  {
    slug: 'jesus-and-fred',
    title: 'Jesus and Fred & Friends',
    ratio: 0.708,
    medium: { nl: 'Olie- en acrylverf op pvc', en: 'Oil and acrylic on PVC' },
    size: '180 × 130 cm',
  },
  {
    slug: 'modern-mona-lisa',
    title: 'Modern Mona Lisa',
    ratio: 0.75,
    medium: { nl: 'Acrylverf op pvc', en: 'Acrylic on PVC' },
    size: '130 × 100 cm',
  },
  {
    slug: 'picasso-meets-hitler',
    title: 'Picasso meets Hitler',
    ratio: 0.713,
    medium: { nl: 'Acrylverf op pvc', en: 'Acrylic on PVC' },
    size: '105 × 80 cm',
  },
  {
    slug: 'mouth',
    title: 'Mouth',
    ratio: 0.788,
    medium: { nl: 'Acrylverf op doek', en: 'Acrylic on canvas' },
    size: '100 × 80 cm',
  },
];

export const bySlug = Object.fromEntries(artworks.map((a) => [a.slug, a]));

/**
 * The works hung in the 3D room, in the order they appear around it.
 *
 * Everything except the S21 series. Those four are painted after the Khmer
 * Rouge's own photographs of prisoners who were then murdered, and they belong
 * in their own section rather than turning past a headline as scenery.
 */
export const roomSlugs = [
  'pearl-earring',
  'two-ladies-1984',
  'marlboro-man-rob',
  'piclasso-gambia',
  'selfie-big',
  'almost-christmas',
  'jesus-and-fred',
  'modern-mona-lisa',
  'picasso-meets-hitler',
  'mouth',
] as const;

export const roomWorks = roomSlugs.map((slug) => bySlug[slug]);
