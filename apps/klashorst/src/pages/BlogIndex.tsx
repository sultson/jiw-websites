import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import { blogPosts, content, ui } from '../content';
import { to } from '../router';

/**
 * The blog: every post there is, newest first.
 *
 * The most recent one is given the room a lead article gets, because on a page
 * of equal cards the newest thing is the hardest to find.
 */
export default function BlogIndex() {
  const t = content.teksten.blog;
  const [nieuwste, ...rest] = blogPosts;

  return (
    <main className="pt-[4.5rem] md:pt-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl py-14 md:py-20">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="display mt-4 text-5xl md:text-7xl">{t.titel}</h1>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">{t.lead}</p>
        </header>

        {!nieuwste ? (
          <p className="max-w-xl pb-20 text-[0.95rem] leading-relaxed text-bone/80">{ui.blog.leeg}</p>
        ) : (
          <>
            <a
              href={to(`/blog/${nieuwste.slug}`)}
              className="group grid gap-7 border-t border-hair pt-10 md:grid-cols-2 md:gap-12 md:pt-12"
            >
              {nieuwste.img && (
                <div className="overflow-hidden bg-ink">
                  <img
                    src={nieuwste.img.grid}
                    srcSet={`${nieuwste.img.grid} 700w, ${nieuwste.img.full} 2200w`}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt=""
                    // The first thing on the page: not something to wait for.
                    fetchPriority="high"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              )}
              <div className="md:self-center">
                {nieuwste.datum && (
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    <time dateTime={nieuwste.datumISO}>{nieuwste.datum}</time>
                  </p>
                )}
                <h2 className="display mt-3 text-3xl leading-tight transition-colors group-hover:text-red-soft md:text-5xl">
                  {nieuwste.titel}
                </h2>
                {nieuwste.samenvatting && (
                  <p className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-bone/80">
                    {nieuwste.samenvatting}
                  </p>
                )}
                <span className="eyebrow mt-6 inline-block border-b border-red pb-1 text-bone/80 transition-colors group-hover:text-bone">
                  {ui.blog.lees}
                </span>
              </div>
            </a>

            {rest.length > 0 && (
              <div className="mt-16 grid gap-10 border-t border-hair pt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 md:mt-20">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} level={2} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="max-w-2xl py-20 md:py-28">
          <Newsletter />
        </div>
      </div>
    </main>
  );
}
