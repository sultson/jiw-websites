import type { ServiceContent } from '../content/types';

type Block = { title: string; text: string };
type Step = { title: string; text: string };
type Faq = { q: string; a: string };

interface VisaCopy {
  menuLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  intro: string[];
  cardText: string;
  explainerTitle: string;
  explainerText: string[];
  forWhoTitle: string;
  forWho: string[];
  conditionsTitle: string;
  conditionsIntro: string;
  conditions: string[];
  includedTitle: string;
  included: Block[];
  processTitle: string;
  process: Step[];
  feeTitle: string;
  tailored: string;
  feeNote: string;
  feeIncludes: string[];
  note: string;
  faqTitle: string;
  faq: Faq[];
  ctaTitle: string;
  ctaText: string;
  ctaLabel: string;
  imageAlt: string;
  image2Alt: string;
}

interface LocaleCopy {
  artist: VisaCopy;
  athlete: VisaCopy;
}

const copy: Record<'en' | 'nl', LocaleCopy> = {
  en: {
    artist: {
      menuLabel: 'Artist visa',
      title: 'Artist Visa Netherlands',
      metaTitle: 'Artist Visa Netherlands | Performers & Creative Professionals',
      metaDescription:
        'Personal guidance for artists and performers working in the Netherlands. We assess the right Schengen, TWV, GVVA or self-employed route and coordinate the file.',
      eyebrow: 'Artists and performers',
      intro: [
        'There is no single Dutch permit officially called an artist visa. The right route depends on your nationality, how long you will stay, whether you are employed or self-employed, and the exact work you will perform.',
        'We turn that combination into one practical plan. For performers, musicians, dancers, actors, directors and other creative professionals, we assess the immigration and work-permit position before contracts and travel dates become fixed.',
      ],
      cardText: 'The right Dutch work and residence route for performers, artists and creative professionals.',
      explainerTitle: 'What does “artist visa” mean in the Netherlands?',
      explainerText: [
        'For non-EU artists in paid employment, a short engagement may require a Schengen visa and usually a TWV work permit. Work and residence beyond 90 days normally run through a combined residence and work permit, the GVVA, with the Dutch employer acting as sponsor.',
        'A genuinely self-employed artist follows a different residence route. The IND asks whether the work is of essential interest to Dutch culture and seeks advice from the Ministry of Education, Culture and Science. EU, EEA and Swiss nationals have free movement and do not need these permits.',
      ],
      forWhoTitle: 'Who this is for',
      forWho: [
        'Musicians, singers, actors, dancers and other performing artists booked in the Netherlands',
        'Directors, choreographers, designers and senior cultural professionals joining a Dutch organisation',
        'Self-employed artists with Dutch commissions or a relationship with a qualifying cultural institution',
        'Dutch employers, venues and producers bringing in talent from outside the EU, EEA or Switzerland',
      ],
      conditionsTitle: 'The route depends on the engagement',
      conditionsIntro: 'We establish these facts before choosing a form or promising a timeline.',
      conditions: [
        'Nationality determines whether free movement applies and whether a short-stay visa or MVV is needed.',
        'For paid work up to 90 days, the Dutch employer usually applies to UWV for a TWV. A limited exemption can apply to short performances of no more than six consecutive weeks within thirteen weeks.',
        'For paid work longer than 90 days, art and culture employees generally need a GVVA, which combines residence and work permission.',
        'The employer may need to show recruitment efforts. An accelerated route can apply to top performers who meet the relevant salary benchmark.',
        'Self-employed artists must satisfy the IND test for essential interest to Dutch culture and support the application with Dutch assignments and cultural evidence.',
      ],
      includedTitle: 'What we take care of',
      included: [
        { title: 'Route assessment', text: 'We classify the engagement by nationality, duration, employment status and role, then identify the correct visa, TWV, GVVA or self-employed route.' },
        { title: 'Contract and evidence review', text: 'We review the Dutch contract, schedule, salary position and cultural evidence before the employer or artist files.' },
        { title: 'Employer coordination', text: 'Where a sponsor or work permit is required, we keep the venue, producer, HR team and applicant on one document list and timeline.' },
        { title: 'Entry and arrival', text: 'We coordinate the visa or MVV stage, biometrics, residence-card collection and family applications where relevant.' },
      ],
      processTitle: 'How it works',
      process: [
        { title: 'Engagement scan', text: 'Send us the contract or booking, dates, nationality and current residence status.' },
        { title: 'Route decision', text: 'We confirm the correct immigration and work-permit route and flag any weak point before filing.' },
        { title: 'File preparation', text: 'We assemble the evidence with you and the Dutch sponsor, employer or cultural institution.' },
        { title: 'Decision and arrival', text: 'We follow the application and coordinate the appointments that turn approval into a lawful start.' },
      ],
      feeTitle: 'Professional fee for an artist visa case',
      tailored: 'Tailor-made proposal',
      feeNote: 'The route may involve one short engagement, a sponsored GVVA or a self-employed cultural-interest assessment. We price the actual file after the route review.',
      feeIncludes: ['Written route and document plan', 'Application-file preparation and coordination', 'Follow-up with the employer and authorities through the decision'],
      note: 'Visa, work-permit and residence rules are separate. A visa that permits entry does not by itself authorise paid work. We verify both sides of the case against current IND and UWV requirements.',
      faqTitle: 'Artist visa questions',
      faq: [
        { q: 'Is there a special artist visa for the Netherlands?', a: 'Not as one standalone IND category. “Artist visa” is a useful search term, but the legal route is usually short stay plus a TWV, a GVVA for paid employment, or a self-employed residence permit.' },
        { q: 'Can an artist perform for a few weeks without a work permit?', a: 'A narrow TWV exemption can apply when an artist comes to perform for no more than six consecutive weeks within a thirteen-week period. The exemption does not automatically remove any visa requirement, and fixed rotating work is excluded.' },
        { q: 'Can a freelance artist apply without a Dutch employer?', a: 'Potentially, through the self-employed route. The artist must have Dutch assignments and show that the work is of essential interest to Dutch culture. The IND asks the culture ministry for advice.' },
      ],
      ctaTitle: 'Have a Dutch booking or cultural opportunity?',
      ctaText: 'Send us the engagement, dates and nationality. We will identify the route before a contract or travel plan locks you into the wrong one.',
      ctaLabel: 'Review my artist visa route',
      imageAlt: 'Creative professional preparing for an international engagement',
      image2Alt: 'Private consultation about a Dutch artist visa application',
    },
    athlete: {
      menuLabel: 'Athlete visa',
      title: 'Athlete Visa Netherlands',
      metaTitle: 'Athlete Visa Netherlands | Elite Sport Work Permits',
      metaDescription:
        'Personal guidance for professional athletes and clubs using the Dutch TWV or GVVA route. Eligibility, contract evidence, work permits and relocation coordinated.',
      eyebrow: 'Professional sport',
      intro: [
        'The Netherlands does not issue one permit officially named an athlete visa. A professional athlete from outside the EU, EEA or Switzerland normally needs the correct entry document plus permission to work, with the route determined by the length and nature of the engagement.',
        'We coordinate the immigration file with the club, employer, agent and athlete, and connect it to housing, registration and family relocation so a transfer works off the field as well as on it.',
      ],
      cardText: 'Dutch work and residence permits for professional athletes, coaches, clubs and their families.',
      explainerTitle: 'What is the Dutch athlete visa route?',
      explainerText: [
        'For professional work of up to 90 days, the Dutch employer generally applies to UWV for a TWV. For employment beyond 90 days, the employer applies for a GVVA, the combined residence and work permit. A short competition appearance can fall within a limited TWV exemption.',
        'Professional footballers have specific league, age, playing-history and salary rules. Other elite athletes must join the highest Dutch competition, be at least 18, show experience at an equivalent level or national-team selection, and meet the applicable salary benchmark.',
      ],
      forWhoTitle: 'Who this is for',
      forWho: [
        'Professional footballers transferring to an Eredivisie or Eerste Divisie club',
        'Elite athletes joining the highest Dutch competition in their sport',
        'Coaches and sports professionals whose work needs a separate immigration assessment',
        'Clubs, employers and agents coordinating a non-EU athlete and accompanying family',
      ],
      conditionsTitle: 'What decides the work permit',
      conditionsIntro: 'Elite-sport rules are specific, and the evidence must match the exact role and competition.',
      conditions: [
        'EU, EEA and Swiss nationals have free movement. Other nationalities may need a visa or MVV as well as work permission.',
        'Work up to 90 days generally uses a TWV; employment longer than 90 days generally uses a GVVA.',
        'A competition-only exemption can apply for no more than six consecutive weeks within thirteen weeks, but it does not cover every contract or remove visa rules.',
        'Footballers must be at least 18 and meet UWV rules on league level, playing history or national-team selection, salary and employer-provided housing.',
        'Other elite athletes must be at least 18, compete at the highest Dutch level, show equivalent experience or national selection, meet the salary benchmark and receive suitable housing.',
      ],
      includedTitle: 'What we take care of',
      included: [
        { title: 'Eligibility review', text: 'We test the competition, role, career evidence, salary, duration and nationality against the current UWV and IND route.' },
        { title: 'Club and contract file', text: 'We coordinate the draft employment agreement, sporting evidence, salary documents and housing commitment with the club or employer.' },
        { title: 'TWV or GVVA coordination', text: 'We build one filing plan for the employer and athlete, including any visa or MVV stage and authority follow-up.' },
        { title: 'Family and relocation', text: 'We align partner and child applications with housing, municipality registration, BSN and practical arrival support.' },
      ],
      processTitle: 'How it works',
      process: [
        { title: 'Transfer scan', text: 'We review the offer, sport, competition, dates, nationality and accompanying family.' },
        { title: 'Eligibility decision', text: 'We confirm the TWV, GVVA or exemption route and list the evidence the club must supply.' },
        { title: 'Application file', text: 'We coordinate the athlete, agent and employer until the contract and supporting documents are filing-ready.' },
        { title: 'Landing plan', text: 'We follow the decision and arrange the residence and relocation steps around the reporting date.' },
      ],
      feeTitle: 'Professional fee for an athlete visa case',
      tailored: 'Tailor-made proposal',
      feeNote: 'A short competition, club transfer and family relocation have different permit and coordination needs. We quote after checking the contract and competition.',
      feeIncludes: ['Written eligibility and document plan', 'TWV or GVVA file coordination with the employer', 'Follow-up through the decision and arrival planning'],
      note: 'UWV salary and competition rules can change by season. We verify the figures and evidence requirements in force when the employer applies instead of publishing a number that may go stale.',
      faqTitle: 'Athlete visa questions',
      faq: [
        { q: 'Does every professional athlete qualify for a Dutch work permit?', a: 'No. Football and other elite sports have specific age, competition-level, experience, salary and housing conditions. The athlete and the Dutch employer must satisfy the route together.' },
        { q: 'Is a TWV enough for a full-season contract?', a: 'Usually not when the athlete will live and work in the Netherlands for more than 90 days. Longer employment normally requires a GVVA, which combines residence and work permission.' },
        { q: 'Can the athlete’s family move at the same time?', a: 'Often yes, depending on the main permit and family relationship. We prepare the applications on one timeline and connect them to the family’s registration and housing plan.' },
      ],
      ctaTitle: 'Planning a Dutch transfer or competition?',
      ctaText: 'Send us the offer, sport, competition, dates and nationality. We will identify the permit route and what the club must prove.',
      ctaLabel: 'Review my athlete visa route',
      imageAlt: 'Professional athlete arriving for an international transfer',
      image2Alt: 'Advisor reviewing a Dutch athlete work permit file',
    },
  },
  nl: {
    artist: {
      menuLabel: 'Artiestenvisum',
      title: 'Artiestenvisum Nederland',
      metaTitle: 'Artiestenvisum Nederland | Artiesten & Creatieve Professionals',
      metaDescription: 'Persoonlijke begeleiding voor artiesten die in Nederland werken. Wij bepalen de juiste Schengen-, TWV-, GVVA- of zelfstandigenroute en coördineren het dossier.',
      eyebrow: 'Artiesten en performers',
      intro: [
        'Er bestaat niet één Nederlandse vergunning die officieel artiestenvisum heet. De juiste route hangt af van uw nationaliteit, de verblijfsduur, of u in loondienst of zelfstandig werkt en welke werkzaamheden u precies uitvoert.',
        'Wij maken van die combinatie één praktisch plan. Voor musici, dansers, acteurs, regisseurs en andere creatieve professionals beoordelen wij de immigratie- en werkvergunningspositie voordat contracten en reisdata vaststaan.',
      ],
      cardText: 'De juiste Nederlandse werk- en verblijfsroute voor artiesten en creatieve professionals.',
      explainerTitle: 'Wat betekent “artiestenvisum” in Nederland?',
      explainerText: [
        'Voor artiesten van buiten de EU in loondienst kan een kort optreden een Schengenvisum en meestal een TWV vereisen. Werk en verblijf langer dan 90 dagen lopen doorgaans via een gecombineerde vergunning voor verblijf en arbeid, de GVVA, waarbij de Nederlandse werkgever referent is.',
        'Een werkelijk zelfstandig artiest volgt een andere verblijfsroute. De IND beoordeelt of het werk van wezenlijk belang is voor de Nederlandse cultuur en vraagt advies aan het ministerie van Onderwijs, Cultuur en Wetenschap. EU-, EER- en Zwitserse burgers hebben vrij verkeer.',
      ],
      forWhoTitle: 'Voor wie dit is',
      forWho: ['Musici, zangers, acteurs, dansers en andere uitvoerende artiesten met Nederlands werk', 'Regisseurs, choreografen, ontwerpers en culturele professionals bij een Nederlandse organisatie', 'Zelfstandige artiesten met Nederlandse opdrachten of een relatie met een geschikte culturele instelling', 'Nederlandse werkgevers, podia en producenten die talent van buiten Europa aantrekken'],
      conditionsTitle: 'De opdracht bepaalt de route',
      conditionsIntro: 'Wij stellen deze feiten vast voordat wij een formulier kiezen of een tijdlijn beloven.',
      conditions: [
        'De nationaliteit bepaalt of vrij verkeer geldt en of een kort verblijfvisum of MVV nodig is.',
        'Voor werk tot 90 dagen vraagt de Nederlandse werkgever meestal een TWV aan bij UWV. Voor korte optredens van maximaal zes aaneengesloten weken binnen dertien weken kan een beperkte vrijstelling gelden.',
        'Voor werk in loondienst langer dan 90 dagen hebben werknemers in kunst en cultuur doorgaans een GVVA nodig.',
        'De werkgever kan wervingsinspanningen moeten aantonen. Voor topartiesten die aan de salarisnorm voldoen kan een versnelde route gelden.',
        'Zelfstandige artiesten moeten voldoen aan de IND-toets van wezenlijk cultureel belang en Nederlandse opdrachten en culturele onderbouwing aanleveren.',
      ],
      includedTitle: 'Wat wij voor u regelen',
      included: [
        { title: 'Routebeoordeling', text: 'Wij kwalificeren de opdracht op nationaliteit, duur, arbeidsrelatie en rol en bepalen daarna de juiste visum-, TWV-, GVVA- of zelfstandigenroute.' },
        { title: 'Contract en bewijsstukken', text: 'Wij beoordelen het Nederlandse contract, programma, salaris en culturele bewijs voordat de werkgever of artiest indient.' },
        { title: 'Afstemming met de werkgever', text: 'Waar een referent of werkvergunning nodig is, houden wij podium, producent, HR en aanvrager op één stukkenlijst en tijdlijn.' },
        { title: 'Inreis en aankomst', text: 'Wij coördineren het visum of de MVV, biometrie, het ophalen van de verblijfskaart en gezinsaanvragen waar nodig.' },
      ],
      processTitle: 'Zo werkt het',
      process: [
        { title: 'Opdrachtscan', text: 'Stuur ons het contract of de boeking, data, nationaliteit en huidige verblijfsstatus.' },
        { title: 'Routebesluit', text: 'Wij bevestigen de juiste immigratie- en werkvergunningsroute en signaleren zwakke punten vóór indiening.' },
        { title: 'Dossiervoorbereiding', text: 'Wij stellen het bewijs samen met u en de Nederlandse referent, werkgever of culturele instelling.' },
        { title: 'Besluit en aankomst', text: 'Wij volgen de aanvraag en coördineren de afspraken die de goedkeuring omzetten in een rechtmatige start.' },
      ],
      feeTitle: 'Honorarium voor een artiestenvisumdossier',
      tailored: 'Voorstel op maat',
      feeNote: 'De route kan bestaan uit één kort optreden, een GVVA in loondienst of een beoordeling van cultureel belang voor een zelfstandige. Wij prijzen het werkelijke dossier na de routebeoordeling.',
      feeIncludes: ['Schriftelijk route- en documentenplan', 'Voorbereiding en coördinatie van het aanvraagdossier', 'Opvolging met werkgever en instanties tot het besluit'],
      note: 'Visum-, werkvergunnings- en verblijfsregels staan los van elkaar. Een visum dat toegang geeft, geeft niet automatisch toestemming voor betaald werk. Wij toetsen beide kanten aan de actuele eisen van IND en UWV.',
      faqTitle: 'Vragen over het artiestenvisum',
      faq: [
        { q: 'Bestaat er een speciaal artiestenvisum voor Nederland?', a: 'Niet als één zelfstandige IND-categorie. Juridisch gaat het meestal om kort verblijf plus TWV, een GVVA voor arbeid in loondienst of een verblijfsvergunning als zelfstandige.' },
        { q: 'Kan een artiest enkele weken zonder werkvergunning optreden?', a: 'Een beperkte TWV-vrijstelling kan gelden bij optredens van maximaal zes aaneengesloten weken binnen dertien weken. De vrijstelling neemt een eventuele visumplicht niet weg en geldt niet voor vast roulerend werk.' },
        { q: 'Kan een freelance artiest zonder Nederlandse werkgever aanvragen?', a: 'Mogelijk, via de zelfstandigenroute. De artiest moet Nederlandse opdrachten hebben en aantonen dat het werk van wezenlijk belang is voor de Nederlandse cultuur.' },
      ],
      ctaTitle: 'Heeft u een Nederlandse boeking of culturele kans?',
      ctaText: 'Stuur ons de opdracht, data en nationaliteit. Wij bepalen de route voordat een contract of reisplan u aan de verkeerde route bindt.',
      ctaLabel: 'Laat mijn artiestenroute beoordelen',
      imageAlt: 'Creatieve professional die zich voorbereidt op een internationale opdracht',
      image2Alt: 'Privégesprek over een Nederlandse artiestenvisumaanvraag',
    },
    athlete: {
      menuLabel: 'Topsportersvisum',
      title: 'Topsportersvisum Nederland',
      metaTitle: 'Topsportersvisum Nederland | Werkvergunning voor Topsport',
      metaDescription: 'Persoonlijke begeleiding voor topsporters en clubs via de Nederlandse TWV- of GVVA-route. Voorwaarden, contract, werkvergunning en relocatie gecoördineerd.',
      eyebrow: 'Professionele sport',
      intro: [
        'Nederland kent niet één vergunning die officieel topsportersvisum heet. Een professionele sporter van buiten de EU, EER of Zwitserland heeft doorgaans het juiste inreisdocument én toestemming om te werken nodig. De duur en aard van de opdracht bepalen de route.',
        'Wij coördineren het immigratiedossier met club, werkgever, zaakwaarnemer en sporter en koppelen het aan huisvesting, inschrijving en gezinsrelocatie.',
      ],
      cardText: 'Nederlandse werk- en verblijfsvergunningen voor topsporters, clubs en hun gezinnen.',
      explainerTitle: 'Wat is de Nederlandse topsportersroute?',
      explainerText: [
        'Voor professioneel werk tot 90 dagen vraagt de Nederlandse werkgever doorgaans een TWV aan bij UWV. Bij arbeid langer dan 90 dagen vraagt de werkgever een GVVA aan, de gecombineerde verblijfs- en werkvergunning. Een kort wedstrijdoptreden kan onder een beperkte vrijstelling vallen.',
        'Profvoetballers hebben specifieke eisen voor competitie, leeftijd, wedstrijdverleden en salaris. Andere topsporters moeten uitkomen in de hoogste Nederlandse competitie, minimaal 18 zijn, ervaring op gelijkwaardig niveau of nationale selectie aantonen en voldoen aan de salarisnorm.',
      ],
      forWhoTitle: 'Voor wie dit is',
      forWho: ['Profvoetballers die overstappen naar een club in de Eredivisie of Eerste Divisie', 'Topsporters die toetreden tot de hoogste Nederlandse competitie in hun sport', 'Coaches en sportprofessionals voor wie een afzonderlijke immigratiebeoordeling nodig is', 'Clubs, werkgevers en zaakwaarnemers die een niet-Europese sporter en gezin begeleiden'],
      conditionsTitle: 'Wat de werkvergunning bepaalt',
      conditionsIntro: 'De topsportregels zijn specifiek en het bewijs moet precies passen bij de rol en competitie.',
      conditions: [
        'EU-, EER- en Zwitserse burgers hebben vrij verkeer. Andere nationaliteiten kunnen naast werktoestemming een visum of MVV nodig hebben.',
        'Werk tot 90 dagen verloopt doorgaans via een TWV; arbeid langer dan 90 dagen doorgaans via een GVVA.',
        'Voor uitsluitend deelname aan wedstrijden kan een vrijstelling gelden tot zes aaneengesloten weken binnen dertien weken, maar niet voor elk contract.',
        'Voetballers moeten minimaal 18 zijn en voldoen aan UWV-eisen voor competitieniveau, wedstrijdverleden of nationale selectie, salaris en huisvesting.',
        'Andere topsporters moeten minimaal 18 zijn, op het hoogste Nederlandse niveau uitkomen, gelijkwaardige ervaring of nationale selectie aantonen, de salarisnorm halen en geschikte huisvesting krijgen.',
      ],
      includedTitle: 'Wat wij voor u regelen',
      included: [
        { title: 'Toets van de voorwaarden', text: 'Wij toetsen competitie, rol, loopbaanbewijs, salaris, duur en nationaliteit aan de actuele UWV- en IND-route.' },
        { title: 'Club- en contractdossier', text: 'Wij stemmen arbeidsovereenkomst, sportbewijs, salarisstukken en huisvestingsverklaring af met club of werkgever.' },
        { title: 'TWV- of GVVA-coördinatie', text: 'Wij maken één indieningsplan voor werkgever en sporter, inclusief visum- of MVV-fase en opvolging bij instanties.' },
        { title: 'Gezin en relocatie', text: 'Wij stemmen partner- en kindaanvragen af met huisvesting, gemeente-inschrijving, BSN en praktische aankomst.' },
      ],
      processTitle: 'Zo werkt het',
      process: [
        { title: 'Transferscan', text: 'Wij beoordelen aanbod, sport, competitie, data, nationaliteit en meereizend gezin.' },
        { title: 'Toelatingsbesluit', text: 'Wij bevestigen de TWV-, GVVA- of vrijstellingsroute en noemen het bewijs dat de club moet leveren.' },
        { title: 'Aanvraagdossier', text: 'Wij coördineren sporter, zaakwaarnemer en werkgever tot contract en bewijsstukken indieningsklaar zijn.' },
        { title: 'Aankomstplan', text: 'Wij volgen het besluit en plannen verblijfs- en relocatiestappen rond de meldingsdatum.' },
      ],
      feeTitle: 'Honorarium voor een topsportersvisumdossier',
      tailored: 'Voorstel op maat',
      feeNote: 'Een korte wedstrijd, clubtransfer en gezinsrelocatie hebben andere vergunnings- en coördinatiebehoeften. Wij offreren na toetsing van contract en competitie.',
      feeIncludes: ['Schriftelijk voorwaarden- en documentenplan', 'TWV- of GVVA-coördinatie met de werkgever', 'Opvolging tot het besluit en planning van de aankomst'],
      note: 'UWV-salaris- en competitie-eisen kunnen per seizoen wijzigen. Wij toetsen de bedragen en bewijsregels die gelden wanneer de werkgever aanvraagt.',
      faqTitle: 'Vragen over het topsportersvisum',
      faq: [
        { q: 'Komt iedere professionele sporter in aanmerking?', a: 'Nee. Voetbal en andere topsporten kennen specifieke eisen voor leeftijd, competitieniveau, ervaring, salaris en huisvesting. Sporter en Nederlandse werkgever moeten samen voldoen.' },
        { q: 'Is een TWV genoeg voor een contract van een heel seizoen?', a: 'Doorgaans niet wanneer de sporter langer dan 90 dagen in Nederland woont en werkt. Langere arbeid vereist meestal een GVVA.' },
        { q: 'Kan het gezin tegelijk meeverhuizen?', a: 'Vaak wel, afhankelijk van de hoofdvergunning en gezinsrelatie. Wij zetten de aanvragen op één tijdlijn en koppelen ze aan registratie en huisvesting.' },
      ],
      ctaTitle: 'Plant u een Nederlandse transfer of wedstrijd?',
      ctaText: 'Stuur ons aanbod, sport, competitie, data en nationaliteit. Wij bepalen de vergunningsroute en wat de club moet aantonen.',
      ctaLabel: 'Laat mijn topsportersroute beoordelen',
      imageAlt: 'Professionele sporter die aankomt voor een internationale transfer',
      image2Alt: 'Adviseur die een Nederlands werkvergunningsdossier voor een sporter beoordeelt',
    },
  },
};

