import { content } from '../content';

/**
 * The museum's name, in the bar and again at the foot of the page.
 *
 * It reads the same field the client already edits as "Naam van het museum",
 * so renaming the museum renames it everywhere rather than in the hero only
 * while two hardcoded copies of the old name stay behind.
 *
 * The last word carries the accent, in the lighter of the two reds: the accent
 * red is a fill and a hairline colour, and at word size on the gallery wall it
 * reads at 4.2:1, which is under the line. Splitting on the final space is
 * enough for a name of that shape and degrades quietly: a one-word name is
 * simply set in one colour, and an empty field renders nothing at all.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  const naam = content.teksten.hero.titel.trim();
  if (!naam) return null;

  const breuk = naam.lastIndexOf(' ');
  const eerste = breuk === -1 ? naam : naam.slice(0, breuk);
  const laatste = breuk === -1 ? '' : naam.slice(breuk);

  return (
    <span className={className}>
      {eerste}
      {laatste && <span className="text-red-soft">{laatste}</span>}
    </span>
  );
}
