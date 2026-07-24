import { site } from '../data/site';
import type { Lang } from './i18n';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return new URL(path, site.url).toString();
}

/** Organization schema, on every page. */
export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#org`,
    name: site.name,
    legalName: site.legalName,
    slogan: site.tagline,
    url: site.url,
    email: site.email,
    telephone: site.phone.e164,
    image: absoluteUrl('/images/og.jpg'),
    logo: absoluteUrl('/images/logo.png'),
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressCountry: 'NL',
    },
    areaServed: ['Rotterdam', 'Europoort', 'Maasvlakte', 'Netherlands'],
    identifier: {
      '@type': 'PropertyValue',
      name: 'KvK',
      value: site.kvk,
    },
  };
}

export function serviceJsonLd(name: string, description: string, path: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: lang,
    provider: { '@id': `${site.url}/#org` },
    areaServed: 'Netherlands',
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
