import { AlertOctagon } from 'lucide-react';

type Props = {
  t: (key: string) => string;
  onClick: () => void;
  hidden?: boolean;
};

export default function SpoedFab({ t, onClick, hidden }: Props) {
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('spoed.cta.button')}
      className="spoed-fab fixed z-30 bottom-5 right-5 sm:bottom-7 sm:right-7 inline-flex items-center gap-2 bg-xenon hover:bg-xenon-bright text-silver px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.55)] border border-xenon-bright/40 font-display text-[12px] uppercase tracking-[0.2em] transition-colors"
      style={{ paddingBottom: 'max(0.875rem, env(safe-area-inset-bottom))' }}
    >
      <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-xenon-bright/30">
        <AlertOctagon size={14} className="relative z-10 text-silver" aria-hidden />
        <span className="spoed-ring rounded-full" aria-hidden />
        <span className="spoed-ring delay-1 rounded-full" aria-hidden />
      </span>
      <span className="hidden sm:inline">{t('fab.spoed')}</span>
    </button>
  );
}
