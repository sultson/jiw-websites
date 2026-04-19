import { Phone, Mail, MapPin } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-espresso text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center">
              <span className="font-serif text-2xl text-cream">
                mykim<span className="text-gold">nails</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-3">{t('visit.kicker')}</p>
            <a href="tel:+31634899263" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} /> 06 34899263
            </a>
            <a href="mailto:Mykimbeautynailz@hotmail.com" className="flex items-center gap-2 hover:text-cream break-all">
              <Mail size={14} /> Mykimbeautynailz@hotmail.com
            </a>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> Zwanenveld 9040, 6538 SB Nijmegen
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-3">{t('nav.services')}</p>
            <a href="#behandelingen" className="block hover:text-cream">{t('nav.services')}</a>
            <a href="#biab" className="block hover:text-cream">{t('nav.biab')}</a>
            <a href="#fotos" className="block hover:text-cream">{t('nav.gallery')}</a>
            <a href="#faq" className="block hover:text-cream">{t('nav.faq')}</a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/50">
          <p>{t('footer.rights')}</p>
          <p>Winkelcentrum Dukenburg · Nijmegen</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/50">
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
