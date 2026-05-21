import { Instagram, Facebook, Phone, Mail } from 'lucide-react';
import type { Route } from '../hooks/useRoute';

type Props = {
  t: (k: string) => string;
  go: (r: Route) => void;
};

function TikTok({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.32 6.69a6.4 6.4 0 0 1-4.06-1.45v9.86a5.79 5.79 0 1 1-5.79-5.79c.34 0 .68.03 1.01.09v3a2.85 2.85 0 1 0 2 2.7V2h2.91a4.4 4.4 0 0 0 4.05 4.35v2.34l-.12.0z" />
    </svg>
  );
}

export default function Footer({ t, go }: Props) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-cocoa text-bone">
      {/* Massive watermark logo */}
      <img
        src="/logo-light.png?v=20260520"
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute -right-[10%] -bottom-[20%] w-[90vw] max-w-[1100px] opacity-[0.05]"
      />
      {/* Soft accent glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-sand/8 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-24 lg:pt-32 pb-16 grid md:grid-cols-12 gap-12 lg:gap-16">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <img src="/logo-light.png?v=20260520" alt="Maefluence" className="h-10 w-auto" width={40} height={40} />
            <span className="font-display text-3xl text-bone">Maefluence</span>
          </div>
          <p className="mt-8 max-w-md text-lg text-bone/75 italic font-serif leading-snug">
            {t('footer.tagline')}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <a aria-label="Instagram" href="https://www.instagram.com/Maefluence.nl" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-bone/15 hover:bg-bone hover:text-cocoa transition">
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <a aria-label="TikTok" href="https://www.tiktok.com/@maefluence.nl" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-bone/15 hover:bg-bone hover:text-cocoa transition">
              <TikTok size={16} />
            </a>
            <a aria-label="Facebook" href="https://www.facebook.com/maefluence.nl/" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-bone/15 hover:bg-bone hover:text-cocoa transition">
              <Facebook size={16} strokeWidth={1.5} />
            </a>
            <a aria-label="WhatsApp" href="https://api.whatsapp.com/send?phone=615054028" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-bone/15 hover:bg-bone hover:text-cocoa transition">
              <Phone size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.32em] text-sand">Menu</p>
          <ul className="mt-6 space-y-3 text-sm">
            <li><button onClick={() => go('home')} className="text-bone/75 hover:text-bone transition">{t('nav.home')}</button></li>
            <li><button onClick={() => go('about')} className="text-bone/75 hover:text-bone transition">{t('nav.about')}</button></li>
            <li><button onClick={() => go('services')} className="text-bone/75 hover:text-bone transition">{t('nav.services')}</button></li>
            <li><button onClick={() => go('contact')} className="text-bone/75 hover:text-bone transition">{t('nav.contact')}</button></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[10px] uppercase tracking-[0.32em] text-sand">{t('nav.contact')}</p>
          <ul className="mt-6 space-y-4 text-sm text-bone/85">
            <li>
              <a href="mailto:Sofiamae3103@gmail.com" className="inline-flex items-center gap-3 hover:text-bone transition">
                <Mail size={14} strokeWidth={1.5} className="text-sand" /> Sofiamae3103@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+31615054028" className="inline-flex items-center gap-3 hover:text-bone transition">
                <Phone size={14} strokeWidth={1.5} className="text-sand" /> +31 6 15054028
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 border-t border-bone/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.24em] text-bone/75">
          <span>{t('footer.legal')} {year} · {t('footer.kvk')}</span>
          <span>
            {t('footer.by')}{' '}
            <a href="https://jouwidealewebsite.nl" className="hover:text-bone transition" target="_blank" rel="noreferrer">
              Jouw Ideale Website
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
