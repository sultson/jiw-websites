import { useCallback, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import Lightbox, { type LightboxFoto } from '../components/Lightbox';
import Newsletter from '../components/Newsletter';
import Paragraphs from '../components/Paragraphs';
import RichText, { fotoSleutel } from '../components/RichText';
import { blogPosts, ui, type BlogPost as Post, type Img } from '../content';
import { to } from '../router';

/**
 * One post, in full.
 *
 * A single column at reading width, with the photographs allowed to run wider
 * than the type. Everything below the article is a way onward: the other posts,
 * and the newsletter the museum is collecting addresses for.
 */
export default function BlogPost({ post }: { post: Post }) {
  const verder = blogPosts.filter((other) => other.slug !== post.slug).slice(0, 3);
  const [index, setIndex] = useState<number | null>(null);

  /**
   * Every photograph in the piece, in the order it is read: the one at the top
   * first, then the ones inside the article. So a visitor who opens one can
   * walk through the rest of the post's photographs without closing the viewer.
   */
  const fotos = useMemo(() => {
    const uit: LightboxFoto[] = [];
    if (post.img) {
      uit.push({ key: 'kop', src: post.img.full, alt: post.titel, onderschrift: post.titel });
    }
    for (const block of post.body) {
      if (block._type !== 'image') continue;
      const { img, alt, bijschrift } = block as { img?: Img; alt?: string; bijschrift?: string };
      if (!img) continue;
      // The caption the client wrote, or failing that what they typed as the
      // description of the photograph. The two are often the same sentence, so
      // the viewer shows one of them rather than both.
      const onderschrift = bijschrift || alt || post.titel;
      uit.push({
        key: fotoSleutel({ _key: block._key, img }),
        src: img.full,
        alt: alt || bijschrift || post.titel,
        onderschrift,
      });
    }
    return uit;
  }, [post]);

  const openen = useCallback(
    (sleutel: string) => {
      const gevonden = fotos.findIndex((foto) => foto.key === sleutel);
      if (gevonden >= 0) setIndex(gevonden);
    },
    [fotos],
  );

  return (
    <main className="pt-[4.5rem] md:pt-20">
      <article className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-[46rem] py-12 md:py-16">
          <a
            href={to('/blog')}
            className="eyebrow inline-flex items-center gap-2 transition-colors hover:text-bone"
          >
            <ArrowLeft size={14} />
            {ui.blog.terug}
          </a>

          {post.datum && (
            <p className="mt-9 text-xs uppercase tracking-[0.18em] text-muted">
              <time dateTime={post.datumISO}>{post.datum}</time>
            </p>
          )}

          <h1 className="display mt-3 text-4xl leading-[1.03] md:text-6xl">{post.titel}</h1>

          <div className="mt-6">
            <Paragraphs value={post.intro} className="text-[1.1rem] leading-relaxed text-bone" />
          </div>

          {/* An English reader who is about to be handed Dutch is told so
              first. Better than a silent switch of language mid-page. */}
          {post.onvertaald && ui.blog.onvertaald && (
            <p lang="en" className="mt-6 border-l-2 border-hair pl-4 text-sm text-muted">
              {ui.blog.onvertaald}
            </p>
          )}
        </header>

        {post.img && (
          <figure className="max-w-[68rem]">
            <button
              type="button"
              onClick={() => openen('kop')}
              aria-label={`${ui.werk.vergroot}: ${post.titel}`}
              className="block cursor-zoom-in transition-opacity duration-300 hover:opacity-85"
            >
              <img
                src={post.img.grid}
                srcSet={`${post.img.gridSet}, ${post.img.full} 2200w`}
                sizes="(min-width: 1140px) 1088px, 100vw"
                alt={post.titel}
                width={Math.round(1200 * post.img.ratio)}
                height={1200}
                fetchPriority="high"
                decoding="async"
                // Capped by height as well as width: a photograph of an upright
                // painting would otherwise fill the screen twice over before a
                // single word of the piece is visible.
                className="max-h-[72svh] w-auto max-w-full bg-wall"
              />
            </button>
          </figure>
        )}

        {/* Without a photograph between them, the lead and the article would be
            separated by two paddings and nothing else. */}
        <div className={`max-w-[46rem] pb-12 md:pb-16 ${post.img ? 'pt-12 md:pt-16' : ''}`}>
          <RichText value={post.body} onZoom={openen} />
        </div>
      </article>

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {verder.length > 0 && (
          <section className="border-t border-hair py-14 md:py-20">
            <h2 className="eyebrow">{ui.blog.verder}</h2>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {verder.map((other) => (
                <BlogCard key={other.id} post={other} />
              ))}
            </div>
          </section>
        )}

        <div className="max-w-2xl border-t border-hair py-16 md:py-24">
          <Newsletter />
        </div>
      </div>

      <Lightbox fotos={fotos} index={index} onIndex={setIndex} />
    </main>
  );
}
