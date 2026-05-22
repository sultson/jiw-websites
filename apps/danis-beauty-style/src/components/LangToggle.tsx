import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void };

export default function LangToggle({ lang, setLang }: Props) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-ink-2 p-0.5 text-xs">
      {(['nl', 'en'] as const).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1 rounded-full uppercase tracking-widest font-semibold transition-colors ${
            lang === l ? 'bg-bone text-ink' : 'text-bone-soft hover:text-gold-bright'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
