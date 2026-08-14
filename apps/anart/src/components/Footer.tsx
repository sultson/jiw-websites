import { MapPin, Phone, Instagram } from 'lucide-react';

type Props = { t: (k: string) => string };

// Op subpagina's (zoals /algemene-voorwaarden) moeten de ankers terug naar de homepage wijzen.
function homePrefix() {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.replace(/\/+$/, '') === '' ? '' : '/';
}

export default function Footer({ t }: Props) {
  const prefix = homePrefix();

  return (
    <footer className="bg-espresso text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-cream">
              An<span className="text-gold-soft">Art</span>
              <span className="text-cream/40 ml-1 text-base font-sans font-light">Studio</span>
            </span>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">{t('visit.kicker')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold-soft" />
              Peperstraat 14d, 5171 EC Kaatsheuvel
            </p>
            <a href="tel:+31633890157" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-gold-soft" />
              06 338 90 157
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">{t('footer.follow')}</p>
            <a
              href="https://www.instagram.com/annart.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Instagram size={14} className="text-gold-soft" /> @annart.nl
            </a>
            <a
              href="https://www.instagram.com/martawel_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Instagram size={14} className="text-gold-soft" /> @martawel_
            </a>
<div className="pt-2 space-y-1 text-cream/50 text-xs">
              <a href={`${prefix}#behandelingen`} className="block hover:text-cream">{t('nav.services')}</a>
              <a href={`${prefix}#kobido`}        className="block hover:text-cream">{t('nav.kobido')}</a>
              <a href={`${prefix}#fotos`}         className="block hover:text-cream">{t('nav.gallery')}</a>
              <a href={`${prefix}#recensies`}     className="block hover:text-cream">{t('nav.reviews')}</a>
              <a href={`${prefix}#voorwaarden`}   className="block hover:text-cream">{t('nav.terms')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>{t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <a
              href="/algemene-voorwaarden"
              className="hover:text-cream underline-offset-4 hover:underline"
            >
              {t('footer.terms')}
            </a>
            <span>Kaatsheuvel · Noord-Brabant</span>
          </div>
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
