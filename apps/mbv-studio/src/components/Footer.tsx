import { MapPin, Phone, Mail, Instagram } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-mocha text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="block font-display text-3xl tracking-[0.12em] text-cream">MBV</span>
            <span className="block text-[9px] tracking-[0.42em] uppercase text-rose-soft mt-1">
              Nail Art Studio
            </span>
            <p className="mt-5 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-3">{t('visit.kicker')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-rose-soft" />
              Gijzenveld 4, 4817 ZE Breda
            </p>
            <a href="tel:+31658913113" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-rose-soft" />
              +31 6 58913113
            </a>
            <a href="mailto:vkolibaeva@gmail.com" className="flex items-center gap-2 hover:text-cream break-all">
              <Mail size={14} className="shrink-0 text-rose-soft" />
              vkolibaeva@gmail.com
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-3">{t('footer.follow')}</p>
            <a
              href="https://www.instagram.com/studio.mbv/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Instagram size={14} className="text-rose-soft" /> @studio.mbv
            </a>
            <div className="pt-3 space-y-1 text-cream/40 text-xs">
              <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-2">{t('footer.explore')}</p>
              <a href="#services" className="block hover:text-cream/70">{t('nav.services')}</a>
              <a href="#work"     className="block hover:text-cream/70">{t('nav.gallery')}</a>
              <a href="#reviews"  className="block hover:text-cream/70">{t('nav.reviews')}</a>
              <a href="#visit"    className="block hover:text-cream/70">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.region')}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-cream"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
