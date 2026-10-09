import { chromium } from 'playwright';
const CX=32,CY=32,f=n=>Math.round(n*100)/100;
const ring=(count,from,dist,len,wide)=>Array.from({length:count},(_,i)=>{
  const deg=from+i*(360/count),a=deg*Math.PI/180;
  const cx=f(CX+dist*Math.cos(a)),cy=f(CY+dist*Math.sin(a));
  return `<ellipse cx="${cx}" cy="${cy}" rx="${len}" ry="${wide}" transform="rotate(${f(deg)} ${cx} ${cy})"/>`;});
const V={
 A:`<g opacity=".4">${ring(5,-90,17.2,13.2,7.4).join('')}</g>${ring(5,-54,9.2,7.6,4.4).join('')}<circle cx="32" cy="32" r="2.7"/>`,
 B:`<g opacity=".4">${ring(6,-90,17.2,13.0,6.6).join('')}</g>${ring(6,-60,9.0,7.2,3.9).join('')}<circle cx="32" cy="32" r="2.6"/>`,
 C:`<g opacity=".38">${ring(8,-90,17.6,12.8,5.2).join('')}</g>${ring(8,-67.5,9.4,7.4,3.2).join('')}<circle cx="32" cy="32" r="2.8"/>`,
 D:`${ring(5,-90,17.2,13.2,7.4).join('')}<g opacity=".999">${ring(5,-54,9.2,7.6,4.4).join('')}</g><circle cx="32" cy="32" r="2.7" fill="#FAF8F3"/>`,
};
const svg=(inner)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" style="width:100%;height:100%">${inner}</svg>`;
const col=(k)=>`<div style="text-align:center">
 <div style="display:flex;gap:18px;align-items:flex-end;justify-content:center;color:#2C4A3B">
  ${[22,34,72,128].map(s=>`<div style="width:${s}px;height:${s}px">${svg(V[k])}</div>`).join('')}
  <div style="background:#1B3128;padding:14px;color:#C7D3C6"><div style="width:64px;height:64px">${svg(V[k])}</div></div>
 </div>
 <div style="font:12px system-ui;color:#888;margin-top:8px">${k}</div></div>`;
const html=`<body style="background:#FAF8F3;margin:0;padding:34px;display:grid;gap:30px">${Object.keys(V).map(col).join('')}</body>`;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:760,height:820}});
await p.setContent(html);await p.screenshot({path:'shots/mark-variants.png'});await b.close();
