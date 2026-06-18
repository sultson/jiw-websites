import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; tone?: 'light' | 'dark' };

export default function LangToggle({ lang, setLang, tone = 'dark' }: Props) {
  const base =
    'text-xs font-medium tracking-wide px-2 py-1 rounded-full transition-colors';
  const activeCls = tone === 'light' ? 'text-white' : 'text-ink';
  const idleCls = tone === 'light' ? 'text-white/55 hover:text-white/85' : 'text-ink-faint hover:text-ink';

  return (
    <div className="inline-flex items-center gap-0.5" role="group" aria-label="Taal / Language">
      {(['nl', 'en'] as const).map((l, i) => (
        <span key={l} className="inline-flex items-center">
          {i === 1 && <span className={tone === 'light' ? 'text-white/30' : 'text-ink-faint/40'}>/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`${base} ${lang === l ? activeCls : idleCls}`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
