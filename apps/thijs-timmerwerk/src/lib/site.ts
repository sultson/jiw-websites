/** Shared site constants — single source of truth for contact + brand facts. */

export const SITE = {
  name: 'Thijs Timmerwerk',
  phoneDisplay: '06 81 31 21 38',
  phoneHref: 'tel:+31681312138',
  whatsappHref:
    'https://wa.me/31681312138?text=' +
    encodeURIComponent('Hoi Thijs, ik heb een vraag over een klus.'),
  email: 'info@thijstimmerwerk.nl',
  street: 'Flierstraat 19',
  postal: '4812 LC',
  city: 'Breda',
  kvk: '53334825',
  founded: 2011,
  marktplaats:
    'https://www.marktplaats.nl/v/diensten-en-vakmensen/timmerlieden-en-meubelmakers/m1276833173-thijs-timmerwerk',
  ratingValue: '5,0',
  ratingCount: 63,
  /** years in business — computed so it never goes stale */
  get years() {
    return new Date().getFullYear() - this.founded;
  },
} as const;
