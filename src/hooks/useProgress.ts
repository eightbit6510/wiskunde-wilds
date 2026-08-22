import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChallengeAttempt, ProgressState, Topic } from '../types';
import { badges } from '../data/badges';
import type { ClassLevel } from '../types/content';
import { getAllLessonsForClassLevel, getLesson, getPlayableLessons, legacyAllLessons } from '../data/lessons';
import {
  STORAGE_KEYS,
  createEmptyProgress,
  loadProgress,
  resetProgressStorage,
  saveJson,
} from '../utils/storage';
import { starsForAttempt } from '../utils/answers';
import {
  OWL_BONUS_XP,
  OWL_HELP_STARS_EARNED,
  computeChallengeXp,
  trySpendOwlStar,
} from '../utils/owlEconomy';
import { isPart1Complete } from '../utils/adventureUnlock';
import { isSterrentempelLesson } from '../content/storyBridge';
import { XP } from '../utils/xpConfig';
import { migrateProgress } from '../utils/progressMigration';
import { reconcileLessonCompletion } from '../utils/progressSync';

function unlockBadges(next: ProgressState): ProgressState {
  const unlocked = badges
    .filter((b) => b.check(next) && !next.unlockedBadges.includes(b.id))
    .map((b) => b.id);
  if (!unlocked.length) return next;
  return { ...next, unlockedBadges: [...next.unlockedBadges, ...unlocked] };
}

