import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import LangToggle from './LangToggle';

type Lang = 'nl' | 'en';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const links = [
  { href: '#about', key: 'nav.about' },
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#fotos', key: 'nav.gallery' },
  { href: '#bezoek', key: 'nav.visit' },
  { href: '#faq', key: 'nav.faq' },
];

export default function Nav({ lang, setLang, t }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const onDark = !scrolled && !open;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md border-b border-ink/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20 gap-3">
            <a href="#top" className="flex items-center gap-3 min-w-0">
              <img
                src="/logo.webp"
                alt=""
                width={44}
                height={44}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shrink-0 bg-white/80"
              />
              <span
                className={`font-serif text-lg md:text-xl leading-tight truncate ${
                  onDark ? 'text-cream drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]' : 'text-ink'
                }`}
              >
                Hoeve de Kooipolder
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-7" aria-label="Hoofdmenu">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`text-sm transition-colors ${
                    onDark
                      ? 'text-cream/85 hover:text-cream drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]'
                      : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {t(l.key)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <LangToggle lang={lang} setLang={setLang} />
              <a href="tel:+31628577711" className="btn-lilac hidden md:inline-flex">
                <Phone size={16} />
                <span className="hidden lg:inline">{t('nav.call')}</span>
                <span className="lg:hidden">{t('nav.callShort')}</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={`lg:hidden p-2 -mr-2 ${onDark ? 'text-cream' : 'text-ink'}`}
                aria-label="Menu openen"
                aria-expanded={open}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-cream lg:hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <span className="flex items-center gap-3">
                <img
                  src="/logo.webp"
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover bg-white/80"
                />
                <span className="font-serif text-lg text-ink">Hoeve de Kooipolder</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-ink"
                aria-label="Menu sluiten"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mt-6 pb-10" aria-label="Mobiel menu">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-2xl font-serif text-ink border-b border-ink/5"
                >
                  {t(l.key)}
                </a>
              ))}

              <a
                href="tel:+31628577711"
                onClick={() => setOpen(false)}
                className="btn-lilac w-full mt-8 text-base"
              >
                <Phone size={18} />
                {t('nav.call')}
              </a>
              <p className="mt-5 text-center font-serif text-2xl text-ink">
                <a href="tel:+31628577711" onClick={() => setOpen(false)}>
                  06 28 57 77 11
                </a>
              </p>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
