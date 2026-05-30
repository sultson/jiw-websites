import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { BrushUnderline, SectionNumber } from './Marks';

type Props = { t: (k: string) => string; onBook: () => void };

const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=Everbest+64,+5741+PM+Beek+en+Donk';
const MAPS_EMBED =
  'https://maps.google.com/maps?q=Everbest+64,+5741+PM+Beek+en+Donk&t=&z=16&ie=UTF8&iwloc=&output=embed';

export default function Visit({ t, onBook }: Props) {
  return (
    <section id="bezoek" className="py-28 md:py-40 bg-shoji">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-4 mb-4 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
            <SectionNumber n={6} />
            <span className="block w-8 h-px bg-sumi/30" />
            <span>{t('visit.kicker')}</span>
            <span className="block w-8 h-px bg-sumi/30" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.06]">
            {t('visit.title')}
          </h2>
          <BrushUnderline className="brush mx-auto mt-5" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Hairline detail list */}
          <div className="space-y-1">
            <Row
              label={t('visit.kicker')}
              primary="Everbest 64"
              secondary="5741 PM Beek en Donk"
              link={MAPS_DIRECTIONS}
              linkLabel={t('visit.directions')}
            />
            <Row
              label={t('visit.phone')}
              primary="06 83434002"
              secondary=""
              link="tel:+31683434002"
              linkLabel="Bel"
              extraLink="https://wa.me/31683434002"
              extraLinkLabel="WhatsApp"
            />
            <Row
              label={t('visit.hours')}
              primary={t('visit.hoursLine')}
              secondary=""
            />

            <div className="pt-8 flex flex-wrap gap-4">
              <button onClick={onBook} className="btn-sumi group">
                {t('visit.book')}
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a
                href="https://wa.me/31683434002"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Muted map */}
          <div className="relative">
            <div
              className="paper-mount overflow-hidden"
              style={{ padding: 8 }}
            >
              <div className="overflow-hidden">
                <iframe
                  title="Salon LaZoa op Google Maps"
                  src={MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 420, filter: 'grayscale(0.85) contrast(0.94) sepia(0.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-sumi/55">
              <span className="block w-5 h-px bg-sumi/40" />
              <span>51.5460° N · 5.6350° E</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  primary,
  secondary,
  link,
  linkLabel,
  extraLink,
  extraLinkLabel,
}: {
  label: string;
  primary: string;
  secondary?: string;
  link?: string;
  linkLabel?: string;
  extraLink?: string;
  extraLinkLabel?: string;
}) {
  return (
    <div className="border-t border-sumi/15 first:border-t-0 py-5 md:py-6 grid grid-cols-1 sm:grid-cols-[128px_1fr] gap-2 sm:gap-6 sm:items-baseline">
      <span className="text-[10.5px] uppercase tracking-[0.28em] text-sumi/55 sm:pt-1">
        {label}
      </span>
      <div className="space-y-1">
        <p className="font-display text-xl md:text-2xl text-sumi leading-snug tracking-[-0.005em]">
          {primary}
        </p>
        {secondary && (
          <p className="text-[13.5px] text-sumi/65 leading-relaxed">{secondary}</p>
        )}
        {link && linkLabel && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-2 text-[11px] uppercase tracking-[0.22em]">
            <a
              href={link}
              target={link.startsWith('http') ? '_blank' : undefined}
              rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 text-sumi/75 hover:text-hinoki transition-colors group"
            >
              {linkLabel}
              <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {extraLink && extraLinkLabel && (
              <a
                href={extraLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sumi/75 hover:text-hinoki transition-colors group"
              >
                <MessageCircle size={12} />
                {extraLinkLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
