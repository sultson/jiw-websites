import { Check } from 'lucide-react';
import Reveal from './Reveal';

type Props = { t: (k: string) => string };

export default function CrkboBand({ t }: Props) {
  return (
    <section className="py-14 sm:py-16 bg-sage-wash">
      <div className="shell">
        <Reveal>
          <div className="card p-7 sm:p-10 grid md:grid-cols-[auto_1fr] gap-7 items-center">
            <img
              src="/crkbo-badge.png"
              alt="CRKBO geregistreerde instelling"
              width={128}
              height={128}
              className="w-28 h-28 mx-auto md:mx-0"
              loading="lazy"
            />
            <div>
              <h2 className="display-md text-ink">{t('crkbo.title')}</h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{t('crkbo.body')}</p>
              <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.1em] text-ink-mute">
                {t('crkbo.memberships')}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {['crkbo.m1', 'crkbo.m2', 'crkbo.m3'].map((k) => (
                  <li key={k} className="flex items-center gap-2 text-[14.5px] text-ink-soft">
                    <Check size={16} className="text-sage-deep shrink-0" strokeWidth={2.4} />
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
