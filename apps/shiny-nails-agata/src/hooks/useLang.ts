import { useCallback, useEffect, useState } from 'react';
import { translations, type Lang } from '../translations';

const KEY = 'shiny-nails-agata.lang';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(KEY);
  if (stored === 'en' || stored === 'nl' || stored === 'pl') return stored as Lang;
  return 'en';
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string): string => translations[lang][key] ?? translations.en[key] ?? key,
    [lang],
  );

  return { lang, setLang, t };
}
