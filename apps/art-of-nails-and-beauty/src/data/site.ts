// Single source of truth for business facts.
export const site = {
  name: 'Art of Nails & Beauty',
  owner: 'Miriam Jenis',
  street: 'Overkroetenlaan 130',
  postalCode: '4823 KB',
  city: 'Breda',
  phoneDisplay: '06 54221764',
  phoneE164: '+31654221764',
  whatsapp: '31654221764',
  instagram: 'https://www.instagram.com/artofnailsandbeauty/',
  facebook: 'https://www.facebook.com/profile.php?id=100063792182993',
  mapsUrl: 'https://maps.google.com/?cid=13909854535582552901',
  mapsEmbed:
    'https://www.google.com/maps?q=Art+of+Nails+%26+Beauty+Overkroetenlaan+130+Breda&output=embed',
  treatwellWidget:
    'https://widget.treatwell.nl/salon/art-of-nails-beauty/?utm_source=partner&utm_medium=partner-site-book-now-widget',
  treatwellSite: 'https://art-of-nails-and-beauty.mytreatwell.nl/',
  rating: '5,0',
  reviewCount: 11,
} as const;

// Opening hours: [dayKey, openLabel | null]
export const hours: { key: string; value: string | null }[] = [
  { key: 'visit.day.mon', value: null },
  { key: 'visit.day.tue', value: '10:00 - 17:00' },
  { key: 'visit.day.wed', value: '10:00 - 17:00' },
  { key: 'visit.day.thu', value: '10:00 - 17:00' },
  { key: 'visit.day.fri', value: '10:00 - 17:00' },
  { key: 'visit.day.sat', value: '10:00 - 15:00' },
  { key: 'visit.day.sun', value: null },
];
