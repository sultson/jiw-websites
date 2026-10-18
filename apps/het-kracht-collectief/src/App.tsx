import { useEffect } from "react";
import { getContent, type Content } from "./content";
import { useLang } from "./hooks/useLang";
import { RouterProvider, useRouter } from "./router";
import { ALL_PATHS } from "./routes";
import { routeMetaFor } from "./seo";
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
import NotFound from "./components/NotFound";
import { AanvraagProvider } from "./components/AanvraagModal";

export { routeMetaFor };
export const allRoutePaths = ALL_PATHS;

function setMeta(selector: string, attr: "content" | "href", value: string) {
  document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector)?.setAttribute(attr, value);
}

// Keep the head in step on client-side navigation. The prerendered HTML already
// carries the right values for the first page, so this only matters afterwards.
function useRouteMetadata(path: string) {
  useEffect(() => {
    const meta = routeMetaFor(path);
    document.title = meta.title;
    setMeta('meta[name="description"]', "content", meta.description);
    setMeta('meta[property="og:title"]', "content", meta.title);
    setMeta('meta[property="og:description"]', "content", meta.description);
    setMeta('meta[property="og:locale"]', "content", meta.ogLocale);
    setMeta('meta[property="og:locale:alternate"]', "content", meta.ogLocaleAlternate);
    if (meta.canonical) {
      setMeta('link[rel="canonical"]', "href", meta.canonical);
      setMeta('meta[property="og:url"]', "content", meta.canonical);
    }
    for (const [hreflang, href] of Object.entries(meta.alternates)) {
      setMeta(`link[rel="alternate"][hreflang="${hreflang}"]`, "href", href);
    }
  }, [path]);
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
  const { lang } = useLang();
  const { path, page } = useRouter();
  const c = getContent(lang);
  useRouteMetadata(path);

  return (
    <AanvraagProvider c={c}>
      <div id="top" className="flex min-h-[100dvh] flex-col bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-ink focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.14em] focus:text-ink"
        >
          {c.nav.skip}
        </a>
        <Nav c={c} />
        <main id="main" className="flex-1">
          {page === "werknemer" || page === "werkgever" ? (
            <AudiencePage c={c} profile={page} />
          ) : page === "home" ? (
            <Home c={c} />
          ) : (
            <NotFound c={c} />
          )}
        </main>
        <Footer c={c} />
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
