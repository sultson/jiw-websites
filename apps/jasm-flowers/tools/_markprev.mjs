import { chromium } from 'playwright';
import fs from 'node:fs';
const svg = fs.readFileSync('src/brand/mark.svg','utf8');
const cell = s => `<div style="text-align:center"><div style="width:${s}px;height:${s}px;color:#2C4A3B;margin:0 auto">${svg.replace('<svg ',`<svg style="width:100%;height:100%" `)}</div><div style="font:11px system-ui;color:#888;margin-top:6px">${s}px</div></div>`;
const html = `<body style="background:#FAF8F3;margin:0;padding:40px;display:flex;gap:44px;align-items:flex-end;font-family:system-ui">
${[20,28,40,64,120,200].map(cell).join('')}
<div style="background:#1B3128;padding:24px;color:#C7D3C6;width:120px;height:120px">${svg.replace('<svg ','<svg style="width:100%;height:100%" ')}</div>
</body>`;
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1200,height:320}});
await p.setContent(html); await p.screenshot({path:'shots/mark-preview.png'}); await b.close();
