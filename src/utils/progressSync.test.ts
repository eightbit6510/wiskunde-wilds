import { describe, expect, it } from 'vitest';
import { getAllLessonsForClassLevel, getPart2LessonsForClassLevel } from '../data/lessons';
import type { Lesson } from '../types';
import { createEmptyProgress } from './storage';
import {
  buildLessonProgress,
  isChallengeComplete,
  isLessonChallengesComplete,
  reconcileLessonCompletion,
} from './progressSync';

const miniLesson: Lesson = {
  id: 'test-l1',
  order: 1,
  areaName: 'Test',
  title: 'Test',
  emoji: '🧪',
  intro: '',
  color: '#000',
  challenges: [
    { id: 'c1', type: 'number-input', topic: 'algebra', difficulty: 1, question: 'Q1', answer: 1, hint1: 'h', explanation: 'e' },
    { id: 'c2', type: 'number-input', topic: 'algebra', difficulty: 1, question: 'Q2', answer: 2, hint1: 'h', explanation: 'e' },
  ],
};

describe('progressSync helpers', () => {
  it('treats pending ids as complete before progress state catches up', () => {
    const progress = createEmptyProgress();
    expect(isChallengeComplete(progress, 'c1', ['c1'])).toBe(true);
    expect(isLessonChallengesComplete(miniLesson, progress, ['c1', 'c2'])).toBe(true);
  });

  it('reconciles lesson completion for non-part1 lessons from attempts', () => {
    const progress = {
      ...createEmptyProgress(),
      completedChallenges: ['c1', 'c2'],
      attempts: [
        {
          challengeId: 'c1',
          lessonId: 'test-l1',
          topic: 'algebra' as const,
          attempts: 1,
          usedHint: false,
          usedFirstStep: false,
          correct: true,
          starsEarned: 3,
          xpEarned: 10,
          completedAt: new Date().toISOString(),
        },
      ],
    };

    const synced = reconcileLessonCompletion(progress, [miniLesson]);
    expect(synced.completedLessons).toContain('test-l1');
  });

  it('builds Deel II lesson progress from jaargroep challenge ids', () => {
    const part2 = getPart2LessonsForClassLevel('groep-8');
    const first = part2[0];
    const progress = {
      ...createEmptyProgress(),
      completedChallenges: first.challenges.map((c) => c.id),
      completedLessons: [first.id],
    };

    const entries = buildLessonProgress(progress, getAllLessonsForClassLevel('groep-8'));
    const entry = entries.find((e) => e.lessonId === first.id);

    expect(entry).toEqual({
      lessonId: first.id,
      done: first.challenges.length,
      total: first.challenges.length,
      stars: 0,
      completed: true,
    });
  });

  it('maps legacy Deel II story completion onto jaargroep slots', () => {
    const part2 = getPart2LessonsForClassLevel('groep-8');
    const first = part2[0];
    const progress = {
      ...createEmptyProgress(),
      completedLessons: ['schaduwgrot'],
    };

    const entry = buildLessonProgress(progress, [first]).find((e) => e.lessonId === first.id);
    expect(entry?.completed).toBe(true);
    expect(entry?.done).toBe(first.challenges.length);
  });
});
