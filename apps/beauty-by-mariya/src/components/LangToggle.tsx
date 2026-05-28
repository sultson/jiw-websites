import type { Lang } from '../translations';

type Props = { lang: Lang; setLang: (l: Lang) => void; compact?: boolean };

const langs: { code: Lang; label: string }[] = [
  { code: 'nl', label: 'NL' },
  { code: 'en', label: 'EN' },
  { code: 'ua', label: 'UA' },
];

export default function LangToggle({ lang, setLang, compact }: Props) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-ink/15 bg-white/70 backdrop-blur-sm ${compact ? 'p-0.5' : 'p-1'}`}
      role="group"
      aria-label="Language"
    >
      {langs.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={`${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'} rounded-full font-medium tracking-wider uppercase ${
            lang === l.code ? 'bg-ink text-pearl' : 'text-ink/60 hover:text-ink'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
