import type { LucideIcon } from 'lucide-react';
import { Hammer, Bath, ChefHat, Home, DoorOpen, Ruler } from 'lucide-react';

export type Service = {
  id: 'verbouw' | 'badkamer' | 'keuken' | 'dak' | 'kozijnen' | 'maatwerk';
  labelKey: string;
  subKey: string;
  bulletKeys: string[];
  icon: LucideIcon;
  /** project image used as the card visual */
  image: string;
};

export const services: Service[] = [
  {
    id: 'verbouw',
    labelKey: 'svc.verbouw',
    subKey: 'svc.verbouwSub',
    bulletKeys: ['svc.verbouw.1', 'svc.verbouw.2', 'svc.verbouw.3', 'svc.verbouw.4', 'svc.verbouw.5', 'svc.verbouw.6'],
    icon: Hammer,
    image: '/projects/interior-renovation-during-01.webp',
  },
  {
    id: 'badkamer',
    labelKey: 'svc.badkamer',
    subKey: 'svc.badkamerSub',
    bulletKeys: ['svc.badkamer.1', 'svc.badkamer.2', 'svc.badkamer.3', 'svc.badkamer.4', 'svc.badkamer.5', 'svc.badkamer.6'],
    icon: Bath,
    image: '/projects/bathroom-shower-01.webp',
  },
  {
    id: 'keuken',
    labelKey: 'svc.keuken',
    subKey: 'svc.keukenSub',
    bulletKeys: ['svc.keuken.1', 'svc.keuken.2', 'svc.keuken.3', 'svc.keuken.4', 'svc.keuken.5', 'svc.keuken.6'],
    icon: ChefHat,
    image: '/projects/kitchen-open-02.webp',
  },
  {
    id: 'dak',
    labelKey: 'svc.dak',
    subKey: 'svc.dakSub',
    bulletKeys: ['svc.dak.1', 'svc.dak.2', 'svc.dak.3', 'svc.dak.4', 'svc.dak.5', 'svc.dak.6'],
    icon: Home,
    image: '/projects/roof-renovation-after.webp',
  },
  {
    id: 'kozijnen',
    labelKey: 'svc.kozijnen',
    subKey: 'svc.kozijnenSub',
    bulletKeys: ['svc.kozijnen.1', 'svc.kozijnen.2', 'svc.kozijnen.3', 'svc.kozijnen.4', 'svc.kozijnen.5', 'svc.kozijnen.6'],
    icon: DoorOpen,
    image: '/projects/facade-windows-01.webp',
  },
  {
    id: 'maatwerk',
    labelKey: 'svc.maatwerk',
    subKey: 'svc.maatwerkSub',
    bulletKeys: ['svc.maatwerk.1', 'svc.maatwerk.2', 'svc.maatwerk.3', 'svc.maatwerk.4', 'svc.maatwerk.5', 'svc.maatwerk.6'],
    icon: Ruler,
    image: '/projects/interior-built-in-cabinets.webp',
  },
];

/** Service options for the intake form select */
export const serviceFormOptions: { value: string; labelKey: string }[] = [
  { value: 'verbouw',  labelKey: 'ct.svc.verbouw' },
  { value: 'badkamer', labelKey: 'ct.svc.badkamer' },
  { value: 'keuken',   labelKey: 'ct.svc.keuken' },
  { value: 'dak',      labelKey: 'ct.svc.dak' },
  { value: 'kozijnen', labelKey: 'ct.svc.kozijnen' },
  { value: 'maatwerk', labelKey: 'ct.svc.maatwerk' },
  { value: 'anders',   labelKey: 'ct.svc.anders' },
];
