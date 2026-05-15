import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { SITE } from '../lib/site';

type Props = {
  t: (k: string) => string;
  onIntake: () => void;
};

const serviceKeys = [
  'svc.verbouw',
  'svc.badkamer',
  'svc.keuken',
  'svc.dak',
  'svc.kozijnen',
  'svc.maatwerk',
];

const bedrijfLinks = [
  { key: 'nav.werkwijze', href: '#werkwijze' },
  { key: 'nav.projecten', href: '#projecten' },
  { key: 'nav.reviews', href: '#reviews' },
  { key: 'nav.over', href: '#over' },
  { key: 'nav.contact', href: '#contact' },
];

const towns = ['Breda', 'Oosterhout', 'Etten-Leur', 'Tilburg', 'Roosendaal', 'Prinsenbeek'];

export default function Footer({ t, onIntake }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-cobalt-ink text-white/70">
      <div className="shell py-16 sm:py-20">
        {/* Top: logo + tagline + about */}
        <div className="max-w-md">
          <span className="inline-flex bg-white rounded-xl px-3.5 py-2.5">
            <img
              src="/logo/thijs-full.png"
              alt={SITE.name}
              className="h-9 w-auto"
            />
          </span>
          <p className="mt-5 text-[15px] font-semibold text-white">
            {t('ft.tagline')}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-white/55">
            {t('ft.about')}
          </p>
        </div>

        {/* Columns */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-10 border-t border-white/10 pt-12">
          {/* Diensten */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white mb-4">
              {t('ft.colDiensten')}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              {serviceKeys.map((k) => (
                <li key={k}>
                  <a
                    href="#diensten"
                    className="hover:text-white transition-colors"
                  >
                    {t(k)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Bedrijf */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white mb-4">
              {t('ft.colBedrijf')}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              {bedrijfLinks.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Werkgebied */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white mb-4">
              {t('ft.colWerkgebied')}
            </h3>
            <ul className="space-y-2.5 text-[14px]">
              {towns.map((town) => (
                <li key={town}>{town}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-white mb-4">
              {t('ft.colContact')}
            </h3>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone size={15} strokeWidth={2.4} className="text-cobalt-bright" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin
                  size={15}
                  strokeWidth={2.4}
                  className="text-cobalt-bright mt-0.5 shrink-0"
                />
                <span>
                  {SITE.street}
                  <br />
                  {SITE.postal} {SITE.city}
                </span>
              </li>
              <li className="text-white/45">KvK {SITE.kvk}</li>
            </ul>
            <button
              type="button"
              onClick={onIntake}
              className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-white hover:gap-3 transition-all"
            >
              {t('nav.cta')}
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[13px] text-white/45">
          <span>
            &copy; {year} {SITE.name}. {t('ft.rights')}
          </span>
          <span>KvK {SITE.kvk}</span>
        </div>
      </div>
    </footer>
  );
}
