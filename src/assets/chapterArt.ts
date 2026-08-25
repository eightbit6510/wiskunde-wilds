import bergmissieTex from './chapter-textures/bergmissie.png';
import doolhofTex from './chapter-textures/doolhof.png';
import konijnenholTex from './chapter-textures/konijnenhol.png';
import lynxTex from './chapter-textures/lynx.png';
import maanlichtTex from './chapter-textures/maanlicht.png';
import nachtmissieTex from './chapter-textures/nachtmissie.png';
import observatoriumTex from './chapter-textures/observatorium.png';
import paraboolvalleiTex from './chapter-textures/paraboolvallei.png';
import ravenpadTex from './chapter-textures/ravenpad.png';
import rivierTex from './chapter-textures/rivier.png';
import runenruinesTex from './chapter-textures/runenruines.png';
import schaduwgrotTex from './chapter-textures/schaduwgrot.png';
import sterrentempelTex from './chapter-textures/sterrentempel.png';
import uilenlabTex from './chapter-textures/uilenlab.png';
import vossenpadTex from './chapter-textures/vossenpad.png';
import wolvenkluisTex from './chapter-textures/wolvenkluis.png';
import bergmissie from './chapters/bergmissie.png';
import doolhof from './chapters/doolhof.png';
import konijnenhol from './chapters/konijnenhol.png';
import lynxuitkijk from './chapters/lynxuitkijk.png';
import maanlicht from './chapters/maanlicht.png';
import nachtmissie from './chapters/nachtmissie.png';
import observatorium from './chapters/observatorium.png';
import paraboolvallei from './chapters/paraboolvallei.png';
import ravenpad from './chapters/ravenpad.png';
import rivier from './chapters/rivier.png';
import runenruines from './chapters/runenruines.png';
import schaduwgrot from './chapters/schaduwgrot.png';
import sterrentempel from './chapters/sterrentempel.png';
import uilenlab from './chapters/uilenlab.png';
import vossenpad from './chapters/vossenpad.png';
import wolvenkluis from './chapters/wolvenkluis.png';

/** Illustraties voor Deel I + II missies (via storyLessonId). */
export const CHAPTER_ART: Record<string, string> = {
  vossenpad,
  wolvenkluis,
  lynx: lynxuitkijk,
  konijnenhol,
  uilenlab,
  bergmissie,
  maanlicht,
  sterrentempel,
  schaduwgrot,
  ravenpad,
  rivier,
  paraboolvallei,
  observatorium,
  runenruines,
  doolhof,
  nachtmissie,
};

/** 10×10 px sample uit linkerbovenhoek — herhaal als pagina-achtergrond. */
export const CHAPTER_TEXTURE: Record<string, string> = {
  vossenpad: vossenpadTex,
  wolvenkluis: wolvenkluisTex,
  lynx: lynxTex,
  konijnenhol: konijnenholTex,
  uilenlab: uilenlabTex,
  bergmissie: bergmissieTex,
  maanlicht: maanlichtTex,
  sterrentempel: sterrentempelTex,
  schaduwgrot: schaduwgrotTex,
  ravenpad: ravenpadTex,
  rivier: rivierTex,
  paraboolvallei: paraboolvalleiTex,
  observatorium: observatoriumTex,
  runenruines: runenruinesTex,
  doolhof: doolhofTex,
  nachtmissie: nachtmissieTex,
};

/** Gemiddelde kleur van het texture-sample — fallback achtergrondkleur. */
export const CHAPTER_PAPER: Record<string, string> = {
  vossenpad: '#f9f3e7',
  wolvenkluis: '#f5ede2',
  lynx: '#f6efe5',
  konijnenhol: '#f8f0e6',
  uilenlab: '#f9f1e6',
  bergmissie: '#f5ede2',
  maanlicht: '#ecdec9',
  sterrentempel: '#ede1cd',
  schaduwgrot: '#bd925a',
  ravenpad: '#f4e5d1',
  rivier: '#f0e0c9',
  paraboolvallei: '#4b5561',
  observatorium: '#bda685',
  runenruines: '#bb9966',
  doolhof: '#cfc1a1',
  nachtmissie: '#d7bea0',
};

export function getChapterArt(storyLessonId: string): string | undefined {
  return CHAPTER_ART[storyLessonId];
}

export function getChapterTexture(storyLessonId: string): string | undefined {
  return CHAPTER_TEXTURE[storyLessonId];
}

export function getChapterPaper(storyLessonId: string): string {
  return CHAPTER_PAPER[storyLessonId] ?? '#f1eadc';
}
