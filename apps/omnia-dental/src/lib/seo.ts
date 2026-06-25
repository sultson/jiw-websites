import { site, dayLabels, type WeekdayKey } from '../data/site';
import type { Lang } from './i18n';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return new URL(path, site.url).toString();
}

const schemaDayMap: Record<WeekdayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

function openingHoursSpec() {
  return site.hours
    .filter((h) => h.open && h.close)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${schemaDayMap[h.day]}`,
      opens: h.open,
      closes: h.close,
    }));
}

/** Primary LocalBusiness / Dentist schema for the practice. */
export function dentistJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${site.url}/#practice`,
    name: site.name,
    description:
      lang === 'nl'
        ? 'Tandarts in Hoofddorp voor het hele gezin. Alle behandelingen onder één dak, van controle en mondhygiëne tot implantaten, kronen, wortelkanaalbehandeling en CEREC.'
        : 'Dentist in Hoofddorp for the whole family. All treatments under one roof, from check-ups and hygiene to implants, crowns, root canal treatment and CEREC.',
    url: site.url,
    telephone: site.phone.display,
    email: site.email,
    image: absoluteUrl('/images/og-default.jpg'),
    logo: absoluteUrl('/images/omnia-logo-mark-180.png'),
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    hasMap: site.maps.directions,
    openingHoursSpecification: openingHoursSpec(),
    areaServed: [
      { '@type': 'City', name: 'Hoofddorp' },
      { '@type': 'City', name: 'Nieuw-Vennep' },
      { '@type': 'City', name: 'Haarlemmermeer' },
    ],
    founder: {
      '@type': 'Person',
      name: site.owner.name,
      jobTitle: lang === 'nl' ? 'Tandarts' : 'Dentist',
      identifier: { '@type': 'PropertyValue', propertyID: 'BIG', value: site.owner.bigNumber },
    },
    availableLanguage: ['nl', 'en'],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export { dayLabels };
