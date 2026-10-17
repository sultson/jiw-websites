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

/**
 * Analytics consent notice strings (Microsoft Clarity). Clarity enforces a
 * consent signal for EEA/UK/CH visitors: without one it runs cookieless and
 * every page view becomes a separate session. Phrased in the PAGE language.
 */
export const CONSENT_STRINGS: Record<Lang, { text: string; accept: string; decline: string; more: string }> = {
  en: { text: 'We use analytics cookies (Microsoft Clarity) to understand how visitors use this site and improve it.', accept: 'Accept', decline: 'Decline', more: 'Privacy policy' },
  nl: { text: 'Wij gebruiken analytische cookies (Microsoft Clarity) om te begrijpen hoe bezoekers deze website gebruiken en deze te verbeteren.', accept: 'Accepteren', decline: 'Weigeren', more: 'Privacybeleid' },
  de: { text: 'Wir verwenden Analyse-Cookies (Microsoft Clarity), um zu verstehen, wie Besucher diese Website nutzen, und sie zu verbessern.', accept: 'Akzeptieren', decline: 'Ablehnen', more: 'Datenschutzerklärung' },
  fr: { text: 'Nous utilisons des cookies analytiques (Microsoft Clarity) pour comprendre comment les visiteurs utilisent ce site et l’améliorer.', accept: 'Accepter', decline: 'Refuser', more: 'Politique de confidentialité' },
  es: { text: 'Utilizamos cookies analíticas (Microsoft Clarity) para entender cómo se usa este sitio y mejorarlo.', accept: 'Aceptar', decline: 'Rechazar', more: 'Política de privacidad' },
  it: { text: 'Utilizziamo cookie analitici (Microsoft Clarity) per capire come i visitatori usano questo sito e migliorarlo.', accept: 'Accetta', decline: 'Rifiuta', more: 'Informativa sulla privacy' },
  pt: { text: 'Utilizamos cookies analíticos (Microsoft Clarity) para perceber como os visitantes usam este site e melhorá-lo.', accept: 'Aceitar', decline: 'Recusar', more: 'Política de privacidade' },
  zh: { text: '我们使用分析 Cookie（Microsoft Clarity）来了解访客如何使用本网站并加以改进。', accept: '接受', decline: '拒绝', more: '隐私政策' },
  ru: { text: 'Мы используем аналитические файлы cookie (Microsoft Clarity), чтобы понимать, как посетители пользуются сайтом, и улучшать его.', accept: 'Принять', decline: 'Отклонить', more: 'Политика конфиденциальности' },
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
