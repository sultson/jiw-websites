import {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {ExternalLink} from 'lucide-react';
import {ROUTE, WINKEL} from './ui';

/* Public Mapbox token: pk. tokens are designed to ship in the browser bundle. */
const TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ??
  'pk.eyJ1Ijoiam91d2lkZWFsZXdlYnNpdGUiLCJhIjoiY21zYWh3cG5jMDZzcDJ6cXQydmphZXBrOSJ9.6h0OhCpEDQSXwArmtqPc1Q';

export default function Kaart() {
  const doel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!doel.current) return;
    mapboxgl.accessToken = TOKEN;

    /* Straatniveau: iemand die dit bekijkt wil weten waar de deur zit, niet
       hoe groot de Hoeksche Waard is. Eén winkel, één speld. */
    const map = new mapboxgl.Map({
      container: doel.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: WINKEL,
      zoom: 15.4,
      /* De kaart mag de pagina niet kapen tijdens het scrollen. */
      scrollZoom: false,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({compact: true}), 'bottom-right');

    const winkel = document.createElement('div');
    winkel.className = 'pin pin-winkel';
    winkel.innerHTML = '<span class="pin-dot"></span><span class="pin-label">Fleurig!</span>';
    new mapboxgl.Marker({element: winkel, anchor: 'left'}).setLngLat(WINKEL).addTo(map);

    /* Op smalle schermen verschuift het midden anders uit beeld. */
    const pas = () => map.resize();
    window.addEventListener('resize', pas);
    return () => {
      window.removeEventListener('resize', pas);
      map.remove();
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line">
      <div ref={doel} className="h-[26rem] w-full bg-ink-soft" aria-label="Kaart met de winkel aan de Molendijk in Oud-Beijerland" />
      <a
        href={ROUTE}
        target="_blank"
        rel="noreferrer"
        className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-lg transition hover:bg-white"
      >
        Openen in Maps <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
