/**
 * What a page calls itself, in the tab and in a link preview, and which of the
 * two languages it is written in.
 *
 * Shared with the Worker on purpose: it writes these into the HTML before the
 * page is sent, which is the version a search engine or a chat app ever sees,
 * and the app writes the same strings when it moves between pages without a
 * reload. One source, so the two can never drift apart.
 *
 * No DOM here: the Worker imports this too.
 */

/** Dutch is the site. English is the same site, said again. */
export type Lang = 'nl' | 'en';

export const LANGS: Lang[] = ['nl', 'en'];
export const DEFAULT_LANG: Lang = 'nl';

/** What `<html lang>` and `og:locale` have to say. */
export const HTML_LANG: Record<Lang, string> = { nl: 'nl', en: 'en' };
export const OG_LOCALE: Record<Lang, string> = { nl: 'nl_NL', en: 'en_GB' };

export const SITE_NAME = 'Klashorst Museum';
export const SITE_URL = 'https://klashorst.jouwidealewebsite.nl';

/** The home page keeps the title and description the site shipped with. */
export const HOME_TITLE: Record<Lang, string> = {
  nl: 'Klashorst Museum | Het werk van Peter Klashorst',
  en: 'Klashorst Museum | The work of Peter Klashorst',
};

/**
 * The blog's own name, the same in both languages, and what it is called before
 * the client renames it in the Studio.
 */
export const BLOG_TITLE: Record<Lang, string> = { nl: 'Dirty Diaries', en: 'Dirty Diaries' };

export const HOME_DESCRIPTION: Record<Lang, string> = {
  nl: 'Het museum voor het werk van Peter Klashorst: schilder, fotograaf en muzikant. Ruim veertig jaar werk, en een deel van het museum voor andere kunstenaars.',
  en: 'The museum for the work of Peter Klashorst: painter, photographer and musician. More than forty years of work, and part of the museum for other artists.',
};

export const NOT_FOUND_TITLE: Record<Lang, string> = {
  nl: 'Pagina niet gevonden',
  en: 'Page not found',
};

/**
 * A page's title in the tab. The heading comes from the CMS and may be empty,
 * and " | Klashorst Museum" with nothing in front of it is a broken title
 * rather than a short one.
 */
export const pageTitle = (heading: string) =>
  heading.trim() ? `${heading.trim()} | ${SITE_NAME}` : SITE_NAME;

/**
 * Dutch lives at the root and English one directory in, because Dutch is the
 * language this museum is in and the second one is the translation, not an
 * equal half. An address carries the language, so a link can be shared in the
 * language it was read in.
 *
 * '/en/blog/iets' -> { lang: 'en', path: '/blog/iets' }
 */
export function splitLang(pathname: string): { lang: Lang; path: string } {
  const clean = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (clean === '/en') return { lang: 'en', path: '/' };
  if (clean.startsWith('/en/')) return { lang: 'en', path: clean.slice(3) };
  return { lang: 'nl', path: clean };
}

/** The same page in a given language: '/blog' in English is '/en/blog'. */
export const localePath = (lang: Lang, path: string): string =>
  lang === 'nl' ? path : path === '/' ? '/en' : `/en${path}`;

/** Absolute, for canonical and hreflang. */
export const localeUrl = (lang: Lang, path: string): string =>
  `${SITE_URL}${localePath(lang, path) === '/' ? '/' : localePath(lang, path)}`;

/**
 * A title turned into an address: "De S21-portretten" becomes
 * "de-s21-portretten". What a post falls back to when nobody generated an
 * address for it in the Studio, so every post is reachable either way.
 *
 * Shared for the same reason as the titles above: the Worker resolves an
 * incoming address with it, the app resolves the same address in the browser,
 * and the two have to agree on every post.
 */
export function slugify(value: string): string {
  const slug = value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 64)
    .replace(/^-+|-+$/g, '');
  return slug || 'bericht';
}

/** Trims to a length a search result or a link preview will actually show. */
export function clamp(value: string, max = 165): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[.,;:]$/, '')}…`;
}
