export type ProjectImage = {
  src: string;
  altNl: string;
  altEn: string;
};

export type Project = {
  id: string;
  titleNl: string;
  titleEn: string;
  typeNl: string;
  typeEn: string;
  location: string;
  descNl: string;
  descEn: string;
  /** when set, renders a before/after comparison slider */
  compare?: {
    beforeSrc: string;
    afterSrc: string;
    beforeLabel: 'before' | 'during';
    /** 'portrait' | 'landscape' — controls the slider aspect ratio */
    orientation: 'portrait' | 'landscape';
    altNl: string;
    altEn: string;
  };
  /** gallery images (shown in lightbox + thumbnails) */
  gallery: ProjectImage[];
};

export const projects: Project[] = [
  {
    id: 'gevelrenovatie',
    titleNl: 'Gevelrenovatie van voor tot na',
    titleEn: 'Facade renovation, before and after',
    typeNl: 'Gevelrenovatie',
    typeEn: 'Facade renovation',
    location: 'Breda',
    descNl: 'Een gedateerde voorgevel kreeg een complete renovatie. Wij plaatsten de steiger, vernieuwden het metsel- en voegwerk en zetten witte kozijnen terug. Het resultaat is een strakke, frisse gevel die de woning jaren vooruit helpt.',
    descEn: 'A dated front facade received a complete renovation. We set up the scaffolding, renewed the brick and pointing work and fitted white window frames. The result is a sharp, fresh facade that moves the home years forward.',
    compare: {
      beforeSrc: '/projects/facade-renovation-before.webp',
      afterSrc: '/projects/facade-renovation-after.webp',
      beforeLabel: 'before',
      orientation: 'portrait',
      altNl: 'Gevelrenovatie voor en na in Breda',
      altEn: 'Facade renovation before and after in Breda',
    },
    gallery: [
      { src: '/projects/facade-renovation-before.webp', altNl: 'Voorgevel met steiger tijdens de renovatie', altEn: 'Front facade with scaffolding during renovation' },
      { src: '/projects/facade-renovation-after.webp', altNl: 'Volledig gerenoveerde voorgevel in zwart-wit', altEn: 'Fully renovated front facade in black and white' },
      { src: '/projects/facade-windows-01.webp', altNl: 'Afgewerkte gevel met nieuwe wit omlijste raampartij', altEn: 'Finished facade with new white-framed window wall' },
    ],
  },
  {
    id: 'dakrenovatie',
    titleNl: 'Dakrenovatie tijdens en na',
    titleEn: 'Roof renovation, during and after',
    typeNl: 'Dakrenovatie',
    typeEn: 'Roof renovation',
    location: 'Regio Breda',
    descNl: 'Een dak dat aan vervanging toe was, hebben wij volledig gerenoveerd. Tijdens het werk bleef de woning waterdicht, en na oplevering ligt er een strak afgewerkt dak dat weer jaren meegaat.',
    descEn: 'A roof due for replacement was fully renovated by us. During the work the home stayed watertight, and after handover there is a sharply finished roof ready to last for years.',
    compare: {
      beforeSrc: '/projects/roof-renovation-during.webp',
      afterSrc: '/projects/roof-renovation-after.webp',
      beforeLabel: 'during',
      orientation: 'landscape',
      altNl: 'Dakrenovatie tijdens en na in de regio Breda',
      altEn: 'Roof renovation during and after in the Breda region',
    },
    gallery: [
      { src: '/projects/roof-renovation-during.webp', altNl: 'Dakrenovatie in uitvoering met nieuwe panlatten', altEn: 'Roof renovation in progress with new battens' },
      { src: '/projects/roof-renovation-after.webp', altNl: 'Afgerond dak met nieuwe antracietkleurige dakpannen', altEn: 'Finished roof with new anthracite tiles' },
    ],
  },
  {
    id: 'keuken-tuindoorbraak',
    titleNl: 'Open keuken met doorbraak naar de tuin',
    titleEn: 'Open kitchen with an opening to the garden',
    typeNl: 'Keukenrenovatie',
    typeEn: 'Kitchen renovation',
    location: 'Breda',
    descNl: 'Een gesloten keuken werd opengebroken en verbonden met de tuin. Wij verzorgden de doorbraak, het leidingwerk en de plaatsing van de keuken. Een lichte, ruime kookplek die in verbinding staat met buiten.',
    descEn: 'A closed kitchen was opened up and connected to the garden. We handled the opening, the pipework and the kitchen installation. A bright, spacious cooking space connected to the outdoors.',
    gallery: [
      { src: '/projects/kitchen-open-02.webp', altNl: 'Witte keuken met zwart werkblad en grote raampartij naar de tuin', altEn: 'White kitchen with black worktop and large window onto the garden' },
      { src: '/projects/kitchen-open-01.webp', altNl: 'Strakke witte open keuken met inbouwapparatuur', altEn: 'Sleek white open-plan kitchen with built-in appliances' },
      { src: '/projects/kitchen-living-renovation-01.webp', altNl: 'Gerenoveerde keuken en woonruimte met nieuwe vloer', altEn: 'Renovated kitchen and living space with new floor' },
    ],
  },
  {
    id: 'badkamer-toilet',
    titleNl: 'Badkamer en toilet, compleet verbouwd',
    titleEn: 'Bathroom and toilet, fully renovated',
    typeNl: 'Badkamerrenovatie',
    typeEn: 'Bathroom renovation',
    location: 'Regio Breda',
    descNl: 'Een badkamer en toilet zijn van de grond af opnieuw opgebouwd. Wij regelden het leidingwerk en het tegelwerk, met een inloopdouche en een warme houtlook afwerking. Strak, waterdicht en klaar voor dagelijks gebruik.',
    descEn: 'A bathroom and toilet were rebuilt from the ground up. We handled the pipework and tiling, with a walk-in shower and a warm wood-look finish. Sharp, watertight and ready for daily use.',
    gallery: [
      { src: '/projects/bathroom-shower-01.webp', altNl: 'Inloopdouche met glazen wand en lichte wandtegels', altEn: 'Walk-in shower with glass screen and light wall tiles' },
      { src: '/projects/toilet-renovation-01.webp', altNl: 'Gerenoveerd toilet met houtlook-achterwand', altEn: 'Renovated toilet with wood-look back wall' },
      { src: '/projects/toilet-renovation-02.webp', altNl: 'Toilet met houten achterwand en ingebouwde nis', altEn: 'Toilet with wooden back wall and built-in recessed shelf' },
    ],
  },
  {
    id: 'zolderverbouwing',
    titleNl: 'Zolder uitgetimmerd tot volwaardige ruimte',
    titleEn: 'Attic built out into a full living space',
    typeNl: 'Zolderverbouwing',
    typeEn: 'Attic conversion',
    location: 'Roosendaal',
    descNl: 'Een onafgewerkte zolder werd een volwaardige kamer. Wij timmerden de wanden uit, plaatsten kozijnen en werkten het houtwerk strak af. Twee kleinere ruimtes werden samengevoegd tot één lichte kamer.',
    descEn: 'An unfinished attic became a full room. We built out the walls, installed window frames and finished the timberwork sharply. Two smaller spaces were merged into one bright room.',
    gallery: [
      { src: '/projects/attic-renovation-during.webp', altNl: 'Zolderrenovatie met nieuwe houten spanten', altEn: 'Attic renovation with new timber trusses' },
      { src: '/projects/interior-finished-01.webp', altNl: 'Afgewerkt interieur met houten vloer en wandelement', altEn: 'Finished interior with wooden floor and wall panel' },
      { src: '/projects/attic-floor-worker.webp', altNl: 'Timmerman die een nieuwe houten vloer legt op de zolder', altEn: 'Carpenter laying a new wooden floor in the attic' },
    ],
  },
];

/** Team / company photos for the About section. */
export const teamPhotos: ProjectImage[] = [
  { src: '/projects/team-lunch-break.webp', altNl: 'Teamleden tijdens de lunchpauze', altEn: 'Team members during their lunch break' },
  { src: '/projects/company-cars-completed-project.webp', altNl: 'Bedrijfsbus voor een afgerond rijtjeshuisproject', altEn: 'Company van in front of a completed townhouse project' },
  { src: '/projects/company-cars-facade-project.webp', altNl: 'Twee bedrijfsbussen bij een gevelproject met steiger', altEn: 'Two company vans at a facade project with scaffolding' },
];
