/**
 * Default configs — centrale bron voor avontuur-manifests en jaargroep-profielen.
 */

import type { AdventureManifest } from '../types/content';
import { CLASS_LEVEL_PROFILES } from './classLevels';
import { HELP_PERSONAS } from './personas';

export const DEFAULT_HELP_PERSONAS = HELP_PERSONAS;

/** Alle 18 jaargroep-profielen */
export const DEFAULT_CLASS_PROFILES = CLASS_LEVEL_PROFILES;

/** Legacy bos-avonturen — tests/backup; niet geladen in normale jaargroep-flow */
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
