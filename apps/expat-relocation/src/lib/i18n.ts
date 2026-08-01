export const LANGS = ['en', 'nl', 'de', 'fr', 'es', 'it', 'pt', 'zh', 'ru'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** Native-name labels for the language switcher. */
export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  de: 'Deutsch',
  nl: 'Nederlands',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  ru: 'Русский',
};

export const OG_LOCALES: Record<Lang, string> = {
  en: 'en_US',
  de: 'de_DE',
  nl: 'nl_NL',
  fr: 'fr_FR',
  es: 'es_ES',
  it: 'it_IT',
  pt: 'pt_PT',
  zh: 'zh_CN',
  ru: 'ru_RU',
};

export const NON_DEFAULT_LANGS = LANGS.filter((l) => l !== DEFAULT_LANG);

/**
 * Every language is a strict 1:1 mirror of the English structure (this was a
 * hard client requirement), so paths are shared and only prefixed: /de/...,
 * /nl/..., etc. English lives at the root.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path;
  return lang === DEFAULT_LANG ? path : `/${lang}${clean}` || `/${lang}`;
}

export function langFromUrl(pathname: string): Lang {
  const seg = pathname.split('/')[1];
  return (LANGS as readonly string[]).includes(seg) && seg !== 'en' ? (seg as Lang) : 'en';
}

/** Strip a language prefix, returning the canonical (English) path. */
export function basePath(pathname: string): string {
  const lang = langFromUrl(pathname);
  if (lang === DEFAULT_LANG) return pathname || '/';
  const stripped = pathname.slice(lang.length + 1);
  return stripped === '' ? '/' : stripped;
}

/**
 * Language-suggestion banner strings, phrased in the TARGET language (the
 * visitor sees the suggestion in their own language, H&M-style). Never
 * auto-redirect by geo; suggest politely and remember the choice.
 */
export const BANNER_STRINGS: Record<Lang, { prompt: string; switch: string; dismiss: string }> = {
  en: { prompt: 'Would you prefer to browse this site in English?', switch: 'Continue in English', dismiss: 'No, thank you' },
  de: { prompt: 'Möchten Sie diese Website lieber auf Deutsch lesen?', switch: 'Weiter auf Deutsch', dismiss: 'Nein, danke' },
  nl: { prompt: 'Wilt u deze website liever in het Nederlands lezen?', switch: 'Verder in het Nederlands', dismiss: 'Nee, bedankt' },
  fr: { prompt: 'Préférez-vous consulter ce site en français ?', switch: 'Continuer en français', dismiss: 'Non, merci' },
  es: { prompt: '¿Prefiere ver este sitio en español?', switch: 'Continuar en español', dismiss: 'No, gracias' },
  it: { prompt: 'Preferisce consultare questo sito in italiano?', switch: 'Continua in italiano', dismiss: 'No, grazie' },
  pt: { prompt: 'Prefere consultar este site em português?', switch: 'Continuar em português', dismiss: 'Não, obrigado' },
  zh: { prompt: '您希望以中文浏览本网站吗？', switch: '切换到中文', dismiss: '不用，谢谢' },
  ru: { prompt: 'Хотите просматривать этот сайт на русском языке?', switch: 'Продолжить на русском', dismiss: 'Нет, спасибо' },
};

/** Section base paths, shared across all languages (English SEO slugs). */
export const SECTIONS = {
  immigration: '/immigration',
  housing: '/housing',
  relocation: '/relocation',
  industrial: '/industrial-expat-services',
  business: '/starting-a-business',
  vip: '/vip-services',
  guides: '/guides',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy-policy',
} as const;

export type SectionKey = keyof typeof SECTIONS;