export function useProgress(classLevel: ClassLevel | null) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const owlSpendLock = useRef(false);
  const playableLessons = useMemo(() => getPlayableLessons(classLevel), [classLevel]);
  const lessonsForReconcile = useMemo(
    () => (classLevel ? getAllLessonsForClassLevel(classLevel) : legacyAllLessons),
    [classLevel],
  );
  const resolveLesson = useCallback(
    (lessonId: string) => getLesson(lessonId, classLevel),
    [classLevel],
  );

  useEffect(() => {
    setProgress((p) => reconcileLessonCompletion(p, lessonsForReconcile));
  }, [lessonsForReconcile]);

  useEffect(() => {
    saveJson(STORAGE_KEYS.progress, progress);
  }, [progress]);

  const startAdventure = useCallback(() => {
    setProgress((p) => ({
      ...p,
      adventureStarted: true,
      lastPlayedAt: new Date().toISOString(),
    }));
  }, []);

  const recordWrongAttempt = useCallback((topic: Topic) => {
    setProgress((p) => ({
      ...p,
      topicStats: {
        ...p.topicStats,
        [topic]: {
          ...p.topicStats[topic],
          tried: p.topicStats[topic].tried + 1,
          wrongAttempts: p.topicStats[topic].wrongAttempts + 1,
        },
      },
      sessionStreak: 0,
      recentFailStreak: p.recentFailStreak + 1,
      preferSuccessMoment: p.recentFailStreak + 1 >= 2,
    }));
  }, []);

  const confirmOwlHelp = useCallback((challengeId: string): boolean => {
    if (owlSpendLock.current) return false;
    owlSpendLock.current = true;

    let spent = false;
    setProgress((p) => {
      const result = trySpendOwlStar(
        {
          totalStars: p.totalStars,
          owlStarsSpent: p.owlStarsSpent,
          owlHelpUsedCount: p.owlHelpUsedCount,
          owlHelpChallenges: p.owlHelpChallenges,
        },
        challengeId,
        false,
      );
      if (!result.ok) return p;
      spent = true;
      return {
        ...p,
        totalStars: result.next.totalStars,
        owlStarsSpent: result.next.owlStarsSpent,
        owlHelpUsedCount: result.next.owlHelpUsedCount,
        owlHelpChallenges: result.next.owlHelpChallenges,
        guidedStarsSpent: result.next.owlStarsSpent,
        guidedHelpUsedCount: result.next.owlHelpUsedCount,
        guidedHelpChallenges: result.next.owlHelpChallenges,
        preferSuccessMoment: true,
        lastPlayedAt: new Date().toISOString(),
      };
    });

    queueMicrotask(() => {
      owlSpendLock.current = false;
    });

    return spent;
  }, []);

  const completeChallenge = useCallback(
    (input: {
      challengeId: string;
      lessonId: string;
      topic: Topic;
      attempts: number;
      usedHint: boolean;
      usedFirstStep: boolean;
      usedOwlHelp?: boolean;
      reviewOfPart1?: boolean;
      xpReward?: number;
    }) => {
      const usedOwl = !!input.usedOwlHelp;
      const stars = usedOwl
        ? OWL_HELP_STARS_EARNED
        : starsForAttempt(input.attempts, input.usedFirstStep);

      setProgress((p) => {
        const alreadyDone = p.completedChallenges.includes(input.challengeId);
        const previousStars = p.challengeStars[input.challengeId] ?? 0;
        const starsDelta = Math.max(0, stars - previousStars);

        let xpGain = computeChallengeXp(stars, !alreadyDone, usedOwl);
        if (!alreadyDone && input.xpReward && !usedOwl) {
          xpGain = input.xpReward;
        } else if (!alreadyDone && input.xpReward && usedOwl) {
          xpGain = Math.max(1, Math.round(input.xpReward * 0.5));
        }

        const topic = p.topicStats[input.topic];
        const nextTopic = {
          ...topic,
          tried: topic.tried + (alreadyDone ? 0 : 1),
          firstTryCorrect:
            topic.firstTryCorrect +
            (!alreadyDone && input.attempts === 1 && !input.usedHint && !usedOwl ? 1 : 0),
          withHintCorrect:
            topic.withHintCorrect +
            (!alreadyDone && (input.usedHint || input.usedFirstStep || usedOwl) ? 1 : 0),
        };

        const nextCompleted = alreadyDone
          ? p.completedChallenges
          : [...p.completedChallenges, input.challengeId];

        const lesson = resolveLesson(input.lessonId);
        const lessonDone =
          !!lesson && lesson.challenges.every((c) => nextCompleted.includes(c.id));

        let nextLessons = p.completedLessons;
        let starBonus = 0;
        if (lessonDone && !p.completedLessons.includes(input.lessonId)) {
          nextLessons = [...p.completedLessons, input.lessonId];
          starBonus = XP.chapterCompleteStars;
        }

        let sideMissionsCompleted = p.sideMissionsCompleted;
        if (
          lessonDone &&
          lesson?.adventureId === 'side' &&
          !sideMissionsCompleted.includes(input.lessonId)
        ) {
          sideMissionsCompleted = [...sideMissionsCompleted, input.lessonId];
        }

        const sessionStreak = usedOwl ? p.sessionStreak : p.sessionStreak + 1;
        const streakStar =
          !usedOwl && sessionStreak > 0 && sessionStreak % 5 === 0 ? XP.streakStars : 0;

        const attempt: ChallengeAttempt = {
          ...input,
          usedOwlHelp: usedOwl,
          correct: true,
          starsEarned: stars,
          xpEarned: xpGain,
          completedAt: new Date().toISOString(),
        };

        const maybeUnlockedPart2 =
          p.part2Unlocked ||
          isPart1Complete({ completedLessons: nextLessons }) ||
          (!!lesson && isSterrentempelLesson(lesson) && lessonDone);

        let next: ProgressState = {
          ...p,
          adventureStarted: true,
          completedChallenges: nextCompleted,
          completedLessons: nextLessons,
          challengeStars: {
            ...p.challengeStars,
            [input.challengeId]: Math.max(previousStars, stars),
          },
          attempts: [...p.attempts, attempt],
          topicStats: { ...p.topicStats, [input.topic]: nextTopic },
          totalStars: p.totalStars + starsDelta + starBonus + streakStar,
          totalXp: p.totalXp + xpGain,
          challengesSolved: alreadyDone ? p.challengesSolved : p.challengesSolved + 1,
          sessionStreak,
          bestSessionStreak: Math.max(p.bestSessionStreak, sessionStreak),
          lastPlayedAt: new Date().toISOString(),
          reviewSolvedCount:
            p.reviewSolvedCount + (!alreadyDone && input.reviewOfPart1 ? 1 : 0),
          recentFailStreak: 0,
          preferSuccessMoment: usedOwl,
          part2Unlocked: maybeUnlockedPart2,
          sideMissionsCompleted,
        };

        if (!usedOwl && !input.reviewOfPart1) {
          next = { ...next, preferSuccessMoment: false };
        }

        return unlockBadges(migrateProgress(next));
      });

      return stars;
    },
    [resolveLesson],
  );

  const finalizeLesson = useCallback((lessonId: string): boolean => {
    const lesson = resolveLesson(lessonId);
    if (!lesson) return false;
    let didFinalize = false;

    setProgress((p) => {
      const allDone = lesson.challenges.every((c) => p.completedChallenges.includes(c.id));
      if (!allDone) return p;

      let next: ProgressState = p;
      if (!p.completedLessons.includes(lessonId)) {
        didFinalize = true;
        const nextLessons = [...p.completedLessons, lessonId];
        next = {
          ...p,
          completedLessons: nextLessons,
          totalStars: p.totalStars + XP.chapterCompleteStars,
          part2Unlocked:
            p.part2Unlocked ||
            isPart1Complete({ completedLessons: nextLessons }) ||
            (!!lesson && isSterrentempelLesson(lesson)),
          lastPlayedAt: new Date().toISOString(),
        };
      } else if (!p.part2Unlocked && isPart1Complete(p)) {
        didFinalize = true;
        next = { ...p, part2Unlocked: true, lastPlayedAt: new Date().toISOString() };
      }

      return unlockBadges(reconcileLessonCompletion(next));
    });

    return didFinalize;
  }, [resolveLesson]);

  const markPart2UnlockSeen = useCallback(() => {
    setProgress((p) => ({ ...p, part2UnlockSeen: true, part2Unlocked: true }));
  }, []);

  const unlockPart2 = useCallback(() => {
    setProgress((p) => ({ ...p, part2Unlocked: true }));
  }, []);

  const startOwlBonus = useCallback(() => {
    setProgress((p) => ({
      ...p,
      owlBonusTried: p.owlBonusTried + 1,
      guidedBonusTried: p.guidedBonusTried + 1,
      lastPlayedAt: new Date().toISOString(),
    }));
  }, []);

  const completeOwlBonus = useCallback(() => {
    setProgress((p) => {
      const next: ProgressState = {
        ...p,
        owlBonusSolved: p.owlBonusSolved + 1,
        guidedBonusSolved: p.guidedBonusSolved + 1,
        totalXp: p.totalXp + OWL_BONUS_XP,
        totalStars: p.totalStars + XP.bonusSolveStars,
        lastPlayedAt: new Date().toISOString(),
      };
      return unlockBadges(next);
    });
    return OWL_BONUS_XP;
  }, []);

  const completeTrainingSession = useCallback((xp: number = XP.trainingSession) => {
    setProgress((p) => ({
      ...p,
      trainingSessionsDone: p.trainingSessionsDone + 1,
      totalXp: p.totalXp + xp,
      lastPlayedAt: new Date().toISOString(),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    resetProgressStorage();
    owlSpendLock.current = false;
    setProgress(createEmptyProgress());
  }, []);

  const applyProgress = useCallback((next: ProgressState) => {
    owlSpendLock.current = false;
    setProgress(unlockBadges(reconcileLessonCompletion(migrateProgress(next), lessonsForReconcile)));
  }, [lessonsForReconcile]);

  const lessonProgress = useMemo(() => {
    return playableLessons.map((lesson) => {
      const done = lesson.challenges.filter((c) =>
        progress.completedChallenges.includes(c.id),
      ).length;
      const stars = lesson.challenges.reduce(
        (sum, c) => sum + (progress.challengeStars[c.id] ?? 0),
        0,
      );
      return {
        lessonId: lesson.id,
        done,
        total: lesson.challenges.length,
        stars,
        completed:
          progress.completedLessons.includes(lesson.id) || done >= lesson.challenges.length,
      };
    });
  }, [progress, playableLessons]);

  return {
    progress,
    startAdventure,
    recordWrongAttempt,
    completeChallenge,
    finalizeLesson,
    confirmOwlHelp,
    startOwlBonus,
    completeOwlBonus,
    markPart2UnlockSeen,
    unlockPart2,
    completeTrainingSession,
    resetProgress,
    applyProgress,
    lessonProgress,
  };
}

export type ProgressApi = ReturnType<typeof useProgress>;
