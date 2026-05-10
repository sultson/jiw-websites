type Props = { t: (k: string) => string };

export default function ForWhom({ t }: Props) {
  return (
    <section className="bg-ink text-paper section-pad-lg">
      <div className="mx-auto max-w-[1280px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <span className="roman">III.</span>
            <span className="kicker kicker-light block mt-3">{t('forwhom.kicker')}</span>
          </div>
          <blockquote className="lg:col-span-9">
            <p className="font-display italic font-light text-[32px] sm:text-[40px] md:text-[54px] leading-[1.08] text-paper max-w-[24ch]">
              {t('forwhom.quote')}
            </p>
            <p className="mt-10 max-w-[58ch] text-[15px] md:text-base text-paper/75 leading-relaxed">
              {t('forwhom.body')}
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
