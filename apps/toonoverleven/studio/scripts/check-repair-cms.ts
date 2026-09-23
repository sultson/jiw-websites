import {createClient} from '@sanity/client';
import assert from 'node:assert/strict';
import {templates} from '../../src/next/model';
import {contentVan} from '../../src/content';
import {readFileSync} from 'node:fs';
const client=createClient({projectId:'z4gex0g7',dataset:'production',apiVersion:'2025-02-19',useCdn:false});
const docs=await client.fetch<any[]>('*[_type=="sitePage" && !(_id in path("drafts.**"))]');
for(const page of templates){
 const doc=docs.find(d=>d.path===page.path);assert(doc,page.path+' document');
 for(const kind of ['texts','links','images','videos'] as const){
  const expected=page[kind]??[];const actual=doc[kind]??[];
  assert.equal(actual.length,expected.length,page.path+' '+kind+' count');
  for(const row of expected)assert(actual.some((r:any)=>r._key===row._key),page.path+' '+row._key);
 }
}
const content=contentVan({projectId:'z4gex0g7',dataset:'production',data:{pages:docs}});
const original=JSON.parse(readFileSync(new URL('../../docs/reference-activity-copy.json',import.meta.url),'utf8'));
for(const [path,paras] of Object.entries(original)){
 const doc=docs.find(d=>d.path===path);const all=doc.texts.map((t:any)=>t.text).join(' ').replace(/\s+/g,' ');
 for(const para of paras as string[])assert(all.includes(para.replace(/\s+/g,' ')),path+' original CMS copy');
}
for(const p of content.pages??[])for(const im of p.images??[])assert(im.img,p.path+' image asset resolved');
assert(docs.find(d=>d.path==='/privacy').texts.some((t:any)=>t.text.includes('90 dagen')));
assert(docs.find(d=>d.path==='@interface').texts.find((t:any)=>t._key==='contactTitle').label==='Kennismaken · kop');
console.log(`${templates.length} live CMS documents: keys/counts, all original activity copy, image assets, video settings, editable labels and privacy verified (read-only).`);
