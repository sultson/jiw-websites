import { Quote } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeader from './SectionHeader';
import { reviews } from '../data/reviews';
import type { Lang } from '../translations';

type Props = { t: (k: string) => string; lang: Lang };

export default function Reviews({ t, lang }: Props) {
  return (
    <section className="section bg-canvas">
      <div className="shell-wide">
        <SectionHeader eyebrow={t('rev.eyebrow')} title={t('rev.title')} align="center" />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={(i % 3) as 0 | 1 | 2}>
              <figure className="card h-full p-6 flex flex-col">
                <Quote size={24} className="text-rose" />
                <blockquote className="mt-3 flex-1 font-display text-[18px] leading-snug text-ink serif-italic">
                  {r.quote[lang]}
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-line text-[13px] font-bold uppercase tracking-[0.1em] text-terra">
                  {r.context[lang]}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
