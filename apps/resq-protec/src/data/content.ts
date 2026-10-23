export type Lang = 'nl' | 'en' | 'de';
export const langs: Lang[] = ['nl', 'en', 'de'];

// The production origin. Every canonical, hreflang, og:url, schema.org id and sitemap
// entry is built on it, so the concept hosts point search engines here already and
// go-live is only a matter of attaching the domain (see README).
export const SITE = 'https://rescuewatercraft.eu';

declare const __DEFAULT_LANG__: Lang;
/** The language on `/`. Set by DEFAULT_LANG in wrangler.jsonc (see tools/default-lang.mjs). */
export const defaultLang: Lang = __DEFAULT_LANG__;
/** The language of a built path: its /<lang> prefix, or the default language without one. */
export const langOfPath = (path: string): Lang => langs.find(lang => lang !== defaultLang && (path === `/${lang}` || path.startsWith(`/${lang}/`) || path.startsWith(`/${lang}.`))) ?? defaultLang;
/** The default language first: it is the x-default and leads every list of languages. */
export const langOrder: Lang[] = [defaultLang, ...langs.filter(lang => lang !== defaultLang)];

const slugs = {
  nl: { courses: 'opleidingen-en-trainingen', equipment: 'equipment', updates: 'actueel', contact: 'contact' },
  en: { courses: 'courses-and-training', equipment: 'equipment', updates: 'updates', contact: 'contact' },
  de: { courses: 'ausbildung-und-training', equipment: 'ausruestung', updates: 'aktuelles', contact: 'kontakt' },
};
const prefix = (lang: Lang) => (lang === defaultLang ? '' : `/${lang}`);
export const routes = Object.fromEntries(langs.map(lang => [lang, {
  home: prefix(lang) || '/',
  courses: `${prefix(lang)}/${slugs[lang].courses}`,
  equipment: `${prefix(lang)}/${slugs[lang].equipment}`,
  updates: `${prefix(lang)}/${slugs[lang].updates}`,
  contact: `${prefix(lang)}/${slugs[lang].contact}`,
}])) as Record<Lang, { home: string; courses: string; equipment: string; updates: string; contact: string }>;
export type PageKey = keyof typeof routes.nl;

export const locales: Record<Lang, string> = { nl: 'nl-NL', en: 'en-GB', de: 'de-DE' };
export const langNames: Record<Lang, string> = { nl: 'Nederlands', en: 'English', de: 'Deutsch' };

/** Picks the string for the page language; English is the fallback. */
export const pick = <T>(lang: Lang, nl: T, en: T, de: T): T => (lang === 'nl' ? nl : lang === 'de' ? de : en);

/** The same page in every language, keyed by language. A product page keeps its slug. */
export function alternates(path: string): Record<Lang, string> {
  for (const key of Object.keys(routes.nl) as PageKey[]) {
    const from = langs.find(lang => routes[lang][key] === path);
    if (from) return Object.fromEntries(langs.map(lang => [lang, routes[lang][key]])) as Record<Lang, string>;
  }
  for (const lang of langs) {
    const prefix = `${routes[lang].equipment}/`;
    if (path.startsWith(prefix)) {
      const slug = path.slice(prefix.length);
      return Object.fromEntries(langs.map(l => [l, `${routes[l].equipment}/${slug}`])) as Record<Lang, string>;
    }
  }
  return { nl: routes.nl.home, en: routes.en.home, de: routes.de.home };
}

export const url = (path: string) => `${SITE}${path}`;

