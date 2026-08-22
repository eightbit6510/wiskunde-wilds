import type { ClassLevel } from '../../src/types/content';

export type Band = 'basis' | 'mavo' | 'havo' | 'vwo';

export function bandFor(level: ClassLevel): Band {
  if (level.startsWith('groep')) return 'basis';
  if (level.startsWith('mavo')) return 'mavo';
  if (level.startsWith('havo')) return 'havo';
  return 'vwo';
}
