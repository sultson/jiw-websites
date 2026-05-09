import type { LucideIcon } from 'lucide-react';
import {
  Brush,
  Layers,
  Sparkles,
  PanelTop,
  Hammer,
} from 'lucide-react';

export type ServiceKey = 'paint' | 'wall' | 'spray' | 'glass' | 'heritage';

export type Service = {
  key: ServiceKey;
  number: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  { key: 'paint',    number: '01', icon: Brush },
  { key: 'wall',     number: '02', icon: Layers },
  { key: 'spray',    number: '03', icon: Sparkles },
  { key: 'glass',    number: '04', icon: PanelTop },
  { key: 'heritage', number: '05', icon: Hammer },
];
