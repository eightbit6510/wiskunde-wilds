export { chapter1 } from './chapter1';
export { chapter2 } from './chapter2';
export { chapter3 } from './chapter3';
export { chapter4 } from './chapter4';
export { chapter5 } from './chapter5';
export { chapter6 } from './chapter6';
export { chapter7 } from './chapter7';
export { chapter8 } from './chapter8';

export { part2SideMissions } from './sideMissions';

import { chapter1 } from './chapter1';
import { chapter2 } from './chapter2';
import { chapter3 } from './chapter3';
import { chapter4 } from './chapter4';
import { chapter5 } from './chapter5';
import { chapter6 } from './chapter6';
import { chapter7 } from './chapter7';
import { chapter8 } from './chapter8';
import type { Lesson } from '../../types';

export const part2Lessons: Lesson[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
];