function service(slug: string, c: VisaCopy, image: string, image2: string): ServiceContent {
  return {
    slug,
    menuLabel: c.menuLabel,
    title: c.title,
    metaTitle: c.metaTitle,
    metaDescription: c.metaDescription,
    eyebrow: c.eyebrow,
    intro: c.intro,
    cardText: c.cardText,
    explainer: { title: c.explainerTitle, text: c.explainerText },
    forWho: { title: c.forWhoTitle, items: c.forWho },
    conditions: { title: c.conditionsTitle, intro: c.conditionsIntro, items: c.conditions },
    included: { title: c.includedTitle, blocks: c.included },
    process: { title: c.processTitle, steps: c.process },
    fees: {
      title: c.feeTitle,
      kind: 'tailored',
      amount: c.tailored,
      amountNote: c.feeNote,
      includes: c.feeIncludes,
    },
    note: c.note,
    faq: { title: c.faqTitle, items: c.faq },
    cta: { title: c.ctaTitle, text: c.ctaText, label: c.ctaLabel },
    form: 'immigration',
    image,
    imageAlt: c.imageAlt,
    image2,
    image2Alt: c.image2Alt,
  };
}

export function specialistVisaServices(lang: 'en' | 'nl'): ServiceContent[] {
  const c = copy[lang];
  return [
    service('artist-visa-netherlands', c.artist, '/images/vip-concierge.jpg', '/images/consultation.jpg'),
    service('athlete-visa-netherlands', c.athlete, '/images/vip-hub.jpg', '/images/relocation-arrival.jpg'),
  ];
}
