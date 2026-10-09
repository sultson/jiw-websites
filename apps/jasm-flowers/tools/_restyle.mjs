// One-shot: applies the palette + de-boxing pass to styles.css.
import fs from 'node:fs';
const p = new URL('../src/styles.css', import.meta.url);
let s = fs.readFileSync(p, 'utf8');
const R = [
  [`.burger{display:none;width:44px;height:44px;align-items:center;justify-content:center;background:none;
  border:1px solid var(--line);border-radius:var(--r);cursor:pointer}`,
   `.burger{display:none;width:44px;height:44px;align-items:center;justify-content:center;background:none;
  border:1px solid var(--line);border-radius:var(--pill);cursor:pointer}`],

  [`.lang{display:flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--line);
  border-radius:var(--r);background:rgba(255,255,255,.5)}`,
   `.lang{display:flex;align-items:center;gap:2px;padding:3px;border:1px solid var(--line);
  border-radius:var(--pill);background:rgba(255,255,255,.5)}`],

  [`padding:5px 8px;border-radius:calc(var(--r) - 2px);line-height:1;transition:.16s}`,
   `padding:6px 10px;border-radius:var(--pill);line-height:1;transition:.16s}`],

  [`.lang-m a{flex:1;text-align:center;padding:15px 0;font-size:14px;line-height:1.15;border-bottom:0}`,
   `.lang-m a{flex:1;text-align:center;padding:15px 0;font-size:14px;line-height:1.15;border-bottom:0;border-radius:var(--pill)}`],

  [`.hero-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:clamp(34px,4.5vh,58px);
  background:rgba(255,255,255,.16);border-top:1px solid rgba(255,255,255,.16)}
.hero-strip>div{background:rgba(11,24,18,.34);backdrop-filter:blur(7px);
  -webkit-backdrop-filter:blur(7px);padding:22px 20px}`,
   `.hero-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:clamp(34px,4.5vh,58px);
  background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.16);
  border-radius:var(--r);overflow:hidden}
.hero-strip>div{background:rgba(15,26,20,.42);backdrop-filter:blur(9px);
  -webkit-backdrop-filter:blur(9px);padding:22px 20px}`],

  [`.hero-strip{grid-template-columns:repeat(2,1fr);margin-top:26px;
    background:rgba(255,255,255,.18);border-top:1px solid rgba(255,255,255,.18)}`,
   `.hero-strip{grid-template-columns:repeat(2,1fr);margin-top:26px;
    background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.18)}`],

  [`.hero-cut.live b{color:var(--gold-bright)}`, `.hero-cut.live b{color:#fff}`],
  [`background:var(--gold-bright);vertical-align:.28em;margin-right:9px;animation:pulse 2.4s ease-in-out infinite}`,
   `background:#D9CDB4;vertical-align:.28em;margin-right:9px;animation:pulse 2.4s ease-in-out infinite}`],

  // Triptych: arched tops instead of three hard rectangles butted together.
  [`.trip{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--paper)}
.trip figure{position:relative;margin:0;overflow:hidden;aspect-ratio:4/5;background:var(--green-deep)}`,
   `/* Arched tops. A row of three hard rectangles is the most template-looking thing on a
   page; the arch is the one gesture that reads florist rather than dashboard. */
.trip{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(10px,1.4vw,20px);background:transparent;
  padding-inline:var(--gut);max-width:1520px;margin-inline:auto}
.trip figure{position:relative;margin:0;overflow:hidden;aspect-ratio:4/5;background:var(--ink);
  border-radius:var(--arch) var(--arch) var(--r) var(--r)}`],

  [`.trip{grid-template-columns:1fr 1fr}
  .trip figure{aspect-ratio:3/4}
  .trip figure:last-child{grid-column:1/-1;aspect-ratio:16/10}`,
   `.trip{grid-template-columns:1fr 1fr;gap:10px}
  .trip figure{aspect-ratio:3/4;border-radius:clamp(70px,22vw,120px) clamp(70px,22vw,120px) var(--r) var(--r)}
  .trip figure:last-child{grid-column:1/-1;aspect-ratio:16/10;border-radius:var(--r)}`],

  [`.split-img{position:relative;min-height:clamp(360px,46vw,660px);background:var(--green-deep);overflow:hidden}`,
   `.split-img{position:relative;min-height:clamp(360px,46vw,660px);background:var(--ink);overflow:hidden;
  border-radius:var(--r-lg) 0 0 var(--r-lg)}
.split.rev .split-img{border-radius:0 var(--r-lg) var(--r-lg) 0}`],

  [`.split-img{order:1;min-height:clamp(300px,72vw,440px)}`,
   `.split-img,.split.rev .split-img{order:1;min-height:clamp(300px,72vw,440px);
    border-radius:0 0 var(--r-lg) var(--r-lg)}`],

  [`.sig-img{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--sand)}`,
   `.sig-img{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--sand);
  border-radius:var(--arch) var(--arch) var(--r) var(--r)}`],

  [`.sig-no{position:absolute;top:0;left:0;font-family:var(--display);font-size:14px;color:#fff;
  background:rgba(11,24,18,.62);backdrop-filter:blur(6px);width:40px;height:40px;
  display:grid;place-items:center;letter-spacing:.02em}`,
   `/* Was a square tab jammed into the corner of the frame. Inside an arch that is a
   collision, so the number is a floating disc clear of the curve. */
.sig-no{position:absolute;top:14px;left:14px;font-family:var(--display);font-size:13.5px;color:#fff;
  background:rgba(15,26,20,.55);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);
  width:36px;height:36px;border-radius:50%;display:grid;place-items:center;letter-spacing:.02em}`],

  [`.vcard-img{aspect-ratio:3/4;overflow:hidden;background:var(--sand);position:relative}`,
   `.vcard-img{aspect-ratio:3/4;overflow:hidden;background:var(--sand);position:relative;
  border-radius:clamp(80px,11vw,140px) clamp(80px,11vw,140px) var(--r-sm) var(--r-sm)}`],

  [`.vcard-tag{position:absolute;top:0;left:0;font-size:10px;font-weight:700;letter-spacing:.11em;
  text-transform:uppercase;background:rgba(11,24,18,.62);backdrop-filter:blur(6px);color:#fff;padding:7px 11px}`,
   `.vcard-tag{position:absolute;bottom:12px;left:12px;font-size:10px;font-weight:700;letter-spacing:.11em;
  text-transform:uppercase;background:rgba(15,26,20,.55);backdrop-filter:blur(7px);
  -webkit-backdrop-filter:blur(7px);color:#fff;padding:6px 12px;border-radius:var(--pill)}`],

  [`.cat-item{background:#fff;border:1px solid var(--line-soft);border-radius:var(--r);overflow:hidden;
  display:flex;flex-direction:column;transition:.26s}
.cat-item:hover{box-shadow:var(--sh-lg);border-color:var(--sage-light)}
.cat-item.hide{display:none}
.cat-img{aspect-ratio:1/1;overflow:hidden;background:var(--sand);position:relative}`,
   `/* No white box and no border. The photograph is the card; a hairline foot does the
   grouping. A bordered box inside a bordered grid is what made this read boxy. */
.cat-item{background:transparent;border:0;display:flex;flex-direction:column;transition:.26s}
.cat-item.hide{display:none}
.cat-img{aspect-ratio:4/5;overflow:hidden;background:var(--sand);position:relative;
  border-radius:clamp(90px,13vw,150px) clamp(90px,13vw,150px) var(--r) var(--r)}`],

  [`.cat-body{padding:20px;flex:1;display:flex;flex-direction:column}`,
   `.cat-body{padding:20px 2px 0;flex:1;display:flex;flex-direction:column}`],

  [`.swatch{font-size:11px;font-weight:500;background:var(--sage-pale);color:var(--green);padding:4px 9px;border-radius:2px}`,
   `.swatch{font-size:11px;font-weight:500;background:transparent;color:var(--ink-soft);
  border:1px solid var(--line);padding:4px 11px;border-radius:var(--pill)}`],

  [`.a-cell{height:22px;margin:2px 1.5px;border-radius:2px;background:var(--sand-deep)}
.a-1{background:var(--sage-light)}
.a-2{background:var(--gold-bright)}`,
   `/* Was pale green for in-season and gold for peak: two hues to say one thing. It is a
   density scale now, so the peak months read as the darkest cells and nothing else. */
.a-cell{height:22px;margin:2px 1.5px;border-radius:4px;background:var(--sand)}
.a-1{background:#BDC3BB}
.a-2{background:var(--ink)}`],

  [`.a-key i{width:15px;height:15px;border-radius:2px;display:block}`,
   `.a-key i{width:15px;height:15px;border-radius:4px;display:block}`],

  [`.mini-avail i{flex:1;height:14px;border-radius:1px;background:var(--sand-deep)}
.mini-avail i.a-1{background:var(--sage-light)}
.mini-avail i.a-2{background:var(--gold-bright)}`,
   `.mini-avail i{flex:1;height:12px;border-radius:2px;background:var(--sand)}
.mini-avail i.a-1{background:#BDC3BB}
.mini-avail i.a-2{background:var(--ink)}`],

  [`.add{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:var(--r);`,
   `.add{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:var(--pill);`],

  [`.field input,.field select,.field textarea{width:100%;padding:13px 15px;border:1.5px solid var(--line);
  border-radius:var(--r);`,
   `.field input,.field select,.field textarea{width:100%;padding:14px 17px;border:1.5px solid var(--line);
  border-radius:var(--r-sm);`],

  [`.figure{border-radius:var(--r);overflow:hidden;background:var(--sand)}`,
   `.figure{border-radius:var(--r-lg);overflow:hidden;background:var(--sand)}`],

  [`.proc-img{position:sticky;top:104px;border-radius:var(--r);overflow:hidden;aspect-ratio:4/5;background:var(--green)}`,
   `.proc-img{position:sticky;top:104px;border-radius:var(--arch) var(--arch) var(--r) var(--r);
  overflow:hidden;aspect-ratio:4/5;background:var(--ink)}`],

  [`.badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);border-radius:var(--r);
  padding:11px 16px;`,
   `.badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line);border-radius:var(--pill);
  padding:11px 18px;`],

  [`.note{background:var(--gold-pale);border-left:3px solid var(--gold-bright);padding:16px 20px;
  border-radius:0 var(--r) var(--r) 0;font-size:14px;line-height:1.6}`,
   `.note{background:var(--sand);border-left:2px solid var(--ink);padding:16px 22px;
  border-radius:0 var(--r-sm) var(--r-sm) 0;font-size:14px;line-height:1.6}`],

  [`.ccards{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.14)}`,
   `.ccards{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.14);
  border:1px solid rgba(255,255,255,.14);border-radius:var(--r);overflow:hidden}`],

  [`.ccard{background:var(--green-deep);padding:clamp(24px,3vw,34px);text-decoration:none;color:#fff;`,
   `.ccard{background:var(--ink);padding:clamp(24px,3vw,34px);text-decoration:none;color:#fff;`],
  [`.ccard:hover{background:var(--green)}`, `.ccard:hover{background:#26332C}`],
  [`.ccard svg{width:24px;height:24px;color:var(--gold-bright);margin-bottom:16px}`,
   `.ccard svg{width:24px;height:24px;color:#fff;opacity:.8;margin-bottom:16px}`],

  [`.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line-soft);
  border:1px solid var(--line-soft)}`,
   `.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line-soft);
  border:1px solid var(--line-soft);border-radius:var(--r);overflow:hidden}`],
  [`.sec-dark .grid3>div{background:var(--green-deep)}`, `.sec-dark .grid3>div{background:var(--ink)}`],

  [`.reason svg{width:26px;height:26px;color:var(--gold-bright);margin-bottom:18px}`,
   `.reason svg{width:24px;height:24px;color:var(--ink);margin-bottom:16px;opacity:.85}`],
  [`.sec-sand .reason svg,.sec-paper .reason svg,.sec-pale .reason svg{color:var(--green)}`,
   `.sec-dark .reason svg,.sec-ink .reason svg{color:#fff;opacity:.75}`],

  [`.step-n{font-family:var(--display);font-size:22px;color:var(--gold-bright);line-height:1;padding-top:3px;`,
   `.step-n{font-family:var(--display);font-size:22px;color:var(--sage);line-height:1;padding-top:3px;`],

  [`.faq summary:hover{color:var(--green)}`, `.faq summary:hover{color:var(--ink-soft)}`],
  [`.sec-dark .faq summary:hover{color:var(--gold-bright)}`, `.sec-dark .faq summary:hover{color:#fff}`],

  [`.pick[aria-pressed="true"]{background:var(--green);color:#fff;border-color:var(--green);font-weight:700}`,
   `.pick[aria-pressed="true"]{background:var(--ink);color:#fff;border-color:var(--ink);font-weight:700}`],
  [`.add:hover{border-color:var(--green);color:var(--green)}`, `.add:hover{border-color:var(--ink);color:var(--ink)}`],
  [`.add[aria-pressed="true"]{background:var(--green);color:#fff;border-color:var(--green)}`,
   `.add[aria-pressed="true"]{background:var(--ink);color:#fff;border-color:var(--ink)}`],

  [`.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--green);
  box-shadow:0 0 0 3px rgba(44,74,59,.1)}`,
   `.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--ink);
  box-shadow:0 0 0 3px rgba(21,33,27,.09)}`],

  [`:focus-visible{outline:2.5px solid var(--gold-bright);outline-offset:3px;border-radius:2px}`,
   `:focus-visible{outline:2.5px solid var(--ink);outline-offset:3px;border-radius:6px}`],
  [`::selection{background:var(--gold-pale);color:var(--ink)}`, `::selection{background:var(--sand-deep);color:var(--ink)}`],

  [`.stick{position:fixed;left:0;right:0;bottom:0;z-index:80;background:rgba(18,35,28,.96);`,
   `.stick{position:fixed;left:0;right:0;bottom:0;z-index:80;background:rgba(21,33,27,.96);`],

  [`.tbc{border-bottom:1.5px dotted var(--gold-bright);cursor:help;
  background:linear-gradient(transparent 62%,rgba(214,157,44,.22) 0)}`,
   `.tbc{border-bottom:1.5px dotted var(--gold);cursor:help;
  background:linear-gradient(transparent 62%,rgba(180,150,96,.26) 0)}`],

  [`.phead{background:var(--green-deep);color:#fff;`, `.phead{background:var(--ink);color:#fff;`],
  [`.hero{position:relative;background:var(--green-deep);color:#fff;`, `.hero{position:relative;background:var(--ink);color:#fff;`],
];
let n = 0;
for (const [a, b] of R) {
  if (!s.includes(a)) { console.error('MISS:', JSON.stringify(a.slice(0, 80))); process.exitCode = 1; continue; }
  s = s.replace(a, b); n++;
}
fs.writeFileSync(p, s);
console.log(`applied ${n}/${R.length}`);
