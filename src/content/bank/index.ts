import type { ChallengeDefinition } from '../../types/content';
import { unwrapJsonModule } from '../jsonModule';

const modules = import.meta.glob<{ default: ChallengeDefinition } | ChallengeDefinition>(
  './challenges/*.json',
  { eager: true },
);

function loadBank(): Map<string, ChallengeDefinition> {
  const bank = new Map<string, ChallengeDefinition>();
  for (const mod of Object.values(modules)) {
    const definition = unwrapJsonModule(mod);
    bank.set(definition.id, definition);
  }
  return bank;
}

export const CHALLENGE_BANK = loadBank();

export function getChallengeDefinition(id: string): ChallengeDefinition | undefined {
  return CHALLENGE_BANK.get(id);
}

export function getChallengesByTopic(topic: ChallengeDefinition['topic']): ChallengeDefinition[] {
  return [...CHALLENGE_BANK.values()].filter((c) => c.topic === topic);
}

export function getChallengesByDifficulty(
  difficulty: ChallengeDefinition['difficulty'],
): ChallengeDefinition[] {
  return [...CHALLENGE_BANK.values()].filter((c) => c.difficulty === difficulty);
}
