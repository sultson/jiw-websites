import {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {PLAATSEN} from './ui';

/* Public Mapbox token: pk. tokens are designed to ship in the browser bundle. */
const TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN ??
  'pk.eyJ1Ijoiam91d2lkZWFsZXdlYnNpdGUiLCJhIjoiY21zYWh3cG5jMDZzcDJ6cXQydmphZXBrOSJ9.6h0OhCpEDQSXwArmtqPc1Q';


/* Ring around the towns above: the area Jasper actually drives to. */
const GEBIED: [number, number][] = [
  [4.575, 51.545], [4.600, 51.470], [4.720, 51.428], [4.905, 51.478],
  [4.985, 51.572], [4.950, 51.662], [4.828, 51.722], [4.658, 51.700],
  [4.575, 51.545],
];

export default function Kaart() {
  const doel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!doel.current) return;
    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: doel.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [4.775, 51.575],
      zoom: 9.1,
      /* De kaart mag de pagina niet kapen tijdens het scrollen. */
      scrollZoom: false,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({compact: true}), 'bottom-right');

    map.on('load', () => {
      map.addSource('gebied', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {type: 'Polygon', coordinates: [GEBIED]},
        },
      });

      map.addLayer({
        id: 'gebied-vlak',
        type: 'fill',
        source: 'gebied',
        paint: {'fill-color': '#45d62f', 'fill-opacity': 0.1},
      });
      map.addLayer({
        id: 'gebied-rand',
        type: 'line',
        source: 'gebied',
        paint: {'line-color': '#45d62f', 'line-width': 2, 'line-opacity': 0.85},
      });
      /* Tweede, gestippelde lijn erover: geeft de rand een technische tekenstijl. */
      map.addLayer({
        id: 'gebied-stippel',
        type: 'line',
        source: 'gebied',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.5,
          'line-dasharray': [1, 3],
        },
      });

      PLAATSEN.forEach(([naam, lon, lat, thuis]) => {
        const el = document.createElement('div');
        el.className = thuis ? 'pin pin-thuis' : 'pin';
        el.innerHTML = `<span class="pin-dot"></span><span class="pin-label">${naam}</span>`;
        new mapboxgl.Marker({element: el, anchor: 'left'}).setLngLat([lon, lat]).addTo(map);
      });
    });

    /* Op smalle schermen past het gebied anders niet in beeld. */
    const pas = () => map.resize();
    window.addEventListener('resize', pas);
    return () => {
      window.removeEventListener('resize', pas);
      map.remove();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12">
      <div ref={doel} className="h-[26rem] w-full bg-ink-soft" aria-label="Kaart van het werkgebied rond Breda" />
    </div>
  );
}
