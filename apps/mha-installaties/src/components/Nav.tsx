import { useEffect, useState } from 'react';
import { Menu, X, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { business } from '../content';

const links = [
  { label: 'Diensten', href: '#diensten' },
  { label: 'Werk', href: '#werk' },
  { label: 'Ervaringen', href: '#ervaringen' },
  { label: 'Contact', href: '#contact' },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <a
      href="#top"
      aria-label={`${business.name}, naar boven`}
      onClick={onClick}
      className="group flex items-center gap-2.5"
    >
      <img
        src="/logo-mark.png"
        alt=""
        className="h-10 w-auto shrink-0 md:h-12"
      />
      <span className="text-gradient-gold font-bold uppercase leading-none tracking-[0.05em] text-[1.35rem] md:text-[1.6rem]">
        MHA Installaties
      </span>
    </a>
  );
}

export default function Nav() {
  const { open } = useOfferte();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handlePrijsindicatie = () => {
    setMenuOpen(false);
    open();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-ink/95 backdrop-blur-md border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Hoofdmenu">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bone-soft transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={business.phone.href}
            className="flex items-center gap-2 text-sm font-medium text-bone transition-colors hover:text-gold"
          >
            <Phone size={16} className="text-gold" aria-hidden="true" />
            {business.phone.display}
          </a>
          <button type="button" onClick={open} className="btn btn-gold">
            Prijsindicatie
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-gold hover:text-gold md:hidden"
          aria-label="Menu openen"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 bg-ink transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="container-page flex h-[72px] shrink-0 items-center justify-between">
            <Wordmark onClick={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-gold hover:text-gold"
              aria-label="Menu sluiten"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav
            className="container-page flex flex-1 flex-col justify-center gap-2"
            aria-label="Mobiel menu"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line-soft py-4 text-3xl font-semibold text-bone transition-colors hover:text-gold"
              >
                {link.label}
              </a>
            ))}

            <button
              type="button"
              onClick={handlePrijsindicatie}
              className="btn btn-gold mt-8 w-full"
            >
              Prijsindicatie
            </button>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={business.phone.href}
                className="flex items-center gap-3 text-bone transition-colors hover:text-gold"
              >
                <Phone size={18} className="text-gold" aria-hidden="true" />
                <span className="font-medium">{business.phone.display}</span>
              </a>
              <a
                href={business.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-bone transition-colors hover:text-gold"
              >
                <MessageCircle size={18} className="text-gold" aria-hidden="true" />
                <span className="font-medium">WhatsApp</span>
              </a>
              <div className="flex items-start gap-3 text-bone-soft">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span className="text-sm">
                  {business.address.street}, {business.address.postalCode}{' '}
                  {business.address.city}
                </span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
