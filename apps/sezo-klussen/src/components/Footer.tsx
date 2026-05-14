import { MapPin, Phone, MessageCircle, Clock, FileText, BadgeCheck } from 'lucide-react';
import { site } from '../data/site';
import { useOfferte } from '../contexts/OfferteContext';

function Contact() {
  const { open: openOfferte } = useOfferte();
  const intro =
    `Bel of stuur een WhatsApp voor een vrijblijvend gesprek. ${site.ownerName} reageert dezelfde dag en plant snel een inmeting in.`;

  return (
    <section id="contact" className="section bg-bone">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display">Even kennismaken kost niets.</h2>
            <p className="mt-5 text-stone max-w-prose">{intro}</p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-gold shrink-0" />
                <div>
                  <div>{site.area}</div>
                  <div className="text-stone text-sm">Rotterdam, Zuid-Holland</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-1 text-gold shrink-0" />
                <a href={`tel:${site.phoneRaw}`} className="hover:text-gold-deep">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 mt-1 text-gold shrink-0" />
                <a
                  href={`https://wa.me/${site.whatsappRaw}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-deep"
                >
                  WhatsApp {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 text-gold shrink-0" />
                <div>
                  <div>{site.hours}</div>
                  <div className="text-stone text-sm">Zondag gesloten</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 mt-1 text-gold shrink-0" />
                <span>KvK {site.kvk}</span>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={openOfferte} className="btn btn-primary">
                Vraag offerte aan
              </button>
              <a href={`tel:${site.phoneRaw}`} className="btn btn-ghost">
                Bel direct
              </a>
            </div>
          </div>

          <div className="bg-bone-soft rounded-2xl p-6 md:p-8 border border-line">
            <h3 className="font-display text-xl md:text-2xl">Wat we doen</h3>
            <ul className="mt-4 space-y-2">
              {['Stucwerk', 'Schilderwerk', 'Tegelwerk', 'Renovatie', 'Badkamer en toilet', 'Keuken plaatsen'].map(
                (svc) => (
                  <li key={svc} className="flex items-start gap-2">
                    <BadgeCheck className="w-5 h-5 mt-0.5 text-gold shrink-0" />
                    <span>{svc}</span>
                  </li>
                ),
              )}
            </ul>

            <h3 className="font-display text-xl md:text-2xl mt-8">Werkgebied</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Rotterdam', 'Bergschenhoek', 'Capelle aan den IJssel', 'Schiedam', 'Vlaardingen', 'Barendrecht'].map(
                (place) => (
                  <span
                    key={place}
                    className="bg-bone border border-line rounded-full px-3 py-1 text-sm"
                  >
                    {place}
                  </span>
                ),
              )}
            </div>

            <h3 className="font-display text-xl md:text-2xl mt-8">Vertrouwd</h3>
            <ul className="mt-4 space-y-2">
              {site.trust.map((cert) => (
                <li key={cert} className="flex items-start gap-2">
                  <BadgeCheck className="w-5 h-5 mt-0.5 text-gold shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3">
                <img src="/sezo-logo-compact.png" alt="" className="h-8 w-auto" />
                <span className="font-display text-xl">{site.name}</span>
              </div>
              <p className="mt-3 text-bone/70 text-sm">Klussenbedrijf uit Rotterdam</p>
            </div>

            <nav aria-label="Snel naar">
              <ul className="space-y-2">
                <li>
                  <a href="#diensten" className="text-bone/70 hover:text-bone">
                    Diensten
                  </a>
                </li>
                <li>
                  <a href="#werk" className="text-bone/70 hover:text-bone">
                    Werk
                  </a>
                </li>
                <li>
                  <a href="#over" className="text-bone/70 hover:text-bone">
                    Over ons
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="text-bone/70 hover:text-bone">
                    Reviews
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openOfferte}
                    className="text-bone/70 hover:text-bone"
                  >
                    Offerte
                  </button>
                </li>
                <li>
                  <a href="#contact" className="text-bone/70 hover:text-bone">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            <div className="space-y-2 text-bone/70 text-sm">
              <a href={`tel:${site.phoneRaw}`} className="block hover:text-bone">
                {site.phone}
              </a>
              <a
                href={`https://wa.me/${site.whatsappRaw}`}
                target="_blank"
                rel="noreferrer"
                className="block hover:text-bone"
              >
                WhatsApp
              </a>
              <p>{site.area}</p>
              <p>{site.hours}</p>
            </div>
          </div>

          <div className="bg-bone/10 h-px w-full my-8" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-bone/70">
            <p>
              © {currentYear} {site.name} · KvK {site.kvk} · Site door{' '}
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
              href={site.reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-bone underline-offset-2 hover:underline"
            >
              Reviews via {site.reviewSource}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
