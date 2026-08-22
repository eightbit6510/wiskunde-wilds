import { getChapterArt } from '../assets/chapterArt';
import type { MascotMood } from './ForestMascot';
import { ForestMascot } from './ForestMascot';

interface LessonMascotSceneProps {
  storyLessonId: string;
  areaName: string;
  emoji: string;
  color: string;
  mood: MascotMood;
  storyText?: string | null;
  size?: number;
  animationsEnabled?: boolean;
}

/** Chapter illustration with optional story overlay and fox on the top-right. */
export function LessonMascotScene({
  storyLessonId,
  areaName,
  emoji,
  color,
  mood,
  storyText,
  size = 18,
  animationsEnabled = true,
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
        <div className={`lesson-hero__fox${animationsEnabled ? ' mascot-float' : ''}`}>
          <ForestMascot mood={mood} size={size} />
        </div>
      </div>
    </div>
  );
}
