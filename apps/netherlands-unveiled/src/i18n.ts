// Languages are separate URLs, not a client-side toggle: English lives at the
// root and French under /fr, so each language is its own crawlable, rankable
// document with its own <title>, canonical and hreflang set.

export const LANGS = ['en', 'fr'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

/** Canonical origin. Every other hostname 301s here from the Worker. */
export const SITE_URL = 'https://netherlandsunveiled.com';

// French URLs use French segments so the whole result in a French SERP reads as
// a French page, path included.
export const routes = {
  home: { en: '/', fr: '/fr' },
  tours: { en: '/tours', fr: '/fr/visites' },
  blog: { en: '/blog', fr: '/fr/blog' },
  languages: { en: '/languages', fr: '/fr/langues' },
} as const;

export type RouteKey = keyof typeof routes;

export type Alternates = Record<Lang, string>;

/** Path set for a static page, ready to hand to the layout as hreflang links. */
export const routeAlternates = (key: RouteKey): Alternates => ({ ...routes[key] });

/** Path of a blog post, which carries a different slug in each language. */
export const postPath = (lang: Lang, slug: string) =>
  lang === 'en' ? `/blog/${slug}` : `/fr/blog/${slug}`;

/** Path of a tour page, same story: one slug per language. */
export const tourPath = (lang: Lang, slug: string) =>
  lang === 'en' ? `/tours/${slug}` : `/fr/visites/${slug}`;

/** Anchors on the home page have to keep their language prefix. */
export const homeAnchor = (lang: Lang, anchor: string) =>
  lang === 'en' ? `/${anchor}` : `${routes.home.fr}${anchor}`;

export const absoluteUrl = (path: string) => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

/** BCP 47 tags for og:locale and hreflang. */
export const localeTag: Record<Lang, string> = { en: 'en', fr: 'fr' };
export const ogLocale: Record<Lang, string> = { en: 'en_US', fr: 'fr_FR' };

/** Label shown on the language switcher, always written in its own language. */
export const langLabel: Record<Lang, string> = { en: 'English', fr: 'Français' };
export const langShort: Record<Lang, string> = { en: 'EN', fr: 'FR' };
