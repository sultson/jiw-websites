import { useState } from 'react';
import { ArrowUpRight, Instagram } from 'lucide-react';
import { work } from '../data/work';
import Lightbox from './Lightbox';

type Props = { t: (key: string) => string };

export default function Werk({ t }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const items = work;
  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <section id="werk" className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <header className="grid lg:grid-cols-12 gap-x-12 gap-y-6 mb-12">
          <div className="lg:col-span-7">
            <span className="kicker">{t('work.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display leading-[1.08]">
              {t('work.title')}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-ink-soft leading-relaxed max-w-[60ch]">
              {t('work.lede')}
            </p>
          </div>
          <div className="lg:col-span-3 lg:col-start-10 self-end">
            <a
              href="https://www.instagram.com/de_vest_schilderwerken/"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ghost"
            >
              <Instagram size={14} aria-hidden />
              {t('work.cta.more')}
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => openAt(i)}
              className="group relative overflow-hidden bg-stone aspect-[3/4] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              aria-label={item.alt}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute top-2 left-2 font-mono text-[10px] uppercase tracking-[0.18em] text-paper bg-ink/55 backdrop-blur-sm px-1.5 py-0.5">
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        items={items}
        index={index}
        onClose={() => setOpen(false)}
        onPrev={() => setIndex((i) => (i - 1 + items.length) % items.length)}
        onNext={() => setIndex((i) => (i + 1) % items.length)}
      />
    </section>
  );
}
