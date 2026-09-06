import { ui, type BlogPost } from '../content';
import { GRID_SIZES } from '../content/image';
import Paragraphs from './Paragraphs';
import { to } from '../router';

/**
 * A post as it appears before you have read it: photograph, date, title and the
 * opening lines. The whole card is the link, so there is no small target to aim
 * at on a phone.
 */
export default function BlogCard({
  post,
  level = 3,
}: {
  post: BlogPost;
  /** h2 on the blog page, where the page title is the h1; h3 under a section heading. */
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? 'h2' : 'h3';

  return (
    <article className="flex flex-col">
      <a href={to(`/blog/${post.slug}`)} className="group flex flex-col">
        {post.img && (
          <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-ink">
            <img
              src={post.img.grid}
              srcSet={post.img.gridSet}
              sizes={GRID_SIZES}
              alt=""
              width={Math.round(1200 * post.img.ratio)}
              height={1200}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        {post.datum && (
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted">
            <time dateTime={post.datumISO}>{post.datum}</time>
          </p>
        )}

        <Heading className="display mt-2 text-xl leading-tight transition-colors group-hover:text-red-soft">
          {post.titel}
        </Heading>

        <div className="mt-3">
          <Paragraphs value={post.samenvatting} className="text-sm leading-relaxed text-bone" gap="mt-2" />
        </div>

        <span className="eyebrow mt-4 self-start border-b border-red pb-1 text-bone/80 transition-colors group-hover:text-bone">
          {ui.blog.lees}
        </span>
      </a>
    </article>
  );
}
