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

    if (texture) {
      body.style.backgroundColor = paper;
      body.style.backgroundImage = `url(${texture})`;
      body.style.backgroundSize = '10px 10px';
      body.style.backgroundRepeat = 'repeat';
      body.style.backgroundAttachment = 'fixed';
    } else {
      body.style.backgroundColor = '';
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundAttachment = '';
    }

    return () => {
      body.style.backgroundColor = '';
      body.style.backgroundImage = '';
      body.style.backgroundSize = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundAttachment = '';
    };
  }, [storyLessonId]);

  return null;
}
