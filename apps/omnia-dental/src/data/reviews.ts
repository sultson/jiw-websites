import type { Review } from './types';

// Patient testimonials. Written as representative placeholders for the demo
// (real Google reviews can be swapped in later). Warm, specific, no hype.
export const reviews: Review[] = [
  {
    name: 'Sanne de Vries',
    context: { nl: 'Hoofddorp', en: 'Hoofddorp' },
    rating: 5,
    treatmentKey: 'angst-voor-de-tandarts',
    body: {
      nl: 'Ik liep jaren met angst voor de tandarts. Bij Omnia namen ze echt de tijd, legden alles rustig uit en stopten zodra ik dat aangaf. Voor het eerst ging ik ontspannen naar buiten.',
      en: 'I avoided the dentist for years out of fear. At Omnia they genuinely took their time, explained everything calmly and paused the moment I asked. For the first time I walked out relaxed.',
    },
  },
  {
    name: 'Mark Jansen',
    context: { nl: 'Nieuw-Vennep', en: 'Nieuw-Vennep' },
    rating: 5,
    treatmentKey: 'cerec',
    body: {
      nl: 'In één afspraak een nieuwe kroon, zonder tijdelijke kroon en zonder happen klei. De scan en het inslijpen gebeurden ter plekke. Ongelooflijk hoe soepel dat ging.',
      en: 'A new crown in a single appointment, no temporary crown and no trays of putty. The scan and milling happened on site. Remarkably smooth from start to finish.',
    },
  },
  {
    name: 'Priya Sharma',
    context: { nl: 'Haarlemmermeer', en: 'Haarlemmermeer' },
    rating: 5,
    treatmentKey: 'implantaten',
    body: {
      nl: 'Van het trekken tot het implantaat en de kroon, alles bij dezelfde tandarts onder één dak. Geen verwijzingen, geen gedoe. Naresh is precies en denkt echt met je mee.',
      en: 'From the extraction to the implant and the crown, all with the same dentist under one roof. No referrals, no hassle. Naresh is precise and truly thinks along with you.',
    },
  },
  {
    name: 'Tom Bakker',
    context: { nl: 'Hoofddorp', en: 'Hoofddorp' },
    rating: 5,
    treatmentKey: 'periodieke-controle',
    body: {
      nl: 'Eindelijk een praktijk waar je op tijd geholpen wordt en waar de controle grondig is. Vriendelijk team, moderne praktijk en duidelijke uitleg over wat er nodig is.',
      en: 'Finally a practice where you are seen on time and the check-up is thorough. Friendly team, a modern practice and clear explanations of what is needed.',
    },
  },
  {
    name: 'Lisa Hoekstra',
    context: { nl: 'Hoofddorp', en: 'Hoofddorp' },
    rating: 5,
    treatmentKey: 'facings',
    body: {
      nl: 'Mijn voortanden zaten me al lang dwars. Het resultaat met facings ziet er natuurlijk uit, niemand ziet dat er iets gedaan is. Ik lach weer zonder erbij na te denken.',
      en: 'My front teeth had bothered me for ages. The result with veneers looks natural, nobody can tell anything was done. I smile again without thinking twice.',
    },
  },
  {
    name: 'Ahmed El Idrissi',
    context: { nl: 'Nieuw-Vennep', en: 'Nieuw-Vennep' },
    rating: 5,
    treatmentKey: 'kindertandheelkunde',
    body: {
      nl: 'Onze dochter was bang, maar werd zo geduldig op haar gemak gesteld dat ze nu zelf vraagt wanneer ze weer mag. Een team dat goed met kinderen omgaat is goud waard.',
      en: 'Our daughter was scared, but she was put at ease so patiently that she now asks when she can go back. A team that is good with children is worth its weight in gold.',
    },
  },
  {
    name: 'Eva Smit',
    context: { nl: 'Haarlemmermeer', en: 'Haarlemmermeer' },
    rating: 5,
    treatmentKey: 'mondhygienist',
    body: {
      nl: 'De mondhygiëniste legde precies uit waar mijn tandvlees aandacht nodig had en gaf praktische tips. Mijn tandvlees is sindsdien echt rustiger geworden.',
      en: 'The hygienist explained exactly where my gums needed attention and gave practical tips. My gums have genuinely calmed down since then.',
    },
  },
  {
    name: 'Daan Vermeer',
    context: { nl: 'Hoofddorp', en: 'Hoofddorp' },
    rating: 5,
    treatmentKey: 'wortelkanaalbehandeling',
    body: {
      nl: 'Kwam met flinke kiespijn binnen en werd dezelfde dag geholpen. De wortelkanaalbehandeling verliep rustig en met goede verdoving. Top dat dit hier zelf kan.',
      en: 'I came in with bad toothache and was helped the same day. The root canal treatment went calmly and with good anaesthetic. Great that this is done here in-house.',
    },
  },
];
