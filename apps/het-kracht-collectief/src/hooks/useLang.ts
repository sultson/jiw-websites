import { useCallback, useEffect, useState } from "react";
import type { Lang } from "../content";

const KEY = "hetkrachtcollectief.lang";

export function useLang() {
  // Always start at 'nl' so the first client render matches the prerendered
  // (Dutch) HTML, then adopt any stored preference after hydration.
  const [lang, setLangState] = useState<Lang>("nl");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "nl" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  return { lang, setLang };
}
