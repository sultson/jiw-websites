import type { Content, Lang } from "../content";
import { Link } from "../router";
import LangToggle from "./LangToggle";

type Props = { c: Content; lang: Lang; setLang: (l: Lang) => void };

export default function Footer({ c, lang, setLang }: Props) {
  const year = 2026;

  return (
    <footer className="bg-coal text-bone on-dark">
      <div className="shell py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-[clamp(1.8rem,5vw,3rem)] font-light uppercase leading-[1.0] tracking-[-0.01em]">
              Het Kracht
              <br />
              Collectief
            </p>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-fog">{c.footer.tagline}</p>
            <p className="mt-6 font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-fog">
              {c.slogan.join(" ")}
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label={c.footer.columns.site}>
            <span className="label-sm text-fog">{c.footer.columns.site}</span>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link to="/" className="text-sm font-semibold uppercase tracking-wide text-fog transition-colors hover:text-bone">
                  {c.footer.home}
                </Link>
              </li>
              <li>
                <Link to="/#aanpak" className="text-sm font-semibold uppercase tracking-wide text-fog transition-colors hover:text-bone">
                  {c.nav.aanpak}
                </Link>
              </li>
              <li>
                <Link to="/#sectoren" className="text-sm font-semibold uppercase tracking-wide text-fog transition-colors hover:text-bone">
                  {c.nav.sectoren}
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label={c.footer.columns.paths}>
            <span className="label-sm text-fog">{c.footer.columns.paths}</span>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link to="/werknemer" className="text-sm font-semibold uppercase tracking-wide text-fog transition-colors hover:text-bone">
                  {c.nav.werknemer}
                </Link>
              </li>
              <li>
                <Link to="/werkgever" className="text-sm font-semibold uppercase tracking-wide text-fog transition-colors hover:text-bone">
                  {c.nav.werkgever}
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <LangToggle lang={lang} setLang={setLang} tone="dark" />
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line-dark pt-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-fog sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} Het Kracht Collectief. {c.footer.kvk}. {c.footer.rights}
          </span>
          <span>{c.footer.built}</span>
        </div>
      </div>
    </footer>
  );
}
