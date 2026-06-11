type Props = { t: (k: string) => string };

const cards = [
  { src: '/products-green-rabbit.webp', titleKey: 'products.gr.title', bodyKey: 'products.gr.body' },
  { src: '/products-yodeyma.webp', titleKey: 'products.yo.title', bodyKey: 'products.yo.body' },
];

export default function Products({ t }: Props) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-10">
          <span className="kicker">{t('products.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('products.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {cards.map(card => (
            <div key={card.src} className="card overflow-hidden">
              <img
                src={card.src}
                alt={t(card.titleKey)}
                loading="lazy"
                decoding="async"
                className="w-full h-56 object-cover rounded-2xl"
              />
              <div className="p-6 md:p-7">
                <h3 className="font-serif text-2xl">{t(card.titleKey)}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t(card.bodyKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
