import type { ReactNode } from 'react';
import Paragraphs from './Paragraphs';
import { STRIP_SIZES } from '../content/image';
import type { Img } from '../content/types';

/**
 * The hero with nothing running in it: the works, the scrims and the copy.
 *
 * It exists twice over, which is the whole point of it. `HeroRoom` renders
 * these pieces in the browser, and the Worker renders `HeroShell` into the
 * page's empty root before the page is sent, so the museum's first screen is
 * in the HTML rather than something a phone has to boot React to see. The two
 * cannot drift, because they are the same components.
 *
 * Everything here is static: no state, no effects, no browser. The room, the
 * wall label and the drag glyph stay in `HeroRoom`, because none of them
 * exists until a visitor has asked for the room.
 */

/** One work as the strip shows it: a photograph and a name to read it out by. */
export type StilWerk = { id: string; alt: string; img: Img };

export type HeroCopyTekst = { titel: string; tagline: string; lead: string; knop: string };

/**
 * How many works the still strip puts in the page.
 *
 * The row runs off the right of the screen and is never scrolled: past the
 * fourth work nothing is ever seen, on any screen this site is read on. All
 * thirteen used to be in the HTML, and a phone downloaded every one of them
 * while the one painting the visitor could actually see waited its turn. The
 * room, when it is asked for, still hangs all of them.
 */
export const HERO_STRIP = 4;

/**
 * Shared so the Worker's copy of the section is the same box as the app's. A
 * different height here would be a layout shift the moment React took over.
 */
export const HERO_SECTIE =
  'relative flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[4.5rem] md:pt-20';

/**
 * The works themselves, in a row across the screen. This is the hero until the
 * visitor asks for the room, and it stays the hero on a phone with no WebGL or
 * with reduced motion asked for.
 */
export function HeroStrip({ werken }: { werken: StilWerk[] }) {
  return (
    <div className="absolute inset-0 flex items-center gap-4 overflow-hidden px-4 sm:gap-8">
      {werken.map((werk, i) => (
        <img
          key={werk.id}
          src={werk.img.strip}
          srcSet={werk.img.stripSet}
          sizes={STRIP_SIZES}
          alt={werk.alt}
          // The photograph's own proportion, so the row is laid out at its
          // final width before a single byte of it has arrived. Without these
          // the strip reflows as each work lands, which is the whole of this
          // page's layout shift.
          width={Math.round(1000 * werk.img.ratio)}
          height={1000}
          // The first work is the largest thing on the first screen, so it is
          // what the page is waiting for. The rest of the row is off to the
          // right and can arrive whenever it likes.
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : undefined}
          decoding="async"
          className="h-[46vh] w-auto max-w-none shrink-0 object-contain sm:h-[58vh]"
        />
      ))}
    </div>
  );
}

/**
 * Scrims. They exist to keep the type legible and nothing else, so they are as
 * small as that job allows: the room behind them is the point of the page, and
 * the old ones dimmed the whole of it to protect a corner. The first seats the
 * bar against the room and stays put; the other two clear early, so only the
 * corner the copy sits in is darkened and the lit wall keeps its light, and
 * they get out of the way entirely once a work is brought forward.
 */
export function HeroScrims({ focused }: { focused: boolean }) {
  const weg = focused ? 'opacity-0' : 'opacity-100';
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/85 via-ink/40 to-transparent" />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-ink from-6% via-ink/45 via-38% to-transparent to-82% transition-opacity duration-500 ${weg}`}
      />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-ink from-12% via-ink/60 via-32% to-transparent to-58% transition-opacity duration-500 ${weg}`}
      />
    </>
  );
}

/** The museum's name and its opening sentence, and the way into the collection. */
export function HeroCopy({ t, focused }: { t: HeroCopyTekst; focused: boolean }) {
  return (
    <div
      className={`max-w-xl transition-all duration-500 ${
        focused ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100'
      }`}
    >
      {t.titel && <h1 className="display text-[clamp(2.5rem,9vw,6.5rem)]">{t.titel}</h1>}
      {t.tagline && (
        <p className="display mt-2 text-[clamp(1.1rem,3.4vw,2rem)] text-red-soft">{t.tagline}</p>
      )}
      <div className="mt-5 max-w-md">
        <Paragraphs value={t.lead} className="text-[0.95rem] leading-relaxed text-bone" />
      </div>
      {/* A button the museum left unnamed is not a button. */}
      {t.knop && (
        <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
          <a href="#werk" className="btn btn-solid">
            {t.knop}
          </a>
        </div>
      )}
    </div>
  );
}

/**
 * The block the copy sits in, shared so both sides seat it identically. `onder`
 * is what hangs below the row once the room is live, and is nothing here.
 */
export function HeroVoet({ children, onder }: { children: ReactNode; onder?: ReactNode }) {
  return (
    <div className="pointer-events-none relative mt-auto w-full px-5 pb-14 md:px-10 md:pb-20">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {children}
      </div>
      {onder}
    </div>
  );
}

/**
 * The whole first screen, as the Worker writes it into the page.
 *
 * Not the wall label: it is invisible until a work is brought forward, and its
 * absence moves nothing, because the row it would sit in lays its one child out
 * from the left either way.
 */
export function HeroShell({ t, werken }: { t: HeroCopyTekst; werken: StilWerk[] }) {
  return (
    <main>
      <section id="museum" className={HERO_SECTIE}>
        <HeroStrip werken={werken} />
        <HeroScrims focused={false} />
        <HeroVoet>
          <HeroCopy t={t} focused={false} />
        </HeroVoet>
      </section>
    </main>
  );
}
