/**
 * Generates src/brand/mark.svg.
 *
 * The old mark was a flat five-petal rosette: symmetrical, evenly spaced, drawn from
 * plain ellipses. That is the shape every parks department and every organic-food
 * co-op already owns, which is exactly the "national park emblem" read.
 *
 * This one is a jasmine bloom - the flower in the name - with SWEPT petals. Each petal
 * is a tapered blade whose tip leans off its own axis, so the whole mark turns. Rotation
 * is what keeps it from settling into a badge, and a tapered blade holds a point at
 * 20px where a rounded ellipse just goes to mush.
 *
 * Run with a variant name to write a preview instead: node gen-mark.mjs A|B|C
 */
import fs from 'node:fs';

const CX = 32, CY = 32;
const f = n => Math.round(n * 1000) / 1000;

/**
 * One petal, drawn pointing straight up from the centre then rotated into place.
 * r0  inner radius (petals stop short of the middle, so the eye gets a void to rest on)
 * R   tip radius
 * w   half-width at the belly
 * s   lateral sweep of the tip: 0 is a static star, higher leans the blade
 * belly where along the length the petal is widest (0-1); low = shoulder near the base
 */
function petal({ r0, R, w, s, belly = 0.62, deg }) {
  const L = R - r0;
  const y = k => f(-(r0 + L * k));
  const p = [
    `M 0 ${f(-r0)}`,
    `C ${f(-w * 0.62 + s * 0.1)} ${y(belly * 0.42)} ${f(-w + s * 0.42)} ${y(belly)} ${f(s)} ${f(-R)}`,
    `C ${f(w + s * 0.42)} ${y(belly)} ${f(w * 0.62 + s * 0.1)} ${y(belly * 0.42)} 0 ${f(-r0)}`,
    'Z',
  ].join(' ');
  // Petals are drawn around the origin and rotated there; the group carries them
  // to the middle of the box. Rotating about (32,32) a path already at the origin
  // swings it off canvas, which is the bug this replaced.
  return `<path d="${p}" transform="rotate(${f(deg)})"/>`;
}

// alt: every other petal is shortened by this factor. A real jasmine is not a
// perfect wheel, and an uneven silhouette is what stops the mark reading as clip art.
const bloom = ({ n, r0, R, w, s, belly, from = 0, alt = 1, altW = 1 }) =>
  `<g transform="translate(${CX} ${CY})">\n    ` +
  Array.from({ length: n }, (_, i) => petal({
    r0, belly, s,
    R: i % 2 ? R * alt : R,
    w: i % 2 ? w * altW : w,
    deg: from + i * (360 / n),
  })).join('\n    ') +
  '\n  </g>';

const VARIANTS = {
  // Six swept blades. Six reads as a bloom rather than a star or a clover, and the
  // sweep gives it a direction of travel.
  A: () => `${bloom({ n: 6, r0: 6.4, R: 29.5, w: 8.2, s: 7.4, belly: 0.58, from: -8 })}
  <circle cx="32" cy="32" r="2.9"/>`,

  // A on a tighter blade with more turn in it.
  B: () => `${bloom({ n: 6, r0: 5.6, R: 30, w: 7.1, s: 10.5, belly: 0.56, from: -8 })}
  <circle cx="32" cy="32" r="2.7"/>`,

  // Alternating long and short petals: the silhouette stops being a wheel.
  C: () => `${bloom({ n: 8, r0: 5.4, R: 30, w: 6.6, s: 8.5, belly: 0.56, from: -14, alt: 0.63, altW: 0.78 })}
  <circle cx="32" cy="32" r="2.7"/>`,
};

const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" role="img" aria-label="JASM Flowers">
  ${body}
</svg>
`;

const pick = process.argv[2];
if (pick && VARIANTS[pick]) {
  fs.writeFileSync(new URL(`./_mark-${pick}.svg`, import.meta.url), wrap(VARIANTS[pick]()));
  console.log('preview', pick);
} else {
  for (const k of Object.keys(VARIANTS)) {
    fs.writeFileSync(new URL(`./_mark-${k}.svg`, import.meta.url), wrap(VARIANTS[k]()));
  }
  // C is the one that ships: eight blades, every other one short. Even six-petal
  // wheels (A, B) still settle into a badge; the uneven silhouette does not, and at
  // 20px it collapses to a crisp four-point star instead of a grey lump.
  fs.writeFileSync(new URL('../src/brand/mark.svg', import.meta.url), wrap(VARIANTS.C()));
  console.log('wrote mark.svg (C) + previews A B C');
}
