// Schermafdruk + meting van woordmerk en zwevend paar op de live conceptsite.
import { createRequire } from 'module';
const require = createRequire('C:/Users/nieuw/dev/claudius/package.json');
const { chromium, webkit } = require('playwright');
const BASIS = 'https://puurgenieten-concept.jouwconcept.app';
console.log('meet', BASIS);
for (const [motor, naam] of [[chromium, 'chromium'], [webkit, 'webkit']]) {
  const b = await motor.launch();
  for (const [w, h] of [[1440, 900], [390, 844], [360, 640]]) {
    for (const pad of ['/', '/en/', '/de/']) {
      const p = await b.newPage({ viewport: { width: w, height: h } });
      await p.goto(BASIS + pad + '?v=' + Date.now(), { waitUntil: 'load' });
      await p.waitForTimeout(500);
      const m = await p.evaluate(() => {
        const r = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
        const bel = document.querySelector('.zw-bel');
        return { merk: r('.brand-pg img'), wa: r('.zw-wa'), bel: r('.zw-bel'), belKleur: bel && getComputedStyle(bel).backgroundColor, font: bel && getComputedStyle(bel).fontFamily.split(',')[0], scrollW: document.documentElement.scrollWidth, mail: [...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.href) };
      });
      const fout = [];
      if (m.scrollW > w) fout.push('pagina breder dan scherm ' + m.scrollW);
      for (const k of ['wa', 'bel']) if (!m[k] || m[k][0] < 0 || m[k][2] > w || m[k][3] > h) fout.push(k + ' buiten beeld ' + m[k]);
      if (m.mail.some(x => !x.includes('info@puurgenieten.tv'))) fout.push('ander mailadres ' + m.mail);
      console.log(naam, w, pad, JSON.stringify(m), fout.length ? 'FOUT ' + fout.join('; ') : 'ok');
      if (naam === 'chromium' && pad === '/') await p.screenshot({ path: `shots/zwevend-${w}.png` });
      await p.close();
    }
  }
  await b.close();
}
