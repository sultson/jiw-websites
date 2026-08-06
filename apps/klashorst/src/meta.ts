/**
 * What a page calls itself, in the tab and in a link preview.
 *
 * Shared with the Worker on purpose: it writes these into the HTML before the
 * page is sent, which is the version a search engine or a chat app ever sees,
 * and the app writes the same strings when it moves between pages without a
 * reload. One source, so the two can never drift apart.
 *
 * No DOM here: the Worker imports this too.
 */

export const SITE_NAME = 'Klashorst Museum';
export const SITE_URL = 'https://klashorst.jouwidealewebsite.nl';

/** The home page keeps the title and description the site shipped with. */
export const HOME_TITLE = 'Peter Klashorst Museum | Lust for Life';

/** What the blog is called before the client renames it in the Studio. */
export const BLOG_TITLE = 'Berichten';

export const HOME_DESCRIPTION =
  'Peter Klashorst, 1957 tot 2024. Schilder, fotograaf en muzikant. Een selectie uit de nalatenschap, met de S21-portretten uit Phnom Penh.';

export const pageTitle = (heading: string) => `${heading} | ${SITE_NAME}`;

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