// Titles and descriptions carry the search terms people actually use per language
// (DataForSEO volumes: "Wasserrettung" 880/mo in DE, "water rescue equipment" 1.3k and
// "rescue sled" 590 worldwide). The visible copy stays the client's own.
export const seo: Record<Lang, Record<PageKey, { title: string; description: string }>> = {
  nl: {
    home: { title: 'Rescue Watercraft | Reddingswaterscooter en professionele waterredding', description: 'Reddingswaterscooters met Rescue Raft, equipment en opleidingen voor professionele waterredding. Van advies en aanschaf tot onderhoud en certificering.' },
    courses: { title: 'Opleidingen reddingswaterscooter | Rescue Watercraft', description: 'Opleidingen Rescue Watercraft Operator en Instructeur: veilig en professioneel redden op het water met reddingswaterscooter en reddingsslee.' },
    equipment: { title: 'Equipment voor waterredding | Rescue Watercraft', description: 'Professionele beschermingsmiddelen, reddingsmaterialen en accessoires voor waterredding, van IONIC, Dimatex en Thermarmour. Op aanvraag geleverd.' },
    updates: { title: 'Actueel | Rescue Watercraft', description: 'Nieuws, trainingen en praktijkmomenten van Rescue Watercraft.' },
    contact: { title: 'Contact | Rescue Watercraft', description: 'Vertel ons wat uw organisatie nodig heeft. We denken mee over materiaal, opleiding en inzetbaarheid voor waterredding.' },
  },
  en: {
    home: { title: 'Rescue Watercraft | Rescue jet ski and sled for water rescue', description: 'Rescue watercraft with the Rescue Raft sled, water rescue equipment and RWC training for professionals. From advice and purchase to maintenance and certification.' },
    courses: { title: 'RWC training and water rescue courses | Rescue Watercraft', description: 'Rescue Watercraft Operator and Instructor courses: water rescue training on a rescue jet ski with rescue sled, certified with Reddingsbrigade Nederland.' },
    equipment: { title: 'Water rescue equipment | Rescue Watercraft', description: 'Professional water rescue equipment: protective gear, rescue bags and accessories from IONIC, Dimatex and Thermarmour, supplied on request.' },
    updates: { title: 'Updates | Rescue Watercraft', description: 'News, training and field updates from Rescue Watercraft.' },
    contact: { title: 'Contact | Rescue Watercraft', description: 'Tell us what your organisation needs. We advise on water rescue equipment, training and operational readiness.' },
  },
  de: {
    home: { title: 'Rescue Watercraft | Rettungs-Jetski für die professionelle Wasserrettung', description: 'Rettungs-Jetskis mit Rescue Raft, Ausrüstung und Ausbildung für die professionelle Wasserrettung. Von Beratung und Kauf bis Wartung und Zertifizierung.' },
    courses: { title: 'Ausbildung Wasserrettung mit dem Rettungs-Jetski | Rescue Watercraft', description: 'Ausbildung zum Rescue Watercraft Operator und Instructor: sicher und professionell retten auf dem Wasser, für Feuerwehr, Wasserrettung und Behörden.' },
    equipment: { title: 'Ausrüstung für Wasserrettung und Strömungsretter | Rescue Watercraft', description: 'Professionelle Schutzausrüstung, Rettungsmaterial und Zubehör für die Wasserrettung, von IONIC, Dimatex und Thermarmour. Lieferung auf Anfrage.' },
    updates: { title: 'Aktuelles | Rescue Watercraft', description: 'Neuigkeiten, Trainings und Einsätze von Rescue Watercraft.' },
    contact: { title: 'Kontakt | Rescue Watercraft', description: 'Sagen Sie uns, was Ihre Organisation braucht. Wir beraten zu Ausrüstung, Ausbildung und Einsatzbereitschaft in der Wasserrettung.' },
  },
};

