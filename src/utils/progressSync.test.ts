import { describe, expect, it } from 'vitest';
import type { Lesson } from '../types';
import { createEmptyProgress } from './storage';
import { isChallengeComplete, isLessonChallengesComplete, reconcileLessonCompletion } from './progressSync';

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
});
