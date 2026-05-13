import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { site } from '../data/site';

export default function OfferteFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${site.phoneRaw.replace('+', '')}`;

  return (
    <div
      className={`md:hidden fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.4)]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M19.05 4.91A10 10 0 0 0 12 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 0 0 22 12a10 10 0 0 0-2.95-7.09Zm-7.05 15.4a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-2.88.76.77-2.81-.2-.32A8.31 8.31 0 1 1 12 20.31Zm4.55-6.22c-.25-.13-1.47-.73-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.12-.11.25-.3.38-.45.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.45-.07-.13-.56-1.34-.76-1.83-.2-.49-.41-.42-.56-.43h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.86-.87 2.1 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.7 4.27 3.79 1.49.65 2.08.7 2.83.59.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.3Z" />
        </svg>
      </a>
      <a
        href="#offerte"
        className="inline-flex items-center gap-2 rounded-full bg-bbn-red text-white font-bold uppercase tracking-wider pl-5 pr-6 py-3.5 text-sm shadow-[0_10px_30px_-6px_rgba(220,31,38,0.5)]"
      >
        <span>Offerte</span>
        <ArrowRight size={16} strokeWidth={2.5} />
      </a>
    </div>
  );
}
