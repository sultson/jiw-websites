import {readFileSync,writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
process.env.SANITY_AUTH_TOKEN ||= JSON.parse(readFileSync(homedir()+'/.config/sanity/config.json','utf8')).authToken;
const {client,beeld}=await import('./sanity');
const doc=await client.getDocument('agenda-inloopochtend');if(!doc)throw new Error('Series missing');
writeFileSync('../raw/cms-backups/before-series-photos-'+Date.now()+'.json',JSON.stringify(doc,null,2),{mode:0o600});
const groep=await beeld('/img/approved/ipso-groep.webp'),welkom=await beeld('/img/approved/ipso-welkom.webp');
await client.patch(doc._id).ifRevisionId(doc._rev).set({reeksFotos:[{...groep,_key:'groep'},{...welkom,_key:'welkom'}]}).commit();
console.log('Two supplied IPSO photos added to the weekly series, with original file provenance retained.');
