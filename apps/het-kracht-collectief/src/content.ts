export type Lang = "nl" | "en";
export type Profile = "werknemer" | "werkgever";

export const SITE_URL = "https://het-kracht-collectief.jouwidealewebsite.nl";
export const FORM_ENDPOINT = "/api/forms/aanvraag";

// ── Dutch (primary) ──────────────────────────────────────────────────────────
const nl = {
  nav: {
    aanpak: "Aanpak",
    sectoren: "Sectoren",
    werknemer: "Werkzoekend",
    werkgever: "Werkgever",
    contact: "Contact",
    menu: "Menu",
    close: "Sluiten",
    cta: "Aanvraag starten",
    copied: "Gekopieerd",
    primaryNav: "Hoofdmenu",
    mobileNav: "Mobiel menu",
    skip: "Naar inhoud",
  },
  langLabel: "Taal",
  slogan: ["Mensen kennen.", "Afspraken nakomen.", "Verschil maken."],
  hero: {
    label: "Voor werkgevers & werkzoekenden",
    headline: { pre: "Wij brengen ", emp: "werkgevers", mid: " en ", seek: "werkzoekenden", post: " samen." },
    intro:
      "Met persoonlijk contact, transparante communicatie en oprechte betrokkenheid maken we matches die voor beide kanten werken.",
    pick: "Ik ben",
    werknemerBtn: "Werkzoekend",
    werkgeverBtn: "Werkgever",
  },
  globe: {
    label: "Werkgebied",
    title: "Heel Nederland",
    lines: ["Van Groningen tot Zeeland.", "Lokale kennis, landelijk bereik."],
  },
  paths: {
    label: "Twee kanten, één doel",
    title: "Kies uw richting",
    werknemer: {
      tag: "01 / Voor werkzoekenden",
      title: "Werk dat bij u past",
      text: "U heeft vakmanschap en wilt vooruit. Wij kennen de werkgevers die daarop zitten te wachten en begeleiden u persoonlijk.",
      cta: "Voor werkzoekenden",
      points: ["Persoonlijke begeleiding", "Werk bij u in de buurt"],
    },
    werkgever: {
      tag: "02 / Voor werkgevers",
      title: "Vakmensen die blijven",
      text: "U heeft handen nodig waarop u kunt bouwen. Wij kennen de mensen achter de cv's en plaatsen alleen wat past.",
      cta: "Voor werkgevers",
      points: ["Match op talent en cultuur", "Duurzame plaatsingen", "Inzicht en advies"],
    },
  },
  mission: {
    label: "Waar wij voor staan",
    missieTitle: "Missie",
    missie: [
      "Het Kracht Collectief brengt werkgevers en werkzoekenden samen. Door persoonlijk contact, transparante communicatie en oprechte betrokkenheid realiseren we duurzame matches die werken voor beide partijen.",
      "Naast arbeidsbemiddeling begeleiden we werkzoekenden praktisch met communicatie- en sollicitatievaardigheden, zodat zij sterker en zelfverzekerder de arbeidsmarkt betreden. Werkgevers ondersteunen we met inzichten en advies voor duurzame samenwerkingen.",
    ],
    visieTitle: "Visie",
    visie: [
      "Succesvolle arbeidsbemiddeling begint bij mensen. We kijken verder dan een vacature of cv en zoeken de juiste match op talent, motivatie, ervaring en organisatiecultuur.",
      "Niet iedereen heeft dezelfde route afgelegd, maar iedereen verdient de kans om zich te bewijzen. Door mensen en organisaties beter op elkaar aan te laten sluiten ontstaan plaatsingen waarin beide partijen groeien.",
      "Vertrouwen, transparantie en het nakomen van afspraken vormen de basis.",
    ],
  },
  pillars: {
    label: "Onze aanpak",
    title: "Geen systeem. Mensen.",
    items: [
      {
        n: "01",
        title: "Persoonlijk contact",
        text: "We leren mensen echt kennen, niet alleen hun cv. Een gesprek zegt meer dan een document.",
      },
      {
        n: "02",
        title: "Transparante communicatie",
        text: "Heldere afspraken en duidelijke verwachtingen. U weet altijd waar u aan toe bent.",
      },
      {
        n: "03",
        title: "Oprechte betrokkenheid",
        text: "We blijven betrokken na de plaatsing, zodat de match ook op de lange termijn werkt.",
      },
      {
        n: "04",
        title: "Duurzame matches",
        text: "We zoeken op talent, motivatie en cultuur. Plaatsingen die blijven, voor beide kanten.",
      },
    ],
  },
  sectors: {
    label: "Sectoren",
    title: "Waar wij actief zijn",
    intro:
      "We kennen de mensen en de bedrijven in deze sectoren. Vakgebieden waar betrouwbaarheid, ervaring en vakmanschap tellen.",
    groups: [
      { n: "01", title: "Bouw & Infra", items: ["Bouw & infra", "Steigerbouw", "Dakdekkers"] },
      { n: "02", title: "GWW & Verkeer", items: ["Grondverzet", "Wegenbouw", "Verkeersregelaars"] },
      { n: "03", title: "Techniek & Installatie", items: ["Elektrotechniek", "Werktuigbouwkunde", "Installatietechniek"] },
      { n: "04", title: "Transport & Logistiek", items: ["Logistiek", "Magazijn", "Chauffeurs"] },
    ],
    note: "Staat uw vak er niet bij? We denken graag mee.",
  },
  band: {
    quote: "Niet iedereen heeft dezelfde route afgelegd. Iedereen verdient de kans om zich te bewijzen.",
    sub: "Uit onze visie.",
  },
  contact: {
    label: "Aan de slag",
    title: "Klaar om verder te komen?",
    text: "Kies uw richting. We reageren persoonlijk, geen standaard antwoord.",
  },
  footer: {
    tagline: "Persoonlijke arbeidsbemiddeling voor vakmensen in heel Nederland.",
    columns: { site: "Site", paths: "Aan de slag" },
    home: "Start",
    rights: "Alle rechten voorbehouden.",
    built: "Website door Jouw Ideale Website",
    kvk: "KvK 98231219",
  },
  form: {
    requiredLabel: "Verplicht veld",
    requiredNote: "Alleen uw naam is verplicht. De rest helpt ons sneller schakelen.",
    submit: "Aanvraag versturen",
    submitting: "Versturen…",
    successTitle: "Bedankt. Uw aanvraag staat binnen.",
    successBody: "We nemen persoonlijk contact met u op.",
    another: "Nog een aanvraag versturen",
    errorFallback: "Er ging iets mis. Probeer het opnieuw.",
    nameRequired: "Vul uw naam in.",
    emailInvalid: "Controleer uw e-mailadres.",
    privacy: "We gebruiken uw gegevens alleen om contact met u op te nemen over deze aanvraag.",
    optional: "Optioneel",
    required: "Verplicht",
    modalEyebrow: "Aanvraag",
    profileToggleLabel: "Ik ben",
    close: "Sluiten",
    upload: {
      label: "Bijlagen",
      hint: "Foto's of documenten, optioneel. Max 5 bestanden, 10 MB per stuk.",
      cta: "Bestanden kiezen",
      drop: "Sleep bestanden hierheen of kies ze",
      remove: "Verwijderen",
      tooMany: "Maximaal 5 bestanden. {n} overgeslagen.",
      tooLarge: "{n} bestand(en) groter dan 10 MB overgeslagen.",
      duplicate: "{n} duplicaat overgeslagen.",
    },
  },
  pages: {
    werknemer: {
      metaTitle: "Voor werkzoekenden | Het Kracht Collectief",
      metaDescription:
        "Op zoek naar werk in de bouw, infra of techniek? Het Kracht Collectief begeleidt u persoonlijk naar een baan die past. Laat uw gegevens achter.",
      back: "Terug naar start",
      heroLabel: "Voor werkzoekenden",
      heroTitle: ["Klaar voor uw", "volgende stap?"],
      heroIntro:
        "Geen nummer in een systeem, maar een persoon die we echt leren kennen. Wij kennen de werkgevers, u heeft het vakmanschap. Samen vinden we werk dat klopt.",
      valueTitle: "Wat u van ons krijgt",
      value: [
        { title: "Een eerlijk gesprek", text: "We luisteren naar wat u zoekt, wat u kunt en waar u naartoe wilt." },
        { title: "Een match die past", text: "We koppelen u aan werk dat aansluit op uw ervaring en uw leven, niet alleen op een vacature." },
        { title: "Begeleiding die werkt", text: "Hulp met uw communicatie- en sollicitatievaardigheden, zodat u zelfverzekerd binnenkomt." },
        { title: "Iemand die afspraken nakomt", text: "We blijven bereikbaar, ook nadat u geplaatst bent." },
      ],
      formTitle: "Stel uzelf voor",
      formIntro: "Laat uw gegevens achter, dan bellen we u voor een kennismaking.",
      switchText: "Bent u werkgever?",
      switchCta: "Naar werkgevers",
      fields: {
        name: { label: "Naam", ph: "Uw voor- en achternaam", hint: "Verplicht" },
        email: { label: "E-mail", ph: "naam@voorbeeld.nl", hint: "Waar kunnen we u mailen?" },
        phone: { label: "Telefoon", ph: "06 12 34 56 78", hint: "Telefonisch bereiken we u het snelst." },
        address: { label: "Woonplaats", ph: "Bijv. Rotterdam", hint: "Zo zoeken we werk bij u in de buurt." },
        message: { label: "Over u", ph: "Wat voor werk zoekt u, wat is uw ervaring en wanneer kunt u beginnen?", hint: "Optioneel, maar het helpt ons enorm." },
      },
    },
    werkgever: {
      metaTitle: "Voor werkgevers | Het Kracht Collectief",
      metaDescription:
        "Op zoek naar betrouwbare vakmensen voor uw sector? Het Kracht Collectief levert duurzame matches via persoonlijke arbeidsbemiddeling. Laat uw vraag achter.",
      back: "Terug naar start",
      heroLabel: "Voor werkgevers",
      heroTitle: ["Vakmensen", "die blijven"],
      heroIntro:
        "U heeft handen nodig waarop u kunt bouwen. Wij kennen de mensen achter de cv's en plaatsen alleen wat past. Zo voorkomt u verloop en bouwt u aan een team dat staat.",
      valueTitle: "Wat wij voor u doen",
      value: [
        { title: "Een match op maat", text: "We zoeken op talent, motivatie, ervaring en cultuur, zodat de plaatsing past bij uw organisatie." },
        { title: "Duurzame plaatsingen", text: "Minder verloop, meer continuïteit. We kijken verder dan de korte termijn." },
        { title: "Inzicht en advies", text: "We delen wat we zien op de arbeidsmarkt, zodat u betere keuzes maakt." },
        { title: "Afspraken die staan", text: "Heldere communicatie en nakomen wat we beloven. Daar draait het om." },
      ],
      formTitle: "Vertel ons wat u zoekt",
      formIntro: "Laat uw gegevens achter, dan nemen we contact op om uw vraag door te nemen.",
      switchText: "Bent u werkzoekend?",
      switchCta: "Naar werkzoekenden",
      fields: {
        name: { label: "Naam", ph: "Uw naam of contactpersoon", hint: "Verplicht" },
        email: { label: "E-mail", ph: "naam@bedrijf.nl", hint: "Uw zakelijke e-mailadres." },
        phone: { label: "Telefoon", ph: "010 123 45 67", hint: "Voor snel persoonlijk contact." },
        address: { label: "Bedrijf / regio", ph: "Bedrijfsnaam of werkgebied", hint: "Waar speelt de vraag?" },
        message: { label: "Uw vraag", ph: "Welke functie zoekt u, hoeveel mensen, in welke sector en per wanneer?", hint: "Optioneel, maar het versnelt ons antwoord." },
      },
    },
  },
};

