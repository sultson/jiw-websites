import type { Activiteit } from '../content/types';
import { datumSleutel, volledigeDatum } from '../agenda/model';
export const eventPath = (a: Activiteit, base = 'activiteit') =>
  `/${base}/${encodeURIComponent(a.slug || a.bronId)}${a.herhaling !== 'eenmalig' || base === 'aanmelden' ? '/' + datumSleutel(a.start) : ''}`;
export function findEvent(events: Activiteit[], path: string): Activiteit | undefined {
  const [, , slug, day] = path.split('/');
  return events.find(a => (a.slug || a.bronId) === decodeURIComponent(slug || '') && (!day || datumSleutel(a.start) === day));
}

export const momentLabel = (a: Activiteit) =>
  `${volledigeDatum(a.start)}${a.heleDag ? '' : ` · ${a.start.toLocaleTimeString('nl-NL', {hour:'2-digit',minute:'2-digit'})}–${a.eind.toLocaleTimeString('nl-NL', {hour:'2-digit',minute:'2-digit'})} uur`}`;
