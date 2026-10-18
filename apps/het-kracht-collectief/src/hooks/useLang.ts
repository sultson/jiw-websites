import { useEffect } from "react";
import { useRouter } from "../router";

// The language is part of the address (/ is Dutch, /en is English), so the
// prerendered HTML and the first client render always agree.
export function useLang() {
  const { lang } = useRouter();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return { lang };
}
