import { Calendar, Instagram, Facebook, Phone, MapPin } from 'lucide-react';
import { site, hours } from '../data/site';
import Wordmark from './Wordmark';

type Props = { t: (k: string) => string; onBook: () => void };

const LINKS = [
  ['nav.about', '#about'],
  ['nav.services', '#services'],
  ['nav.work', '#work'],
  ['nav.reviews', '#reviews'],
  ['nav.visit', '#visit'],
] as const;

export default function Footer({ t, onBook }: Props) {
  const year = 2026;
  return (
    <footer className="relative bg-ink text-blush/85">
      {/* CTA band */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div
          className="relative -mt-px rounded-[2rem] px-7 py-10 md:px-14 md:py-14 text-center overflow-hidden"
          style={{ background: 'linear-gradient(140deg,#8a4a55,#7d3a48 55%,#6a2f3c)' }}
        >
          <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent" />
          <h2 className="relative font-serif text-3xl md:text-4xl text-[#fceeee]">
            {t('book.title')}
          </h2>
          <p className="relative mt-3 text-blush/80 max-w-md mx-auto">{t('book.sub')}</p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={onBook}
              className="inline-flex items-center gap-2 rounded-full bg-[#fceeee] text-wine px-6 py-3.5 text-sm font-medium hover:bg-white transition-colors"
            >
              <Calendar size={18} />
              {t('foot.book')}
            </button>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blush/35 text-[#fceeee] px-6 py-3.5 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              {t('fab.whats')}
            </a>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Wordmark tone="light" />
            <p className="mt-4 font-serif italic text-lg text-blush/75">{t('foot.tag')}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid place-items-center w-10 h-10 rounded-full border border-blush/20 hover:bg-white/10 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid place-items-center w-10 h-10 rounded-full border border-blush/20 hover:bg-white/10 transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-rosegold">{t('foot.nav')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LINKS.map(([k, href]) => (
                <li key={href}>
                  <a href={href} className="text-blush/75 hover:text-blush transition-colors">
                    {t(k)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-rosegold">{t('foot.contact')}</h3>
            <ul className="mt-4 space-y-3 text-sm text-blush/75">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-rosegold" />
                <span>
                  {site.street}
                  <br />
                  {site.postalCode} {site.city}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-rosegold" />
                <a href={`tel:${site.phoneE164}`} className="hover:text-blush">
                  {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-rosegold">{t('foot.hours')}</h3>
            <ul className="mt-4 space-y-1.5 text-sm">
              {hours.map((h) => (
                <li key={h.key} className="flex justify-between gap-4">
                  <span className="text-blush/65">{t(h.key)}</span>
                  <span className={h.value ? 'text-blush/90' : 'text-blush/45'}>
                    {h.value ?? t('visit.closed')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-blush/12 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blush/55">
          <p>© {year} {site.name}. {t('foot.rights')}</p>
          <p>{site.owner} · {site.city}</p>
        </div>
      </div>
    </footer>
  );
}
