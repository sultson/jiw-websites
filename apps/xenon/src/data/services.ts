export type Service = {
  id: string;
  image: string;
  titleKey: string;
  subKey: string;
  bodyKey: string;
};

export const services: ReadonlyArray<Service> = [
  {
    id: 'portier',
    image: '/work/portier-host.webp',
    titleKey: 'svc.portier.title',
    subKey: 'svc.portier.sub',
    bodyKey: 'svc.portier.body',
  },
  {
    id: 'night',
    image: '/work/nachtportier.webp',
    titleKey: 'svc.night.title',
    subKey: 'svc.night.sub',
    bodyKey: 'svc.night.body',
  },
  {
    id: 'traffic',
    image: '/work/verkeersregelaar.webp',
    titleKey: 'svc.traffic.title',
    subKey: 'svc.traffic.sub',
    bodyKey: 'svc.traffic.body',
  },
  {
    id: 'retail',
    image: '/work/winkelbeveiliging.webp',
    titleKey: 'svc.retail.title',
    subKey: 'svc.retail.sub',
    bodyKey: 'svc.retail.body',
  },
  {
    id: 'personal',
    image: '/work/persoonlijke-beveiliging.webp',
    titleKey: 'svc.personal.title',
    subKey: 'svc.personal.sub',
    bodyKey: 'svc.personal.body',
  },
];
