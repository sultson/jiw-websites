type Props = { t: (k: string) => string };

const reviews = ['r1', 'r2', 'r3'] as const;

export default function Reviews({ t }: Props) {
  return (
    <section className="bg-paper-soft section-pad-lg">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 md:mb-16">
          <div className="lg:col-span-7">
            <span className="roman">V.</span>
            <span className="kicker block mt-3">{t('reviews.kicker')}</span>
            <h2 className="mt-5 text-[36px] md:text-[52px] leading-[1.02]">
              {t('reviews.title')}
            </h2>
          </div>
          <div className="lg:col-span-3 lg:col-start-10 lg:pt-6">
            <p className="text-[11px] tracking-[0.28em] uppercase text-ink-mute">
              {t('reviews.source')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-line">
          {reviews.map((id, i) => (
            <figure key={id} className="bg-paper-soft p-7 md:p-9 flex flex-col">
              <span className="roman text-[15px]">{['i.', 'ii.', 'iii.'][i]}</span>
              <blockquote className="mt-5 flex-1">
                <p className="font-display italic font-light text-[20px] md:text-[22px] leading-[1.4] text-ink">
                  {t(`reviews.body.${id}`)}
                </p>
              </blockquote>
              <figcaption className="mt-7 text-[11px] tracking-[0.28em] uppercase text-ink-mute">
                {t(`reviews.cite.${id}`)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
