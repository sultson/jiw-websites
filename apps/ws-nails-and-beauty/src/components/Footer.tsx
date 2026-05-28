import { MapPin, Phone, Instagram } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-plum text-porcelain/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-porcelain">
              WS <span className="text-rose-soft">Nails</span> & Beauty
            </span>
            <p className="mt-4 text-sm text-porcelain/60 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-3">Bezoek</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-rose-soft" />
              Blauwhoefseweg 12, 4416 RC Kruiningen
            </p>
            <a href="tel:+31616220569" className="flex items-center gap-2 hover:text-porcelain">
              <Phone size={14} className="shrink-0 text-rose-soft" />
              06 16220569
            </a>
            <a
              href="https://wa.me/31616220569"
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1 text-sm text-rose-soft hover:text-porcelain"
            >
              WhatsApp Wendy
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-3">{t('footer.follow')}</p>
            <a
              href="https://www.instagram.com/ws.n4ils/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-porcelain"
            >
              <Instagram size={14} className="text-rose-soft" /> @ws.n4ils
            </a>
            <div className="pt-2 space-y-1 text-porcelain/40 text-xs">
              <a href="#werk"    className="block hover:text-porcelain/70">{t('nav.work')}</a>
              <a href="#aanbod"  className="block hover:text-porcelain/70">{t('nav.aanbod')}</a>
              <a href="#wendy"   className="block hover:text-porcelain/70">{t('nav.about')}</a>
              <a href="#bezoek"  className="block hover:text-porcelain/70">{t('nav.visit')}</a>
              <a href="#reviews" className="block hover:text-porcelain/70">{t('nav.reviews')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-porcelain/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-porcelain/40">
          <p>{t('footer.rights')}</p>
          <p>Kruiningen · Zeeland</p>
        </div>

        <div className="mt-6 pt-6 border-t border-porcelain/10 flex justify-center items-center gap-2 text-xs text-porcelain/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-porcelain"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>{t('footer.byJiw')}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
