import { useEffect } from "react";
import { getContent, SITE_URL, type Content, type Lang } from "./content";
import { useLang } from "./hooks/useLang";
import { RouterProvider, useRouter } from "./router";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import PathSplit from "./components/PathSplit";
import MissionVision from "./components/MissionVision";
import Pillars from "./components/Pillars";
import StatementBand from "./components/StatementBand";
import Sectors from "./components/Sectors";
import ContactCta from "./components/ContactCta";
import Footer from "./components/Footer";
import AudiencePage from "./components/AudiencePage";
import { AanvraagProvider } from "./components/AanvraagModal";

const HOME_TITLE: Record<Lang, string> = {
  nl: "Het Kracht Collectief | Arbeidsbemiddeling voor vakmensen",
  en: "Het Kracht Collectief | Recruitment for skilled trades",
};
const HOME_DESCRIPTION: Record<Lang, string> = {
  nl: "Het Kracht Collectief brengt werkgevers en werkzoekenden samen. Persoonlijke arbeidsbemiddeling voor vakmensen in bouw, infra, steigerbouw en techniek.",
  en: "Het Kracht Collectief brings employers and job seekers together. Personal recruitment for skilled trades in construction, infra, scaffolding and technical trades.",
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  jsonLd: string[];
};

// Server-side (prerender) metadata. Always Dutch — the prerendered HTML ships in
// the primary language; the client swaps copy after hydration.
export function routeMetaFor(pathname: string): RouteMeta {
  const path = normalizePathname(pathname);
  const nl = getContent("nl");

  let title = HOME_TITLE.nl;
  let description = HOME_DESCRIPTION.nl;
  if (path === "/werknemer") {
    title = nl.pages.werknemer.metaTitle;
    description = nl.pages.werknemer.metaDescription;
  } else if (path === "/werkgever") {
    title = nl.pages.werkgever.metaTitle;
    description = nl.pages.werkgever.metaDescription;
  }

  return {
    path,
    title,
    description,
    canonical: `${SITE_URL}${path === "/" ? "/" : path}`,
    jsonLd: [],
  };
}

export const allRoutePaths: string[] = ["/", "/werknemer", "/werkgever"];

function setMeta(selector: string, attr: "content" | "href", value: string) {
  if (typeof document === "undefined") return;
  document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)?.setAttribute(attr, value);
}

function useRouteMetadata(path: string, lang: Lang, c: Content) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    let title = HOME_TITLE[lang];
    let description = HOME_DESCRIPTION[lang];
    if (path === "/werknemer") {
      title = c.pages.werknemer.metaTitle;
      description = c.pages.werknemer.metaDescription;
    } else if (path === "/werkgever") {
      title = c.pages.werkgever.metaTitle;
      description = c.pages.werkgever.metaDescription;
    }
    const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
  }, [path, lang, c]);
}

function Home({ c }: { c: Content }) {
  return (
    <>
      <Hero c={c} />
      <Marquee items={c.slogan} tone="ink" />
      <PathSplit c={c} />
      <MissionVision c={c} />
      <Pillars c={c} />
      <Sectors c={c} />
      <StatementBand c={c} />
      <ContactCta c={c} />
    </>
  );
}

function Shell() {
  const { lang, setLang } = useLang();
  const { path } = useRouter();
  const c = getContent(lang);
  const norm = normalizePathname(path);
  useRouteMetadata(norm, lang, c);

  return (
    <AanvraagProvider c={c}>
      <div id="top" className="flex min-h-[100dvh] flex-col bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-ink focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.14em] focus:text-ink"
        >
          {c.nav.skip}
        </a>
        <Nav c={c} lang={lang} setLang={setLang} />
        <main id="main" className="flex-1">
          {norm === "/werknemer" ? (
            <AudiencePage c={c} profile="werknemer" />
          ) : norm === "/werkgever" ? (
            <AudiencePage c={c} profile="werkgever" />
          ) : (
            <Home c={c} />
          )}
        </main>
        <Footer c={c} lang={lang} setLang={setLang} />
      </div>
    </AanvraagProvider>
  );
}

export default function App({ initialPath }: { initialPath?: string } = {}) {
  return (
    <RouterProvider initialPath={initialPath}>
      <Shell />
    </RouterProvider>
  );
}
