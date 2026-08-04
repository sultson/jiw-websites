import { news } from '../data/news';
import type { Copy, Lang } from '../translations';

export default function News({ t, lang }: { t: Copy; lang: Lang }) {
  return (
    <section id="nieuws" className="scroll-mt-16 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl">
          <p className="eyebrow">{t.news.eyebrow}</p>
          <h2 className="display mt-4 text-4xl md:text-6xl">{t.news.title}</h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">{t.news.lead}</p>
        </header>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6">
          {news.map((item) => (
            <article key={item.slug} className="flex flex-col">
              <div className="overflow-hidden bg-ink">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">{item.date[lang]}</p>
              <h3 className="display mt-2 text-xl leading-tight">{item.title[lang]}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/75">{item.body[lang]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
