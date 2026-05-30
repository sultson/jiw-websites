import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; compact?: boolean };

const langs: Lang[] = ['nl', 'en'];

export default function LangToggle({ lang, setLang, compact }: Props) {
  return (
    <div
      className={`inline-flex items-center ${compact ? 'gap-0' : 'gap-1'}`}
      role="group"
      aria-label="Language"
    >
      {langs.map((l, i) => (
        <span key={l} className="inline-flex items-center">
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`${compact ? 'px-1.5 py-1 text-[11px]' : 'px-2 py-1.5 text-xs'} font-medium tracking-[0.16em] uppercase transition-colors ${
              lang === l ? 'text-sumi' : 'text-sumi/40 hover:text-sumi'
            }`}
          >
            {l}
          </button>
          {i === 0 && <span className="block w-px h-3 bg-sumi/20" />}
        </span>
      ))}
    </div>
  );
}
