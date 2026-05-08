import type { LucideIcon } from 'lucide-react';
import { Home, Wrench, PaintRoller, ScanLine } from 'lucide-react';

export type ServiceCluster = {
  id: 'dak' | 'lood' | 'schilder' | 'inspect';
  /** Translation keys (label / sublabel / bullet keys) */
  labelKey: string;
  subKey: string;
  bulletKeys: string[];
  icon: LucideIcon;
};

export const services: ServiceCluster[] = [
  {
    id: 'dak',
    labelKey: 'svc.dak',
    subKey: 'svc.dakSub',
    bulletKeys: ['svc.dak.1', 'svc.dak.2', 'svc.dak.3', 'svc.dak.4', 'svc.dak.5', 'svc.dak.6'],
    icon: Home,
  },
  {
    id: 'lood',
    labelKey: 'svc.lood',
    subKey: 'svc.loodSub',
    bulletKeys: ['svc.lood.1', 'svc.lood.2', 'svc.lood.3', 'svc.lood.4'],
    icon: Wrench,
  },
  {
    id: 'schilder',
    labelKey: 'svc.schilder',
    subKey: 'svc.schilderSub',
    bulletKeys: ['svc.schilder.1', 'svc.schilder.2', 'svc.schilder.3', 'svc.schilder.4'],
    icon: PaintRoller,
  },
  {
    id: 'inspect',
    labelKey: 'svc.inspect',
    subKey: 'svc.inspectSub',
    bulletKeys: ['svc.inspect.1', 'svc.inspect.2', 'svc.inspect.3', 'svc.inspect.4', 'svc.inspect.5', 'svc.inspect.6'],
    icon: ScanLine,
  },
];

/** Service options for the intake form select */
export const serviceFormOptions: { value: string; labelKey: string }[] = [
  { value: 'dak', labelKey: 'svc.dak' },
  { value: 'lood', labelKey: 'svc.lood' },
  { value: 'schilder', labelKey: 'svc.schilder' },
  { value: 'inspect', labelKey: 'svc.inspect' },
  { value: 'other', labelKey: 'ct.serviceOther' },
];
