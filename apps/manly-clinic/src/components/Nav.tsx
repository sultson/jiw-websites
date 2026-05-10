import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LangToggle from './LangToggle';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onBook: () => void;
};

export default function Nav({ lang, setLang, t, onBook }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    ['#behandelingen', t('nav.treatments')],
    ['#werkwijze', t('nav.method')],
    ['#over', t('nav.about')],
    ['#locatie', t('nav.visit')],
  ] as const;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled ? 'bg-paper/90 backdrop-blur-sm border-b border-ink-line' : 'bg-paper border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Manly Clinic home">
          <img
            src="/logo/manly-mark.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-[15px] tracking-[0.28em] uppercase text-ink">
            Manly Clinic
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-9" aria-label="Hoofdnavigatie">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-[12px] tracking-[0.22em] uppercase text-ink-soft hover:text-ink transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <LangToggle lang={lang} setLang={setLang} />
          <button type="button" onClick={onBook} className="btn-copper hidden md:inline-flex">
            {t('nav.book')}
          </button>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center text-ink"
            aria-label={open ? t('nav.close') : t('nav.menu')}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink-line bg-paper">
          <div className="px-5 md:px-10 py-6 flex flex-col gap-5 safe-bottom">
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-[14px] tracking-[0.22em] uppercase text-ink"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onBook();
              }}
              className="btn-copper w-full"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
