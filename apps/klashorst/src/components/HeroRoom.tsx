import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pointer } from 'lucide-react';
import { content, ui, zaalWerken } from '../content';
import {
  HERO_SECTIE,
  HERO_STRIP,
  HeroCopy,
  HeroScrims,
  HeroStrip,
  HeroVoet,
  type StilWerk,
} from './HeroStill';
import Paragraphs from './Paragraphs';

const Room3D = lazy(() => import('./Room3D'));

/**
 * What has to happen before the room is built.
 *
 * The room is a quarter of a megabyte of three.js plus a texture for every work
 * on the wall, and none of it is on the way to reading the page. Loading it
 * with the document meant a phone spent six seconds of its main thread on a
 * canvas before the visitor could scroll, while the strip of paintings behind
 * it — the same works, in the same order, already in the HTML — was finished
 * long before that.
 *
 * So it waits for the visitor. Moving a mouse, touching the screen, scrolling
 * or pressing a key all start it, which on a desktop is immediate and on a
 * phone is the first flick. Anyone who never does one of those things has a
 * page that was never held up by a canvas they did not use.
 */
const WAKE = ['pointermove', 'pointerdown', 'touchstart', 'wheel', 'keydown', 'scroll'] as const;

/**
 * The room is an enhancement, never a dependency. A dropped WebGL context, a
 * chunk that fails to load or anything three.js throws must cost the visitor
 * the canvas and nothing else: without this, one lost context blanks the whole
 * page, because an error thrown in render unmounts the tree above it.
 */
class RoomBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The strip's works, named the way a screen reader should read them. The Worker
 * builds the same list from the same documents when it writes the still hero
 * into the page, so the row React renders is the row that was already there.
 */
const stilWerken: StilWerk[] = zaalWerken.slice(0, HERO_STRIP).map((work) => ({
  id: work.id,
  alt:
    [work.titel, work.techniek, work.afmetingen].filter(Boolean).join(', ') || ui.werk.zonderTitel,
  img: work.img,
}));

export default function HeroRoom() {
  const t = content.teksten.hero;
  const holder = useRef<HTMLElement>(null);
  const [mount, setMount] = useState(false);
  const [live, setLive] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!holder.current || !webglAvailable() || !zaalWerken.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let stop = () => {};

    // Still only once the hero has been on screen: someone who lands on /blog
    // and scrolls has done all six of these and needs no room at all.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const wake = () => {
          stop();
          setMount(true);
        };
        for (const event of WAKE) {
          window.addEventListener(event, wake, { passive: true, once: true });
        }
        stop = () => {
          for (const event of WAKE) window.removeEventListener(event, wake);
        };
      },
      { rootMargin: '300px' },
    );
    observer.observe(holder.current);
    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  /** Give up on the canvas and put the plain image strip back. */
  const retreat = () => {
    setMount(false);
    setLive(false);
    setFocusIndex(null);
  };

  const focused = focusIndex === null ? null : zaalWerken[focusIndex];

  return (
    <section id="museum" ref={holder} className={HERO_SECTIE}>
      {/* Dropped once the canvas is live, so a phone never holds both. */}
      {!live && <HeroStrip werken={stilWerken} />}

      {mount && (
        <RoomBoundary onFail={retreat}>
          <Suspense fallback={null}>
            <Room3D
              focusIndex={focusIndex}
              onSelect={setFocusIndex}
              onReady={() => setLive(true)}
              onFirstDrag={() => setDragged(true)}
              onLost={retreat}
            />
          </Suspense>
        </RoomBoundary>
      )}

      <HeroScrims focused={Boolean(focused)} />

      <HeroVoet
        onder={
          // No words: the glyph shows the gesture, and the pulsing marker on
          // the centred canvas shows that a work can be opened. Both retire
          // once the visitor has turned the room themselves.
          live && !focused ? (
            <div
              className={`mt-10 flex justify-center transition-opacity duration-700 ${
                dragged ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            >
              <span className="drag-hint">
                <span>
                  <Pointer size={22} strokeWidth={1.5} />
                </span>
              </span>
            </div>
          ) : undefined
        }
      >
        <HeroCopy t={t} focused={Boolean(focused)} />

        {/* Wall label for the work brought forward. */}
        <div
          className={`pointer-events-auto max-w-sm border-l-2 border-red bg-ink/95 px-5 py-4 transition-all duration-500 ${
            focused ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
          }`}
        >
          {/* No title line for a work that has none: the technique then names
              the work instead of sitting under an empty heading. */}
          {focused?.titel && <h2 className="display text-xl md:text-2xl">{focused.titel}</h2>}
          <p className={`text-sm ${focused?.titel ? 'mt-1 text-muted' : 'text-bone'}`}>
            {focused ? [focused.techniek, focused.afmetingen].filter(Boolean).join(', ') : ''}
          </p>
          <div className="mt-2">
            <Paragraphs value={focused?.toelichting} className="text-sm leading-relaxed text-bone" gap="mt-2" />
          </div>
          <button
            type="button"
            onClick={() => setFocusIndex(null)}
            className="eyebrow mt-3 block hover:text-bone"
          >
            {ui.zaal.terug}
          </button>
        </div>
      </HeroVoet>
    </section>
  );
}
