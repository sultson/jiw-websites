export type Service = {
  id: string;
  name: string;
  icon: 'sparkles' | 'gem' | 'layers' | 'hand' | 'palette' | 'flower';
  desc: string;
  tags: string[];
};

export const services: Service[] = [
  {
    id: 'gellak',
    name: 'Gellak',
    icon: 'sparkles',
    desc: 'Een strakke, glanzende kleurlaag die weken mooi blijft. Dun en stevig op je eigen nagel, zonder dat het zwaar aanvoelt.',
    tags: ['Lange houdbaarheid', 'Hoogglans'],
  },
  {
    id: 'biab',
    name: 'BIAB & builder gel',
    icon: 'gem',
    desc: 'Een verstevigende laag die je eigen nagel beschermt en rustig laat groeien. Ideaal voor een verzorgde, natuurlijke look.',
    tags: ['Versterkt', 'Natuurlijk resultaat'],
  },
  {
    id: 'acryl',
    name: 'Acryl & nagelverlenging',
    icon: 'layers',
    desc: 'Lengte en vorm helemaal naar jouw wens. Sterke nagels die bestand zijn tegen alles wat je dag van je vraagt.',
    tags: ['Op maat', 'Stevig & duurzaam'],
  },
  {
    id: 'manicure',
    name: 'Manicure & nagelverzorging',
    icon: 'hand',
    desc: 'Verzorgde nagelriemen, de juiste vorm en gladde nagels. De basis voor mooie, gezonde handen.',
    tags: ['Verzorgd', 'Persoonlijk advies'],
  },
  {
    id: 'nailart',
    name: 'Handgeschilderde nail art',
    icon: 'palette',
    desc: 'French, chrome, glitter of een design met de hand geschilderd. Van subtiel tot uitgesproken, helemaal van jou.',
    tags: ['Uniek ontwerp', 'Met de hand'],
  },
  {
    id: 'pedicure',
    name: 'Pedicure & voetverzorging',
    icon: 'flower',
    desc: 'Verzorgde voeten met aandacht voor eelt en nagels, met een fijne, ontspannen afwerking.',
    tags: ['Eeltverwijdering', 'Ontspannend'],
  },
];
