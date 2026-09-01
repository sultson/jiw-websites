import { content, ui } from '../content';
import Paragraphs from './../components/Paragraphs';
import { to } from '../router';

/**
 * An address that leads nowhere. Because the site is one bundle, this is also
 * what a mistyped or retired article link lands on, so it offers the two places
 * that visitor was probably heading for rather than an apology.
 */
export default function NotFound() {
  const t = content.teksten.nietGevonden;
  const blog = content.teksten.menu.blog;

  return (
    <main className="flex min-h-[80svh] items-center pt-[4.5rem] md:pt-20">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <p className="eyebrow">404</p>
        {t.titel && <h1 className="display mt-4 max-w-2xl text-4xl md:text-6xl">{t.titel}</h1>}
        <div className="mt-5 max-w-md">
          <Paragraphs value={t.tekst} className="text-[0.98rem] leading-relaxed text-muted" />
        </div>
        <div className="mt-9 flex flex-wrap gap-3">
          {blog && (
            <a href={to('/blog')} className="btn btn-solid">
              {blog}
            </a>
          )}
          <a href={to('/')} className="btn">
            {ui.blog.naarMuseum}
          </a>
        </div>
      </div>
    </main>
  );
}
