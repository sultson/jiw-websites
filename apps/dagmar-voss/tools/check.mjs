/* Meet het contrast van elke tekstregel tegen de eerste dekkende achtergrond
   erboven, op alle acht paginas, en houdt WCAG AA aan (4.5:1, of 3:1 voor
   grote tekst). Run: pnpm --filter @jiw/dagmar-voss contrast */
import { chromium } from "playwright";
import { serveDist, PAGINAS } from "./serve.mjs";

const { url, stop } = await serveDist();
const b = await chromium.launch();
const page = await b.newPage({viewport:{width:1440,height:900}});
const bad = [];
for (const path of PAGINAS) {
  await page.goto(url+path,{waitUntil:"networkidle"});
  const res = await page.evaluate(() => {
    const lin = c => { c/=255; return c<=.03928 ? c/12.92 : Math.pow((c+.055)/1.055,2.4); };
    const lum = ([r,g,b]) => .2126*lin(r)+.7152*lin(g)+.0722*lin(b);
    const parse = s => (s.match(/[\d.]+/g)||[]).slice(0,4).map(Number);
    const bgOf = el => { // walk up to first opaque background
      let n = el;
      while (n && n !== document.documentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c[3] === undefined || c[3] > .85)) return c.slice(0,3);
        n = n.parentElement;
      }
      return [251,245,238];
    };
    const over = (fg, bg) => { const a = fg[3]===undefined?1:fg[3];
      return [0,1,2].map(i => fg[i]*a + bg[i]*(1-a)); };
    const out = [];
    for (const el of document.querySelectorAll("p,a,li,h1,h2,h3,h4,span,small,summary,div")) {
      const t = [...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join("");
      if (!t) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const bg = bgOf(el);
      const fg = over(parse(cs.color), bg);
      const L1 = lum(fg), L2 = lum(bg);
      const ratio = (Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
      const px = parseFloat(cs.fontSize);
      const large = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight) >= 700);
      const need = large ? 3 : 4.5;
      if (ratio < need) out.push({t: t.slice(0,45), ratio: +ratio.toFixed(2), need, px, color: cs.color});
    }
    return out;
  });
  if (res.length) bad.push({path, res});
}
await b.close(); await stop();
if (!bad.length) console.log("Alle tekst haalt WCAG AA op alle " + PAGINAS.length + " paginas.");
else {
  for (const x of bad) { console.log("\n"+x.path); for (const r of x.res.slice(0,8)) console.log("  ", JSON.stringify(r)); }
  process.exit(1);
}
