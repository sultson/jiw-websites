import { useCallback, useEffect } from 'react';
import { translations, type Lang } from '../translations';

// FootCare+ is NL-only (hyper-local Friesland practice). We keep the useLang
// hook signature compatible with the shared component surface so existing
// components in src/ keep working without edits — `Lang` still imports from
// translations.ts (which may declare 'nl' | 'en') but at runtime we lock to
// 'nl' and make setLang a no-op. Any LangToggle that renders will simply do
// nothing on click.

export function useLang() {
  const lang: Lang = 'nl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = 'nl';
    }
  }, []);

  // Accepts the full Lang union for API back-compat; ignores the value.
  const setLang = useCallback((_l: Lang) => {
    // no-op: NL only
  }, []);

  const t = useCallback(
    (key: string): string => translations.nl[key] ?? key,
    [],
  );

  return { lang, setLang, t };
}
