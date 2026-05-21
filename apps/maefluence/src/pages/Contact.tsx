import { useEffect } from 'react';
import { Mail, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import CalButton from '../components/CalButton';

type Props = { t: (k: string) => string };

export default function Contact({ t }: Props) {
  useEffect(() => {
    document.title = t('meta.contact.title');
  }, [t]);

  return (
    <section className="pt-28 lg:pt-36 pb-24 lg:pb-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-6">
            <p className="kicker">{t('contact.kicker')}</p>
            <h1 className="display-xl mt-6">{t('contact.title')}</h1>
            <p className="mt-8 max-w-lg text-coffee/85 text-base lg:text-lg">
              {t('contact.lead')}
            </p>

            <div className="mt-10">
              <CalButton className="btn-primary">{t('contact.book')}</CalButton>
            </div>

            <div className="mt-14 grid gap-4 max-w-md">
              <a
                href="mailto:Sofiamae3103@gmail.com"
                className="group flex items-center justify-between rounded-2xl border border-coffee/25 bg-white/40 px-5 py-4 hover:bg-white/70 transition"
              >
                <span className="flex items-center gap-4">
                  <Mail size={18} strokeWidth={1.5} className="text-sand" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-coffee/80">{t('contact.email')}</span>
                    <span className="block font-serif text-lg">Sofiamae3103@gmail.com</span>
                  </span>
                </span>
                <span className="text-coffee/40 group-hover:text-coffee transition">→</span>
              </a>

              <a
                href="tel:+31615054028"
                className="group flex items-center justify-between rounded-2xl border border-coffee/25 bg-white/40 px-5 py-4 hover:bg-white/70 transition"
              >
                <span className="flex items-center gap-4">
                  <Phone size={18} strokeWidth={1.5} className="text-sand" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-coffee/80">{t('contact.tel')}</span>
                    <span className="block font-serif text-lg">+31 6 15054028</span>
                  </span>
                </span>
                <span className="text-coffee/40 group-hover:text-coffee transition">→</span>
              </a>

              <a
                href="https://api.whatsapp.com/send?phone=615054028"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-coffee/25 bg-white/40 px-5 py-4 hover:bg-white/70 transition"
              >
                <span className="flex items-center gap-4">
                  <MessageCircle size={18} strokeWidth={1.5} className="text-sand" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-coffee/80">WhatsApp</span>
                    <span className="block font-serif text-lg">+31 6 15054028</span>
                  </span>
                </span>
                <span className="text-coffee/40 group-hover:text-coffee transition">→</span>
              </a>
            </div>

            <div className="mt-12">
              <p className="text-[10px] uppercase tracking-[0.32em] text-sand">{t('contact.socials')}</p>
              <div className="mt-4 flex items-center gap-3">
                <a aria-label="Instagram" href="https://www.instagram.com/Maefluence.nl" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-coffee/25 hover:bg-coffee hover:text-bone transition">
                  <Instagram size={18} strokeWidth={1.5} />
                </a>
                <a aria-label="TikTok" href="https://www.tiktok.com/@maefluence.nl" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-coffee/25 hover:bg-coffee hover:text-bone transition">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19.32 6.69a6.4 6.4 0 0 1-4.06-1.45v9.86a5.79 5.79 0 1 1-5.79-5.79c.34 0 .68.03 1.01.09v3a2.85 2.85 0 1 0 2 2.7V2h2.91a4.4 4.4 0 0 0 4.05 4.35v2.34l-.12.0z" />
                  </svg>
                </a>
                <a aria-label="Facebook" href="https://www.facebook.com/maefluence.nl/" target="_blank" rel="noreferrer" className="p-3 rounded-full border border-coffee/25 hover:bg-coffee hover:text-bone transition">
                  <Facebook size={18} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-sand/15 rounded-[3rem] -z-10 blur-2xl" aria-hidden />
              <img
                src="/sofia-fulllength-bw.webp?v=20260520"
                alt="Sofia Mae"
                className="w-full aspect-[2/3] object-cover rounded-[2rem] grayscale"
                loading="eager"
              />
            </div>
            <div className="mt-8 rounded-3xl border border-coffee/20 bg-white/40 p-6">
              <p className="text-[10px] uppercase tracking-[0.32em] text-sand">{t('contact.area.label')}</p>
              <p className="font-serif text-xl mt-2">{t('contact.area.value')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
