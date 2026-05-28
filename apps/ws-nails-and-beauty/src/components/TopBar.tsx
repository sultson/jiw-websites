import { useEffect, useState } from 'react';
import { Info, Plane } from 'lucide-react';
import { pickNotice, type ActiveNotice } from '../data/notice';
import type { Lang } from '../translations';

type Props = { lang: Lang; t: (k: string) => string };

export default function TopBar({ lang, t }: Props) {
  const [notice, setNotice] = useState<ActiveNotice>(null);

  useEffect(() => {
    setNotice(pickNotice(new Date(), lang));
  }, [lang]);

  if (!notice) return null;

  if (notice.kind === 'vakantie-active' || notice.kind === 'vakantie-upcoming') {
    const label =
      notice.kind === 'vakantie-active'
        ? `${t('topbar.vakantie')} · ${notice.range}`
        : `${t('topbar.vakantie')} · ${notice.range}`;
    return (
      <div className="bg-plum text-porcelain text-[12px] md:text-[13px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
          <Plane size={13} className="shrink-0 text-rose-soft" />
          <span className="tracking-wide">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-plum text-porcelain text-[12px] md:text-[13px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
        <Info size={13} className="shrink-0 text-rose-soft" />
        <span className="tracking-wide">{t('topbar.klantenstop')}</span>
      </div>
    </div>
  );
}
