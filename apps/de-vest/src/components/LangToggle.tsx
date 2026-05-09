import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  className?: string;
};

export default function LangToggle({ lang, setLang, className = '' }: Props) {
  return (
    <div
      role="group"
      aria-label="Taalkeuze"
      className={`inline-flex items-center gap-px text-[11px] font-mono uppercase tracking-[0.18em] ${className}`}
    >
      {(['nl', 'en'] as const).map((option) => {
        const active = lang === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={active}
            className={`px-2 py-1 rounded-sm transition-colors ${
              active ? 'text-ink' : 'text-ink/40 hover:text-ink'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
