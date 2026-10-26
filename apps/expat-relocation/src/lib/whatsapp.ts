import { site } from '../data/site';
import { getContent } from './content';
import { SECTIONS, basePath, type Lang } from './i18n';

/**
 * Every WhatsApp link carries a prefilled first line naming the page it was
 * tapped on ("I have a question about: Partner Visa Netherlands"), so Johanna
 * knows where a chat came from without asking. Pages without a clear subject
 * (home, about, contact) get the general opener.
 */
const topicCache = new Map<Lang, Map<string, string>>();

function topics(lang: Lang): Map<string, string> {
  const cached = topicCache.get(lang);
  if (cached) return cached;
  const c = getContent(lang);
  const map = new Map<string, string>();
  for (const key of ['immigration', 'housing', 'relocation', 'industrial', 'business'] as const) {
    const section = c[key];
    map.set(SECTIONS[key], section.title);
    for (const s of section.services) map.set(`${SECTIONS[key]}/${s.slug}`, s.title);
  }
  map.set(SECTIONS.vip, c.vip.title);
  for (const p of c.vip.packages) map.set(`${SECTIONS.vip}/${p.slug}`, p.name);
  for (const g of c.guides.guides) map.set(`${SECTIONS.guides}/${g.slug}`, g.title);
  topicCache.set(lang, map);
  return map;
}

/** The prefilled message for a page, given its URL pathname (any language). */
export function whatsappText(lang: Lang, pathname: string): string {
  const prefill = getContent(lang).core.ui.whatsappPrefill;
  const path = basePath(pathname).replace(/\/+$/, '').replace(/\.html$/, '') || '/';
  const topic = topics(lang).get(path);
  return topic ? prefill.topic.replace('{topic}', topic) : prefill.general;
}

export function whatsappHref(lang: Lang, pathname: string): string {
  return `${site.whatsappUrl}?text=${encodeURIComponent(whatsappText(lang, pathname))}`;
}
