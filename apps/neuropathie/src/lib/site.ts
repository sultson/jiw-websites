/** Shared site constants — single source of truth for contact + brand facts. */

export const SITE = {
  name: 'Voetreflexologie bij neuropathie',
  shortName: 'Voetreflexologie bij neuropathie',
  tagline: 'Een landelijk netwerk van gespecialiseerde voetreflextherapeuten',
  host: 'neuropathie.jouwidealewebsite.nl',
  /** Same contact details as lydiavanderbie.nl — confirmed by Armando 01-11-2026. */
  phoneDisplay: '06 17 99 67 03',
  phoneHref: 'tel:+31617996703',
  whatsappHref:
    'https://wa.me/31617996703?text=' +
    encodeURIComponent('Hoi Lydia, ik heb een vraag over voetreflexologie bij neuropathie.'),
  city: 'Oud-Beijerland',
  locationLine: 'Oud-Beijerland',
  kvk: '24465028',
  mainSite: 'https://lydiavanderbie.nl',
  onlineAcademy: 'https://www.lydiavanderbie-online-inspiratie.nl',
  courseUrl: 'https://lydiavanderbie-online-inspiratie.nl/product/voetreflexologie-en-neuropathie/',
} as const;
