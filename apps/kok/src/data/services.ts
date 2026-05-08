export type ServiceKey = 'buiten' | 'binnen' | 'spray' | 'wand';

export type Service = {
  key: ServiceKey;
  /** Translation key prefix, e.g. svc.buiten / svc.buitenSub / svc.buiten.1..N */
  trKey: string;
  /** Number of bullet items defined under svc.<key>.1..N */
  itemCount: number;
};

export const services: Service[] = [
  { key: 'buiten', trKey: 'svc.buiten', itemCount: 4 },
  { key: 'binnen', trKey: 'svc.binnen', itemCount: 4 },
  { key: 'spray',  trKey: 'svc.spray',  itemCount: 4 },
  { key: 'wand',   trKey: 'svc.wand',   itemCount: 4 },
];
