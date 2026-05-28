import { MessageCircle } from 'lucide-react';

const PHONE_WA = 'https://wa.me/31648490004';

export default function WhatsAppFab() {
  return (
    <a
      href={PHONE_WA}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Gerda"
      className="group fixed left-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-[0_14px_30px_-10px_rgba(31,42,46,0.55)] transition-transform duration-200 hover:scale-105 active:scale-95 sm:left-6 sm:h-[60px] sm:w-[60px]"
      style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <MessageCircle size={26} className="transition-transform group-hover:rotate-[6deg]" />
      <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-cream shadow-lg md:group-hover:block">
        WhatsApp Gerda
      </span>
    </a>
  );
}
