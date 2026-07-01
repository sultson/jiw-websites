import { MapPin, Phone, MessageCircle, Mail, Facebook } from 'lucide-react';
import { hours } from '../data/hours';

type Props = { t: (k: string) => string; lang: 'nl' | 'en' };

export default function Footer({ t, lang }: Props) {
  return (
    <footer className="bg-ink text-cream/85">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="Logo Hoeve de Kooipolder Pedicuresalon"
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-serif text-xl text-cream leading-tight">
                Hoeve de Kooipolder
              </span>
            </div>
            <p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-lilac mb-3">
              {t('footer.contactTitle')}
            </p>
            <a href="tel:+31628577711" className="flex items-center gap-2 hover:text-cream">
              <Phone size={14} className="shrink-0 text-lilac" aria-hidden="true" />
              06 28 57 77 11
            </a>
            <a
              href="https://wa.me/31628577711"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <MessageCircle size={14} className="shrink-0 text-lilac" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href="mailto:hoevedekooipolder@gmail.com"
              className="flex items-center gap-2 hover:text-cream break-all"
            >
              <Mail size={14} className="shrink-0 text-lilac" aria-hidden="true" />
              hoevedekooipolder@gmail.com
            </a>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-lilac" aria-hidden="true" />
              Zeedijk 16, 3329 LC Dordrecht
            </p>
          </div>

          <div className="text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-lilac mb-3">
              {t('footer.hoursTitle')}
            </p>
            <ul className="space-y-1.5">
              {hours.map(row => (
                <li key={row.dayNl} className="flex justify-between gap-4 text-cream/70">
                  <span>{lang === 'en' ? row.dayEn : row.dayNl}</span>
                  <span className="tabular-nums">{row.hours ?? t('visit.closed')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-lilac mb-3">
              {t('footer.followTitle')}
            </p>
            <a
              href="https://www.facebook.com/p/Hoeve-De-Kooipolder-Pedicuresalon-100094300916991/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream"
            >
              <Facebook size={14} className="text-lilac" aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-cream/40">
          <p>© 2026 Hoeve de Kooipolder Pedicuresalon</p>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
