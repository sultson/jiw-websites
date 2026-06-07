import type { Lang } from '../i18n';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const langs: Lang[] = ['nl', 'en'];

export default function LangToggle({ lang, setLang }: Props) {
  return (
    <div className="glass-pill relative flex items-center p-0.5 text-[0.78rem] font-medium" role="group" aria-label="Language">
      {langs.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`relative z-[1] rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors ${
              active ? 'text-ink' : 'text-ink-faint hover:text-ink-dim'
            }`}
          >
            {active && (
              <span
                className="absolute inset-0 -z-[1] rounded-full"
                style={{ background: 'color-mix(in oklab, white 16%, transparent)' }}
                aria-hidden="true"
              />
            )}
            {l}
          </button>
        );
      })}
    </div>
  );
}
