import { BrushUnderline, SectionNumber } from './Marks';

type Props = { t: (k: string) => string };

export default function About({ t }: Props) {
  return (
    <section id="over" className="relative py-28 md:py-40 bg-shoji">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-12 gap-12 md:gap-16 items-start">
        {/* TEXT — col 1..7 */}
        <div className="md:col-span-7 order-2 md:order-1">
          <div className="flex items-center gap-4 mb-6 text-[10.5px] uppercase tracking-[0.34em] text-sumi-soft">
            <SectionNumber n={1} />
            <span className="block w-8 h-px bg-sumi/30" />
            <span>{t('about.kicker')}</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-[3.6rem] leading-[1.06] max-w-[16ch] text-sumi">
            {t('about.title')}
          </h2>
          <BrushUnderline className="brush mt-5" />

          <div className="mt-10 max-w-[58ch] space-y-5 text-sumi/75 leading-[1.8]">
            <p>{t('about.body1')}</p>
            <p>{t('about.body2')}</p>
          </div>

          {/* Credentials — tatami hairline list, no chip-cards */}
          <ul className="mt-10 border-t border-sumi/10">
            <li className="flex items-center gap-4 py-4 border-b border-sumi/10">
              <span className="font-display text-[12px] tracking-[0.06em] text-sumi/45 w-8">
                01
              </span>
              <span className="text-[13px] uppercase tracking-[0.16em] text-sumi/80">
                {t('about.badge1')}
              </span>
            </li>
            <li className="flex items-center gap-4 py-4 border-b border-sumi/10">
              <span className="font-display text-[12px] tracking-[0.06em] text-sumi/45 w-8">
                02
              </span>
              <span className="text-[13px] uppercase tracking-[0.16em] text-sumi/80">
                {t('about.badge2')}
              </span>
            </li>
          </ul>

          {/* Signature — asymmetric, hand-feel */}
          <div className="mt-12 flex flex-col sm:flex-row sm:items-end sm:gap-5">
            <span className="font-display text-3xl md:text-4xl text-sumi leading-none italic">
              {t('about.signature')}
            </span>
            <span className="hidden sm:block h-px flex-1 max-w-20 mb-2 bg-sumi/25" />
            <span className="mt-3 sm:mt-0 sm:mb-1 text-[10.5px] uppercase tracking-[0.28em] text-sumi/55">
              {t('about.signatureRole')}
            </span>
          </div>
        </div>

        {/* IMAGE — col 8..12, paper-mounted, asymmetric inset */}
        <div className="md:col-span-5 order-1 md:order-2">
          <div className="relative ml-auto w-full max-w-[420px]">
            <figure className="paper-mount">
              <img
                src="/portrait-zoa-dadi-oil.webp"
                alt="Zoa van Dijk van Salon LaZoa"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
            </figure>

            {/* Asymmetric inset of working portrait, slightly tilted */}
            <div className="hidden md:block absolute -bottom-12 -left-14 w-40 lg:w-44 paper-mount" style={{ transform: 'rotate(-2deg)' }}>
              <img
                src="/portrait-zoa-working.webp"
                alt="Zoa aan het werk in de salon"
                loading="lazy"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>

            {/* Hairline label top-right */}
            <div className="hidden md:flex absolute -top-4 right-2 items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-sumi/55">
              <span className="block w-4 h-px bg-sumi/40" />
              Beek en Donk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
