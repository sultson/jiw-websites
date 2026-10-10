/* Meet schokken bij het scrollen op een afgeknepen cpu (4x trager, als een
   middenklasse telefoon). Twee rondes op dezelfde pagina: een met de oude
   regels er weer bovenop geplakt, een met wat er nu staat. */
import { chromium } from "playwright";
import { serveDist } from "./serve.mjs";

const { url, stop } = await serveDist();

/* exact de regels zoals ze voor deze ronde waren */
const OUD = `
body { background:
  radial-gradient(1200px 680px at 8% -10%, rgba(233,216,213,.80), transparent 64%),
  radial-gradient(900px 560px at 100% 2%, rgba(232,171,131,.24), transparent 62%),
  radial-gradient(1000px 900px at 50% 118%, rgba(233,216,213,.50), transparent 65%),
  #FBF5EE !important;
  background-attachment: fixed !important; }
body::before { background: none !important; }
body::after {
  content:"" !important; position:fixed !important; inset:0 !important; z-index:3 !important;
  pointer-events:none !important; opacity:.055 !important; mix-blend-mode:multiply !important;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E") !important; }
.site-header { background: rgba(251,245,238,.62) !important;
  backdrop-filter: saturate(165%) blur(18px) !important;
  -webkit-backdrop-filter: saturate(180%) blur(14px) !important; }
.mobile-cta { background: rgba(251,245,238,.94) !important;
  backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; }
`;

const meet = async (browser, oud) => {
  const p = await browser.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.goto(url + "/", { waitUntil:"networkidle" });
  await p.evaluate(()=>document.fonts.ready);
  if (oud) {
    await p.addStyleTag({ content: OUD });
    // de oude parallax: elke frame een custom property op <html>
    await p.evaluate(() => {
      let w = false;
      addEventListener('scroll', function () {
        if (w) return; w = true;
        requestAnimationFrame(function () {
          w = false;
          document.documentElement.style.setProperty('--draad-y', (-scrollY*0.42).toFixed(1));
          document.documentElement.style.setProperty('--draad-rek', '1.02');
        });
      }, { passive: true });
    });
  }
  await p.waitForTimeout(600);
  const frames = await p.evaluate(async () => {
    const t = []; let vorig = performance.now(); let stop = false;
    const tik = (nu) => { t.push(nu - vorig); vorig = nu; if (!stop) requestAnimationFrame(tik); };
    requestAnimationFrame(tik);
    for (let i = 0; i < 90; i++) { window.scrollBy(0, 40); await new Promise(r => setTimeout(r, 16)); }
    stop = true;
    await new Promise(r => setTimeout(r, 100));
    return t.slice(3);
  });
  await p.close();
  const s = [...frames].sort((a,b)=>a-b);
  return {
    frames: frames.length,
    mediaan: +s[Math.floor(s.length/2)].toFixed(1),
    p95: +s[Math.floor(s.length*0.95)].toFixed(1),
    ergste: +s[s.length-1].toFixed(1),
    schokken: frames.filter(f=>f>32).length,
  };
};

const browser = await chromium.launch();
console.log("oud: ", JSON.stringify(await meet(browser, true)));
console.log("nieuw:", JSON.stringify(await meet(browser, false)));
console.log("oud: ", JSON.stringify(await meet(browser, true)));
console.log("nieuw:", JSON.stringify(await meet(browser, false)));
await browser.close(); await stop();
