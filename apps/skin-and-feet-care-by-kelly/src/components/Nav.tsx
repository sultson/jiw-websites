import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onBook: () => void;
};

const links = [
  { href: '#over-kelly',    key: 'nav.about' },
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#voetzorg',      key: 'nav.voetzorg' },
  { href: '#ervaringen',    key: 'nav.reviews' },
  { href: '#bezoek',        key: 'nav.visit' },
];

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-serif tracking-wide ${className}`}>
      Skin &amp; feet care <span className="text-plum">by Kelly</span>
    </span>
  );
}

export default function Nav({ lang, setLang, t, onBook }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-ink/5'
          : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#top" aria-label="Skin & feet care by Kelly" className="flex items-center min-w-0">
            <Wordmark className="text-lg sm:text-xl md:text-2xl text-ink" />
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-ink/75 hover:text-ink">
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LangToggle lang={lang} setLang={setLang} compact />
            <button onClick={onBook} className="btn-plum hidden md:inline-flex">
              {t('nav.book')}
            </button>
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 -mr-2 text-ink"
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream border-b border-ink/10 shadow-xl">
          <div className="px-6 py-6 space-y-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-lg font-serif text-ink border-b border-ink/5 last:border-0"
              >
                {t(l.key)}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onBook(); }}
              className="btn-plum w-full mt-4"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
