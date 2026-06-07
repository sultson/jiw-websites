import type { Lang } from "../content";

type Props = { lang: Lang; setLang: (l: Lang) => void; tone?: "light" | "dark" };

const langs: Lang[] = ["nl", "en"];

export default function LangToggle({ lang, setLang, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <div
      className={`inline-flex border ${dark ? "border-bone/70" : "border-ink"}`}
      role="group"
      aria-label="Taal / Language"
    >
      {langs.map((l, i) => {
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
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`${base} ${divider} ${state}`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
