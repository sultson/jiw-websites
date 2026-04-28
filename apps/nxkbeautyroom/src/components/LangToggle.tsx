import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export default function LangToggle({ lang, setLang }: Props) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(['nl', 'en'] as Lang[]).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLang(item)}
          aria-pressed={lang === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
