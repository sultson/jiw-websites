import { getContent, SITE_URL, type Lang } from "./content";
import { LANGS, matchPath, ROUTES, type PageKey } from "./routes";

const HOME_TITLE: Record<Lang, string> = {
  nl: "Het Kracht Collectief | Arbeidsbemiddeling voor vakmensen",
  en: "Het Kracht Collectief | Recruitment for skilled trades",
};
const HOME_DESCRIPTION: Record<Lang, string> = {
  nl: "Het Kracht Collectief brengt werkgevers en werkzoekenden samen. Persoonlijke arbeidsbemiddeling voor vakmensen in bouw, infra, steigerbouw en techniek.",
  en: "Het Kracht Collectief brings employers and job seekers together. Personal recruitment for skilled trades in construction, infra, scaffolding and technical trades.",
};

const OG_LOCALE: Record<Lang, string> = { nl: "nl_NL", en: "en_GB" };

export type RouteMeta = {
  page: PageKey | null;
  lang: Lang;
  title: string;
  description: string;
  /** Absent on the 404, so it can never point a search engine at another page. */
  canonical: string | null;
  /** hreflang -> absolute URL, including x-default. Empty on the 404. */
  alternates: Record<string, string>;
  ogLocale: string;
  ogLocaleAlternate: string;
  jsonLd: string[];
};

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

export function routeMetaFor(pathname: string): RouteMeta {
  const { page, lang } = matchPath(pathname);
  const c = getContent(lang);
  const other = lang === "nl" ? "en" : "nl";

  if (!page) {
    return {
      page,
      lang,
      title: c.notFound.metaTitle,
      description: HOME_DESCRIPTION[lang],
      canonical: null,
      alternates: {},
      ogLocale: OG_LOCALE[lang],
      ogLocaleAlternate: OG_LOCALE[other],
      jsonLd: [],
    };
  }

  const title = page === "home" ? HOME_TITLE[lang] : c.pages[page].metaTitle;
  const description = page === "home" ? HOME_DESCRIPTION[lang] : c.pages[page].metaDescription;
  const canonical = absoluteUrl(ROUTES[page][lang]);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) alternates[l] = absoluteUrl(ROUTES[page][l]);
  alternates["x-default"] = absoluteUrl(ROUTES[page].nl);

  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_URL}/`,
      name: "Het Kracht Collectief",
      inLanguage: ["nl-NL", "en"],
      publisher: { "@id": orgId },
    },
    {
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: lang === "nl" ? "nl-NL" : "en",
      isPartOf: { "@id": websiteId },
      about: { "@id": orgId },
      ...(page === "home" ? {} : { breadcrumb: { "@id": `${canonical}#breadcrumb` } }),
    },
  ];
  if (page !== "home") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonical}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Het Kracht Collectief", item: absoluteUrl(ROUTES.home[lang]) },
        { "@type": "ListItem", position: 2, name: c.pages[page].heroLabel, item: canonical },
      ],
    });
  }

  return {
    page,
    lang,
    title,
    description,
    canonical,
    alternates,
    ogLocale: OG_LOCALE[lang],
    ogLocaleAlternate: OG_LOCALE[other],
    jsonLd: [JSON.stringify({ "@context": "https://schema.org", "@graph": graph })],
  };
}
