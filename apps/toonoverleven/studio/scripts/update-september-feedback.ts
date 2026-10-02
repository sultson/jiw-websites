/** Explicit CMS changes for the client's 28 September feedback. */
import {readFileSync,writeFileSync,mkdirSync,createReadStream} from 'node:fs';
import {homedir} from 'node:os';
import path from 'node:path';
if(!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_WRITE_TOKEN) process.env.SANITY_AUTH_TOKEN=JSON.parse(readFileSync(path.join(homedir(),'.config/sanity/config.json'),'utf8')).authToken;
const {client,beeld}=await import('./sanity');
const apply=process.argv.includes('--apply');
const docs=await client.fetch<any[]>('*[_type=="activiteit" || (_type=="sitePage" && path in ["/contact","/privacy"])]');
const backup=path.resolve('../raw/cms-backups');mkdirSync(backup,{recursive:true});writeFileSync(path.join(backup,'before-september-feedback-'+Date.now()+'.json'),JSON.stringify(docs,null,2),{mode:0o600});
if(docs.some(d=>d._id.startsWith('drafts.'))) throw new Error('Review existing drafts before applying this migration.');
const regular=docs.find(d=>d._id==='agenda-inloopochtend');
if(!regular)throw new Error('Existing Thursday series missing.');
const edits:any[]=[];
const coffee=apply?await beeld('/img/approved/inloop-koffie-2026.webp'):null;
const collage=apply?await beeld('/img/approved/inloop-creatief-collage-2026.webp'):null;
const table=apply?await beeld('/img/approved/inloop-creatief-tafel-2026.webp'):null;
edits.push({doc:regular,fields:{archief:false,activiteitType:'inloopochtend',slug:{_type:'slug',current:'inloopochtend-donderdag'},datum:'2026-10-01',herhaling:'wekelijks',herhaalTot:'2027-06-24',overslaan:['2026-12-24','2026-12-31'],afbeelding:coffee}});
const special=docs.filter(d=>d._id.startsWith('agenda-confirmed-') && d.activiteitType==='inloop-met-activiteit').sort((a,b)=>a.datum.localeCompare(b.datum));
for(let i=0;i<special.length;i++)edits.push({doc:special[i],fields:{vervangtReeks:{_type:'reference',_ref:regular._id},afbeelding:i%3===0?special[i].afbeelding:i%3===1?collage:table}});
const first=docs.find(d=>d._id==='agenda-confirmed-inloopochtend-1-oktober');
if(first)edits.push({doc:first,fields:{vervangtReeks:{_type:'reference',_ref:regular._id},afbeelding:coffee}});
const privacy=docs.find(d=>d.path==='/privacy');
if(apply){
 const file=await client.assets.upload('file',createReadStream('../public/documents/privacyverklaring-toon-over-leven.pdf'),{filename:'privacyverklaring-toon-over-leven.pdf',contentType:'application/pdf'});
 edits.push({doc:privacy,fields:{privacyFile:{_type:'file',asset:{_type:'reference',_ref:file._id}}}});
 let transaction=client.transaction();
 for(const {doc,fields} of edits)transaction=transaction.patch(doc._id,p=>p.ifRevisionId(doc._rev).set(fields));
 await transaction.commit();
}
console.log(JSON.stringify({apply,series:'Every Thursday 10:00–12:00 through 24 June 2027',excluded:['2026-12-24','2026-12-31'],specialDates:special.map(d=>d.datum),updated:edits.map(x=>x.doc._id)},null,2));
