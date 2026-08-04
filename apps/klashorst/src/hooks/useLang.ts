import { useEffect, useState } from 'react';
import { translations, type Lang } from '../translations';

const KEY = 'klashorst-lang';

export function useLang() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'nl';
    const stored = window.localStorage.getItem(KEY);
    if (stored === 'nl' || stored === 'en') return stored;
    return navigator.language?.toLowerCase().startsWith('nl') ? 'nl' : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return { lang, setLang, t: translations[lang] };
}
