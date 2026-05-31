import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; compact?: boolean };

const langs: Lang[] = ['nl', 'en'];

export default function LangToggle({ lang, setLang, compact }: Props) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-line bg-cream ${compact ? 'p-0.5' : 'p-1'}`}
      role="group"
      aria-label="Taal / Language"
    >
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-full font-bold tracking-[0.12em] uppercase transition-colors ${
            lang === l ? 'bg-terra text-white' : 'text-ink-mute hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
