import { getChapterArt } from '../assets/chapterArt';

interface LessonMascotSceneProps {
  storyLessonId: string;
  areaName: string;
  emoji: string;
  color: string;
  storyText?: string | null;
}

/** Chapter illustration with optional story overlay. */
export function LessonMascotScene({
  storyLessonId,
  areaName,
  emoji,
  color,
  storyText,
}: LessonMascotSceneProps) {
  const artSrc = getChapterArt(storyLessonId);

  return (
    <div className="lesson-hero" aria-hidden={storyText ? undefined : true}>
      <div className="lesson-hero__frame">
        {artSrc ? (
          <img
            className="lesson-hero__img"
            src={artSrc}
            alt=""
            width={672}
            height={672}
            draggable={false}
          />
        ) : (
          <div
            className="lesson-hero__fallback"
            style={{ ['--prent-color' as string]: color }}
            title={areaName}
          >
            <span className="lesson-hero__fallback-emoji">{emoji}</span>
            <span className="lesson-hero__fallback-label">{areaName}</span>
          </div>
        )}
        {storyText && <p className="lesson-hero__story">{storyText}</p>}
      </div>
    </div>
  );
}
