export type ServiceCategory = {
  id: 'nails' | 'brows' | 'care';
  titleKey: string;
  services: ServiceItem[];
};

export type ServiceItem = {
  id: string;
  nameKey: string;
  descKey: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'nails',
    titleKey: 'cat.nails',
    services: [
      { id: 'gellak',      nameKey: 'svc.gellak',      descKey: 'svc.gellakDesc' },
      { id: 'biab',        nameKey: 'svc.biab',        descKey: 'svc.biabDesc' },
      { id: 'kunstnagels', nameKey: 'svc.kunstnagels', descKey: 'svc.kunstnagelsDesc' },
      { id: 'opvullen',    nameKey: 'svc.opvullen',    descKey: 'svc.opvullenDesc' },
      { id: 'french',      nameKey: 'svc.french',      descKey: 'svc.frenchDesc' },
      { id: 'removal',     nameKey: 'svc.removal',     descKey: 'svc.removalDesc' },
    ],
  },
  {
    id: 'brows',
    titleKey: 'cat.brows',
    services: [
      { id: 'browstyle', nameKey: 'svc.browStyle', descKey: 'svc.browStyleDesc' },
      { id: 'browlam',   nameKey: 'svc.browLam',   descKey: 'svc.browLamDesc' },
      { id: 'lashlift',  nameKey: 'svc.lashLift',  descKey: 'svc.lashLiftDesc' },
    ],
  },
  {
    id: 'care',
    titleKey: 'cat.care',
    services: [
      { id: 'dadi', nameKey: 'svc.dadi', descKey: 'svc.dadiDesc' },
    ],
  },
];
