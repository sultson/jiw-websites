import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { business } from '../content';
import { useOfferte } from '../contexts/OfferteContext';

const links = [
  { href: '#diensten', label: 'Diensten' },
  { href: '#werk', label: 'Werk' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
];

function Wordmark() {
  return (
    <a href="#top" className="flex items-center" aria-label={`${business.name} home`}>
      <img
        src="/logo-full.webp"
        alt={business.name}
        className="h-12 md:h-14 w-auto"
      />
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { open: openOfferte } = useOfferte();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-bone shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-page flex items-center justify-between py-4 md:py-5">
        <Wordmark />

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-sans text-sm text-ink hover:underline underline-offset-8 decoration-1"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={business.phone.href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-saffron-deep"
          >
            <Phone size={16} strokeWidth={2} />
            {business.phone.display}
          </a>
          <button
            type="button"
            onClick={openOfferte}
            className="btn btn-primary"
          >
            Offerte
          </button>
        </div>

        <button
          type="button"
          aria-label="Menu openen"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 text-ink"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>

      {scrolled && <div className="hairline" />}

      <div
        className={`md:hidden fixed inset-0 z-50 bg-bone transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="container-page flex items-center justify-between py-4">
          <Wordmark />
          <button
            type="button"
            aria-label="Menu sluiten"
            onClick={close}
            className="inline-flex items-center justify-center h-10 w-10 text-ink"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="hairline" />

        <div className="container-page flex flex-col gap-10 pt-12 pb-10">
          <nav className="flex flex-col gap-7">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="font-display text-4xl text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 items-start">
            <button
              type="button"
              onClick={() => {
                close();
                openOfferte();
              }}
              className="btn btn-primary"
            >
              Vraag offerte aan
            </button>
            <a
              href={business.phone.href}
              onClick={close}
              className="btn btn-ghost"
            >
              Bel {business.phone.display}
            </a>
          </div>

          <div className="mt-auto pt-8">
            <div className="hairline mb-6" />
            <div className="font-sans text-xs text-stone leading-relaxed">
              <div>
                {business.address.street}, {business.address.postalCode} {business.address.city}
              </div>
              <div>KVK {business.kvk}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
