import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  className?: string;
};

export default function LangToggle({ lang, setLang, className = '' }: Props) {
  return (
    <div
      className={`inline-flex items-center font-mono text-[10.5px] uppercase tracking-[0.22em] text-steel-mute ${className}`}
      role="group"
      aria-label="Taalkeuze"
    >
      <button
        type="button"
        onClick={() => setLang('nl')}
        aria-pressed={lang === 'nl'}
        className={`px-1.5 transition-colors ${lang === 'nl' ? 'text-silver' : 'hover:text-steel'}`}
      >
        NL
      </button>
      <span className="opacity-40">/</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`px-1.5 transition-colors ${lang === 'en' ? 'text-silver' : 'hover:text-steel'}`}
      >
        EN
      </button>
    </div>
  );
}
