import { MapPin, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-ink text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.webp" alt="" className="h-10 w-10" />
              <span className="font-serif text-xl text-cream">
                Nagelstyliste <span className="script text-pink-soft text-2xl">Monique</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-pink-soft mb-3">{t('footer.contact')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-pink-soft" />
              Eeneind 42, 5674 VP Nuenen
            </p>
            <a href="tel:+31631674344" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-pink-soft" />
              06 31674344
            </a>
            <a
              href="https://wa.me/31631674344"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <MessageCircle size={14} className="shrink-0 text-pink-soft" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-pink-soft mb-3">{t('footer.follow')}</p>
            <a
              href="https://www.instagram.com/nagelstyliste_monique/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Instagram size={14} className="text-pink-soft" /> @nagelstyliste_monique
            </a>
            <a
              href="https://www.facebook.com/p/Nagelstyliste-Monique-100057079914787/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Facebook size={14} className="text-pink-soft" /> Nagelstyliste Monique
            </a>
            <div className="pt-2 space-y-1 text-cream/40 text-xs">
              <a href="#over"          className="block hover:text-cream/70">{t('nav.about')}</a>
              <a href="#behandelingen" className="block hover:text-cream/70">{t('nav.services')}</a>
              <a href="#fotos"         className="block hover:text-cream/70">{t('nav.gallery')}</a>
              <a href="#bezoek"        className="block hover:text-cream/70">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} Nagelstyliste Monique. {t('footer.rights')}</p>
          <p>Nuenen · Noord-Brabant</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-cream"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>{t('footer.madeby')}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
