import { ICOONPADEN } from './index';

/**
 * De onderwerpiconen uit de mock-up, één lijnsysteem, letterlijk overgenomen.
 *
 * De overdracht van de klant vraagt hier expliciet om: één herkenbare set,
 * geen emoji en geen mengelmoes van bibliotheken. Ze zijn versiering bij een
 * kop die er al staat, dus ze zijn verborgen voor schermlezers.
 */
export default function Icoon({ naam, className = '' }: { naam?: string | null; className?: string }) {
  const pad = naam ? ICOONPADEN[naam] : undefined;
  if (!pad) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: pad }}
    />
  );
}
