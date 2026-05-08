import { ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onIntake: () => void; hidden?: boolean };

export default function StickyCta({ t, onIntake, hidden }: Props) {
  if (hidden) return null;
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 safe-bottom px-3 pt-2 pointer-events-none">
      <div className="pointer-events-auto bg-ink text-paper rounded-sm shadow-[0_8px_24px_rgba(26,29,34,0.25)] flex items-center justify-between p-2 pl-4 gap-3">
        <div className="text-sm font-semibold leading-tight">{t('sticky.text')}</div>
        <button type="button" onClick={onIntake} className="btn-ochre !min-h-0 px-4 py-2.5 !text-xs">
          {t('sticky.cta')}
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
