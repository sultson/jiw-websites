import React from 'react';
(globalThis as any).React = React;
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import App from '../src/App';
import {defaults} from '../src/content/defaults';
import {contentVan} from '../src/content';
import {templates, activityTypes} from '../src/next/model';
import {expandeer} from '../src/agenda/model';
import {eventPath,findEvent} from '../src/next/events';
import {imgVanRef} from '../src/content/image';
const nu = Date.parse('2026-09-22T07:00:00Z');
const render=(pad:string,inhoud=defaults)=>renderToStaticMarkup(<App start={{pad,inhoud,voorbeeld:false,nu}}/>);
const text=(html:string)=>html.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const expected=JSON.parse(readFileSync(new URL('../docs/reference-activity-copy.json',import.meta.url),'utf8'));
for(const [path,paragraphs] of Object.entries(expected)) {
 const html=render(path);const copy=text(html);
 for(const paragraph of paragraphs as string[]) assert(copy.includes(paragraph.replace(/\s+/g,' ').trim()),`${path}: omitted original paragraph ${paragraph}`);
 assert(html.includes('event-practical'),path+' practical column');
}
for(const type of Object.keys(activityTypes)){
 const path='/activiteiten/'+type,html=render(path);
 for(const cls of ['crumb','hero-band','hero-image','event-practical','visit'])assert(html.includes(cls),path+' '+cls);
 assert(templates.some(p=>p.path===path),path+' CMS template');
}
const agenda=render('/activiteiten');assert(agenda.includes('Zoek je leeftijdsgenoten of steun voor naasten?'));
for(const event of defaults.agenda){
 const html=render('/activiteit/'+event.slug);
 for(const cls of ['crumb','hero-band','hero-image','event-practical','visit'])assert(html.includes(cls),event.slug+' '+cls);
 if(typeof event.img==='string')assert(html.includes(event.img),event.slug+' CMS image');
}
for(const path of ['/privacy','/nieuws/'+defaults.nieuws[0].slug]){
 const html=render(path);assert(html.includes('crumb'));assert(html.includes('class="wrap visit"'));
}
const org=render('/over-ons/organisatie-en-verantwoording');assert(org.includes('id="bestuur"'));assert(org.includes('id="raad-van-advies"'));assert(org.includes('Het bestuur is verantwoordelijk'));
const framed=imgVanRef('image-test-1000x800-jpg','project','production',{crop:{left:.1,right:.1,top:.25,bottom:0},hotspot:{x:.7,y:.5}})!;
assert(framed.breed.includes('rect=100,200,800,600'));assert.equal(framed.position,'75% 33.33333333333333%');
const home=templates.find(p=>p.path==='/')!;const im=home.images[0];
assert(!render('/',{...defaults,pages:[{path:'/',images:[{_key:im._key,img:null}]}]}).includes(im.src),'explicit image removal');
const recurrence={...defaults.agenda[0],id:'recur',slug:'recur',herhaling:'wekelijks' as const,datum:'2026-09-24',herhaalTot:'2026-10-08'};
const events=expandeer([recurrence],new Date(2026,8,22),new Date(2026,9,31));assert.equal(events.length,3);assert.equal(new Set(events.map(a=>eventPath(a))).size,3);
assert.equal(findEvent(events,eventPath(events[2]))?.id,events[2].id);
const signSource={...defaults.agenda[0],id:'signup-example',slug:'signup-example',activiteitType:'zenmeditatie',datum:'2026-10-01',aanmelden:true,volgeboekt:false,aanmeldUrl:undefined,aanmeldEmail:undefined};
const signContent={...defaults,agenda:[signSource]};
const signup=render('/aanmelden/signup-example/2026-10-01',signContent);
assert(signup.includes('<form'));assert(signup.includes('Je plek is definitief zodra wij je deelname hebben bevestigd.'));assert(signup.includes('donderdag 1 oktober'));
assert(!render('/aanmelden/signup-example/2026-10-01',{...signContent,agenda:[{...signSource,volgeboekt:true}]}).includes('<form'));
assert(!render('/aanmelden/signup-example/2026-10-01',{...signContent,agenda:[{...signSource,aanmeldEmail:'info@toonoverleven.nl'}]}).includes('<form'));
const fields=contentVan({projectId:'p',dataset:'production',data:{teksten:{praktisch:{contact:{email:'audit@example.com',telefoon:'01234'},locatie:{adres:'Nieuw adres 1'}}}} as any});
const footer=render('/',fields);assert(footer.includes('mailto:audit@example.com'));assert(footer.includes('Nieuw adres 1'));
console.log('Original activity paragraphs, all activity layouts, agenda guidance, news/privacy blocks, anchors, image framing/removal, distinct recurring dates, registration rendering and shared contact data verified. No form submissions.');
const editVideo=render('/eerste-bezoek',{...defaults,pages:[{path:'/eerste-bezoek',videos:[{_key:'video-0',video:'abcdefghijk',title:'Aangepaste videotitel',text:'Aangepaste videotoelichting'}]}]});
assert(editVideo.includes('Aangepaste videotitel'));assert(editVideo.includes('watch?v=abcdefghijk'));assert(!editVideo.includes('<iframe'));
const contactCopy=render('/contact',{...defaults,pages:[{path:'@interface',texts:[{_key:'contactTitle',label:'Kop',text:'Kennismaken op jouw manier'},{_key:'nameLabel',label:'Naam',text:'Hoe mogen we je noemen?'}]}]});
assert(contactCopy.includes('Kennismaken op jouw manier'));assert(contactCopy.includes('Hoe mogen we je noemen?'));
const targeted={...signSource,doelgroepen:['naasten' as const],themas:['ontmoeten' as const]};
assert(render('/voor-naasten',{...defaults,agenda:[targeted]}).includes('Activiteiten voor naasten'));
assert(!render('/jong-en-kanker',{...defaults,agenda:[targeted]}).includes('Ontmoet leeftijdsgenoten</h2>'));
for(const p of templates.filter(p=>p.path.startsWith('/activiteiten/'))) assert(activityTypes[p.path.split('/').pop()!],p.path+' known activity');
console.log('CMS video/form overrides and audience targeting verified without writes or submissions.');
