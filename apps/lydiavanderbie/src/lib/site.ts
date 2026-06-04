/** Shared site constants — single source of truth for contact + brand facts. */

export const SITE = {
  name: 'Lydia van der Bie',
  tagline: 'Professioneel leren geven vanuit het hart',
  phoneDisplay: '06 17 99 67 03',
  phoneHref: 'tel:+31617996703',
  whatsappHref:
    'https://wa.me/31617996703?text=' +
    encodeURIComponent('Hoi Lydia, ik heb een vraag over een opleiding of behandeling.'),
  city: 'Oud-Beijerland',
  locationLine: 'Oud-Beijerland',
  kvk: '24465028',
  kvkCity: 'Rotterdam',
  practiceSince: 1998,
  crkboSince: 2010,
  onlineAcademy: 'https://www.lydiavanderbie-online-inspiratie.nl',
  /** years giving treatments — computed so it never goes stale */
  get years() {
    return new Date().getFullYear() - this.practiceSince;
  },
} as const;
