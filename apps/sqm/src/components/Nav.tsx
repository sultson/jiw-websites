import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LangToggle from './LangToggle';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onIntake: () => void;
};

const links = [
  { href: '#diensten',  k: 'nav.diensten' },
  { href: '#werkwijze', k: 'nav.werkwijze' },
  { href: '#werk',      k: 'nav.werk' },
  { href: '#reviews',   k: 'nav.reviews' },
  { href: '#faq',       k: 'nav.faq' },
];

export default function Nav({ lang, setLang, t, onIntake }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? 'bg-cream/85 backdrop-blur-md border-b border-charcoal/8' : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5" aria-label="SQM Bouwmanagement">
          <img
            src="/logo/sqm-mark.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-auto"
            draggable={false}
          />
          <span className="hidden sm:flex flex-col leading-none">
            <span className="font-display font-extrabold text-[15px] tracking-tight text-charcoal-ink">SQM</span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-charcoal/60 mt-0.5">Bouwmanagement</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-charcoal/80 hover:text-charcoal-ink transition-colors"
            >
              {t(l.k)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} compact />
          <button type="button" className="hidden sm:inline-flex btn-orange" onClick={onIntake}>
            {t('nav.cta')}
          </button>
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-charcoal-ink"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-charcoal/10 bg-cream">
          <nav className="px-4 sm:px-6 py-3 flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-charcoal-ink border-b border-charcoal/8 last:border-b-0"
              >
                {t(l.k)}
              </a>
            ))}
            <button
              type="button"
              className="btn-orange mt-4 w-full"
              onClick={() => { setOpen(false); onIntake(); }}
            >
              {t('nav.cta')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
