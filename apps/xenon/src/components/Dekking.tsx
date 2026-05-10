import { MapPin } from 'lucide-react';

type Props = {
  t: (key: string) => string;
};

export default function Dekking({ t }: Props) {
  const regions = t('coverage.regions').split(' · ');
  return (
    <section id="dekking" className="relative py-20 sm:py-28 bg-night border-t border-mist">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <span className="kicker !text-xenon-bright">{t('coverage.kicker')}</span>
            <h2 className="mt-4 text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.08] text-silver font-display">
              {t('coverage.title')}
            </h2>
            <p className="mt-5 text-[15.5px] text-steel/90 leading-relaxed max-w-md">
              {t('coverage.body')}
            </p>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {regions.map((r) => (
                <li key={r} className="flex items-center gap-2 text-steel border-b border-mist py-3">
                  <MapPin size={13} className="text-xenon-bright shrink-0" aria-hidden />
                  <span className="font-display text-[14px] tracking-wide">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
