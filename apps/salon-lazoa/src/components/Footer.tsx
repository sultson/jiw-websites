import { MapPin, Phone, Instagram, MessageCircle, Calendar } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Footer({ t, onBook }: Props) {
  return (
    <footer className="bg-ink text-paper/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <img
              src="/logo.png"
              alt="Salon LaZoa"
              className="h-10 w-auto opacity-90 mix-blend-screen invert"
            />
            <p className="mt-5 text-sm text-paper/55 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
            <button onClick={onBook} className="mt-6 btn-champagne text-sm">
              <Calendar size={14} />
              {t('footer.book')}
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-champagne-soft mb-3">
              {t('visit.kicker')}
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-champagne-soft" />
              Everbest 64, 5741 PM Beek en Donk
            </p>
            <a href="tel:+31683434002" className="flex items-center gap-2 hover:text-paper">
              <Phone size={14} className="shrink-0 text-champagne-soft" />
              06 83434002
            </a>
            <a
              href="https://wa.me/31683434002"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-paper"
            >
              <MessageCircle size={14} className="shrink-0 text-champagne-soft" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.22em] text-champagne-soft mb-3">
              {t('footer.follow')}
            </p>
            <a
              href="https://www.instagram.com/salon_lazoa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-paper"
            >
              <Instagram size={14} className="text-champagne-soft" /> @salon_lazoa
            </a>
            <div className="pt-3 space-y-1 text-paper/40 text-xs">
              <a href="#over"          className="block hover:text-paper/70">{t('nav.about')}</a>
              <a href="#behandelingen" className="block hover:text-paper/70">{t('nav.services')}</a>
              <a href="#werk"          className="block hover:text-paper/70">{t('nav.gallery')}</a>
              <a href="#recensies"     className="block hover:text-paper/70">{t('nav.reviews')}</a>
              <a href="#bezoek"        className="block hover:text-paper/70">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-paper/40">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.region')}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-paper/10 flex justify-center items-center gap-2 text-xs text-paper/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-paper"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
