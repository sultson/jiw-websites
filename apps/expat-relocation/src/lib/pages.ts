import { getContent } from './content';
import { SECTIONS, type Lang } from './i18n';

/** Sections whose detail pages are ServiceContent-driven. */
export type ServiceSectionKey = 'immigration' | 'housing' | 'relocation' | 'industrial' | 'business';

/** English slugs define the route surface; every language mirrors them 1:1. */
export function sectionServiceSlugs(key: ServiceSectionKey): string[] {
  return getContent('en')[key].services.map((s) => s.slug);
}

export function serviceProps(lang: Lang, key: ServiceSectionKey, slug: string | undefined) {
  const c = getContent(lang);
  const section = c[key];
  const service = section.services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Missing ${lang} content for ${key}/${slug}`);
  const basePath = SECTIONS[key];
  const siblings = section.services
    .filter((s) => s.slug !== slug)
    .map((s) => ({ label: s.menuLabel, path: `${basePath}/${s.slug}` }));
  return { section, service, basePath, siblings, path: `${basePath}/${slug}` };
}

export function guideSlugs(): string[] {
  return getContent('en').guides.guides.map((g) => g.slug);
}

export function guideProps(lang: Lang, slug: string | undefined) {
  const c = getContent(lang);
  const guide = c.guides.guides.find((g) => g.slug === slug);
  if (!guide) throw new Error(`Missing ${lang} guide ${slug}`);
  const siblings = c.guides.guides
    .filter((g) => g.slug !== slug)
    .map((g) => ({ label: g.menuLabel, path: `${SECTIONS.guides}/${g.slug}` }));
  return { guide, siblings, path: `${SECTIONS.guides}/${slug}` };
}

export function packageSlugs(): string[] {
  return getContent('en').vip.packages.map((p) => p.slug);
}

export function packageProps(lang: Lang, slug: string | undefined) {
  const c = getContent(lang);
  const pkg = c.vip.packages.find((p) => p.slug === slug);
  if (!pkg) throw new Error(`Missing ${lang} package ${slug}`);
  const siblings = c.vip.packages
    .filter((p) => p.slug !== slug)
    .map((p) => ({ label: p.name, path: `${SECTIONS.vip}/${p.slug}` }));
  return { pkg, siblings, path: `${SECTIONS.vip}/${slug}` };
}
