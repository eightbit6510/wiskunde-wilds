import { getChapterArt } from '../assets/chapterArt';
import type { MascotMood } from './ForestMascot';
import { ForestMascot } from './ForestMascot';

interface LessonMascotSceneProps {
  storyLessonId: string;
  areaName: string;
  emoji: string;
  color: string;
  mood: MascotMood;
  size?: number;
  animationsEnabled?: boolean;
}

/** Chapter illustration with fox bobbing over the top-right corner. */
export function LessonMascotScene({
  storyLessonId,
  areaName,
  emoji,
  color,
  mood,
  size = 56,
  animationsEnabled = true,
}: LessonMascotSceneProps) {
  const artSrc = getChapterArt(storyLessonId);

  return (
    <div className="lesson-mascot-scene" aria-hidden="true">
      <div className="chapter-prent-frame">
        {artSrc ? (
          <img
            className="chapter-prent-img"
            src={artSrc}
            alt=""
            width={336}
            height={336}
            draggable={false}
          />
        ) : (
          <div
            className="chapter-prent chapter-prent--fallback"
            style={{ ['--prent-color' as string]: color }}
            title={areaName}
          >
            <span className="chapter-prent-emoji">{emoji}</span>
            <span className="chapter-prent-label">{areaName}</span>
          </div>
        )}
        <div className={`lesson-mascot-fox${animationsEnabled ? ' mascot-float' : ''}`}>
          <ForestMascot mood={mood} size={size} />
        </div>
      </div>
    </div>
  );
}
