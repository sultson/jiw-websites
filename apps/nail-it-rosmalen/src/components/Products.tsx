import { Leaf } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Products({ t }: Props) {
  return (
    <section id="producten" className="py-20 md:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="kicker inline-flex items-center gap-2">
            <Leaf size={14} /> {t('products.kicker')}
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.05]">
            {t('products.title')}
          </h2>
          <p className="mt-6 text-espresso/75 leading-relaxed max-w-prose">
            {t('products.body')}
          </p>

          <ul className="mt-6 space-y-2 text-sm text-espresso/80">
            <li className="flex items-baseline gap-3">
              <span className="text-gold shrink-0">·</span>
              <span>{t('products.feat1')}</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-gold shrink-0">·</span>
              <span>{t('products.feat2')}</span>
            </li>
            <li className="flex items-baseline gap-3">
              <span className="text-gold shrink-0">·</span>
              <span>{t('products.feat3')}</span>
            </li>
          </ul>

          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-espresso/55">
            {t('products.note')}
          </p>
        </div>

        <div className="order-1 md:order-2 flex md:justify-end">
          <div className="relative w-full max-w-xs md:max-w-sm mx-auto md:mx-0">
            <img
              src="/dadi-oil-and-lotion-product-series.webp"
              alt={t('products.imgAlt1')}
              loading="lazy"
              className="rounded-sm w-full aspect-square object-cover shadow-[0_20px_60px_-30px_rgba(35,27,29,0.5)]"
            />
            <img
              src="/dadi-oil-product-series-2.webp"
              alt={t('products.imgAlt2')}
              loading="lazy"
              className="hidden sm:block absolute -bottom-6 -left-6 w-2/5 aspect-square object-cover rounded-sm border-4 border-cream shadow-[0_20px_50px_-20px_rgba(35,27,29,0.55)]"
            />
            <div className="hidden md:block absolute -top-3 -right-3 text-[10px] uppercase tracking-[0.3em] text-espresso/60 bg-cream px-3 py-1.5 border border-espresso/10">
              famous names
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
