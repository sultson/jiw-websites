import { useEffect, useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';
import Wordmark from './Wordmark';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onBook: () => void;
};

const LINKS = [
  ['nav.about', '#about'],
  ['nav.services', '#services'],
  ['nav.work', '#work'],
  ['nav.reviews', '#reviews'],
  ['nav.visit', '#visit'],
] as const;

export default function Nav({ lang, setLang, t, onBook }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? 'bg-blush/85 backdrop-blur-xl shadow-[0_1px_0_rgba(125,58,72,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <a href="#top" className="shrink-0" aria-label={t('foot.tag')}>
            <Wordmark />
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.map(([key, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm text-ink-soft hover:text-wine transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LangToggle lang={lang} setLang={setLang} />
            </div>
            <button onClick={onBook} className="btn-gloss hidden sm:inline-flex !min-h-[42px] !py-2 !px-5 text-sm">
              <Calendar size={16} />
              {t('nav.book')}
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 -mr-2 text-ink"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu as a header sibling so it is not clipped by the blurred bar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <div className="absolute top-[68px] inset-x-0 bg-blush/97 backdrop-blur-xl border-t border-wine/10 px-5 pb-8 pt-3 shadow-xl">
            <nav className="flex flex-col">
              {LINKS.map(([key, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-3.5 text-lg font-serif text-ink border-b border-wine/8"
                >
                  {t(key)}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex items-center justify-between">
              <LangToggle lang={lang} setLang={setLang} />
              <button
                onClick={() => {
                  setOpen(false);
                  onBook();
                }}
                className="btn-gloss"
              >
                <Calendar size={18} />
                {t('nav.book')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
