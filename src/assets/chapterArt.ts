import bergmissie from './chapters/bergmissie.png';
import konijnenhol from './chapters/konijnenhol.png';
import lynxuitkijk from './chapters/lynxuitkijk.png';
import maanlicht from './chapters/maanlicht.png';
import sterrentempel from './chapters/sterrentempel.png';
import uilenlab from './chapters/uilenlab.png';
import vossenpad from './chapters/vossenpad.png';
import wolvenkluis from './chapters/wolvenkluis.png';

/** Illustraties voor de 8 Deel-I missies (via storyLessonId). */
export const CHAPTER_ART: Record<string, string> = {
  vossenpad,
  wolvenkluis,
  lynx: lynxuitkijk,
  konijnenhol,
  uilenlab,
  bergmissie,
  maanlicht,
  sterrentempel,
};

export function getChapterArt(storyLessonId: string): string | undefined {
  return CHAPTER_ART[storyLessonId];
}
