/** Add restored content without overwriting the client's existing editorial values. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
if (!process.env.SANITY_AUTH_TOKEN && !process.env.SANITY_WRITE_TOKEN)
  process.env.SANITY_AUTH_TOKEN = JSON.parse(readFileSync(path.join(homedir(), '.config/sanity/config.json'),'utf8')).authToken;
const {client, beeld} = await import('./sanity');
const {templates} = await import('../../src/next/model');
const {slugify} = await import('../../src/meta');
const apply = process.argv.includes('--apply');
const docs = await client.fetch<any[]>('*[_type=="sitePage" || _id=="siteTeksten" || _id=="drafts.siteTeksten"]');
const dir = path.resolve('../raw/cms-backups');mkdirSync(dir,{recursive:true});
writeFileSync(path.join(dir,'before-design-repair-'+Date.now()+'.json'),JSON.stringify(docs,null,2),{mode:0o600});
console.log(`Backed up ${docs.length} documents; synchronizing ${templates.length} templates. Apply: ${apply}`);
for (const page of templates) {
  const id = 'page-v5-' + slugify(page.path === '/' ? 'home' : page.path);
  const versions = docs.filter(d=>d._id===id || d._id==='drafts.'+id);
  if (!versions.length) versions.push({_id:id});
  for (const doc of versions) {
    const merge = (rows:any[], prior:any[]=[]) => rows.map(row=>({...row,_type:'object',...prior.find(x=>x._key===row._key),...('label' in row ? {label:row.label} : {})}));
    const images = [];
    for (const im of page.images) {
      const existing = doc.images?.find((x:any)=>x._key===im._key);
      images.push(existing || {_key:im._key,_type:'object',label:im.label,alt:im.alt,...(apply ? {image:await beeld(im.src)} : {})});
    }
    const fields = {
      path:page.path, title:doc.title ?? page.title, description:doc.description ?? page.description,
      texts:merge(page.texts,doc.texts),links:merge(page.links,doc.links),images,videos:merge(page.videos ?? [],doc.videos),
    };
    if (apply) {
      if (doc._rev) await client.patch(doc._id).ifRevisionId(doc._rev).set(fields).commit();
      else await client.createIfNotExists({_id:doc._id,_type:'sitePage',...fields});
    }
    console.log(page.path + (doc._id.startsWith('drafts.')?' (draft)':''));
  }
}
for (const doc of docs.filter(d=>d._type==='siteTeksten')) if(apply)
  await client.patch(doc._id).ifRevisionId(doc._rev).setIfMissing({'praktisch.contact.email':'info@toonoverleven.nl','praktisch.contact.telefoon':'036 845 02 65'}).commit();
console.log(apply ? 'Restored content synchronized; editorial values preserved.' : 'Read-only plan complete.');
