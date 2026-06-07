import { useCallback, useEffect, useState } from 'react';
import { content, type Lang } from '../i18n';

const KEY = 'doelio.lang';

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'nl';
  const stored = window.localStorage.getItem(KEY);
  if (stored === 'nl' || stored === 'en') return stored;
  return 'nl';
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  return { lang, setLang, c: content[lang] };
}
