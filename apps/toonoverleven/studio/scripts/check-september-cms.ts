import assert from 'node:assert/strict';
import {createClient} from '@sanity/client';
import {contentVan} from '../../src/content';
import {expandeer,datumSleutel} from '../../src/agenda/model';
const client=createClient({projectId:'z4gex0g7',dataset:'production',apiVersion:'2025-02-19',useCdn:false});
const data=await client.fetch<any>('{"agenda":*[_type=="activiteit" && archief != true],"pages":*[_type=="sitePage"]}');
const content=contentVan({projectId:'z4gex0g7',dataset:'production',data});
const events=expandeer(content.agenda,new Date(2026,9,1),new Date(2027,5,30));
for(let d=new Date(2026,9,1);d<=new Date(2027,5,24);d.setDate(d.getDate()+7)){
 const day=datumSleutel(d);const matches=events.filter(e=>datumSleutel(e.start)===day && ['inloopochtend','inloop-met-activiteit'].includes(e.activiteitType??''));
 assert.equal(matches.length,['2026-12-24','2026-12-31'].includes(day)?0:1,day);
}
const special=data.agenda.filter((a:any)=>a.activiteitType==='inloop-met-activiteit');
assert.equal(new Set(special.map((a:any)=>a.afbeelding.asset._ref)).size,3);
assert(data.pages.find((p:any)=>p.path==='/privacy').privacyFile.asset._ref.endsWith('-pdf'));
console.log(`Live CMS verified: ${events.length} future moments; exactly one inloop per non-excluded Thursday, three creative images, privacy PDF attached. Read-only; no form submissions.`);

assert.equal(new Set(events.filter(e=>e.bronId==='agenda-inloopochtend').map(e=>JSON.stringify(e.img))).size,3);
console.log('Weekly series has three CMS-managed photo variants.');
