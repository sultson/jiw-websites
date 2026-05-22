import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import CalButton from './CalButton';

type Props = { t: (k: string) => string };

const WHATSAPP_HREF = 'https://wa.me/31615054028';

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.11 4.91A10.04 10.04 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.97L2.05 22l5.27-1.38a9.88 9.88 0 0 0 4.72 1.2h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.85-7zM12.05 20.15h-.01a8.21 8.21 0 0 1-4.19-1.15l-.3-.18-3.13.82.83-3.05-.2-.31a8.22 8.22 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.23 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

export default function FloatingCta({ t }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className={`md:hidden transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <CalButton className="inline-flex items-center gap-2 bg-coffee text-bone px-5 py-3.5 rounded-full text-[12px] uppercase tracking-[0.22em] font-medium shadow-[0_12px_30px_-10px_rgba(84,69,65,0.6)]">
          <Calendar size={16} strokeWidth={1.5} />
          {t('cta.float')}
        </CalButton>
      </div>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Maefluence"
        className="inline-flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] hover:scale-[1.04] active:scale-95 transition-transform"
      >
        <WhatsAppIcon size={24} />
      </a>
    </div>
  );
}
