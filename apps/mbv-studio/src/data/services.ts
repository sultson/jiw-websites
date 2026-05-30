export type ServiceCategory = {
  id: string;
  icon: 'hand' | 'footprints' | 'palette' | 'flower';
  titleKey: string;
  bodyKey: string;
  itemKeys: string[];
  image: string;
  imageAlt: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'manicure',
    icon: 'hand',
    titleKey: 'svc.mani.title',
    bodyKey: 'svc.mani.body',
    itemKeys: ['svc.mani.i1', 'svc.mani.i2', 'svc.mani.i3', 'svc.mani.i4', 'svc.mani.i5'],
    image: '/service-manicure.webp',
    imageAlt: 'Manicure at MBV Studio',
  },
  {
    id: 'pedicure',
    icon: 'footprints',
    titleKey: 'svc.pedi.title',
    bodyKey: 'svc.pedi.body',
    itemKeys: ['svc.pedi.i1', 'svc.pedi.i2', 'svc.pedi.i3'],
    image: '/service-pedicure.webp',
    imageAlt: 'Pedicure at MBV Studio',
  },
  {
    id: 'design',
    icon: 'palette',
    titleKey: 'svc.design.title',
    bodyKey: 'svc.design.body',
    itemKeys: ['svc.design.i1', 'svc.design.i2', 'svc.design.i3', 'svc.design.i4'],
    image: '/service-design.webp',
    imageAlt: 'Nail design at MBV Studio',
  },
  {
    id: 'spa',
    icon: 'flower',
    titleKey: 'svc.spa.title',
    bodyKey: 'svc.spa.body',
    itemKeys: ['svc.spa.i1', 'svc.spa.i2', 'svc.spa.i3', 'svc.spa.i4'],
    image: '/service-spa.webp',
    imageAlt: 'Hand and foot SPA care at MBV Studio',
  },
];
