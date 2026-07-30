import { ArrowRight, Gift } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function NewClientOffer({ t }: Props) {
  return (
    <section aria-labelledby="new-client-offer" className="pt-16 md:pt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gold text-cream px-6 py-8 sm:px-10 sm:py-10 md:flex md:items-center md:justify-between md:gap-10">
          <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full border border-cream/15" />
          <div className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-cream/15" />

          <div className="relative sm:flex sm:items-start sm:gap-5">
            <span className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/15 text-cream sm:flex">
              <Gift size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cream/75">
                {t('offer.kicker')}
              </p>
              <h2 id="new-client-offer" className="mt-2 text-3xl leading-tight text-cream md:text-4xl">
                {t('offer.title')}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream/85 sm:text-base">
                {t('offer.body')}
              </p>
            </div>
          </div>

          <a
            href="tel:+31639211983"
            className="relative mt-7 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium tracking-wide text-espresso hover:bg-blush md:mt-0"
          >
            {t('offer.cta')}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
