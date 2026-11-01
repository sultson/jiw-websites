import { Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { SITE } from '../lib/site';

const navLinks = [
  { id: 'neuropathie', label: 'Wat is neuropathie' },
  { id: 'clienten', label: 'Voor cliënten' },
  { id: 'overzicht', label: 'Therapeut vinden' },
  { id: 'therapeuten', label: 'Voor therapeuten' },
  { id: 'ontstaan', label: 'Ontstaan' },
  { id: 'contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-terra-ink text-cream/80">
      <div className="shell-wide py-14 sm:py-16 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-display text-[23px] text-cream">Voetreflexologie bij neuropathie</div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-rose-soft font-bold mt-1.5">
            Landelijk netwerk
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-cream/65 max-w-xs">
            Een aanvullende behandeling gericht op ontspanning en het ondersteunen van welzijn bij
            neuropathie. Geen vervanging van de reguliere zorg.
          </p>
        </div>

        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-cream/50">Op deze pagina</div>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-[15px] text-cream/80 hover:text-cream transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-cream/50">Contact</div>
          <ul className="mt-4 space-y-3 text-[15px]">
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
            href={SITE.mainSite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-rose-soft hover:text-cream transition-colors"
          >
            lydiavanderbie.nl
            <ArrowUpRight size={14} strokeWidth={2.4} />
          </a>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="shell-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-cream/55">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>© {year} Lydia van der Bie</span>
            <span className="hidden sm:inline">·</span>
            <span>KvK {SITE.kvk}</span>
            <span className="hidden sm:inline">·</span>
            <a
              href={`${SITE.mainSite}/privacy-policy`}
              className="hover:text-cream transition-colors"
            >
              Privacyverklaring
            </a>
          </div>
          <div>
            Website door{' '}
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
