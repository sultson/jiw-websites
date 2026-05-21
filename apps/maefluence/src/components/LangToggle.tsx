import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

export default function LangToggle({ lang, setLang }: Props) {
  return (
    <div className="inline-flex items-center text-[11px] tracking-[0.32em] uppercase text-coffee/80">
      <button
        type="button"
        onClick={() => setLang('nl')}
        className={`px-2 py-1 transition ${lang === 'nl' ? 'text-coffee' : 'hover:text-coffee'}`}
        aria-pressed={lang === 'nl'}
      >
        NL
      </button>
      <span aria-hidden className="opacity-30">/</span>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 transition ${lang === 'en' ? 'text-coffee' : 'hover:text-coffee'}`}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
