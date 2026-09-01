import { blogPosts, content, ui } from '../content';
import Paragraphs from './Paragraphs';
import { to } from '../router';
import BlogCard from './BlogCard';

/**
 * The blog on the museum's own page: the three most recent posts, each one an
 * opening rather than the whole thing, and a way through to the rest.
 */
export default function Blog() {
  const t = content.teksten.blog;
  const recent = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="scroll-mt-20 border-t border-hair bg-wall py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <header className="max-w-2xl">
          {t.eyebrow && <p className="eyebrow">{t.eyebrow}</p>}
          {t.titel && (
            <h2 className={`display text-4xl md:text-6xl ${t.eyebrow ? 'mt-4' : ''}`}>{t.titel}</h2>
          )}
          <div className="mt-5">
            <Paragraphs value={t.lead} className="text-[0.98rem] leading-relaxed text-muted" />
          </div>
        </header>

        {recent.length === 0 ? (
          <div className="mt-10 max-w-xl">
            <Paragraphs value={t.leeg} className="text-[0.95rem] leading-relaxed text-bone" />
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6">
              {recent.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <a href={to('/blog')} className="btn mt-12">
              {ui.blog.alles}
            </a>
          </>
        )}
      </div>
    </section>
  );
}
