import { useEffect } from 'react';
import { getChapterPaper, getChapterTexture } from '../assets/chapterArt';

interface ChapterPageBackgroundProps {
  storyLessonId: string;
}

/** Per-hoofdstuk pagina-achtergrond uit 10×10 sample van de prent. */
export function ChapterPageBackground({ storyLessonId }: ChapterPageBackgroundProps) {
  useEffect(() => {
    const texture = getChapterTexture(storyLessonId);
    const paper = getChapterPaper(storyLessonId);
    const body = document.body;

    document.documentElement.style.setProperty('--lesson-page-paper', paper);
    body.style.backgroundColor = paper;

    if (texture) {
      document.documentElement.style.setProperty('--lesson-page-texture', `url(${texture})`);
      body.style.backgroundImage = `url(${texture})`;
      body.style.backgroundSize = '10px 10px';
      body.style.backgroundRepeat = 'repeat';
      body.style.backgroundAttachment = 'fixed';
    } else {
      document.documentElement.style.removeProperty('--lesson-page-texture');
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundAttachment = '';
    }

    return () => {
      document.documentElement.style.removeProperty('--lesson-page-paper');
      document.documentElement.style.removeProperty('--lesson-page-texture');
      body.style.backgroundColor = '';
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundAttachment = '';
    };
  }, [storyLessonId]);

  return null;
}
