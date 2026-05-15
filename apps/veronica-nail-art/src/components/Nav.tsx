import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const links = [
  { href: '#behandelingen', label: 'Behandelingen' },
  { href: '#werk',          label: "Foto's" },
  { href: '#over',          label: 'Over Veronica' },
  { href: '#recensies',     label: 'Recensies' },
  { href: '#bezoek',        label: 'Bezoek' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink/55 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-ink/5'
          : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#top" aria-label="Veronica Nail Art" className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-serif text-xl md:text-2xl tracking-wide text-ink">Veronica</span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
              Nail Art
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-ink/75 hover:text-ink transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <a href="tel:+31611087951" className="btn-gold hidden md:inline-flex">
              <Phone size={15} />
              Bel direct
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
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream border-b border-ink/10 shadow-xl z-50">
          <div className="px-6 py-6 space-y-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-lg font-serif text-ink border-b border-ink/5 last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a href="tel:+31611087951" onClick={() => setOpen(false)} className="btn-gold w-full mt-4">
              <Phone size={16} />
              Bel 06 11087951
            </a>
          </div>
        </div>
      )}
    </nav>
    </>
  );
}
