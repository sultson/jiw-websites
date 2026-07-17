import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
type Env=CloudflareFormsEnv&{ASSETS:Fetcher;APIFY_TOKEN?:string};

const common={siteName:'Resqprotec',ownerName:'Resqprotec',senderName:'Resqprotec',confirmationFollowUpSentence:'Een specialist van Resqprotec neemt binnen 24 tot 48 uur contact met u op.',messageField:'message',subjectFields:['subject','organisation'],requiredFields:[{name:'phone',label:'telefoonnummer',message:'Vul uw telefoonnummer in.'},{name:'subject',label:'onderwerp',message:'Maak een keuze of vul een onderwerp in.'},{name:'privacyConsent',label:'privacytoestemming',message:'Ga akkoord met de verwerking van uw gegevens.'}],emailFields:[{name:'phone',label:'Telefoon'},{name:'organisation',label:'Organisatie'},{name:'subject',label:'Onderwerp'},{name:'language',label:'Taal'},{name:'pageUrl',label:'Pagina'},{name:'privacyConsent',label:'Toestemming'}]};
const commonEn={...common,locale:'en' as const,confirmationFollowUpSentence:'A Resqprotec specialist will contact you within 24 to 48 hours.',requiredFields:[{name:'phone',label:'phone number',message:'Enter your phone number.'},{name:'subject',label:'subject',message:'Select an option or enter a subject.'},{name:'privacyConsent',label:'privacy consent',message:'Agree to the processing of your data.'}],emailFields:[{name:'phone',label:'Phone'},{name:'organisation',label:'Organisation'},{name:'subject',label:'Subject'},{name:'language',label:'Language'},{name:'pageUrl',label:'Page'},{name:'privacyConsent',label:'Consent'}]};
const workers:Record<string,ReturnType<typeof createFormWorker>>={
  '/api/forms/course':createFormWorker({...common,formPath:'/api/forms/course',subjectPrefix:'Nieuwe opleidingsaanvraag Resqprotec'}),
  '/api/forms/equipment':createFormWorker({...common,formPath:'/api/forms/equipment',subjectPrefix:'Nieuwe equipmentaanvraag Resqprotec'}),
  '/api/forms/contact':createFormWorker({...common,formPath:'/api/forms/contact',subjectPrefix:'Nieuw contactverzoek Resqprotec'}),
  '/api/forms/en/course':createFormWorker({...commonEn,formPath:'/api/forms/en/course',subjectPrefix:'New training request Resqprotec'}),
  '/api/forms/en/equipment':createFormWorker({...commonEn,formPath:'/api/forms/en/equipment',subjectPrefix:'New equipment request Resqprotec'}),
  '/api/forms/en/contact':createFormWorker({...commonEn,formPath:'/api/forms/en/contact',subjectPrefix:'New contact request Resqprotec'}),
};

const feedChannels={facebook:'https://www.facebook.com/resqprotec/'} as const;
const asUrl=(value:unknown)=>typeof value==='string'&&/^https?:\/\//.test(value)?value:'';
function findMedia(value:unknown,kind:'image'|'video',key=''):string{
  if(typeof value==='string'){
    const url=asUrl(value);if(!url)return '';
    const imageKey=/(image|photo|picture|thumbnail|preview|display|cover|poster|uri|src)/i.test(key);
    const videoKey=/(video|playable|dash|stream|mp4)/i.test(key);
    if(kind==='video'&&(videoKey||/\.mp4(?:\?|$)/i.test(url)))return url;
    if(kind==='image'&&imageKey&&!videoKey)return url;
    return '';
  }
  if(Array.isArray(value)){for(const entry of value){const found=findMedia(entry,kind,key);if(found)return found;}return '';}
  if(value&&typeof value==='object'){for(const [childKey,child] of Object.entries(value as Record<string,unknown>)){const found=findMedia(child,kind,childKey);if(found)return found;}}
  return '';
}

const feedFreshMs=6*60*60*1000;
const feedRetentionSeconds=7*24*60*60;

async function refreshFeed(cache:Cache,key:Request,channel:keyof typeof feedChannels,feedUrl:string,env:Env):Promise<Response>{
  if(!env.APIFY_TOKEN)throw new Error('APIFY_TOKEN is not configured');
  const response=await fetch(`https://api.apify.com/v2/acts/apify~facebook-posts-scraper/run-sync-get-dataset-items?token=${encodeURIComponent(env.APIFY_TOKEN)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({startUrls:[{url:feedUrl}],resultsLimit:6,viewOption:'CHRONOLOGICAL'})});
  if(!response.ok)throw new Error(`Apify feed refresh failed with status ${response.status}`);
  const raw=await response.json<Record<string,unknown>[]>();const items=raw.slice(0,9).map(post=>({text:String(post.text??post.postText??post.message??post.caption??''),url:String(post.url??post.postUrl??post.facebookUrl??feedUrl),time:String(post.time??post.timestamp??post.date??post.publishedAt??''),image:asUrl(post.image)||asUrl(post.photoUrl)||asUrl(post.thumbnail)||findMedia(post,'image'),video:asUrl(post.videoUrl)||asUrl(post.video)||findMedia(post,'video')})).filter(post=>post.text);
  const refreshedAt=new Date().toISOString();
  const result=Response.json({items,channel,updatedAt:refreshedAt,mappingVersion:2},{headers:{'Cache-Control':`public, max-age=${feedRetentionSeconds}`,'X-Feed-Refreshed-At':refreshedAt}});
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
  const channel=(new URL(request.url).searchParams.get('channel')??'facebook') as keyof typeof feedChannels;const feedUrl=feedChannels[channel];if(!feedUrl)return Response.json({error:'Unknown channel'},{status:404});
  const cache=(caches as unknown as{default:Cache}).default;const key=new Request(`https://feed-cache.resqprotec.local/v3/${channel}`);const cached=await cache.match(key);
  if(cached){
    const refreshedAt=Date.parse(cached.headers.get('X-Feed-Refreshed-At')??'');const stale=!Number.isFinite(refreshedAt)||Date.now()-refreshedAt>=feedFreshMs;
    if(stale){const lockKey=new Request(`https://feed-cache.resqprotec.local/v3/${channel}/refreshing`);ctx.waitUntil(refreshStaleFeed(cache,key,lockKey,channel,feedUrl,env));}
    return feedResponse(cached,stale?'stale':'fresh');
  }
  try{return feedResponse(await refreshFeed(cache,key,channel,feedUrl,env),'miss');}catch(error){console.error('social_feed_initial_fetch_failed',{channel,error:error instanceof Error?error.message:String(error)});return Response.json({items:[],error:'Feed temporarily unavailable'},{status:502});}
}

export default{async fetch(request,env,ctx){const url=new URL(request.url);if(url.pathname==='/api/social-feed'&&request.method==='GET')return socialFeed(request,env,ctx);const worker=workers[url.pathname];if(worker)return worker.fetch!(request,env,ctx);return env.ASSETS.fetch(request);}} satisfies ExportedHandler<Env>;
