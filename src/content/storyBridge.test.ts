import { describe, expect, it } from 'vitest';
import { PART2_STORY_IDS } from './storyShells';
import { loadBridgedLesson, loadPart2LessonsForClassLevel } from './storyBridge';

describe('loadBridgedLesson', () => {
  it('maps Deel II jaargroep lessons to Deel II story ids for chapter art', () => {
    const part2 = loadPart2LessonsForClassLevel('groep-8');
    expect(part2).toHaveLength(8);
    expect(part2[0].storyLessonId).toBe(PART2_STORY_IDS[0]);

    const bridged = loadBridgedLesson('groep-8-p2-l1', 'groep-8');
    expect(bridged?.storyLessonId).toBe('schaduwgrot');
    expect(bridged?.storyArc).toBe('part2');
    expect(bridged?.storyLessonId).not.toBe('vossenpad');
  });

  it('still maps Deel I lessons to bos story ids', () => {
    const bridged = loadBridgedLesson('groep-8-l1', 'groep-8');
    expect(bridged?.storyLessonId).toBe('vossenpad');
    expect(bridged?.storyArc).toBe('part1');
  });
});
