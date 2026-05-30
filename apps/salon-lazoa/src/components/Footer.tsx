import { ArrowUpRight, Instagram, MessageCircle, Phone } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Footer({ t, onBook }: Props) {
  return (
    <footer className="bg-sumi text-shoji/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12 md:pt-28 md:pb-16">
        {/* Top — large signature line */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 pb-16 md:pb-20 border-b border-shoji/10">
          <div className="md:col-span-6">
            <img
              src="/logo.png"
              alt="Salon LaZoa"
              className="h-10 w-auto opacity-90 mix-blend-screen invert"
            />
            <h3 className="mt-8 font-display text-3xl md:text-[2.6rem] leading-[1.1] text-shoji max-w-[16ch]">
              {t('footer.tagline')}
            </h3>
            <button onClick={onBook} className="btn-shoji mt-10 group">
              {t('footer.book')}
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="md:col-span-3 space-y-4">
            <p className="text-[10.5px] uppercase tracking-[0.32em] text-shoji/50">
              {t('visit.kicker')}
            </p>
            <div className="space-y-2 text-[14px]">
              <p className="text-shoji/90 leading-relaxed">
                Everbest 64<br />5741 PM Beek en Donk
              </p>
              <a href="tel:+31683434002" className="flex items-center gap-2 hover:text-hinoki-soft transition-colors">
                <Phone size={12} className="text-shoji/55" />
                06 83434002
              </a>
              <a
                href="https://wa.me/31683434002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-hinoki-soft transition-colors"
              >
                <MessageCircle size={12} className="text-shoji/55" />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <p className="text-[10.5px] uppercase tracking-[0.32em] text-shoji/50">
              {t('footer.follow')}
            </p>
            <a
              href="https://www.instagram.com/salon_lazoa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[14px] hover:text-hinoki-soft transition-colors"
            >
              <Instagram size={12} className="text-shoji/55" />
              @salon_lazoa
            </a>
            <div className="pt-4 space-y-1.5 text-[12px] uppercase tracking-[0.16em] text-shoji/45">
              <a href="#over"          className="block hover:text-shoji">{t('nav.about')}</a>
              <a href="#behandelingen" className="block hover:text-shoji">{t('nav.services')}</a>
              <a href="#werk"          className="block hover:text-shoji">{t('nav.gallery')}</a>
              <a href="#recensies"     className="block hover:text-shoji">{t('nav.reviews')}</a>
              <a href="#bezoek"        className="block hover:text-shoji">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        {/* Bottom — colophon */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-shoji/40">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.region')}</p>
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-shoji/75 transition-colors"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-4 w-auto opacity-70" />
            <span className="normal-case tracking-normal text-[12px]">
              door jouwidealewebsite.nl
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
