import { ui, type BlogPost } from '../content';

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
      <a href={`/blog/${post.slug}`} className="group flex flex-col">
        {post.img && (
          <div className="overflow-hidden bg-ink">
            <img
              src={post.img.grid}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
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

        {post.samenvatting && (
          <p className="mt-3 text-sm leading-relaxed text-bone/75">{post.samenvatting}</p>
        )}

        <span className="eyebrow mt-4 self-start border-b border-red pb-1 text-bone/80 transition-colors group-hover:text-bone">
          {ui.blog.lees}
        </span>
      </a>
    </article>
  );
}
