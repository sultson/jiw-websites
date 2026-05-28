import { Star } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function TopBar({ t }: Props) {
  return (
    <div className="bg-ink text-paper/90 text-xs">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-2 flex items-center justify-center gap-2 text-center">
        <Star size={12} className="text-champagne-soft" fill="currentColor" />
        <span>{t('topbar.line')}</span>
      </div>
    </div>
  );
}
