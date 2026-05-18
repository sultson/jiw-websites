import { useEffect, useState } from 'react';
import { Menu, X, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useSite, type Lang } from '../contexts/SiteContext';
import { useOfferte } from '../contexts/OfferteContext';
import { navLinks, ui, business } from '../content';

/* ---- Language toggle ------------------------------------------------- */

function LangToggle({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const { lang, setLang } = useSite();
  const langs: Lang[] = ['nl', 'en'];
  const pad = size === 'lg' ? 'px-3 py-1.5 text-xs' : 'px-2 py-1 text-[11px]';
  return (
    <div
      className="inline-flex items-center rounded-md border border-line bg-ink p-0.5"
      role="group"
      aria-label="Language"
    >
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`${pad} rounded-[5px] font-bold uppercase tracking-[0.1em] transition-colors ${
            lang === l ? 'bg-bone text-ink' : 'text-bone-soft hover:text-bone'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---- Wordmark -------------------------------------------------------- */

function Wordmark({ onClick }: { onClick?: () => void }) {
  const { brand, t } = useSite();
  return (
    <a
      href="#top"
      aria-label={`${brand.name}, ${t(ui.toTop)}`}
      onClick={onClick}
      className="flex items-center"
    >
      <img
        src={brand.logoFull}
        alt={brand.name}
        className="h-8 w-auto md:h-9"
      />
    </a>
  );
}

/* ---- Header ---------------------------------------------------------- */

export default function TopBar() {
  const { t } = useSite();
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-ink/95 backdrop-blur-md border-b border-line'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-page flex h-[64px] items-center justify-between gap-6 md:h-[68px]">
          <Wordmark />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Hoofdmenu">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-bone-soft transition-colors hover:text-orange"
              >
                {t(link.label)}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <LangToggle />
            <a
              href={business.phone.href}
              className="flex items-center gap-2 text-sm font-semibold text-bone transition-colors hover:text-orange"
            >
              <Phone size={16} className="text-orange" aria-hidden="true" />
              {business.phone.display}
            </a>
            <button type="button" onClick={open} className="btn btn-orange">
              {t(ui.navCta)}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-bone transition-colors hover:border-orange hover:text-orange lg:hidden"
            aria-label={t(ui.menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile overlay — sibling of <header> so a scrolled backdrop-blur
          ancestor cannot become its containing block and clip it. */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-50 bg-ink/98 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="container-page flex h-[64px] shrink-0 items-center justify-between">
            <Wordmark onClick={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-bone transition-colors hover:border-orange hover:text-orange"
              aria-label={t(ui.menuClose)}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="container-page flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-6">
            <nav className="flex flex-col gap-1" aria-label={t(ui.mobileMenu)}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line-soft py-3.5 text-2xl font-bold text-bone transition-colors hover:text-orange"
                >
                  {t(link.label)}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                open();
              }}
              className="btn btn-orange mt-6 w-full"
            >
              {t(ui.navCta)}
            </button>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={business.phone.href}
                className="flex items-center gap-3 text-bone transition-colors hover:text-orange"
              >
                <Phone size={18} className="text-orange" aria-hidden="true" />
                <span className="font-semibold">{business.phone.display}</span>
              </a>
              <a
                href={business.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-bone transition-colors hover:text-orange"
              >
                <MessageCircle size={18} className="text-orange" aria-hidden="true" />
                <span className="font-semibold">WhatsApp</span>
              </a>
              <div className="flex items-start gap-3 text-bone-soft">
                <MapPin size={18} className="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
                <span className="text-sm">
                  {business.address.street}, {business.address.postalCode} {business.address.city}
                </span>
              </div>
            </div>

            <div className="mt-7">
              <LangToggle size="lg" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
