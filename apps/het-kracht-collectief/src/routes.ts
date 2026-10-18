import type { Lang } from "./content";

// One URL per page per language: Dutch at the root, English under /en with
// translated slugs, so each language is its own indexable page. Components keep
// linking with the Dutch path; `localizePath` maps it to the visitor's language.
export type PageKey = "home" | "werknemer" | "werkgever";

export const ROUTES: Record<PageKey, Record<Lang, string>> = {
  home: { nl: "/", en: "/en" },
  werknemer: { nl: "/werknemer", en: "/en/job-seekers" },
  werkgever: { nl: "/werkgever", en: "/en/employers" },
};

export const LANGS: Lang[] = ["nl", "en"];
export const PAGE_KEYS = Object.keys(ROUTES) as PageKey[];

export type Match = { page: PageKey | null; lang: Lang };

export function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export function matchPath(pathname: string): Match {
  const path = normalizePathname(pathname);
  for (const page of PAGE_KEYS) {
    for (const lang of LANGS) {
      if (ROUTES[page][lang] === path) return { page, lang };
    }
  }
  return { page: null, lang: path === "/en" || path.startsWith("/en/") ? "en" : "nl" };
}

// "/werknemer" or "/#aanpak" (Dutch) -> the same page in `lang`, hash kept.
export function localizePath(to: string, lang: Lang) {
  const [rawPath, hash] = to.split("#");
  const { page } = matchPath(rawPath || "/");
  if (!page) return to;
  return `${ROUTES[page][lang]}${hash ? `#${hash}` : ""}`;
}

export const ALL_PATHS: string[] = PAGE_KEYS.flatMap((page) => LANGS.map((lang) => ROUTES[page][lang]));
