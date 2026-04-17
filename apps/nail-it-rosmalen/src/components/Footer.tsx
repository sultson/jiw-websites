import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-espresso text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl italic text-cream">
                Nail<span className="text-gold">·</span>It
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-soft/80">
                Rosmalen
              </span>
            </div>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
            <p className="mt-5 script text-3xl text-gold-soft leading-none">
              — {t('about.signature')}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-3">{t('visit.kicker')}</p>
            <a href="tel:+31639211983" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} /> 06 39211983
            </a>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" /> Pr. Margrietstraat, 5246 XS Rosmalen
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/nagelstudio_nail_it/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Instagram size={14} /> Instagram
              </a>
              <a
                href="https://www.facebook.com/nagelstudionailit/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-cream"
              >
                <Facebook size={14} /> Facebook
              </a>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-3">{t('nav.services')}</p>
            <a href="#behandelingen" className="block hover:text-cream">{t('nav.services')}</a>
            <a href="#over-lisa" className="block hover:text-cream">{t('nav.about')}</a>
            <a href="#fotos" className="block hover:text-cream">{t('nav.gallery')}</a>
            <a href="#recensies" className="block hover:text-cream">{t('nav.reviews')}</a>
            <a href="#voorwaarden" className="block hover:text-cream">{t('nav.terms')}</a>
            <a href="#faq" className="block hover:text-cream">{t('nav.faq')}</a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/50">
          <p>{t('footer.rights')}</p>
          <a href="/algemene-voorwaarden" className="hover:text-cream underline-offset-4 hover:underline">
            Algemene voorwaarden
          </a>
          <a href="/privacyverklaring" className="hover:text-cream underline-offset-4 hover:underline">
            Privacyverklaring
          </a>
          <p>KVK 55481434</p>
          <p>Hintham · Rosmalen · sinds 2012</p>
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
