import { MapPin, Phone } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { useOfferte } from '../contexts/OfferteContext';
import { business, navLinks, sectionTitles, ui, hero } from '../content';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.74.46 3.45 1.33 4.95L2.05 22l5.3-1.39a9.86 9.86 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.16 0 4.18.84 5.71 2.37a8.04 8.04 0 0 1 2.37 5.73c0 4.48-3.65 8.11-8.12 8.11a8.2 8.2 0 0 1-4.13-1.13l-.3-.18-3.07.8.82-2.99-.19-.31a8.13 8.13 0 0 1-1.25-4.33c0-4.47 3.65-8.12 8.12-8.12zm-3.13 4.42c-.15 0-.39.06-.6.27-.21.21-.79.78-.79 1.9 0 1.12.81 2.21.92 2.36.12.15 1.59 2.43 3.86 3.41.54.23.96.37 1.29.48.54.17 1.04.15 1.43.09.44-.07 1.34-.55 1.53-1.08.19-.53.19-.99.13-1.08-.06-.09-.21-.15-.44-.27-.23-.12-1.34-.66-1.55-.73-.21-.08-.36-.12-.51.11-.15.23-.59.73-.72.88-.13.15-.27.17-.5.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.34-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.28-.01-.43-.01z" />
    </svg>
  );
}

export default function Footer() {
  const { t, brand } = useSite();
  const { open } = useOfferte();
  const { address, phone, whatsapp } = business;
  const year = new Date().getFullYear();

  return (
    <>
      {/* Contact section */}
      <section id="contact" className="section bg-ink-2">
        <div className="container-page">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Left */}
            <div>
              <span className="eyebrow">{t(sectionTitles.contact.eyebrow)}</span>
              <h2 className="mt-4 text-4xl md:text-5xl">
                {t(sectionTitles.contact.titleStart)}
                <span className="text-orange">{t(sectionTitles.contact.titleEm)}</span>
                {t(sectionTitles.contact.titleEnd)}
              </h2>
              <p className="mt-6 max-w-md text-bone-soft">{t(ui.contactIntro)}</p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-ink-3">
                    <MapPin className="h-5 w-5 text-orange" aria-hidden="true" />
                  </span>
                  <span className="text-bone-soft">
                    <span className="block font-semibold text-bone">{address.street}</span>
                    {address.postalCode} {address.city}
                    <span className="block text-mute">{address.province}</span>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-ink-3">
                    <Phone className="h-5 w-5 text-orange" aria-hidden="true" />
                  </span>
                  <a
                    href={phone.href}
                    className="font-semibold text-bone transition-colors hover:text-orange"
                  >
                    {phone.display}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-line bg-ink-3">
                    <WhatsAppIcon className="h-5 w-5 text-orange" />
                  </span>
                  <a
                    href={whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-bone transition-colors hover:text-orange"
                  >
                    WhatsApp {whatsapp.display}
                  </a>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={open} className="btn btn-orange">
                  {t(hero.ctaPrimary)}
                </button>
                <a href={phone.href} className="btn btn-outline">
                  {t(hero.ctaSecondary)}
                </a>
              </div>
            </div>

            {/* Right: hours + service area */}
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-bold text-bone">{t(ui.hoursTitle)}</h3>
              <ul className="mt-4">
                {business.hours.map((row, i) => (
                  <li key={row.day.nl}>
                    {i > 0 && <span className="hairline" aria-hidden="true" />}
                    <div className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-bone-soft">{t(row.day)}</span>
                      <span className="font-semibold text-bone">
                        {typeof row.time === 'string' ? row.time : t(row.time)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-xl font-bold text-bone">{t(ui.areaTitle)}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {business.serviceArea.map((place) => (
                  <li
                    key={place}
                    className="rounded-md border border-line bg-ink px-3 py-1 text-xs font-semibold text-bone-soft"
                  >
                    {place}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-mute">{t(ui.areaNote)}</p>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 overflow-hidden rounded-xl border border-line">
            <iframe
              title={`${brand.name} ${address.city}`}
              src={business.maps}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full md:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-ink py-12 md:py-14">
        <div className="container-page">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <img src={brand.logoFull} alt={brand.name} className="h-9 w-auto" />
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-orange">
                {t(ui.footerTagline)}
              </p>
              <p className="mt-2 max-w-xs text-sm text-bone-soft">{t(ui.footerAbout)}</p>
            </div>

            <nav aria-label={t(ui.footerNav)}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-bone">
                {t(ui.footerNav)}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-bone-soft transition-colors hover:text-orange"
                    >
                      {t(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-bone">
                {t(ui.footerContact)}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-bone-soft">
                <li>
                  <a href={phone.href} className="transition-colors hover:text-orange">
                    {phone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-orange"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  {address.street}, {address.postalCode} {address.city}
                </li>
              </ul>
            </div>
          </div>

          <span className="hairline mt-10 block" aria-hidden="true" />
          <div className="mt-6 flex flex-col gap-3 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {brand.name}
            </p>
            <span>
              {t(ui.builtBy)}{' '}
              <a
                href="https://jouwidealewebsite.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-orange"
              >
                jouwidealewebsite.nl
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
