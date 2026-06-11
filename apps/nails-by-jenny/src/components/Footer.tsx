import { MapPin, Phone, Mail, Facebook } from 'lucide-react';
import { ADDRESS_LINE, ADDRESS_CITY, EMAIL, FACEBOOK_URL, PHONE_DISPLAY, TEL_URL } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-espresso text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-cream">
              Nails by <span className="text-gold-soft">Jenny</span>
            </span>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">{t('nav.visit')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold-soft" />
              {ADDRESS_LINE}, {ADDRESS_CITY}
            </p>
            <a href={TEL_URL} className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-gold-soft" />
              {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-cream">
              <Mail size={14} className="shrink-0 text-gold-soft" />
              {EMAIL}
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">{t('footer.follow')}</p>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Facebook size={14} className="text-gold-soft" /> Nails by Jenny
            </a>
            <div className="pt-2 space-y-1 text-cream/40 text-xs">
              <a href="#behandelingen" className="block hover:text-cream/70">{t('nav.services')}</a>
              <a href="#fotos"         className="block hover:text-cream/70">{t('nav.gallery')}</a>
              <a href="#recensies"     className="block hover:text-cream/70">{t('nav.reviews')}</a>
              <a href="#faq"           className="block hover:text-cream/70">FAQ</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>{t('footer.rights')}</p>
          <p>Etten-Leur · Noord-Brabant</p>
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
