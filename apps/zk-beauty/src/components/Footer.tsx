import { MapPin, Phone, Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string };

export default function Footer({ t }: Props) {
  return (
    <footer className="bg-ink text-ivory/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src="/zk-logo.png" alt="" className="h-12 w-auto invert opacity-90" />
              <span className="zk-mark text-xl tracking-[0.32em] uppercase text-ivory">
                ZK Beauty
              </span>
            </div>
            <p className="mt-6 text-sm text-ivory/55 leading-relaxed max-w-sm">{t('footer.tagline')}</p>

            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-medium tracking-[0.18em] uppercase bg-ivory text-ink hover:bg-sand-soft transition-colors"
            >
              {t('nav.book')}
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="md:col-span-3 space-y-2 text-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold-soft mb-4">{t('footer.contact')}</p>
            <p className="flex items-start gap-2.5 text-ivory/75">
              <MapPin size={14} className="mt-0.5 shrink-0 text-gold-soft" />
              {contact.address}
            </p>
            <a href={`tel:${contact.phoneTel}`} className="flex items-center gap-2.5 hover:text-ivory text-ivory/75">
              <Phone size={14} className="shrink-0 text-gold-soft" />
              {contact.phoneDisp}
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-ivory text-ivory/75"
            >
              <MessageCircle size={14} className="shrink-0 text-gold-soft" />
              WhatsApp
            </a>
          </div>

          <div className="md:col-span-4 space-y-2 text-sm">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold-soft mb-4">{t('footer.follow')}</p>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-ivory text-ivory/75"
            >
              <Instagram size={14} className="text-gold-soft" /> @zkbeautynl
            </a>

            <div className="pt-4 space-y-1.5 text-[12px]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold-soft mb-3 mt-4">{t('footer.menu')}</p>
              <a href="#behandelingen" className="block text-ivory/55 hover:text-ivory">{t('nav.services')}</a>
              <a href="#werk"          className="block text-ivory/55 hover:text-ivory">{t('nav.work')}</a>
              <a href="#over"          className="block text-ivory/55 hover:text-ivory">{t('nav.about')}</a>
              <a href="#recensies"     className="block text-ivory/55 hover:text-ivory">{t('nav.reviews')}</a>
              <a href="#bezoek"        className="block text-ivory/55 hover:text-ivory">{t('nav.visit')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-ivory/40">
          <p>{t('footer.rights')}</p>
          <p>Borne · Overijssel</p>
        </div>

        <div className="mt-6 pt-6 border-t border-ivory/10 flex justify-center items-center gap-2 text-xs text-ivory/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-ivory"
          >
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" className="h-5 w-auto" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
