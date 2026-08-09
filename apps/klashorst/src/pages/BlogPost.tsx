import { ArrowLeft } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import RichText from '../components/RichText';
import { blogPosts, ui, type BlogPost as Post } from '../content';
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

          {post.intro && (
            <p className="mt-6 text-[1.1rem] leading-relaxed text-bone/85">{post.intro}</p>
          )}

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
            <img
              src={post.img.full}
              srcSet={`${post.img.grid} 700w, ${post.img.full} 2200w`}
              sizes="(min-width: 1140px) 1088px, 100vw"
              alt={post.titel}
              fetchPriority="high"
              decoding="async"
              // Capped by height as well as width: a photograph of an upright
              // painting would otherwise fill the screen twice over before a
              // single word of the piece is visible.
              className="max-h-[72svh] w-auto max-w-full bg-wall"
            />
          </figure>
        )}

        {/* Without a photograph between them, the lead and the article would be
            separated by two paddings and nothing else. */}
        <div className={`max-w-[46rem] pb-12 md:pb-16 ${post.img ? 'pt-12 md:pt-16' : ''}`}>
          <RichText value={post.body} />
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
    </main>
  );
}
