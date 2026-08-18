import { webkit, devices } from 'playwright';
const B='https://m-techno-service-concept.jouwidealewebsite.nl';
const b=await webkit.launch(); const ctx=await b.newContext({...devices['iPhone 13']}); const p=await ctx.newPage();
await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(1200);
console.log('hero', await p.evaluate(()=>{const h=document.querySelector('.hero').getBoundingClientRect();return Math.round(h.height)+' vh '+innerHeight;}));
await p.goto(B+'/werk/woonkamer-en-keuken/',{waitUntil:'load'}); await p.waitForTimeout(800);
console.log(await p.evaluate(()=>[...document.querySelectorAll('article.proj > section')].map(s=>s.className).join(' | ')));
await b.close();
