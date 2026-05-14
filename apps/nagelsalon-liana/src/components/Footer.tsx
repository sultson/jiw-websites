import { MapPin, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-espresso text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-cream">
              Nagelsalon <span className="text-gold-soft">Liana</span>
            </span>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">{t('footer.tagline')}</p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">{t('visit.kicker')}</p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold-soft" />
              {contact.fullAddress}
            </p>
            <a href={`tel:${contact.phoneTel}`} className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-gold-soft" />
              {contact.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${contact.phoneWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <MessageCircle size={14} className="shrink-0 text-gold-soft" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-soft mb-3">{t('footer.follow')}</p>
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Instagram size={14} className="text-gold-soft" /> @{contact.instagram}
            </a>
            <a
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Facebook size={14} className="text-gold-soft" /> Nagelsalon Liana
            </a>
            <div className="pt-2 space-y-1 text-cream/40 text-xs">
              <a href="#behandelingen"  className="block hover:text-cream/70">{t('nav.services')}</a>
              <a href="#specialiteiten" className="block hover:text-cream/70">{t('nav.special')}</a>
              <a href="#fotos"          className="block hover:text-cream/70">{t('nav.gallery')}</a>
              <a href="#recensies"      className="block hover:text-cream/70">{t('nav.reviews')}</a>
              <a href="#bezoek"         className="block hover:text-cream/70">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>{t('footer.rights')}</p>
          <p>Emmen · Drenthe</p>
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
