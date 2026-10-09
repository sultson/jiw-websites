/**
 * One-shot: removes the decorative kickers.
 *
 * Nineteen of the twenty-one said nothing a reader could use - "Straight answers",
 * "Next step", "Detail", "The form" - and each one pushed the real heading down a line.
 * The two that survive carry data: the day-and-time label on each shipping step, and
 * the 404 code.
 */
import fs from 'node:fs';
const p = new URL('../src/pages.mjs', import.meta.url);
let s = fs.readFileSync(p, 'utf8');

const before = (s.match(/class="kicker/g) || []).length;

// Whole-line kickers, with whatever indentation and trailing newline they sit on.
s = s.replace(/[ \t]*<p class="kicker(?: kicker-c)?">(?!\$\{when\}|404)[^<]*<\/p>\n/g, '');
// ...and the ones sharing a line with the <div> that opens the section head.
s = s.replace(/(<div class="sec-head(?: center)?">)<p class="kicker(?: kicker-c)?">[^<]*<\/p>\s*/g, '$1\n      ');

const after = (s.match(/class="kicker/g) || []).length;
fs.writeFileSync(p, s);
console.log(`kickers ${before} -> ${after}`);
