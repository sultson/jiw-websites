/**
 * Placeholder entries for the news module. Every item is a sourced fact about
 * Klashorst rather than invented museum news, and the UI labels the block as an
 * example so nobody mistakes it for a published agenda.
 */
export type NewsItem = {
  slug: string;
  image: string;
  date: { nl: string; en: string };
  title: { nl: string; en: string };
  body: { nl: string; en: string };
};

export const news: NewsItem[] = [
  {
    slug: 'in-memoriam',
    image: '/art/selfie-big.webp',
    date: { nl: '11 september 2024', en: '11 September 2024' },
    title: { nl: 'Peter Klashorst, 1957 / 2024', en: 'Peter Klashorst, 1957 / 2024' },
    body: {
      nl: 'Peter Klashorst overleed op 67-jarige leeftijd in Amsterdam. Hij liet een oeuvre na van ruim veertig jaar schilderen, fotograferen en reizen.',
      en: 'Peter Klashorst died in Amsterdam at the age of 67. He left behind more than forty years of painting, photography and travel.',
    },
  },
  {
    slug: 's21-tuol-sleng',
    image: '/art/s21-ii.webp',
    date: { nl: '2011', en: '2011' },
    title: { nl: 'De S21-portretten in Phnom Penh', en: 'The S21 portraits in Phnom Penh' },
    body: {
      nl: 'Met steun van UNESCO hingen Klashorsts portretten van gevangenen in het Tuol Sleng Genocide Museum, op de plek waar de originele politiefoto’s zijn gemaakt.',
      en: 'With support from UNESCO, Klashorst’s portraits of prisoners hung in the Tuol Sleng Genocide Museum, in the place where the original police photographs were taken.',
    },
  },
  {
    slug: 'kunstkannibaal',
    image: '/art/piclasso-gambia.webp',
    date: { nl: '2011', en: '2011' },
    title: { nl: 'Kunstkannibaal verschijnt', en: 'Kunstkannibaal is published' },
    body: {
      nl: 'Klashorst schreef zijn autobiografie Kunstkannibaal. Robert Vuijsje publiceerde eerder, in 2003, het portret King Klashorst.',
      en: 'Klashorst wrote his autobiography Kunstkannibaal. Robert Vuijsje had earlier, in 2003, published the portrait King Klashorst.',
    },
  },
];
