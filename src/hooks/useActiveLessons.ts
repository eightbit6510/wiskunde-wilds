import { useMemo } from 'react';
import {
  getLesson as getLessonForLevel,
  getPlayableLessons,
  getReviewChallengePool,
  getTrainingChallengePool,
} from '../data/lessons';
import { useActiveClassLevel } from '../context/ActiveClassLevelContext';

export function useActiveLessons() {
  const classLevel = useActiveClassLevel();

  return useMemo(
    () => ({
      classLevel,
      lessons: getPlayableLessons(classLevel),
      getLesson: (id: string) => getLessonForLevel(id, classLevel),
      trainingPool: getTrainingChallengePool(classLevel),
      reviewPool: getReviewChallengePool(classLevel),
      hasLevelContent: classLevel !== null && getPlayableLessons(classLevel).length > 0,
    }),
    [classLevel],
  );
}
