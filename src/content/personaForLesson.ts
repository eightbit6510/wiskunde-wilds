import type { AdventureManifest, HelpPersonaId } from '../types/content';
import { isClassLevel } from './classLevels';
import part1Manifest from './adventures/part1/manifest.json';
import part2Manifest from './adventures/part2/manifest.json';
import sideManifest from './adventures/side/manifest.json';
import { unwrapJsonModule } from './jsonModule';

const PART1 = unwrapJsonModule(part1Manifest) as AdventureManifest;
const PART2 = unwrapJsonModule(part2Manifest) as AdventureManifest;
const SIDE = unwrapJsonModule(sideManifest) as AdventureManifest;

/** Bepaal welke hulppersona bij een les hoort (via avontuur-manifest). */
export function getHelpPersonaIdForLesson(lessonId: string): HelpPersonaId {
  if (lessonId.includes('-p2-')) {
    return 'uil';
  }
  if (lessonId.includes('-zij-')) {
    return 'uil';
  }
  const levelPrefix = lessonId.split('-l')[0];
  if (isClassLevel(levelPrefix)) {
    return 'uil';
  }
  if ((PART1.lessonIds as readonly string[]).includes(lessonId)) {
    return PART1.helpPersonaId;
  }
  if ((PART2.lessonIds as readonly string[]).includes(lessonId)) {
    return PART2.helpPersonaId;
  }
  if ((SIDE.lessonIds as readonly string[]).includes(lessonId)) {
    return SIDE.helpPersonaId;
  }
  return 'uil';
}
