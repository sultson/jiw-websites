import { createFormWorker, type CloudflareFormsEnv, type LeadFormConfig } from '@jiw/cloudflare-forms';
import { confirmationEmail } from './confirmation';
type Env=CloudflareFormsEnv&{ASSETS:Fetcher;WEBSITE_ASSETS:R2Bucket;APIFY_TOKEN?:string;CANONICAL_HOST:string;LIVE?:string;DEFAULT_LANG?:Lang;DUTCH_HOSTS?:string};

type Lang='nl'|'en'|'de';
type Kind='course'|'equipment'|'contact';
// Validation messages the visitor only sees when the browser check was skipped.
// pageUrl is filled in by the page script, so an empty one means the form was posted by
// something that read the HTML without running it: the bot spam of 24-10-2026 came in
// exactly like that. The
// package speaks nl or en, so German pages fall back to English for its built-in ones.
const required:Record<Lang,LeadFormConfig['requiredFields']>={
  nl:[{name:'pageUrl',label:'pagina',message:'Verstuur het formulier vanaf de website.'},{name:'phone',label:'telefoonnummer',message:'Vul uw telefoonnummer in.'},{name:'subject',label:'onderwerp',message:'Maak een keuze of vul een onderwerp in.'},{name:'privacyConsent',label:'privacytoestemming',message:'Ga akkoord met de verwerking van uw gegevens.'}],
  en:[{name:'pageUrl',label:'page',message:'Please send the form from the website.'},{name:'phone',label:'phone number',message:'Enter your phone number.'},{name:'subject',label:'subject',message:'Select an option or enter a subject.'},{name:'privacyConsent',label:'privacy consent',message:'Agree to the processing of your data.'}],
  de:[{name:'pageUrl',label:'Seite',message:'Bitte senden Sie das Formular über die Website.'},{name:'phone',label:'Telefonnummer',message:'Bitte geben Sie Ihre Telefonnummer ein.'},{name:'subject',label:'Betreff',message:'Bitte wählen Sie eine Option oder geben Sie einen Betreff ein.'},{name:'privacyConsent',label:'Datenschutz',message:'Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.'}],
};
// The notification is for the owner, so it is Dutch whatever the page language; the
// language row and the subject's (EN)/(DE) tell them which language to answer in.
const headings:Record<Kind,string>={course:'Nieuwe opleidingsaanvraag',equipment:'Nieuwe equipmentaanvraag',contact:'Nieuw contactverzoek'};
function formConfig(kind:Kind,lang:Lang,origin:string,defaultLang:Lang):LeadFormConfig{
  const formPath=`/api/forms/${lang==='nl'?'':`${lang}/`}${kind}`;
  return {
    formPath,locale:lang==='nl'?'nl':'en',siteName:'Rescue Watercraft',ownerName:'Rescue Watercraft',senderName:'Rescue Watercraft',
    subjectPrefix:`${headings[kind]} Rescue Watercraft${lang==='nl'?'':` (${lang.toUpperCase()})`}`,
    turnstile:true,honeypotField:'website',messageField:'message',subjectFields:['subject','organisation'],requiredFields:required[lang],
    emailFields:[{name:'phone',label:'Telefoon'},{name:'organisation',label:'Organisatie'},{name:'subject',label:'Onderwerp'}],
    leadOnlyEmailFields:[{name:'language',label:'Taal'},{name:'pageUrl',label:'Pagina'},{name:'privacyConsent',label:'Toestemming'}],
    leadEmail:{heading:`${headings[kind]} via de website`,messageHeading:'Vraag of toelichting',nameLabels:{firstName:'Voornaam',lastName:'Achternaam',email:'E-mail'},includeAttachments:false},
    confirmationEmail:confirmationEmail(origin,lang,defaultLang),
  };
}
const formRoutes=new Map<string,[Kind,Lang]>((['nl','en','de'] as Lang[]).flatMap(lang=>(['course','equipment','contact'] as Kind[]).map(kind=>[`/api/forms/${lang==='nl'?'':`${lang}/`}${kind}`,[kind,lang]] as [string,[Kind,Lang]])));
const formWorkers=new Map<string,ReturnType<typeof createFormWorker>>();
function formWorker(path:string,origin:string,defaultLang:Lang){
  const route=formRoutes.get(path);if(!route)return undefined;
  const key=`${origin}${path}`;let worker=formWorkers.get(key);
  if(!worker){worker=createFormWorker(formConfig(route[0],route[1],origin,defaultLang));formWorkers.set(key,worker);}
  return worker;
}

