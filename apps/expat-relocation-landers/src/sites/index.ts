import { inburgeringsplichtig } from './inburgeringsplichtig';
import { partnerhereniging } from './partnerhereniging';
import type { Lang, LanderContent, SiteConfig } from './types';

/** Every lander in this app. Add the next domain here and in astro.config.mjs. */
const SITES = {
  inburgeringsplichtig,
  partnerhereniging,
} satisfies Record<string, { config: SiteConfig; content: Record<Lang, LanderContent> }>;

export type SiteId = keyof typeof SITES;

const activeId = (import.meta.env.LANDER_SITE ?? 'partnerhereniging') as SiteId;
const active = SITES[activeId];

if (!active) throw new Error(`Unknown SITE "${activeId}".`);

export const site: SiteConfig = active.config;

export function content(lang: Lang): LanderContent {
  return active.content[lang];
}

/** Path of a page in the given language. Dutch is the root, English lives under /en. */
export function localize(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path;
  return lang === 'nl' ? path : `/en${clean}` || '/en';
}

export const PAGES = {
  home: { nl: '/', en: '/en' },
  thanks: { nl: '/bedankt', en: '/en/thank-you' },
  privacy: { nl: '/privacy', en: '/en/privacy' },
} as const;

export type { Lang, LanderContent, SiteConfig };
