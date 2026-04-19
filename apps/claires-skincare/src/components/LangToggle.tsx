import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; compact?: boolean };

export default function LangToggle({ lang, setLang, compact }: Props) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-espresso/15 bg-white/70 backdrop-blur-sm ${compact ? 'p-0.5' : 'p-1'}`}
      role="group"
      aria-label="Language"
    >
      {(['nl', 'en'] as Lang[]).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-full font-medium tracking-wider uppercase ${
            lang === l ? 'bg-espresso text-cream' : 'text-espresso/60 hover:text-espresso'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
