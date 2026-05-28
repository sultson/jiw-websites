import { MapPin, Phone, Instagram, Calendar } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string; onBook: () => void };

export default function Footer({ t, onBook }: Props) {
  return (
    <footer className="bg-ink text-pearl/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-pearl">
              Beauty by <span className="text-rose-soft">Mariya</span>
            </span>
            <p className="mt-4 text-sm text-pearl/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-3">{t('visit.kicker')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-rose-soft" />
              {contact.street}, {contact.postalCity}
            </p>
            <a href={contact.phoneTel} className="flex items-center gap-2 hover:text-pearl">
              <Phone size={14} className="shrink-0 text-rose-soft" />
              {contact.phoneDisplay}
            </a>
            <button
              onClick={onBook}
              className="mt-2 flex items-center gap-2 text-sm hover:text-pearl"
            >
              <Calendar size={14} className="shrink-0 text-rose-soft" />
              {t('nav.book')}
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-rose-soft mb-3">{t('footer.follow')}</p>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-pearl"
            >
              <Instagram size={14} className="text-rose-soft" /> @beauty_bymariya
            </a>
            <div className="pt-2 space-y-1 text-pearl/45 text-xs">
              <a href="#behandelingen" className="block hover:text-pearl/80">{t('nav.services')}</a>
              <a href="#team"          className="block hover:text-pearl/80">{t('nav.team')}</a>
              <a href="#fotos"         className="block hover:text-pearl/80">{t('nav.gallery')}</a>
              <a href="#recensies"     className="block hover:text-pearl/80">{t('nav.reviews')}</a>
              <a href="#bezoek"        className="block hover:text-pearl/80">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-pearl/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-pearl/40">
          <p>{t('footer.rights')}</p>
          <p>Eindhoven · Noord-Brabant</p>
        </div>

        <div className="mt-6 pt-6 border-t border-pearl/10 flex justify-center items-center gap-2 text-xs text-pearl/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-pearl"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