const feedChannels={linkedin:'https://www.linkedin.com/company/rescue-watercraft-b-v/'} as const;
const asUrl=(value:unknown)=>typeof value==='string'&&/^https?:\/\//.test(value)?value:'';
type LinkedInPost={
  type?:string;
  content?:string|null;
  linkedinUrl?:string;
  postedAt?:{date?:string;timestamp?:number};
  postImages?:{url?:string}[];
  video?:{url?:string;thumbnailUrl?:string};
  document?:{coverPages?:{imageUrls?:string[]}[]};
  resharedPost?:LinkedInPost;
};
function mapLinkedInPost(post:LinkedInPost,feedUrl:string){
  const content=post.resharedPost;
  const text=post.content?.trim()||content?.content?.trim()||'';
  const image=asUrl(post.postImages?.[0]?.url)||asUrl(post.video?.thumbnailUrl)||asUrl(post.document?.coverPages?.[0]?.imageUrls?.[0])||asUrl(content?.postImages?.[0]?.url)||asUrl(content?.video?.thumbnailUrl);
  const video=asUrl(post.video?.url)||asUrl(content?.video?.url);
  const time=post.postedAt?.date||(Number.isFinite(post.postedAt?.timestamp)?new Date(post.postedAt!.timestamp!).toISOString():'');
  return {text,url:asUrl(post.linkedinUrl)||feedUrl,time,image,video};
}

const feedFreshMs=6*60*60*1000;
const feedRetentionSeconds=7*24*60*60;

async function refreshFeed(cache:Cache,key:Request,channel:keyof typeof feedChannels,feedUrl:string,env:Env):Promise<Response>{
  if(!env.APIFY_TOKEN)throw new Error('APIFY_TOKEN is not configured');
  const response=await fetch('https://api.apify.com/v2/acts/harvestapi~linkedin-company-posts/run-sync-get-dataset-items?timeout=60&maxTotalChargeUsd=0.05',{method:'POST',headers:{'content-type':'application/json',Authorization:`Bearer ${env.APIFY_TOKEN}`},body:JSON.stringify({targetUrls:[feedUrl],maxPosts:6,scrapeReactions:false,scrapeComments:false}),signal:AbortSignal.timeout(65000)});
  if(!response.ok)throw new Error(`Apify feed refresh failed with status ${response.status}`);
  const raw=await response.json<LinkedInPost[]>();
  const items=raw.filter(post=>post.type==='post').map(post=>mapLinkedInPost(post,feedUrl)).filter(post=>post.text||post.image||post.video).sort((a,b)=>(Date.parse(b.time)||0)-(Date.parse(a.time)||0)).slice(0,6);
  if(!items.length)throw new Error('LinkedIn returned no usable posts');
  const refreshedAt=new Date().toISOString();
  const result=Response.json({items,channel,updatedAt:refreshedAt,mappingVersion:3},{headers:{'Cache-Control':`public, max-age=${feedRetentionSeconds}`,'X-Feed-Refreshed-At':refreshedAt}});
  await cache.put(key,result.clone());return result;
}

