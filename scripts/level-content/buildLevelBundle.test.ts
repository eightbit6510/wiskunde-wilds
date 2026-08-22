import { describe, expect, it } from 'vitest';
import type { ChallengeDefinition } from '../../src/types/content';
import { buildAllLevelBundles } from './buildLevelBundle';

function challengeQuestionKey(challenge: ChallengeDefinition): string {
  const optionsKey = challenge.answerOptions?.map((option) => option.label).join('|') ?? '';
  if (challenge.type === 'multi-select') {
    return `${challenge.topic}|${challenge.question}|${(challenge.answers ?? []).join(',')}|${optionsKey}`;
  }
  if (challenge.type === 'multiple-choice') {
    return `${challenge.topic}|${challenge.question}|${challenge.answer}|${optionsKey}`;
  }
  return `${challenge.topic}|${challenge.question}|${JSON.stringify(challenge.answer)}`;
}

describe('buildLevelBundle', () => {
  it('generates unique questions within each level', () => {
    for (const bundle of buildAllLevelBundles()) {
      const seen = new Set<string>();
      for (const challenge of bundle.challenges) {
        const key = challengeQuestionKey(challenge);
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it('avoids repeated kwadratisch and machten in vwo-6 opening chapters', () => {
    const bundle = buildAllLevelBundles().find((item) => item.level === 'vwo-6');
    expect(bundle).toBeDefined();
    const firstTen = bundle!.challenges.slice(0, 10);
    const questions = firstTen.map((challenge) => challenge.question);
    expect(new Set(questions).size).toBe(questions.length);
  });
});
