import { MapPin, Phone, Mail, Instagram } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-ink text-ivory/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl tracking-[0.06em] uppercase text-ivory">Clinic 22</span>
            <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-ivory/55">Huidtherapie</p>
            <p className="mt-5 text-sm text-ivory/55 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/55 mb-3">{t('visit.kicker')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-ivory/55" strokeWidth={1.5} />
              <span>Verlengde Spiegelmakerstraat 8<br />2645 LT Delfgauw</span>
            </p>
            <a href="tel:+31613372711" className="flex items-center gap-2 hover:text-ivory">
              <Phone size={14} className="shrink-0 text-ivory/55" strokeWidth={1.5} />
              06 13 37 27 11
            </a>
            <a href="mailto:info@clinic22.nl" className="flex items-center gap-2 hover:text-ivory">
              <Mail size={14} className="shrink-0 text-ivory/55" strokeWidth={1.5} />
              info@clinic22.nl
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ivory/55 mb-3">{t('footer.follow')}</p>
            <a
              href="https://www.instagram.com/clinic22_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-ivory"
            >
              <Instagram size={14} className="text-ivory/55" strokeWidth={1.5} /> @clinic22_
            </a>
            <a
              href="https://www.treatwell.nl/salon/clinic-22-huidtherapie/"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-ivory"
            >
              Treatwell
            </a>
            <div className="pt-3 space-y-1 text-ivory/40 text-xs">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ivory/40 mb-1">{t('footer.nav')}</p>
              <a href="#expertise"     className="block hover:text-ivory/70">{t('nav.expertise')}</a>
              <a href="#behandelingen" className="block hover:text-ivory/70">{t('nav.services')}</a>
              <a href="#werk"          className="block hover:text-ivory/70">{t('nav.gallery')}</a>
              <a href="#recensies"     className="block hover:text-ivory/70">{t('nav.reviews')}</a>
              <a href="#bezoek"        className="block hover:text-ivory/70">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-ivory/45">
          <p>{t('footer.rights')}</p>
          <p>Delfgauw · Zuid-Holland</p>
        </div>

        <div className="mt-6 pt-6 border-t border-ivory/10 flex justify-center items-center gap-2 text-xs text-ivory/45">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-ivory"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