function feedResponse(response:Response,state:'fresh'|'stale'|'miss'):Response{
  const headers=new Headers(response.headers);headers.set('Cache-Control','public, max-age=300');headers.set('X-Feed-Cache',state);
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

async function refreshStaleFeed(cache:Cache,key:Request,lockKey:Request,channel:keyof typeof feedChannels,feedUrl:string,env:Env):Promise<void>{
  if(await cache.match(lockKey))return;
  await cache.put(lockKey,new Response('refreshing',{headers:{'Cache-Control':'public, max-age=60'}}));
  try{await refreshFeed(cache,key,channel,feedUrl,env);}catch(error){console.error('social_feed_refresh_failed',{channel,error:error instanceof Error?error.message:String(error)});}finally{await cache.delete(lockKey);}
}

async function socialFeed(request:Request,env:Env,ctx:ExecutionContext):Promise<Response>{
  const channel=(new URL(request.url).searchParams.get('channel')??'linkedin') as keyof typeof feedChannels;const feedUrl=feedChannels[channel];if(!feedUrl)return Response.json({error:'Unknown channel'},{status:404});
  const cache=(caches as unknown as{default:Cache}).default;const key=new Request(`https://feed-cache.resqprotec.local/v4/${channel}`);const cached=await cache.match(key);
  if(cached){
    const refreshedAt=Date.parse(cached.headers.get('X-Feed-Refreshed-At')??'');const stale=!Number.isFinite(refreshedAt)||Date.now()-refreshedAt>=feedFreshMs;
    if(stale){const lockKey=new Request(`https://feed-cache.resqprotec.local/v4/${channel}/refreshing`);ctx.waitUntil(refreshStaleFeed(cache,key,lockKey,channel,feedUrl,env));}
    return feedResponse(cached,stale?'stale':'fresh');
  }
  try{return feedResponse(await refreshFeed(cache,key,channel,feedUrl,env),'miss');}catch(error){console.error('social_feed_initial_fetch_failed',{channel,error:error instanceof Error?error.message:String(error)});return Response.json({items:[],error:'Feed temporarily unavailable'},{status:502});}
}

// Expose only these films; byte ranges let browsers seek without downloading them all.
const films:Record<string,string>={'/api/brandfilm':'resque-watercraft-brandfilm.mp4','/api/servicecentrum':'rescue-watercraft-reddingsbrigade-service-center.mp4'};
async function film(request:Request,env:Env,key:string):Promise<Response>{
  if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405,headers:{Allow:'GET, HEAD'}});
  const meta=await env.WEBSITE_ASSETS.head(key);
  if(!meta)return new Response('Film unavailable',{status:404});
  const headers=new Headers({'Content-Type':'video/mp4','Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600','ETag':meta.httpEtag,'Last-Modified':meta.uploaded.toUTCString(),'Content-Length':String(meta.size),'X-Content-Type-Options':'nosniff'});
  if(request.headers.get('If-None-Match')===meta.httpEtag)return new Response(null,{status:304,headers});
  if(request.method==='HEAD')return new Response(null,{headers});
  let range:{offset:number;length:number}|undefined;
  const rangeHeader=request.headers.get('Range');
  const ifRange=request.headers.get('If-Range');
  if(rangeHeader&&(!ifRange||ifRange===meta.httpEtag||ifRange===meta.uploaded.toUTCString())){
    const match=/^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{'Content-Range':`bytes */${meta.size}`}});
    const start=match[1]?Number(match[1]):Math.max(0,meta.size-Number(match[2]));
    const end=match[1]&&match[2]?Math.min(Number(match[2]),meta.size-1):meta.size-1;
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=meta.size||end<start)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${meta.size}`}});
    range={offset:start,length:end-start+1};
    headers.set('Content-Range',`bytes ${start}-${end}/${meta.size}`);
    headers.set('Content-Length',String(range.length));
  }
  const object=await env.WEBSITE_ASSETS.get(key,range?{range}:undefined);
  if(!object)return new Response('Film unavailable',{status:404});
  return new Response(object.body,{status:range?206:200,headers});
}

// Hosts: the canonical host serves the site; www 301s onto it. Until LIVE is "true" the
// concept hosts serve the site too, with X-Robots-Tag: noindex so nothing competes with
// the canonical host in the index. Once LIVE is "true" they 301 there, path preserved.
// Redirects only on https: `wrangler dev` serves the route hosts over plain http and
// would otherwise bounce local testing to production.
// Where a path lives now: the default language carries no prefix (/en/contact on an
// English-default build is /contact), and Dutch was on `/` before English took over, so
// an old Dutch-only address (/actueel) is its /nl/ page. Anything else stays as it is.
async function currentPath(path:string,env:Env):Promise<string>{
  const defaultLang=env.DEFAULT_LANG??'nl';
  const unprefixed=path.match(new RegExp(`^/${defaultLang}(/.*)?$`));if(unprefixed)return unprefixed[1]||'/';
  if(defaultLang==='nl'||/^\/(nl|de)(\/|$)/.test(path))return path;
  const exists=async(p:string)=>(await env.ASSETS.fetch(new Request(`https://${env.CANONICAL_HOST}${p}`,{method:'HEAD'}))).ok;
  return !(await exists(path))&&await exists(`/nl${path}`)?`/nl${path}`:path;
}
// /sitemap-old.xml on a concept host: every URL that host ever served (today's pages plus
// the Dutch-on-`/` and `/en/` addresses from before English became the default). Submitted
// in Search Console under the jouwidealewebsite.nl domain property, it makes Google
// recrawl them, find the 301s and drop them; tools/indexnow.mjs --host reads it for Bing.
async function oldSitemap(url:URL,env:Env):Promise<Response>{
  const sitemap=await (await env.ASSETS.fetch(new Request(`https://${env.CANONICAL_HOST}/sitemap.xml`))).text();
  const paths=[...sitemap.matchAll(/<loc>https:\/\/[^/<]+([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
  const legacy=paths.flatMap(p=>p==='/nl'||p.startsWith('/de')?[]:p.startsWith('/nl/')?[p.slice(3)]:[p==='/'?'/en':`/en${p}`]);
  const urls=[...new Set([...paths,...legacy])].map(p=>`<url><loc>${url.origin}${p}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
}
async function hostRedirect(url:URL,env:Env):Promise<Response|undefined>{
  if(url.protocol!=='https:'||url.hostname===env.CANONICAL_HOST)return undefined;
  // The IndexNow key answers on every host, so the concept hosts' old URLs can be
  // submitted for a recrawl that finds the 301 (tools/indexnow.mjs --host).
  if(/^\/[0-9a-f]{32}\.txt$/.test(url.pathname))return undefined;
  if(url.pathname==='/sitemap-old.xml'&&url.hostname!==`www.${env.CANONICAL_HOST}`)return oldSitemap(url,env);
  // One hop straight to where the page lives now, so an old concept URL never chains.
  if(url.hostname===`www.${env.CANONICAL_HOST}`||env.LIVE==='true')return Response.redirect(`https://${env.CANONICAL_HOST}${await currentPath(url.pathname,env)}${url.search}`,301);
  return undefined;
}
// rescuewatercraft.nl (and www) is the Dutch way in: every URL there 301s, in one hop,
// to the Dutch page on the canonical host. A Dutch page that exists under /nl wins, then
// the same path if it exists (/de/kontakt), and anything else (an old URL from before
// this site) lands on the Dutch home page rather than a 404.
async function dutchHostRedirect(url:URL,env:Env):Promise<Response|undefined>{
  const hosts=(env.DUTCH_HOSTS??'').split(',').map(host=>host.trim()).filter(Boolean);
  if(!hosts.includes(url.hostname))return undefined;
  const exists=async(path:string)=>(await env.ASSETS.fetch(new Request(`https://${env.CANONICAL_HOST}${path}`,{method:'HEAD'}))).ok;
  const path=url.pathname.replace(/\/+$/,'')||'/';
  const dutch=(env.DEFAULT_LANG??'nl')==='nl'?path:path==='/'?'/nl':path.startsWith('/nl/')||path==='/nl'?path:`/nl${path}`;
  const target=await exists(dutch)?dutch:path!=='/'&&await exists(path)?path:(env.DEFAULT_LANG??'nl')==='nl'?'/':'/nl';
  return Response.redirect(`https://${env.CANONICAL_HOST}${target}${url.search}`,301);
}
function withNoindex(response:Response,url:URL,env:Env):Response{
  if(url.hostname===env.CANONICAL_HOST)return response;
  const headers=new Headers(response.headers);headers.set('X-Robots-Tag','noindex');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

export default{async fetch(request,env,ctx){
  const url=new URL(request.url);
  const dutchRedirect=await dutchHostRedirect(url,env);if(dutchRedirect)return dutchRedirect;
  const filmKey=films[url.pathname];if(filmKey)return film(request,env,filmKey);
  if(url.pathname==='/api/social-feed'&&request.method==='GET')return socialFeed(request,env,ctx);
  const defaultLang=env.DEFAULT_LANG??'nl';
  const worker=formWorker(url.pathname,url.origin,defaultLang);if(worker)return worker.fetch!(request,env,ctx);
  const redirect=await hostRedirect(url,env);if(redirect)return redirect;
  const response=await env.ASSETS.fetch(request);
  // Only a miss can be an old address; a page that exists is served without a lookup.
  if(response.status===404){const path=await currentPath(url.pathname,env);if(path!==url.pathname)return Response.redirect(`${url.origin}${path}${url.search}`,301);}
  return withNoindex(response,url,env);
}} satisfies ExportedHandler<Env>;
