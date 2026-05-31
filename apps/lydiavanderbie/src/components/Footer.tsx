import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { SITE } from '../lib/site';

type Props = { t: (k: string) => string; onHome: boolean };

const navLinks = [
  { id: 'opleidingen', k: 'nav.opleidingen' },
  { id: 'behandelingen', k: 'nav.behandelingen' },
  { id: 'agenda', k: 'nav.agenda' },
  { id: 'over', k: 'nav.over' },
  { id: 'contact', k: 'nav.contact' },
];

export default function Footer({ t, onHome }: Props) {
  const href = (id: string) => `${onHome ? '' : '/'}#${id}`;
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-terra-ink text-cream/80">
      <div className="shell-wide py-14 sm:py-16 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="font-display text-[24px] text-cream">Lydia van der Bie</div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-rose-soft font-bold mt-1">
            Opleidingen & behandelingen
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-cream/65 max-w-xs">{t('footer.tagline')}</p>
        </div>

        {/* Nav */}
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-cream/50">{t('footer.nav')}</div>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={href(l.id)} className="text-[15px] text-cream/80 hover:text-cream transition-colors">
                  {t(l.k)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-cream/50">{t('footer.contactTitle')}</div>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-start gap-2.5 text-cream/80 hover:text-cream transition-colors">
                <Mail size={16} className="mt-0.5 shrink-0 text-rose-soft" />
                <span className="break-all">{SITE.email}</span>
              </a>
            </li>
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-2.5 text-cream/80 hover:text-cream transition-colors">
                <Phone size={16} className="shrink-0 text-rose-soft" />
                <span className="tnum">{SITE.phoneDisplay}</span>
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-cream/80">
              <MapPin size={16} className="mt-0.5 shrink-0 text-rose-soft" />
              <span>{SITE.locationLine}</span>
            </li>
          </ul>
          <a
            href={SITE.onlineAcademy}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-rose-soft hover:text-cream transition-colors"
          >
            {t('online.cta')}
            <ArrowUpRight size={14} strokeWidth={2.4} />
          </a>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="shell-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-cream/55">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>© {year} Lydia van der Bie</span>
            <span className="hidden sm:inline">·</span>
            <span>{t('footer.kvk')} {SITE.kvk}</span>
            <span className="hidden sm:inline">·</span>
            <a href="/privacy-policy" className="hover:text-cream transition-colors">{t('footer.privacy')}</a>
            <a href="/algemene-voorwaarden" className="hover:text-cream transition-colors">{t('footer.terms')}</a>
          </div>
          <div>
            {t('footer.madeBy')}{' '}
            <a
              href="https://jouwidealewebsite.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-cream/75 hover:text-cream transition-colors"
            >
              Jouw Ideale Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
