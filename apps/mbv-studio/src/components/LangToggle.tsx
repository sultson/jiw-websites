import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; compact?: boolean; onDark?: boolean };

const langs: Lang[] = ['en', 'nl', 'ua'];

export default function LangToggle({ lang, setLang, compact, onDark }: Props) {
  return (
    <div
      className={`inline-flex items-center rounded-full border backdrop-blur-sm ${
        onDark ? 'border-cream/25 bg-cream/10' : 'border-ink/15 bg-cream/70'
      } ${compact ? 'p-0.5' : 'p-1'}`}
      role="group"
      aria-label="Language"
    >
      {langs.map(l => {
        const active = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`${compact ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-xs'} rounded-full font-medium tracking-wider uppercase transition-colors ${
              active
                ? 'bg-ink text-cream'
                : onDark
                  ? 'text-cream/70 hover:text-cream'
                  : 'text-ink/55 hover:text-ink'
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
