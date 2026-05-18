import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { brand, type Brand, type L } from '../content';

export type Lang = 'nl' | 'en';

type SiteValue = {
  brand: Brand;
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Resolve a localized string and inject the company name + extra vars. */
  t: (text: L, vars?: Record<string, string>) => string;
};

const LANG_KEY = 'adriaan.lang';

const SiteContext = createContext<SiteValue | null>(null);

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'nl';
  const stored = window.localStorage.getItem(LANG_KEY);
  return stored === 'nl' || stored === 'en' ? stored : 'nl';
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (text: L, vars?: Record<string, string>): string => {
      let out = (text?.[lang] ?? text?.nl ?? '').replace(/\{name\}/g, brand.name);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
      }
      return out;
    },
    [lang],
  );

  const value = useMemo<SiteValue>(() => ({ brand, lang, setLang, t }), [lang, setLang, t]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
