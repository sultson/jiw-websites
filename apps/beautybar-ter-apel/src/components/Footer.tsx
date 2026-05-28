import { Phone, MapPin, Facebook } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-ink text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl text-cream">
                Beautybar <span className="text-rose italic">Ter Apel</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
            <p className="mt-5 font-serif text-2xl text-champagne-soft italic leading-none">
              Charrety Klasen
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cream/50">
              Magnetic Ambassador
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-rose-soft mb-3">
              {t('visit.kicker')}
            </p>
            <a href="tel:+31623800854" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} /> 06 23800854
            </a>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> Zanglijster 15, 9561 CA Ter Apel
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.facebook.com/people/BeautyBar-Ter-Apel/61552088251660/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Facebook size={14} /> Facebook
              </a>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-rose-soft mb-3">
              {t('nav.services')}
            </p>
            <a href="#over" className="block hover:text-cream">{t('nav.about')}</a>
            <a href="#werk" className="block hover:text-cream">{t('nav.gallery')}</a>
            <a href="#behandelingen" className="block hover:text-cream">{t('nav.services')}</a>
            <a href="#recensies" className="block hover:text-cream">{t('nav.reviews')}</a>
            <a href="#bezoek" className="block hover:text-cream">{t('nav.visit')}</a>
            <a href="#faq" className="block hover:text-cream">{t('nav.faq')}</a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/50">
          <p>{t('footer.rights')}</p>
          <p>Ter Apel</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/50">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-cream"
          >
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
