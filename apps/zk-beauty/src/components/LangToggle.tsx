import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; compact?: boolean; light?: boolean };

const langs: Lang[] = ['nl', 'en'];

export default function LangToggle({ lang, setLang, compact, light }: Props) {
  return (
    <div
      className={`inline-flex items-center rounded-full ${light ? 'bg-ivory/15 border-ivory/25' : 'bg-ivory/70 border-ink/15'} border backdrop-blur-sm ${compact ? 'p-0.5' : 'p-1'}`}
      role="group"
      aria-label="Language"
    >
      {langs.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`${compact ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'} rounded-full font-medium tracking-[0.18em] uppercase transition-colors ${
            lang === l
              ? light ? 'bg-ivory text-ink' : 'bg-ink text-ivory'
              : light ? 'text-ivory/70 hover:text-ivory' : 'text-ink/55 hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
