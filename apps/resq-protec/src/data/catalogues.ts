import coursesRaw from '../../courses_and_trainings_catalogue.md?raw';
import equipmentRaw from '../../equipment_catalogue.md?raw';
import type { Lang } from './content';

export type Course = { title: string; originalTitle: string; category: string; details: Record<string, string>; source?: string; image?: string; summary: string };
export type Product = { name: string; originalName: string; category: string; url: string; image: string; summary: string; specifications: string[] };

const pageSlug = (url: string) => new URL(url).pathname.split('/').filter(Boolean).at(-1);
const ignoredCourseHeadings = new Set(['Overzicht', 'Aandachtspunten uit de bron']);

const courseCategories: Record<string, string> = {
  'Reddingsdiensten en overheid': 'Emergency services and government',
  'Veiligheid, maritiem en industrie': 'Safety, maritime and industry',
  'EHBO en BHV': 'First aid and emergency response',
};

const courseEnglish: Record<string, [string, string]> = {
  'Opleiding Oppervlakteredder': ['Surface Water Rescuer', 'Learn to carry out safe, team-based surface water rescues with the correct personal protective equipment.'],
  'Train de trainer oppervlakteredding': ['Surface Water Rescue – Train the Trainer', 'Prepare experienced rescuers to instruct and assess surface water rescue skills within their own organisation.'],
  'Opleiding grijpredding': ['Reach Rescue Course', 'Practise safe casualty recovery from the bank without unnecessarily entering the water.'],
  'Train de trainer Grijpredding': ['Reach Rescue – Train the Trainer', 'Qualify experienced professionals to deliver and assess reach rescue instruction.'],
  'Opleiding Bemanning Brandweerhulpboot': ['Fire Rescue Boat Crew', 'Develop the practical boat-handling, communication and casualty-recovery skills required of rescue boat crew.'],
  'Training Schipper Brandweerhulpboot': ['Fire Rescue Boat Skipper', 'Train skippers to manoeuvre, lead the crew and conduct rescue boat operations safely.'],
  'Opleiding Waterongevallenbestrijding voor leidinggevenden': ['Water Incident Command for Officers', 'Update incident commanders on risk, coordination and decision-making at water-related emergencies.'],
  'Training ijsredding': ['Ice Rescue Training', 'Perform ice rescues safely as a team, including self-rescue and casualty treatment.'],
  'Scenario-oefeningen': ['Scenario-based Exercises', 'Maintain operational competence through realistic exercises built around your organisation’s objectives.'],
  'Optreden en assisteren bij een waterongeval': ['Responding to and Assisting at Water Incidents', 'Help police, enforcement and government personnel recognise risks and assist safely at water incidents.'],
  'Opleiding veilig werken op en langs het water': ['Working Safely On and Around Water', 'Recognise water-related risks and prepare for rescue and self-rescue during waterside work.'],
  'Cursus veilig werken met een waadpak': ['Working Safely in Waders', 'Understand wader-specific risks and practise self-rescue after an accidental water entry.'],
  'Veiligheidswacht besloten ruimte': ['Confined Space Safety Attendant', 'Prepare safety attendants to supervise confined-space work and act correctly in an emergency.'],
  'Handelen bij ammoniakcalamiteiten voor BHV / First Responder': ['Ammonia Incident Response for Emergency Teams', 'Train first responders to control risk and act safely until specialist emergency services arrive.'],
  'Gasmeten voor BHV / First Responder': ['Gas Detection for Emergency Teams', 'Select and use gas-detection equipment, interpret readings and determine safe follow-up actions.'],
  'Medical Oxygen Provider': ['Medical Oxygen Provider', 'Provide emergency oxygen responsibly during drowning, intoxication and other incidents.'],
  'Adembescherming voor BHV / First Responder': ['Breathing Apparatus for Emergency Teams', 'Use self-contained breathing apparatus safely for guidance, incident response and rapid rescue.'],
  'Cursus veilig werken met ammoniak': ['Working Safely with Ammonia', 'Understand ammonia hazards, applicable procedures and safe working practices around refrigeration systems.'],
  'Veilig werken in besloten ruimten': ['Working Safely in Confined Spaces', 'Recognise confined-space hazards and work with permits, measurements and control measures.'],
  'EHBO en redding voor toezichthouders zwembaden': ['First Aid and Rescue for Pool Supervisors', 'Combine first aid with practical rescue skills for swimming-pool incidents.'],
  'Eerste hulp bij waterongevallen': ['First Aid for Water Incidents', 'Provide effective first aid for drowning, hypothermia and water-related trauma.'],
  'Automated External Defibrillation': ['Automated External Defibrillation', 'Recognise cardiac arrest and use an AED safely as part of resuscitation.'],
  'Basic Life Support': ['Basic Life Support', 'Practise high-quality resuscitation and essential life-saving actions.'],
};

const equipmentCategories: Record<string, string> = {
  'Accessoires':'Accessories','Beschermmmiddelen':'Protective equipment','Brancard':'Stretcher','Droogpakken':'Drysuits','EHBO materialen':'First-aid supplies','Extreme sporten':'Extreme sports','First Responder medische tassen':'First responder medical bags','Geen categorie':'Other equipment','Helmen':'Helmets','Persoonlijke beschermingsmiddelen (PBM) voor Industrie & Overheid':'PPE for industry and government','Reddingsboei':'Lifebuoys','Reddingsmaterialen':'Rescue equipment','Tassen & Koffers':'Bags and cases','Werplijnen en Haspels':'Throw lines and reels','Wervelplank':'Spine boards','Zwem en Redvesten':'Buoyancy aids and lifejackets',
};

