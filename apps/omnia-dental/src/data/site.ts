// Single source of truth for NAP (Name / Address / Phone) and practice facts.
// Used by schema.org JSON-LD, the footer, contact + spoed pages, and the head.

export const site = {
  name: 'Omnia Dental',
  legalName: 'Omnia Dental',
  tagline: {
    nl: 'Tandarts in Hoofddorp',
    en: 'Dentist in Hoofddorp',
  },
  // Brand promise from the branding sheet.
  motto: {
    nl: 'Gezonde lach, zelfverzekerd leven',
    en: 'Healthy smiles, confident lives',
  },
  url: 'https://omniadental.jouwidealewebsite.nl',
  email: 'info@omniadental.nl',
  phone: {
    display: '+31 6 11437329',
    href: 'tel:+31611437329',
    whatsapp: 'https://wa.me/31611437329',
    whatsappIntl: '31611437329',
  },
  owner: {
    name: 'Drs. N. Gangaram Panday',
    shortName: 'Naresh Gangaram Panday',
    firstName: 'Naresh',
    role: { nl: 'Tandarts & praktijkhouder', en: 'Dentist & practice owner' },
    bigNumber: '19917414702',
  },
  address: {
    line1: 'Manenburgdreef 101',
    line2: 'Unit 2.8',
    postalCode: '2135 GW',
    city: 'Hoofddorp',
    country: 'NL',
    countryName: { nl: 'Nederland', en: 'The Netherlands' },
    // Hoofddorp, Manenburgdreef — approximate coordinates for the map embed.
    lat: 52.2967,
    lng: 4.6783,
  },
  maps: {
    // Search-by-address link works without an API key and always resolves.
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Manenburgdreef+101+2135+GW+Hoofddorp',
    embed:
      'https://www.google.com/maps?q=Manenburgdreef+101,+2135+GW+Hoofddorp&output=embed',
  },
  // Opening hours, 24h. null = closed. Keep in one place so the schema.org
  // openingHours and the on-page table never drift apart.
  hours: [
    { day: 'mon', open: '08:30', close: '17:00' },
    { day: 'tue', open: '08:30', close: '17:00' },
    { day: 'wed', open: '08:30', close: '17:00' },
    { day: 'thu', open: '08:30', close: '17:00' },
    { day: 'fri', open: '08:30', close: '16:00' },
    { day: 'sat', open: null, close: null },
    { day: 'sun', open: null, close: null },
  ],
  // The official NZa tariff list (regulated dental prices) — linked from the
  // tarieven page so patients can always reach the authoritative source.
  nzaTariffUrl: 'https://www.nza.nl/zorgsectoren/mondzorg',
} as const;

export type WeekdayKey = (typeof site.hours)[number]['day'];

export const dayLabels: Record<WeekdayKey, { nl: string; en: string; short: { nl: string; en: string } }> = {
  mon: { nl: 'Maandag', en: 'Monday', short: { nl: 'Ma', en: 'Mon' } },
  tue: { nl: 'Dinsdag', en: 'Tuesday', short: { nl: 'Di', en: 'Tue' } },
  wed: { nl: 'Woensdag', en: 'Wednesday', short: { nl: 'Wo', en: 'Wed' } },
  thu: { nl: 'Donderdag', en: 'Thursday', short: { nl: 'Do', en: 'Thu' } },
  fri: { nl: 'Vrijdag', en: 'Friday', short: { nl: 'Vr', en: 'Fri' } },
  sat: { nl: 'Zaterdag', en: 'Saturday', short: { nl: 'Za', en: 'Sat' } },
  sun: { nl: 'Zondag', en: 'Sunday', short: { nl: 'Zo', en: 'Sun' } },
};
