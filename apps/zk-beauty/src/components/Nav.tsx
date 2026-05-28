import { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';
import { contact } from '../data/contact';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const links = [
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#werk',          key: 'nav.work' },
  { href: '#over',          key: 'nav.about' },
  { href: '#recensies',     key: 'nav.reviews' },
  { href: '#bezoek',        key: 'nav.visit' },
];

export default function Nav({ lang, setLang, t }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
    <>
      <nav
        className={`sticky top-0 z-50 transition-colors ${
          scrolled
            ? 'bg-ivory/92 backdrop-blur-md border-b border-ink/6'
            : 'bg-ivory/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16 md:h-20">
            <a href="#top" aria-label="ZK Beauty" className="flex items-center gap-3 min-w-0">
              <img src="/zk-logo.png" alt="" aria-hidden className="h-9 md:h-11 w-auto" />
              <span className="hidden sm:inline zk-mark text-base md:text-lg tracking-[0.32em] uppercase text-ink">
                ZK Beauty
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[12px] tracking-[0.18em] uppercase text-ink/70 hover:text-ink transition-colors"
                >
                  {t(l.key)}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <LangToggle lang={lang} setLang={setLang} compact />
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary hidden md:inline-flex"
              >
                {t('nav.book')}
                <ArrowUpRight size={14} />
              </a>
              <button
                onClick={() => setOpen(v => !v)}
                className="lg:hidden p-2 -mr-2 text-ink"
                aria-label="Menu"
                aria-expanded={open}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 left-0 bg-ivory border-b border-ink/10 shadow-2xl">
            <div className="flex items-center justify-between px-5 h-16">
              <a href="#top" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <img src="/zk-logo.png" alt="" className="h-9 w-auto" />
                <span className="zk-mark text-base tracking-[0.32em] uppercase">ZK Beauty</span>
              </a>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-ink"
                aria-label="Sluiten"
              >
                <X size={24} />
              </button>
            </div>
            <div className="px-6 pb-8 pt-2 space-y-1">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-2xl text-ink border-b border-ink/8 last:border-0"
                >
                  {t(l.key)}
                </a>
              ))}
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn-primary w-full mt-6"
              >
                {t('nav.book')}
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
