import {Suspense, lazy, useEffect, useRef, useState} from 'react';
import {MapPin} from 'lucide-react';

/**
 * Mapbox GL is ~1.5 MB. Laden we het mee met de pagina, dan betaalt iedere
 * bezoeker dat, ook wie nooit tot het werkgebied scrolt. Daarom pas ophalen als
 * de kaart in de buurt van het scherm komt.
 */
const Kaart = lazy(() => import('./Kaart'));

function Plaatshouder() {
  return (
    <div className="grid h-[26rem] w-full place-items-center rounded-2xl border border-white/12 bg-ink-soft">
      <p className="flex items-center gap-2 text-sm text-white/35">
        <MapPin className="h-4 w-4" /> Kaart wordt geladen
      </p>
    </div>
  );
}

export default function KaartLazy() {
  const doel = useRef<HTMLDivElement>(null);
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    const el = doel.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setZichtbaar(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setZichtbaar(true);
          obs.disconnect();
        }
      },
      {rootMargin: '400px'},
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={doel}>
      {zichtbaar
        ? <Suspense fallback={<Plaatshouder />}><Kaart /></Suspense>
        : <Plaatshouder />}
    </div>
  );
}
