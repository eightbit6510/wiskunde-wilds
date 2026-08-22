/**
 * Fase 0 — Default configs (seed data voor Fase 2–4)
 * Nog niet wired in UI; documenteert beslissingen en toekomstige waarden.
 */

import type { AdventureManifest, ClassLevelProfile } from '../types/content';
import { HELP_PERSONAS } from './personas';

export const DEFAULT_HELP_PERSONAS = HELP_PERSONAS;

export const DEFAULT_CLASS_PROFILES: Record<string, ClassLevelProfile> = {
  vwo2: {
    id: 'vwo2',
    label: 'VWO 2',
    maxDifficulty: 2,
    topicsUnlocked: [
      'algebra',
      'vergelijkingen',
      'formules',
      'breuken',
      'grafieken',
      'verbanden',
      'redeneren',
    ],
    reviewRatio: 0.25,
  },
  vwo3: {
    id: 'vwo3',
    label: 'VWO 3',
    maxDifficulty: 3,
    topicsUnlocked: [
      'algebra',
      'vergelijkingen',
      'formules',
      'breuken',
      'machten',
      'grafieken',
      'verbanden',
      'redeneren',
      'kwadratisch',
    ],
    reviewRatio: 0.2,
  },
  'groep-7': {
    id: 'groep-7',
    label: 'Groep 7',
    maxDifficulty: 1,
    topicsUnlocked: ['algebra', 'vergelijkingen', 'breuken', 'grafieken', 'redeneren'],
    reviewRatio: 0.3,
  },
  'groep-8': {
    id: 'groep-8',
    label: 'Groep 8',
    maxDifficulty: 2,
    topicsUnlocked: ['algebra', 'vergelijkingen', 'formules', 'breuken', 'grafieken', 'verbanden'],
    reviewRatio: 0.25,
  },
};

/** Huidige avonturen — mirror van adventureUnlock, wordt centrale bron in Fase 1 */
export const DEFAULT_ADVENTURE_MANIFESTS: AdventureManifest[] = [
  {
    id: 'part1',
    title: 'Wiskunde Wilds',
    subtitle: 'Het Ontwaakte Bos',
    theme: 'day',
    helpPersonaId: 'uil',
    lessonIds: [
      'vossenpad',
      'wolvenkluis',
      'lynx',
      'konijnenhol',
      'uilenlab',
      'bergmissie',
      'maanlicht',
      'sterrentempel',
    ],
    unlockRuleId: 'always',
  },
  {
    id: 'part2',
    title: 'Wiskunde Wilds II',
    subtitle: 'Het Verborgen Gebied',
    theme: 'night',
    helpPersonaId: 'detective',
    lessonIds: [
      'schaduwgrot',
      'ravenpad',
      'rivier',
      'paraboolvallei',
      'observatorium',
      'runenruines',
      'doolhof',
      'nachtmissie',
    ],
    sideMissionIds: ['zij-vossenhol', 'zij-maansteen', 'zij-uilenproef', 'zij-konijnenpad'],
    unlockRuleId: 'part1-complete',
  },
];
