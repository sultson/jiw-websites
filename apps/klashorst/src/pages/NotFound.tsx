import { content, ui } from '../content';
import { to } from '../router';

/**
 * An address that leads nowhere. Because the site is one bundle, this is also
 * what a mistyped or retired article link lands on, so it offers the two places
 * that visitor was probably heading for rather than an apology.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[80svh] items-center pt-[4.5rem] md:pt-20">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 max-w-2xl text-4xl md:text-6xl">{ui.nietGevonden.titel}</h1>
        <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-muted">
          {ui.nietGevonden.tekst}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href={to('/blog')} className="btn btn-solid">
            {content.teksten.blog.titel}
          </a>
          <a href={to('/')} className="btn">
            {ui.blog.naarMuseum}
          </a>
        </div>
      </div>
    </main>
  );
}
