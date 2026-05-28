import { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

type Props = { t: (k: string) => string };

const PHONE_TEL = 'tel:+31648490004';
const PHONE_WA = 'https://wa.me/31648490004';

const links = [
  { href: '#behandelingen',  key: 'nav.services' },
  { href: '#specialisaties', key: 'nav.specialisaties' },
  { href: '#praktijk',       key: 'nav.werk' },
  { href: '#over-gerda',     key: 'nav.recensies' },
  { href: '#bezoek',         key: 'nav.bezoek' },
];

export default function Nav({ t }: Props) {
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
          ? 'bg-cream/92 backdrop-blur-md border-b border-ink/5'
          : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a
            href="#top"
            aria-label="Pedicurepraktijk FootCare+"
            className="flex items-baseline gap-0.5 min-w-0"
          >
            <span className="font-serif text-xl md:text-2xl tracking-tight text-ink">
              FootCare
            </span>
            <span className="font-serif text-xl md:text-2xl tracking-tight text-teal">
              +
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink/75 hover:text-ink transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={PHONE_WA}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Gerda"
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full text-wa border border-wa/40 hover:bg-wa hover:text-white transition-colors"
            >
              <MessageCircle size={18} />
            </a>
            <a href={PHONE_TEL} className="btn-gold hidden md:inline-flex">
              <Phone size={16} />
              {t('nav.book')}
            </a>
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
            <div className="grid grid-cols-2 gap-2 mt-4">
              <a
                href={PHONE_TEL}
                onClick={() => setOpen(false)}
                className="btn-gold w-full"
              >
                <Phone size={16} />
                {t('nav.book')}
              </a>
              <a
                href={PHONE_WA}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn-wa w-full"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
