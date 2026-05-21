export type Service = {
  id: 'manage' | 'elevate' | 'boost';
  featureKeys: string[];
  highlight?: boolean;
};

export const services: Service[] = [
  {
    id: 'manage',
    featureKeys: [
      'services.manage.f1',
      'services.manage.f2',
      'services.manage.f3',
      'services.manage.f4',
      'services.manage.f5',
      'services.manage.f6',
      'services.manage.f7',
      'services.manage.f8',
      'services.manage.f9',
    ],
  },
  {
    id: 'elevate',
    highlight: true,
    featureKeys: [
      'services.elevate.f1',
      'services.elevate.f2',
      'services.elevate.f3',
      'services.elevate.f4',
      'services.elevate.f5',
      'services.elevate.f6',
      'services.elevate.f7',
      'services.elevate.f8',
      'services.elevate.f9',
      'services.elevate.f10',
    ],
  },
  {
    id: 'boost',
    featureKeys: [
      'services.boost.f1',
      'services.boost.f2',
      'services.boost.f3',
      'services.boost.f4',
      'services.boost.f5',
    ],
  },
];
