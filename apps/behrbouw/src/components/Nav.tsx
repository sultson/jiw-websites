import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import Logo from './Logo';
import { PHONE_DISPLAY, PHONE_HREF } from '../data';

const LINKS = [
  { href: '#wat-we-doen', label: 'Wat we doen' },
  { href: '#vakgebieden', label: 'Vakgebieden' },
  { href: '#werkwijze', label: 'Werkwijze' },
  { href: '#over', label: 'Over BEHR' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Hoofdmenu">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-white/80 transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-full bg-oranje px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-oranje-deep"
            >
              <Phone size={15} strokeWidth={2.5} />
              {PHONE_DISPLAY}
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            aria-expanded={open}
            aria-label={open ? 'Menu sluiten' : 'Menu openen'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu: sibling of the blurred header so position:fixed is not clipped */}
      {open && (
        <div className="fixed inset-0 z-30 bg-ink pt-16 lg:hidden">
          <nav className="flex flex-col gap-1 px-6 pt-6" aria-label="Mobiel menu">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display border-b border-white/10 py-4 text-3xl text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href={PHONE_HREF}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-oranje px-5 py-3.5 text-base font-bold text-white"
            >
              <Phone size={18} strokeWidth={2.5} />
              Bel {PHONE_DISPLAY}
            </a>
            <p className="mt-4 text-center text-sm text-white/50">Ma t/m vr 08:00 tot 16:00 uur</p>
          </nav>
        </div>
      )}
    </>
  );
}
