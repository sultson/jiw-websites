import { brand } from './brand';
import { asset } from './assets';
import { site } from '../sites';
import type { LanderContent } from '../sites';

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#org`,
    name: brand.name,
    legalName: brand.legalName,
    url: siteUrl,
    email: brand.email,
    telephone: brand.phone.e164,
    image: `${siteUrl}${asset(site.heroImage)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.line1,
      postalCode: brand.address.postcode,
      addressLocality: brand.address.city,
      addressCountry: 'NL',
    },
    areaServed: 'NL',
    identifier: {
      '@type': 'PropertyValue',
      name: 'KvK',
      value: brand.kvk,
    },
  };
}

export function faqJsonLd(c: LanderContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function webPageJsonLd(siteUrl: string, url: string, c: LanderContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name: c.meta.title,
    description: c.meta.description,
    inLanguage: c.lang === 'nl' ? 'nl-NL' : 'en',
    isPartOf: { '@id': `${siteUrl}/#org` },
  };
}
