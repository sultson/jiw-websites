import { useCallback, useEffect, useState } from 'react';
import { translations, type Lang } from '../translations';

const KEY = 'mbv-studio.lang';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(KEY);
  if (stored === 'en' || stored === 'nl' || stored === 'ua') return stored;
  // Light auto-detect: serve NL to Dutch browsers, UA to Ukrainian, else English.
  const nav = window.navigator.language?.toLowerCase() ?? '';
  if (nav.startsWith('nl')) return 'nl';
  if (nav.startsWith('uk') || nav.startsWith('ua')) return 'ua';
  return 'en';
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang === 'ua' ? 'uk' : lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string): string => translations[lang][key] ?? translations.en[key] ?? key,
    [lang],
  );

  return { lang, setLang, t };
}
