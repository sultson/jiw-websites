import { useEffect, useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { site } from '../data/site';

const links = [
  { href: '#diensten', label: 'Diensten' },
  { href: '#werk', label: 'Werk' },
  { href: '#over', label: 'Over ons' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#offerte', label: 'Offerte' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? 'bg-bbn-ink/90 backdrop-blur border-b border-bbn-line' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <img src="/logo.png" alt="BBN Totaalbouw" className="h-10 w-auto sm:h-12" />
          <span className="sr-only">BBN Totaalbouw</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium uppercase tracking-wide text-zinc-300 hover:text-bbn-red transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phoneRaw}`}
            className="hidden items-center gap-2 rounded-md bg-bbn-red px-4 py-2 text-sm font-bold uppercase tracking-wide text-white hover:bg-bbn-red-dark transition sm:inline-flex"
          >
            <Phone className="h-4 w-4" />
            {site.phone}
          </a>
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="rounded-md border border-bbn-line p-2 text-white lg:hidden"
            aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-bbn-line bg-bbn-ink lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-semibold uppercase tracking-wide text-zinc-200 hover:text-bbn-red"
              >
                {l.label}
              </a>
            ))}
            <a
              href={`tel:${site.phoneRaw}`}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-bbn-red px-4 py-3 text-sm font-bold uppercase tracking-wide text-white sm:hidden"
            >
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
