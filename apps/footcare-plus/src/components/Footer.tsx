import { MapPin, Phone, MessageCircle, Facebook, ExternalLink } from 'lucide-react';

type Props = { t: (k: string) => string };

const PHONE_TEL = 'tel:+31648490004';
const PHONE_WA  = 'https://wa.me/31648490004';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100087431473852';
const PROVOET_URL =
  'https://www.provoet.nl/professionals/footcare-wijckel-58466-120132';

export default function Footer({ t }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/85">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <span className="font-serif text-2xl text-cream inline-flex items-baseline gap-0.5">
              FootCare
              <span className="text-sage">+</span>
            </span>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-sage mb-3">
              Praktijk
            </p>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-sage" />
              Menno van Coehoornweg 15<br />8563 AD Wijckel
            </p>
            <a href={PHONE_TEL} className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-sage" />
              06 48490004
            </a>
            <a
              href={PHONE_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <MessageCircle size={14} className="shrink-0 text-sage" />
              WhatsApp
            </a>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-sage mb-3">
              {t('footer.follow')}
            </p>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Facebook size={14} className="text-sage" />
              Pedicurepraktijk Footcare
            </a>
            <a
              href={PROVOET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <ExternalLink size={14} className="text-sage" />
              KRP-registratie via Provoet
            </a>
            <div className="pt-3 space-y-1 text-cream/40 text-xs">
              <a href="#behandelingen"  className="block hover:text-cream/70">{t('nav.services')}</a>
              <a href="#specialisaties" className="block hover:text-cream/70">{t('nav.specialisaties')}</a>
              <a href="#praktijk"       className="block hover:text-cream/70">{t('nav.werk')}</a>
              <a href="#bezoek"         className="block hover:text-cream/70">{t('nav.bezoek')}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>© {year} Pedicurepraktijk FootCare+. Alle rechten voorbehouden.</p>
          <p>{t('footer.region')}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-cream/10 flex justify-center items-center gap-2 text-xs text-cream/40">
          <a
            href="https://jouwidealewebsite.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-cream"
          >
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
