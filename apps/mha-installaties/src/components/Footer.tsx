import { FileText, Instagram, Facebook, Mail, MapPin, Music2, Phone, Youtube } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { business, sectionTitles } from '../content';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.74.46 3.45 1.33 4.95L2.05 22l5.3-1.39a9.86 9.86 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.16 0 4.18.84 5.71 2.37a8.04 8.04 0 0 1 2.37 5.73c0 4.48-3.65 8.11-8.12 8.11a8.2 8.2 0 0 1-4.13-1.13l-.3-.18-3.07.8.82-2.99-.19-.31a8.13 8.13 0 0 1-1.25-4.33c0-4.47 3.65-8.12 8.12-8.12zm-3.13 4.42c-.15 0-.39.06-.6.27-.21.21-.79.78-.79 1.9 0 1.12.81 2.21.92 2.36.12.15 1.59 2.43 3.86 3.41.54.23.96.37 1.29.48.54.17 1.04.15 1.43.09.44-.07 1.34-.55 1.53-1.08.19-.53.19-.99.13-1.08-.06-.09-.21-.15-.44-.27-.23-.12-1.34-.66-1.55-.73-.21-.08-.36-.12-.51.11-.15.23-.59.73-.72.88-.13.15-.27.17-.5.06-.23-.12-.96-.36-1.83-1.13-.68-.6-1.13-1.35-1.27-1.58-.13-.23-.01-.35.1-.47.1-.1.23-.27.34-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.39-.13-.01-.28-.01-.43-.01z" />
    </svg>
  );
}

export default function Footer() {
  const { open } = useOfferte();
  const { address, phone, whatsapp, email } = business;
  const year = new Date().getFullYear();

  const navLinks = [
    { label: 'Diensten', href: '#diensten' },
    { label: 'Werk', href: '#werk' },
    { label: 'Ervaringen', href: '#ervaringen' },
    { label: 'Contact', href: '#contact' },
  ];

  const socials = [
    { label: 'Instagram', href: business.socials.instagram, Icon: Instagram },
    { label: 'Facebook', href: business.socials.facebook, Icon: Facebook },
    { label: 'YouTube', href: business.socials.youtube, Icon: Youtube },
    { label: 'TikTok', href: business.socials.tiktok, Icon: Music2 },
  ];

  return (
    <>
      {/* Contact section */}
      <section id="contact" className="section bg-ink-2">
        <div className="container-page">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {/* Left: header, intro, contact list, CTAs */}
            <div>
              <span className="eyebrow">{sectionTitles.contact.eyebrow}</span>
              <h2 className="mt-4 text-4xl md:text-5xl">
                Plan uw afspraak{' '}
                <span className="text-gradient-gold">zonder gedoe</span>.
              </h2>
              <p className="mt-6 max-w-md text-bone-soft">
                Bel, app of stuur een bericht. We reageren snel en denken met u mee.
              </p>

              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-ink-3">
                    <MapPin className="h-5 w-5 text-gold" aria-hidden="true" />
                  </span>
                  <span className="not-italic text-bone-soft">
                    <span className="block text-bone">{address.street}</span>
                    {address.postalCode} {address.city}
                    <span className="block text-mute">{address.province}</span>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-ink-3">
                    <Phone className="h-5 w-5 text-gold" aria-hidden="true" />
                  </span>
                  <a
                    href={phone.href}
                    className="text-bone transition-colors hover:text-gold-bright"
                  >
                    {phone.display}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-ink-3">
                    <WhatsAppIcon className="h-5 w-5 text-gold" />
                  </span>
                  <a
                    href={whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone transition-colors hover:text-gold-bright"
                  >
                    WhatsApp {whatsapp.display}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-ink-3">
                    <Mail className="h-5 w-5 text-gold" aria-hidden="true" />
                  </span>
                  <a
                    href={email.href}
                    className="break-all text-bone transition-colors hover:text-gold-bright"
                  >
                    {email.display}
                  </a>
                </li>
                <li className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-ink-3">
                    <FileText className="h-5 w-5 text-gold" aria-hidden="true" />
                  </span>
                  <span className="text-bone-soft">
                    KVK <span className="text-bone">{business.kvk}</span>
                  </span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={open} className="btn btn-gold">
                  Gratis prijsindicatie
                </button>
                <a href={phone.href} className="btn btn-outline">
                  Bel direct
                </a>
              </div>
            </div>

            {/* Right: hours + service area card */}
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-semibold text-bone">Openingstijden</h3>
              <ul className="mt-4">
                {business.hours.map((row, i) => (
                  <li key={row.day}>
                    {i > 0 && <span className="hairline" aria-hidden="true" />}
                    <div className="flex items-center justify-between py-2.5 text-sm">
                      <span className="text-bone-soft">{row.day}</span>
                      <span className="font-medium text-bone">{row.time}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-xl font-semibold text-bone">Werkgebied</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {business.serviceArea.map((place) => (
                  <li
                    key={place}
                    className="rounded-full border border-line bg-ink px-3 py-1 text-xs font-medium text-bone-soft"
                  >
                    {place}
                  </li>
                ))}
              </ul>

            </div>
          </div>

          {/* Full-width map */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-line">
            <iframe
              title={`Locatie van ${business.name} in ${address.city}`}
              src="https://www.google.com/maps?q=Gershwinstraat+27+6044+VC+Roermond&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[360px] w-full md:h-[460px]"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-ink py-12 md:py-14">
        <div className="container-page">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <picture>
                <source
                  type="image/avif"
                  srcSet="/logo-full-192.avif 192w, /logo-full-384.avif 384w"
                  sizes="85px"
                />
                <source
                  type="image/webp"
                  srcSet="/logo-full-192.webp 192w, /logo-full-384.webp 384w"
                  sizes="85px"
                />
                <img
                  src="/logo-full-192.webp"
                  alt={business.name}
                  width={170}
                  height={80}
                  className="h-10 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <p className="mt-4 text-sm font-medium text-gold">{business.tagline}</p>
              <p className="mt-2 max-w-xs text-sm text-bone-soft">
                Loodgieter en installateur in {address.city} en omstreken.
              </p>
            </div>

            {/* Quick nav */}
            <nav aria-label="Footer navigatie">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-bone">
                Navigatie
              </h3>
              <ul className="mt-4 space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-bone-soft transition-colors hover:text-gold-bright"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact summary */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-bone">
                Contact
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-bone-soft">
                <li>
                  <a
                    href={phone.href}
                    className="transition-colors hover:text-gold-bright"
                  >
                    {phone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={email.href}
                    className="break-all transition-colors hover:text-gold-bright"
                  >
                    {email.display}
                  </a>
                </li>
                <li>
                  {address.street}, {address.postalCode} {address.city}
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-bone">
                Volg ons
              </h3>
              <ul className="mt-4 flex gap-3">
                {socials.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${business.name} op ${label}`}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-ink-3 text-bone-soft transition-colors hover:border-gold hover:text-gold-bright"
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <span className="hairline mt-10 block" aria-hidden="true" />
          <div className="mt-6 flex flex-col gap-3 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {business.name} · KVK {business.kvk}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={business.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-bright"
              >
                Reviews via Google
              </a>
              <span aria-hidden="true">·</span>
              <span>
                Site door{' '}
                <a
                  href="https://jouwidealewebsite.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-bright"
                >
                  jouwidealewebsite.nl
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
