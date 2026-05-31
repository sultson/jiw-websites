/** Shared site constants — single source of truth for contact + brand facts. */

export const SITE = {
  name: 'Lydia van der Bie',
  tagline: 'Professioneel leren geven vanuit het hart',
  email: 'lydiavanderbie-opleidingen@outlook.com',
  phoneDisplay: '06 17 99 67 03',
  phoneHref: 'tel:+31617996703',
  whatsappHref:
    'https://wa.me/31617996703?text=' +
    encodeURIComponent('Hoi Lydia, ik heb een vraag over een opleiding of behandeling.'),
  street: 'Adm. de Ruyterstraat 42',
  postal: '3262 XE',
  city: 'Oud-Beijerland',
  locationLine: 'Adm. de Ruyterstraat 42, 3262 XE Oud-Beijerland',
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
