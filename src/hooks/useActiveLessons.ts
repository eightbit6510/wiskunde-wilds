import { useMemo } from 'react';
import {
  getLesson as getLessonForLevel,
  getPart2LessonsForClassLevel,
  getPlayableLessons,
  getReviewChallengePool,
  getSideMissionsForClassLevel,
  getTrainingChallengePool,
} from '../data/lessons';
import { useActiveClassLevel } from '../context/ActiveClassLevelContext';

export function useActiveLessons() {
  const classLevel = useActiveClassLevel();

  return useMemo(
    () => ({
      classLevel,
      lessons: getPlayableLessons(classLevel),
      part2Lessons: classLevel ? getPart2LessonsForClassLevel(classLevel) : [],
      sideMissions: classLevel ? getSideMissionsForClassLevel(classLevel) : [],
      getLesson: (id: string) => getLessonForLevel(id, classLevel),
      trainingPool: getTrainingChallengePool(classLevel),
      reviewPool: getReviewChallengePool(classLevel),
      hasLevelContent: classLevel !== null && getPlayableLessons(classLevel).length > 0,
    }),
    [classLevel],
  );
}
