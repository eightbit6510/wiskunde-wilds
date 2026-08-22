import { loadPart2LessonsFromContent, loadSideMissionsFromContent } from '../../content/loader';

/** @deprecated Hoofdlessen gemigreerd naar src/content/ — zie docs/FASE-1.md */
export { chapter1 } from './chapter1';
export { chapter2 } from './chapter2';
export { chapter3 } from './chapter3';
export { chapter4 } from './chapter4';
export { chapter5 } from './chapter5';
export { chapter6 } from './chapter6';
export { chapter7 } from './chapter7';
export { chapter8 } from './chapter8';

/** @deprecated Alleen nog voor export/parity — zie docs/FASE-1.md */
export {
  sideMissionKonijnenpad,
  sideMissionMaansteen,
  sideMissionUilenproef,
  sideMissionVossenhol,
} from './sideMissions';

export const part2Lessons = loadPart2LessonsFromContent();
export const part2SideMissions = loadSideMissionsFromContent();