export const copy = {
  nl: {
    nav: ['Home', 'Opleidingen & trainingen', 'Equipment', 'Actueel', 'Contact'],
    heroEyebrow: 'Ontwikkeld door en voor professionals',
    heroTitle: 'Elke seconde telt bij een waterredding.',
    heroText: 'Veiligheid, snelheid en bedieningsgemak komen samen in het materieel en de opleidingen waarmee u het water op gaat.',
    heroPrimary: 'Ontdek Rescue Watercraft', heroSecondary: 'Stel je vraag',
    coursesTitle: 'Opleidingen en trainingen', coursesIntro: 'Leer veilig en professioneel werken met een reddingswaterscooter. Ontdek de opleidingen Rescue watercraft operator en Instructeur Rescue watercraft operator.',
    equipmentTitle: 'Equipment', equipmentIntro: 'Professionele reddingsmiddelen, beschermingsmiddelen en uitrusting, geselecteerd voor betrouwbare operationele inzet.',
    contactTitle: 'Contact', contactIntro: 'Vertel ons wat uw organisatie nodig heeft. We denken mee over materiaal, opleiding en inzetbaarheid.',
    request: 'Aanvragen', view: 'Bekijk aanbod', all: 'Alle categorieën', search: 'Zoeken', noResults: 'Geen resultaten gevonden.',
    footerTerms: 'Reddingswaterscooters met reddingsslee, uitrusting en opleidingen voor professionele waterredding door brandweer, reddingsbrigades en overheid.',
  },
  en: {
    nav: ['Home', 'Courses & training', 'Equipment', 'Updates', 'Contact'],
    heroEyebrow: 'Developed by and for professionals',
    heroTitle: 'Every second counts in water rescue.',
    heroText: 'Safety, speed and ease of use come together in the equipment and training you take onto the water.',
    heroPrimary: 'Discover Rescue Watercraft', heroSecondary: 'Ask your question',
    coursesTitle: 'Courses and training', coursesIntro: 'Learn to operate a rescue watercraft (RWC) safely and professionally. Explore our Rescue Watercraft Operator and Rescue Watercraft Operator Instructor courses.',
    equipmentTitle: 'Equipment', equipmentIntro: 'Professional water rescue and protective equipment selected for dependable operational use.',
    contactTitle: 'Contact', contactIntro: 'Tell us what your organisation needs. We advise on equipment, training and operational readiness.',
    request: 'Request information', view: 'View offering', all: 'All categories', search: 'Search', noResults: 'No results found.',
    footerTerms: 'Rescue jet skis with rescue sled, water rescue equipment and water rescue training for fire services, lifesaving organisations and government.',
  },
  de: {
    nav: ['Startseite', 'Ausbildung & Training', 'Ausrüstung', 'Aktuelles', 'Kontakt'],
    heroEyebrow: 'Von und für Profis entwickelt',
    heroTitle: 'Bei der Wasserrettung zählt jede Sekunde.',
    heroText: 'Sicherheit, Schnelligkeit und einfache Bedienung vereint in der Ausrüstung und Ausbildung, mit der Sie aufs Wasser gehen.',
    heroPrimary: 'Rescue Watercraft entdecken', heroSecondary: 'Ihre Frage stellen',
    coursesTitle: 'Ausbildung und Training', coursesIntro: 'Lernen Sie, einen Rettungs-Jetski sicher und professionell einzusetzen. Entdecken Sie die Ausbildungen Rescue Watercraft Operator und Rescue Watercraft Operator Instructor.',
    equipmentTitle: 'Ausrüstung', equipmentIntro: 'Professionelles Rettungsmaterial, Schutzausrüstung und Zubehör für die Wasserrettung, ausgewählt für den zuverlässigen Einsatz.',
    contactTitle: 'Kontakt', contactIntro: 'Sagen Sie uns, was Ihre Organisation braucht. Wir beraten Sie zu Material, Ausbildung und Einsatzbereitschaft.',
    request: 'Anfragen', view: 'Angebot ansehen', all: 'Alle Kategorien', search: 'Suchen', noResults: 'Keine Ergebnisse gefunden.',
    footerTerms: 'Rettungs-Jetskis mit Rettungsschlitten, Ausrüstung für Strömungsretter und Ausbildung in der Wasserrettung für Feuerwehr, Hilfsorganisationen und Behörden.',
  },
};
