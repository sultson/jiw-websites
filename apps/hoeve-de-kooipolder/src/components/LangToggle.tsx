type Lang = 'nl' | 'en';

type Props = { lang: Lang; setLang: (l: Lang) => void };

const langs: Lang[] = ['nl', 'en'];

export default function LangToggle({ lang, setLang }: Props) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-ink/15 bg-white/80 p-0.5"
      role="group"
      aria-label="Taal / Language"
    >
      {langs.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1 text-[11px] rounded-full font-medium tracking-wider uppercase transition-colors ${
            lang === l ? 'bg-ink text-cream' : 'text-ink/60 hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