const translateProductName = (name: string) => name
  .replace(/Grijpreddingpak Brandweer/gi,'Reach Rescue Suit – Fire Service').replace(/Railinghouder/gi,'rail bracket')
  .replace(/Opblaasbare Joon/gi,'Inflatable marker buoy').replace(/Opblaasbaar\b/gi,'Inflatable').replace(/drijfsysteem/gi,'flotation system').replace(/Sok voor/gi,'Sleeve for')
  .replace(/rugtas/gi,'backpack').replace(/donker blauw/gi,'navy blue').replace(/rood\s*[\/-]\s*zwart/gi,'red/black')
  .replace(/helm standaard/gi,'standard helmet').replace(/Oranje fluoriderend/gi,'fluorescent orange').replace(/waterschoen/gi,'water shoe')
  .replace(/Haspel met/gi,'Reel with')
  .replace(/Reddingshelm/gi,'Rescue Helmet').replace(/reddingsvest/gi,'lifejacket').replace(/reddingsboei/gi,'lifebuoy')
  .replace(/reddingsnet/gi,'rescue net').replace(/reddingsmaterialen/gi,'rescue equipment').replace(/werplijn/gi,'throw line')
  .replace(/brancard/gi,'stretcher').replace(/onderkleding/gi,'base layer').replace(/handschoenen/gi,'gloves')
  .replace(/waadpak/gi,'waders').replace(/droogzak/gi,'dry bag').replace(/hoofdlamp/gi,'headlamp')
  .replace(/nooddeken/gi,'emergency blanket').replace(/noodponcho/gi,'emergency poncho').replace(/vuilwerkpak/gi,'heavy-duty work suit')
  .replace(/opblaasbare/gi,'inflatable').replace(/hoofd immobilisatie systeem/gi,'head immobilisation system').replace(/veiligheidslijn/gi,'safety line')
  .replace(/\bvoor\b/gi,'for').replace(/\bmet\b/gi,'with');

const translateDuration = (value?: string) => {
  if (!value) return 'Duration agreed for the selected programme.';
  return value.replace(/één/gi,'one').replace(/twee/gi,'two').replace(/drie/gi,'three').replace(/dagdelen/gi,'half-days').replace(/dagdeel/gi,'half-day').replace(/dagen/gi,'days').replace(/dag/gi,'day').replace(/uur/gi,'hours').replace(/niet gespecificeerd.*$/gi,'agreed based on the programme.');
};

export function getCourses(lang: Lang = 'nl'): Course[] {
  const lines = coursesRaw.split('\n'); const result: Course[] = []; let category = ''; let current: Course | undefined;
  for (const line of lines) {
    if (line.startsWith('## ')) { const heading=line.slice(3).trim(); category=ignoredCourseHeadings.has(heading)?'':heading; }
    else if (category && line.startsWith('### ')) { const title=line.slice(4).trim(); current={title,originalTitle:title,category,details:{},summary:''}; result.push(current); }
    else if (current && line.startsWith('- **')) { const match=line.match(/^- \*\*(.+?):\*\*\s*(.*)$/); if(match)current.details[match[1]]=match[2].replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1'); const source=line.match(/\*\*Bron:\*\* \[[^\]]+\]\(([^)]+)\)/);if(source)current.source=source[1]; }
  }
  for (const course of result) {
    if(course.source)course.image=`/images/catalogue/courses/${pageSlug(course.source)}.jpg`;
    course.summary=course.details.Doel??course.details.Doelgroep??'Praktijkgerichte opleiding op maat van uw organisatie.';
    if(lang==='en') { const translated=courseEnglish[course.originalTitle]; course.title=translated?.[0]??course.originalTitle; course.summary=translated?.[1]??'Practical training tailored to your organisation.'; course.category=courseCategories[course.category]??course.category; course.details={Format:'Theory and practical instruction tailored to the operational context.',Duration:translateDuration(course.details.Duur),Audience:'Professionals and operational teams for whom this programme is relevant.',Location:course.details.Locatie?'At the client’s site or a suitable training venue by arrangement.':'Location agreed with the client.',Certification:course.details.Certificering||course.details.Toetsing?'Assessment and certification requirements are confirmed with the programme.':'Participation certificate or certification where applicable.'}; }
  }
  return result;
}

const productSummary = (category: string, lang: Lang) => lang==='nl'
  ? `Professioneel ${category.toLowerCase()} voor betrouwbare operationele inzet. Specificaties en maatvoering stemmen we af op uw team.`
  : `Professional ${category.toLowerCase()} selected for dependable operational use. Specifications and sizing are confirmed for your team.`;

export function getProducts(lang: Lang = 'nl'): Product[] {
  const lines=equipmentRaw.split('\n');const result:Product[]=[];let category='';
  for(const line of lines){if(line.startsWith('## ')&&!line.includes('Overzicht'))category=line.slice(3).trim();const match=line.match(/^- \[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);if(category&&match){const localizedCategory=lang==='en'?(equipmentCategories[category]??category):category;const name=lang==='en'?translateProductName(match[1]):match[1];result.push({name,originalName:match[1],category:localizedCategory,url:match[2],image:`/images/catalogue/equipment/${pageSlug(match[2])}.jpg`,summary:productSummary(localizedCategory,lang),specifications:lang==='nl'?['Professionele uitvoering','Geschikt voor operationeel gebruik','Beschikbaarheid en maatvoering op aanvraag']:['Professional-grade construction','Selected for operational use','Availability and sizing on request']});}}
  return result;
}
