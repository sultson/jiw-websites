import { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { SITE } from '../lib/site';

type Props = {
  t: (k: string) => string;
  onIntake: () => void;
  hidden?: boolean;
};

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.704.888.314 0 .56-.013.832-.058.717-.13 1.59-.45 1.91-1.123.027-.06.041-.13.041-.213 0-.115-.04-.215-.04-.287-.187-.402-.387-.485-1.518-1.348zM16 4.5c-6.34 0-11.5 5.16-11.5 11.5a11.45 11.45 0 0 0 1.792 6.14L4.5 27.5l5.546-1.752a11.45 11.45 0 0 0 5.954 1.652c6.34 0 11.5-5.16 11.5-11.5S22.34 4.5 16 4.5zm0 21.05a9.46 9.46 0 0 1-5.293-1.611l-.38-.236-3.917 1.239 1.255-3.823-.255-.39A9.46 9.46 0 0 1 6.5 16c0-5.238 4.262-9.5 9.5-9.5s9.5 4.262 9.5 9.5-4.262 9.55-9.5 9.55z" />
    </svg>
  );
}

export default function FloatingFab({ t, onIntake, hidden }: Props) {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (hidden) return null;

  return (
    <div className="lg:hidden fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 safe-bottom pointer-events-none">
      {/* Prijsindicatie pill — fades in after scroll */}
      <button
        type="button"
        onClick={onIntake}
        className={`pointer-events-auto inline-flex items-center gap-2 bg-cobalt text-white px-4 py-3 rounded-full text-[13px] font-bold shadow-[0_10px_28px_-8px_rgba(26,79,180,0.7)] transition-all duration-300 active:scale-95 ${
          scrolledPast
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Calculator size={16} strokeWidth={2.5} />
        {t('nav.ctaShort')}
      </button>

      {/* WhatsApp — always visible */}
      <a
        href={SITE.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('fab.whatsapp')}
        className="pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.7)] hover:scale-105 active:scale-95 transition-transform"
        style={{ backgroundColor: '#25D366' }}
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>
    </div>
  );
}
