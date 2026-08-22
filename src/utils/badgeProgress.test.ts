import { describe, expect, it } from 'vitest';
import { createEmptyProgress } from './storage';
import {
  allPart2StoriesComplete,
  isStoryLessonComplete,
  starsInPart1StoryLesson,
} from './badgeProgress';

describe('badgeProgress', () => {
  it('accepts legacy and jaargroep lesson ids for part1', () => {
    expect(
      isStoryLessonComplete(
        { completedLessons: ['vossenpad'] },
        'vossenpad',
      ),
    ).toBe(true);
    expect(
      isStoryLessonComplete(
        { completedLessons: ['groep-8-l1'] },
        'vossenpad',
      ),
    ).toBe(true);
    expect(
      isStoryLessonComplete(
        { completedLessons: ['groep-8-l2'] },
        'vossenpad',
      ),
    ).toBe(false);
  });

  it('accepts jaargroep part2 lesson ids', () => {
    expect(
      isStoryLessonComplete(
        { completedLessons: ['vwo-6-p2-l3'] },
        'rivier',
        'part2',
      ),
    ).toBe(true);
  });

  it('counts stars from jaargroep challenge ids', () => {
    const progress = {
      ...createEmptyProgress(),
      challengeStars: {
        'groep-8-c01': 2,
        'groep-8-c02': 3,
        'groep-8-c03': 2,
        'groep-8-c04': 2,
        'groep-8-c05': 2,
      },
    };
    expect(starsInPart1StoryLesson(progress, 'vossenpad')).toBe(11);
  });

  it('detects all part2 stories complete via jaargroep ids', () => {
    const completedLessons = [
      'havo-3-p2-l1',
      'havo-3-p2-l2',
      'havo-3-p2-l3',
      'havo-3-p2-l4',
      'havo-3-p2-l5',
      'havo-3-p2-l6',
      'havo-3-p2-l7',
      'havo-3-p2-l8',
    ];
    expect(allPart2StoriesComplete({ completedLessons })).toBe(true);
  });
});
