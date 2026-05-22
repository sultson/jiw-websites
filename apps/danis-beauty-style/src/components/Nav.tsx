import { useEffect, useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import LangToggle from './LangToggle';
import { business } from '../data/contact';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const links: Array<{ key: string; href: string }> = [
  { key: 'nav.services', href: '#services' },
  { key: 'nav.work',     href: '#gallery'  },
  { key: 'nav.reels',    href: '#reels'    },
  { key: 'nav.reviews',  href: '#reviews'  },
  { key: 'nav.visit',    href: '#visit'    },
  { key: 'nav.faq',      href: '#faq'      },
];

export default function Nav({ lang, setLang, t }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? 'bg-ink/95 backdrop-blur-md border-b border-line/60' : 'bg-transparent'
        }`}
      >
        <div className="container-page flex items-center justify-between h-16 md:h-20">
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src="/dani-logo.png"
              alt="Dani's beauty style"
              width={120}
              height={60}
              className="h-9 md:h-11 w-auto select-none"
              loading="eager"
            />
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {links.map(l => (
              <a
                key={l.key}
                href={l.href}
                className="text-sm text-bone-soft hover:text-gold-bright transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang} />
            <a href={business.phone.href} className="btn btn-gold">
              <Phone size={16} aria-hidden="true" />
              <span>{t('nav.call')}</span>
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LangToggle lang={lang} setLang={setLang} />
            <button
              type="button"
              aria-label={open ? 'Sluit menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-line text-bone hover:text-gold-bright hover:border-gold"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 bg-ink/98 backdrop-blur-xl flex flex-col px-6 pt-8 pb-12 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <nav className="flex flex-col gap-2">
            {links.map(l => (
              <a
                key={l.key}
                href={l.href}
                className="text-2xl font-serif text-bone py-3 border-b border-line/60"
              >
                {t(l.key)}
              </a>
            ))}
          </nav>
          <a href={business.phone.href} className="btn btn-gold mt-8">
            <Phone size={16} aria-hidden="true" />
            {t('nav.call')}
          </a>
          <a
            href={business.phone.wa}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline mt-3"
          >
            WhatsApp
          </a>
          <p className="mt-6 text-mute text-sm">{business.phone.display}</p>
        </div>
      )}
    </>
  );
}
