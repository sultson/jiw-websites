import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; tone?: 'dark' | 'light' };

export default function LangToggle({ lang, setLang, tone = 'dark' }: Props) {
  const muted = tone === 'light' ? 'text-paper/55 hover:text-paper' : 'text-ink-mute hover:text-ink';
  const active = tone === 'light' ? 'text-paper' : 'text-ink';
  return (
    <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase">
      <button
        type="button"
        onClick={() => setLang('nl')}
        className={`${lang === 'nl' ? active : muted} transition-colors`}
        aria-pressed={lang === 'nl'}
      >
        NL
      </button>
      <span className={tone === 'light' ? 'text-paper/30' : 'text-ink/30'}>·</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`${lang === 'en' ? active : muted} transition-colors`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
