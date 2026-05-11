import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; variant?: 'compact' | 'wide' };

export default function LangToggle({ lang, setLang, variant = 'compact' }: Props) {
  return (
    <div className={`lang-toggle ${variant === 'wide' ? 'lang-toggle-wide' : ''}`} role="group" aria-label="Language">
      {(['nl', 'en'] as Lang[]).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={lang === l ? 'is-active' : ''}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