// ── English ──────────────────────────────────────────────────────────────────
const en: typeof nl = {
  nav: {
    aanpak: "Approach",
    sectoren: "Sectors",
    werknemer: "Job seekers",
    werkgever: "Employers",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    cta: "Start a request",
    copied: "Copied",
    primaryNav: "Main menu",
    mobileNav: "Mobile menu",
    skip: "Skip to content",
  },
  langLabel: "Language",
  slogan: ["Know people.", "Keep promises.", "Make a difference."],
  hero: {
    label: "For employers & job seekers",
    headline: { pre: "We bring ", emp: "employers", mid: " and ", seek: "job seekers", post: " together." },
    intro:
      "With personal contact, transparent communication and genuine commitment, we make matches that work for both sides.",
    pick: "I am",
    werknemerBtn: "Job seeker",
    werkgeverBtn: "Employer",
  },
  globe: {
    label: "Coverage",
    title: "All of the Netherlands",
    lines: ["From Groningen to Zeeland.", "Local knowledge, national reach."],
  },
  paths: {
    label: "Two sides, one goal",
    title: "Choose your direction",
    werknemer: {
      tag: "01 / For job seekers",
      title: "Work that fits you",
      text: "You have the craft and want to move forward. We know the employers looking for exactly that, and we guide you personally.",
      cta: "For job seekers",
      points: ["Personal guidance", "Work close to home"],
    },
    werkgever: {
      tag: "02 / For employers",
      title: "Skilled people who stay",
      text: "You need hands you can build on. We know the people behind the CVs and only place what fits.",
      cta: "For employers",
      points: ["Matched on talent and culture", "Lasting placements", "Insight and advice"],
    },
  },
  mission: {
    label: "What we stand for",
    missieTitle: "Mission",
    missie: [
      "Het Kracht Collectief brings employers and job seekers together. Through personal contact, transparent communication and genuine commitment, we create lasting matches that work for both parties.",
      "Beyond placement, we coach job seekers on communication and application skills so they enter the labour market stronger and more confident. We support employers with insight and advice for lasting partnerships.",
    ],
    visieTitle: "Vision",
    visie: [
      "Successful recruitment starts with people. We look beyond a vacancy or a CV and search for the right match on talent, motivation, experience and company culture.",
      "Not everyone has taken the same route, but everyone deserves the chance to prove themselves. By aligning people and organisations better, we create placements in which both sides grow.",
      "Trust, transparency and keeping promises form the foundation.",
    ],
  },
  pillars: {
    label: "Our approach",
    title: "Not a system. People.",
    items: [
      { n: "01", title: "Personal contact", text: "We get to know people, not just their CV. A conversation says more than a document." },
      { n: "02", title: "Transparent communication", text: "Clear agreements and clear expectations. You always know where you stand." },
      { n: "03", title: "Genuine commitment", text: "We stay involved after the placement, so the match works for the long term too." },
      { n: "04", title: "Lasting matches", text: "We match on talent, motivation and culture. Placements that last, for both sides." },
    ],
  },
  sectors: {
    label: "Sectors",
    title: "Where we're active",
    intro:
      "We know the people and the companies in these sectors. Fields where reliability, experience and craftsmanship count.",
    groups: [
      { n: "01", title: "Construction & Infra", items: ["Construction & infra", "Scaffolding", "Roofing"] },
      { n: "02", title: "Civil & Traffic", items: ["Earthworks", "Road construction", "Traffic controllers"] },
      { n: "03", title: "Technical & Installation", items: ["Electrical", "Mechanical engineering", "Installation"] },
      { n: "04", title: "Transport & Logistics", items: ["Logistics", "Warehouse", "Drivers"] },
    ],
    note: "Don't see your trade? We're happy to think along.",
  },
  band: {
    quote: "Not everyone has taken the same route. Everyone deserves the chance to prove themselves.",
    sub: "From our vision.",
  },
  contact: {
    label: "Get started",
    title: "Ready to move forward?",
    text: "Choose your direction. We reply personally, never with a standard answer.",
  },
  footer: {
    tagline: "Personal recruitment for skilled trades across the Netherlands.",
    columns: { site: "Site", paths: "Get started" },
    home: "Home",
    rights: "All rights reserved.",
    built: "Website by Jouw Ideale Website",
    kvk: "CoC 98231219",
  },
  form: {
    requiredLabel: "Required field",
    requiredNote: "Only your name is required. The rest helps us move faster.",
    submit: "Send request",
    submitting: "Sending…",
    successTitle: "Thank you. We received your request.",
    successBody: "We will get in touch with you personally.",
    another: "Send another request",
    errorFallback: "Something went wrong. Please try again.",
    nameRequired: "Please enter your name.",
    emailInvalid: "Please check your email address.",
    privacy: "We only use your details to contact you about this request.",
    optional: "Optional",
    required: "Required",
    modalEyebrow: "Request",
    profileToggleLabel: "I am",
    close: "Close",
    upload: {
      label: "Attachments",
      hint: "Photos or documents, optional. Max 5 files, 10 MB each.",
      cta: "Choose files",
      drop: "Drag files here or pick them",
      remove: "Remove",
      tooMany: "Max 5 files. {n} skipped.",
      tooLarge: "{n} file(s) larger than 10 MB skipped.",
      duplicate: "{n} duplicate(s) skipped.",
    },
  },
  pages: {
    werknemer: {
      metaTitle: "For job seekers | Het Kracht Collectief",
      metaDescription:
        "Looking for work in construction, infra or technical trades? Het Kracht Collectief guides you personally to a job that fits. Leave your details.",
      back: "Back to start",
      heroLabel: "For job seekers",
      heroTitle: ["Ready for your", "next step?"],
      heroIntro:
        "Not a number in a system, but a person we genuinely get to know. We know the employers, you have the craft. Together we find work that fits.",
      valueTitle: "What you get from us",
      value: [
        { title: "An honest conversation", text: "We listen to what you're looking for, what you can do and where you want to go." },
        { title: "A match that fits", text: "We connect you to work that suits your experience and your life, not just a vacancy." },
        { title: "Guidance that works", text: "Help with your communication and application skills, so you walk in with confidence." },
        { title: "Someone who keeps promises", text: "We stay reachable, even after you've been placed." },
      ],
      formTitle: "Introduce yourself",
      formIntro: "Leave your details and we'll call you for an introduction.",
      switchText: "Are you an employer?",
      switchCta: "To employers",
      fields: {
        name: { label: "Name", ph: "Your first and last name", hint: "Required" },
        email: { label: "Email", ph: "name@example.com", hint: "Where can we email you?" },
        phone: { label: "Phone", ph: "06 12 34 56 78", hint: "Phone is the fastest way to reach you." },
        address: { label: "Town", ph: "e.g. Rotterdam", hint: "So we find work close to you." },
        message: { label: "About you", ph: "What work are you looking for, what's your experience and when can you start?", hint: "Optional, but it helps us a lot." },
      },
    },
    werkgever: {
      metaTitle: "For employers | Het Kracht Collectief",
      metaDescription:
        "Looking for reliable skilled workers for your sector? Het Kracht Collectief delivers lasting matches through personal recruitment. Leave your request.",
      back: "Back to start",
      heroLabel: "For employers",
      heroTitle: ["Skilled people", "who stay"],
      heroIntro:
        "You need hands you can build on. We know the people behind the CVs and only place what fits. That cuts turnover and builds a team that stands.",
      valueTitle: "What we do for you",
      value: [
        { title: "A tailored match", text: "We match on talent, motivation, experience and culture, so the placement fits your organisation." },
        { title: "Lasting placements", text: "Less turnover, more continuity. We look beyond the short term." },
        { title: "Insight and advice", text: "We share what we see in the labour market, so you make better decisions." },
        { title: "Agreements that hold", text: "Clear communication and keeping our word. That's what it comes down to." },
      ],
      formTitle: "Tell us what you need",
      formIntro: "Leave your details and we'll get in touch to discuss your request.",
      switchText: "Are you looking for work?",
      switchCta: "To job seekers",
      fields: {
        name: { label: "Name", ph: "Your name or contact person", hint: "Required" },
        email: { label: "Email", ph: "name@company.com", hint: "Your business email address." },
        phone: { label: "Phone", ph: "010 123 45 67", hint: "For quick personal contact." },
        address: { label: "Company / region", ph: "Company name or work area", hint: "Where is the need?" },
        message: { label: "Your request", ph: "Which role do you need, how many people, in which sector and from when?", hint: "Optional, but it speeds up our reply." },
      },
    },
  },
};

const dict = { nl, en };

export type Content = typeof nl;

export function getContent(lang: Lang): Content {
  return dict[lang];
}
