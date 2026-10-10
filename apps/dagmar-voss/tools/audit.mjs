/* Controleert dat geen enkel draad-element wordt afgesneden.
   Rekent de gedraaide doos uit, niet alleen de rechte - de lus staat scheef. */
import { chromium } from "playwright";
import { serveDist, PAGINAS } from "./serve.mjs";

const { url, stop } = await serveDist();
const b = await chromium.launch();
const PAGES = PAGINAS;
/* 360 staat er bewust naast 390: een knop met white-space:nowrap maakt zijn
   label de smalste maat van de pagina, en dat zie je op 390 niet. */
const VIEWS=[[320,700],[360,780],[390,844],[414,896],[768,1024],[1024,768],[1440,900],[1920,1080]];
let fouten = 0;
for (const [w,h] of VIEWS) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  for (const path of PAGES) {
    await p.goto(url+path, { waitUntil:"domcontentloaded" });
    await p.evaluate(()=>document.fonts.ready);
    const bad = await p.evaluate(() => {
      const out=[];
      const clipt = (el) => { const cs=getComputedStyle(el); return cs.overflowX!=='visible'||cs.overflowY!=='visible'; };
      const num = (v) => { const n=parseFloat(v); return Number.isNaN(n)?0:n; };
      for (const sel of ['.figure','.hero-media','.quote-wrap','.card','.site-footer','.kaart']) {
        for (const el of document.querySelectorAll(sel)) {
          for (const ps of ['::before','::after']) {
            const cs = getComputedStyle(el, ps);
            if (cs.content === 'none') continue;
            const pw_ = num(cs.width), ph = num(cs.height);
            if (!pw_ || !ph) continue;
            // middelpunt van de pseudo binnen het element
            const r = el.getBoundingClientRect();
            const hasL = cs.left !== 'auto', hasT = cs.top !== 'auto';
            let cx = hasL ? r.left + num(cs.left) + pw_/2 : r.right - num(cs.right) - pw_/2;
            let cy = hasT ? r.top + num(cs.top) + ph/2 : r.bottom - num(cs.bottom) - ph/2;
            // translate(-50%,-50%) zit al in de matrix; haal de matrix op
            const m = cs.transform;
            let rot = 0, tx = 0, ty = 0;
            const mm = m.match(/matrix\(([^)]+)\)/);
            if (mm) { const [a,bb,,,e,f] = mm[1].split(',').map(Number); rot = Math.atan2(bb,a); tx=e; ty=f; }
            cx += tx; cy += ty;
            const bw = Math.abs(pw_*Math.cos(rot)) + Math.abs(ph*Math.sin(rot));
            const bh = Math.abs(pw_*Math.sin(rot)) + Math.abs(ph*Math.cos(rot));
            const box = { left: cx-bw/2, right: cx+bw/2, top: cy-bh/2, bottom: cy+bh/2 };
            let a2 = el, knip = null;
            while (a2 && a2 !== document.documentElement) { if (clipt(a2)) { knip=a2; break; } a2=a2.parentElement; }
            const lim = knip ? knip.getBoundingClientRect() : { left:0, right:innerWidth, top:-1e9, bottom:1e9 };
            const over = Math.max(lim.left-box.left, box.right-lim.right,
                                  knip ? lim.top-box.top : -1e9, knip ? box.bottom-lim.bottom : -1e9);
            if (over > 1.5) out.push({ el: sel+ps, knip: knip ? (knip.className||knip.tagName) : 'viewport', over:+over.toFixed(1) });
          }
        }
      }
      return out;
    });
    if (bad.length) { fouten += bad.length; console.log(`AFGESNEDEN [${w}x${h}] ${path}`, JSON.stringify(bad)); }
  }
  await p.close();
}
await b.close(); await stop();
console.log(fouten === 0 ? "Geen draad wordt afgesneden - 8 paginas x 8 breedtes." : fouten + " afsnijdingen.");
process.exit(fouten ? 1 : 0);
