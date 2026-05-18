import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-espresso text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <img
              src="/logo-light.png"
              alt="Nailtique by Linn"
              className="h-20 w-auto"
            />
            <p className="mt-5 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
            <p className="mt-5 script text-4xl text-gold-soft leading-none">
              {t('about.signature')}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-soft mb-3">{t('visit.kicker')}</p>
            <a href="tel:+31628428339" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} /> 06 28428339
            </a>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> Molensteen 13, 6675 GJ Valburg
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/nailtiquebylinn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Instagram size={14} /> Instagram
              </a>
              <a
                href="https://www.facebook.com/p/Nailtique-by-Linn-61572992205896/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Facebook size={14} /> Facebook
              </a>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold-soft mb-3">{t('footer.menu')}</p>
            <a href="#over" className="block hover:text-cream">{t('nav.about')}</a>
            <a href="#behandelingen" className="block hover:text-cream">{t('nav.services')}</a>
            <a href="#werk" className="block hover:text-cream">{t('nav.gallery')}</a>
            <a href="#recensies" className="block hover:text-cream">{t('nav.reviews')}</a>
            <a href="#bezoek" className="block hover:text-cream">{t('nav.visit')}</a>
            <a href="#faq" className="block hover:text-cream">{t('nav.faq')}</a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/50">
          <p>{t('footer.rights')}</p>
          <p>Valburg</p>
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
