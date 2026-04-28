import { useCallback, useEffect, useState } from 'react';
import { translations, type Lang } from '../translations';

const KEY = 'nxk.lang';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'nl';
  const stored = window.localStorage.getItem(KEY);
  return stored === 'en' ? 'en' : 'nl';
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback(
    (key: string): string => translations[lang][key] ?? translations.nl[key] ?? key,
    [lang],
  );

  return { lang, setLang, t };
}
