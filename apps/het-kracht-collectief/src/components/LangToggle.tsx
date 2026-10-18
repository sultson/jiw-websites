import type { Lang } from "../content";
import { Link, useRouter } from "../router";
import { LANGS, ROUTES } from "../routes";

type Props = { tone?: "light" | "dark" };

// Real links to the same page in the other language, so crawlers can follow
// them and every language has its own address.
export default function LangToggle({ tone = "light" }: Props) {
  const { lang, page } = useRouter();
  const dark = tone === "dark";
  return (
    <div
      className={`inline-flex border ${dark ? "border-bone/70" : "border-ink"}`}
      role="group"
      aria-label="Taal / Language"
    >
      {LANGS.map((l: Lang, i) => {
        const active = lang === l;
        const base = "px-2.5 py-1 font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors";
        const divider = i === 0 ? (dark ? "border-r border-bone/70" : "border-r border-ink") : "";
        const state = dark
          ? active
            ? "bg-bone text-ink"
            : "bg-transparent text-bone/80 hover:text-bone"
          : active
            ? "bg-ink text-bone"
            : "bg-transparent text-ink/70 hover:text-ink";
        return (
          <Link
            key={l}
            raw
            to={ROUTES[page ?? "home"][l]}
            hrefLang={l}
            lang={l}
            aria-current={active ? "page" : undefined}
            className={`${base} ${divider} ${state}`}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
