import type { SiteContent } from '../types';
import { core } from './core';
import { immigration } from './immigration';
import { housing } from './housing';
import { relocation } from './relocation';
import { industrial } from './industrial';
import { business } from './business';
import { vip } from './vip';
import { guides } from './guides';

export const fr: SiteContent = {
  core,
  immigration,
  housing,
  relocation,
  industrial,
  business,
  vip,
  guides,
};
