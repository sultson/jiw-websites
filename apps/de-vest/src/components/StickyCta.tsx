import { Phone, ArrowUpRight } from 'lucide-react';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
  hidden: boolean;
};

export default function StickyCta({ t, onIntake, hidden }: Props) {
  if (hidden) return null;
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-paper-soft border-t border-ink/10 safe-bottom">
      <div className="grid grid-cols-2 gap-2 px-4 py-3">
        <a href="tel:+31653860031" className="btn-outline text-[12px] py-3 px-3">
          <Phone size={14} aria-hidden />
          {t('sticky.call')}
        </a>
        <button type="button" onClick={onIntake} className="btn-orange text-[12px] py-3 px-3">
          {t('sticky.intake')}
          <ArrowUpRight size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
