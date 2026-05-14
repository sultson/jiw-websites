import {
  MapPin,
  Phone,
  Smartphone,
  Mail,
  BadgeCheck,
} from 'lucide-react';
import { business, sectionTitles } from '../content';
import { useOfferte } from '../contexts/OfferteContext';

function Contact() {
  const { eyebrow, title } = sectionTitles.contact;
  const { open: openOfferte } = useOfferte();
  const intro =
    'Bel of mail voor een vrijblijvend gesprek. We reageren binnen 1 dag en komen graag langs voor een gratis prijsindicatie.';

  return (
    <section id="contact" className="section bg-bone">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display">{title}</h2>
            <p className="mt-5 text-stone max-w-prose">{intro}</p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-rood shrink-0" />
                <div>
                  <div>{business.address.street}</div>
                  <div>
                    {business.address.postalCode} {business.address.city}
                  </div>
                  <div className="text-stone text-sm">{business.address.province}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1 text-rood shrink-0" />
                <a href={business.phone.href} className="hover:text-rood">
                  {business.phone.display}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 mt-1 text-rood shrink-0" />
                <div className="flex flex-wrap items-center gap-2">
                  <a href={business.mobile.href} className="hover:text-rood">
                    {business.mobile.display}
                  </a>
                  <span className="text-stone">·</span>
                  <a
                    href={business.mobile.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-rood hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-1 text-rood shrink-0" />
                <a href={business.email.href} className="hover:text-rood">
                  {business.email.display}
                </a>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={openOfferte} className="btn btn-primary">
                Gratis prijsindicatie
              </button>
              <a href={business.phone.href} className="btn btn-ghost">
                Bel direct
              </a>
            </div>
          </div>

          <div className="bg-bone-soft rounded-2xl p-6 md:p-8 border border-line">
            <h3 className="font-display text-xl md:text-2xl">Openingstijden</h3>
            <ul className="mt-4">
              {business.hours.map((h, i) => (
                <li
                  key={h.day}
                  className={`flex items-center justify-between py-2 ${
                    i !== business.hours.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <span className="text-ink">{h.day}</span>
                  <span className="text-stone text-sm">{h.time}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-display text-xl md:text-2xl mt-8">Werkgebied</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {business.serviceArea.map((place) => (
                <span
                  key={place}
                  className="bg-bone border border-line rounded-full px-3 py-1 text-sm"
                >
                  {place}
                </span>
              ))}
            </div>

            <h3 className="font-display text-xl md:text-2xl mt-8">Werkwijze</h3>
            <ul className="mt-4 space-y-2">
              {business.certificates.map((cert) => (
                <li key={cert} className="flex items-start gap-2">
                  <BadgeCheck className="w-5 h-5 mt-0.5 text-rood shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <iframe
          src="https://www.google.com/maps?q=Bellamystraat+153+Rotterdam&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kaart Color's Schildersbedrijf"
          className="mt-12 w-full h-[360px] md:h-[480px] rounded-2xl border border-line"
        />
      </div>
    </section>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { open: openOfferte } = useOfferte();

  return (
    <>
      <Contact />
      <footer className="bg-ink text-bone py-12">
        <div className="container-page">
          <div className="rainbow-strip mb-10 opacity-90" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo-mark.png" alt="" className="w-9 h-9 invert brightness-200" />
                <span className="font-display text-xl">Color&apos;s Schildersbedrijf</span>
              </div>
              <p className="mt-3 text-bone/70 text-sm">Schilder uit Rotterdam</p>
            </div>

            <nav aria-label="Snel naar">
              <ul className="space-y-2">
                <li>
                  <a href="#diensten" className="text-bone/70 hover:text-bone">Diensten</a>
                </li>
                <li>
                  <a href="#werk" className="text-bone/70 hover:text-bone">Werk</a>
                </li>
                <li>
                  <a href="#reviews" className="text-bone/70 hover:text-bone">Reviews</a>
                </li>
                <li>
                  <button type="button" onClick={openOfferte} className="text-bone/70 hover:text-bone">
                    Prijsindicatie
                  </button>
                </li>
                <li>
                  <a href="#contact" className="text-bone/70 hover:text-bone">Contact</a>
                </li>
              </ul>
            </nav>

            <div className="space-y-2 text-bone/70 text-sm">
              <a href={business.phone.href} className="block hover:text-bone">{business.phone.display}</a>
              <a href={business.email.href} className="block hover:text-bone">{business.email.display}</a>
              <p>
                {business.address.street}, {business.address.postalCode} {business.address.city}
              </p>
            </div>
          </div>

          <div className="bg-bone/10 h-px w-full my-8" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-bone/70">
            <p>
              © {currentYear} Color&apos;s Schildersbedrijf · Site door{' '}
              <a
                href="https://jouwidealewebsite.nl"
                target="_blank"
                rel="noreferrer"
                className="hover:text-bone underline-offset-2 hover:underline"
              >
                jouwidealewebsite.nl
              </a>
            </p>
            <a
              href={business.trustoo}
              target="_blank"
              rel="noreferrer"
              className="hover:text-bone underline-offset-2 hover:underline"
            >
              Reviews via Trustoo
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
